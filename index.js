const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhwjc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        // await client.connect();

        const jobCollection = client.db("jobPortal").collection("jobs")
        const jobApplications = client.db("jobPortal").collection("applications")

        app.get('/jobs', async (req, res) => {
            const cursor = jobCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query)
            res.send(result)
        })

        app.post('/jobs', async(req, res)=>{
            const job = req.body
            const result = await jobCollection.insertOne(job)
            res.send(result)
        })

        // job applications
        app.get('/job_application', async (req, res) => {
            const cursor = jobApplications.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/job_application/:id', async (req, res) => {
            const id = req.params.id
            const query = { job_id: id }
            const cursor = jobApplications.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        //-------------------------//

        app.get('/job_applications', async (req, res) => {
            const email = req.query.email
            const query = { applicant_email: email }
            const result = await jobApplications.find(query).toArray()
            res.send(result)
        })

        // app.get('/job_applications/:email', async (req, res) => {
        //     const email = req.params.email
        //     const query = { applicant_email: email };
        //     const result = await jobApplications.find(query).toArray()
        //     res.send(result)
        // })

        //---------------------------//

        app.post('/job_application', async (req, res) => {
            const application = req.body
            const result = await jobApplications.insertOne(application)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Jop portal server')
})

app.listen(port, () => {
    console.log(`server running at port: ${port}`)
})