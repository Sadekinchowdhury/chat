const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const { query } = require('express')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oq7uvoj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {
    try {
        const UserCollection = client.db('Inchat').collection('user')
        const postCollection = client.db('Inchat').collection('post')
        const commentCollection = client.db('Inchat').collection('comment')

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post)
            res.send(result)
        })
        app.post('/comment', async (req, res) => {
            const post = req.body;
            const result = await commentCollection.insertOne(post)
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const post = req.body;
            const result = await UserCollection.insertOne(post)
            res.send(result)
        })

        app.get('/comment/:id', async (req, res) => {
            const comment_id = req.params.id;
            const query = { _id: ObjectId(comment_id) }
            const result = await commentCollection.findOne

                (query)
            res.send(result)


        })
        app.put('/post/:id', async (req, res) => {
            const post = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    liking: post.like,
                    likeusersname: post.username
                }
            }
            const result = await postCollection.updateMany(filter, updateDoc, options)
            res.send(result)
        })
        app.put('/post/comment/:id', async (req, res) => {
            const post = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    comments: post.comment,
                    commentusername: post.username

                }
            }
            const result = await postCollection.updateMany(filter, updateDoc, options)
            res.send(result)
        })



        app.get('/allpost', async (req, res) => {
            const query = {}
            const result = await postCollection.find(query).sort({ liking: -1 }).limit(100).toArray();
            res.send(result)
        })


    }
    finally {

    }
}
run()




app.get('/', (req, res) => {
    res.send('amar bangladesh')
})
app.listen(port, () => {
    console.log(`this server is running on ${port}`)
})