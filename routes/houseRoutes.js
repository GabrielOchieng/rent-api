import express from "express";
import {
  getHouses,
  getHouseById,
  getMyListedHouses,
  createHouse,
  updateHouse,
  deleteHouse,
} from "../controllers/houseController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer/multer.js";
import { uploadMultiple } from "../middlewares/uploads/uploadMultiple.js";

const router = express.Router();

// Get all products (public route)
router.get("/", protect, getHouses);

// Get a single product by ID (public route)
router.get("/:id", protect, getHouseById);

router.get("/:userId/houses", protect, authorize("admin"), getMyListedHouses);

// Create a new product (protected route, accessible only to sellers)
router.post(
  "/",
  protect,
  // authorize("seller"),
  upload.array("images"),
  uploadMultiple,
  createHouse
);

// Update a product (protected route, accessible only to seller who created the product)
router.put("/:id", protect, authorize("seller"), updateHouse);

// Delete a product (protected route, accessible only to seller who created the product)
router.delete("/:id", protect, authorize("seller"), deleteHouse);

export default router;
