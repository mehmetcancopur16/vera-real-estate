import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'E-posta gerekli'],
      unique: true,
      lowercase: true,
      trim: true
    },
    avatarUrl: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Şifre gerekli'],
      minlength: [6, 'Şifre en az 6 karakter olmalı'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'professional', 'corporate'],
        default: 'free'
      },
      expiresAt: {
        type: Date,
        default: null
      }
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
