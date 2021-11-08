// Ambrose Ang Tze Kiat ambrose.ang.2019
const request = require("supertest");
const app = require("../../index");
const expect = require("chai").expect;
const { Learner, Learner2, Learner3, Trainer, Course, Class, Progress, NewMaterial, NewMaterialNonExistentProgress, PassQuizNonExistentProgress } = require("./testProgressData.js")

describe("TDD for Progress", () => {
    describe("Setup", () => {
        it("Setup for testing", async () => {
            const learnerResponse = await request(app).post("/api/user").send(Learner);
            const learner2Response = await request(app).post("/api/user").send(Learner2);
            const learner3Response = await request(app).post("/api/user").send(Learner3);
            const trainerResponse = await request(app).post("/api/user").send(Trainer);
            const courseResponse = await request(app).post("/api/course").send(Course);
            const classResponse = await request(app).post("/api/class").send(Class);
            const sectionUpdateResponse = await request(app).post("/api/section/updateMaterials")
            .set('enctype', 'multipart/form-data')
            .set('content-type', 'multipart/form-data')
            .field("courseCode", Class.courseCode)
            .field("className", Class.className)
            .field("sectionName", "Section 1")
            .field("materialName", ["Slide 2", "Slide 10"])
            .field("myURL",  ["www.google.com", "www.google.com"])
            .field("materialType", ["urlType", "urlType"]);
            
            expect(sectionUpdateResponse.status).to.eql(200);
            expect(learnerResponse.status).to.eql(200);
            expect(learner2Response.status).to.eql(200);
            expect(learner3Response.status).to.eql(200);
            expect(trainerResponse.status).to.eql(200);
            expect(courseResponse.status).to.eql(200);
            expect(classResponse.status).to.eql(200);
        }).timeout(10000)
    });

    describe("POST Endpoints", () => {
        it("POST (create) progress: /api/progress", async () => {
            const res = await request(app).post("/api/progress").send(Progress);
            expect(res.status).to.eql(200);
            expect(res.body.courseCode).to.eql(Progress.courseCode);
            expect(res.body.className).to.eql(Progress.className);
            expect(res.body.sectionName).to.eql(Progress.sectionName);
            expect(res.body.userID).to.eql(Progress.userID);
            expect(res.body.sectionMaterialName).to.eql(Progress.sectionMaterialName);
        })

        it("POST (create) duplicate progress: /api/progress", async () => {
            const res = await request(app).post("/api/progress").send(Progress);
            expect(res.status).to.eql(400);
            expect(res.body.message).to.eql("Progress record already exists!")
        })
    })

    describe("GET Endpoints", () => {
        it("GET all progress: /api/progress", async () => {
            const res = await request(app).get("/api/progress");
            expect(res.status).to.eql(200);
        })

        it("GET all progress by user: /api/progress/:userID", async () => {
            const res = await request(app).get("/api/progress/" + Progress.userID);
            expect(res.status).to.eql(200);
        })

        it("GET all progress by non-existent user: /api/progress/:userID", async () => {
            const res = await request(app).get("/api/progress/" + Progress.userID + "$$$");
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql(`User ID ${Learner.userID}$$$ does not exist`)
        })

        it("GET all progress by courseCode, className and userID: /api/progress/:courseCode/:className/:userID", async () => {
            const res = await request(app).get("/api/progress/" + Progress.courseCode + "/" + Progress.className + "/" + Progress.userID);
            expect(res.status).to.eql(200);
        })

        it("GET specific progress by courseCode, className, sectionName, userID: /api/progress/:courseCode/:className/:sectionName/:userID", async () => {
            const res = await request(app).get("/api/progress/" + Progress.courseCode + "/" + Progress.className + "/" + Progress.sectionName + "/" + Progress.userID);
            expect(res.status).to.eql(200);
        })

        it("GET all completed sections progress by courseCode, className, userID: /api/progress/completedSections/retrieve/:courseCode/:className/:userID", async () => {
            const res = await request(app).get("/api/progress/completedSections/retrieve/" + Progress.courseCode + "/" + Progress.className + "/" + Progress.userID);
            expect(res.status).to.eql(200);
        })

        it("GET completed sections by non existent userID: /api/progress/completedSections/retrieve/:courseCode/:className/:userID", async () => {
            const res = await request(app).get("/api/progress/completedSections/retrieve/" + Progress.courseCode + "/" + Progress.className + "/" + Progress.userID + "$$$");
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql("No completed sections for ClassAppliedUserTDDTestLearner$$$ for ClassAppliedTMS929 ClassAppliedG1")
        })
    })

    describe("PUT Endpoints", () => {
        it("PUT a section material into progress record: /api/progress", async () => {
            const res = await request(app).put("/api/progress").send(NewMaterial);
            expect(res.status).to.eql(200);
            expect(res.body.sectionMaterialName).to.eql(["Slide 2", "Slide 10", "Slide 3"])
        })

        it("PUT a section material into non-existent progress record, should auto create: /api/progress", async () => {
            const res = await request(app).put("/api/progress").send(NewMaterialNonExistentProgress);
            expect(res.status).to.eql(200);
            expect(res.body.sectionMaterialName).to.eql(["Slide 4"])
        })

        it("PUT a quiz to pass: /api/progress/quiz", async () => {
            const res = await request(app).put("/api/progress/quiz").send(NewMaterialNonExistentProgress);
            expect(res.status).to.eql(200);
            expect(res.body.isSectionQuizComplete).to.eql(true)
        })

        it("PUT a quiz to pass in non-existent progress record, should auto create: /api/progress/quiz", async () => {
            const res = await request(app).put("/api/progress/quiz").send(PassQuizNonExistentProgress);
            expect(res.status).to.eql(200);
            expect(res.body.isSectionQuizComplete).to.eql(true)
        })
    })


    describe("DELETE Endpoints", () => {
        it("DELETE progress: /api/progress/:courseCode/:className/:sectionName/:userID", async () => {
            const res = await request(app).delete(`/api/progress/${Progress.courseCode}/${Progress.className}/${Progress.sectionName}/${Progress.userID}`);
            expect(res.status).to.eql(200);
            expect(res.body.message).to.eql("Progress record deleted");
        })

        it("DELETE NewMaterialNonExistentProgress: /api/progress/:courseCode/:className/:sectionName/:userID", async () => {
            const res = await request(app).delete(`/api/progress/${Progress.courseCode}/${Progress.className}/${Progress.sectionName}/${NewMaterialNonExistentProgress.userID}`);
            expect(res.status).to.eql(200);
            expect(res.body.message).to.eql("Progress record deleted");
        })

        it("DELETE PassQuizNonExistentProgress: /api/progress/:courseCode/:className/:sectionName/:userID", async () => {
            const res = await request(app).delete(`/api/progress/${Progress.courseCode}/${Progress.className}/${Progress.sectionName}/${PassQuizNonExistentProgress.userID}`);
            expect(res.status).to.eql(200);
            expect(res.body.message).to.eql("Progress record deleted");
        })

        it("DELETE non-existent progress: /api/progress/:courseCode/:className/:sectionName/:userID", async () => {
            const res = await request(app).delete(`/api/progress/${Progress.courseCode}/${Progress.className}/${Progress.sectionName}/${Progress.userID}`);
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql("No such record was found");
        })
    })

    describe("Teardown", () => {
        it("Teardown after testing", async () => {
            const sectionResponse = await request(app).delete("/api/section/delete/" + Class.courseCode + "/" + Class.className + "/" + "Section 1");
            const classResponse = await request(app).delete("/api/class/" + Class.courseCode + "/" + Class.className);
            const courseResponse = await request(app).delete("/api/course/delete/" + Course.courseCode);
            const trainerResponse = await request(app).delete("/api/user/" + Trainer.userID);
            const learnerResponse = await request(app).delete("/api/user/" + Learner.userID);
            const learner2Response = await request(app).delete("/api/user/" + Learner2.userID);
            const learner3Response = await request(app).delete("/api/user/" + Learner3.userID);

            expect(sectionResponse.status).to.eql(200);
            expect(classResponse.status).to.eql(200);
            expect(courseResponse.status).to.eql(200);
            expect(trainerResponse.status).to.eql(200);
            expect(learnerResponse.status).to.eql(200);
            expect(learner2Response.status).to.eql(200);
            expect(learner3Response.status).to.eql(200);
        }).timeout(10000)
    })
})

