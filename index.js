const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()

//middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3nttd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const inventoryCollection = client.db('bicycleWar').collection('inventory');

        app.post('/login', async(req, res) =>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({accessToken});
        })

        app.get('/inventory', async(req, res) =>{
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventory = await cursor.toArray();
            res.send(inventory);
        });

        app.get('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query= {_id: ObjectId(id)}
            const inventory = inventoryCollection.findOne(query);
            res.send(inventory);
        });

        //post
        app.post('/inventory', async(req, res) =>{
            const newItems = req.body;
            const result = await inventoryCollection.insertOne(newItems);
            res.send(result);
        });

        //delete
        app.delete('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('Bicyle warehouse server')
});

app.get('/hero', (req, res) =>{
    res.send('hero meets hero ku')
})

app.listen(port, () =>{
    console.log('Listening to port', port);
})