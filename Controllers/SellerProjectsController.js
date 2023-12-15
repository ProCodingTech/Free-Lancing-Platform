const mongoProject = require("../Models/SellerProjects.schema")
const jwt = require("jsonwebtoken")

const createProject = async (req, res) => {
    try{
        let userId = res.locals.userId;
        let userName = res.locals.name;

        // console.log("name ",userName," Id: ",userId);

        let data = req.body;
        // console.log("data: ",data);

        mongoProject.create({
            sellerId : userId,
            sellerName : userName,
            Title : data.Title,
            Description : data.Description,
            Technologies : data.Technologies || [],
            Price : data.Price,
            ImageUrl : data.ImageUrl || [],
            ImagePaths : data.ImagePaths || [],
        }).then(data=>{
            res.status(201).json(data._doc);
        })
        .catch(err=>{
            res.status(500).json({"There is some error: ":err.messsage});
        })
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    createProject
}