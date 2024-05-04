const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { cloudinary } = require("../couldConfig");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs", { allListing });
};

module.exports.filter = async (req, res) => {
  let { filter } = req.params;
  const allListing = await Listing.find({ category: filter });
  res.render("./listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let { listing } = req.body;
  let newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  let data = await newListing.save();
  // console.log(data);
  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!");
    res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  let previewImg = originalImgUrl.replace("/upload", "/upload/h_150,w_250");
  res.render("./listings/edit.ejs", { listing, previewImg });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { listing } = req.body;
  let listingData = await Listing.findByIdAndUpdate(id, listing, {
    runValidators: true,
    new: true,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listingData.image = { url, filename };
    await listingData.save();
  }

  req.flash("success", "Listing Edited Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let imgUrl = listing.image.url;
  let splitUrl = imgUrl.split("/");
  let imgName = splitUrl[splitUrl.length - 1].split(".")[0];
  // console.log(imgName);

  await Listing.findByIdAndDelete(id);

  cloudinary.uploader.destroy(`wonderlust/${imgName}`);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};
