import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Input, Button, Typography, Progress, Tag, Space } from 'antd';
import { ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { addQuestion, addAnswer, nextQuestion, setTimer, tickTimer, setStage, pauseTimer } from './interviewSlice';
import { updateCandidate } from './candidatesSlice';
import { generateQuestion, scoreAnswer, generateSummary } from './aiService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TIMERS = { easy: 20, medium: 60, hard: 120 };

const InterviewChat = () => {
  const dispatch = useDispatch();
  const { currentCandidate, currentQuestion, questions, answers, timeLeft, isActive, stage, isPaused } = useSelector(state => state.interview);
  const { list } = useSelector(state => state.candidates);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const timerRef = useRef();

  const candidate = list.find(c => c.id === currentCandidate?.id);

  // Expose function to WelcomeBackModal
  useEffect(() => {
    window.startFirstQuestion = () => {
      if (questions.length === 0) {
        setHasStarted(true);
        startNextQuestion();
      }
    };
    return () => {
      delete window.startFirstQuestion;
    };
  }, [questions.length]);

  useEffect(() => {
    // Only auto-start if not paused (WelcomeBackModal will handle paused state)
    if (stage === 'interview' && questions.length === 0 && !hasStarted && !isPaused) {
      setHasStarted(true);
      startNextQuestion();
    }
  }, [stage, hasStarted, isPaused]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        dispatch(tickTimer());
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSubmitAnswer();
    }
    
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isActive]);

  const getQuestionDifficulty = (questionCount) => {
    // console.log('Getting difficulty for questionCount:', questionCount);
    if (questionCount < 2) return 'easy';   // Questions 1-2
    if (questionCount < 4) return 'medium'; // Questions 3-4
    return 'hard';                          // Questions 5-6
  };

  const startNextQuestion = async () => {
    // console.log('🏁 startNextQuestion called:', { currentQuestion, stage });
    
    if (currentQuestion >= 6) {
      // console.log('✅ Interview complete, calling completeInterview');
      completeInterview();
      return;
    }

    setIsGeneratingQuestion(true);
    const difficulty = getQuestionDifficulty(questions.length);
    // console.log('🎯 Question difficulty:', difficulty, 'for currentQuestion index:', currentQuestion, 'question number:', currentQuestion + 1);
    
    try {
      // console.log('🔄 Calling generateQuestion...');
      const question = await generateQuestion(difficulty, currentQuestion + 1);
      // console.log('✅ Question generated:', question);
      
      dispatch(addQuestion({ text: question, difficulty, timestamp: Date.now() }));
      dispatch(setTimer(TIMERS[difficulty]));
      
      if (question && question.trim()) {
        // console.log('💬 Adding question to messages');
        setMessages(prev => {
          const newMessages = [...prev, { type: 'question', content: question, difficulty }];
          // console.log('📝 Updated messages:', newMessages);
          return newMessages;
        });
      } else {
        console.error('❌ Question is empty or invalid:', question);
      }
    } catch (error) {
      console.error('💥 Failed to generate question:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `❌ ${error.message}` 
      }]);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    const answer = currentAnswer.trim() || 'No answer provided';
    
    // Wait for question to be available
    if (questions.length === 0 || !questions[currentQuestion]) {
      // console.error('No current question found:', { currentQuestion, questions });
      return;
    }
    
    const currentQ = questions[currentQuestion];
    
    // Stop timer immediately
    clearTimeout(timerRef.current);
    dispatch(pauseTimer());
    setIsScoring(true);
    
    try {
      const { score, feedback } = await scoreAnswer(currentQ.text, answer, currentQ.difficulty);
      
      dispatch(addAnswer({ text: answer, score, feedback, timestamp: Date.now() }));
      
      setMessages(prev => [...prev, { 
        type: 'answer', 
        content: answer, 
        score,
        feedback 
      }]);
      
      setCurrentAnswer('');
      dispatch(nextQuestion());
      
      // Check if this was the last question
      if (currentQuestion + 1 >= 6) {
        completeInterview();
      } else {
        setTimeout(() => {
          startNextQuestion();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to score answer:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `❌ ${error.message}` 
      }]);
    } finally {
      setIsScoring(false);
    }
  };

  const completeInterview = async () => {
    // Stop any active timer
    clearTimeout(timerRef.current);
    dispatch(pauseTimer());
    
    const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
    const maxPossibleScore = 120; // 2*10 + 2*20 + 2*30 = 120
    const finalScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    try {
      const summary = await generateSummary(candidate, questions, answers);
      
      const updatedCandidate = {
        ...candidate,
        finalScore,
        summary,
        chatHistory: messages,
        completedAt: new Date().toISOString(),
      };
      
      console.log('💾 Updating candidate with final score:', updatedCandidate);
      dispatch(updateCandidate(updatedCandidate));
      dispatch(setStage('completed'));
      
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: `Interview completed! Your final score is ${finalScore}/100.\n\n${summary}` 
      }]);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      
      const updatedCandidate = {
        ...candidate,
        finalScore,
        summary: `Interview completed with a score of ${finalScore}/100. AI summary generation failed.`,
        chatHistory: messages,
        completedAt: new Date().toISOString(),
      };
      
      dispatch(updateCandidate(updatedCandidate));
      dispatch(setStage('completed'));
      
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: `Interview completed! Your final score is ${finalScore}/100.` 
      }, {
        type: 'error',
        content: `❌ ${error.message}`
      }]);
    }
  };

  if (stage === 'completed') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={2}>Interview Completed!</Title>
        <Text>Thank you for participating. Your results have been recorded.</Text>
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" onClick={() => window.location.reload()}>
            Start New Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
      <Card 
        title={
          <Space>
            <span>Interview Progress</span>
            <Tag color="blue">{currentQuestion}/6 Questions</Tag>
            {timeLeft > 0 && (
              <Tag color={timeLeft <= 10 ? 'red' : 'orange'} icon={<ClockCircleOutlined />}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </Tag>
            )}
          </Space>
        }
      >
        <Progress percent={Math.round((currentQuestion / 6) * 100 * 100) / 100} style={{ marginBottom: '20px' }} />
        
        <div style={{ height: '400px', overflowY: 'auto', marginBottom: '20px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
          {messages.map((msg, idx) => (
            <div key={`${msg.type}-${idx}-${Date.now()}`} style={{ 
              marginBottom: '15px', 
              padding: '12px', 
              backgroundColor: msg.type === 'question' ? '#f6ffed' : msg.type === 'answer' ? '#e6f7ff' : msg.type === 'error' ? '#fff2f0' : '#fff7e6',
              borderRadius: '8px',
              borderLeft: `4px solid ${msg.type === 'question' ? '#52c41a' : msg.type === 'answer' ? '#1890ff' : msg.type === 'error' ? '#ff4d4f' : '#faad14'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{msg.type === 'question' ? 'AI Interviewer:' : msg.type === 'answer' ? 'You:' : msg.type === 'error' ? 'Error:' : 'System:'}</strong>
                {msg.difficulty && <Tag color="purple">{msg.difficulty.toUpperCase()}</Tag>}
                {msg.score !== undefined && <Tag color="blue">Score: {msg.score}/{msg.difficulty === 'easy' ? 10 : msg.difficulty === 'medium' ? 20 : 30}</Tag>}
              </div>
              <div style={{ marginTop: '8px' }}>{msg.content || 'Loading...'}</div>
            </div>
          ))}
        </div>
        
        {isGeneratingQuestion && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Text>🤖 AI is generating your next question...</Text>
          </div>
        )}
        
        {currentQuestion < 6 && timeLeft > 0 && !isGeneratingQuestion && stage !== 'completed' && (
          <div>
            <TextArea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              style={{ marginBottom: '10px' }}
              disabled={isScoring}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSubmitAnswer}
              loading={isScoring}
              block
            >
              {isScoring ? 'AI is scoring your answer...' : 'Submit Answer'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InterviewChat;