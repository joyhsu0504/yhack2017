const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const processImage = require('./processImg').processImage;

const app = express();

app.use(bodyParser.json())
app.use(cors());

//const joyUrl = process.env.JOY_URL || 'https://'
app.post('/travelInfo', (req, res, next) => {
  // lat long imageurl
  processImage(req.body.image)
    .then(tagList => {
      console.log(tagList);
      //return axios.post(joyUrl, {
        //latitude: req.body.latitude,
        //longitude: req.body.longitude,
        //tag_list: tagList
      //})
    //}).then(joyResponse => {
      //res.send(joyResponse);
    });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Serving travel ${process.env.PORT || 5000}`)
});
