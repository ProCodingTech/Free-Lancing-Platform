const Seller = require("../Models/Seller.schema")

const getNotifications = async (req, res) => {
    try {
        const userId = res.locals.userId;

        const user = await Seller.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Seller Not Found.' });
        }

        const notifications = user.Notifications.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({ notifications });
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
};

module.exports = {
    getNotifications
}