import mongoose from "mongoose";
import request from "supertest";
import { app, server } from "../server.js";
import dotenv from "dotenv";
import connectDB from "../config/db";
dotenv.config();

let dbConnection;

beforeEach(async () => {
  dbConnection = await connectDB();
});

describe("Get /houses", () => {
  it("should return all houses", async () => {
    const response = await request(app).get("/houses");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

// describe("GET /houses/:id", () => {
//   it("should return a specific house", async () => {
//     const response = await request(app).get("/houses/66cc8350aa5065619876f28");
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("propertyType");
//   });
// });

// describe("POST /houses", () => {
//   it("should create a house", async () => {
//     const res = await request(app)
//       .post("/houses")
//       .send({
//         propertyType: "Apartment",
//         address: "123 Main St",
//         street: "Kombewa",
//         town: "Nairobi",
//         estate: "Kenyatta",
//         landlord: "12345",
//         contactInfo: "johndoe@example.com",
//         rentPrice: 1500,
//         bedrooms: 3,
//         bathrooms: 2,
//         description: "Beautiful apartment with private pool",
//         photos: ["photo1.jpg", "photo2.jpg"],
//       });
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("_id");
//   });
// });
