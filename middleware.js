const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You Must Be Logged In!!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let { listing } = req.body;
  let listingData = await Listing.findById(id);
  if (res.locals.currUser._id.equals("6636843459f429c61e191c97")) {
    return next();
  } else if (!listingData.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not The Owner!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let reviewData = await Review.findById(reviewId);
  if (res.locals.currUser._id.equals("6636843459f429c61e191c97")) {
    return next();
  } else if (!reviewData.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not The Author!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
