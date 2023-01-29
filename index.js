import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

import express, { json, urlencoded, } from 'express';
import pkg from 'mongoose';
const { connect, connection } = pkg;
import cors from 'cors';
const mongoDB = "mongodb://127.0.0.1/healthapp_database";
connect(mongoDB);

const database = connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('connection done');
})
const app = express();

app.use(json());



app.use(urlencoded({ extended: true }));

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


import routes from './routes/routes.js';

app.use('/api', routes);

//app.use('/view',static('./uploads'))

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
