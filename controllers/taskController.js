const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const { q, status } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: "i" };
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  if (!title)
    return res.status(400).json({ message: "Task title is required" });

  const task = await Task.create({
    title,
    description,
    status: status || "Pending",
    user: req.user.id,
  });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
};
