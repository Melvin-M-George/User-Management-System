const express = require("express");
const user_route = express();

const session = require("express-session");

const config = require("../config/config");
user_route.use(session({ secret: config.sessionSecret,resave:false,saveUninitialized:true }));

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController");

user_route.get("/register", auth.isLogout, userController.loadRegister);

user_route.post("/register", upload.single("image"), userController.insertUser);

user_route.get("/", auth.isLogout, userController.loginLoad);
user_route.post("/", userController.verifyLogin); 
user_route.get("/login", auth.isLogout, userController.loginLoad);

user_route.post("/login", userController.verifyLogin);

user_route.get("/home", adminAuth.isUser,auth.isLogin, userController.loadHome);

user_route.get("/logout", auth.isLogin, userController.userLogout);

user_route.get("/edit", adminAuth.isUser,auth.isLogin, userController.editLoad);

user_route.post("/edit", upload.single("image"), userController.updateProfile);

module.exports = user_route;
