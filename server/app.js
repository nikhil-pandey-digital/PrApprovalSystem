const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
// const pullRequestsRoutes = require('./routes/pullRequestsRoutes');
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Middleware to handle preflight requests
app.options("/api/v1/users/pullRequest/:id", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World! from server");
});

app.use("/api/v1/users", userRoutes);
// app.use('/api/v1/pullRequests', pullRequestsRoutes);

module.exports = app;
