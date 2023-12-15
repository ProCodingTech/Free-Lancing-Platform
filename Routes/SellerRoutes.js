const {createSeller, Login, searchUser, getSellerById, getMyProfile, updateProfile} = require("../Controllers/SellerController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")
const express = require("express");

const router = express.Router();
router.post("/createSeller" , createSeller)
router.post("/login" , Login)
router.get("/searchUser", AuthenticateUser , searchUser)
router.get("/getSellerById/:id", AuthenticateUser , getSellerById)
router.get("/getMyProfile", AuthenticateUser , getMyProfile)
router.patch("/updateProfile", AuthenticateUser , updateProfile)

module.exports = router;