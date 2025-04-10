const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;
        const userId = req.user.id;

        if (!amount || !bookingId) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Amount and bookingId are required'
            });
        }

        // Convert amount to cents for Stripe
        const amountInCents = Math.round(amount * 100);

        console.log('Creating payment intent:', {
            amount: amountInCents,
            bookingId,
            userId
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            metadata: {
                bookingId,
                userId
            }
        });

        console.log('Payment intent created:', paymentIntent.id);

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            error: 'Failed to create payment intent',
            details: error.message
        });
    }
};

const getStripeConfig = async (req, res) => {
    try {
        console.log('Retrieving Stripe configuration');
        res.json({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        console.error('Error getting Stripe config:', error);
        res.status(500).json({
            error: 'Failed to get Stripe configuration',
            details: error.message
        });
    }
};

module.exports = {
    createPaymentIntent,
    getStripeConfig
}; 