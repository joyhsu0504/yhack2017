const request = require('request');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

module.exports = {
  processImage: (imageUrl) => {
    const filepath = path.join(process.cwd(),'temp/' + 'download.jpg');
    var post = function(imageURL) {
      return new Promise((resolve, reject) => {
        request(imageURL, {encoding: 'base64'}, function(error, response, body) {
          fs.writeFileSync(filepath, body, 'base64', function (err) {});
          console.log("Downloaded Image!")
          var imageFile = fs.readFileSync(filepath)
          var encoded = new Buffer(imageFile).toString('base64')
          resolve(encoded);
        });
      })
    }

    return post(imageUrl).then((file) => {
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
      };

      return new Promise((resolve, reject) => {
        request({
          method: 'POST',
          url: 'https://vision.googleapis.com/v1/images:annotate',
          qs: {key: 'AIzaSyCGjy-IGHkLr1NAkunfshfX486rZxu9CCg'},
          body: JSON.stringify(messageBody)
        }, function(error, response, body) {
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

            console.log(tagList);
            resolve(tagList);
          }
        })
      })
    });
  }
}
