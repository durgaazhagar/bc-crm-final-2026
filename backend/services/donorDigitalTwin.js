/**
 * DONOR DIGITAL TWIN MODEL
 * Creates AI-powered digital representation of each donor
 * Computes: churn risk, next donation prediction, engagement score
 */

const Donor = require('../models/Donor');
const Emergency = require('../models/Emergency');

class DonorDigitalTwin {
  /**
   * Build complete digital twin for a donor
   */
  async buildDigitalTwin(donorId) {
    try {
      const donor = await Donor.findById(donorId);
      if (!donor) {
        return {
          status: 'error',
          data: null,
          explanation: 'Donor not found'
        };
      }

      const [churnRisk, nextDonationPrediction, engagementScore] = await Promise.all([
        this.computeChurnRisk(donor),
        this.predictNextDonation(donor),
        this.computeEngagementScore(donor)
      ]);

      return {
        status: 'success',
        data: {
          donorId,
          donorName: donor.name,
          twinCreatedAt: new Date().toISOString(),
          churnRisk,
          nextDonationPrediction,
          engagementScore,
          healthStatus: this.determineHealthStatus(churnRisk, nextDonationPrediction, engagementScore),
          recommendations: this.generateRecommendations(churnRisk, engagementScore)
        },
        explanation: 'Digital twin model built successfully'
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
   * Compute Churn Risk (0-100)
   * Likelihood of donor becoming inactive
   */
  async computeChurnRisk(donor) {
    let riskScore = 0;

    // 1. Time since last donation (40% weight)
    const daysSinceLastDonation = donor.lastDonation
      ? Math.floor((Date.now() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24))
      : 365;

    if (daysSinceLastDonation > 365) riskScore += 40;
    else if (daysSinceLastDonation > 180) riskScore += 25;
    else if (daysSinceLastDonation > 90) riskScore += 10;

    // 2. Donation frequency trend (30% weight)
    const recentDonations = (donor.donationCount || 0) % 10; // Last ~10 months pattern
    if (recentDonations < 2) riskScore += 30;
    else if (recentDonations < 4) riskScore += 15;
    else riskScore += 0;

    // 3. Emergency response rate (20% weight)
    const responseRate = donor.responseRate || 50;
    if (responseRate < 30) riskScore += 20;
    else if (responseRate < 60) riskScore += 10;

    // 4. Engagement activity (10% weight)
    const lastActivityDays = donor.lastActivityDate
      ? Math.floor((Date.now() - new Date(donor.lastActivityDate)) / (1000 * 60 * 60 * 24))
      : 90;
    if (lastActivityDays > 60) riskScore += 10;

    return {
      score: Math.min(100, riskScore),
      level: riskScore > 70 ? 'critical' : riskScore > 40 ? 'high' : riskScore > 20 ? 'medium' : 'low',
      factors: {
        inactivityDays: daysSinceLastDonation,
        frequencyTrend: recentDonations,
        responseRate,
        lastActivityDays
      }
    };
  }

  /**
   * Predict next donation date
   */
  async predictNextDonation(donor) {
    const daysSinceLastDonation = donor.lastDonation
      ? Math.floor((Date.now() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24))
      : 56;

    // Standard donation interval is 56 days
    const standardInterval = 56;
    const eligibleDate = new Date(Date.now() + (standardInterval - daysSinceLastDonation) * 24 * 60 * 60 * 1000);

    // Calculate confidence based on donor history
    const donationConsistency = (donor.donationCount || 0) / Math.max(1, Math.floor((Date.now() - new Date(donor.createdAt)) / (365 * 24 * 60 * 60 * 1000)));
    const confidence = Math.min(95, 60 + donationConsistency * 20);

    return {
      predictedDate: eligibleDate.toISOString().split('T')[0],
      daysUntilEligible: Math.max(0, standardInterval - daysSinceLastDonation),
      confidence: Math.round(confidence),
      donationFrequencyPattern: donationConsistency > 4 ? 'very_regular' : donationConsistency > 2 ? 'regular' : 'irregular'
    };
  }

  /**
   * Compute comprehensive engagement score (0-100)
   */
  async computeEngagementScore(donor) {
    let score = 0;

    // 1. Communication responsiveness (30%)
    const emailOpenRate = donor.emailOpenRate || 0;
    const smsResponseRate = donor.smsResponseRate || 0;
    const commScore = ((emailOpenRate + smsResponseRate) / 2) * 0.3;

    // 2. App/Platform activity (25%)
    const lastActivityDays = donor.lastActivityDate
      ? Math.floor((Date.now() - new Date(donor.lastActivityDate)) / (1000 * 60 * 60 * 24))
      : 30;
    const activityScore = (Math.max(0, 30 - lastActivityDays) / 30) * 25;

    // 3. Event participation (25%)
    const eventParticipation = donor.eventParticipation || 0;
    const eventScore = Math.min(25, eventParticipation * 5);

    // 4. Community contribution (20%)
    const referrals = donor.referralCount || 0;
    const communityScore = Math.min(20, referrals * 4);

    score = commScore + activityScore + eventScore + communityScore;

    return {
      score: Math.round(score),
      level: score > 75 ? 'highly_engaged' : score > 50 ? 'engaged' : score > 25 ? 'moderately_engaged' : 'low_engagement',
      breakdown: {
        communication: Math.round(commScore),
        activity: Math.round(activityScore),
        events: Math.round(eventScore),
        community: Math.round(communityScore)
      }
    };
  }

  /**
   * Determine overall health status
   */
  determineHealthStatus(churnRisk, nextDonationPrediction, engagementScore) {
    const status = {
      churnLevel: churnRisk.level,
      engagementLevel: engagementScore.level,
      nextDonationReady: nextDonationPrediction.daysUntilEligible === 0,
      overallHealth: 'unknown'
    };

    if (churnRisk.level === 'critical') status.overallHealth = 'at_risk';
    else if (engagementScore.level === 'highly_engaged' && nextDonationPrediction.daysUntilEligible <= 7) {
      status.overallHealth = 'excellent';
    } else if (engagementScore.level === 'engaged') status.overallHealth = 'good';
    else if (churnRisk.level === 'high') status.overallHealth = 'concerning';
    else status.overallHealth = 'stable';

    return status;
  }

  /**
   * Generate AI recommendations for donor engagement
   */
  generateRecommendations(churnRisk, engagementScore) {
    const recommendations = [];

    if (churnRisk.level === 'critical') {
      recommendations.push('Send personalized re-engagement message');
      recommendations.push('Offer incentive for next donation');
      recommendations.push('Schedule phone call from coordinator');
    }

    if (churnRisk.level === 'high') {
      recommendations.push('Send reminder about donation impact');
      recommendations.push('Share success stories from recent emergencies');
    }

    if (engagementScore.level === 'low_engagement') {
      recommendations.push('Invite to community events');
      recommendations.push('Start email nurture campaign');
    }

    if (engagementScore.level === 'highly_engaged') {
      recommendations.push('Consider for ambassador program');
      recommendations.push('Request to help recruit other donors');
    }

    return recommendations;
  }

  /**
   * Build twins for all donors (batch)
   */
  async buildAllDigitalTwins() {
    try {
      const donors = await Donor.find({ isActive: true });
      const results = await Promise.all(
        donors.map(donor => this.buildDigitalTwin(donor._id))
      );

      const twins = results
        .filter(r => r.status === 'success')
        .map(r => r.data);

      return {
        status: 'success',
        data: {
          totalDonors: donors.length,
          twinsBuilt: twins.length,
          criticalRiskCount: twins.filter(t => t.churnRisk.level === 'critical').length,
          highEngagementCount: twins.filter(t => t.engagementScore.level === 'highly_engaged').length,
          twins: twins
        },
        explanation: `Digital twins built for ${twins.length}/${donors.length} active donors`
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

module.exports = new DonorDigitalTwin();
