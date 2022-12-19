require("dotenv").config()
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const { default: axios } = require("axios");
const moment = require('moment');
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'bilmem'
}, function(err){
    if(!err){
        console.log("Database Connected!")
    }else{
        console.log(err)
    }
})
// Get morder data
const murderSchema = mongoose.Schema({
    id: Number,
    name: String,
    age: String,
    city: Number,
    date: String,
    why: Number,
    byWho: Number,
    protection: String,
    howKilled: Number,
    killerStatus: Number,
    source: String
},{collection: "murder"})
const murder = mongoose.model("murder", murderSchema)
// why scehema
const whySchema = mongoose.Schema({
    id: Number,
    why: String,
},{collection: "whyKilled"})
const whyKilled = mongoose.model("whyKilled", whySchema)

app.get("/getcitycount", (req,res) => {
    murder.aggregate([
    {
        $group: {
            _id: '$city',
            count: { $sum: 1 } // this means that the count will increment by 1
        }
    },
    {$sort: {count:1}} 
    ])
    .then((items)=>{
        res.json(items)
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/getmurdercount", (req,res) => {
    const query = req.query
    const filter = {}
    if(query.city){
        filter.city = parseInt(query.city)
    }else{
        filter.city = { $ne: 0 }
    }
    if(query.date){
        const date = query.date
        filter.date = { $gt: date.slice(0,10), $lte: date.slice(10)}
    }
    if(query.age){
        if(query.age === "Reşit"){
            filter.age = "Reşit"
        }else if(query.age === "Reşit Değil"){
            filter.age = "Reşit Değil"
        }
    }
    if(query.byWho){
        filter.byWho = { $eq: parseInt(query.byWho)}
    }
    if(query.why){
        filter.why = { $eq: parseInt(query.why)}
    }
    console.log(filter)
    murder.countDocuments(filter)
    .then((items)=>{
        res.json(items)
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/getmurder", (req,res) => {
    const query = req.query
    const filter = [];
    const lookup = 
        [{ "$lookup":
            {
               "from": "whyKilled",
               "localField": "why",
               "foreignField": "id",
               "as": "why"
            }
        },
        { "$lookup":
            {
               "from": "killerStatus",
               "localField": "killerStatus",
               "foreignField": "id",
               "as": "killerStatus"
            }
        },
        { "$lookup":
            {
               "from": "byWho",
               "localField": "byWho",
               "foreignField": "id",
               "as": "byWho"
            }
        },
        { "$lookup":
            {
               "from": "howKilled",
               "localField": "howKilled",
               "foreignField": "id",
               "as": "howKilled"
            }
        }]
    if(query.city){
        filter.push({ "$match": {"city": parseInt(query.city)} })
    }else{
        filter.push({ "$match": {city: { $ne: 0 }} })
    }
    if(query.date){
        const date = query.date
        filter.push({ "$match": { date: { $gt: date.slice(0,10), $lte: date.slice(10)} } })
    }
    if(query.age){
        if(query.age === "Reşit"){
            filter.push({ "$match": { age: { $eq: "Reşit"} } })
        }else if(query.age === "Reşit Değil"){
            filter.push({ "$match": { age: { $eq: "Reşit Değil"} } })
        }
    }
    if(query.byWho){
        filter.push({ "$match": { byWho: { $eq: parseInt(query.byWho)} } })
    }
    if(query.why){
        filter.push({ "$match": { why: { $eq: parseInt(query.why)} } })
    }
    lookup.forEach(element => {
        filter.push(element)
    });
    
    murder.aggregate(filter)
    .then((items)=>{
        const maxIndex = items.length-1;
        const page = query.page;
        if(page == 1 ){
            if(maxIndex >= 20){
                res.json(items.slice(0, 20));
            }else{
                res.json(items);
            }
        }else{
            if(maxIndex >= 20*page){
                res.json(items.slice(((page-1)*20)+1, 20*page));
            }else{
                if(maxIndex >= ((page-1)*20)+1){
                    res.json(items.slice(((page-1)*20)+1, -1));
                }else{
                    res.json({error:"404 - No more page!"});
                }
            }
        }
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/getyearchart", (req,res) => {
    murder.aggregate([
    {
        $group: {
            _id: {$year:{$toDate: "$date"}},
            count: { $sum: 1 } // this means that the count will increment by 1
        }
    },
    { "$match": {city: { $ne: 0 }} },
    {$sort: {count:1}} 
    ])
    .then((items)=>{
        res.json(items)
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/getbywhochart", (req,res) => {
    murder.aggregate([
    {
        $group: {
            _id: "$byWho",
            count: { $sum: 1 } // this means that the count will increment by 1
        },
        
    },
    { "$match": {city: { $ne: 0 }} },
    { "$lookup":
        {
        "from": "byWho",
        "localField": "_id",
        "foreignField": "id",
        "as": "_id"
        }
    },
    {$sort: {count:-1}} 
    ])
    .then((items)=>{
        res.json(items.slice(0,20))
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get("/getwhychart", (req,res) => {
    murder.aggregate([
    {
        $group: {
            _id: "$why",
            count: { $sum: 1 } // this means that the count will increment by 1
        },
        
    },
    { "$lookup":
        {
        "from": "whyKilled",
        "localField": "_id",
        "foreignField": "id",
        "as": "_id"
        }
    },
    { "$match": {city: { $ne: 0 }} },
    {$sort: {count:-1}} 
    ])
    .then((items)=>{
        res.json(items.slice(0,20))
    })
    .catch((err)=>{
        console.log(err)
    })
})
app.get("/getbywhotop10", (req,res) => {
    murder.aggregate([
    {
        $group: {
            _id: "$byWho",
            count: { $sum: 1 }, // this means that the count will increment by 1
        },
        
    },
    { "$lookup":
        {
        "from": "byWho",
        "localField": "_id",
        "foreignField": "id",
        "as": "_id"
        },
    },
    {$sort: {count:-1}} 
    ])
    .then((items)=>{
        res.json(items.slice(0, 10))
    })
    .catch((err)=>{
        console.log(err)
    })
})
app.get("/getwhykilledtop10", (req,res) => {
    murder.aggregate([
    {
        $group: {
            _id: "$why",
            count: { $sum: 1 }, // this means that the count will increment by 1
        },
        
    },
    { "$lookup":
        {
        "from": "whyKilled",
        "localField": "_id",
        "foreignField": "id",
        "as": "_id"
        },
    },
    {$sort: {count:-1}} 
    ])
    .then((items)=>{
        res.json(items.slice(0, 10))
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.listen(4000, () => console.log("server is up and running"))
