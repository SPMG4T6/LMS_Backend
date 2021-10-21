const request = require("supertest");
const app = require("../../index");
const { User } = require("./userSchema.js")

describe("GET /api/users", () => {
  it("got all users", (done) => {
    request(app).get("/api/users").expect(200, done);
  })
});

describe("GET /api/user/:userID", () => {
  it("successfully retrieved user details", (done) => {
    request(app).get("/api/user/01234510").expect(200, done);
  })
});