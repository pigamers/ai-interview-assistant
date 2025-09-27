import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import candidatesSlice from './candidatesSlice';
import interviewSlice from './interviewSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['interview'], // Don't persist interview state
};

const candidatesPersistConfig = {
  key: 'candidates',
  storage,
  transforms: [
    {
      in: (state) => {
        // Remove large resume files and chat history to save space
        if (!state || !state.list) return state;
        return {
          ...state,
          list: state.list.map(candidate => ({
            ...candidate,
            resumeFile: undefined, // Remove base64 resume data
            resumeText: candidate.resumeText?.substring(0, 500), // Keep only first 500 chars
            chatHistory: candidate.chatHistory?.slice(-10) // Keep only last 10 messages
          }))
        };
      },
      out: (state) => state
    }
  ]
};

const rootReducer = combineReducers({
  candidates: persistReducer(candidatesPersistConfig, candidatesSlice),
  interview: interviewSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);