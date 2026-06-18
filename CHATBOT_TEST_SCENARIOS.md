# BloodConnect AI Chatbot - Test Questions & Expected Responses

## Blood Group & Compatibility Questions

### Question 1: Universal Donor
**User**: "What blood type is a universal donor?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Mentions that O- (O negative) is the universal donor that can give blood to all blood types.

---

### Question 2: Blood Compatibility
**User**: "I have B blood type. What blood types can I receive from?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains that B+ can receive from B+ and O+ (and their negative counterparts from B- and O-), and that B- can receive from B- and O-.

---

### Question 3: AB Blood Type
**User**: "What's special about AB blood type?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains that AB+ is the universal recipient (can receive all types) but can only donate to AB+. AB- is universal recipient for negative types.

---

## Donation Eligibility Questions

### Question 4: Age Requirement
**User**: "How old do I need to be to donate blood?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: States that donors should be between 18-65 years old, with emphasis on health and fitness.

---

### Question 5: Health Conditions - Diabetes
**User**: "Can I donate blood if I have diabetes?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains that people with controlled diabetes can donate, but uncontrolled diabetes may disqualify. Recommendation to consult healthcare provider.

---

### Question 6: Health Conditions - High Blood Pressure
**User**: "I have high blood pressure. Can I still give blood?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Indicates that controlled high blood pressure is acceptable, but uncontrolled hypertension may prevent donation. Blood pressure checked on donation day.

---

### Question 7: Recent Tattoo
**User**: "I got a tattoo last month. Can I donate?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains that there's typically a 12-month waiting period after tattoos due to infection risk, unless done at licensed establishments with sterile equipment.

---

## Donation Intervals & Frequency

### Question 8: How Often Can I Donate
**User**: "How often can I donate blood?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains different intervals - whole blood every 56 days (8 weeks), platelets every 2-3 days, plasma every 28 days.

---

### Question 9: Platelet Donation
**User**: "What is platelet donation and how often can I do it?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Describes platelets as components needed for clotting, can be donated every 2-3 days up to 24 times per year.

---

### Question 10: Plasma Donation
**User**: "Tell me about plasma donation."

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains plasma is the liquid part of blood, contains antibodies and proteins, can be donated every 28 days.

---

## Hemoglobin & Blood Requirements

### Question 11: Hemoglobin Requirements
**User**: "What is the minimum hemoglobin level to donate?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: States men need 13.5-17.5 g/dL and women need 12.5-15.5 g/dL.

---

### Question 12: Weight Requirement
**User**: "How much do I need to weigh to donate blood?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Specifies minimum weight of 50 kg (110 lbs) is typically required.

---

## Benefits & Risks Questions

### Question 13: Benefits of Blood Donation
**User**: "What are the health benefits of donating blood?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Lists benefits such as free health screening, reduced heart disease risk, iron replenishment, satisfaction of helping others, potential rewards.

---

### Question 14: Risks of Blood Donation
**User**: "What are the risks of blood donation?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Mentions temporary dizziness, minor bruising, rare allergic reactions, extremely rare infection transmission, preventable dehydration.

---

## Emergency & Urgent Situations

### Question 15: Emergency Blood Needed
**User**: "There's an emergency! We need blood type O+ urgently!"

**Expected Intent**: EMERGENCY_ASSISTANCE

**Expected Response**: Directs to emergency services, hospital coordination, provides urgent assistance guidance. May offer to alert nearby donors if CRM system enabled.

---

### Question 16: Emergency Questions
**User**: "Someone collapsed and lost a lot of blood. What should I do?"

**Expected Intent**: EMERGENCY_ASSISTANCE

**Expected Response**: Advises calling emergency services (911), keeping person comfortable, seeking immediate medical help, blood transfusion at hospital.

---

## CRM-Related Questions (Authenticated Users Only)

### Question 17: Donation History
**User**: "How many times have I donated blood?"

