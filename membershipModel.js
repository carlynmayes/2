const mongoose = require('mongoose')

// Define the shape and rules for documents in the glazeBookCollection collection
const membershipSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'Please add an id'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    recurring: {
      type: Number,
      required: [true, 'Please add a recurring value'],
    },
    discount: {
      type: Number,
      required: [true, 'Please add a discount'],
    },
    active: {
      type: Boolean,
      required: [true, 'Please add an active value'],
    },
  },
  {
    timestamps: true,
  }
)

// Third argument tells Mongoose to use your existing collection name exactly.
module.exports = mongoose.model('Membership', membershipSchema, 'glazeBookCollection')
