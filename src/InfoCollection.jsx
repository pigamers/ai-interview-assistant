import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, Space } from 'antd';
import { setStage } from './interviewSlice';
import { addCandidate } from './candidatesSlice';

const { Title, Text } = Typography;

const InfoCollection = () => {
  const dispatch = useDispatch();
  const { currentCandidate } = useSelector(state => state.interview);
  const [missingFields, setMissingFields] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentCandidate) {
      const missing = [];
      if (!currentCandidate.name) missing.push('name');
      if (!currentCandidate.email) missing.push('email');
      if (!currentCandidate.phone) missing.push('phone');
      
      setMissingFields(missing);
      
      // Pre-fill form with existing data only if there are missing fields
      if (missing.length > 0) {
        form.setFieldsValue({
          name: currentCandidate.name || '',
          email: currentCandidate.email || '',
          phone: currentCandidate.phone || '',
        });
      }
    }
  }, [currentCandidate, form]);

  const handleSubmit = (values) => {
    const completeCandidate = {
      ...currentCandidate,
      ...values,
      chatHistory: [],
    };
    
    dispatch(addCandidate(completeCandidate));
    dispatch(setStage('interview'));
  };

  useEffect(() => {
    if (missingFields.length === 0 && currentCandidate) {
      // Auto-proceed if all info is available
      const completeCandidate = {
        ...currentCandidate,
        chatHistory: [],
      };
      dispatch(addCandidate(completeCandidate));
      dispatch(setStage('interview'));
    }
  }, [missingFields.length, currentCandidate, dispatch]);

  if (missingFields.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={3}>Information Complete!</Title>
        <Text>Starting your interview...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <Title level={2}>Complete Your Information</Title>
      <Text type="secondary">
        We need some additional information before starting the interview.
      </Text>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '30px' }}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: missingFields.includes('name'), message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>
        
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: missingFields.includes('email'), message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>
        
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: missingFields.includes('phone'), message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Start Interview
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InfoCollection;