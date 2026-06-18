# 📚 BLOOD DONAR CRM AI 2.0 - API DOCUMENTATION

## Overview

Complete REST API documentation for the Blood Donar CRM AI 2.0 system. All endpoints return JSON responses with standardized format:

```json
{
  "status": "success|error",
  "data": { /* Response payload */ },
  "explanation": "Human-readable description"
}
```

**Base URL**: `http://localhost:5001/api`

---

## 🧠 AI ENGINE ENDPOINTS

### System Health Status

**GET** `/ai/system-health`

Get current system health metrics and donor availability.

**Response:**
```json
{
  "status": "success",
  "data": {
    "systemHealthScore": 78,
    "totalDonors": 245,
    "availableDonors": 189,
    "availability": 77.1,
    "emergencyReadiness": 82,
    "responseRate": 76.5,
    "operatingStatus": "optimal"
  },
  "explanation": "System is operating at optimal capacity with 77% donor availability"
}
```

---

### Donor Activity Analytics

**GET** `/ai/donor-activity`

Analyze donor engagement and activity patterns.

**Response:**
```json
{
  "status": "success",
  "data": {
    "activeDonorsLast30Days": 156,
    "activeDonorsLast90Days": 198,
    "bloodTypeDistribution": {
      "O+": 98,
      "A+": 54,
      "B+": 32,
      "AB+": 12,
      "O-": 28,
      "A-": 15,
      "B-": 4,
      "AB-": 2
    },
    "churnRisk": {
      "critical": 12,
      "high": 34,
      "medium": 67,
      "low": 132
    },
    "engagementTrend": "increasing"
  },
  "explanation": "Donor activity is healthy with low churn risk"
}
```

---

### Emergency Readiness

**GET** `/ai/emergency-readiness`

Check system readiness for emergency blood requests.

**Response:**
```json
{
  "status": "success",
  "data": {
    "readinessScore": 84,
    "capacityUtilization": 62,
    "averageMatchingTime": "2.3 seconds",
    "estimatedSuccessRate": 91,
    "currentCapacity": {
      "donors": 189,
      "bloodUnits": 456,
      "estimatedRange": "Critical: YES, High: YES, Medium: YES"
    },
    "systemStatus": "optimal"
  },
  "explanation": "System is ready to handle emergency requests with 84% readiness"
}
```

---

### Comprehensive Analysis

**GET** `/ai/comprehensive-analysis`

Get all system metrics in a single call.

**Response:**
```json
{
  "status": "success",
  "data": {
    "systemHealth": { /* System health metrics */ },
    "donorActivity": { /* Activity analytics */ },
    "emergencyReadiness": { /* Readiness metrics */ },
    "recentEmergencies": 3,
    "successfulMatches": 89,
    "averageResponseTime": "4 minutes"
  },
  "explanation": "Complete system analysis showing all key metrics"
}
```

---

## 🚨 EMERGENCY MATCHING ENDPOINTS

### Trigger Donor Matching

**POST** `/ai/match`

Find and rank donors for an emergency.

**Request:**
```json
{
  "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "topMatches": [
      {
        "donorId": "donor1",
        "name": "Alex Johnson",
        "bloodType": "O+",
        "score": 95,
        "scoreBreakdown": {
          "distance": 22,
          "trust": 23,
          "availability": 25,
          "response": 20,
          "bloodTypeBonus": 5
        },
        "distance": "2.5 km",
        "responseRate": 92,
        "estimatedResponse": "4-6 minutes"
      }
      // ... more donors
    ],
    "matchingTime": "1.2 seconds",
    "totalMatches": 42
  },
  "explanation": "Found 42 compatible donors, top 10 ranked by match score"
}
```

---

### Activate Swarm Mode

**POST** `/ai/swarm`

Activate emergency swarm mode to notify top donors.

**Request:**
```json
{
  "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "swarmStatus": "active",
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "notificationsSent": 5,
    "topMatches": [
      {
        "rank": 1,
        "donorId": "donor1",
        "name": "Alex Johnson",
        "notificationTime": "2024-01-15T10:30:00Z",
        "estimatedResponse": "4-6 minutes"
      }
      // ... more donors
    ],
    "swarmActivationTime": "2024-01-15T10:29:30Z",
    "estimatedTimeToResponse": "5 minutes"
  },
  "explanation": "Swarm mode activated with notifications sent to top 5 donors"
}
```

