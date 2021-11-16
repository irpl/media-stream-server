const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require('path');
const app = express();

app.use(cors());

const MUSIC_DIR = "./music";
if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR);
}

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/audio/:id", (req, res) => {
  const range = req.headers.range;
  if (!range) res.status(400).json({ msg: "Range header required" });
  else {
    const path = `music/${req.params.id}.mp3`;
    if (!fs.existsSync(path)) res.status(404);
    else {
      const size = fs.statSync(path).size;

      const CHUNK_SIZE = 10 ** 6;
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, size - 1);

      const contentLength = end - start + 1;

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mp3",
      };

      res.writeHead(206, headers);
      const stream = fs.createReadStream(path, { start, end });
      stream.pipe(res);
    }
  }
});

app.get("/list", (req, res) => {
  fs.readdir(MUSIC_DIR, function (err, files) {
    //handling error
    if (err) {
      res.status(400).send("Unable to scan directory: " + err);
    }
    //listing all files using forEach
    files = files.map((f) => f.replace(/\.[^/.]+$/, ""));
    res.json({ list: files });
    // files.forEach(function (file) {
    //   // Do whatever you want to do with the file

    // });
  });
});
app.listen(8000, () => console.log("Listeing on 8000"));
