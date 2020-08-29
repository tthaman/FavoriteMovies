
const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');

describe("/login", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const testUsers = [
    {
    password: "helpme",
    email: "someone@gmail.com",
    firstName: "Betty",
    lastName: "White",
    roles: ['user']
    },
    {
    password: "jellybeans",
    email: "someoneelse@gmail.com",
    firstName: "Georgia",
    lastName: "Beans",
    roles: ['user']
    },
    ];

    module.exports = { testUsers };

  describe("before signup", () => {
    describe("POST /", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/login").send(testUsers[0]);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("POST /password", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/login/password").send(testUsers[0]);
        expect(res.statusCode).toEqual(401);
      });
    });

    describe("POST /logout", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/login/logout").send();
        expect(res.statusCode).toEqual(401);
      });
    });
  });

  describe("signup ", () => {
    describe("POST /signup", () => {
      it("should return 400 without a password", async () => {
        const res = await request(server).post("/login/signup").send({
          email: testUsers[0].email
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 400 with empty password", async () => {
        const res = await request(server).post("/login/signup").send({
          email: testUsers[1].email,
          password: ""
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 200 and with a password", async () => {
        const res = await request(server).post("/login/signup").send(testUsers[1]);
        expect(res.statusCode).toEqual(200);
      });
      it("should return 409 Conflict with a repeat signup", async () => {
        let res = await request(server).post("/login/signup").send(testUsers[0]);
        expect(res.statusCode).toEqual(200);
        res = await request(server).post("/login/signup").send(testUsers[0]);
        expect(res.statusCode).toEqual(409);
      });
      it("should not store raw password", async () => {
        await request(server).post("/login/signup").send(testUsers[0]);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user).includes(testUsers[0].password)).toBe(false);
        });
      });
    });
  });
  describe.each([testUsers[0], testUsers[1]])("User %#", (user) => {
    beforeEach(async () => {
      await request(server).post("/login/signup").send(testUsers[0]);
      await request(server).post("/login/signup").send(testUsers[1]);
    });

    describe("POST /", () => {
      it("should return 400 when password isn't provided", async () => {
        const res = await request(server).post("/login").send({
          email: user.email
        });
        expect(res.statusCode).toEqual(400);
      });
      it("should return 401 when password doesn't match", async () => {
        const res = await request(server).post("/login").send({
          email: user.email,
          password: '123'
        });
        expect(res.statusCode).toEqual(401);
      });
      it("should return 200 and a token when password matches", async () => {
        const res = await request(server).post("/login").send(user);
        console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body.token).toEqual('string');
      });
      it("should not store token on user", async () => {
        const res = await request(server).post("/login").send(user);
        const token = res.body.token;
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(token);
        });
      });
    });
  });
  describe("After both users login", () => {
    let token0;
    let token1;
    beforeEach(async () => {
      await request(server).post("/login/signup").send(testUsers[0]);
      const res0 = await request(server).post("/login").send(testUsers[0]);
      token0 = res0.body.token;
      await request(server).post("/login/signup").send(testUsers[1]);
      const res1 = await request(server).post("/login").send(testUsers[1]);
      token1 = res1.body.token;
    });

    describe("POST /password", () => {
      it("should reject bogus token", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer BAD')
          .send({ password: '123' });
        expect(res.statusCode).toEqual(401);
      });
      it("should reject empty password", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token0)
          .send({ password: '' });
        expect(res.statusCode).toEqual(400);
      });
      it("should change password for user0", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token0)
          .send({ password: '123' });
        expect(res.statusCode).toEqual(200);
        let loginRes0 = await request(server).post("/login").send(testUsers[0]);
        expect(loginRes0.statusCode).toEqual(401);
        loginRes0 = await request(server).post("/login").send({
          email: testUsers[0].email,
          password: '123'
        });
        expect(loginRes0.statusCode).toEqual(200);
        const loginRes1 = await request(server).post("/login").send(testUsers[1]);
        expect(loginRes1.statusCode).toEqual(200);
      });
      it("should change password for user1", async () => {
        const res = await request(server)
          .post("/login/password")
          .set('Authorization', 'Bearer ' + token1)
          .send({ password: '123' });
        expect(res.statusCode).toEqual(200);
        const loginRes0 = await request(server).post("/login").send(testUsers[0]);
        expect(loginRes0.statusCode).toEqual(200);
        let loginRes1 = await request(server).post("/login").send(testUsers[1]);
        expect(loginRes1.statusCode).toEqual(401);
        loginRes1 = await request(server).post("/login").send({
          email: testUsers[1].email,
          password: '123'
        });
        expect(loginRes1.statusCode).toEqual(200);
      });
    });
      describe("POST /logout", () => {
        it("should reject bogus token", async () => {
          const res = await request(server)
            .post("/login/logout")
            .set('Authorization', 'Bearer BAD')
            .send();
          expect(res.statusCode).toEqual(401);
        });
        it("should prevent only user0 from making a password change", async () => {
          const res = await request(server)
            .post("/login/logout")
            .set('Authorization', 'Bearer ' + token0)
            .send();
          expect(res.statusCode).toEqual(200);
          const res0 = await request(server)
            .post("/login/password")
            .set('Authorization', 'Bearer ' + token0)
            .send({ password: '123' });
          expect(res0.statusCode).toEqual(401);
          const res1 = await request(server)
            .post("/login/password")
            .set('Authorization', 'Bearer ' + token1)
            .send({ password: '123' });
          expect(res1.statusCode).toEqual(200);
        });
        it("should prevent only user1 from making a password change", async () => {
          const res = await request(server)
            .post("/login/logout")
            .set('Authorization', 'Bearer ' + token1)
            .send();
          expect(res.statusCode).toEqual(200);
          const res0 = await request(server)
            .post("/login/password")
            .set('Authorization', 'Bearer ' + token0)
            .send({ password: '123' });
          expect(res0.statusCode).toEqual(200);
          const res1 = await request(server)
            .post("/login/password")
            .set('Authorization', 'Bearer ' + token1)
            .send({ password: '123' });
          expect(res1.statusCode).toEqual(401);
        });
    });
  });
});
