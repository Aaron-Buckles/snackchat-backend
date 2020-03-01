const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");

const app = express();

// Debugging
const startupDebug = require("debug")("http");

// Middleware
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

// Morgan
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebug("Morgan enabled...");
}

// Routes
app.use("/docs", require("./routes/docs"));
app.use("/api/users", require("./routes/users"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/tags", require("./routes/tags"));
app.use("/api/businesses", require("./routes/businesses"))

// Startup
startupDebug(`Starting ${config.get("name")}...`);

// MongoDB
function parseDatabaseURL() {
  return config
    .get("db")
    .replace("<username>", config.get("DB_USERNAME"))
    .replace("<password>", config.get("DB_PASSWORD"));
}

async function connectToDatabase() {
  const db = config.get("db");
  const username = config.get("DB_USERNAME");
  const password = config.get("DB_PASSWORD")

  try {
    await mongoose.connect(parseDatabaseURL(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: "snackchat"
    });
    startupDebug(`Connected to ${db} w/ username=${username}...`);
  } catch (err) {
    startupDebug(
      `Failed to connect to ${db} w/ username=${username} password=${password}...\n${err}`
    );
  }
}

connectToDatabase();

// Port Listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  startupDebug(`Listening on port ${port}...`);
});
