import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Typography } from 'antd';
import { resumeTimer, resetInterview } from './interviewSlice';

const { Title, Text } = Typography;

const WelcomeBackModal = () => {
  const dispatch = useDispatch();
  const { currentCandidate, stage, isPaused, questions } = useSelector(state => state.interview);
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    // Show modal only once when interview starts
    if (currentCandidate && stage === 'interview' && !hasShownModal) {
      setShowModal(true);
      setHasShownModal(true);
    }
  }, [currentCandidate, stage, hasShownModal]);

  const handleResume = () => {
    setShowModal(false);
    // Trigger question generation and start timer
    if (window.startFirstQuestion) {
      window.startFirstQuestion();
    }
    // Resume timer after a short delay to ensure question is generated
    setTimeout(() => {
      dispatch(resumeTimer());
    }, 100);
  };

  const handleStartNew = () => {
    dispatch(resetInterview());
    setShowModal(false);
    setHasShownModal(false);
  };

  return (
    <Modal
      title="Welcome Back!"
      open={showModal}
      footer={null}
      closable={false}
      centered
      styles={{
        mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
    >
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Title level={3}>Resume Your Interview</Title>
        <Text>
          You have an incomplete interview session. Would you like to continue where you left off or start a new interview?
        </Text>
        
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button type="primary" onClick={handleResume} size="large">
            Resume Interview
          </Button>
          <Button onClick={handleStartNew} size="large">
            Start New Interview
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;