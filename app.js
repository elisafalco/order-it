const express = require("express");
const favicon = require('serve-favicon');
const fs = require("fs");
const path = require("path");

const { createThumbnails, renameFiles } = require('./functions.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(favicon(path.join(__dirname, 'favicon.ico')));


async function launchServer() {
  // Fetch all pictures
  const pictures = fs.readdirSync('./static/pictures', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name);
  
  // Generate thumbnails
  await createThumbnails(pictures); 
  
  // Views setup
  app.set("view engine", "twig");
  app.set("views", path.join(__dirname, "views"));
  
  // Router and context
  app.get("/", async (req, res) => {
    const thumbnails = fs.readdirSync('./static/thumbnails');
    res.status(200);
    res.render("index", { thumbnails: thumbnails });
  });
  app.post("/", async (req, res) => {
    await renameFiles(req);
    res.status(200);
    res.end();
  });
  
  // Static route
  app.use("/static", express.static(path.join(__dirname, "static")));
  
  // Server
  app.listen(PORT, (error) => {
    if (!error)
      console.log(
        "App is listening on port " + PORT
      );
    else console.log("Error occurred, server can't start", error);
  });
}

launchServer();