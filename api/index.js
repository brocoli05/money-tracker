const express = require("express");
const app = express("");
const cors = require("cors");
require("dotenv").config(); // connect to mongo database
const { default: mongoose } = require("mongoose");
const Transaction = require("./models/Transaction");

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  // console.log(process.env.MONGO_URL);

  const { name, price, description, datetime } = req.body;
  const transaction = await Transaction.create({
    name,
    price,
    description,
    datetime,
  });
  res.json(transaction);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    console.log(req.params);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Transaction ID" });
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const transactions = await Transaction.find();

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4040);
