const mongoSeller = require ("../Models/Seller.schema")
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
    try{
        let { Email, Password } = req.body;
        // console.log("Email: ",Email);
        // console.log("Password: ",Password);
        let seller = await mongoSeller.findOne({Email});
        if(seller){
            if(Password === seller.Password){
                let id = seller._id;
                let name = seller.FullName;
                let role = seller.Role;

                let token = await jwt.sign({id, name, role}, process.env.SECRET_KEY, {expiresIn : '600h'});

                res.status(200).json({Success : 'true', "User Id" : id, token});
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
    try{
        let {FullName} = req.query;
        // console.log("Name: ", FullName);
        let searchUser = await mongoSeller.findOne({ FullName: { $regex: new RegExp(FullName, "i") } });
        // console.log("User Info: ",searchUser);
        if(searchUser){
            let name = searchUser.FullName;
            let mail = searchUser.Email;
            let contact = searchUser.Contact;
            let rating = searchUser.TotalRating;
            let expierence = searchUser.Experience;
            let specialities = searchUser.Specialities.map(speciality => speciality);
            res.status(200).json({Name: name,Email: mail ,Contact: contact, Rating: rating, Experience: expierence, Specialities: specialities})
        }
        else{
            res.status(404).json("User Not Found.");
        }
    }
    catch(error){
        console.log(error);
    }
}

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
            res.status(200).json(updated);
        }
        else{
            res.status(404).json("Token or Database Error.");
        }
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createSeller,
    Login,
    searchUser,
    getSellerById,
    getMyProfile,
    updateProfile
}