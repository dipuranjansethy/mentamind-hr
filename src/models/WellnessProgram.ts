import mongoose, { Schema, Document } from 'mongoose';

export interface IWellnessProgram extends Document {
  name: string;
  description: string;
  duration: number; // in weeks
  modules: {
    name: string;
    description: string;
    content: string;
    order: number;
    resources?: string[];
  }[];
  companyId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WellnessProgramSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // in weeks
    modules: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        content: { type: String, required: true },
        order: { type: Number, required: true },
        resources: [{ type: String }]
      }
    ],
    companyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Company', 
      required: true 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Delete the model if it exists to prevent OverwriteModelError during hot reloads in development
const WellnessProgram = mongoose.models.WellnessProgram || mongoose.model<IWellnessProgram>('WellnessProgram', WellnessProgramSchema);

export default WellnessProgram;
