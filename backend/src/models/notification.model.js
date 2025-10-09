import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    complaint_id: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    // ID of the user who will receive the notification
    recipient_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    read_status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    // Adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
