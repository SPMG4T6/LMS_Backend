// const ClassModel = require('../models/class');
// const User = require('../models/user');
// const CourseModel = require('../models/course');

const courseEligibility = ({courseDoc, userArray, classDoc}) => 
    new Promise((resolve, reject) => {
        let eligibleUsers = []
        const coursePreReqArray = courseDoc['prereqCourses'];
        const courseCode = courseDoc.courseCode;

        userArray.forEach(user => {
            let enrolmentEligibility = true;
            let completedCourseCodes = [];
            let learningCourses = user.learningCourses;
            let teachingCourses = user.teachingCourses;
            let completedCourses = user.completedCourses;
            // [["IS111","24/25"],["IS442","23/25"]]
            completedCourses.forEach(element => {
                completedCourseCodes.push(element[0]);
            });

            if (learningCourses.includes(courseCode)) {
                enrolmentEligibility = false;
            } else if (teachingCourses.includes(courseCode)) {
                enrolmentEligibility = false;
            } else if (completedCourseCodes.includes(courseCode)) {
                enrolmentEligibility = false;
            } else {
                // user has no affiliation to this course
                if (classDoc) {
                    let enrolledStudents = classDoc.enrolledStudents;
            
                    // check if the class is full or not
                    if (enrolledStudents.length == classDoc.maxClassSize) {
                        reject(`${classDoc.courseCode } ${classDoc.className} is fully enrolled!`);
                        enrolmentEligibility = false;
                    }
                    else {
                        coursePreReqArray.forEach(element => {
                            if (!completedCourses.includes(element)) {
                                enrolmentEligibility = false;
                            }
                        });
                    }
                }
            }
            if (enrolmentEligibility) {
                eligibleUsers.push(user)
            }
        })
        resolve(eligibleUsers);
    })

module.exports = courseEligibility;