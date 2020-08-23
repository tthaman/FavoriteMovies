  
const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const User = require('../models/user');

describe("/users", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
  
    afterEach(testUtils.clearDB);
  
    const testUsers = [
        {
        password: "helpme",
        email: "someone@gmail.com",
        firstName: "Betty",
        lastName: "White",
        avatar: "cat",
        roles: ['admin']
        },
        {
        password: "jellybeans",
        email: "someoneelse@gmail.com",
        firstName: "Georgia",
        lastName: "Beans",
        avatar: "tree",
        roles: ['user']
        },
    ];

  describe("GET /", () => {
    it("should return all users", async () => {
      const res = await request(server).get("/users");
      expect(res.statusCode).toEqual(200);
      testUsers.forEach(user => {
        expect(res.body).toContainEqual(
          expect.objectContaining(user)
        )
      })
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if no matching id", async () => {
      const res = await request(server).get("/users/id1");
      expect(res.statusCode).toEqual(404);
    });

    it.each(testUsers)("should find user # %#", async (user) => {
      const res = await request(server).get("/users/" + user._id);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(user);
    })
  });

  describe("PUT /:id", () => {
    it("should reject a user with an empty body", async () => {
      const { _id } = testUsers[0];
      const res = await request(server).put("/users/" + _id).send({});
      expect(res.statusCode).toEqual(400);
    });

    it("should reject a bad id", async () => {
      const res = await request(server).put("/users/fake").send(testUsers[0]);
      expect(res.statusCode).toEqual(400);
    });

    it("should update a user", async () => {
      const originalUser = testUser[1];
      const user = { ...originalUser };
      user.lastName = "Smith";
      const res = await request(server).put("/users/" + user._id).send(user);
      expect(res.statusCode).toEqual(200);
     
      const savedUser = await User.findOne({ _id: user._id }).lean();
      savedUser._id = savedUser._id.toString();
      expect(savedUser).toMatchObject(user);
    });
  });

  describe("DELETE /:id", () => {
    it("should reject a bad id", async () => {
      const res = await request(server).delete("/users/fake").send();
      expect(res.statusCode).toEqual(400);
    });
    
    it("should delete the expected user", async () => {
      const { _id } = testUsers[1];
      const res = await request(server).delete("/users/" + _id).send({});
      expect(res.statusCode).toEqual(200);
      const storedUser = await User.findOne({ _id });
      expect(storedUser).toBeNull();
    });
  });
});