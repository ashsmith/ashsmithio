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

  // CodeBuild params
  var params = {
    projectName: projectName,
    sourceVersion: sha
  };

  var shouldTriggerCodeBuild = githubEvent.ref.indexOf('/develop') !== -1 || githubEvent.ref.indexOf('/master') !== -1;
  if (shouldTriggerCodeBuild) {

    codebuild.startBuild(params, function(err, data) {

      if (err) {
        console.log(err, err.stack);
        callback(err);
      } else {
        var build = data.build;
      }
    });

  }

  let message = shouldTriggerCodeBuild ? 'CodeBuild triggered successfully.': 'Feature Branch detected. Skipping CodeBuild.';

  callback(null, {
      statusCode: 200,
      body: JSON.stringify({ "message": message })
    });

}