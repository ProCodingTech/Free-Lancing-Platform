const {createProject} = require("../Controllers/SellerProjectsController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")

const express = require("express")
const router = express.Router();

router.post("/createProject", AuthenticateUser, createProject);


module.exports = router;