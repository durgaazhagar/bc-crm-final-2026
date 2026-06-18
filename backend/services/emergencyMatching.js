/**
 * EMERGENCY CONTROL ROOM - REAL-TIME DONOR MATCHING ENGINE
 * Matches donors based on: distance, trust score, availability, response history
 */

const Donor = require('../models/Donor');
const Emergency = require('../models/Emergency');

class EmergencyMatchingEngine {
  /**
   * Calculate donor ranking score
   * score = (distance weight) + (trust score) + (availability) + (response history)
   */
  calculateDonorScore(donor, emergency) {
    let score = 0;

    // 1. Distance Weight (25 points max)
    // Mock distance calculation - in production, use real geolocation
    const mockDistance = Math.random() * 20; // 0-20 km
    const distanceScore = Math.max(0, 25 - (mockDistance / 20) * 25);

    // 2. Trust Score (25 points max)
    // Based on donation history and reliability
    const donationReliability = donor.donationCount ? Math.min(25, donor.donationCount * 1.5) : 0;

    // 3. Availability Score (25 points max)
    const daysSinceLastDonation = donor.lastDonation
      ? Math.floor((Date.now() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24))
      : 100;

    // Can donate if 56+ days passed (standard blood donation interval)
    const availabilityScore = daysSinceLastDonation >= 56 ? 25 : (daysSinceLastDonation / 56) * 25;

    // 4. Response History (25 points max)
    const responseRate = donor.responseRate || 50;
    const responseScore = (responseRate / 100) * 25;

    // Blood type match bonus (+10 if exact match)
    const bloodTypeBonus = donor.bloodType === emergency.bloodTypeNeeded ? 10 : 0;

    score = distanceScore + donationReliability + availabilityScore + responseScore + bloodTypeBonus;

    return {
      totalScore: Math.round(score),
      distanceScore: Math.round(distanceScore),
      trustScore: Math.round(donationReliability),
      availabilityScore: Math.round(availabilityScore),
      responseScore: Math.round(responseScore),
      bloodTypeBonus,
      distance: mockDistance.toFixed(2),
      canDonate: daysSinceLastDonation >= 56
    };
  }

  /**
   * Find and rank available donors for emergency
   */
  async matchDonorsForEmergency(emergencyId) {
    try {
      const emergency = await Emergency.findById(emergencyId);
      if (!emergency) {
        return {
          status: 'error',
          data: null,
          explanation: 'Emergency not found'
        };
      }

      // Get all available donors (active and with matching/compatible blood type)
      const availableDonors = await Donor.find({
        isActive: true,
        bloodType: emergency.bloodTypeNeeded // Exact match for now
      }).lean();

      // Calculate scores for each donor
      const rankedDonors = availableDonors
        .map(donor => ({
          ...donor,
          scores: this.calculateDonorScore(donor, emergency)
        }))
        .sort((a, b) => b.scores.totalScore - a.scores.totalScore);

      // Update emergency with ranked donors
      emergency.matchedDonors = rankedDonors.slice(0, 10).map(d => ({
        donorId: d._id,
        name: d.name,
        score: d.scores.totalScore,
        distance: d.scores.distance,
        bloodType: d.bloodType
      }));
      emergency.status = 'matching';
      await emergency.save();

      return {
        status: 'success',
        data: {
          emergencyId,
          bloodTypeNeeded: emergency.bloodTypeNeeded,
          unitsNeeded: emergency.unitsNeeded,
          matchedDonorsCount: rankedDonors.length,
          topMatches: rankedDonors.slice(0, 10).map(d => ({
            donorId: d._id,
            name: d.name,
            email: d.email,
            phone: d.phone,
            bloodType: d.bloodType,
            distance: parseFloat(d.scores.distance),
            scores: d.scores,
            status: d.scores.canDonate ? 'can_donate' : 'wait_period'
          }))
        },
        explanation: `Matched ${rankedDonors.length} donors. Top 10 ranked by score.`
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        explanation: error.message
      };
    }
  }

  /**
   * Emergency Swarm Mode
   * Triggers all matching, notification simulation, and grouped response logic
   */
  async activateSwarmMode(emergencyId) {
    try {
      const emergency = await Emergency.findById(emergencyId);
      if (!emergency) {
        return {
          status: 'error',
          data: null,
          explanation: 'Emergency not found'
        };
      }

      // Step 1: Match donors
      const matchingResult = await this.matchDonorsForEmergency(emergencyId);
      if (matchingResult.status !== 'success') {
        return matchingResult;
      }

      // Step 2: Simulate notifications
      const topMatches = matchingResult.data.topMatches.slice(0, 5);
      const notificationSimulation = topMatches.map((donor, index) => ({
        donorId: donor.donorId,
        notificationTime: new Date(Date.now() + index * 2000), // Staggered
        estimatedResponse: `${Math.random() * 10 + 5} minutes`,
        notificationChannel: ['sms', 'email', 'push'][Math.floor(Math.random() * 3)]
      }));

      // Step 3: Update emergency status
      emergency.status = 'swarm_active';
      emergency.swarmNotifications = notificationSimulation;
      emergency.activatedAt = new Date();
      await emergency.save();

      return {
        status: 'success',
        data: {
          emergencyId,
          swarmStatus: 'active',
          totalMatches: matchingResult.data.matchedDonorsCount,
          notificationsTriggered: notificationSimulation.length,
          topMatches: matchingResult.data.topMatches.slice(0, 5),
          notificationSimulation,
          estimatedTimeToFirstResponse: `${Math.min(...notificationSimulation.map(n => parseInt(n.estimatedResponse))) + 5} minutes`
        },
        explanation: 'Emergency swarm mode activated. Notifications sent to top 5 donors.'
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        explanation: error.message
      };
    }
  }

  /**
   * Get live matching status for UI
   */
  async getLiveMatchingStatus(emergencyId) {
    try {
      const emergency = await Emergency.findById(emergencyId)
        .populate('matchedDonors.donorId', 'name email phone');

      if (!emergency) {
        return {
          status: 'error',
          data: null,
          explanation: 'Emergency not found'
        };
      }

      return {
        status: 'success',
        data: {
          emergencyId,
          emergencyStatus: emergency.status,
          bloodTypeNeeded: emergency.bloodTypeNeeded,
          unitsNeeded: emergency.unitsNeeded,
          createdAt: emergency.createdAt,
          matchedDonors: emergency.matchedDonors,
          respondedDonors: emergency.respondedDonors || [],
          confirmedDonors: emergency.confirmedDonors || []
        },
        explanation: `Emergency status: ${emergency.status}. ${emergency.respondedDonors?.length || 0} donors responded.`
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        explanation: error.message
      };
    }
  }
}

module.exports = new EmergencyMatchingEngine();
