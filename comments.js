// Create web server and respond with "Hello World!" for requests that hit root "/"
// Respond with 404 for any other request.
var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 8080;

var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true, false);
    var pathname = urlObj.pathname;
    var query = urlObj.query;
    var filePath = '.' + pathname + '.json';
    var method = req.method;
    var comments = [];

    // Check if file exists
    fs.exists(filePath, function (exists) {
        if (exists) {
            // Read existing comments
            var data = fs.readFileSync(filePath);
            comments = JSON.parse(data);
        }

        // Check if POST
        if (method === 'POST') {
            var body = '';

            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function () {
                var newComment = JSON.parse(body);
                comments.push(newComment);
                var json = JSON.stringify(comments);

                fs.writeFile(filePath, json, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File saved successfully!');
                    }
                });
            });
        }

        // Write out the response
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(JSON.stringify(comments));
        res.end();
    });
});

server.listen(process.env.PORT || port);
console.log('Server running at http://localhost:' + port);