const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Movies = require('../models/movie');
const Saved = require('../models/saved');

describe("/saved", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const movie0 = {
    "" : 9,
    "ID" : 10,
    "Title" : "Inglourious Basterds",
    "Year" : 2009,
    "Age" : "18+",
    "IMDb" : 8.3,
    "Rotten Tomatoes" : "89%",
    "Netflix" : 1,
    "Hulu" : 0,
    "Prime Video" : 0,
    "Disney+" : 0,
    "Type" : 0,
    "Directors" : "Quentin Tarantino",
    "Genres" : "Adventure,Drama,War",
    "Country" : "Germany,United States",
    "Language" : "English,German,French,Italian",
    "Runtime" : 153
  };

  const movie1 = {
    "" : 17,
    "ID" : 18,
    "Title" : "Groundhog Day",
    "Year" : 1993,
    "Age" : "7+",
    "IMDb" : 8,
    "Rotten Tomatoes" : "96%",
    "Netflix" : 1,
    "Hulu" : 0,
    "Prime Video" : 0,
    "Disney+" : 0,
    "Type" : 0,
    "Directors" : "Harold Ramis",
    "Genres" : "Comedy,Fantasy,Romance",
    "Country" : "United States",
    "Language" : "English,French,Italian",
    "Runtime" : 101 };
  let movies;

  const user0 = {
    email: 'user0@mail.com',
    password: '123password',
    firstName: 'Dudley',
    lastName: 'Doright'
  };
  const user1 = {
    email: 'user0@mail.com',
    password: '123password',
    firstName: 'Doris',
    lastName: 'Dowrong'
  };
  let users;

  let token0;

  beforeEach(async () => {
    movies = (await Movies.insertMany([movie0, movie1])).map(i => i.toJSON());
    users = (await User.insertMany([user0, user1])).map(i => i.toJSON());
  });

  describe('after login', () => {
    const user0 = {
      email: 'user0@mail.com',
      password: '123password',
      firstName: 'Dudley',
      lastName: 'Doright'
    };
    let token0;

    // beforeEach(async () => {
    //   console.log(await request(server).post("/login/signup").send(user0));
    //   const res0 = await request(server).post("/login").send(user0.email, user0.password);
    //   token0 = res0.body.token;
    // });

    describe("POST /saved/watchlist", () => {
      it('should send 200 to normal user and save movie', async () => {
        const res = await request(server)
          .post("/saved/watchlist")
          .set('Authorization', 'Bearer ' + token0)
          .send(movies[0]);
        expect(res.statusCode).toEqual(200);
        const savedMovie = await Saved.findOne().lean();
        expect(savedMovie).toMatchObject({
          items: items.map(i => i._id),
          userId: (await User.findOne({ email: user0.email }).lean())._id,
        });
      });
    });





    describe("GET /", () => {
      let order0Id, order1Id;
      beforeEach(async () => {
        const res0 = await request(server)
          .post("/saved")
          .set('Authorization', 'Bearer ' + token0)
          .send(items.map(i => i._id));
        order0Id = res0.body._id;
        const res1 = await request(server)
          .post("/saved")
          .set('Authorization', 'Bearer ' + adminToken)
          .send([items[1]].map(i => i._id));
        order1Id = res1.body._id;
      });
      it('should send 200 to normal user with their one order', async () => {
        const res = await request(server)
          .get("/saved")
          .set('Authorization', 'Bearer ' + token0)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject([{
          items: [items[0]._id.toString(), items[1]._id.toString()],
          userId: (await User.findOne({ email: user0.email }))._id.toString(),
          total: 22
        }]);
      });
      it("should send 200 to admin user all saved", async () => {
        const res = await request(server)
          .get("/saved")
          .set('Authorization', 'Bearer ' + adminToken)
          .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject([
          {
            items: [items[0]._id.toString(), items[1]._id.toString()],
            userId: (await User.findOne({ email: user0.email }))._id.toString(),
            total: 22
          },
          {
            items: [items[1]._id.toString()],
            userId: (await User.findOne({ email: user1.email }))._id.toString(),
            total: 12
          }
        ]);
      });
    });
  });
});
