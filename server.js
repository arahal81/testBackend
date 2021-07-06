const express = require("express");
const app = express();
const cors = require("cors");
const { get } = require("mongoose");
const axios = require("axios");
app.use(cors());
require("dotenv").config();
const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect(`${process.env.MONGODB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const psiPowers = new mongoose.Schema({
  name: String,
  img: String,
});
const psychonauts = new mongoose.Schema({
  name: String,
  img: String,
  psiPowers: [psiPowers],
});

const psychonautsModel = mongoose.model("psycho", psychonauts);

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/apidata", getDataApi);
app.post("/addfav", addfav);
app.get("/getfav", getfav);
app.put("/update", updateFav);
app.delete("/delete/:id", deleteFav);
app.listen(process.env.PORT);

function updateFav(req, res) {
  //const id = req.params.id;
  const { name, id } = req.body;
  psychonautsModel.find({ _id: id }, (err, data) => {
    if (err) {
      res.send(err);
    }
    data[0].name = name;
    data[0].save();
  });
}
function deleteFav(req, res) {
  const id = req.params.id;
  console.log(id);
  psychonautsModel
    .deleteOne({ _id: id }, (err, data) => {
      if (err) {
        res.send(err);
      }
      console.log(data);
    })
    .then(res.send("done"));
}

function getfav(req, res) {
  psychonautsModel.find({}, (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
}

function getDataApi(req, res) {
  axios
    .get(`https://psychonauts-api.herokuapp.com/api/characters?limit=5`)
    .then((apiData) => {
      res.send(apiData.data);
    });
}

function addfav(req, res) {
  console.log(req.body);
  const { name, img, psi } = req.body;

  const psychonauts = new psychonautsModel({
    name: name,
    img: img,
    psiPowers: psi.map((item) => {
      return {
        name: item.name,
        img: item.img,
      };
    }),
  });
  psychonauts.save();
}
