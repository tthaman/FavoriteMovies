  
// const request = require("supertest");

// const server = require("../server");
// const testUtils = require('../test-utils');
// const User = require('../models/user');

// const { testUsers } = require('./login.test');

// describe("/users", () => {
//     beforeAll(testUtils.connectDB);
//     afterAll(testUtils.stopDB);
  
//     afterEach(testUtils.clearDB);
    
//     let users;
//     beforeEach(async () => {
//         users = (await User.insertMany(testUsers)).map(i => i.toJSON())
//        // users.forEach(i => i._id = i._id.toString());
//     });

//     // describe.each(testUsers)("GET /:id user %#", (user) => {
//     //     let user0Id, user1Id;
//     //     beforeEach(async () => {
//     //       const res0 = await request(server)
//     //         .post("/users")
//     //         .set('Authorization', 'Bearer ' + token0)
//     //         .send(items.map(i => i._id));
//     //       user0Id = res0.body._id;
//     //       const res1 = await request(server)
//     //         .post("/orders")
//     //         .set('Authorization', 'Bearer ' + adminToken)
//     //         .send([items[1]].map(i => i._id));
//     //       user1Id = res1.body._id;
//     //     });
//     //     it('should send 200 to normal user', async () => {
//     //       const res = await request(server)
//     //         .get("/users/" + user0Id)
//     //         .set('Authorization', 'Bearer ' + token0)
//     //         .send();
//     //       expect(res.statusCode).toEqual(200);
//     //       expect(res.body).toMatchObject({
//     //         password: "comeonnow",
//     //         email: "why@gmail.com",
//     //         firstName: "Mr. ",
//     //         lastName: "Beans",
//     //         avatar: "tree",
//     //         roles: ['user']
//     //         });
//     //     });
//         // it("should return 404 if no matching id", async () => {
//         //     const res = await request(server).get("/users/id1");
//         //     expect(res.statusCode).toEqual(404);
//         //   });     
//         //   it("should find user # %#", async () => {
//         //     const res = await request(server).get("/users/" + user._id);
//         //     expect(res.statusCode).toEqual(200);
//         //     expect(res.body).toMatchObject(user);
//         //   })
//         // });
//    // });
//     // describe("GET / ", () => {
//     //     it('should return all users', async () => {
//     //         const res = await request(server).get("/users");
//     //         expect(res.statusCode).toEqual(200);
//     //         testUsers.forEach(user => {
//     //           expect(res.body).toContainEqual(
//     //             expect.objectContaining(user)
//     //           )
//     //         })
//     //     });
//     // });
  
//     describe('Before login', () => {
//       describe('PUT /:id', () => {
//         it('should send 401 without a token', async () => {
//           const res = await request(server).get("/users/123").send(testUsers[0]);
//           expect(res.statusCode).toEqual(401);
//         });
//         it('should send 401 with a bad token', async () => {
//           const res = await request(server)
//             .get("/users/456")
//             .set('Authorization', 'Bearer BAD')
//             .send();
//           expect(res.statusCode).toEqual(401);
//         });
//       });
//       describe('DELETE /:id', () => {
//         it('should send 401 without a token', async () => {
//           const res = await request(server).get("/users/123").send(testUsers[0]);
//           expect(res.statusCode).toEqual(401);
//         });
//         it('should send 401 with a bad token', async () => {
//           const res = await request(server)
//             .get("/users/456")
//             .set('Authorization', 'Bearer BAD')
//             .send();
//           expect(res.statusCode).toEqual(401);
//         });
//       });
//     });
//     describe('after login', () => {
//         const loggedInUsers = [
//             {
//             password: "workpls",
//             email: "helpme@gmail.com",
//             firstName: "Walter",
//             lastName: "White",
//             avatar: "cat",
//             roles: ['user']
//             },
//             {
//             password: "comeonnow",
//             email: "why@gmail.com",
//             firstName: "Mr. ",
//             lastName: "Beans",
//             avatar: "tree",
//             roles: ['user']
//             }
//         ];

