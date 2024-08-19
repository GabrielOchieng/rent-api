// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   location: {
//     type: String,
//     optional: true,
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   images: {
//     type: [String],
//     optional: true,
//   },
//   seller: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Product = mongoose.model("Product", productSchema);

// export default Product;

import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    street: { type: String, required: true },
    town: { type: String, required: true },
    estate: { type: String, required: true },
    address: { type: String, required: true },
    // Consider adding geolocation for map integration

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "House",
        "Bedsitter",
        "Single",
        "OneBedroom",
        "TwoBedroom",
        "ThreeBedroom",
        "Home",
      ],
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    rentPrice: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
    },
    description: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String], // Array of amenities (laundry, parking, etc.)
    },
    contactInfo: {
      type: String, // Email or phone number
    },
    // Add a field for secure messaging within the platform (optional)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

export default House;
