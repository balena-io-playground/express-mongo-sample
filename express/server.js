const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

var db;

MongoClient.connect(
  `mongodb://localhost:27017/sensor-data`,
  (err, database) => {
    if (err) return console.log(err);
    db = database.db("sensor-data");
    app.listen(process.env.PORT || 80, () => {
      console.log("listening on 80");
    });
  }
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/quotes", (req, res) => {
  db.collection("quotes").save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log("saved to database");
    res.redirect("/");
  });
});

app.put("/quotes", (req, res) => {
  db.collection("quotes").findOneAndUpdate(
    { name: "Yoda" },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      sort: { _id: -1 },
      upsert: true
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

app.delete("/quotes", (req, res) => {
  db.collection("quotes").findOneAndDelete(
    { name: req.body.name },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send("A darth vadar quote got deleted");
    }
  );
});