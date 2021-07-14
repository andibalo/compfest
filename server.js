require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

//Connect DB
const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb://andi2:Apple78612@cluster0-shard-00-00.uxfva.mongodb.net:27017,cluster0-shard-00-01.uxfva.mongodb.net:27017,cluster0-shard-00-02.uxfva.mongodb.net:27017/compfest?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDb()
  .then(() => {
    //Apply Middlewares
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json({ limit: "10mb" }));

    //Routes
    app.use("/api/user", require("./routes/user"));
    app.use("/api/appointment", require("./routes/appointment"));

    //Serve static assest in production
    if (process.env.NODE_ENV === "production") {
      //set static folder
      app.use(express.static("client/build"));

      app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
      });
    }

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`listening at port ${port}`);
    });
  })
  .catch((e) => console.log(e));
