'use strict';

// TEMP: Simple In-Memory Database
const express = require('express');

const data = require('./db/notes');

const app = express();

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));

app.get('/api/notes/', (req, res) => {
    const query = req.query;
    console.log(query);
    let searchQuery = data.filter(function(item) {
        if (item.title.includes(query.searchTerm)) {
            return item;
        } else if (item.content.includes(query.searchTerm)) {
            return item;
        }
    });
    if (query.searchTerm === undefined) {
        res.json(data)
    }
    else {
        res.json(searchQuery);
    };
})

app.get('/api/notes/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    res.json(data.find(item => item.id === Number(id)));
});

app.listen(8080, function() {
    console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
    console.error(err);
});