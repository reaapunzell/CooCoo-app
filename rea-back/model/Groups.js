import mongoose from 'mongoose';

const Group = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  target_farmers: {
    type: Number,
    required: true,
  },
  current_farmers: {
    type: Number,
    default: 1, // The organizer counts as the first member
  },
  price_per_person: {
    type: Number,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'completed'],
    default: 'active',
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', },
  ],
});

export default mongoose.model('Group', Group);
