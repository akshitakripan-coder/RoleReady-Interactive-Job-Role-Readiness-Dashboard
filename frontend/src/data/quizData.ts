export const quizData = [
  // General Questions
  {
    id: 1,
    roleId: 'general',
    question: "How much do you enjoy solving logical puzzles and algorithms?",
    options: [
      { text: "Love it, I could do it all day", score: 10 },
      { text: "It's interesting but can be tiring", score: 7 },
      { text: "I prefer visual or creative tasks", score: 4 },
      { text: "Not my cup of tea", score: 2 }
    ]
  },
  {
    id: 2,
    roleId: 'general',
    question: "When building a product, what's your primary focus?",
    options: [
      { text: "How it looks and feels to the user", score: 10 },
      { text: "How the data is processed and stored", score: 10 },
      { text: "The overall business impact and strategy", score: 8 },
      { text: "The underlying infrastructure and security", score: 9 }
    ]
  },
  // Frontend Specific
  {
    id: 3,
    roleId: 'frontend-dev',
    question: "How much do you enjoy working with CSS and styling components?",
    options: [
      { text: "I love making things look pixel-perfect", score: 10 },
      { text: "I enjoy it as long as it's not too complex", score: 7 },
      { text: "I prefer logic over styling", score: 4 },
      { text: "I find CSS frustrating", score: 2 }
    ]
  },
  // Backend Specific
  {
    id: 4,
    roleId: 'backend-dev',
    question: "How interested are you in database optimization and API performance?",
    options: [
      { text: "Very interested, I love efficient systems", score: 10 },
      { text: "I understand its importance", score: 7 },
      { text: "I prefer working on the UI", score: 4 },
      { text: "I find it boring", score: 2 }
    ]
  },
  // Data Science Specific
  {
    id: 5,
    roleId: 'data-scientist',
    question: "How much do you enjoy statistical analysis and data modeling?",
    options: [
      { text: "It's my favorite part of any project", score: 10 },
      { text: "I enjoy it with the right tools", score: 7 },
      { text: "I prefer building applications", score: 4 },
      { text: "I'm not a fan of statistics", score: 2 }
    ]
  },
  // UI/UX Specific
  {
    id: 6,
    roleId: 'ui-ux-designer',
    question: "How important is user research and empathy in your design process?",
    options: [
      { text: "It's the foundation of everything I do", score: 10 },
      { text: "It's very important", score: 8 },
      { text: "I focus more on the visual aesthetics", score: 6 },
      { text: "I just want to build things", score: 3 }
    ]
  }
];
