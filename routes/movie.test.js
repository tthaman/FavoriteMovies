const request = require("supertest");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Movies = require("../models/movie");

describe("/movie", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const testMovies = [
    {
      "": 9,
      ID: 10,
      Title: "Inglourious Basterds",
      Year: 2009,
      Age: "18+",
      IMDb: 8.3,
      RottenTomatoes: "89%",
      Netflix: 1,
      Hulu: 0,
      PrimeVideo: 0,
      DisneyPlus: 0,
      Type: 0,
      Directors: "Quentin Tarantino",
      Genres: "Adventure,Drama,War",
      Country: "Germany,United States",
      Language: "English,German,French,Italian",
      Runtime: 153,
    },
    {
      "": 17,
      ID: 18,
      Title: "Groundhog Day",
      Year: 1993,
      Age: "7+",
      IMDb: 8,
      RottenTomatoes: "96%",
      Netflix: 1,
      Hulu: 0,
      PrimeVideo: 0,
      DisneyPlus: 0,
      Type: 0,
      Directors: "Harold Ramis",
      Genres: "Comedy,Fantasy,Romance",
      Country: "United States",
      Language: "English,French,Italian",
      Runtime: 101,
    },
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
    movies = await Movies.insertMany(testMovies).map((i) => i.toJson());
    movies.forEach((i) => (i._id = i._id.toString()));
    await request(server).post("/login/signup").send(testUsers[0]);
    const res0 = await request(server).post("/login").send(testUsers[0]);
    token0 = res0.body.token;
    await request(server).post("/login/signup").send(testUsers[1]);
    const res1 = await request(server).post("/login").send(testUsers[1]);
    token1 = res1.body.token;
  });

  describe("Get /", () => {
    it("should return all movies", async () => {
      const res = await request(server).get("/movie").send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.movieArray).toMatchObject(movies);
    });
  });

  describe("Get /:id", () => {
    it("should return a movie", async () => {
      const res = await request(server)
        .get("/movie/" + movies[0]._id)
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.movieData).toMatchObject(movies[0]);
    });
  });

  describe("Get /filter", () => {
    it("should filter by genre", async () => {
      const res = await request(server).get("/movie/filter?genre=Comedy").send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.movieArray).toMatchObject([movies[1]]);
    });
    it("should filter by age", async () => {
      const res = await request(server).get("/movie/filter?age=13%2B").send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.movieArray).toMatchObject([movies[0]]);
    });
  });

  describe("Get /search", () => {
    it("should search by title", async () => {
      const res = await request(server)
        .get("/movie/search?searchType=Title?query=Day")
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.movieArray).toMatchObject([movies[1]]);
    });
    it("should search by director", async () => {
      const res = await request(server)
        .get("/movie?searchType=Director&query=Tarantino")
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body.movieArray).toMatchObject([movies[0]]);
    });
  });
});
