const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
router.route("/")
//index route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
//show route
.get(isLoggedIn,validateListing,wrapAsync(listingController.showListing))
//update route
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
//Delete Route
.delete(isOwner,isLoggedIn, wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.editListing));


module.exports = router;