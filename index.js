const express = require("express");
const cors = require("cors");
require("dotenv").config;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//database connection

const uri = `mongodb+srv://dbuser-1:k4MmRDDyhtb7FZLN@cluster0.twequ.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log("user", process.env.DB_USER);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const breakfastCollection = client.db("red-onion").collection("breakfast");
    const lunchCollection = client.db("red-onion").collection("lunch");
    const dinnerCollection = client.db("red-onion").collection("dinner");
    const cartCollection = client.db("red-onion").collection("cart");

    //get all breakfast
    app.get("/breakfast", async (req, res) => {
      const cursor = breakfastCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all lunch
    app.get("/lunch", async (req, res) => {
      const cursor = lunchCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get all dinner
    app.get("/dinner", async (req, res) => {
      const cursor = dinnerCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //breakfast by id
    app.post("/itemById", async (req, res) => {
      const id = req.body;
      const query = { _id: ObjectId(id) };
      const result =
        (await cartCollection.findOne(query)) ||
        (await breakfastCollection.findOne(query)) ||
        (await lunchCollection.findOne(query)) ||
        (await dinnerCollection.findOne(query));
      res.send(result);
    });

    //set cart data
    app.put("/cart", async (req, res) => {
      const user = req.body;
      const query = { _id: ObjectId(user._id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: user.name,
          img: user.img,
          desc: user.desc,
          price: user.price,
          email: user.email,
          quantity: user.quantity,
        },
      };
      const result = await cartCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    //get cart data using email
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      const cursor = cartCollection.find({ email });
      const result = await cursor.toArray();
      res.send(result);
    });

    //-------------------------
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//server basic call

app.get("/", (req, res) => {
  res.send("red onion server running well");
});
app.listen(port, () => {
  console.log("red onion server running from", port);
});
