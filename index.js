require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const { User } = require('./models')
mongoose.set("strictQuery", false);
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(cors())
app.use(express.json());

const { userroute, authroute, paymentroute, serviceroute, adminroute,cartroute } = require('./routes');

app.use('/', authroute)
app.use('/api', userroute);
app.use('/api', serviceroute);
app.use('/api', adminroute);
app.use('/api', cartroute);

app.use('/api/payment', paymentroute)

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})