const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/TaskMiddleware");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../Controllers/Taskcontroller");

// All task routes require a valid JWT
router.use(auth);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
