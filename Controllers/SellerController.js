const mongoSeller = require ("../Models/Seller.schema")
const mongoProjects = require("../Models/SellerProjects.schema")
const jwt = require ("jsonwebtoken")

const createSeller = async (req, res) => {
    try{
        let { Email } = req.body;
        let seller = await mongoSeller.findOne({ Email })

        if (seller){
            // console.log(seller);
            return res.status(400).json({Message : "User Already Exists. Try with another Email."})
        }
        else{
            let data = req.body;
            let newSeller = await mongoSeller.create(data);
            res.status(201).json(newSeller);
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const Login = async (req, res) => {
    let {Email,Password}  = req.body;
    // console.log("Body:",req.body);
    try{
        // console.log("Email:",Email);
        // console.log("Password:",Password);
        let seller = await mongoSeller.findOne({Email});
        // console.log("Seller:",seller);
        if(seller){
            if(Password === seller.Password){
                let Blocked = seller.Blocked;
                let Reason = seller.Reason;
                if(!Blocked){
                    let id = seller._id;
                    let name = seller.FullName;
                    let role = seller.Role;

                    let token = await jwt.sign({id, name, role}, process.env.SECRET_KEY, {expiresIn : '600h'});

                    res.status(200).json({Success : 'true', "User Id" : id, token});
                }
                else{
                    res.status(400).json({Message : "You are Blocked By Admin.",Reason : Reason})
                }
            }
            else{
                res.status(400).json({Message : "Invalid Password"})
            }
        }
        else{
            res.status(404).json({Message : "User Not Found or Invalid Email."})
        }
    }
    catch(error){
        console.log(error);
    }

}

const searchUser = async (req, res) => {
    try {
        let { FullName } = req.query;
        let searchUsers = await mongoSeller.find({ FullName: { $regex: new RegExp(FullName, "i") } });

        if (searchUsers.length > 0) {
            const users = searchUsers.map((user) => {
                let Id = user._id;
                let name = user.FullName;
                let mail = user.Email;
                let contact = user.Contact;
                let rating = user.TotalRating;
                let experience = user.Experience;
                let specialities = user.Specialities.map((speciality) => speciality);
                return { Id, Name: name, Email: mail, Contact: contact, Rating: rating, Experience: experience, Specialities: specialities };
            });

            res.status(200).json(users);
        }
        else {
            res.status(404).json("Users Not Found.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error.");
    }
};

const getSellerById = async (req, res) => {
    try{
        let id = req.params.id;
        
        let findSeller = await mongoSeller.findById(id);
        if (findSeller){
            let name = findSeller.FullName;
            let mail = findSeller.Email;
            let contact = findSeller.Contact;
            let rating = findSeller.TotalRating;
            let expierence = findSeller.Experience;
            let specialities = findSeller.Specialities.map(speciality => speciality);
            res.status(200).json({Name: name,Email: mail ,Contact: contact, Rating: rating, Experience: expierence, Specialities: specialities});

        }
        else{
            res.status(404).json({Message : "User Not Found."})
        }
    }
    catch(error){
        console.log(error);
    }
}

const getUserProjects = async (req, res)=>{
    try{
        let id = req.params.id;
        // console.log("user id", id);
        let projFound = await mongoProjects.find({ sellerId : id });
        // console.log("prjs ",projFound);
        if (projFound.length > 0) {
            res.status(200).json({ projects: projFound });
        }
        else {
            res.status(404).json({ message: 'No projects found for that user.' });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json("Server Error.")
    }
}

const getMyProfile = async (req, res) => {
    try{
        let userId = res.locals.userId;

        let findMe = await mongoSeller.findById({_id: userId})
        if(findMe){
            res.status(200).json(findMe);
        }
        else{
            res.status(404).json("Token or Database Error.");
        }
    }
    catch(error){
        console.log(error);
    }
}

const updateProfile = async (req, res) => {
    try{
        let userId = res.locals.userId;
        // console.log("Id: ",userId);
        let data = req.body;

        let updated = await mongoSeller.findByIdAndUpdate(userId, data);
        // console.log("User Info: ",updated);
        if(updated){
            res.status(200).json({Message:"User Updated Successfully.",updated});
        }
        else{
            res.status(404).json("Token or Database Error.");
        }
    }
    catch(error){
        console.log(error);
    }
}

const deleteMyAccount =  async (req, res) =>{
    try{
        let userId = res.locals.userId;
        // console.log("USer Id: ",userId);

        let delUser = await mongoSeller.findByIdAndDelete(userId);
        // console.log("User: ",delUser);
        if(delUser){
            let name = delUser.FullName;
            res.status(200).json({"User: ": name , "Deleted Staus: " : true})
        }
        else{
            res.status(404).json({"Message":"Error! Deleting User."})
        }
    }
    catch(error){
        console.log(error);
    }
}

const checkBalance = async (req, res) => {
    const userId = res.locals.userId;
    const userName = res.locals.name;

    try {
        const seller = await mongoSeller.findById(userId);

        if (!seller) {
            return res.status(404).json({ message: 'Seller Not Found.' });
        }
        const accountBalance = seller.AccountBalance;

        res.status(200).json({userName, userId, AccountBalance: accountBalance });
    } catch (error) {
        console.error(error);
    }
};

const withdrawAmount = async (req, res) => {
    const userId = res.locals.userId;
    const userName = res.locals.name;

    let { withdrawAmnt } = req.body;

    try {
        const seller = await mongoSeller.findById(userId);

        if (!seller) {
            return res.status(404).json({ Message: 'Seller Not Found.' });
        }

        let accountBalance = seller.AccountBalance;

        if (accountBalance < withdrawAmnt) {
            return res.status(400).json({ Message: 'Not Enough money to withdraw.' });
        }

        accountBalance -= withdrawAmnt;

        const updatedSeller = await mongoSeller.findByIdAndUpdate(userId, {
            $set: { AccountBalance: accountBalance },
            $push: {
                Notifications: {
                    message: `Amount of ${withdrawAmnt} PKR withdrawn from your account.`,
                    createdAt: new Date()
                }
            }
        }, { new: true });

        res.status(200).json({ userName, userId, AccountBalance: updatedSeller.AccountBalance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while withdrawing amount.' });
    }
};


module.exports = {
    createSeller,
    Login,
    searchUser,
    getSellerById,
    getMyProfile,
    updateProfile,
    deleteMyAccount,
    checkBalance,
    withdrawAmount,
    getUserProjects
}