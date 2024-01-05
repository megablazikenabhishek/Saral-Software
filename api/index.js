const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/connection");
const path = require("path");
require("dotenv").config();

// cors
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cool-point.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.static(path.join(__dirname, "./public", "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views", "../views"));

// routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/v1", require("./routes/api"));

const start = () => {
  try {
    const port = process.env.PORT || 5000;
    connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}.........`)
    );
  } catch (err) {
    console.log(err);
  }
};

start();
module.exports = app;
