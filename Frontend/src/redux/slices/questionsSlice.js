import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  questions: [],
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestionsData: (state, action) => {
      state.questions = action.payload;
    },
    updateQuestionsData: (state, action) => {
      const questionData = { ...action.payload };
      questionData.session_id = Number(questionData.session_id);

      state.questions = [...state.questions, questionData];
    },
    deleteQuestionsData: (state, action) => {
        const { id } = action.payload;
        state.questions = state.questions.filter((question) => question.id !== id);
    },
    resetQuestionsData: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setQuestionsData,
  updateQuestionsData,
  deleteQuestionsData,
  resetQuestionsData,
} = questionsSlice.actions;

export default questionsSlice.reducer;
