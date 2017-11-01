const port = 8000;
const serverUrl = '127.0.0.1';

const http = require('http');
const path = require('path');
const fs = require('fs');
var checkMimeType = true;

console.log('Starting web server at ' + serverUrl + ':' + port);

http.createServer(function(req,res){
    var now = Date();

    var fileName = req.url || "index.html";
    var ext = path.extname(fileName);
    var localPath = __dirname;
    var validExtensions = {
        ".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
    };

    var validMimeType = true;
    var mimeType = validExtensions[ext];

    if(checkMimeType){
        validMimeType = validExtensions[ext] !== undefined;
    }

    if(validMimeType){
        localPath += fileName;
        fs.access(localPath, function(err){
            if(err) {
                console.log('File not found: ' + localPath);
                res.writeHead(404);
                res.end();
            }

            console.log('Serving file: ' + localPath);
            getFile(localPath, res, mimeType);
        })
    }

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType){
    fs.readFile(localPath, function(err, contents){
        if(err){
            res.writeHead(500);
            res.end();
        }
        else{
            res.setHeader('Content-length', contents.length);
            if(mimeType !== undefined){
                res.setHeader('Content-type', mimeType);
            }
            res.statusCode = 200;
            res.end(contents);
        }
    });
}

