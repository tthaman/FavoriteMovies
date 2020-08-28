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

  let token0;
  let token1;

  beforeEach(async () => {
    await Movies.insertMany(testMovies);
    await request(server).post("/login/signup").send(testUsers[0]);
    const res0 = await request(server).post("/login").send(testUsers[0]);
    token0 = res0.body.token;
    await request(server).post("/login/signup").send(testUsers[1]);
    const res1 = await request(server).post("/login").send(testUsers[1]);
    token1 = res1.body.token;
  });

  describe("POST /saved", () => {
    it("should save movie0 to watchlist for user0", async () => {
      const res = await request(server)
        .post("/saved/watchlist")
        .set('Authorization', 'Bearer ' + token0)
        .send(testMovies[0]);
      expect(res.statusCode).toEqual(200);
    });
    it("should save movie1 to watchlist for user1", async () => {
      const res = await request(server)
        .post("/saved/watchlist")
        .set('Authorization', 'Bearer ' + token1)
        .send(testMovies[1]);
      expect(res.statusCode).toEqual(200);
    });
    it("should save movie0 to favorites for user0", async () => {
      const res = await request(server)
        .post("/saved/favorites")
        .set('Authorization', 'Bearer ' + token0)
        .send(testMovies[0]);
      expect(res.statusCode).toEqual(200);
    });
    it("should save movie1 to favorites for user1", async () => {
      const res = await request(server)
        .post("/saved/favorites")
        .set('Authorization', 'Bearer ' + token1)
        .send(testMovies[1]);
      expect(res.statusCode).toEqual(200);
    });
  });
});
