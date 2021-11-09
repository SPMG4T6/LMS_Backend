//Development Lead: Rachel Esther Chan Li

const request = require("supertest");
const app = require("../../index");
const chai = require('chai');
// Development Lead: Rachel

const chaiHTTP = require('chai-http');
const expect = require("chai").expect;
chai.use(chaiHTTP);
const {Course1, Course2, Class1, Class2, PrereqUser, Section1, Section1Quiz, Section1MaterialsUpdate} = require('./testSectionData');

describe("TDD for Section", () => {

    describe("Creating Dependencies", () => {
        it("Creating dependencies", async () => {
            const Course1resp = await request(app).post("/api/course").send(Course1);
            const Course2resp = await request(app).post("/api/course").send(Course2);
            const preReqUserresp = await request(app).post("/api/user").send(PrereqUser);
            const Class1resp = await request(app).post("/api/class").send(Class1);
            const Class2resp = await request(app).post("/api/class").send(Class2);

            expect(Course1resp.status).to.equal(200);
            expect(Course2resp.status).to.equal(200);
            expect(preReqUserresp.status).to.equal(200);
            expect(Class1resp.status).to.equal(200);
            expect(Class2resp.status).to.equal(200);
        }).timeout(5000)
    })


    describe("POST Endpoints", () => {
        it("POST Create Section manually: /api/section, should return status 200", async () => {
            const res = await request(app).post("/api/section")
            .set('enctype', 'multipart/form-data')
            .set('content-type', 'multipart/form-data')
            .field("courseCode", Section1.courseCode)
            .field("className", Section1.className)
            .field("sectionName", Section1.sectionName)
            .field("sectionSequence", Section1.sectionSequence)
            .field("quizDetails", Section1.quizDetails)
            .field("quizDuration", Section1.quizDuration)
            .field("materialName", Section1.materialName)
            .field("myURL",  Section1.myURL)
            .field("materialType", Section1.materialType)
            .attach("myFile", Section1.myFile[0])
            .attach("myFile", Section1.myFile[1])
            expect(res.status).to.eql(200);
            expect(res.body.courseCode).to.eql(Section1.courseCode);
            expect(res.body.className).to.eql(Section1.className);
            expect(res.body.sectionName).to.eql(Section1.sectionName);
            expect(res.body.quizDuration).to.eql(Section1.quizDuration);
            expect(res.body.quizDetails).to.eql(Section1.quizDetails);
            expect(res.body.sectionMaterial.length).to.eql(Section1.materialName.length);
        }).timeout(20000)

        it("POST Create duplicate Section manually: /api/section, should return status 400", async () => {
            const res = await request(app).post("/api/section")
            .set('enctype', 'multipart/form-data')
            .set('content-type', 'multipart/form-data')
            .field("courseCode", Section1.courseCode)
            .field("className", Section1.className)
            .field("sectionName", Section1.sectionName)
            .field("sectionSequence", Section1.sectionSequence)
            .field("quizDetails", Section1.quizDetails)
            .field("quizDuration", Section1.quizDuration)
            .field("materialName", Section1.materialName)
            .field("myURL",  Section1.myURL)
            .field("materialType", Section1.materialType)
            .attach("myFile", Section1.myFile[0])
            .attach("myFile", Section1.myFile[1])
            expect(res.status).to.eql(400);
            expect(res.body.message).to.eql("Section already exists");
        })

        it("POST Create Section manually in a class that does not exist: /api/section, should return status 400", async () => {
            const res = await request(app).post("/api/section")
            .set('enctype', 'multipart/form-data')
            .set('content-type', 'multipart/form-data')
            .field("courseCode", Section1.courseCode)
            .field("className", "ThisClassDoesNotExist")
            .field("sectionName", Section1.sectionName)
            .field("sectionSequence", Section1.sectionSequence)
            .field("quizDetails", Section1.quizDetails)
            .field("quizDuration", Section1.quizDuration)
            .field("materialName", Section1.materialName)
            .field("myURL",  Section1.myURL)
            .field("materialType", Section1.materialType)
            .attach("myFile", Section1.myFile[0])
            .attach("myFile", Section1.myFile[1])
            expect(res.status).to.eql(400);
            expect(res.body.message).to.eql("Class does not exist");
        })

        it("POST Update section materials for a section: /section/updateMaterials, should return status 200", async () => {
            const res = await request(app).post("/api/section/updateMaterials")
            .set('enctype', 'multipart/form-data')
            .set('content-type', 'multipart/form-data')
            .field("courseCode", Section1MaterialsUpdate.courseCode)
            .field("className", Section1MaterialsUpdate.className)
            .field("sectionName", Section1MaterialsUpdate.sectionName)
            .field("sectionSequence", Section1MaterialsUpdate.sectionSequence)
            .field("quizDetails", Section1MaterialsUpdate.quizDetails)
            .field("quizDuration", Section1MaterialsUpdate.quizDuration)
            .field("materialName", Section1MaterialsUpdate.materialName)
            .field("myURL",  Section1MaterialsUpdate.myURL)
            .field("materialType", Section1MaterialsUpdate.materialType)
            .attach("myFile", Section1MaterialsUpdate.myFile[0])
            .attach("myFile", Section1MaterialsUpdate.myFile[1])
            expect(res.status).to.eql(200);
            expect(res.body.courseCode).to.eql(Section1.courseCode);
            expect(res.body.className).to.eql(Section1.className);
            expect(res.body.sectionName).to.eql(Section1.sectionName);
            expect(res.body.quizDuration).to.eql(Section1.quizDuration);
            expect(res.body.quizDetails).to.eql(Section1.quizDetails);
        })
    })


    describe("GET Endpoints", () => {
        it("Get a list of all sections: /api/sections, should return status 200", async () => {
            const res = await request(app).get("/api/sections")
            expect(res.status).to.eql(200)
        })

        it("Get a list sections by existing course code and class name: /api/sections/{courseCode}/{className}, should return status 200", async () => {
            const res = await request(app).get(`/api/sections/${Section1.courseCode}/${Section1.className}`)
            expect(res.status).to.eql(200);
            expect(res.body.length).to.eql(2);
        })

        it("Get a specific section by existing course code, class name and section name: /api/sections/{courseCode}/{className}/{sectionName}, should return status 200", async () => {
            const res = await request(app).get(`/api/sections/${Section1.courseCode}/${Section1.className}/${Section1.sectionName}`)
            expect(res.status).to.eql(200);
            expect(res.body[0].courseCode).to.eql(Section1.courseCode);
            expect(res.body[0].className).to.eql(Section1.className);
            expect(res.body[0].sectionName).to.eql(Section1.sectionName);
            expect(res.body[0].sectionMaterial.length).to.eql(7);

        })

        it("Get non-existent section: /api/sections/{courseCode}/{className}/{sectionName}, should return status 404", async () => {
            const res = await request(app).get(`/api/sections/${Class1.courseCode}/${Class1.className}/NonExistentSectionTDD`)
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql("No section found");
        })

        it("Get section material link: /api/section/material/{courseCode}/{className}/{sectionName}/{materialName}, should return status 200", async () => {
            const res = await request(app).get(`/api/section/material/${Section1.courseCode}/${Section1.className}/${Section1.sectionName}/${Section1.materialName[0]}`)
            expect(res.status).to.eql(200);
            expect(res.text).to.eql(Section1.myURL[0])
        })

        it("Get non-existen section material link: /api/section/material/{courseCode}/{className}/{sectionName}/{materialName}, should return status 404", async () => {
            const res = await request(app).get(`/api/section/material/${Section1.courseCode}/${Section1.className}/${Section1.sectionName}/M89`)
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql("Material does not exist")
        })

    })


    describe("PUT Endpoints", () => {
        it("Update quiz details of a section: /api/section/quiz/{courseCode}/{className}/{sectionName}, should return status 200", async () => {
            const res = await request(app).put(`/api/section/quiz/${Section1.courseCode}/${Section1.className}/${Section1.sectionName}`)
            .send(Section1Quiz)
            expect(res.status).to.eql(200);
            expect(res.body.courseCode).to.eql(Section1.courseCode);
            expect(res.body.className).to.eql(Section1.className);
            expect(res.body.sectionName).to.eql(Section1.sectionName);
        })

        it("Update quiz details of a non-existent section: /api/section/quiz/{courseCode}/{className}/{sectionName}, should return status 404", async () => {
            const res = await request(app).put(`/api/section/quiz/${Section1.courseCode}/${Section1.className}/NotExistentSection`)
            .send(Section1Quiz)
            expect(res.status).to.eql(404);
            expect(res.body.message).to.eql("Section not found");
        })
    })
    

    describe("DELETE Endpoints", () => {
        it("Delete a specific section: /api/section/delete/{courseCode}/{className}/{sectionName}", async () => {
            const res = await request(app).delete(`/api/section/delete/${Section1.courseCode}/${Section1.className}/${Section1.sectionName}`)
            expect(res.status).to.eql(200);
        })
    })


    describe("Deleting Dependencies", () => {
        it("Deleting dependencies", async () => {
            const Course1resp = await request(app).delete("/api/course/delete/" + Course1.courseCode);
            const Course2resp = await request(app).delete("/api/course/delete/" + Course2.courseCode);
            const preReqUserresp = await request(app).delete(`/api/user/${PrereqUser.userID}`);
            const section1Response = await request(app).delete("/api/section/delete/" + Class1.courseCode + "/" + Class1.className + "/" + "Section 1");
            const section2Response = await request(app).delete("/api/section/delete/" + Class2.courseCode + "/" + Class2.className + "/" + "Section 1");
            // const manualSectionResponse = await request(app).delete(`/api/section/delete/${Section1.courseCode}/${Section1.className}/${Section1.sectionName}`)
            const Class1resp = await request(app).delete(`/api/class/${Course1.courseCode}/${Class1.className}`);
            const Class2resp = await request(app).delete(`/api/class/${Course2.courseCode}/${Class2.className}`);

            expect(Course1resp.status).to.equal(200);
            expect(Course2resp.status).to.equal(200);
            expect(preReqUserresp.status).to.equal(200);
            expect(section1Response.status).to.equal(200);
            expect(section2Response.status).to.equal(200);
            // expect(manualSectionResponse.status).equal(200);
            expect(Class1resp.status).to.equal(200);
            expect(Class2resp.status).to.equal(200);
        }).timeout(5000)
    })


})