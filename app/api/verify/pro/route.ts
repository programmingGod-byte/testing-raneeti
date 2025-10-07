// app/api/mess/route.ts
import { NextResponse } from 'next/server';
import mongoose, { Schema, model, models } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI; // Your MongoDB URI

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env');

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

// Define Mess Schema
const MessSchema = new Schema({
  times: { type: [Date], default: [] },
  email: { type: String, required: true, unique: true }
});

// Use existing model if already compiled (Next.js hot reload fix)
const Mess = models.pro || model('pro', MessSchema);

export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success:false,error: 'email query parameter is required' }, { status: 400 });
    }

    // Find document by email or create a new one
    let pro = await Mess.findOne({ email });

    if (!pro) {
      pro = await Mess.create({ email, times: [] });
    }

    const now = new Date();
    const lastTime = pro.times.length ? pro.times[pro.times.length - 1] : null;
    const twoHoursMs = 8 * 60 * 60 * 1000;

    // Check time difference
    if (!lastTime || now.getTime() - lastTime.getTime() >= twoHoursMs) {
      pro.times.push(now);

      // Ensure times array does not exceed 11 items
      if (pro.times.length > 2) {
        pro.times = pro.times.slice(0, 2);
        return NextResponse.json({ success:false,error: 'QR expired' }, { status: 400 });
      }
      await pro.save();
    }else{
       return NextResponse.json({ success:false,error: 'QR already scanned ' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Verification successful'});

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
