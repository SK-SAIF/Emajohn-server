const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const nodemon = require('nodemon');
require('dotenv').config()


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.wkh8y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EmaJohnStore").collection("products");
  const ordersCollection = client.db("EmaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    console.log(product);
    productsCollection.insertOne(product)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result);

      })
  })

  app.get('/allProducts', (req, res) => {
    const search=req.query.search;
    productsCollection.find({name:{$regex: search}})
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

  app.get('/allProducts/:key', (req, res) => {
    productsCollection.find(req.params.key)
      .toArray((error, documents) => {
        res.send(documents[0]);

      })
  })

  app.post('/getProductsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

  app.post('/orderedProduct', (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount>0);

      })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(process.env.PORT || port)