# BloodConnect AI Chatbot - Quick Start Guide

## Prerequisites

- Node.js v16+ installed
- MongoDB running
- OpenAI API key (Claude) configured

## Installation & Setup

### 1. Configure Environment Variables

Create `.env` file in `/backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/bloodconnect
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-claude-api-key
PORT=3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# Server starts on http://localhost:3000
```

#### Terminal 2 - Frontend Dev Server
```bash
cd frontend
npm run dev
# Frontend starts on http://localhost:5173
```

## Using the Chatbot

### On Landing Page (Guest Mode)
1. Navigate to http://localhost:5173
2. Look for chat button (💬) in bottom-right corner
3. Click to open chatbot
4. Ask any blood donation related question
5. Example questions:
   - "What is blood type O positive used for?"
   - "Can I donate if I have diabetes?"
   - "How often can I donate blood?"
   - "What are the benefits of blood donation?"

### In Dashboard (Authenticated Mode)
1. Register/Login with credentials
2. Navigate to dashboard
3. Click chat button (💬) in bottom-right
4. Access both knowledge and CRM features
5. Example questions:
   - "Show my donation history"
   - "When can I donate next?"
   - "What are my rewards?"

## Feature Testing

### Test Intent Detection

```bash
# Test Blood Knowledge (no auth required)
curl -X POST http://localhost:3000/api/chat/guest/message \
  -H "Content-Type: application/json" \
  -d '{"message":"What blood groups are compatible with B+?","chatHistory":[],"sessionId":"test123"}'

# Expected: Detailed compatibility information
```

### Test CRM Actions (requires auth)

```bash
# First, get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Then test CRM action
curl -X POST http://localhost:3000/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Show my donations","chatHistory":[],"sessionId":"test123"}'

# Expected: User's donation history
```

### Test Chat History

```bash
curl -X GET "http://localhost:3000/api/chat/history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: Array of previous messages
```

## File Locations

### Backend Files
- Chatbot Service: `backend/services/chatbot.js`
- Chat Routes: `backend/routes/chat.js`
- Chat Model: `backend/models/ChatMessage.js`
- Server Config: `backend/server.js`

### Frontend Files
- Chatbot Component: `frontend/src/components/Chatbot.tsx`
- Landing Page: `frontend/src/pages/LandingPage.tsx`
- Dashboard Layout: `frontend/src/layouts/DashboardLayout.tsx`

## API Endpoints

### Chat Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/chat/message` | ✅ | Process authenticated user message |
| POST | `/api/chat/guest/message` | ❌ | Process guest message |
| GET | `/api/chat/history` | ✅ | Get user's chat history |
| GET | `/api/chat/info` | ❌ | Get chatbot capabilities |

## Common Issues & Solutions

### Issue: "API key not configured"
**Solution**: 
- Check `.env` file has `OPENAI_API_KEY`
- Restart backend server
- Verify key is valid at OpenAI dashboard

### Issue: "Database not connected"
**Solution**:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Review MongoDB connection string
- Check firewall settings

### Issue: "Messages not saving"
**Solution**:
- Verify MongoDB is connected
- Check ChatMessage model is created
- Review backend logs for errors
- Drop and recreate database collections

### Issue: "Chatbot not responding"
**Solution**:
- Check browser console for errors
- Verify backend is running
- Check network tab in DevTools
- Review backend logs
- Test API endpoint with curl/Postman

## Debugging

### Enable Detailed Logging

Backend (`server.js`):
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Check API Response

Use browser DevTools → Network tab:
1. Open chat
2. Send message
3. Check POST request to `/api/chat/message`
4. View Response tab for API response
5. Check Console for JavaScript errors

### Test Backend Directly

```bash
# Health check
curl http://localhost:3000/api/status

# Get chatbot info
curl http://localhost:3000/api/chat/info
```

## Performance Tips

1. **Limit Chat History**: Component loads last 5 messages for context
2. **Enable Caching**: Consider caching common questions
3. **Optimize Database**: Index on userId and timestamp fields
4. **Connection Pooling**: Use connection pooling for MongoDB

## Security Considerations

1. **API Keys**: Never commit `.env` files with real keys
2. **Authentication**: Always validate tokens on protected routes
3. **Input Validation**: Messages validated for length and content
4. **Error Messages**: Don't expose sensitive info in errors
5. **Rate Limiting**: Consider adding rate limits to chat endpoint

## Next Steps

1. ✅ Deploy chatbot to production
2. ✅ Configure monitoring and logging
3. ✅ Add rate limiting
4. ✅ Implement caching
5. ✅ Add analytics tracking
6. ✅ Multi-language support
7. ✅ Mobile app integration

## Support & Maintenance

- Monitor API usage and costs
- Review common questions for improvement
- Update knowledge base regularly
- Track response times and errors
- Gather user feedback for enhancements

---

**Version**: 2.0  
**Date**: 2024  
**Status**: Ready for Deployment
