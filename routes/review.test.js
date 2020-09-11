const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Movies = require('../models/movie');

describe("/saved", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const testMovies = [
  {
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
    },
    {"" : 17,
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
    "Runtime" : 101 }
    ];
  module.exports = { testMovies };

  const testUsers = [
    {
      password: "helpme",
      email: "someone@gmail.com",
      firstName: "Betty",
      lastName: "White",
    },
    {
      password: "jellybeans",
      email: "someoneelse@gmail.com",
      firstName: "Georgia",
      lastName: "Beans",
    },
  ];

  module.exports = { testUsers };

  let movies;
  let token0;
  let token1;

  beforeEach(async () => {
    movies = await Movies.insertMany(testMovies);
    await request(server).post("/login/signup").send(testUsers[0]);
    const res0 = await request(server).post("/login").send(testUsers[0]);
    token0 = res0.body.token;
    await request(server).post("/login/signup").send(testUsers[1]);
    const res1 = await request(server).post("/login").send(testUsers[1]);
    token1 = res1.body.token;
  });

  describe("saved/ ", () => {
    it("should touch all routes", async () => {
      const res0 = await request(server)
        .post("/saved/watchlist")
        .set('Authorization', 'Bearer ' + token0)
        .send(movies[0]);
      expect(res0.statusCode).toEqual(200);
      const res1 = await request(server)
        .post("/saved/favorites")
        .set('Authorization', 'Bearer ' + token0)
        .send(movies[1]);
      expect(res1.statusCode).toEqual(200);
      const res2 = await request(server)
        .get("/saved")
        .set('Authorization', 'Bearer ' + token0)
        .send();
      expect(res2.statusCode).toEqual(200);
      const res3 = await request(server)
        .post("/saved/watchlist")
        .set('Authorization', 'Bearer ' + token1)
        .send(movies[0]);
      expect(res3.statusCode).toEqual(200);
      const res4 = await request(server)
        .post("/saved/favorites")
        .set('Authorization', 'Bearer ' + token1)
        .send(movies[1]);
      expect(res4.statusCode).toEqual(200);
      const res5 = await request(server)
        .get("/saved")
        .set('Authorization', 'Bearer ' + token1)
        .send();
      expect(res5.statusCode).toEqual(200);
    });
  });
});


router.post("/saved/favorites/:id/remove")
router.post("/saved/favorites/:id")
router.post("/saved/watchlist/:id/remove")
router.post("/saved/watchlist/:id")
router.get("/saved/")