---

### Get Live Matching Status

**GET** `/ai/emergency-status/:emergencyId`

Get real-time status of emergency matching.

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "emergencyStatus": "matching",
    "bloodTypeNeeded": "O+",
    "unitsNeeded": 2,
    "unitsMatched": 0,
    "matchedDonors": 15,
    "respondedDonors": 3,
    "confirmedDonors": 1,
    "currentProgress": 50,
    "timeElapsed": "3 minutes",
    "estimatedTimeRemaining": "2 minutes"
  },
  "explanation": "Emergency is actively matching with 1 confirmed donation so far"
}
```

---

## 🏆 LIFE SAVER SCORING ENDPOINTS

### Get Donor Score

**GET** `/ai/score/:donorId`

Retrieve donor's Life Saver Score and tier.

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "name": "Alex Johnson",
    "score": 87,
    "tier": "Gold Hero",
    "breakdown": {
      "donationFrequency": 28,
      "consistency": 18,
      "emergencyResponse": 19,
      "communityImpact": 16,
      "loyalty": 6
    },
    "livesSaved": 42,
    "estimatedLivesSavedThisYear": 8,
    "leaderboardRank": 3
  },
  "explanation": "Donor has achieved Gold Hero status with 87 Life Saver Score"
}
```

---

### Update Donor Score

**PUT** `/ai/score/:donorId`

Manually update or recalculate donor score.

**Request:**
```json
{
  "recalculate": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "previousScore": 85,
    "newScore": 87,
    "scoreChange": 2,
    "tier": "Gold Hero",
    "reason": "Score updated based on recent donation and emergency response"
  },
  "explanation": "Score successfully recalculated and updated"
}
```

---

### Get Leaderboard

**GET** `/ai/leaderboard`

Get top Life Saver Heroes ranked by score.

**Query Parameters:**
- `limit`: Number of results (default: 10)
- `offset`: Starting position (default: 0)

**Response:**
```json
{
  "status": "success",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "donorId": "donor5",
        "name": "Priya Patel",
        "score": 98,
        "tier": "Platinum Guardian",
        "donations": 52,
        "livesSaved": 52,
        "lastDonation": "2024-01-10"
      },
      {
        "rank": 2,
        "donorId": "donor3",
        "name": "Maria Santos",
        "score": 94,
        "tier": "Gold Hero",
        "donations": 48,
        "livesSaved": 48,
        "lastDonation": "2024-01-08"
      }
      // ... more donors
    ],
    "totalDonors": 245
  },
  "explanation": "Top 10 Life Saver Heroes ranked by impact score"
}
```

---

### Batch Update All Scores

**POST** `/ai/update-all-scores`

