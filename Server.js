const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api/tasks", require("./Routes/Taskroutes"));

app.get("/", (req, res) => res.json({ message: "TaskManager API is running" }));

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Taskduty server running on http://localhost:${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
