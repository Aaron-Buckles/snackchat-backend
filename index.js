const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const app = express();

// AWS
const aws = require("aws-sdk");
aws.config.region = "us-west-1";
const S3_BUCKET = process.env.S3_BUCKET;

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
app.use("/api/businesses", require("./routes/businesses"));

app.get("/api/sign-s3", (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query["file-name"];
  const fileType = req.query["file-type"];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read"
  };

  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// Startup
startupDebug(`Starting snackchat-backend...`);

// MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: "snackchat"
    });
    startupDebug(`Connected to ${process.env.DB_URI}`);
  } catch (err) {
    startupDebug(`Failed to connect to ${process.env.DB_URI}\n${err}`);
  }
}

connectToDatabase();

// Port Listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  startupDebug(`Listening on port ${port}...`);
});
