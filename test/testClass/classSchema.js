module.exports.Class = {
  "courseCode": "IS999",
  "className": "G111",
  "userID": [
    "2"
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
  "classStartDate": "22/06/2021",
  "classEndDate": "15/10/2021",
  "enrolmentStartDate": "15/06/2021",
  "enrolmentEndDate": "21/09/2021",
  "minClassSize": 10,
  "maxClassSize": 30,
  "enrolledStudents": [
    "1"
  ]
}

module.exports.Quiz = {
  "courseCode": "IS999",
  "className": "G111",
  "quizDetails": [
    {
      "question": "How do you print?",
      "option": [
        "print()", "print[]", "printNow()"
      ],
      "answer": "0"
    }
  ],
  "quizDuration": 10
}

module.exports.NotExistQuiz = {
  "courseCode": "IS999000",
  "className": "G111222",
  "quizDetails": [
    {
      "question": "How to get an input in Python?",
      "option": [
        "input()", "scanner.nextLine()", "input[]", "next()"
      ],
      "answer": "0"
    }
  ],
  "quizDuration": 10
}

module.exports.Answer = {
  "courseCode": "IS888",
  "className": "G111",
  "quizAnswers": [
    "upwards", "Yes", "Yes", "Purple", "hey"
  ]
}

module.exports.WrongAnswer = {
  "courseCode": "IS888",
  "className": "G111",
  "quizAnswers": [
    "upwards", "No", "Yes", "Purple", "hey"
  ]
}

module.exports.Enrol = {
  "courseCode": "IS999",
  "className": "G111"
}

module.exports.NotExistEnrol = {
  "courseCode": "IS999000",
  "className": "G111222"
}

module.exports.Course = {
  "courseCode": "IS999",
  "courseTitle": "Fundamental Programming I",
  "courseDescription": "Fun mod",
  "prereqCourses": [
    
  ],
  "quizPassingMark": "50"
}

module.exports.Course1 = {
  "courseCode": "IS888",
  "courseTitle": "Innovation",
  "courseDescription": "Fluff mod",
  "prereqCourses": [
    
  ],
  "quizPassingMark": "60"
}

module.exports.User = {
  "userID": "999",
  "userName": "Tester_Learner",
  "userType": "learner",
  "learningCourses": [
    "IS888"
  ],
  "teachingCourses": [
    
  ],
  "completedCourses": [
    
  ]
}

module.exports.Class1 = {
  "courseCode": "IS888",
  "className": "G111",
  "userID": [
    "2"
  ],
  "quizDetails": [
    {
      "question": "What is the right way to eat?",
      "option": [
        "upwards",
        "left",
        "right"
      ],
      "answer": "upwards"
    },
    {
      "question": "What is the right way to eat?",
      "option": [
        "Yes",
        "No"
      ],
      "answer": "Yes"
    },
    {
      "question": "Can birds play?",
      "option": [
        "Yes",
        "No"
      ],
      "answer": "Yes"
    },
    {
      "question": "What is the color of China flag?",
      "option": [
        "Red",
        "Blue",
        "purple"
      ],
      "answer": "Red"
    },
    {
      "question": "Why are you gay?",
      "option": [
        "Because I am born like that",
        "I am not",
        "I am only human"
      ],
      "answer": "I am only human"
    }
  ],
  "quizDuration": 10,
  "classStartDate": "22/06/2021",
  "classEndDate": "15/10/2021",
  "enrolmentStartDate": "15/06/2021",
  "enrolmentEndDate": "21/09/2021",
  "minClassSize": 10,
  "maxClassSize": 30,
  "enrolledStudents": [
    "1"
  ]
}

module.exports.PrereqUser = {
  "userID": "777",
  "userName": "Tester_PrereqLearner",
  "userType": "learner",
  "learningCourses": [
    
  ],
  "teachingCourses": [
    
  ],
  "completedCourses": [
    "IS888"
  ]
}

module.exports.PrereqCourse = {
  "courseCode": "IS777",
  "courseTitle": "Innovating my society",
  "courseDescription": "The best Fluff mod ever",
  "prereqCourses": [
    "IS888"
  ],
  "quizPassingMark": "70"
}

module.exports.PrereqClass = {
  "courseCode": "IS777",
  "className": "G222",
  "userID": [
    "2"
  ],
  "quizDetails": [
    {
      "question": "How to do for loop?",
      "option": [
        "for i in 5", "for(int i = 0; i < 5; i++)", "for(i < 5)"
      ],
      "answer": "0"
    }
  ],
  "quizDuration": 10,
  "classStartDate": "22/06/2021",
  "classEndDate": "15/10/2021",
  "enrolmentStartDate": "15/06/2021",
  "enrolmentEndDate": "21/09/2021",
  "minClassSize": 10,
  "maxClassSize": 30,
  "enrolledStudents": [
    
  ]
}

module.exports.PrereqEnrol = {
  "courseCode": "IS777",
  "className": "G222"
}