import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Upload, Button, message, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { startInterview } from './interviewSlice';
import { addCandidate } from './candidatesSlice';
import Groq from 'groq-sdk';
import axios from 'axios';

// Initialize Groq client
const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const extractTextWithApyHub = async (file) => {
    console.log('📄 File uploaded:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    });

    try {
      if (file.type === 'application/pdf') {
        // Use ApyHub to extract text from PDF
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('🚀 Sending PDF to ApyHub for text extraction...');
        
        const response = await axios({
          method: 'POST',
          url: 'https://api.apyhub.com/extract/text/pdf-file',
          headers: {
            'apy-token': import.meta.env.VITE_APYHUB_API_KEY,
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        });
        
        const extractedText = response.data.data || response.data;
        console.log('📝 ApyHub extracted text:', extractedText);
        return extractedText;
        
      } else {
        // For text files, read directly
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result || '');
          reader.onerror = () => reject(new Error('File reading failed'));
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error('ApyHub extraction failed:', error);
      throw new Error('Failed to extract text from file');
    }
  };

  const parseWithGroq = async (text) => {
    try {
      console.log('🤖 Sending extracted text to Groq for parsing...');
      
      const promptText = `Extract the candidate's name, email, and phone number from this resume text. Return ONLY a JSON object with these exact fields: name, email, phone. If any field is not found, use empty string.

Resume Text:
${text}`;
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert at extracting contact information from resumes. Return only valid JSON with fields: name, email, phone.' },
          { role: 'user', content: promptText }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        max_tokens: 200,
      });
      
      const aiResponse = chatCompletion.choices[0]?.message?.content;
      console.log('🤖 Groq response:', aiResponse);
      
      // Clean response and remove markdown code blocks
      let cleanResponse = aiResponse.replace(/[\x00-\x1F\x7F]/g, '');
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      
      const extractedData = JSON.parse(cleanResponse);
      
      console.log('🔍 Extracted data before validation:', extractedData);
      
      // Ensure all fields exist and are strings
      extractedData.name = extractedData.name || '';
      extractedData.email = extractedData.email || '';
      extractedData.phone = extractedData.phone || '';
      
      // Validate NAME - must be at least 2 characters
      while (!extractedData.name || extractedData.name.trim().length < 2) {
        console.log('⚠️ Name validation failed:', extractedData.name);
        const userInput = window.prompt('Name is missing or invalid. Please enter your full name:');
        if (userInput && userInput.trim().length >= 2) {
          extractedData.name = userInput.trim();
        } else if (!userInput) {
          extractedData.name = 'Unknown Name';
          break;
        }
      }
      
      // Validate EMAIL - must contain @
      while (!extractedData.email || !extractedData.email.includes('@')) {
        console.log('⚠️ Email validation failed:', extractedData.email);
        const userInput = window.prompt('Email is missing or invalid. Please enter your email:');
        if (userInput && userInput.includes('@')) {
          extractedData.email = userInput.trim();
        } else if (!userInput) {
          extractedData.email = 'unknown@email.com';
          break;
        }
      }
      
      // Validate PHONE - must be at least 5 characters
      while (!extractedData.phone || extractedData.phone.trim().length < 5) {
        console.log('⚠️ Phone validation failed:', extractedData.phone);
        const userInput = window.prompt('Phone number is missing or invalid. Please enter your phone number:');
        if (userInput && userInput.trim().length >= 5) {
          extractedData.phone = userInput.trim();
        } else if (!userInput) {
          extractedData.phone = '+0000000000';
          break;
        }
      }
      
      console.log('🔍 Final parsed data:', extractedData);
      return extractedData;
      
    } catch (error) {
      console.error('Groq parsing failed:', error);
      throw error;
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);

    try {
      // Step 1: Extract text using ApyHub
      const extractedText = await extractTextWithApyHub(file);
      
      // Step 2: Parse contact info using Groq
      const candidateData = await parseWithGroq(extractedText);

      // Store resume as base64
      const reader = new FileReader();
      reader.onload = () => {
        const resumeData = {
          ...candidateData,
          id: Date.now().toString(),
          resumeFile: reader.result,
          uploadedAt: new Date().toISOString(),
        };

        console.log('🚀 Final resume data sent to Redux:', resumeData);
        
        dispatch(addCandidate(resumeData));
        dispatch(startInterview(resumeData));
        message.success('Resume uploaded successfully!');
      };
      reader.readAsDataURL(file);

    } catch (error) {
      message.error('Failed to process resume');
    } finally {
      setUploading(false);
    }

    return false; // Prevent default upload
  };

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.docx',
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <Title level={2}>Upload Your Resume</Title>
      <Text type="secondary">
        Please upload your resume in PDF or DOCX format to begin the interview process.
      </Text>

      <div style={{ margin: '40px 0' }}>
        <Dragger {...uploadProps} style={{ padding: '40px' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for PDF and DOCX files only. Maximum file size: 5MB
          </p>
        </Dragger>
      </div>

      {uploading && (
        <div style={{ marginTop: '20px' }}>
          <Text>Processing your resume...</Text>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;