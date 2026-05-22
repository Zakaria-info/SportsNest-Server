const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
dotenv.config();
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://sportsnest-six.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// const JWKS_URL =
//   process.env.JWKS_URL ||
//   (process.env.CLIENT_URL
//     ? `${process.env.CLIENT_URL}/api/auth/jwks`
//     : undefined);
// let JWKS;
// if (JWKS_URL) {
//   try {
//     JWKS = createRemoteJWKSet(new URL(JWKS_URL));
//   } catch (err) {
//     console.error("Invalid JWKS URL:", JWKS_URL, err);
//   }
// } else {
//   console.warn(
//     "No JWKS URL configured (set JWKS_URL or CLIENT_URL). Auth will be disabled.",
//   );
// }

// const verifyToken = async (req, res, next) => {
//   const authHeader = req?.headers.authorization;
//   console.log("Authorization header:", authHeader);
//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }
//   const token = authHeader?.split(" ")[1];
//   console.log(token);
//   // if(!token){
//   //   return res.status(401).send({ message: "Unauthorized Access" });
//   // }
//   try {
//     if (!JWKS) {
//       console.error("Attempt to verify token but JWKS is not configured.");
//       return res
//         .status(500)
//         .send({ message: "Authentication not configured on server" });
//     }
//     const { payload } = await jwtVerify(token, JWKS);
//     console.log("Verified token payload:", payload);
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }
// };
async function run() {
  try {
    // await client.connect();
    const db = client.db("sportsnest");
    const FacilitiesCollection = db.collection("facilities");
    const bookingsCollection = db.collection("bookings");

    // CREATE BOOKING
    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;

      const result = await bookingsCollection.insertOne(bookingData);

      res.send(result);
    });

    // GET USER BOOKINGS
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;

      const query = {
        user_email: email,
      };

      const result = await bookingsCollection.find(query).toArray();

      res.send(result);
    });

    // DELETE BOOKING
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await bookingsCollection.deleteOne(query);

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

    // await client.db("admin").command({ ping: 1 });
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
