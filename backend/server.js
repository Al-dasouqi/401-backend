'use srict';

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const axios = require('axios');

require('dotenv').config();
const PORT = process.env.PORT;


// server.use(cors());
// server.use(express.json());

//Mongodb connection 

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/drink', { useNewUrlParser: true, useUnifiedTopology: true });

//Schema
const drinkSchema = new mongoose.Schema({
    name: String,
    image: String
});

//Modal 

const Drink = mongoose.model('drink', drinkSchema);

//Router 

app.get('all', allDataHandler);
app.post('addToFav', addToFavHandler);
app.get('getFav', getFavHandler);
app.delete('delete', deleteHandler);
app.put('updateFav', updateFavHandler);


//Handlers

function allDataHandler(req, res) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`;
    axios
        .get(url)
        .then(result => { res.send(result.data.results) })
}

function addToFavHandler(req, res) {
    const { name, image } = req.body;
    const item = new Drink({
        name: name,
        image: image
    })

    item.save();
}

function getFavHandler(req, res) {
    Drink.find({}, (err, data) => {
        res.send(data);
    })
}

function deleteHandler(req, res) {
    const id = req.query.id;
    Drink.deleteOne({ _id: id }, (err, data) => {
        Drink.find({}, (err, data) => {
            res.send(data);
        })
    })
}

function updateFavHandler(req,res){
    const {name, image, id} = req.body;
    Drink.find({_id:id}, (err,data) =>{
        data[0].name = name;
        data[0].image= image;
        data[0].save()
        .then(()=>{
            Drink.find({}, (err, data) => {
                res.send(data);
             })
        })
    })
}
    app.listen(PORT, ()=> console.log("Listening on ${PORT}"));


