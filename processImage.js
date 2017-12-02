'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const savePixels = require("save-pixels")
const app = express()
const http = require('http')
const fs = require('fs')
const path = require('path')
const mongo = require("mongodb");
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const MongoClient = mongo.MongoClient;
var feedbackBoolean = false
var bothBoolean = false
var lastSeenFood = ""

var imageSearch = require('node-google-image-search');


function processImage(sender, imageURL) {
	const filepath = path.join(process.cwd(),'temp/' + 'download.jpg');
	var post = function(imageURL, callback) {
		request(imageURL, {encoding: 'base64'}, function(error, response, body) {
			fs.writeFileSync(filepath, body, 'base64', function (err) {});
			console.log("downloaded")
			var imageFile = fs.readFileSync(filepath)
			var encoded = new Buffer(imageFile).toString('base64')
			callback(encoded)
		});

	}

	post(imageURL, function(result) {
		const messageBody = {
		"requests":[
		    {
		      "image":{
		        "content": result
		      },
		      "features":[
		        {
		          "type":"WEB_DETECTION",
		          "maxResults":10
		        }
		      ]
		    }]
		}
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
				let azureMessageBody = {"url": imageURL}
				request({
					method: 'POST',
					url: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/tag',
					headers:{
						'content_type':'application/json',
						'Ocp-Apim-Subscription-Key':'0a6a9cad20ff454691e5f73137dd9ed4'
					},
					body: JSON.stringify(azureMessageBody)
				}, function(error, response, body2) {
					if (error) {
						console.log('error requesting classification: ', error)
					} else if (response.body.error) {
						console.log('Error: ', response.body.error)
					} else { 
						const responseObj2 = JSON.parse(body2);
						console.log(responseObj2)
						let tagList = []
						let tags = responseObj2.tags
						for (let tag of tags) {
							tagList.push(tag.name)
						}
						for (let response of responseObj.responses) {
							tagList.push(response.webDetection.webEntities[0].description)
						}
						//tagList.push(responseObj.responses[0].webDetection.webEntities[0].description)
					}
				})
				
			}
		})
	})
}
