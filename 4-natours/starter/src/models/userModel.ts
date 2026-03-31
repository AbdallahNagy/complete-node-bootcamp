import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    minlength: [3, 'Name must be more than or equal to 3 chars']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [5, 'Password must be more than or equal to 5 chars']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // on create and save only
      validator: function(this: any, el: string) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined as any;
});

export default mongoose.model<IUser>('User', userSchema);
