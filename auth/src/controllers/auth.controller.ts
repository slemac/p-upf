import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors";
import { Account, Auth, Email, Password } from "../models";
import { PasswordManager } from "../services";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const existingEmail = await Email.findOne({ email });

  if (existingEmail) {
    throw new BadRequestError("Email in use");
  }

  // generate username
  const fullName: string = `${firstName.trim().replace(/\s/g, ".")}.${lastName
    .trim()
    .replace(/\s/g, ".")}`;
  const purifyString = fullName.replace(
    /[&\/\\#,+()|^$~`!¡@%*'":;'*¿?<>{}[\]\\]/g,
    ""
  );
  const val = Math.floor(1000 + Math.random() * 9000);
  const username = purifyString + "." + val;

  const account = Account.build({
    firstName,
    lastName,
    username,
    isPrimary: true,
  });

  const pass = Password.build({ account: account._id, password });
  const emailDb = Email.build({ account: account._id, email });
  const auth = Auth.build({
    account: account._id,
    username,
    emails: [{ email }],
    password,
  });

  await Promise.all([account.save(), pass.save(), emailDb.save(), auth.save()]);
  // Generate JWT
  const accountJwt = jwt.sign(
    {
      id: account._id,
      email,
    },
    process.env.JWT_PRIVATE_KEY!
  );

  // Store it on session object
  req.session = {
    jwt: accountJwt,
  };

  return res.status(201).send({ account });
};

export const login = async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;

  const authCheck = await Auth.aggregate([
    {
      $match: {
        $or: [
          { username: usernameOrEmail, isBanned: false },
          { "emails.email": usernameOrEmail, isBanned: false },
        ],
      },
    },
    {
      $lookup: {
        from: "accounts",
        let: { account: "$account" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$account"],
              },
            },
          },
          {
            $project: {
              id: "$_id",
              _id: 0,
              firstName: 1,
              lastName: 1,
              username: 1,
              online: 1,
              isVerified: 1,
              isBanned: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        as: "dataAccount",
      },
    },
  ]);

  if (!authCheck[0]) {
    throw new BadRequestError("Invalid credentials");
  }

  const passwordsMatch = await PasswordManager.compare(
    authCheck[0].password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid Credentials");
  }

  // Generate JWT
  const accountJwt = jwt.sign(
    {
      id: authCheck[0]._id,
    },
    process.env.JWT_PRIVATE_KEY!
  );

  // // Store it on session object
  req.session = {
    jwt: accountJwt,
  };

  return res.status(200).send({ account: authCheck[0].dataAccount[0] });
};

export const getCurrentAccount = async (req: Request, res: Response) => {
  return res.send({ currentAccount: req.currentAccount || null });
};

export const logout = async (req: Request, res: Response) => {
  req.session = null;

  res.send({});
};
