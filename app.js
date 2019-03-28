var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const cors = require("cors");

var port = 8080;
const db = require("./config.js")
var Book = require('./Book.model');
var Table = require('./Table.model');

// const MySchema = new mongoose.Schema({});
const MySchema = new mongoose.Schema({
    someField: {
      unique: false,
      preserveUniqueKey: false
    },
    anotherField: String,
    yetAnotherField: String
  });
   
  MySchema.index({
    anotherField: 1,
    yetAnotherField: 1
  }, {
    unique: true,
    preserveUniqueKey: true
  });
MySchema.plugin(mongoTenant);
const MyModel = mongoose.model('MyModel', MySchema);
const MyTenantBoundModel = MyModel.byTenant('some-tenant-id');
(new MyTenantBoundModel()).getTenantId() === 'some-tenant-id'; // true
// silently ignore other tenant scope
(new MyTenantBoundModel({
    tenantId: 'some-other-tenant-id'
  })).getTenantId() === 'some-tenant-id'; // true


//   if (SomeModelClassOrInstance.hasTenantContext) {
//     const tenantId = SomeModelClassOrInstance.getTenantId();
    
//   }




  const AuthorSchema = new mongoose.Schema({});
AuthorSchema.plugin(mongoTenant);
const AuthorModel = mongoose.model('author', AuthorSchema);
 
const BookSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'author' }
});
BookSchema.plugin(mongoTenant);
const BookModel = mongoose.model('book', BookSchema);
 
const BoundBookModel = BookModel.byTenant('some-tenant-id');
BoundBookModel.model('author'); // return author model bound to "some-tenant-id"
BoundBookModel.db.model('author'); // return author model bound to "some-tenant-id"

app.get('/', function (req, res) {
    res.send('happy to be here');
});

app.listen(port, function () {
    console.log('app listening on port ' + port);
});


// mongoose.connect(db, { dbName: "Mongoose" })
//   .then( () => {
//     console.log('Connection to the Atlas Cluster is successful!')
//   })
//   .catch( (err) => console.error(err));

// app.use(
//     cors({
//         allowedHeaders: ["sessionId", "Content-Type"],
//         exposedHeaders: ["sessionId"],
//         origin: "*",
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//         preflightContinue: false
//     })
// );


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// app.get('/', function (req, res) {
//     res.send('happy to be here');
// });

// app.get('/books', function (req, res) {
//     console.log('getting all books');
//     Book.find({})
//         .exec(function (err, books) {
//             if (err) {
//                 res.send('error occured')
//             } else {
//                 console.log(books);
//                 res.json(books);
//             }
//         });
// });

// app.get('/books/:id', function (req, res) {
//     console.log('getting all books');
//     Book.findOne({
//         _id: req.params.id
//     })
//         .exec(function (err, books) {
//             if (err) {
//                 res.send('error occured')
//             } else {
//                 console.log(books);
//                 res.json(books);
//             }
//         });
// });

// app.post('/book', function (req, res) {

//       var newBook = new Book();

//       newBook.title = req.body.title;
//       newBook.author = req.body.author;
//       newBook.category = req.body.category;

//       newBook.save(function(err, book) {
//         if(err) {
//           res.send('error saving book');
//         } else {
//           console.log(book);
//           res.send(book);
//         }
//       });
// });

// app.post('/book2', function (req, res) {
//     Book.create(req.body, function (err, book) {
//         if (err) {
//             res.send('error saving book');
//         } else {
//             console.log(book);
//             res.send(book);
//         }
//     });
// });

// app.put('/book/:id', function (req, res) {
//     Book.findOneAndUpdate({
//         _id: req.params.id
//     },
//         {
//             $set: { title: req.body.title }
//         }, { upsert: true }, function (err, newBook) {
//             if (err) {
//                 res.send('error updating ');
//             } else {
//                 console.log(newBook);
//                 res.send(newBook);
//             }
//         });
// });

// app.delete('/book/:id', function (req, res) {
//     Book.findOneAndRemove({
//         _id: req.params.id
//     }, function (err, book) {
//         if (err) {
//             res.send('error removing')
//         } else {
//             console.log(book);
//             res.status(204);
//         }
//     });
// });

// app.listen(port, function () {
//     console.log('app listening on port ' + port);
// });