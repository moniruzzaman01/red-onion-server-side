const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

//database connection

const uri = `mongodb+srv://dbuser-1:k4MmRDDyhtb7FZLN@cluster0.twequ.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
