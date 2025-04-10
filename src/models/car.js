const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  make: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 5,
  },
  type: {
    type: String,
    required: true,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury'],
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Automatic', 'Manual'],
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  // Location fields
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  images: [{
    path: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  }],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  features: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'rented', 'maintenance', 'inactive'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update the updatedAt field before saving
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Car', carSchema);