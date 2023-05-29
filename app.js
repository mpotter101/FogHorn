const express = require('express');
const app = express();
const path = require ('path');

app.use (express.static(__dirname + '/public'));

// expose server-side node modules to the browser. I HATE this. Just let me require files from the browser.
app.use ('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use ('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
app.use ('three', express.static(path.join(__dirname, 'node_modules/three/build/three.module.js')));

app.route ('/')
	.get ( (req, res) => {
		res.sendFile (
			path.join (
				__dirname,'./html/index.html'
			),
			{ session: req.session }
		);
	})

// Start the app
var ip = '0.0.0.0';
var port = 3001;
let requestHandler = app.listen (
	port,
	ip,
	() => {
		console.log ('Running server at ' + ip + ':' + port);
	}
)