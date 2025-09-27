# AI Interview Assistant - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   - Navigate to `http://localhost:5173`
   - You'll see two tabs: "Interviewee" and "Interviewer Dashboard"

## How to Use

### For Candidates (Interviewee Tab):
1. Upload your resume (PDF/DOCX)
2. Complete any missing information
3. Take the 6-question interview (2 Easy → 2 Medium → 2 Hard)
4. Each question has a timer (Easy: 20s, Medium: 60s, Hard: 120s)
5. Get your final score and AI summary

### For Interviewers (Dashboard Tab):
1. View all candidates with scores
2. Search and sort candidates
3. Click on any candidate to see detailed interview history
4. Review AI-generated summaries

## Features Implemented

✅ **Resume Upload & Parsing** - PDF/DOCX support with field extraction  
✅ **Missing Field Collection** - Chatbot prompts for incomplete info  
✅ **Timed Interview Flow** - 6 questions with progressive difficulty  
✅ **Two-Tab Interface** - Interviewee chat + Interviewer dashboard  
✅ **Local Persistence** - All data saved locally with Redux Persist  
✅ **Session Restoration** - Welcome back modal for incomplete interviews  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Search & Sort** - Dashboard functionality for candidate management  

## Technical Stack

- **Frontend**: React 19 + Vite
- **State Management**: Redux Toolkit + Redux Persist
- **UI Library**: Ant Design
- **Routing**: React Router
- **File Processing**: PDF-parse + Mammoth
- **Storage**: LocalStorage (via Redux Persist)

## Mock Data

The app uses mock AI responses and scoring for demonstration. In production, you would integrate with actual AI services like OpenAI GPT-4.

## File Structure

```
src/
├── App.jsx                 # Main app with tabs
├── store.js               # Redux store configuration
├── candidatesSlice.js     # Candidate data management
├── interviewSlice.js      # Interview state management
├── IntervieweePage.jsx    # Candidate interface
├── InterviewerPage.jsx    # Dashboard interface
├── ResumeUpload.jsx       # File upload component
├── InfoCollection.jsx     # Missing field collection
├── InterviewChat.jsx      # Main interview flow
├── WelcomeBackModal.jsx   # Session restoration
└── App.css               # Responsive styles
```

## Next Steps

To enhance the application:
1. Integrate real AI API (OpenAI, Claude, etc.)
2. Add more sophisticated resume parsing
3. Implement advanced scoring algorithms
4. Add video/audio interview capabilities
5. Export interview reports as PDF