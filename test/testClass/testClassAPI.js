const request = require("supertest");
const app = require("../../index");
const { Class, Quiz, NotExistQuiz, Enrol, NotExistEnrol, Course, PrereqCourse, User, PrereqUser, Class1, Class2 } = require("./classSchema.js")

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

    it("GET Specific: /api/class/view/" + Class.courseCode, (done) => {
      request(app).get("/api/class/view/" + Class.courseCode).expect(200, done);
    })

    it("GET Specific with courseCode & className: /api/class/view/" + Class.courseCode + "/" + Class.className, (done) => {
      request(app).get("/api/class/view/" + Class.courseCode + "/" + Class.className).expect(200, done);
    })

    it("GET Non-existent: /api/class/view/IS999000", (done) => {
      request(app).get("/api/class/view/IS999000").expect(404, done);
    })

    it("GET Non-existent with courseCode & className: /api/class/view/IS999000/G111222", (done) => {
      request(app).get("/api/class/view/IS999000/G111222").expect(404, done);
    })

    // GET Eligible users 
    it("GET Eligible Users with courseCode & className: /api/class/view/eligibleUsers/" + Class.courseCode + "/" + Class.className, (done) => {
      request(app).post("/api/course").send(Course).expect(200);
      request(app).post("/api/class").send(Class1).expect(200);
      request(app).get("/api/class/view/eligibleUsers/" + Class.courseCode + "/" + Class.className).expect(200);
      done()
    })

    // GET Eligible users with Prerequisites
    it("GET Eligible Users with courseCode & className with Prerequisites: /api/class/view/eligibleUsers/" + PrereqCourse.courseCode + "/" + Class.className, (done) => {
      request(app).post("/api/course").send(PrereqCourse).expect(200);
      request(app).get("/api/class/view/eligibleUsers/" + PrereqCourse.courseCode + "/" + Class.className).expect(200);
      done()
    })

    it("GET Non-existent Eligible Users with courseCode & className: /api/class/view/eligibleUsers/IS999000/Fundamental Programming III", (done) => {
      request(app).get("/api/class/view/eligibleUsers/IS999000/Fundamental Programming III").expect(404);
      request(app).delete("/api/course/delete/" + PrereqCourse.courseCode).expect(200)
      request(app).delete("/api/course/delete/" + Course.courseCode).expect(200)
      request(app).delete("/api/class/" + Class1.courseCode + "/" + Class1.className).expect(200);
      done()
    })

    // Enrolled students
    it("GET Enrolled Students with courseCode & className: /api/class/view/enrolledUsers/" + Class.courseCode + "/" + Class.className, (done) => {
      request(app).get("/api/class/view/enrolledUsers/" + Class.courseCode + "/" + Class.className).expect(200, done);
    })

    it("GET Non-existent Enrolled Users with courseCode & className: /api/class/view/enrolledUsers/IS999000/G111222", (done) => {
      request(app).get("/api/class/view/enrolledUsers/IS999000/G111222").expect(404, done);
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
    it("DELETE Specific: /api/class/IS999/G111", (done) => {
      request(app).delete("/api/class/" + Class.courseCode + "/" + Class.className).expect(200, done);
    })

    it("DELETE Non-existent: /api/class/IS999000/G111222", (done) => {
      request(app).delete("/api/class/IS999000/G111222").expect(404, done);
    })
  });
})