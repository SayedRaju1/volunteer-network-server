const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors')

require('dotenv').config()





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sejit.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
const port = 5000


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const taskList = client.db("volunteerNetwork").collection("taskList");
    const registeredTaskList = client.db("volunteerNetwork").collection("registeredTaskList");
    console.log(`database connected`)

    app.get('/tasks', (req, res) => {
        taskList.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post("/addTask", (req, res) => {
        const task = req.body;
        registeredTaskList.insertOne(task)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
                // res.redirect('/');
            })

    })

    app.get('/myTasks', (req, res) => {
        registeredTaskList.find({})
            .toArray((err, documents) => {
                res.send(documents)
                // console.log(documents);
            })
    })

    app.delete('/cancelTask/:id', (req, res) => {
        registeredTaskList.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })
});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)