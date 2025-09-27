import mongoose, { Schema, Document } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mood: number;
  date: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    mood: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    tags: [{ 
      type: String 
    }]
  },
  { timestamps: true }
);

// Create a compound index for userId and date to optimize queries
JournalEntrySchema.index({ userId: 1, date: -1 });

// Delete the model if it exists to prevent OverwriteModelError during hot reloads in development
const JournalEntry = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

export default JournalEntry;
