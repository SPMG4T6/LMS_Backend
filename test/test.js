const request = require("supertest");
const app = require("../index");

describe("GET /", () => {
  it("respond with endpoint route", (done) => {
    request(app).get("/").expect("Hello! You need to add '/api' in your route for our endpoints!", done);
  })
});