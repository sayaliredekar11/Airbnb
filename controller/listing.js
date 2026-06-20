const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs",{allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs");
};
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id).populate("owner").populate({path:"reviews",populate:{path:"author"}});
    if(!listings){
       req.flash("error","Listing you requested for does not exist");
       return res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listings});
};
module.exports.createListing = async(req,res,next) => {


let url = req.file.path;
let filename = req.file.filename;
console.log(url);
console.log(filename);
let result = listingSchema.validate(req.body);
if(result.error){
    throw new ExpressError(400,result.error);
}
const newListing = new Listing(req.body.listing);
 newListing.owner = req.user._id;
 newListing.image = {url,filename};
await newListing.save();
req.flash("success","New Listing created!");
res.redirect("/listings");
};
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you requested for does not exist");
       return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_300");
    res.render("listing/edit.ejs",{listing, originalImageUrl});
};
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
   await listing.save();
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};
