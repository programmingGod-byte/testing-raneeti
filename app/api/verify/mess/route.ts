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
  phone: { type: String, required: true, unique: true }
});

// Use existing model if already compiled (Next.js hot reload fix)
const Mess = models.Mess || model('mess', MessSchema);

export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success:false,error: 'Phone query parameter is required' }, { status: 400 });
    }

    // Find document by phone or create a new one
    let mess = await Mess.findOne({ phone });

    if (!mess) {
      mess = await Mess.create({ phone, times: [] });
    }

    const now = new Date();
    const lastTime = mess.times.length ? mess.times[mess.times.length - 1] : null;
    const twoHoursMs = 2 * 60 * 60 * 1000;

    // Check time difference
    if (!lastTime || now.getTime() - lastTime.getTime() >= twoHoursMs) {
      mess.times.push(now);

      // Ensure times array does not exceed 11 items
      if (mess.times.length > 11) {
        mess.times = mess.times.slice(0, 11);
        return NextResponse.json({ success:false,error: 'mess limit exceeded' }, { status: 400 });
      }
      await mess.save();
    }else{
       return NextResponse.json({ success:false,error: 'already scanned ' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Verification successful'});

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
