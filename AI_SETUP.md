# AI API Setup Guide

## 🚀 Quick Setup (Choose One)

### Option 1: Groq (Recommended - Fast & Free)
1. Go to https://console.groq.com
2. Sign up with Google/GitHub
3. Go to API Keys section
4. Create new API key
5. Copy the key

### Option 2: OpenAI ($5 Free Credit)
1. Go to https://platform.openai.com
2. Sign up and verify phone
3. Go to API Keys
4. Create new secret key
5. Copy the key

### Option 3: Hugging Face (Completely Free)
1. Go to https://huggingface.co/settings/tokens
2. Sign up
3. Create new token with "Inference" permission
4. Copy the token

## 🔧 Integration Steps

### For Groq (Default):
1. Open `src/aiService.js`
2. Replace `'your-api-key-here'` with your Groq API key
3. Keep the existing API_URL (Groq endpoint)

### For OpenAI:
1. Open `src/aiService.js`
2. Replace:
   ```js
   const API_KEY = 'your-openai-key-here';
   const API_URL = 'https://api.openai.com/v1/chat/completions';
   ```
3. Change model to `'gpt-3.5-turbo'` in all fetch calls

### For Hugging Face:
1. Open `src/aiService.js`
2. Replace:
   ```js
   const API_KEY = 'your-hf-token-here';
   const API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';
   ```

## 🧪 Test Without API Key
The app works with fallback responses if no API key is provided. Just run:
```bash
npm run dev
```

## ✅ Features Now Working:
- ✅ AI-generated interview questions
- ✅ AI-powered answer scoring (0-100, no random scores)
- ✅ AI-generated candidate summaries
- ✅ Phone number collection works properly
- ✅ Empty answers get 0 score
- ✅ One question at a time in chat format
- ✅ Detailed candidate view with all Q&A and scores

## 🔍 Testing Steps:
1. Upload resume → Should ask for missing phone if needed
2. Complete interview → AI generates unique questions
3. Submit empty answer → Should get 0 score
4. Check dashboard → See AI summary and detailed scores
5. View candidate details → All questions/answers/scores visible

## 💡 Cost Estimates:
- **Groq**: 14,400 requests/day FREE
- **OpenAI**: ~$0.01 per interview (with $5 free credit)
- **Hugging Face**: Completely FREE (may be slower)

Choose Groq for best performance and free usage!