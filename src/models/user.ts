import mongoose from 'mongoose';

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
};

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      required: [true, 'please enter an email'],
    },

    password: String,

    salt: String,
  },
  { timestamps: true },
);

export default mongoose.model<User & mongoose.Document>('User', User);
