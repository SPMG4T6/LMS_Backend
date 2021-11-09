// Development Lead: Jason

const request = require("supertest");
const app = require("../../index");
const expect = require("chai").expect;
const { Class, Quiz, NotExistQuiz, Answer, WrongAnswer, UngradedQuestions, UngradedAnswer, Enrol, NotExistEnrol, Course, Course1, PrereqCourse, User, PrereqUser, Class1, PrereqClass, PrereqEnrol } = require("./classSchema.js")

describe("TDD for Class", () => {

  describe("Creating Dependencies", () => {
    it("Creating dependencies", async () => {
      const courseResponse = await request(app).post("/api/course").send(Course);
      const course1Response = await request(app).post("/api/course").send(Course1);
      const userResponse = await request(app).post("/api/user").send(User);
      const class1Response = await request(app).post("/api/class").send(Class1); // section is automatically created
      const prereqResponse = await request(app).post("/api/course").send(PrereqCourse);
      const prereqClassResponse = await request(app).post("/api/class").send(PrereqClass); // section is automatically created
      const prereqUserResponse = await request(app).post("/api/user").send(PrereqUser);
      const updateSectionQuiz = await request(app).put("/api/section/quiz/" + Class1.courseCode + "/" + Class1.className + "/Section 1").send(UngradedQuestions); // update the quiz details of auto created section
      
      expect(updateSectionQuiz.status).to.eql(200);
      expect(courseResponse.status).to.eql(200);
      expect(course1Response.status).to.eql(200);
      expect(class1Response.status).to.eql(200);
      expect(userResponse.status).to.eql(200);
      expect(prereqResponse.status).to.eql(200);
      expect(prereqClassResponse.status).to.eql(200);
      expect(prereqUserResponse.status).to.eql(200);
    })
  })
  

  // CREATE
  describe("POST Endpoints", () => {
    it("POST Create Class: /api/class", async () => {
      const response = await request(app).post("/api/class").send(Class);
      
      expect(response.status).to.eql(200);
      expect(response.body[1]).to.deep.include(Class);
    })

    it("POST Create Existing Class: /api/class", (done) => {
      request(app).post("/api/class").send(Class).expect(400, done);
    })

    it("POST Graded Auto Grading (FAIL): /api/class/quiz/graded/" + User.userID, async () => {
      const response = await request(app).post("/api/class/quiz/graded/" + User.userID).send(WrongAnswer); // using class1
      const user = await request(app).get("/api/user/" + User.userID);
      
      expect(response.status).to.eql(200);
      expect(response.body.status).to.eql(false);
      expect(response.body.marks).to.eql("2/5");
      expect(user.status).to.eql(200);
      expect(user.body[0].learningCourses).to.deep.includes([Course1.courseCode, Class1.className])
      expect(user.body[0].completedCourses).to.not.deep.include([Course1.courseCode, Class1.className, response.body.marks])
    })

    it("POST Graded Auto Grading (PASS): /api/class/quiz/graded/" + User.userID, async () => {
      const response = await request(app).post("/api/class/quiz/graded/" + User.userID).send(Answer); // using class1
      const user = await request(app).get("/api/user/" + User.userID);

      expect(response.status).to.eql(200);
      expect(response.body.status).to.eql(true);
      expect(response.body.marks).to.eql("3/5");
      expect(user.status).to.eql(200);
      expect(user.body[0].learningCourses).to.not.includes([Course1.courseCode, Class1.className])
      expect(user.body[0].completedCourses).to.deep.include([ Course1.courseCode, Class1.className, response.body.marks ])
    })
    
    // POST UNgraded Auto Grading - section is auto created when class is created
    it("POST UNgraded Auto Grading: /api/class/quiz/ungraded/" + User.userID, async () => {
      const response = await request(app).post("/api/class/quiz/ungraded/" + User.userID).send(UngradedAnswer); 
      const progress = await request(app).get("/api/progress/" + Class1.courseCode + "/" + Class1.className + "/" + UngradedAnswer.sectionName + "/" + User.userID);

      expect(response.status).to.eql(200);
      expect(response.body.status).to.eql(true);
      expect(response.body.marks).to.eql("2/3");
      expect(progress.status).to.eql(200);
      expect(progress.body.isSectionQuizComplete).to.eql(true); // shows that the isSectionQuizComplete flag is true
    })
  });

  // GET
  describe("GET Endpoints", () => {
    it("GET All: /api/classes", (done) => {
      request(app).get("/api/classes").expect(200, done);
    })

    // can add the expected classes 
    it("GET a list of class with courseCode: /api/class/view/" + Class.courseCode, async() => {
      const response = await request(app).get("/api/class/view/" + Class.courseCode);

      expect(response.status).to.eql(200);
      expect(response.body[0]).to.deep.include(Class);
    })

    it("GET Non-existent class: /api/class/view/IS999000", (done) => {
      request(app).get("/api/class/view/IS999000").expect(404, done);
    })

    // can add in the specific class
    it("GET Specific class with courseCode & className: /api/class/view/" + Class.courseCode + "/" + Class.className, async () => {
      const response = await request(app).get("/api/class/view/" + Class.courseCode + "/" + Class.className);

      expect(response.status).to.eql(200);
      expect(response.body[0]).to.deep.include(Class);
    })

    it("GET Non-existent class with courseCode & className: /api/class/view/IS999000/G111222", (done) => {
      request(app).get("/api/class/view/IS999000/G111222").expect(404, done);
    })

    // GET Eligible users 
    it("GET Eligible Users with courseCode & className: /api/class/view/eligibleUsers/" + Class.courseCode + "/" + Class.className, async () => {
      const response = await request(app).get("/api/class/view/eligibleUsers/" + Class.courseCode + "/" + Class.className);
      const user = await request(app).get("/api/user/" + User.userID);

      expect(response.status).to.eql(200);
      expect(response.body).to.deep.include(user.body[0]); // to prove that User's enrolledUsers is updated correctly
    })

    // GET Eligible users with Prerequisites
    it("GET (Prerequisites) Eligible Users with courseCode & className: /api/class/view/eligibleUsers/" + PrereqClass.courseCode + "/" + PrereqClass.className, async () => {
      const response = await request(app).get("/api/class/view/eligibleUsers/" + PrereqClass.courseCode + "/" + PrereqClass.className);
      const user = await request(app).get("/api/user/" + PrereqUser.userID);
      
      expect(response.status).to.eql(200);
      expect(response.body).to.deep.include(user.body[0]); // to prove that it exists
    })
    
    // Enrolled students in a Course Class
    it("GET Enrolled Students with courseCode & className: /api/class/view/enrolledUsers/" + Class.courseCode + "/" + Class.className, (done) => {
      request(app).get("/api/class/view/enrolledUsers/" + Class.courseCode + "/" + Class.className).expect(200, done);
    })
  });

  // UPDATE
  describe("PUT Endpoints", () => {
    it("PUT Quiz: /api/class/quiz", async () => {
      const response = await request(app).put("/api/class/quiz").send(Quiz).expect(200);

      expect(response.status).to.eql(200);
      expect(response.body).to.deep.include(Quiz);
    })

    it("PUT Quiz (Non-existent): /api/class/quiz", (done) => {
      request(app).put("/api/class/quiz").send(NotExistQuiz).expect(404, done);
    })

    it("PUT Learner Enrolling: /api/class/enrol/" + User.userID, async () => {
      const user = await request(app).get("/api/user/" + User.userID);
      const classResponse = await request(app).get("/api/class/view/" + Class.courseCode + "/" + Class.className);

      expect(user.status).to.eql(200);
      expect(classResponse.status).to.eql(200);

      // before
      expect(user.body[0].learningCourses).to.not.deep.includes([Class.courseCode, Class.className]);
      expect(classResponse.body[0].enrolledStudents).to.not.includes(User.userID);

      const response = await request(app).put("/api/class/enrol/" + User.userID).send(Enrol);
      expect(response.status).to.eql(200);
      
      // after
      const enrolledUser = await request(app).get("/api/user/" + User.userID);
      const updatedClassResponse = await request(app).get("/api/class/view/" + Class.courseCode + "/" + Class.className);
      expect(enrolledUser.body[0].learningCourses).to.deep.includes([Class.courseCode, Class.className]);
      expect(updatedClassResponse.body[0].enrolledStudents).to.includes(User.userID);
    })

    // With prereq
    it("PUT Learner WITH Prerequisites Enrolling for a class with Prerequisites: /api/class/enrol/" + PrereqUser.userID, async () => {
      const user = await request(app).get("/api/user/" + PrereqUser.userID);
      const classResponse = await request(app).get("/api/class/view/" + PrereqClass.courseCode + "/" + PrereqClass.className);

      expect(user.status).to.eql(200);
      expect(classResponse.status).to.eql(200);

      // before
      expect(user.body[0].learningCourses).to.not.includes([PrereqClass.courseCode, PrereqClass.className]);
      expect(classResponse.body[0].enrolledStudents).to.not.deep.includes(PrereqUser.userID);

      const response = await request(app).put("/api/class/enrol/" + PrereqUser.userID).send(PrereqEnrol);
      expect(response.status).to.eql(200);
      
      // after
      const enrolledUser = await request(app).get("/api/user/" + PrereqUser.userID);
      const updatedClassResponse = await request(app).get("/api/class/view/" + PrereqClass.courseCode + "/" + PrereqClass.className);
      expect(enrolledUser.body[0].learningCourses).to.deep.includes([PrereqClass.courseCode, PrereqClass.className]);
      expect(updatedClassResponse.body[0].enrolledStudents).to.includes(PrereqUser.userID);
    })

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
      const sectionResponse = await request(app).delete("/api/section/delete/" + Class.courseCode + "/" + Class.className + "/Section 1"); // delete the course's automatically created section
      const course1Response = await request(app).delete("/api/course/delete/" + Course1.courseCode);
      const course1SectionResponse = await request(app).delete("/api/section/delete/" + Class1.courseCode + "/" + Class1.className + "/Section 1"); // delete the course1's automatically created section
      const class1Response = await request(app).delete("/api/class/" + Class1.courseCode + "/" + Class1.className);
      const prereqClassResponse = await request(app).delete("/api/class/" + PrereqClass.courseCode + "/" + PrereqClass.className);
      const prereqResponse = await request(app).delete("/api/course/delete/" + PrereqCourse.courseCode);
      const prereqCourseSectionResponse = await request(app).delete("/api/section/delete/" + PrereqClass.courseCode + "/" + PrereqClass.className + "/Section 1"); // delete the prereqCourse's automatically created section
      const userResponse = await request(app).delete("/api/user/" + User.userID);
      const prereqUserResponse = await request(app).delete("/api/user/" + PrereqUser.userID);

      // Clearing progress details created by ungraded auto grading test case
      const deleteProgress = await request(app).delete("/api/progress/" + Class1.courseCode + "/" + Class1.className + "/" + UngradedAnswer.sectionName + "/" + User.userID)
      expect(deleteProgress.status).to.eql(200);
      
      expect(courseResponse.status).to.eql(200);
      expect(course1Response.status).to.eql(200);
      expect(class1Response.status).to.eql(200);
      expect(prereqClassResponse.status).to.eql(200);
      expect(prereqResponse.status).to.eql(200);
      expect(userResponse.status).to.eql(200);
      expect(prereqUserResponse.status).to.eql(200);
      expect(sectionResponse.status).to.eql(200);
      expect(course1SectionResponse.status).to.eql(200);
      expect(prereqCourseSectionResponse.status).to.eql(200);
    })
  })
})