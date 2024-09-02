import asyncHandler from "express-async-handler";
import House from "../models/houseModel.js";

// Get all houses
const getHouses = asyncHandler(async (req, res) => {
  const houses = await House.find();
  // console.log(houses);
  res.status(200).json(houses);
});

// Get a single house
const getHouseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const house = await House.findById(id).populate("landlord"); // populate landlord details

  if (!house) {
    res.status(404).json({ message: "House not found" });
  }

  res.status(200).json(house);
});

// const getMyListedHouses = asyncHandler(async (req, res) => {
//   // 1. Check user authorization (assuming middleware is already implemented):
//   if (!req.user) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized to access listed houses" });
//   }

//   // 2. Fetch houses based on landlord ID:
//   const myHouses = await House.find({ landlord: req.user._id });
//   console.log(myHouses.length);
//   res.status(200).json(myHouses);
// });

// Get user tasks
const getMyListedHouses = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log(req.user);

  const myHouses = await House.find({ landlord: userId }).populate("landlord"); // Optional: populate assignedTo user

  res.status(200).json(myHouses);
});
// Create a house (requires authorization - landlord only)
// const createHouse = asyncHandler(async (req, res) => {
//   const { title, description, price, location, category, images } = req.body;

//   // Check if user is landlord (implement authorization middleware here)

//   const house = new House({
//     title,
//     description,
//     price,
//     location,
//     category,
//     images,
//     landlord: req.user._id, // Get landlord ID from authorized user
//   });

//   const createdHouse = await house.save();
//   res.status(201).json(createdHouse);
// });

const createHouse = asyncHandler(async (req, res) => {
  // const { title, description, price, location, category, images } = req.body;

  console.log("user", req.user);
  const {
    street,
    town,
    estate,
    address,
    propertyType,
    bedrooms,
    bathrooms,
    rentPrice,
    description,
    amenities,
    contactInfo,
  } = req.body;
  // 1. Check for missing fields:

  if (
    !propertyType ||
    !bedrooms ||
    !bathrooms ||
    !rentPrice ||
    !description ||
    !contactInfo ||
    !address ||
    !street ||
    !town ||
    !estate
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // 2. Check authorization (assuming middleware is already implemented):
  // if (!req.user || !req.user.isSeller) {
  //   return res.status(401).json({ message: "Unauthorized to create house" });
  // }

  try {
    // 3. Create and save house (use try-catch for database errors):
    // console.log(req.user);
    const house = new House({
      street,
      town,
      estate,
      address,
      propertyType,
      bedrooms,
      bathrooms,
      rentPrice,
      description,
      amenities,
      contactInfo,
      images: req.images,
      landlord: req.user._id,
    });
    const createdHouse = await house.save();

    res.status(201).json(createdHouse);
    console.log("success", createdHouse);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a house (requires authorization - landlord only)
const updateHouse = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log(id);
  const {
    street,
    town,
    estate,
    address,
    propertyType,
    bedrooms,
    bathrooms,
    rentPrice,
    description,
    amenities,
    contactInfo,
    images,
  } = req.body;

  // Check if user is landlord and authorized to update this house (implement authorization middleware here)

  const house = await House.findByIdAndUpdate(
    id,
    {
      street,
      town,
      estate,
      address,
      propertyType,
      bedrooms,
      bathrooms,
      rentPrice,
      description,
      amenities,
      contactInfo,
      images,
    },
    { new: true } // Return the updated house
  );

  if (!house) {
    res.status(404).json({ message: "House not found" });
  }
  console.log(house);
  res.status(200).json({ message: "House updated successfully", house });
});

// Delete a house (requires authorization - landlord only)
const deleteHouse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is landlord and authorized to delete this house (implement authorization middleware here)

  const house = await House.findByIdAndDelete(id);

  if (!house) {
    res.status(404).json({ message: "House not found" });
  }

  res.status(200).json({ message: "House deleted successfully" });
});

export {
  getHouses,
  getHouseById,
  getMyListedHouses,
  createHouse,
  updateHouse,
  deleteHouse,
};
