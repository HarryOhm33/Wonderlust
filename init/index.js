const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("Connected to DB..");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6627f075b83c3bb8c9d2cd88",
  }));
  await Listing.insertMany(initData.data);
  console.log("initialization successful...");
};

initDB();
