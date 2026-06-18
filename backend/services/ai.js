const OpenAI = require('openai');
const Donor = require('../models/Donor');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const locationCoordinates = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  salem: { lat: 11.6643, lng: 78.1460 },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  tirunelveli: { lat: 8.7139, lng: 77.7560 },
  vellore: { lat: 12.9165, lng: 79.1325 },
  erode: { lat: 11.3410, lng: 77.7172 },
  thanjavur: { lat: 10.7870, lng: 79.1378 },
  kanchipuram: { lat: 12.8342, lng: 79.7036 },
  tiruppur: { lat: 11.1085, lng: 77.3411 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  default: { lat: 13.0827, lng: 80.2707 }
};

const getCoordinates = (locationOrCoords) => {
  if (!locationOrCoords) return null;
  if (typeof locationOrCoords === 'object' && locationOrCoords.lat && locationOrCoords.lng) {
    return { lat: Number(locationOrCoords.lat), lng: Number(locationOrCoords.lng) };
  }

  const asString = locationOrCoords.toString().trim();
  const coordinateMatch = asString.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (coordinateMatch) {
    return {
      lat: Number(coordinateMatch[1]),
      lng: Number(coordinateMatch[2])
    };
  }

  const normalized = asString.toLowerCase();
  const key = Object.keys(locationCoordinates).find((name) => normalized.includes(name));
  return locationCoordinates[key] || locationCoordinates.default;
};

const calculateDistanceKm = (from, to) => {
  if (!from || !to) return 0;
  const toRad = (value) => (value * Math.PI) / 180;
  const lat1 = Number(from.lat);
  const lon1 = Number(from.lng);
  const lat2 = Number(to.lat);
  const lon2 = Number(to.lng);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const scoreDonor = async (donorData) => {
  const donor = await Donor.findById(donorData.donorId);
  if (!donor) return null;

  const recencyDays = Math.max(0, Math.floor((Date.now() - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24)));
  const recencyScore = Math.max(0, 100 - recencyDays);
  const base = donor.donations * 10 + donor.trustScore * 0.4 + donor.engagementLevel * 0.3 + donor.responseRate * 0.3;
  const rawScore = Math.round(Math.min(100, base * 0.45 + recencyScore * 0.55));

  donor.relationshipScore = rawScore;
  await donor.save();

  const explanation = await runOpenAI(`Provide a JSON explanation for a donor relationship score calculation. Use keys reason and scoreBreakdown. donor: donations=${donor.donations}, lastDonationDate=${donor.lastDonationDate}, engagementLevel=${donor.engagementLevel}, responseRate=${donor.responseRate}, trustScore=${donor.trustScore}`);

  return {
    donorId: donor.id,
    relationshipScore: rawScore,
    explanation: explanation || {
      reason: 'Fallback summary based on donation history and engagement metrics.',
      scoreBreakdown: {
        donations: donor.donations,
        recencyDays,
        engagementLevel: donor.engagementLevel,
        responseRate: donor.responseRate,
        trustScore: donor.trustScore,
      },
    },
  };
};

const matchDonors = async ({ bloodGroup, location, urgencyLevel }) => {
  const donors = await Donor.find({ bloodGroup, status: 'active' });

  const ranked = donors
    .map((donor) => {
      const locationScore = donor.location.toLowerCase().includes(location.toLowerCase()) ? 30 : 10;
      const eligibilityScore = donor.donations > 0 ? 30 : 10;
      const trustScore = donor.trustScore || 50;
      const responseRate = donor.responseRate || 50;
      const urgencyMultiplier = urgencyLevel === 'critical' ? 1.3 : urgencyLevel === 'high' ? 1.15 : 1.0;
      const score = Math.min(100, Math.round((locationScore + eligibilityScore + trustScore * 0.4 + responseRate * 0.3) * urgencyMultiplier));
      return { donor, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12)
    .map((item) => ({ ...item.donor.toObject(), matchScore: item.matchScore }));

  await runOpenAI(`Return only JSON array of donors ranked by emergency match score for blood group ${bloodGroup}, location ${location}, urgency ${urgencyLevel}. Count: ${ranked.length}`);
  return ranked;
};

const generateMessage = async ({ type, donorName, emergencyDetails, prompt }) => {
  let requestPrompt = prompt;

  if (!requestPrompt) {
    requestPrompt =
      type === 'emergency'
        ? `Write a short emergency alert message for donor ${donorName} regarding ${emergencyDetails}. Return JSON: {"message":"..."}.`
        : type === 'reminder'
        ? `Write a polite donation reminder for donor ${donorName}. Return JSON: {"message":"..."}.`
        : `Write a warm thank-you note for donor ${donorName}. Return JSON: {"message":"..."}.`;
  }

  const response = await runOpenAI(requestPrompt);
  return {
    type: type || 'general',
    donorName: donorName || 'Supporter',
    message: response?.message || `Dear ${donorName || 'Supporter'}, thank you for your support.`,
  };
};

const forecastDemand = async () => {
  const result = await runOpenAI(
    `Predict blood shortage alerts in JSON format with keys alert, summary, shortageIndex. Use one of Green, Yellow, Red for alert.`
  );
  return result || { alert: 'Yellow', summary: 'Moderate demand with localized shortages expected.', shortageIndex: 62 };
};

const findDonorsByBloodGroup = async (bloodGroup) => {
  return Donor.find({ bloodGroup: bloodGroup.toString().trim(), status: 'active' }).lean();
};

const retentionSuggestions = async () => {
  const result = await runOpenAI(
    `Provide a JSON array of inactive donor retention suggestions. Return [{"action":"...","description":"..."}].`
  );
  return result || [
    { action: 'Personal outreach', description: 'Contact inactive donors with a personalized message about hospital demand.' },
    { action: 'Recovery campaign', description: 'Launch an AI-backed campaign to re-engage donors with urgent need alerts.' },
  ];
};

const runOpenAI = async (prompt) => {
  if (!openai) {
    console.warn('OpenAI API key not configured; running in fallback mode.');
    return null;
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    });
    const text = response.data.choices?.[0]?.message?.content?.trim();
    return safeJsonParse(text);
  } catch (err) {
    console.error('OpenAI error:', err.message || err);
    return null;
  }
};

const safeJsonParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (err) {
    const cleaned = value.replace(/^[^\{\[]+/, '').replace(/[^\}\]]+$/, '');
    try {
      return JSON.parse(cleaned);
    } catch (error) {
      return null;
    }
  }
};

module.exports = { scoreDonor, matchDonors, generateMessage, forecastDemand, retentionSuggestions, findDonorsByBloodGroup };
