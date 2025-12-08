export const questions = [
    {
        id: 1,
        text: "How often do you feel overwhelmed by your daily tasks?",
        type: "scale", // 1-10
        minLabel: "Never",
        maxLabel: "Always"
    },
    {
        id: 2,
        text: "How would you rate your sleep quality recently?",
        type: "choice",
        options: [
            { text: "Excellent", score: 0 },
            { text: "Good", score: 25 },
            { text: "Fair", score: 50 },
            { text: "Poor", score: 75 },
            { text: "Very Poor", score: 100 }
        ]
    },
    {
        id: 3,
        text: "Do you frequently feel irritable or angry over small things?",
        type: "yesno",
        yesScore: 100, // High stress indicator
        noScore: 0
    },
    {
        id: 4,
        text: "How often do you find it hard to relax?",
        type: "scale",
        minLabel: "Rarely",
        maxLabel: "Very Often"
    },
    {
        id: 5,
        text: "Does work or school pressure feel unmanageable?",
        type: "choice",
        options: [
            { text: "Not at all", score: 0 },
            { text: "A little", score: 30 },
            { text: "Moderately", score: 60 },
            { text: "A lot", score: 100 }
        ]
    },
    {
        id: 6,
        text: "How often do you experience physical symptoms of stress (headaches, tension)?",
        type: "scale",
        minLabel: "Never",
        maxLabel: "Frequently"
    },
    {
        id: 7,
        text: "Do you feel you have enough support from friends or family?",
        type: "yesno",
        yesScore: 0,
        noScore: 80 // Lack of support is a stressor
    },
    {
        id: 8,
        text: "How often do you worry about the future?",
        type: "scale",
        minLabel: "Rarely",
        maxLabel: "Constantly"
    },
    {
        id: 9,
        text: "Are you able to manage your time effectively?",
        type: "choice",
        options: [
            { text: "Yes, easily", score: 0 },
            { text: "Most of the time", score: 30 },
            { text: "Sometimes", score: 60 },
            { text: "Rarely", score: 90 }
        ]
    },
    {
        id: 10,
        text: "Overall, how would you rate your current stress level?",
        type: "scale",
        minLabel: "Low",
        maxLabel: "Extreme"
    }
];
