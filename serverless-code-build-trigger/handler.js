'use strict';

var AWS = require('aws-sdk');
var codebuild = new AWS.CodeBuild();
var querystring = require('querystring');


// this function will be triggered by the github webhook
module.exports.start_build = (event, context, callback) => {
  var eventData = querystring.parse(event.body);
  var githubEvent = JSON.parse(eventData.payload);

  var ref = githubEvent.ref;
  var sha = githubEvent.after;

  // Deploy any branch to the dev site.
  var projectName = process.env.BUILD_DEV_PROJECT;

  // Deploy only the master branch to production
  if (githubEvent.ref.indexOf('/master') !== -1) {
    projectName = process.env.BUILD_PROJECT;
  }

  if (!githubEvent.ref.indexOf('/develop') || !githubEvent.ref.indexOf('/master')) {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ "message": "Skipped build for feature branch." })
    });
  }

  // CodeBuild params
  var params = {
    projectName: projectName,
    sourceVersion: sha
  };

  // start the codebuild process for this project
  codebuild.startBuild(params, function(err, data) {

    if (err) {
      console.log(err, err.stack);
      callback(err);
    } else {
      var build = data.build;
    }
  });

  callback(null, {
      statusCode: 200,
      body: JSON.stringify({ "message": "Success!" })
    });

}