const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken:
    "pk.eyJ1IjoiaGFycnlvaG0zMyIsImEiOiJjbHZsN3ZxMzMwdDV2MmxwcGVvNDRwYTY5In0.Lpf98KbvW6zxLQElWXbd2w",
});

const express = require("express");
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");

// const MONO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl =
  "mongodb+srv://hari333333om:3y32irCKtdH8BGvL@cluster0.7p4sjtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("Connected to DB..");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "sdjksdfksdllsirirti",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo Store Session", err);
});

const sessionOptions = {
  store,
  secret: "sdjksdfksdllsirirti",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

// main()
//   .then(() => {
//     console.log("Connected to DB..");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONO_URL);
// }

const getListing = async () => {
  for (data of initData.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: `${data.location}, ${data.country}`,
        limit: 1,
      })
      .send();

    data.geometry = response.body.features[0].geometry;
  }
};

const initDB = async () => {
  for (data of initData.data) {
    let response = await geocodingClient
      .forwardGeocode({
        query: `${data.location}, ${data.country}`,
        limit: 1,
      })
      .send();

    data.geometry = response.body.features[0].geometry;
  }

  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6636843459f429c61e191c97",
    // geometry:
  }));
  await Listing.insertMany(initData.data);
  console.log("initialization successful...");
};

initDB();

// getListing();
