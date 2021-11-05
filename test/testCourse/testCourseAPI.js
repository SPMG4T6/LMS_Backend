const request = require("supertest");
const app = require("../../index");
const expect = require("chai").expect;
const {Course1, Course2, Course3, Course1Update, Course2Update} = require("./testCourseData");

describe("TDD for Course", () => {
    describe("POST Endpoints", () => {
        it("Creating a new instance of a course should return status 200", async () => {
            const res = await request(app)
            .post("/api/course")
            .send(Course1);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("courseCode", Course1.courseCode);
            expect(res.body).to.have.property("courseTitle", Course1.courseTitle);
            expect(res.body).to.have.property("courseDescription", Course1.courseDescription);
            expect(res.body.prereqCourses).to.eql(Course1.prereqCourses);
            expect(res.body).to.have.property("quizPassingMark", Course1.quizPassingMark);
        });
        it("Creating a new instance of a course with pre-requisite courses should return status 200", async () => {
            const res = await request(app)
            .post("/api/course")
            .send(Course2);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("courseCode", Course2.courseCode);
            expect(res.body).to.have.property("courseTitle", Course2.courseTitle);
            expect(res.body).to.have.property("courseDescription", Course2.courseDescription);
            expect(res.body.prereqCourses).to.eql(Course2.prereqCourses);
            expect(res.body).to.have.property("quizPassingMark", Course2.quizPassingMark);
        });

        it("Creating a new instance of a course with negative quiz passing marks should return status 400", async () => {
            const res = await request(app)
            .post("/api/course")
            .send(Course3);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property("message", "Quiz Passing Marks cannot be negative");
        });
    
        it("Creating a duplicate instance of a course should return status 400 with a message", async () => {
            const res = await request(app)
            .post("/api/course")
            .send(Course1);
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property("message", "Course already exists")
        });
    });
    
    describe("GET Endpoints", () => {
        it("Retrieving all courses", async () => {
            const res = await request(app)
            .get("/api/courses");
            expect(res.status).to.equal(200);
        })

        it("Retrieving a specific course  1", async () => {
            const res = await request(app)
            .get("/api/course/view/" + Course1.courseCode);
            expect(res.status).to.equal(200);
            expect(res.body[0]).to.have.property("courseCode", Course1.courseCode);
            expect(res.body[0]).to.have.property("courseTitle", Course1.courseTitle);
            expect(res.body[0]).to.have.property("courseDescription", Course1.courseDescription);
            expect(res.body[0].prereqCourses).to.eql(Course1.prereqCourses);
            expect(res.body[0]).to.have.property("quizPassingMark", Course1.quizPassingMark);
        });

        it("Retrieving a specific course  2", async () => {
            const res = await request(app)
            .get("/api/course/view/" + Course2.courseCode);
            expect(res.status).to.equal(200);
            expect(res.body[0]).to.have.property("courseCode", Course2.courseCode);
            expect(res.body[0]).to.have.property("courseTitle", Course2.courseTitle);
            expect(res.body[0]).to.have.property("courseDescription", Course2.courseDescription);
            expect(res.body[0].prereqCourses).to.eql(Course2.prereqCourses);
            expect(res.body[0]).to.have.property("quizPassingMark", Course2.quizPassingMark);
        });
        
        it("Retrieving a non-existent course", async () => {
            const res = await request(app)
            .get("/api/course/view/IS2166");
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property("message", "Course does not exist")
        });
    })
    
    
    describe("PUT Endpoints", async () => {
        it("Updating course details of an existing course", async () => {
            const res = await request(app)
            .put("/api/course/" + Course1.courseCode)
            .send(Course1Update)
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("courseTitle", Course1Update.courseTitle);
            expect(res.body).to.have.property("courseDescription", Course1Update.courseDescription);
            expect(res.body.prereqCourses).to.eql(Course1.prereqCourses);
            expect(res.body).to.have.property("quizPassingMark", Course1Update.quizPassingMark);
        });

        it("Updating course details of an existing course", async () => {
            const res = await request(app)
            .put("/api/course/" + Course2.courseCode)
            .send(Course2Update)
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("courseTitle", Course2Update.courseTitle);
            expect(res.body).to.have.property("courseDescription", Course2.courseDescription);
            expect(res.body.prereqCourses).to.eql(Course2.prereqCourses);
            expect(res.body).to.have.property("quizPassingMark", Course2Update.quizPassingMark);
        });
    
        it("Updating course details of a non-existent course", async () => {
            const res = await request(app)
            .put("/api/course/IS2166")
            .send(Course1Update)
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property("message", "Course does not exist");
            
        });
    })
    
    describe("DEL Endpoints", async () => {
        it("Delete an existing course", async () => {
            const res = await request(app)
            .delete("/api/course/delete/" + Course1.courseCode);
            expect(res.status).to.equal(200);
        })

        it("Delete an existing course", async () => {
            const res = await request(app)
            .delete("/api/course/delete/" + Course2.courseCode);
            expect(res.status).to.equal(200);
        })
    
        it("Delete a non-existent course", async () => {
            const res = await request(app)
            .delete("/api/course/delete/IS1100");
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property("message", "Course does not exist");
        })
    })
})


