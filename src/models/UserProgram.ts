import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgram extends Document {
  userId: mongoose.Types.ObjectId;
  programId: mongoose.Types.ObjectId;
  progress: number; // percentage of completion
  currentModule: number;
  completedModules: number[];
  startDate: Date;
  completionDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgramSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    programId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'WellnessProgram', 
      required: true 
    },
    progress: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 100 
    },
    currentModule: { type: Number, default: 0 },
    completedModules: [{ type: Number }],
    startDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a compound index for userId and programId to ensure uniqueness
UserProgramSchema.index({ userId: 1, programId: 1 }, { unique: true });

// Delete the model if it exists to prevent OverwriteModelError during hot reloads in development
const UserProgram = mongoose.models.UserProgram || mongoose.model<IUserProgram>('UserProgram', UserProgramSchema);

export default UserProgram;
