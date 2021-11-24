import request from "supertest";
import Server from "../../config/server";
const { app } = new Server();

///////
//Route: /api/auth/signup
///////

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "alskdflaskjfd",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "alskdflaskjfd",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      password: "alskjdf",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

///////
//Route: /api/auth/signin
///////

it("fails when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/auth/signin")
    .send({
      usernameOrEmail: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/auth/signin")
    .send({
      usernameOrEmail: "test@test.com",
      password: "aslkdfjalskdfj",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      usernameOrEmail: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

///////
//Route: /api/auth/currentAccount
///////

it("responds with details about the current account", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/auth/currentAccount")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentAccount.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/auth/currentAccount")
    .send()
    .expect(200);

  expect(response.body.currentAccount).toEqual(null);
});

///////
//Route: /api/auth/signout
///////

it("clears the cookie after signing out", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send({
      firstName: "Name",
      lastName: "LastName",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/auth/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