Recalculate scores for all active donors.

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalDonorsUpdated": 189,
    "averageNewScore": 68.4,
    "topGainer": {
      "donorId": "donor42",
      "nameChange": "+12 points"
    },
    "tierChanges": {
      "promoted": 8,
      "demoted": 3,
      "unchanged": 178
    },
    "processingTime": "4.2 seconds"
  },
  "explanation": "Successfully updated scores for 189 active donors"
}
```

---

## 📊 FORECASTING ENDPOINTS

### Get 7-Day Blood Demand Forecast

**GET** `/ai/forecast`

Get 7-day emergency prediction and blood demand forecast.

**Response:**
```json
{
  "status": "success",
  "data": {
    "dailyPredictions": [
      {
        "day": "Monday",
        "date": "2024-01-15",
        "predictedEmergencies": 3,
        "confidence": 0.87,
        "bloodDemand": 8
      }
      // ... 7 days
    ],
    "regionalPredictions": [
      {
        "region": "North",
        "predictedDemand": 12,
        "availableSupply": 18,
        "riskLevel": "low"
      }
      // ... more regions
    ],
    "overallRiskAssessment": {
      "level": "medium",
      "recommendation": "Increase donor outreach in South region",
      "reasoning": "O- blood type supply below critical threshold"
    }
  },
  "explanation": "7-day forecast showing medium risk with specific recommendations"
}
```

---

### Get Shortage Risk Assessment

**GET** `/ai/shortage-risk`

Assess blood type shortage risk.

**Response:**
```json
{
  "status": "success",
  "data": {
    "bloodTypes": [
      {
        "bloodType": "AB-",
        "currentUnits": 4,
        "percentPopulation": 1,
        "riskLevel": "critical",
        "estimatedShortageInDays": 2
      },
      {
        "bloodType": "O+",
        "currentUnits": 120,
        "percentPopulation": 38,
        "riskLevel": "low",
        "estimatedShortageInDays": 45
      }
      // ... all blood types
    ],
    "criticalBloodTypes": ["AB-", "B-"],
    "recommendedActions": ["Launch emergency donor drive for rare blood types"]
  },
  "explanation": "AB- blood type at critical shortage risk"
}
```

---

### Get Regional Forecast

**GET** `/ai/forecast/:region`

Get region-specific blood demand forecast.

**Parameters:**
- `region`: Region name (North, South, East, West, Central)

**Response:**
```json
{
  "status": "success",
  "data": {
    "region": "North",
    "forecastPeriod": "7 days",
    "predictedEmergencies": 18,
    "estimatedBloodDemand": 45,
    "availableSupply": 38,
    "deficitRisk": true,
    "criticalBloodTypes": ["AB+", "AB-"],
    "recommendations": [
      "Activate emergency donor outreach",
      "Increase collection drives",
      "Partner with local hospitals"
    ]
  },
  "explanation": "North region shows deficit risk with specific action items"
}
```

---

## 🧬 DIGITAL TWIN ENDPOINTS

### Build Digital Twin

**POST** `/ai/digital-twin/:donorId`

Create complete 360° donor profile with AI insights.

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "profile": {
      "name": "Alex Johnson",
      "bloodType": "O+",
      "donationCount": 32,
      "membershipDays": 487
    },
    "predictions": {
      "churnRisk": {
        "score": 15,
        "level": "low",
        "factors": ["Strong donation frequency", "High response rate"]
      },
      "nextDonationPrediction": {
        "predictedDate": "2024-02-10",
        "daysUntilEligible": 26,
        "confidence": 0.89
      }
    },
    "engagement": {
      "score": 84,
      "level": "excellent",
      "factors": {
        "communication": 30,
        "activity": 22,
        "events": 18,
        "community": 14
      }
    },
    "recommendations": [
      "Schedule donation for Feb 10",
      "Invite to annual gala event",
      "Nominate for Platinum Guardian recognition"
    ]
  },
  "explanation": "Digital twin created with 89% prediction confidence"
}
```

---

### Batch Build Digital Twins

**POST** `/ai/digital-twin/batch/all`

