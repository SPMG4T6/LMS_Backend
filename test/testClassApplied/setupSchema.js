module.exports.Learner = {
    "userID": "ClassAppliedUserTDDTestLearner",
    "userName": "ClassAppliedUserTDDTestLearner",
    "userType": "Learner",
    "learningCourses": [
    ],
    "teachingCourses": [
    ],
    "completedCourses": [
    ]
}

module.exports.Trainer = {
    "userID": "ClassAppliedUserTDDTestTrainer",
    "userName": "ClassAppliedUserTDDTestTrainer",
    "userType": "Trainer",
    "learningCourses": [
        "TMS929"
    ],
    "teachingCourses": [
    ],
    "completedCourses": [
    ]
}

module.exports.Course = {
    "courseCode": "ClassAppliedTMS929",
    "courseTitle": "Techno",
    "courseDescription": "Overseas Exposure",
    "prereqCourses": [
    
    ],
    "quizPassingMark": 85
}

module.exports.Class = {
    "courseCode": "ClassAppliedTMS929",
    "className": "ClassAppliedG1",
    "userID": [
        "ClassAppliedUserTDDTestTrainer"
    ],
    "quizDetails": [
        {
            "question": "How do you print?",
            "option": [
                "print()", "print[]", "printNow()"
            ],
            "answer": "0"
        }
    ],
    "quizDuration": 10,
    "classStartDate": "22/06/2022",
    "classEndDate": "15/10/2022",
    "enrolmentStartDate": "15/06/2022",
    "enrolmentEndDate": "21/09/2022",
    "minClassSize": 10,
    "maxClassSize": 30,
    "enrolledStudents": [
    ]
}

module.exports.ClassApplied = {
    "courseCode": "ClassAppliedTMS929",
    "className": "ClassAppliedG1",
    "userID": "ClassAppliedUserTDDTestLearner",
    "userName": "ClassAppliedUserTDDTestLearner"
}
