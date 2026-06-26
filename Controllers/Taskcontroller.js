const Task = require("../Models/Taskschema");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      tag: tag?.toLowerCase() || "normal",
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, deletedAt:null},
      { title, description, tag: tag?.toLowerCase() },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id, deletedAt:null },
    { deletedAt: new Date() },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task moved to trash", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET all trashed tasks
exports.getTrashedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user._id,
      deletedAt: { $ne: null },
    }).sort({ deletedAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT restore a trashed task
exports.restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found in trash" });
    res.json({ message: "Task restored", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
