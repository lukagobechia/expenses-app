import apiRouter from "./api/api.route.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db/db.js";

connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
