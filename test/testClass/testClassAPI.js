const request = require("supertest");
const app = require("../../index");
const { Class, Quiz, NotExistQuiz, Enrol, NotExistEnrol } = require("./classSchema.js")

describe("TDD for Class", () => {
  // CREATE
describe("POST Endpoints", () => {
  it("POST Specific: /api/class", (done) => {
    request(app).post("/api/class").send(Class).expect(200, done);
  })

  it("POST Duplicate: /api/class", (done) => {
    request(app).post("/api/class").send(Class).expect(400, done);
  })
});

// GET
describe("GET Endpoints", () => {
  it("GET All: /api/classes", (done) => {
    request(app).get("/api/classes").expect(200, done);
  })

  it("GET Specific: /api/classes/view/159753", (done) => {
    request(app).get("/api/classes/view/159753").expect(200, done);
  })

  it("GET Specific with ClassName: /api/classes/view/159753/Fundamental Programming I", (done) => {
    request(app).get("/api/classes/view/159753").expect(200, done);
  })

  it("GET Non-existent: /api/classes/view/159753000", (done) => {
    request(app).get("/api/classes/view/159753000").expect(404, done);
  })

  it("GET Non-existent with ClassName: /api/classes/view/159753000/Fundamental Programming III", (done) => {
    request(app).get("/api/classes/view/159753000").expect(404, done);
  })
});

// UPDATE
describe("PUT Endpoints", () => {
  it("PUT Quiz: /api/class/quiz", (done) => {
    request(app).put("/api/class/quiz").send(Quiz).expect(200, done);
  })

  it("PUT Quiz (Non-existent): /api/class/quiz", (done) => {
    request(app).put("/api/class/quiz").send(NotExistQuiz).expect(404, done);
  })

  it("PUT Learner Enrolling: /api/enrol/1", (done) => {
    request(app).put("/api/class/enrol/1").send(Enrol).expect(200, done);
  })

  it("PUT Learner Enrolling (Non-existent courseCode & className): /api/enrol/1", (done) => {
    request(app).put("/api/class/enrol/1").send(NotExistEnrol).expect(404, done);
  })

  it("PUT Learner Enrolling (Non-existent Learner): /api/enrol/1111111", (done) => {
    request(app).put("/api/class/enrol/1111111").send(Enrol).expect(404, done);
  })
});

// DELETE
describe("DELETE Endpoints", () => {
  it("DELETE Specific: /api/class/159753/Fundamental Programming I", (done) => {
    request(app).delete("/api/class/159753/Fundamental Programming I").expect(200, done);
  })

  it("DELETE Non-existent: /api/class/159753/Fundamental Programming III", (done) => {
    request(app).delete("/api/class/159753/Fundamental Programming III").expect(404, done);
  })
});
})