//         let token0;
//         let adminToken;
//         beforeEach(async () => {
//           await request(server).post("/login/signup").send(loggedInUsers[0]);
//           const res0 = await request(server).post("/login").send(loggedInUsers[0]);
//           token0 = res0.body.token;
//           await request(server).post("/login/signup").send(loggedInUsers[1]);
//           await User.updateOne({ email: loggedInUsers[1].email }, { $push: { roles: 'admin'} });
//           const res1 = await request(server).post("/login").send(loggedInUsers[1]);
//           adminToken = res1.body.token;
//         });
//         describe("GET /:id", () => {
//             let user0Id, user1Id;
//             beforeEach(async () => {
//               const res0 = await request(server)
//                 .post("/users")
//                 .set('Authorization', 'Bearer ' + token0)
//                 .send();
//               user0Id = res0.body._id;
//               console.log(user0Id);
//               const res1 = await request(server)
//                 .post("/users")
//                 .set('Authorization', 'Bearer ' + adminToken)
//                 .send();
//               user1Id = res1.body._id;
//               console.log(user1Id);
//             });
//             it('should send 200 to normal user', async () => {
//               const res = await request(server)
//                 .get("/users/" + user0Id)
//                 .set('Authorization', 'Bearer ' + token0)
//                 .send();
//               expect(res.statusCode).toEqual(200);
//               expect(res.body).toMatchObject({
//                 password: "helpme",
//                 email: "someone@gmail.com",
//                 firstName: "Betty",
//                 lastName: "White",
//                 avatar: "cat",
//                 roles: ['user']
//                 });
//             });
//         });
//         // describe.each(testUsers)("PUT / user %#", (testUser) => {
//         //     let originalUser;
//         //     beforeEach(async () => {
//         //       const res = await request(server)
//         //         .post("/users")
//         //         .set('Authorization', 'Bearer ' + adminToken)
//         //         .send(testUser);
//         //         originalUser = res.body;
//         //         console.log(originalUser);
//         //     });
//             // it('should send 403 to normal user and not update user', async () => {
//             //   const res = await request(server)
//             //     .put("/users/" + originalUser._id)
//             //     .set('Authorization', 'Bearer ' + token0)
//             //     .send({ ...user, lastName: "Smith" });
//             //   expect(res.statusCode).toEqual(403);
//             //   const newUser = await User.findById(originalUser._id).lean();
//             //   newUser._id = newUser._id.toString();
//             //   expect(newUser).toMatchObject(originalUser);
//             // });
//         //     it('should send 200 to admin user and update user', async () => {
//         //       const res = await request(server)
//         //         .put("/users/" + originalUser._id)
//         //         .set('Authorization', 'Bearer ' + adminToken)
//         //         .send({ ...testUser, lastName: "Smith" });
//         //       expect(res.statusCode).toEqual(200);
//         //       const newUser = await User.findById(originalUser._id).lean();
//         //       newUser._id = newUser._id.toString();
//         //       expect(newUser).toMatchObject({ ...originalUser, lastName: "Smith" });
//         //     });
//         //   });
//         // describe.each([user2, user3])("GET /:id user %#", (user) => {
//         //   let originalUser;
//         //   beforeEach(async () => {
//         //     const res = await request(server)
//         //       .post("/users")
//         //       .set('Authorization', 'Bearer ' + adminToken)
//         //       .send(user);
//         //       originalUser = res.body;
//         //   });
//         //   it('should send 200 to normal user and return user', async () => {
//         //     const res = await request(server)
//         //       .get("/users/" + originalUser._id)
//         //       .set('Authorization', 'Bearer ' + token0)
//         //       .send();
//         //     expect(res.statusCode).toEqual(200);
//         //     expect(res.body).toMatchObject(originalUser);
//         //   });
//         //   it('should send 200 to admin user and return user', async () => {
//         //     const res = await request(server)
//         //       .get("/users/" + originalUser._id)
//         //       .set('Authorization', 'Bearer ' + adminToken)
//         //       .send();
//         //     expect(res.statusCode).toEqual(200);
//         //     expect(res.body).toMatchObject(originalUser);
//         //   });
//         // });
//         // describe("GET / user %#", () => {
//         //     let users;
//         //     beforeEach(async () => {
//         //       users = (await User.insertMany([user2, user3])).map(i => i.toJSON())
//         //       users.forEach(i => i._id = i._id.toString());
//         //     });
//         //     it('should send 200 to normal user and return all users', async () => {
//         //       const res = await request(server)
//         //         .get("/users/")
//         //         .set('Authorization', 'Bearer ' + token0)
//         //         .send();
//         //       expect(res.statusCode).toEqual(200);
//         //       expect(res.body).toMatchObject(users);
//         //     });
//         //     it('should send 200 to admin user and return all users', async () => {
//         //       const res = await request(server)
//         //         .get("/users/")
//         //         .set('Authorization', 'Bearer ' + adminToken)
//         //         .send();
//         //       expect(res.statusCode).toEqual(200);
//         //       expect(res.body).toMatchObject(users);
//         //     });
//         });
//     });
