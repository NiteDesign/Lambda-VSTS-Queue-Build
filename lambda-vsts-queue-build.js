
var https = require("https");

const url = require('url');

const AWS = require('aws-sdk');

const encrypted = process.env['vsts_key'];
let decrypted;

function processEvent(event, context, callback) {
  queueVSTSBuild();
}

exports.handler = (event, context, callback) => {
	if (decrypted) {
			processEvent(event, context, callback);
	} else {
			// Decrypt code should run once and variables stored outside of the function
			// handler so that these are decrypted once per container
			const kms = new AWS.KMS();
			kms.decrypt({ CiphertextBlob: new Buffer(encrypted, 'base64') }, (err, data) => {
					if (err) {
							console.log('Decrypt error:', err);
							return callback(err);
					}
					decrypted = data.Plaintext.toString('ascii');
					processEvent(event, context, callback);
			});
	}
};

function queueVSTSBuild(response) {
    var bodyJson = {
	      "definition": {
	          "id": process.env.defintionID
	      },
	      "sourceBranch": process.env.sourceBranch,
	      "parameters": "{\"variableName1\": \"variableValue1\", \"variableName2\": \"variableValue2\"}"
	  };

	var body = JSON.stringify(bodyJson);

	var options = {
	  "method": "POST",
	  "hostname": process.env.VSTShostname,
	  "port": null,
	  "path": "/" + process.env.VSTSteamname + "/_apis/build/builds?api-version=4.1",
	  "headers": {
	    "authorization": 'Basic ' + decrypted,
	    "Content-Type": "application/json",
	    "Content-Length": Buffer.byteLength(body),
	  }
	};

    const postReq = https.request(options, (res) => {
        const chunks = [];
        res.setEncoding('utf8');
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
            if (response) {
                response({
                    body: chunks.join(''),
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                });
            }
        });
        return res;
    });

    postReq.write(body);
    postReq.end();
}
