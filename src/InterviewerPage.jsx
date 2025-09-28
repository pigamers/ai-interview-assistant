import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Input, Card, Modal, Typography, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const InterviewerPage = () => {
  const { list } = useSelector(state => state.candidates);
  const [searchText, setSearchText] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filteredCandidates = list.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Score',
      dataIndex: 'finalScore',
      key: 'finalScore',
      sorter: (a, b) => (a.finalScore || 0) - (b.finalScore || 0),
      render: (score, record) => {
        if (record.completedAt) {
          return `${score || 0}%`;
        }
        return 'In Progress';
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const isCompleted = record.completedAt; // Only check if interview was completed
        return (
          <Tag color={isCompleted ? 'green' : 'orange'}>
            {isCompleted ? 'Completed' : 'In Progress'}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <Card title="Interviewer Dashboard">
        <Input
          placeholder="Search candidates..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        
        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => setSelectedCandidate(record),
          })}
          style={{ cursor: 'pointer' }}
          scroll={{ x: 600 }}
        />
      </Card>

      <Modal
        title={`Candidate Details - ${selectedCandidate?.name}`}
        open={!!selectedCandidate}
        onCancel={() => setSelectedCandidate(null)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <div>
            <Title level={4}>Profile</Title>
            <p><strong>Name:</strong> {selectedCandidate.name}</p>
            <p><strong>Email:</strong> {selectedCandidate.email}</p>
            <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
            <p><strong>Final Score:</strong> {selectedCandidate.completedAt ? `${selectedCandidate.finalScore || 0}%` : 'In Progress'}</p>
            
            {selectedCandidate.summary && (
              <>
                <Title level={4}>AI Summary</Title>
                <Text>{selectedCandidate.summary}</Text>
              </>
            )}
            
            {selectedCandidate.chatHistory && (
              <>
                <Title level={4}>Interview History</Title>
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {selectedCandidate.chatHistory.map((msg, idx) => (
                    <div key={`chat-${idx}-${msg.type}`} style={{ marginBottom: '10px', padding: '8px', backgroundColor: msg.type === 'question' ? '#f0f0f0' : '#e6f7ff', borderRadius: '4px' }}>
                      <strong>{msg.type === 'question' ? 'AI:' : 'Candidate:'}</strong> {msg.content}
                      {msg.score !== undefined && (
                        <Tag color="blue" style={{ float: 'right' }}>
                          Score: {msg.score}/{msg.difficulty === 'easy' ? 10 : msg.difficulty === 'medium' ? 20 : 30}
                        </Tag>
                      )}
                      {msg.difficulty && <Tag color="purple">{msg.difficulty.toUpperCase()}</Tag>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewerPage;