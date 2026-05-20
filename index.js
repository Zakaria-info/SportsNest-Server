const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const db = client.db("sportsnest");
    const FacilitiesCollection = db.collection("facilities");
    const bookingsCollection = db.collection("bookings");

    // CREATE BOOKING
app.post("/bookings", async (req, res) => {
  const bookingData = req.body;

  const result =
    await bookingsCollection.insertOne(bookingData);

  res.send(result);
});

// GET USER BOOKINGS
app.get("/bookings", async (req, res) => {
  const email = req.query.email;

  const query = {
    user_email: email,
  };

  const result = await bookingsCollection
    .find(query)
    .toArray();

  res.send(result);
});

// DELETE BOOKING
app.delete("/bookings/:id", async (req, res) => {
  const id = req.params.id;

  const query = {
    _id: new ObjectId(id),
  };

  const result =
    await bookingsCollection.deleteOne(query);

  res.send(result);
});




    app.get("/facilities", async (req, res) => {
      const result = await FacilitiesCollection.find().toArray();
      res.send(result);
    });

    app.post("/facilities", async (req, res) => {
      const facility = req.body;
      // console.log(facility);
      const result = await FacilitiesCollection.insertOne(facility);
      res.send(result);
    });

    app.get("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await FacilitiesCollection.findOne(query);
      res.send(result);
    });

    app.put("/facilities/:id", async (req, res) => {
      const { id } = req.params;
      const updatedFacility = req.body;

      const query = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: updatedFacility,
      };

      const result = await FacilitiesCollection.updateOne(query, updateDoc);

      res.send(result);
    });

    app.delete("/facilities/:id", async (req, res) => {
      const { id } = req.params;

      const query = { _id: new ObjectId(id) };

      const result = await FacilitiesCollection.deleteOne(query);

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running Fine for SportsNest!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
