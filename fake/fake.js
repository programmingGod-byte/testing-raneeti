const mongoose = require("mongoose");
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
const MessSchema = new mongoose.Schema({
  times: { type: [Date], default: [] },
  email: { type: String, required: true, unique: true },
});

const Mess = mongoose.models.Mess || mongoose.model("pro", MessSchema);

// Seed function
async function seedMessData() {
  await connectDB();

  // Clear existing data (optional)
  await Mess.deleteMany({});
  console.log("🧹 Cleared existing Mess data");

  // Create fake Mess data
  const fakeData = [
    {
      email: "1",
      times: [
        new Date(Date.now() - 1000 * 60 * 60 * 10),
        
      ],
    },
    {
      email: "2",
      times: [
      
      ],
    },
    {
      email: "3",
      times: [
        new Date(Date.now() - 1000 * 60 * 60 * 6),
        new Date(Date.now() - 1000 * 60 * 60 * 1),
      ],
    },
  ];

  await Mess.insertMany(fakeData);

  console.log("✅ Inserted fake Mess data successfully!");
  mongoose.connection.close();
}

// Run the script
seedMessData();
