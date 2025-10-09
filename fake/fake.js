const mongoose = require("mongoose");
const { Schema } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/testdb";

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Define Mess Schema
const MessSchema = new Schema({
  times: { type: [Date], default: [] },
  phone: { type: String, required: true, unique: true },
  messId: { type: String, required: true },
});

const Mess = mongoose.models.Mess || mongoose.model("mess", MessSchema);

// Seed function
async function seedMessData() {
  await connectDB();

  // Clear existing data
  await Mess.deleteMany({});
  console.log("🧹 Cleared existing Mess data");

  // Create fake Mess data
  const fakeData = [
    {
      phone: "9942534071",
      messId: "oak",
      times: [], // 10 hours ago
    },
    {
      phone: "9311039309",
      messId: "oak",
      times: [], // empty times array
    },
    
  ];

  await Mess.insertMany(fakeData);

  console.log("✅ Inserted fake Mess data successfully!");
  mongoose.connection.close();
}

// Run the script
seedMessData();
