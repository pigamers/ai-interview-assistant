import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'antd';
import ResumeUpload from './ResumeUpload';
import InfoCollection from './InfoCollection';
import InterviewChat from './InterviewChat';
import WelcomeBackModal from './WelcomeBackModal';

const IntervieweePage = () => {
  const { stage, currentCandidate } = useSelector(state => state.interview);

  const renderContent = () => {
    switch (stage) {
      case 'upload':
        return <ResumeUpload />;
      case 'info':
        return <InfoCollection />;
      case 'interview':
      case 'completed':
        return <InterviewChat />;
      default:
        return <ResumeUpload />;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <WelcomeBackModal />
      <Card title="AI Interview Assistant" style={{ minHeight: '600px' }}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default IntervieweePage;