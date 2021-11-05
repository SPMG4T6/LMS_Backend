const request = require("supertest");
const app = require("../../index");
const expect = require("chai").expect;
const { Learner, Trainer, Course, Class, ClassApplied } = require("./setupSchema.js")

describe("TDD for classApplied", () => {
    describe("Setup", () => {
        it("Setup for testing", async () => {
            const learnerResponse = await request(app).post("/api/user").send(Learner);
            const trainerResponse = await request(app).post("/api/user").send(Trainer);
            const courseResponse = await request(app).post("/api/course").send(Course);
            const classResponse = await request(app).post("/api/class").send(Class);

            expect(learnerResponse.status).to.eql(200);
            expect(trainerResponse.status).to.eql(200);
            expect(courseResponse.status).to.eql(200);
            expect(classResponse.status).to.eql(200);
        }).timeout(10000)
    });

    describe("POST Endpoints", () => {
        it("POST (create) class application: /api/classApplied", async () => {
            const res = await request(app).post("/api/classApplied").send(ClassApplied);
            expect(res.status).to.eql(200);
            expect(res.body.courseCode).to.eql(ClassApplied.courseCode);
            expect(res.body.className).to.eql(ClassApplied.className);
            expect(res.body.userID).to.eql(ClassApplied.userID);
            expect(res.body.userName).to.eql(ClassApplied.userName);
        })

        it("POST (create) duplicate class application: /api/classApplied", async () => {
            const res = await request(app).post("/api/classApplied").send(ClassApplied);
            expect(res.status).to.eql(400);
            expect(res.body.message).to.eql("classApplied record already exists!")
        })
    });

    describe("GET Endpoints", () => {
        it("GET all class applications: /api/allClassApplied", async () => {
            const res = await request(app).get("/api/allClassApplied");
            expect(res.status).to.eql(200);
        })

        it("GET list of class applications by a Learner: /api/userClassApplied/:userID", async () => {
            const res = await request(app).get("/api/userClassApplied/" + Learner.userID);
            expect(res.status).to.eql(200);
        })

        it("GET list of class applications by a non-existent Learner: /api/userClassApplied/:userID", async () => {
            const res = await request(app).get("/api/userClassApplied/" + Learner.userID + "$$$");
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql(`User ID ${Learner.userID}$$$ does not exist`)
        })

        it("GET list of class applications in a class: /api/classApplied/:courseCode/:className", async () => {
            const res = await request(app).get("/api/classApplied/" + Class.courseCode + "/" + Class.className);
            expect(res.status).to.eql(200);
        })

        it("GET list of class applications in a non-existent class: /api/classApplied/:courseCode/:className", async () => {
            const res = await request(app).get("/api/classApplied/" + Class.courseCode + "/" + Class.className + "$$$");
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql(`${Class.courseCode} ${Class.className}$$$ not found`)
        })

        it("GET list of class applications in a non-existent course: /api/classApplied/:courseCode/:className", async () => {
            const res = await request(app).get("/api/classApplied/" + Class.courseCode + "$$$/" + Class.className);
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql(`Course ${Class.courseCode}$$$ not found`)
        })
    })

    describe("DELETE Endpoints", () => {
        it("DELETE class application: /api/classApplied/delete/:courseCode/:className/:userID", (done) => {
            request(app).delete("/api/classApplied/delete/" + ClassApplied.courseCode + "/" + ClassApplied.className + "/" + ClassApplied.userID)
                .expect(200, done);
        });

        it("DELETE non-existent class application: /api/classApplied/delete/:courseCode/:className/:userID", async () => {
            const res = await request(app).delete("/api/classApplied/delete/" + ClassApplied.courseCode + "/" + ClassApplied.className + "/" + ClassApplied.userID)
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql(`Application by ${ClassApplied.userID} for ${ClassApplied.courseCode} ${ClassApplied.className} does not exist`)
        });
    })

    describe("Teardown", () => {
        it("Teardown after testing", async () => {
            const sectionResponse = await request(app).delete("/api/section/delete/" + Class.courseCode + "/" + Class.className + "/" + "Section 1");
            const classResponse = await request(app).delete("/api/class/" + Class.courseCode + "/" + Class.className);
            const courseResponse = await request(app).delete("/api/course/delete/" + Course.courseCode);
            const trainerResponse = await request(app).delete("/api/user/" + Trainer.userID);
            const learnerResponse = await request(app).delete("/api/user/" + Learner.userID);

            expect(sectionResponse.status).to.eql(200);
            expect(classResponse.status).to.eql(200);
            expect(courseResponse.status).to.eql(200);
            expect(trainerResponse.status).to.eql(200);
            expect(learnerResponse.status).to.eql(200);
        }).timeout(10000)
    })
})
