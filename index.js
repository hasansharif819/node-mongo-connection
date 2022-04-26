const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//username: user1
//password: ctbMfeXPk52I6vDX

const uri = "mongodb+srv://user1:ctbMfeXPk52I6vDX@cluster0.qld52.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const userCollection = client.db('foodCart').collection('user');
        
        //hardcorded user
        // const user = {"name": "Hasan", "email": "hasan@gmail.com"};
        // const result = await userCollection.insertOne(user);
        // console.log(`user inseted with id: ${result.insertedId}`)

        //client side user
        app.get('/user', async(req, res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray(query);
            res.send(users);
        })

        app.post('/user', async(req, res) => {
            const newUser = req.body;
            console.log('Adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        //Delete user
        app.delete('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });
        app.get('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.findOne(query);
            res.send(result);
        });
        app.put('/user/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)}
            const options = { upsert : true};
            const updateUser = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updateUser, options);
            res.send(result);
        })
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Node and mongo');
})
app.listen(port, ()=>{
    console.log('Node and mongo are connecting ');
})