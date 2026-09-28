import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product ka naam zaroori hai'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description zaroori hai'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price zaroori hai'],
      min: [0, 'Price negative nahi ho sakti'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count zaroori hai'],
      min: [0, 'Stock negative nahi ho sakta'],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;