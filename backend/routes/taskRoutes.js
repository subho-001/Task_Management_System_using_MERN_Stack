const express = require("express");
const { getTask, createTask, getTaskDetailsById, updateTask, deleteTask, updateTaskStatus } = require("../controllers/taskController");
const { authenticateUser } = require("../middleware/authenticateUser");
const router = express.Router();

router.get("/getTasks",authenticateUser, getTask)
router.post("/create",authenticateUser, createTask)
router.get("/:taskId", authenticateUser, getTaskDetailsById)

router.put('/edit/:taskId',authenticateUser, updateTask);
router.delete('/delete/:taskId', authenticateUser, deleteTask);

router.patch('/status/:taskId', authenticateUser, updateTaskStatus)

module.exports = router;