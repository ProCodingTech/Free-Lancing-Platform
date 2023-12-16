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

const getMyProjects = async (req, res) =>{
    try{
        let myId = res.locals.userId;
        const projects = await mongoProject.find({ sellerId: myId });
        if(projects){
            res.status(200).json(projects);
        }
        else{
            res.status(404).json({Message : "No Project Found."})
        }
    }
    catch(error){
        console.log(error);
    }
}

const getProjectById = async (req, res) => {
    try{
        let projectId = req.params.id;

        const foundProject = await mongoProject.findById(projectId);
        if(foundProject){
            res.status(200).json(foundProject);
        }
        else{
            res.status(404).json({Message : "Project Not Found."})
        }
    }
    catch(error){
        console.log(error);
    }
}

const updateProjectById = async (req, res) =>{
    try{
        let projectId = req.params.id;
        let data = req.body;

        let userId = res.locals.userId;
        let findProject = await mongoProject.findById(projectId);
        // console.log("Project ",findProject);

        if (!findProject){
            return res.status(404).json({Message : "Project Not Found."})
        }

        let sellerId = findProject.sellerId;

        if(userId === sellerId){
            let findProjectAndUpdate =  await mongoProject.findByIdAndUpdate(projectId, data);

            if (findProjectAndUpdate){
                res.status(201).json({Message : "Project Updated Successfully.", findProjectAndUpdate})
            }
            else{
                res.status(404).json({Message : "Oops! There is error in updating Project."})
            }
        }
        else{
            res.status(404).json({Message : "You are not owner of this project. So, you won't update it."})
        }
    }
    catch(error){
        console.log(error);
    }
}

const deleteProjectById = async (req, res) =>{
    try{
        let projectId = req.params.id;
        let userId = res.locals.userId;

        let findProject = await mongoProject.findById(projectId);
        if(!findProject){
            return res.status(404).json({Message : "Project Not Found."})
        }

        let sellerId = findProject.sellerId;

        if(userId === sellerId){
            let findProjectAndDelete =  await mongoProject.findByIdAndDelete(projectId);

            if (findProjectAndDelete){
                res.status(201).json({Message : "Project Deleted Successfully."})
            }
            else{
                res.status(404).json({Message : "Oops! There is error in Deleting Project."})
            }
        }
        else{
            res.status(404).json({Message : "You are not owner of this project. So, you won't delete it."})
        }

    }
    catch(error){
        console.log(error);
    }
}

const searchProject = async (req, res) =>{

    let {projectName} = req.query;

    if (!projectName){
        return res.status(400).json({ Message: "Query parameters missing." });
    }

    try {
        const projects = await mongoProject.find({
            $or: [
                { Title: { $regex: projectName, $options: "i" } }, // Search by Title
                { Description: { $regex: projectName, $options: "i" } } // Search by Description
            ]
        });

        if(projects.length > 0){
            res.status(200).json(projects);
        }
        else{
            res.status(400).json({Message : "No Project for this Search."})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
}

const searchProjectByTechnologies = async (req, res) =>{
    try {
        let { technology } = req.query;

        if (!technology) {
            return res.status(400).json({ Message: "Query parameter missing." });
        }

        const technologies = technology.split(',').map(tech => tech.trim());

        const technologiesRegex = technologies.map(tech => new RegExp(tech, 'i'));

        const projects = await mongoProject.find({
            Technologies: { $in: technologiesRegex }
        });

        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
    }
}

const addReviewById = async(req, res)=>{
    try{
        let projectId = req.params.id;

        let  { Comment, Rating } = req.body;

        let reviewerId = res.locals.userId;
        let reviewerName = res.locals.name;

        const review = {
            reviewerId,
            reviewerName,
            Comment,
            Rating
        };

        let findProject = await mongoProject.findById(projectId);

        if(findProject){
            let sellerId = findProject.sellerId;
            if (reviewerId !== sellerId){
                await mongoProject.findOneAndUpdate(
                    { _id: projectId },
                    { $push: { Feedbacks : review }}
                    );
                res.status(200).json({Message: "Review added successfully."});
            }
            else{
                res.status(400).json({Message : "You cannot review your own project."});
            }
        }
        else{
            res.status(404).json({Message : "Project Not Found."});
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    createProject,
    getMyProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
    searchProject,
    searchProjectByTechnologies,
    addReviewById
}