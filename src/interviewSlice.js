import { createSlice } from '@reduxjs/toolkit';

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    currentCandidate: null,
    currentQuestion: 0,
    questions: [],
    answers: [],
    timeLeft: 0,
    isActive: false,
    isPaused: false,
    stage: 'upload', // upload, info, interview, completed
  },
  reducers: {
    startInterview: (state, action) => {
      state.currentCandidate = action.payload;
      state.stage = 'info';
      state.questions = [];
      state.answers = [];
      state.currentQuestion = 0;
      state.isPaused = true; // Start paused to show WelcomeBackModal
    },
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload);
    },
    nextQuestion: (state) => {
      state.currentQuestion += 1;
    },
    setTimer: (state, action) => {
      state.timeLeft = action.payload;
      state.isActive = true;
    },
    pauseTimer: (state) => {
      state.isPaused = true;
      state.isActive = false;
    },
    resumeTimer: (state) => {
      state.isPaused = false;
      state.isActive = true;
    },
    tickTimer: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    resetInterview: (state) => {
      state.currentCandidate = null;
      state.currentQuestion = 0;
      state.questions = [];
      state.answers = [];
      state.timeLeft = 0;
      state.isActive = false;
      state.isPaused = false;
      state.stage = 'upload';
    },
  },
});

export const {
  startInterview,
  setStage,
  addQuestion,
  addAnswer,
  nextQuestion,
  setTimer,
  pauseTimer,
  resumeTimer,
  tickTimer,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;