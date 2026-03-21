import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['apartment', 'house', 'land', 'commercial']
    },
    listingType: {
      type: String,
      required: true,
      enum: ['sale', 'rent']
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'TRY' },
    size: { type: Number, min: 0 },
    features: {
      rooms: { type: Number, min: 0 },
      bathrooms: { type: Number, min: 0 },
      floor: { type: Number },
      heating: { type: String, trim: true }
    },
    location: {
      city: { type: String, required: true, trim: true },
      district: { type: String, trim: true },
      address: { type: String, trim: true }
    },
    viewCount: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

propertySchema.index({ 'location.city': 1, price: 1, listingType: 1 });
propertySchema.index({ title: 'text', description: 'text' });

const Property = mongoose.model('Property', propertySchema);

export default Property;
