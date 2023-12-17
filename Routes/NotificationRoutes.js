const {getNotifications} = require("../Controllers/NotificationController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")

const express = require("express")
const router = express.Router();

router.get("/notifications", AuthenticateUser, getNotifications);

module.exports = router;