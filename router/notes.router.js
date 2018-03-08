const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
    const { searchTerm } = req.query;
  
    // notes.filter(searchTerm, (err, list) => {
    //   if (err) {
    //     return next(err); // goes to error handler
    //   }
    //   res.json(list); // responds with filtered array
    // });
      notes.filter(searchTerm)
        .then(list => res.json(list))
        .catch(err => next(err));
})

router.get('/notes/:id', (req, res) => {
    const {id} = req.params;
    // notes.find(id, (err, item) => {
    //     if (err) {
    //       //Add a way to send JSON to postman
    //       console.error(err);
    //     }
    //     if (item) {
    //       res.json(data.find(item => item.id === Number(id)));
    //       console.log(item);
    //     } else {
    //       //Add a way to send JSON to postman
    //       console.log('not found');
    //     }
    //   });    
    notes.find(id)
      .then(item => {
        if (item) {
          res.json(data.find(item => item.id === Number(id)));
          console.log(item);
        } else {
          console.log('not found');
        }
      })
      .catch(err => console.log(err));
});

router.put('/notes/:id', (req, res, next) => {
    const id = req.params.id;
  
    /***** Never trust users - validate input *****/
    const updateObj = {};
    const updateFields = ['title', 'content'];
  
    updateFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
  
    // notes.update(id, updateObj, (err, item) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   if (item) {
    //     res.json(item);
    //   } else {
    //     next();
    //   }
    // });

    notes.update(id, updateObj)
      .then(item => {
        if (item) {
          res.json(item);
        } else {
          next();
        }
      })
      .catch(err => {
        if (err) {
          return next(err);
        }
      })

  });

  router.post('/notes', (req, res, next) => {
      //title and content taken from request's body
      const { title, content } = req.body;

      const newItem = { title, content };
      //Never trust the users- set parameters to confirm proper submissions
      if (!newItem.title) {
          const err = new Error('Missing `title` in request body');
          err.status = 400;
          return next(err);
      }
      //If title exists...
      // notes.create(newItem, (err, item) => {
      //     if (err) {
      //         return next(err);
      //     }
      //     if (item) {
      //         res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      //     } else {
      //         next();
      //     }
      // })
      notes.create(newItem)
        .then(item => {
          if (item) {
            res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
          } else {
            next();
          }
        })
        .catch(err => {
          return next(err);
        })
  })

  router.delete('/notes/:id', (req, res, next) => {
      const id = req.params.id;
        // notes.delete(id, (err, result) => {
        //     if (err) {
        //         return next(err)
        //     } 
        //     if (result) {
        //         res.sendStatus(204);
        //     }
        //     else {
        //         next();
        //     }
        // })
        notes.delete(id)
          .then(result => {
            if (result) {
              res.sendStatus(204);
            }
            else {
              next();
            }
          })
          .catch(err => {
            return next(err);
          })
  })

  //Don't forget to export router.
  module.exports = router;