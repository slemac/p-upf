import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import Server from "../config/server";

const { app } = new Server();

let mongo: MongoMemoryServer;
// Instance before all of our tests set up
beforeAll(async () => {
  process.env.JWT_PRIVATE_KEY = "xDTxJn8axaXtixJgsxD";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// Instance before each of our tests set up
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//Instance after all of our tests set up
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const firstName = "Name";
  const lastName = "LastName";
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/auth/signup")
    .send({
      firstName,
      lastName,
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
