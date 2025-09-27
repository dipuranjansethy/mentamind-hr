import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'workplace' | 'self';
  title: string;
  content: string;
  rating: number;
  suggestions: string;
  anonymous: boolean;
  department: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      enum: ['workplace', 'self'],
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
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    suggestions: {
      type: String,
      required: false
    },
    anonymous: {
      type: Boolean,
      default: false
    },
    department: {
      type: String,
      required: true
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create indexes for common queries
ReviewSchema.index({ userId: 1, type: 1 });
ReviewSchema.index({ department: 1, type: 1 });
ReviewSchema.index({ createdAt: -1 });

// Delete the model if it exists to prevent OverwriteModelError during hot reloads in development
const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
