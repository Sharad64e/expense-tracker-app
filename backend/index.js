// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Expense = require("./models/Expense");
const parseInput = require("./utils/parser");

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// 👉 ADD EXPENSE (SMART INPUT)
app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;

    const parsed = parseInput(text);

    const newExpense = new Expense(parsed);
    await newExpense.save();

    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 👉 GET ALL
app.get("/expenses", async (req, res) => {
  const data = await Expense.find().sort({ createdAt: -1 });
  res.json(data);
});


// 👉 DELETE (optional but good for marks)
app.delete("/delete/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on 5000"));