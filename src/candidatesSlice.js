import { createSlice } from '@reduxjs/toolkit';

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    list: [],
    selectedCandidate: null,
  },
  reducers: {
    addCandidate: (state, action) => {
      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      // Check for existing candidate by email to prevent duplicates
      const existingIndex = state.list.findIndex(c => c.email === action.payload.email);
      if (existingIndex === -1) {
        state.list.push(action.payload);
      } else {
        console.log('⚠️ Candidate already exists, not adding duplicate');
      }
    },
    updateCandidate: (state, action) => {
      if (!Array.isArray(state.list)) {
        state.list = [];
        return;
      }
      const index = state.list.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
        console.log('💾 Candidate updated in store:', state.list[index]);
      } else {
        console.log('⚠️ Candidate not found for update, ID:', action.payload.id);
      }
    },
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
  },
});

export const { addCandidate, updateCandidate, setSelectedCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;