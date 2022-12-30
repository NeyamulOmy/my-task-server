const express = require('express')
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bogje7w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const myTasksCollection = client.db('my-task').collection('my-tasks');


        app.post('/mytasks', async (req, res) => {
            const mytask = req.body;
            const result = await myTasksCollection.insertOne(mytask);
            res.send(result);
        })


        app.get('/completedtasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email, type: 'complete' };
            const completedtasks = await myTasksCollection.find(query).toArray();
            res.send(completedtasks);
        })
        app.get('/mytasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email, type: 'incomplete' }
            const mytasks = await myTasksCollection.find(query).toArray();
            res.send(mytasks);
        })
        app.get('/mytasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await myTasksCollection.findOne(query);
            res.send(result);
        })
        app.put('/mytasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    type: 'complete'
                }
            }
            const result = await myTasksCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.put('/completedtasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    type: 'incomplete'
                }
            }
            const result = await myTasksCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.patch('/mytasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updates = req.body;
            const updatedDoc = {
                $set: updates
            }
            const result = await myTasksCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.delete('/mytasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await myTasksCollection.deleteOne(filter);
            res.send(result);
        })

    }
    finally {

    }
}
run();
app.get('/', (req, res) => {
    res.send('Server running...')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})