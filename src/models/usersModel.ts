import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  description?: string;
  createdAt: Date;
}

const usersSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const UsersModel = mongoose.model<IUser>('User', usersSchema);
export default UsersModel;
