module.exports.Course1 = {
    "courseCode": "IS110001",
    "courseTitle": "Innovation II",
    "courseDescription": "Fluff mod",
    "prereqCourses": [
    
    ],
    "quizPassingMark": 85
}

module.exports.Course2 = {
    "courseCode": "IS999001",
    "courseTitle": "Algorithm Optimization II",
    "courseDescription": "Hardest mod",
    "prereqCourses": [
    "IS998"
    ],
    "quizPassingMark": 90
}

module.exports.Class1 = {
    "courseCode": "IS110001",
    "className": "G1111",
    "userID": [
        "2"
    ],
    "quizDetails": [
    {
        "question": "What is the right way to eat?",
        "option": [
            "Yes", "No"
        ],
        "answer": "No"
    }
    ],
    "quizDuration": 10,
    "classStartDate": "22/06/2021",
    "classEndDate": "15/10/2021",
    "enrolmentStartDate": "15/06/2021",
    "enrolmentEndDate": "21/09/2021",
    "minClassSize": 1,
    "maxClassSize": 20,
    "enrolledStudents": [
        "777"
    ]
}

module.exports.Class2 = {
    "courseCode": "IS999001",
    "className": "G1111",
    "userID": [
        "2"
    ],
    "quizDetails": [
    {
        "question": "What is the right way to eat?",
        "option": [
            "Yes", "No"
        ],
        "answer": "No"
    }
    ],
    "quizDuration": 10,
    "classStartDate": "22/06/2021",
    "classEndDate": "15/10/2021",
    "enrolmentStartDate": "15/06/2021",
    "enrolmentEndDate": "21/09/2021",
    "minClassSize": 1,
    "maxClassSize": 25,
    "enrolledStudents": [
        "777"
    ]
}

module.exports.PrereqUser = {
    "userID": "7778",
    "userName": "Tester_PrereqLearner2",
    "userType": "learner",
    "learningCourses": [
      
    ],
    "teachingCourses": [
      
    ],
    "completedCourses": [
      "IS888"
    ]
  }

module.exports.Section1 = {
    "courseCode": "IS110001",
    "className": "G1111",
    "sectionName": "ContentSectionFromTDD",
    "sectionSequence": "1",
    "quizDetails": [],
    "quizDuration": 10,
    "materialName": [ 'M1', 'Test pdf', 'M1', 'Test ppt' ],
    "myURL": ['www.google.com','','https://www.youtube.com/watch?v=hRok6zPZKMA',''],
    "materialType": [ 'urlType', 'uploadType', 'urlType', 'uploadType' ],
    "myFile": [`./test/testSection/test.pdf`, `./test/testSection/test.pptx`]
}

module.exports.Section1Quiz = {
    "quizDetails": [
        {
            "question": "What is the right way to eat?",
            "option": [
            "Yes",
            "No"
            ],
            "answer": "Yes"
        },
        {
            "question": "What is the wrong way to eat?",
            "option": [
            "Correct",
            "Wrong"
            ],
            "answer": "Wrong"
        }
    ]
}

module.exports.Section1MaterialsUpdate = {
    "courseCode": "IS110001",
    "className": "G1111",
    "sectionName": "ContentSectionFromTDD",
    "sectionSequence": "1",
    "quizDetails": [],
    "quizDuration": 10,
    "materialName": [ 'M2', 'Test doc', 'M1', 'TestCopy ppt' ],
    "myURL": ['https://www.youtube.com/watch?v=hRok6zPZKMA','','www.google.com',''],
    "materialType": [ 'urlType', 'uploadType', 'urlType', 'uploadType' ],
    "myFile": [`./test/testSection/test.docx`, `./test/testSection/testCopy.pptx`]
}