const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const cors = require("cors");
dotenv.config();

const taskRoutes = require("./routes/taskRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express();
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URL,).then(()=>{
    console.log("mongodb connected");
}).catch(err=> console.log(err));

app.get("/",(req, res)=>{
    res.send("API is running...");
})

app.use((err,req,res,next)=>{
    res.status(500).json({error:true, message:err.message})
})


app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
  

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})