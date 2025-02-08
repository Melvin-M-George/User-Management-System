const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    return res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {

    const {email, mno} = req.body;


    const existingUser = await User.findOne({ $or: [{ email }, { mobile: mno }] });
        if (existingUser) {
            return res.render("registration", { error_message: "Email or mobile number already in use"});
        }
    const spassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email,
      mobile:mno,
      image: req.file ? req.file.filename : null,
      password: spassword,
      is_admin: 0,
    });

    const userData = await user.save();

    if (userData) {
      return res.render("registration", {
        message: "Your registration is successfull!",
      });
    } else {
      return res.render("registration", { message: "Your registration failed!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login user methods

const loginLoad = async (req, res) => {
  try {
    return res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });

    if (userData) {
      if(userData.is_admin == 0){
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
           
            req.session.user_id = userData._id;
            return res.redirect("/home");
    
        } else {
          return res.render("login", {
            message: "Email and Password are incorrect!...",
          });
        }
      }else {
        return res.render("login", { message: "Email and Password are incorrect!..." });
      }
      
    } else {
      return res.render("login", { message: "Email and Password are incorrect!..." });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadHome = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    return res.render("home", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    return res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

//user profile edit and update
const editLoad = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await User.findById({ _id: id });

    if (userData) {
       return res.render("edit", { user: userData });
    } else {
      return res.redirect("/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    if (req.file) {
      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
          },
        }
      );
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
          },
        }
      );
    }

    return res.redirect("/home");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  editLoad,
  updateProfile,
};
