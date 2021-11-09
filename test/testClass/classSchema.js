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

module.exports.UngradedQuestions = {
  "quizDetails": [
    {
      "question": "Is it possible to change the flow of electricity?",
      "option": [
        "Yes", "No"
      ],
      "answer": "Yes"
    },
    {
      "question": "Does Python programming language have print?",
      "option": [
        "Yes", "No"
      ],
      "answer": "Yes"
    },
    {
      "question": "It is not possible to do OOP in Python. True or False.",
      "option": [
        "True", "False"
      ],
      "answer": "False"
    }
  ]
}

module.exports.UngradedAnswer = {
  "courseCode": "IS888",
  "className": "G111",
  "quizAnswers": [
    "Yes", "Yes", "True"
  ],
  "sectionName": "Section 1"
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
  "quizPassingMark": 50
}

module.exports.Course1 = {
  "courseCode": "IS888",
  "courseTitle": "Innovation",
  "courseDescription": "Fluff mod",
  "prereqCourses": [
    
  ],
  "quizPassingMark": 60
}

module.exports.User = {
  "userID": "999",
  "userName": "Tester_Learner",
  "userType": "Learner",
  "learningCourses": [
    [ 'IS888', 'G111' ]
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
  "userType": "Learner",
  "learningCourses": [
    
  ],
  "teachingCourses": [
    
  ],
  "completedCourses": [
    [
      "IS888",
      "G111",
      "4/5"
    ]
  ]
}

module.exports.PrereqCourse = {
  "courseCode": "IS777",
  "courseTitle": "Innovating my society",
  "courseDescription": "The best Fluff mod ever",
  "prereqCourses": [
    "IS888"
  ],
  "quizPassingMark": 70
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

module.exports.Section = {
  "courseCode": "CS555",
  "className": "G1",
  "sectionName": "Introduction to Cybersecurity",
  "sectionSequence": 1,
  "quizDetails": [
    {
      "question": "What is IP?",
      "option": [
        "Internal dressing", "Internet Protocol", "Internally Producing"
      ],
      "answer": "Internet Protocol"
    },
  {
      "question": "Can you change your subnet mask?",
      "option": [
        "Yes", "No"
      ],
      "answer": "Yes"
    },
  {
      "question": "You can remove your firewall. True or False.",
      "option": [
        "True", "False"
      ],
      "answer": "True"
    }
  ],
  "quizDuration": 10,
  "sectionMaterial": []
}