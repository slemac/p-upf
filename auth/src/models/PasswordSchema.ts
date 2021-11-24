import { Document, Schema, Model, model } from "mongoose";
import { AccountDoc } from "./AccountSchema";
import { PasswordManager } from "../services";

// An interface that describes the properties
// that are requried to create a new User
interface PasswordAttrs {
  account: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface PasswordModel extends Model<PasswordDoc> {
  build(attrs: PasswordAttrs): PasswordDoc;
}

// An interface that describes the properties
// that a User Document has
interface PasswordDoc extends Document {
  account: AccountDoc["_id"];
  password: string;
}

const PasswordSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    password: {
      type: String,
      required: true,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
);

PasswordSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

PasswordSchema.statics.build = (attrs: PasswordAttrs) => {
  return new Password(attrs);
};

export const Password = model<PasswordDoc, PasswordModel>(
  "Password",
  PasswordSchema
);
