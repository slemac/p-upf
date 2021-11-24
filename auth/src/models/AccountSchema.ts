import { Document, Schema, Model, model } from "mongoose";

// An interface that describes the properties
// that are requried to create a new User
interface AccountAttrs {
  firstName: string;
  lastName: string;
  username: string;
  online?: boolean;
  isVerified?: boolean;
  isPrimary: boolean;
  isBanned?: boolean;
}

// An interface that describes the properties
// that a User Model has
interface AccountModel extends Model<AccountDoc> {
  build(attrs: AccountAttrs): AccountDoc;
}

// An interface that describes the properties
// that a User Document has
export interface AccountDoc extends Document {
  firstName: string;
  lastName: string;
  username: string;
  online: boolean;
  isVerified: boolean;
  isPrimary: boolean;
  isBanned: boolean;
  createAt: string;
  updateAt: string;
}

const AccountSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      max: 40,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      max: 40,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      max: 30,
    },
    online: { type: Boolean, default: false },
    // verify account of person, company, organization or government
    isVerified: { type: Boolean, default: false },
    isPrimary: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

AccountSchema.statics.build = (attrs: AccountAttrs) => {
  return new Account(attrs);
};

export const Account = model<AccountDoc, AccountModel>(
  "Account",
  AccountSchema
);
