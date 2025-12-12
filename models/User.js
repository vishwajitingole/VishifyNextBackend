// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  status: { type: String, enum: ['active','blocked'], default: 'active' },
  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
