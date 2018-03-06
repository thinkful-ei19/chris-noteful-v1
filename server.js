'use strict';

// TEMP: Simple In-Memory Database
const express = require('express');

const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
//This will take module.exports.PORT from config.js
//module.exports.PORT exports PORT from config.js
const { PORT } = require('./config');

const app = express();

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));

app.use(function(req, res, next) {
    console.log('Time:', Date(), req.method, req.url);
    next();
})

app.get('/api/notes', (req, res, next) => {
    const { searchTerm } = req.query;
  
    notes.filter(searchTerm, (err, list) => {
      if (err) {
        return next(err); // goes to error handler
      }
      res.json(list); // responds with filtered array
    });
  });

// app.get('/api/notes/', (req, res) => {
//     const query = req.query;
//     let searchQuery = data.filter(function(item) {
//         if (item.title.includes(query.searchTerm)) {
//             return item;
//         } else if (item.content.includes(query.searchTerm)) {
//             return item;
//         }
//     });
//     if (query.searchTerm === undefined) {
//         res.json(data)
//     }
//     else {
//         res.json(searchQuery);
//     };
// })

app.get('/api/notes/:id', (req, res) => {
    const {id} = req.params;
    notes.find(id, (err, item) => {
        if (err) {
          //Add a way to send JSON to postman
          console.error(err);
        }
        if (item) {
          res.json(data.find(item => item.id === Number(id)));
          console.log(item);
        } else {
          //Add a way to send JSON to postman
          console.log('not found');
        }
      });    
    //console.log(id);
});

// app.get('/boom', (req, res, next) => {
//     throw new Error('Boom!!');
// });

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

app.listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
    console.error(err);
});