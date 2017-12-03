const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const buildUrl = require('build-url');
const processImage = require('./processImg').processImage;
const fs = require('fs');

const app = express();

app.use(bodyParser.json())
app.use(cors());

const joyUrl = process.env.JOY_URL || 'https://agile-retreat-91525.herokuapp.com/';
//const joyUrl = 'http://localhost:5000/';
const reactUrl = 'afternoon-brook-79597.herokuapp.com/';

let toggled = false;

function getLocationFromAirportCode(code) {
  var array = fs.readFileSync('./image-scraper/atcfull.csv').toString().split('\r\n');
  for(let i of array) {
    let sp = i.split(',');
    if(sp[1] === code) {
      return sp[0]
    }
  }

  return 'Somewhere Awesome';
}

getLocationFromAirportCode('EWR');

app.get('/toggled', (req, res) => {
  res.send(toggled);
});

app.post('/toggled', (req, res) => {
  toggled = !toggled;
  res.send(toggled);
});

app.post('/getPhotos', (req, res) => {
  let entities = req.body.entities.split(',')
  console.log(joyUrl + 'jetblue/api/get_photos');
  axios.post(joyUrl + 'jetblue/api/get_photos', {
    lat: req.body.lat,
    lon: req.body.lon,
    entities: entities
  }).then(resp => {
    res.send(resp.data);
  }).catch(err => {
    console.log(err);
  })
})

app.post('/getDeals', (req, res) => {
  console.log(req.body.entities);
  let entities = req.body.entities.split(',');
  axios.post(joyUrl + 'jetblue/api/get_deal', {
    lat: req.body.lat,
    lon: req.body.lon,
    entities: entities
  }).then(resp => {

    res.send(Object.assign(resp.data, {
      city: getLocationFromAirportCode(resp.data.DestinationAirportCode),
    }));
  }).catch(err => {
    console.log(err);
  })
});

app.post('/travelInfo', (req, res, next) => {
  // lat long imageurl
  let tags = [];
  processImage(req.body.image)
    .then(tagList => {
      tags = tagList;
      console.log({
        lat: req.body.latitude,
        lon: req.body.longitude,
        entities: tagList
      })
      return axios.post(joyUrl + 'jetblue/api/get_deal', {
        lat: req.body.latitude,
        lon: req.body.longitude,
        entities: tagList
      })
    }).then(joyResponse => {
      res.send(Object.assign(joyResponse.data, {
        city: getLocationFromAirportCode(joyResponse.data.DestinationAirportCode),
        reactUrl: buildUrl(`${reactUrl}`, {
          queryParams: {
            entities: tags,
            lat: req.body.latitude,
            lon: req.body.longitude
          }
        })
      }));
    }).catch(err => {
      console.log(err);
    })
});

let server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Serving travel ${process.env.PORT || 5000}`)
});
server.timeout = 100000;
