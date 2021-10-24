const request = require("supertest");
const app = require("../../index");
const { User1, NewUser1, User2 } = require("./userSchema.js")

describe("TDD for User", () => {
  describe("POST Endpoints", () => {
    it("Creating new user 1: /api/user", (done) => {
      request(app).post("/api/user")
        .send(User1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it("Creating duplicate user 1: /api/user", (done) => {
      request(app).post("/api/user")
        .send(User1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    }).timeout(10000);
  });

  describe("GET Endpoints", () => {
    it("Get all users: /api/users", (done) => {
      request(app).get("/api/users").expect(200, done);
    });

    it("Get user 1 details: /api/user/:userID", (done) => {
      request(app).get("/api/user/" + User1.userID).expect(200, done);
    });

    it("Get user 2 details (non existent): /api/user/:userID", (done) => {
      request(app).get("/api/user/" + User2.userID).expect(404, done);
    });
  });

  describe("PUT Endpoints", () => {
    it("Update user 1 details: /api/user/:userID", (done) => {
      request(app).put("/api/user/" + User1.userID)
        .send(NewUser1)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it("Update user 2 details (non existent): /api/user/:userID", (done) => {
      request(app).put("/api/user/" + User2.userID)
        .send(NewUser1)
        .set('Accept', 'application/json')
        .expect(404, done);
    });
  });

  describe("DELETE Endpoints", () => {
    it("Update user 1 details: /api/user/:userID", (done) => {
      request(app).delete("/api/user/" + User1.userID).expect(200, done);
    });

    it("Update user 2 details (non existent): /api/user/:userID", (done) => {
      request(app).delete("/api/user/" + User2.userID).expect(404, done);
    });
  });
})

