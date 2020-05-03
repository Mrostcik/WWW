const quiz = JSON.parse(`{
    "info": {
        "difficulty": "Easy",
        "description": "Simple algebraic quiz"
    },
    "questions": [
        {
            "question": "2^2 + 5",
            "answers": [
                "7",
                "8",
                "9",
                "10"
            ],
            "penalty": 5,
            "correctAnswer": 2
        },
        {
            "question": "0!",
            "answers": [
                "2",
                "1",
                "0",
                "-1"
            ],
            "penalty": 10,
            "correctAnswer": 1
        },
        {
            "question": "92 - 7 + 14",
            "answers": [
                "97",
                "101",
                "95",
                "99"
            ],
            "penalty": 4,
            "correctAnswer": 3
        },
        {
            "question": "27^0",
            "answers": [
                "27",
                "0",
                "1",
                "-1"
            ],
            "penalty": 6,
            "correctAnswer": 2
        },
        {
            "question": "-(2)^4",
            "answers": [
                "16",
                "-16",
                "-8",
                "8"
            ],
            "penalty": 6,
            "correctAnswer": 1
        }
    ]
}`) as Object;

