const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: false });

module.exports = mongoose.model('Review', ReviewSchema);
