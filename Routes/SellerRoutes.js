const {createSeller, Login, searchUser, getSellerById, getMyProfile, updateProfile, deleteMyAccount, checkBalance, withdrawAmount, getUserProjects} = require("../Controllers/SellerController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")
const express = require("express");

const router = express.Router();
router.post("/createSeller" , createSeller)
router.post("/login" , Login)
router.get("/searchUser", AuthenticateUser , searchUser)
router.get("/getSellerById/:id", AuthenticateUser , getSellerById)
router.get("/getSellerProjects/:id", AuthenticateUser , getUserProjects)
router.get("/getMyProfile", AuthenticateUser , getMyProfile)
router.patch("/updateProfile", AuthenticateUser , updateProfile)
router.put("/withdrawAmount", AuthenticateUser , withdrawAmount)
router.delete("/deleteMyAccount", AuthenticateUser , deleteMyAccount)
router.get("/checkBalance", AuthenticateUser , checkBalance)

module.exports = router;