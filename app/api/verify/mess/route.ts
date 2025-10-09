import { NextResponse } from 'next/server';
import mongoose, { Schema, model, models } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env');

// MongoDB connection helper
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

// Define Mess schema
const MessSchema = new Schema({
  times: { type: [Date], default: [] },
  phone: { type: String, required: true, unique: true },
  messId: { type: String, required: true },
});

// Use existing model to prevent recompilation errors in Next.js
const Mess = models.Mess || model('Mess', MessSchema);

export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');
    const messId = url.searchParams.get('messId');
    console.log(phone)
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone query parameter is required' },
        { status: 400 }
      );
    }

    if (!messId) {
      return NextResponse.json(
        { success: false, error: 'messId query parameter is required' },
        { status: 400 }
      );
    }

    // Find by phone
    let mess = await Mess.findOne({ phone });

    // Create if not exists
    if (!mess) {
      mess = await Mess.create({ phone, messId, times: [] });
    } else {
      // Update messId if changed
      if (mess.messId !== messId) {
        // mess.messId = messId;
        // await mess.save();
        return NextResponse.json(
          { success: false, error: `your original mess is ${mess.messId}` },
          { status: 400 }
        );

      }
    }

    const now = new Date();
    const lastTime = mess.times.length
      ? mess.times[mess.times.length - 1]
      : null;
    const twoHoursMs = 2.5 * 60 * 60 * 1000;

    // Check if last scan was >= 2 hours ago
    if (!lastTime || now.getTime() - lastTime.getTime() >= twoHoursMs) {
      mess.times.push(now);

      // Limit history to 11 items
      if (mess.times.length > 11) {
        mess.times = mess.times.slice(0, 11);
        return NextResponse.json(
          { success: false, error: 'mess limit exceeded' },
          { status: 400 }
        );
      }

      await mess.save();
    } else {
      return NextResponse.json(
        { success: false, error: 'already scanned try in next meal' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      messId: mess.messId,
      phone: mess.phone,
      times: mess.times,
    });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
