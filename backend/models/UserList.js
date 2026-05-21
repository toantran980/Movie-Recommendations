const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movieId: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['favorite', 'watchlist'],
        required: true,
    },
    title: String,
    poster_path: String,
    release_date: String,
    vote_average: Number,
    rating: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        default: '',
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

userListSchema.index({ userId: 1, movieId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('UserList', userListSchema);
