import '@ant-design/v5-patch-for-react-19';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Tabs } from 'antd';
import { checkStorageQuota } from './storageUtils';
import React from 'react';
import { store, persistor } from './store';
import IntervieweePage from './IntervieweePage';
import InterviewerPage from './InterviewerPage';
import './App.css';

function App() {
  // Check storage quota on app start
  React.useEffect(() => {
    checkStorageQuota();
  }, []);

  const tabItems = [
    {
      key: 'interviewee',
      label: 'Interviewee',
      children: <IntervieweePage />,
    },
    {
      key: 'interviewer',
      label: 'Interviewer Dashboard',
      children: <InterviewerPage />,
    },
  ];

  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ConfigProvider>
          <Router>
            <div className="app">
              <Tabs defaultActiveKey="interviewee" centered items={tabItems} />
            </div>
          </Router>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;