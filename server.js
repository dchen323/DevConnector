import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import users from "./routes/api/users";
import profile from "./routes/api/profile";
import posts from "./routes/api/posts";
const express = require("express");
const keys = require("./config/keys");
const path = require("path");

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = keys.mongoURI;

//connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//Server static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));
