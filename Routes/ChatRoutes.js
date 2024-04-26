const {sendMessage, getMessages, getAllCustomers, getCustomerById} = require("../Controllers/ChatController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")

const express = require("express")
const router = express.Router();

router.get("/getAllCusts", AuthenticateUser, getAllCustomers)
router.get("/getCustomerById/:id", AuthenticateUser, getCustomerById)
router.post("/sendMessage/:id", AuthenticateUser, sendMessage)
router.get("/getMessages/:id", AuthenticateUser, getMessages)

module.exports = router;
