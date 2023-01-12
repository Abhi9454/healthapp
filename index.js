require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')
const mongoDB = "mongodb://127.0.0.1/my_database";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('connection done');
})
const app = express();

app.use(express.json());



app.use(express.urlencoded({ extended: true }));

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
  

app.use(cors(corsOptions));


app.all('/api',function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.setTimeout(20000);
   next();
});


const routes = require('./routes/routes');

app.use('/api', routes);

app.use('/view',express.static('./uploads'))

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
