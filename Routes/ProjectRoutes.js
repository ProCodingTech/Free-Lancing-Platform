const {createProject, getMyProjects, getProjectById, updateProjectById, deleteProjectById, searchProject, searchProjectByTechnologies, addReviewById} = require("../Controllers/SellerProjectsController")
const {AuthenticateUser} = require("../MiddleWare/AuthenticateUser")

const express = require("express")
const router = express.Router();

router.post("/createProject", AuthenticateUser, createProject);
router.get("/myProjects", AuthenticateUser, getMyProjects);
router.get("/getProjectById/:id", AuthenticateUser, getProjectById);
router.patch("/updateProject/:id", AuthenticateUser, updateProjectById);
router.delete("/deleteProject/:id", AuthenticateUser, deleteProjectById);
router.get("/searchProject", searchProject);
router.get("/searchByTech", searchProjectByTechnologies);
router.put("/addReview/:id", AuthenticateUser, addReviewById);


module.exports = router;