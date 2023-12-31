import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

interface Interview extends Document {
  [x: string]: any;
  title: string;
  description: string;
  startDate: Date;
  startTime: string;
  endTime?: string;
  hr: mongoose.Schema.Types.ObjectId;
  candidate: mongoose.Schema.Types.ObjectId;
  status: 'Scheduled' | 'Cancelled' | 'Completed' | 'Live' | 'Postponed' | 'Rescheduled';
  room?: Record<string, any>;
}

export default Interview;