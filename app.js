var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require("cors");

var Schema = mongoose.Schema;

var BookSchema = new Schema({
    title: String,
    author: String,
    category: String
});



var Book = mongoose.model('Book', BookSchema);

db = "mongodb+srv://kud:kud@clusterkudos-m11u8.azure.mongodb.net/test?retryWrites=true";

app.use(
    cors({
        allowedHeaders: ["sessionId", "Content-Type"],
        exposedHeaders: ["sessionId"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false
    })
);



var port = 8080;

mongoose.connect(db, { useNewUrlParser: true });

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

      var newBook = new Book();

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