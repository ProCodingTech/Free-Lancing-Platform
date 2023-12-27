const Chat = require('../Models/SellerChat.schema');
const Customers = require("../Models/Customer.schema")

const sendMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const { sndMessage } = req.body;

        let userId = res.locals.userId;
        let FullName = res.locals.name;

        const chatMessage = new Chat({
            senderId: userId,
            senderName: FullName, 
            receiverId: receiverId,
            message: sndMessage,
        });

        await chatMessage.save();

        res.status(201).json({Message: 'message deliver'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getMessages = async (req, res) => {
    try {
      const receiverId  = req.params.id;
    //   console.log("Receiver ID:", receiverId);

        let userId = res.locals.userId;
        let FullName = res.locals.name;
  
      const chatHistory = await Chat.find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      }).select('senderName message createdAt -_id') // Exclude _id field
        .sort({ createdAt: 1 }); // Sorting by creation time
    //   console.log("Messages ",chatHistory);
      res.status(200).json(chatHistory);
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
};

const getAllCustomers = async (req, res)=>{
    try{
        let allCust = await Customers.find({});
        // console.log("Custs:",allCust);

        if (allCust.length > 0) {
            res.status(200).json({ Customers: allCust });
        } else {
            res.status(404).json({ Message: "No customers found." });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ Message: 'Server error' });
    }
}

const getCustomerById = async(req, res) => {
    let id = req.params.id;

    try{
        let findCust = await Customers.findById(id);
        // console.log(findCust);
        if(findCust){
            res.status(200).json({Customer : findCust})
        }
        else{
            res.status(404).json({Message:"Customer not Found."})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ Message: 'Server error' });
    }
}

module.exports = {
    sendMessage,
    getMessages,
    getAllCustomers,
    getCustomerById
};