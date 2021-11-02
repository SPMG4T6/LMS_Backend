const request = require("supertest");
const app = require("../../index");
const expect = require("chai").expect;
const { Class, Quiz, NotExistQuiz, Answer, WrongAnswer, Enrol, NotExistEnrol, Course, Course1, PrereqCourse, User, PrereqUser, Class1, PrereqClass, PrereqEnrol } = require("./classSchema.js")

describe("TDD for Class", () => {

  describe("Creating Dependencies", () => {
    it("Creating dependencies", async () => {
      const courseResponse = await request(app).post("/api/course").send(Course);
      const course1Response = await request(app).post("/api/course").send(Course1);
      const prereqResponse = await request(app).post("/api/course").send(PrereqCourse);
      const class1Response = await request(app).post("/api/class").send(Class1);
      const prereqClassResponse = await request(app).post("/api/class").send(PrereqClass);
      const userResponse = await request(app).post("/api/user").send(User);
      const prereqUserResponse = await request(app).post("/api/user").send(PrereqUser);
  
      expect(courseResponse.status).to.eql(200);
      expect(course1Response.status).to.eql(200);
      expect(class1Response.status).to.eql(200);
      expect(prereqResponse.status).to.eql(200);
      expect(prereqClassResponse.status).to.eql(200);
      expect(userResponse.status).to.eql(200);
      expect(prereqUserResponse.status).to.eql(200);
    }).timeout(5000)
  })
  

  // CREATE
  describe("POST Endpoints", () => {
    it("POST Create Class: /api/class", (done) => {
      request(app).post("/api/class").send(Class).expect(200, done);
    })

    it("POST Create Duplicate Class: /api/class", (done) => {
      request(app).post("/api/class").send(Class).expect(400, done);
    })

    it("POST Graded Auto Grading (FAIL): /api/class/quiz/graded/" + User.userID, async () => {
      const response = await request(app).post("/api/class/quiz/graded/" + User.userID).send(WrongAnswer); // using class1
      const user = await request(app).get("/api/user/" + User.userID);

      expect(response.body.status).to.eql(false);
      expect(user.body[0].learningCourses).to.includes(Course1.courseCode)
      expect(user.body[0].completedCourses).to.not.include(Course1.courseCode)
    }).timeout(5000);

    it("POST Graded Auto Grading (PASS): /api/class/quiz/graded/" + User.userID, async () => {
      const response = await request(app).post("/api/class/quiz/graded/" + User.userID).send(Answer); // using class1
      const user = await request(app).get("/api/user/" + User.userID);

      expect(response.body.status).to.eql(true);
      expect(user.body[0].learningCourses).to.not.includes(Course1.courseCode)
      expect(user.body[0].completedCourses).to.deep.include([ Course1.courseCode, response.body.marks ])
    }).timeout(5000);

    // POST Ungraded Auto Grading (PASS)
    // POST Ungraded Auto Grading (FAIL)
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
    it("GET Eligible Users with courseCode & className: /api/class/view/eligibleUsers/" + Class.courseCode + "/" + Class.className, async () => {
      const response = await request(app).get("/api/class/view/eligibleUsers/" + Class.courseCode + "/" + Class.className);
      const user = await request(app).get("/api/user/" + User.userID);
      expect(response.status).to.eql(200);
      expect(response.body).to.deep.include(user.body[0]);
    })

    // GET Eligible users with Prerequisites
    it("GET Eligible Users with courseCode & className with Prerequisites: /api/class/view/eligibleUsers/" + PrereqClass.courseCode + "/" + PrereqClass.className, async () => {
      const response = await request(app).get("/api/class/view/eligibleUsers/" + PrereqClass.courseCode + "/" + PrereqClass.className);
      const user = await request(app).get("/api/user/" + PrereqUser.userID);
      expect(response.status).to.eql(200);
      expect(response.body).to.eql(user.body); // to prove that it exists
    })

    // GET Non-existent eligible users
    it("GET Non-existent Eligible Users with courseCode & className: /api/class/view/eligibleUsers/IS999000/G111222", (done) => {
      request(app).get("/api/class/view/eligibleUsers/IS999000/G111222").expect(404, done);
    })
 
    // Enrolled students in a Course Class
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

    it("PUT Learner Enrolling: /api/class/enrol/" + User.userID, async () => {
      const user = await request(app).get("/api/user/" + User.userID);
      const classResponse = await request(app).get("/api/class/view/" + Class.courseCode + "/" + Class.className);

      // before
      expect(user.body[0].learningCourses).to.not.includes(Class.courseCode);
      expect(classResponse.body[0].enrolledStudents).to.not.includes(User.userID);

      const response = await request(app).put("/api/class/enrol/" + User.userID).send(Enrol);
      expect(response.status).to.eql(200);
      
      // after
      const enrolledUser = await request(app).get("/api/user/" + User.userID);
      const updatedClassResponse = await request(app).get("/api/class/view/" + Class.courseCode + "/" + Class.className);
      expect(enrolledUser.body[0].learningCourses).to.includes(Class.courseCode);
      expect(updatedClassResponse.body[0].enrolledStudents).to.includes(User.userID);
    })

    // With prereq
    it("PUT Learner WITH Prerequisites Enrolling for a class with Prerequisites: /api/class/enrol/" + PrereqUser.userID, async () => {
      const user = await request(app).get("/api/user/" + PrereqUser.userID);
      const classResponse = await request(app).get("/api/class/view/" + PrereqClass.courseCode + "/" + PrereqClass.className);

      // before
      expect(user.body[0].learningCourses).to.not.includes(PrereqClass.courseCode);
      expect(classResponse.body[0].enrolledStudents).to.not.includes(PrereqUser.userID);

      const response = await request(app).put("/api/class/enrol/" + PrereqUser.userID).send(PrereqEnrol);
      expect(response.status).to.eql(200);
      
      // after
      const enrolledUser = await request(app).get("/api/user/" + PrereqUser.userID);
      const updatedClassResponse = await request(app).get("/api/class/view/" + PrereqClass.courseCode + "/" + PrereqClass.className);
      expect(enrolledUser.body[0].learningCourses).to.includes(PrereqClass.courseCode);
      expect(updatedClassResponse.body[0].enrolledStudents).to.includes(PrereqUser.userID);
    })

    // Without the required Prereq course
    // it("PUT Learner WITHOUT Prerequisites Enrolling for a class with Prerequisites: /api/class/enrol/" + User.userID, async () => {
    //   const user = await request(app).get("/api/user/" + User.userID);
    //   const classResponse = await request(app).get("/api/class/view/" + PrereqClass.courseCode + "/" + PrereqClass.className);

    //   // before
    //   expect(user.body[0].learningCourses).to.not.includes(PrereqClass.courseCode);
    //   expect(classResponse.body[0].enrolledStudents).to.not.includes(User.userID);

    //   const response = await request(app).put("/api/class/enrol/" + User.userID).send(PrereqEnrol);
    //   expect(response.status).to.eql(200);
      
    //   // after
    //   const enrolledUser = await request(app).get("/api/user/" + User.userID);
    //   const updatedClassResponse = await request(app).get("/api/class/view/" + PrereqClass.courseCode + "/" + PrereqClass.className);
    //   expect(enrolledUser.body[0].learningCourses).to.includes(PrereqClass.courseCode);
    //   expect(updatedClassResponse.body[0].enrolledStudents).to.includes(User.userID);
    // })

    it("PUT Learner Enrolling (Non-existent courseCode & className): /api/enrol/" + User.userID, (done) => {
      request(app).put("/api/class/enrol/" + User.userID).send(NotExistEnrol).expect(404, done);
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

  describe("Deleting Dependencies", () => {
    it("Deleting dependencies", async () => {
      const courseResponse = await request(app).delete("/api/course/delete/" + Course.courseCode);
      const course1Response = await request(app).delete("/api/course/delete/" + Course1.courseCode);
      const class1Response = await request(app).delete("/api/class/" + Class1.courseCode + "/" + Class1.className);
      const prereqClassResponse = await request(app).delete("/api/class/" + PrereqClass.courseCode + "/" + PrereqClass.className);
      const prereqResponse = await request(app).delete("/api/course/delete/" + PrereqCourse.courseCode);
      const userResponse = await request(app).delete("/api/user/" + User.userID);
      const prereqUserResponse = await request(app).delete("/api/user/" + PrereqUser.userID);
  
      expect(courseResponse.status).to.eql(200);
      expect(course1Response.status).to.eql(200);
      expect(class1Response.status).to.eql(200);
      expect(prereqClassResponse.status).to.eql(200);
      expect(prereqResponse.status).to.eql(200);
      expect(userResponse.status).to.eql(200);
      expect(prereqUserResponse.status).to.eql(200);
    }).timeout(5000)
  })
})