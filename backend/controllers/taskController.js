const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const mongoose = require("mongoose");


const getTask = async(req, res)=>{
    const {page = 1, limit = 5} = req.query;
    const skip = (page - 1) * limit;

    try {
        const tasks = await Task.find({userId : req.user?.id || null}).skip(parseInt(skip)).limit(parseInt(limit));

        const totalTasks = await Task.countDocuments({userId:req.user?.id || null});
        const totalPages = Math.ceil(totalTasks / limit);

        return res.json({tasks, totalPages});
    } catch(error) {
        return res.status(500).json({message:"Error fetching tasks", error:error.message});
    }
};

const createTask = async(req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const {title, description, dueDate, priority} = req.body;

        let isTitleExist = await Task.findOne({title});

        if(isTitleExist) {
            return res.status(400).json({message:"Task is already exist with this Title"})
        }

        const task = await Task.create({title, description, dueDate, priority, userId: req.user?.id || null,})
        
        res.status(201).json({message:'Task created successfully', task});
    } catch(error) {
        res.status(500).json({error:true,message:error.message});
    }
}

const getTaskDetailsById = async(req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const task = await Task.findById(req.params.taskId);
        if(!task) {
            return res.status(404).json({message:"Task not found"});
        }
        return res.json({task})
    } catch(error) {
        console.error(error);
        return res.status(500).json({message:"server error"})
    }
}

const updateTask =async(req, res)=>{
    try {
        const taskId = req.params.taskId;
        const {title} = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId, req.body,{new:true, runValidators:true}
        );

        if(!updatedTask) {
            return res.status(404).json({ error: true, message: 'Task not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch(error) {
        res.status(500).json({ error: true, message: 'Server error', details: error.message });
    }
}

const deleteTask = async(req, res)=>{
    try {
        const taskId = req.params.taskId;
        console.log("deleting task with id:", taskId);

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: true, message: 'Invalid task ID' });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if(!deletedTask) {
            return res.status(404).json({ error: true, message: 'Task not found' });
        }

        return res.status(200).json({error:false, message:"Task deleted successfully"})
        
    } catch(error) {
        return res.status(500).json({error:true, message:error.message});
    }
}

const updateTaskStatus = async(req, res)=>{
    try {
        const taskId = req.params.taskId;
        const {status} = req.body;

        if(!['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({error:true, message:"Invalid status"})
        }

        const task = await Task.findByIdAndUpdate(
            taskId,
            {status},
            {new:true, runValidators:true}
        );

        if(!task) {
            return res.status(400).json({error:true, message:'Task not found'})
        }
         return res.status(200).json({error:false,message:"Status updated successfully", task});
    } catch(error) {
        return res.status(500).json({error:true, message:error.message});
    }
}

module.exports = {getTask, createTask, getTaskDetailsById, updateTask, deleteTask, updateTaskStatus}