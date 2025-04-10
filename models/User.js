const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    phone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    cars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    profileImage: {
        type: String
    },
    verificationStatus: {
        type: Boolean,
        default: false
    },
    documents: [{
        type: String,
        description: String
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Method to add a car
userSchema.methods.addCar = async function(carId) {
    if (!this.cars.includes(carId)) {
        this.cars.push(carId);
        await this.save();
    }
};

// Method to remove a car
userSchema.methods.removeCar = async function(carId) {
    this.cars = this.cars.filter(id => id.toString() !== carId.toString());
    await this.save();
};

// Method to add a booking
userSchema.methods.addBooking = async function(bookingId) {
    if (!this.bookings.includes(bookingId)) {
        this.bookings.push(bookingId);
        await this.save();
    }
};

// Method to add a review
userSchema.methods.addReview = async function(reviewId) {
    if (!this.reviews.includes(reviewId)) {
        this.reviews.push(reviewId);
        await this.save();
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 