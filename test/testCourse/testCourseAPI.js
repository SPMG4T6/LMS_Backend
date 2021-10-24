const request = require("supertest");
const app = require("../../index");
const expect = require("chai").expect;
const {Course1, Course1Update} = require("./courseSchema");

describe("TDD for Course", () => {
    describe("POST Endpoints", () => {
        it("Creating a new instance of a course should return status 200", async () => {
            const res = await request(app)
            .post("/api/course")
            .send(Course1);
            expect(res.status).to.equal(200);
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
        it("Retrieving a specific course", async () => {
            const res = await request(app)
            .get("/api/course/view/" + Course1.courseCode);
            expect(res.status).to.equal(200);
            expect(res.body[0]).to.have.property("courseCode", "IS110");
            expect(res.body[0]).to.have.property("courseTitle");
            expect(res.body[0]).to.have.property("courseDescription");
            expect(res.body[0]).to.have.property("prereqCourses");
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
            expect(res.body).to.have.property("courseTitle", "Updated course title");
            expect(res.body).to.have.property("courseDescription", "Updated course description");
            expect(res.body).to.have.property("quizPassingMark", "75");
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
    
        it("Delete a non-existent course", async () => {
            const res = await request(app)
            .delete("/api/course/delete/IS1100");
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property("message", "Course does not exist");
        })
    })
})


