import mongoose from 'mongoose';

export type Command = {
  _id: string;
  command: string;
  response: string;
  aliases: string[];
  keywords: string[];
};

const Command = new mongoose.Schema(
  {
    command: {
      type: String,
      required: [true, 'Please enter a command'],
      index: true,
      lowercase: true,
      unique: true,
    },

    response: {
      type: String,
      lowercase: true,
      index: true,
      required: [true, 'Please enter a command response'],
    },
    aliases: {
      type: [String],
      lowercase: true,
    },
    keywords: {
      type: [String],
      lowercase: true,
    },
  },

  { timestamps: true },
);

export default mongoose.model<Command & mongoose.Document>('Command', Command);
