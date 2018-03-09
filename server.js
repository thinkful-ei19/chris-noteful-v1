'use strict';

// TEMP: Simple In-Memory Database
const express = require('express');
// const chai = require('chai');
// const chaiHttp = require('chai-http');

const morgan = require('morgan');
const notesRouter = require('./router/notes.router');
//This will take module.exports.PORT from config.js
//module.exports.PORT exports PORT from config.js
const { PORT } = require('./config');

const app = express();

//Log requests using morgan
app.use(morgan('dev'));

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));
app.use(express.json());

app.use(function(req, res, next) {
    console.log('Time:', Date(), req.method, req.url);
    next();
})

app.use('/v1', notesRouter);


app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({message: 'Not Found'});
});

app.use(function (err, req, res, net) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error:err
    });
});

app.startServer = function(PORT) {
    return new Promise ((resolve, reject) => {
        this.listen(PORT, function() {
            this.stopServer = require('util').promisify(this.close);
            resolve(this);
        }).on('error', reject);
    })
}

if (require.main === module) {
    app.listen(PORT, function() {
        console.info(`Server listening on ${this.address().port}`);
    }).on('error', err => {
        console.error(err);
    });
}

module.exports = app;