const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const processImage = require('./processImg').processImage;

const app = express();

app.use(bodyParser.json())
app.use(cors());

const joyUrl = process.env.JOY_URL || 'https://agile-retreat-91525.herokuapp.com/';

let toggled = false;
app.get('/toggled', (req, res) => {
  res.send(toggled);
});

app.post('/toggled', (req, res) => {
  toggled = !toggled;
  res.send(toggled);
});


app.post('/travelInfo', (req, res, next) => {
  // lat long imageurl
  processImage(req.body.image)
    .then(tagList => {
      return axios.post(joyUrl + 'jetblue/api/get_deal', {
        lat: req.body.latitude,
        lon: req.body.longitude,
        entities: tagList
      })
    }).then(joyResponse => {
      console.log(joyResponse);
      res.send(joyResponse.data);
    }).catch(err => {
      console.log(err);
    })
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Serving travel ${process.env.PORT || 5000}`)
});
