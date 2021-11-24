import { Document, Schema, Model, model } from "mongoose";
import { AccountDoc } from "./AccountSchema";

// An interface that describes the properties
// that are requried to create a new User
interface EmailAttrs {
  account: string;
  email: string;
  isVerified?: boolean;
}

// An interface that describes the properties
// that a User Model has
interface EmailModel extends Model<EmailDoc> {
  build(attrs: EmailAttrs): EmailDoc;
}

// An interface that describes the properties
// that a User Document has
interface EmailDoc extends Document {
  account: AccountDoc["_id"];
  email: string;
  isVerified: boolean;
  createAt: string;
  updateAt: string;
}

const EmailSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

EmailSchema.statics.build = (attrs: EmailAttrs) => {
  return new Email(attrs);
};

export const Email = model<EmailDoc, EmailModel>("Email", EmailSchema);
