var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require("cors");

var port = 8080;
const db = require("./config.js")
var Book = require('./Book.model');
var Table = require('./Table.model');


//db = "mongodb+srv://kud:kud@clusterkudos-m11u8.azure.mongodb.net/test?retryWrites=true";
// { useNewUrlParser: true };

mongoose.connect(db, { dbName: "Mongoose" })
  .then( () => {
    console.log('Connection to the Atlas Cluster is successful!')
  })
  .catch( (err) => console.error(err));

app.use(
    cors({
        allowedHeaders: ["sessionId", "Content-Type"],
        exposedHeaders: ["sessionId"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false
    })
);







app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('happy to be here');
});

app.get('/books', function (req, res) {
    console.log('getting all books');
    Book.find({})
        .exec(function (err, books) {
            if (err) {
                res.send('error occured')
            } else {
                console.log(books);
                res.json(books);
            }
        });
});

app.get('/books/:id', function (req, res) {
    console.log('getting all books');
    Book.findOne({
        _id: req.params.id
    })
        .exec(function (err, books) {
            if (err) {
                res.send('error occured')
            } else {
                console.log(books);
                res.json(books);
            }
        });
});

app.post('/book', function (req, res) {

      var newBook = new Table();

      newBook.title = req.body.title;
      newBook.author = req.body.author;
      newBook.category = req.body.category;

      newBook.save(function(err, book) {
        if(err) {
          res.send('error saving book');
        } else {
          console.log(book);
          res.send(book);
        }
      });
});

app.post('/book2', function (req, res) {
    Book.create(req.body, function (err, book) {
        if (err) {
            res.send('error saving book');
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.put('/book/:id', function (req, res) {
    Book.findOneAndUpdate({
        _id: req.params.id
    },
        {
            $set: { title: req.body.title }
        }, { upsert: true }, function (err, newBook) {
            if (err) {
                res.send('error updating ');
            } else {
                console.log(newBook);
                res.send(newBook);
            }
        });
});

app.delete('/book/:id', function (req, res) {
    Book.findOneAndRemove({
        _id: req.params.id
    }, function (err, book) {
        if (err) {
            res.send('error removing')
        } else {
            console.log(book);
            res.status(204);
        }
    });
});

app.listen(port, function () {
    console.log('app listening on port ' + port);
});