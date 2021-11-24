import { Document, Schema, Model, model } from "mongoose";
import { AccountDoc } from ".";
import { PasswordManager } from "../services";

// An interface that describes the properties
// that are requried to create a new User
interface AuthAttrs {
  account: string;
  username: string;
  emails: Array<Email>;
  password: string;
  isBanned?: boolean;
}

interface Email {
  email: string;
}

// An interface that describes the properties
// that a User Model has
interface AuthModel extends Model<AuthDoc> {
  build(attrs: AuthAttrs): AuthDoc;
}

// An interface that describes the properties
// that a User Document has
interface AuthDoc extends Document {
  account: AccountDoc["_id"];
  username: string;
  email: Array<Email>;
  password: string;
  isBanned?: boolean;
}

const AuthSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      max: 30,
    },
    emails: [
      {
        email: {
          type: String,
          required: true,
          lowercase: true,
          max: 50,
        },
      },
    ],
    password: {
      type: String,
      required: true,
      max: 50,
    },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

AuthSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

AuthSchema.statics.build = (attrs: AuthAttrs) => {
  return new Auth(attrs);
};

export const Auth = model<AuthDoc, AuthModel>("Auth", AuthSchema);
