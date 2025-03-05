'use strict';
var express = require('express');
var path = require('path');

var app = express();
var port = process.env.PORT || 1337;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start the server
app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}/`);
});