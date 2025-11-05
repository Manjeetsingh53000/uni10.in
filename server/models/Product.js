const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    image_url: { type: String },
    description: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 },
    attributes: { type: Object, default: {} },
    sizes: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ProductSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.image_url && this.images && this.images.length) {
    this.image_url = this.images[0];
  }
  next();
});

// Helpful indexes for search/filter
ProductSchema.index({ title: 'text' });
ProductSchema.index({ category: 1, active: 1 });

module.exports = mongoose.model('Product', ProductSchema);
