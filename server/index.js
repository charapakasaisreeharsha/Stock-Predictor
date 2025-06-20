const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/forecast", async (req, res) => {
  const { ticker, days } = req.body;
  const response = await axios.post("http://127.0.0.1:5000/forecast", { ticker, days });
  res.json(response.data);
});

// Start the server
app.listen(3001, () => {
  console.log("Node.js backend running at http://localhost:3001");
});
