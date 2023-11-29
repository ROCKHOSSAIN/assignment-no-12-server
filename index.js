const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware;
app.use(cors({
    origin: [
      'http://localhost:5173',
    ],
  }));
app.use(express.json());

//bloodDonation
//ZMxQQPWpqFuZMOOX
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh2cr5s.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.vh2cr5s.mongodb.net/?retryWrites=true&w=majority";
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usercollection = client.db('bloodDonation').collection('allUsers')
    const donorRequestcollection = client.db('bloodDonation').collection('donationRequest')

    app.post('/jwt', async (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '1h'
        })
        res.send({ token })
      })


      //create user
      app.post('/allUser', async (req, res) => {
        const allUsers = req.body;
        const result = await usercollection.insertOne(allUsers)
        res.send(result)
      })
  

      app.get('/allUser', async (req, res) => {
        const result = await usercollection.find().toArray()
        res.send(result)
      })
      //profile update
      app.put('/allUser/:email',async(req,res)=>{
        const item = req.body;
        const email = req.params.email;
        const filter = {email :email}
        const updatedDoc = {
          $set:{
            name:item.name,
            district:item.district,
            upazila:item.upazila,
            bloodGroup:item.bloodGroup,
            imageUrl: item.imageUrl
          }
        }
        const result = await usercollection.updateOne(filter,updatedDoc)
        res.send(result)
      })

      //donor request
      app.post('/donorRequest', async (req, res) => {
        const allUsers = req.body;
        const result = await donorRequestcollection.insertOne(allUsers)
        res.send(result)
      })
      app.get('/donorRequest', async (req, res) => {
        // const email = req.query.email;
        // res.send(email)
        // const query = { email: email }
        
        const result = await donorRequestcollection.find().toArray()
        res.send(result)
      })
      app.get('/donorRequest/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await donorRequestcollection.findOne(query)
        res.send(result)
      })
      //update
      app.put('/donorRequest/:id',async(req,res)=>{
        const item = req.body;
        const id = req.params.id;
        const filter = {_id :new ObjectId(id)}
        const updatedDoc = {
          $set:{
            RecipentName:item.RecipentName,
            district:item.district,
            upazila:item.upazila,
            hospitalName:item.hospitalName,
            date:item.date,
            time:item.time,
            address:item.address,
            requestMessage:item.requestMessage,
          }
        }
        const result = await donorRequestcollection.updateOne(filter,updatedDoc)
        res.send(result)
      })
      //delete user
      app.delete('/donorRequest/:id',async(req,res)=>{
        const id = req.params.id;
        const query =  {_id : new ObjectId(id)}
        const result = await donorRequestcollection.deleteOne(query)
        res.send(result)
  
      })

      //
      app.get('/donorRequest', async(req, res) => {
        // console.log('query',req.query.page)
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        console.log(page,size)
          const result = await productCollection.find()
          .skip(page*size)
          .limit(size)
          .toArray();
          res.send(result);
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('blood collection sever is running')
})
app.listen(port,()=>{
    console.log(`blood collectione server is running on port : ${port}`)
})