Generate digital twins for all active donors.

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalDonorsProcessed": 189,
    "successfulTwins": 187,
    "failedTwins": 2,
    "averageChurnRisk": "low",
    "topRiskDonors": [
      { "donorId": "donor15", "churnRisk": "critical" },
      { "donorId": "donor42", "churnRisk": "high" }
    ],
    "processingTime": "8.3 seconds"
  },
  "explanation": "Successfully generated digital twins for 187 donors"
}
```

---

## 💬 AI MESSAGE GENERATION ENDPOINTS

### Generate Emergency Alert

**POST** `/ai/message/emergency-alert`

Generate personalized emergency alert message.

**Request:**
```json
{
  "donorName": "Alex Johnson",
  "bloodType": "O+",
  "urgencyLevel": "critical",
  "hospitalName": "City Medical Center",
  "estimatedUnitsNeeded": 2
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Alex, a CRITICAL emergency at City Medical Center needs your O+ blood now! 2 units are needed. Your donation can save lives TODAY. Can you come in within the hour? Call 1-800-DONATE or reply YES.",
    "urgencyLevel": "critical",
    "messageType": "emergency_alert",
    "estimatedReadTime": "20 seconds"
  },
  "explanation": "Generated urgent emergency alert optimized for immediate response"
}
```

---

### Generate Thank You Message

**POST** `/ai/message/thank-you`

Generate personalized thank you message with impact details.

**Request:**
```json
{
  "donorName": "Alex Johnson",
  "donationCount": 32,
  "estimatedLivesSaved": 42,
  "bloodType": "O+"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Alex, thank you for your incredible donation! Your 32 donations have directly saved an estimated 42 lives. You are a true Life Saver and our community is grateful for your compassion.",
    "tone": "warm_and_inspirational",
    "messageType": "thank_you",
    "estimatedReadTime": "45 seconds"
  },
  "explanation": "Generated heartfelt thank you message emphasizing impact"
}
```

---

### Generate Re-engagement Message

**POST** `/ai/message/re-engagement`

Generate re-engagement message for inactive donors.

**Request:**
```json
{
  "donorName": "Alex Johnson",
  "daysSinceLastDonation": 120,
  "previousDonationCount": 15
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Alex, we've missed you! It's been 120 days since your last donation. Your blood type is needed now. Come back and save a life this week. New donors get a gift card!",
    "tone": "motivational",
    "messageType": "re_engagement",
    "estimatedReadTime": "35 seconds"
  },
  "explanation": "Generated motivational message to encourage return donation"
}
```

---

### Generate Custom Message

**POST** `/ai/message/custom`

Generate custom AI message with flexible prompt.

**Request:**
```json
{
  "prompt": "Write a thank you message for a donor who just donated for the 50th time",
  "recipientName": "Maria Santos",
  "tone": "celebratory"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Maria, CONGRATULATIONS! You've just completed 50 donations! You are a legend in the blood donation community. Your milestone achievement has saved countless lives. We celebrate you!",
    "messageType": "custom",
    "estimatedReadTime": "40 seconds"
  },
  "explanation": "Generated custom celebratory message for 50th donation milestone"
}
```

---

## 🚨 EMERGENCY MANAGEMENT ENDPOINTS

### Create Emergency

**POST** `/emergency`

Create new emergency blood request.

**Request:**
```json
{
  "patientName": "John Doe",
  "bloodTypeNeeded": "O+",
  "unitsNeeded": 2,
  "location": "123 Hospital Road",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "hospital": "City Medical Center",
  "urgencyLevel": "critical",
  "emergencyType": "Accident",
  "description": "Multi-vehicle accident with severe injuries"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "status": "matching",
    "createdAt": "2024-01-15T10:29:30Z",
    "matchingStarted": true,
    "swarmModeReady": true,
    "estimatedMatchTime": "2 seconds"
  },
  "explanation": "Emergency created and automatic matching initiated"
}
```

---

### List Emergencies

**GET** `/emergency`

Get list of all emergencies with optional filtering.

**Query Parameters:**
- `status`: Filter by status (pending, matching, swarm_active, fulfilled)
- `limit`: Results per page (default: 20)
- `offset`: Starting position (default: 0)

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencies": [
      {
        "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
        "patientName": "John Doe",
        "bloodTypeNeeded": "O+",
        "unitsNeeded": 2,
        "status": "matching",
        "matchedDonors": 15,
        "respondedDonors": 2,
        "createdAt": "2024-01-15T10:29:30Z"
      }
      // ... more emergencies
    ],
    "total": 3,
    "activeEmergencies": 2
  },
  "explanation": "Retrieved 3 emergencies with 2 currently active"
}
```

---

### Get Emergency Details

**GET** `/emergency/:emergencyId`

Get complete details for specific emergency.

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "patientName": "John Doe",
    "bloodTypeNeeded": "O+",
    "unitsNeeded": 2,
    "location": "123 Hospital Road",
    "hospital": "City Medical Center",
    "urgencyLevel": "critical",
    "status": "matching",
    "matchedDonors": 15,
    "respondedDonors": 2,
    "confirmedDonors": 1,
    "topMatches": [
      {
        "donorId": "donor1",
        "name": "Alex Johnson",
        "score": 95
      }
      // ... more donors
    ],
    "createdAt": "2024-01-15T10:29:30Z",
    "activatedAt": "2024-01-15T10:30:00Z"
  },
  "explanation": "Emergency is actively matching with 1 confirmed donation"
}
```

---

### Record Donor Response

**POST** `/emergency/:emergencyId/respond`

Record that donor responded to emergency.

**Request:**
```json
{
  "donorId": "donor1",
  "response": "accepted",
  "responseTime": "5 minutes"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "donorId": "donor1",
    "response": "accepted",
    "respondedDonors": 3,
    "totalMatched": 15
  },
  "explanation": "Donor response recorded successfully"
}
```

---

### Confirm Donation

**POST** `/emergency/:emergencyId/confirm`

Confirm donor donation completion.

**Request:**
```json
{
  "donorId": "donor1",
  "unitsCollected": 1,
  "donationTime": "30 minutes"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "donorId": "donor1",
    "unitsCollected": 1,
    "confirmedDonors": 2,
    "unitsNeeded": 2,
    "emergencyStatus": "partially_fulfilled",
    "lifesSavedEstimate": 2.5
  },
  "explanation": "Donation confirmed, emergency 50% fulfilled"
}
```

---

### Update Emergency Status

**PUT** `/emergency/:emergencyId/status`

Update emergency status.

**Request:**
```json
{
  "status": "fulfilled"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "emergencyId": "60a1b2c3d4e5f6g7h8i9j0k1",
    "previousStatus": "partially_fulfilled",
    "newStatus": "fulfilled",
    "fulfilledAt": "2024-01-15T10:45:00Z",
    "totalTimeToFulfillment": "16 minutes"
  },
  "explanation": "Emergency successfully fulfilled in 16 minutes"
}
```

---

## 👥 DONOR MANAGEMENT ENDPOINTS

### Create Donor

**POST** `/donors`

Create new donor profile.

**Request:**
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "phone": "+1-555-0123",
  "bloodType": "O+",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "bloodType": "O+",
    "createdAt": "2024-01-15T10:00:00Z",
    "lifeSaverScore": 0,
    "lifeSaverTier": "New Member"
  },
  "explanation": "Donor profile created successfully"
}
```

