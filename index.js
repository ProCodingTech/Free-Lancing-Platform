const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express();
require("dotenv").config();

const sellerRoutes = require("./Routes/SellerRoutes")

app.use(express.json());
app.use(cors());

app.listen(3100, ()=>{
    console.log("App is running at port 3100.");
})

app.use("/seller" ,sellerRoutes)

mongoose.connect(process.env.MONGO_STRING).then(()=>{
    console.log("DB Connected");
}).catch(err=>{
    console.log(err);
})