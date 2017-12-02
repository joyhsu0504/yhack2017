'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const http = require('http')
const fs = require('fs')
const path = require('path')
var csv = require('csv');

var feedbackBoolean = false
var bothBoolean = false
var lastSeenFood = ""

// NOT DONE - AUSTIN
function processForAirports(index) {
  var array = fs.readFileSync('./image-scraper/atc.csv').toString().split('\r\n');
  let airportTags = {};
  let airport = array[index];
  airport = airport.split(',');
  if(airport[0]) {
    console.log(`Scraping for ${airport[0]} - ${airport[1]}!`)
    airportTags[airport[0]] = [];
    processImages('./image-scraper/' + airport[0] + '/', airport[1]).then(() => {
      processForAirports(index + 1)
    });
  }
}

function processImages(folder, name) {
  var files = fs.readdirSync(folder);
	files = files.slice(0, 25);
  var filePromises = [];
	
  for(let file of files) {
    filePromises.push(new Promise((resolve, reject) => {
        var imageFile = fs.readFileSync(folder + file);
        var encoded = new Buffer(imageFile).toString('base64');
        processImage(encoded).then((result) => {
					console.log('processed for ' + folder + file);
          resolve(result);
        });
      })
    )
  }

  return Promise.all(filePromises).then(result => {
    return new Promise((resolve, reject) => {
      let fullList = [];
      for(let i of result) {
        fullList = fullList.concat(i);
      }

      let results = `${name},"${fullList.join(',')}"\n`
      console.log(results);

      fs.appendFile('airport_tags.csv', results, function (err) {
        if (err) throw err;
        console.log(`Saved for ${name}!`);
        resolve();
      });
    })
  });
};

function processImage(file) {
  const messageBody = {
  "requests":[
      {
        "image":{
          "content": file
        },
        "features":[
          {
            "type":"WEB_DETECTION",
            "maxResults":10
          }
        ]
      }]
  }

  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: 'https://vision.googleapis.com/v1/images:annotate',
      qs: {key: 'AIzaSyCGjy-IGHkLr1NAkunfshfX486rZxu9CCg'},
      body: JSON.stringify(messageBody)
    }, function(error, response, body) {
			console.log('Got another image classification...');
      if (error) {
        console.log('error requesting classification: ', error)
      } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      } else {
        const responseObj = JSON.parse(body);
        //let azureMessageBody = {"url": imageURL}
        let tagList = []
        if(responseObj && responseObj.responses) {
          for (let response of responseObj.responses) {
            if(response.webDetection) {
              for(let entity of response.webDetection.webEntities) {
                if(entity.description) {
                  tagList.push(entity.description);
                }
              }
            }
          }
        } else {
          resolve([]);
        }

        //console.log(list);
        console.log(tagList);
        resolve(tagList);
        //console.log(tagList)
      }
    })
  })
}


processForAirports(0)
//processImages('./image-scraper/hello/');