---

### List Donors

**GET** `/donors`

Get list of all donors.

**Query Parameters:**
- `bloodType`: Filter by blood type
- `search`: Search by name or email
- `limit`: Results per page
- `offset`: Starting position

**Response:**
```json
{
  "status": "success",
  "data": {
    "donors": [
      {
        "donorId": "donor1",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "bloodType": "O+",
        "donationCount": 32,
        "lifeSaverScore": 87,
        "lifeSaverTier": "Gold Hero"
      }
      // ... more donors
    ],
    "total": 245
  },
  "explanation": "Retrieved 20 donors out of 245 total"
}
```

---

### Get Donor Details

**GET** `/donors/:donorId`

Get complete donor profile.

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "+1-555-0123",
    "bloodType": "O+",
    "dateOfBirth": "1990-05-15",
    "gender": "male",
    "address": { /* address details */ },
    "donationCount": 32,
    "lastDonation": "2024-01-10",
    "nextEligibleDonation": "2024-02-10",
    "lifeSaverScore": 87,
    "lifeSaverTier": "Gold Hero",
    "responseRate": 92,
    "emergencyResponses": 12,
    "livesSavedEstimate": 42
  },
  "explanation": "Complete donor profile retrieved"
}
```

---

### Update Donor

**PUT** `/donors/:donorId`

Update donor information.

**Request:**
```json
{
  "phone": "+1-555-9876",
  "address": {
    "city": "Los Angeles",
    "state": "CA"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "updated": ["phone", "address"],
    "updateTime": "2024-01-15T10:30:00Z"
  },
  "explanation": "Donor information updated successfully"
}
```

---

### Delete Donor

**DELETE** `/donors/:donorId`

Remove donor from system.

**Response:**
```json
{
  "status": "success",
  "data": {
    "donorId": "donor1",
    "deleted": true,
    "deletedAt": "2024-01-15T10:30:00Z"
  },
  "explanation": "Donor profile deleted successfully"
}
```

---

## 🔐 Authentication Endpoints

### Login

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "user1",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  },
  "explanation": "Login successful"
}
```

---

### Register

**POST** `/auth/register`

Create new user account.

**Request:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "staff"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "userId": "user2",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "staff",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "explanation": "User account created successfully"
}
```

---

## ℹ️ HTTP STATUS CODES

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## 🔒 Authentication

All protected endpoints require JWT token in header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5001/api/endpoint
```

---

## 📝 Response Format

All responses follow standardized JSON format:

```json
{
  "status": "success|error",
  "data": { /* Response payload */ },
  "explanation": "Human-readable description of result"
}
```

---

## 🧪 Testing with cURL

### Get System Health
```bash
curl http://localhost:5001/api/ai/system-health
```

### Create Emergency
```bash
curl -X POST http://localhost:5001/api/emergency \
  -H "Content-Type: application/json" \
  -d '{"patientName":"John","bloodTypeNeeded":"O+","unitsNeeded":2}'
```

### Activate Swarm
```bash
curl -X POST http://localhost:5001/api/ai/swarm \
  -H "Content-Type: application/json" \
  -d '{"emergencyId":"emergency_id"}'
```

---

For more details, see README.md and BUILD_SUMMARY.md

🔥 **All endpoints are production-ready and fully tested!**
