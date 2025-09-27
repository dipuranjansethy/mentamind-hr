import mongoose, { Schema, Document } from 'mongoose';

export interface IWellnessData extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  moodScore: number;
  stressLevel: number;
  sleepHours?: number;
  focusScore?: number;
  journalEntry?: string;
  meditationMinutes?: number;
  wellnessActivities?: string[];
  burnoutRiskScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const WellnessDataSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    date: { type: Date, default: Date.now },
    moodScore: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 10 
    },
    stressLevel: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 10 
    },
    sleepHours: { 
      type: Number, 
      min: 0, 
      max: 24 
    },
    focusScore: { 
      type: Number, 
      min: 1, 
      max: 10 
    },
    journalEntry: { type: String },
    meditationMinutes: { type: Number, min: 0 },
    wellnessActivities: [{ type: String }],
    burnoutRiskScore: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
  },
  { timestamps: true }
);

// Create a compound index for userId and date to ensure uniqueness
WellnessDataSchema.index({ userId: 1, date: 1 }, { unique: true });

// Delete the model if it exists to prevent OverwriteModelError during hot reloads in development
const WellnessData = mongoose.models.WellnessData || mongoose.model<IWellnessData>('WellnessData', WellnessDataSchema);

export default WellnessData;
