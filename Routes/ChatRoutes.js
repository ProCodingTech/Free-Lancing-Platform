const {sendMessage} = require("../Controllers/ChatController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")

const express = require("express")
const router = express.Router();

router.post("/sendMessage/:receiverId", AuthenticateUser, sendMessage)

module.exports = router;