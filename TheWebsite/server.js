'use strict';
var express = require('express');
var path = require('path');

var app = express();
var port = process.env.PORT || 1337;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve home.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/message', function (req, res) {
    res.send('Hello, Severi! This message comes from the server.');
});

app.get('/greet', function (req, res) {
    let name = req.query.name || 'Guest';
    res.send(`Hello, ${name}! Welcome to my website.`);
});

app.get('/api/info', function (req, res) {
    res.json({
        name: "Severi",
        profession: "Developer",
        portfolio: "Coming Soon!"
    });
});

// Start the server
app.listen(port, function () {
    console.log(`Server is live at http://localhost:${port}/`);
});