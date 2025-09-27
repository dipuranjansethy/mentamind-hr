import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logo?: string;
  industry?: string;
  size?: string;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    industry: { type: String },
    size: { type: String },
    subscriptionPlan: { 
      type: String, 
      enum: ['basic', 'premium', 'enterprise'], 
      default: 'basic' 
    },
    subscriptionStatus: { 
      type: String, 
      enum: ['active', 'inactive', 'trial'], 
      default: 'trial' 
    },
    subscriptionEndDate: { type: Date },
  },
  { timestamps: true }
);

// Delete the model if it exists to prevent OverwriteModelError during hot reloads in development
const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
