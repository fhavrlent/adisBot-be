import mongoose from 'mongoose';

export type Viewer = {
  _id: string;
  name: string;
  points: number;
};

const Viewer = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true],
      index: true,
      unique: true,
    },

    points: Number,
  },
  { timestamps: true },
);

export default mongoose.model<Viewer & mongoose.Document>('Viewer', Viewer);
