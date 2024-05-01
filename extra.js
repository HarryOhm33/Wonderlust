const mongoose = require("mongoose");
const Listing = require("./models/listing");

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

const findData = async () => {
  let listing = await Listing.findById("65fbdd234762f86538f725ad");
  console.log(listing);
};
const deleteData = async () => {
  let listing = await Listing.findById("65fbdd234762f86538f725ad");
  listing.reviews.pop();
  await listing.save();
};

// deleteData();
// findData();
