# AI Interview Assistant

An intelligent interview platform that automates the technical interview process using AI-powered question generation, real-time scoring, and comprehensive candidate evaluation.

## 🚀 Features

### For Candidates (Interviewees)
- **Smart Resume Upload**: Upload PDF/DOCX resumes with automatic text extraction
- **AI-Powered CV Parsing**: Automatically extracts name, email, and phone using Groq AI
- **Adaptive Interview Flow**: 6 questions with progressive difficulty (Easy → Medium → Hard)
- **Real-Time Timer**: Difficulty-based time limits (20s/60s/120s)
- **Instant AI Scoring**: Get immediate feedback and scores for each answer
- **Welcome Back Modal**: Resume interrupted interviews seamlessly

### For Interviewers (Dashboard)
- **Candidate Management**: View all candidates with completion status
- **Detailed Analytics**: Individual candidate performance with scores
- **Search & Filter**: Find candidates by name or email
- **Interview History**: Complete chat logs with questions, answers, and scores
- **AI-Generated Summaries**: Professional evaluation summaries for each candidate

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Ant Design
- **State Management**: Redux Toolkit with Redux Persist
- **AI Services**: 
  - Groq (LLaMA 3.1) for question generation and scoring
  - ApyHub for PDF text extraction
- **Styling**: Ant Design components with custom CSS
- **File Processing**: Axios for API calls, FileReader for local processing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key
- ApyHub API key

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your API keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_APYHUB_API_KEY=your_apyhub_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 How It Works

### Interview Process
1. **Resume Upload**: Candidate uploads their resume (PDF/DOCX)
2. **AI Extraction**: ApyHub extracts text, Groq AI parses contact information
3. **Validation**: System prompts for any missing information (name/email/phone)
4. **Interview Start**: Welcome modal appears with resume option
5. **Question Flow**: 
   - Questions 1-2: Easy (10 marks each, 20s timer)
   - Questions 3-4: Medium (20 marks each, 60s timer)  
   - Questions 5-6: Hard (30 marks each, 120s timer)
6. **AI Scoring**: Each answer scored by AI with feedback
7. **Completion**: Final score calculated and summary generated

### Scoring System
- **Total Possible**: 120 marks (2×10 + 2×20 + 2×30)
- **Final Score**: Percentage of total marks achieved
- **AI Criteria**: Technical accuracy, completeness, best practices, clarity
- **Status Tracking**: "In Progress" vs "Completed" based on interview completion

## 📁 Project Structure

```
ai-interview-assistant/
├── public/
│   └── vite.svg                # Vite logo
├── src/
│   ├── assets/
│   │   └── react.svg           # React logo
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global styles
│   ├── index.css               # Base styles
│   ├── main.jsx                # Application entry point
│   ├── aiService.js            # AI integration (Groq)
│   ├── ResumeUpload.jsx        # File upload and processing
│   ├── IntervieweePage.jsx     # Candidate interface
│   ├── InterviewerPage.jsx     # Dashboard for interviewers
│   ├── InterviewChat.jsx       # Interview interface
│   ├── WelcomeBackModal.jsx    # Resume interview modal
│   ├── InfoCollection.jsx      # Candidate info form
│   ├── store.js                # Redux store configuration
│   ├── interviewSlice.js       # Interview state management
│   ├── candidatesSlice.js      # Candidate data management
│   └── storageUtils.js         # Local storage utilities
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

## 🔧 Configuration

### Environment Variables
- `VITE_GROQ_API_KEY`: Your Groq API key for AI services
- `VITE_APYHUB_API_KEY`: Your ApyHub API key for PDF processing

### Supported File Types
- PDF files (.pdf)
- Word documents (.docx)
- Text files (.txt) - for testing

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Progress Tracking**: Visual progress bar and question counter
- **Real-Time Feedback**: Immediate scoring and feedback display
- **Blur Effects**: Modal backgrounds with backdrop blur
- **Status Indicators**: Color-coded tags for completion status
- **Search Functionality**: Quick candidate lookup in dashboard

## 🔒 Security Features

- **Environment Variables**: API keys stored securely
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Graceful fallbacks for API failures
- **Data Persistence**: Secure local storage with Redux Persist

## 🚦 API Integration

### Groq AI Services
- **Question Generation**: Context-aware technical questions
- **Answer Scoring**: Intelligent evaluation with feedback
- **Summary Generation**: Professional candidate assessments
- **Contact Extraction**: Smart parsing of resume data

### ApyHub Services
- **PDF Text Extraction**: Reliable document processing
- **Multi-format Support**: PDF and DOCX compatibility

> **⚠️ Note**: ApyHub free tier allows only **5 API calls per day**. For production use, consider upgrading to a paid plan or implementing alternative PDF processing solutions.

## 📊 Performance Features

- **Lazy Loading**: Optimized component loading
- **State Persistence**: Interview progress saved locally
- **Error Recovery**: Automatic retry mechanisms
- **Efficient Rendering**: Optimized React components

## 🐛 Troubleshooting

### Common Issues
1. **API Key Errors**: Ensure environment variables are set correctly
2. **PDF Processing**: Check ApyHub API limits and file size
3. **Interview State**: Clear browser storage if state issues occur
4. **Network Errors**: Verify internet connection for AI services

### Development Tips
- Use browser dev tools to monitor API calls
- Check console logs for detailed error information
- Verify environment variables are loaded correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Groq**: For providing powerful AI capabilities
- **ApyHub**: For reliable document processing services
- **Ant Design**: For beautiful UI components
- **React Team**: For the amazing framework

---

**Built with ❤️ for modern technical interviews**