**Expected Intent**: CRM_DONATION_HISTORY

**Expected Response**: Shows user's total donations, last donation date, blood type, estimated lives saved.

**Example**: "You've made 12 donations so far! That's amazing - you've potentially saved 36 lives. Your last donation was on December 10, 2024."

---

### Question 18: Next Donation Appointment
**User**: "When can I donate next?"

**Expected Intent**: CRM_APPOINTMENTS

**Expected Response**: Shows next eligible donation date and offers appointment booking.

**Example**: "You'll be eligible to donate again on January 25, 2025. You can book an appointment at your nearest blood bank through our app."

---

### Question 19: Rewards Points
**User**: "How many reward points do I have?"

**Expected Intent**: CRM_REWARDS

**Expected Response**: Shows current reward points and available badges.

**Example**: "You have 450 reward points! 🏆 You've earned some great badges too. Check your dashboard to see what you can redeem with your points."

---

### Question 20: My Profile
**User**: "Show me my profile information"

**Expected Intent**: CRM_PROFILE

**Expected Response**: Displays user's profile including blood type, location, contact info.

**Example**: "Here's your profile summary: Blood Type: O+, Location: New York. You can update your information in the settings anytime."

---

## Blood Banks & Donation Centers

### Question 21: Finding Blood Banks
**User**: "Where is the nearest blood bank?"

**Expected Intent**: CRM_BLOOD_BANKS or BLOOD_KNOWLEDGE

**Expected Response**: Information about blood banks or directions to find donation centers.

---

### Question 22: Donation Process
**User**: "What happens during blood donation?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Explains the entire process: registration, health screening, donation room, refreshment area, post-donation care.

---

## Edge Cases & Fallback Scenarios

### Question 23: Unclear Question
**User**: "xyz123 random text"

**Expected Intent**: UNKNOWN or BLOOD_KNOWLEDGE

**Expected Response**: Fallback response: "I couldn't fully process that request. Please try rephrasing or ask for specific donor/blood information. If needed, seek professional advice."

---

### Question 24: Medical Advice Request
**User**: "I have chest pain and want to donate. Should I?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Advises against donation, recommends medical consultation first.

**Fallback**: "I couldn't fully process that request. Please try rephrasing or ask for specific donor/blood information. If needed, seek professional advice."

---

### Question 25: Personal Medical Condition
**User**: "My kidney function is at 60%. Can I donate?"

**Expected Intent**: BLOOD_KNOWLEDGE

**Expected Response**: Discusses condition but recommends medical consultation for personalized advice.

---

## Multi-turn Conversation Examples

### Conversation 1: Learning Journey
1. **User**: "I want to learn about blood donation"
2. **Bot**: Provides overview
3. **User**: "What blood type am I?" 
4. **Bot**: Asks for their type or explains how to find out
5. **User**: "I'm O+"
6. **Bot**: Explains O+ benefits and who they can help

---

### Conversation 2: Eligibility Check
1. **User**: "Can I donate blood?"
2. **Bot**: Asks about conditions
3. **User**: "I have asthma but it's controlled"
4. **Bot**: Explains controlled asthma is acceptable
5. **User**: "What else do I need?"
6. **Bot**: Lists other requirements

---

## Test Execution Checklist

- [ ] Blood group questions answered accurately
- [ ] Compatibility information is correct
- [ ] Eligibility criteria properly explained
- [ ] Donation intervals match knowledge base
- [ ] Health conditions handled with caution
- [ ] Emergency questions routed correctly
- [ ] CRM data retrieved for authenticated users
- [ ] Fallback responses triggered appropriately
- [ ] Conversation context maintained across turns
- [ ] Response time under 3 seconds
- [ ] No sensitive data exposed in errors
- [ ] Mobile display works correctly
- [ ] Chat persists across page reloads (authenticated)
- [ ] Guest sessions expire appropriately

---

**Version**: 2.0  
**Test Date**: 2024  
**Coverage**: 25+ test scenarios
