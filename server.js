const http = require('http');
const fs   = require('fs');
const path = require('path');
const _ = require('lodash');
const mLog = require ('./mLog.js')
const url = require ('url');
const port = process.argv[2] || 8080;
const uuid = require('uuid');

const server = http.createServer((req, res) => {

	fileName = url.parse(req.url,true).pathname;
	fileName = req.url == '/' ? 'index.html' : fileName;
	let message = `${req.method} ${req.url}`;
	mLog.info(message);

	if (req.method == 'POST' && url.parse(req.url,true).pathname == '/add-session') {

		let body = [];
		
		req
		.on('data', (chunk) => {
  			body.push(chunk);
		})

		.on('end', () => {
  			body = Buffer.concat(body).toString();
  			console.log(body.toString());

  			let cookieValue = uuid.v4 ();

  			res.setHeader ('set-cookie', `sessionID= ${cookieValue}`);

  			fs.writeFile(path.join(__dirname, '.session', `${cookieValue}`), `${body}`, (err) => {
  				if (err) throw err;
  				console.log('Cookie has been saved!');
			})
  			res.end();
		});
	
	} 

	else {

		if (req.headers.cookie) {
			let userCookie = req.headers.cookie.split('=');
			console.log(userCookie[1]);

			fileCookie = userCookie[1];
			let contentCookie = fs.readFileSync('.session/' + fileCookie, 'UTF-8');
			res.setHeader ('x-my-user-data', contentCookie);
			// console.log(contentCookie);
		}

		fs.createReadStream(path.join(__dirname, 'public', fileName))
  		.on('error', (err) => {
    		let content = fs.readFileSync(path.join(__dirname, 'public', '404.html'));
    		mLog.error(message);
	    	res.write(content);
    		res.end();
    		res.statusCode = 404;
		})

  		.pipe(res)
		.on("end", () => {

    		res.statusCode = 200;
    		res.end();
  		})
	}
});

server.listen(port, (err) => {
  if (err) throw err;
  mLog.info("Server running through localhost on port " + port);
});