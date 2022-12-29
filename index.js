const express = require('express')
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/mytasks', async (req, res) => {
            const query = {};
            const mytasks = await myTasksCollection.find(query).toArray();
            res.send(mytasks);
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