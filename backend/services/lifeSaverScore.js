/**
 * LIFE SAVER SCORE ENGINE
 * Calculates and persists donor engagement, impact, and loyalty scores
 */

const Donor = require('../models/Donor');

class LifeSaverScoreEngine {
  /**
   * Calculate comprehensive Life Saver Score (0-100)
   * Factors:
   * - Donation frequency (30%)
   * - Consistency (20%)
   * - Emergency response (20%)
   * - Community impact (20%)
   * - Loyalty tenure (10%)
   */
  calculateLifeSaverScore(donor) {
    let score = 0;

    // 1. Donation Frequency (30 points max)
    const donationFrequency = donor.donationCount || 0;
    const frequencyScore = Math.min(30, donationFrequency * 3);

    // 2. Consistency (20 points max)
    // Based on regular donation pattern (less than 90 days between donations)
    let consistencyScore = 0;
    if (donor.lastDonation) {
      const daysSinceLastDonation = Math.floor(
        (Date.now() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24)
      );
      // Regular if within 90-day window
      consistencyScore = daysSinceLastDonation <= 90 ? 20 : daysSinceLastDonation <= 180 ? 10 : 0;
    }

    // 3. Emergency Response (20 points max)
    const responseRate = donor.responseRate || 0;
    const emergencyScore = (responseRate / 100) * 20;

    // 4. Community Impact (20 points max)
    // Estimated lives saved: 1 donation = 3 lives
    const livesSaved = (donor.donationCount || 0) * 3;
    const impactScore = Math.min(20, livesSaved * 0.5);

    // 5. Loyalty Tenure (10 points max)
    // Bonus for long-term donors
    const membershipDays = Math.floor(
      (Date.now() - new Date(donor.createdAt)) / (1000 * 60 * 60 * 24)
    );
    const tenureScore = Math.min(10, (membershipDays / 365) * 2.5);

    score = frequencyScore + consistencyScore + emergencyScore + impactScore + tenureScore;

    return {
      totalScore: Math.round(score),
      breakdown: {
        frequencyScore: Math.round(frequencyScore),
        consistencyScore: Math.round(consistencyScore),
        emergencyScore: Math.round(emergencyScore),
        impactScore: Math.round(impactScore),
        tenureScore: Math.round(tenureScore)
      },
      metrics: {
        donations: donationFrequency,
        livesSaved,
        membershipDays,
        responseRate,
        lastDonationDaysAgo: donor.lastDonation
          ? Math.floor((Date.now() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24))
          : null
      },
      tier: this.getTier(score)
    };
  }

  /**
   * Determine Life Saver Tier
   */
  getTier(score) {
    if (score >= 85) return 'Platinum Guardian';
    if (score >= 70) return 'Gold Hero';
    if (score >= 55) return 'Silver Savior';
    if (score >= 40) return 'Bronze Lifesaver';
    if (score >= 20) return 'Rising Star';
    return 'New Member';
  }

  /**
   * Update Life Saver Score in database
   */
  async updateLifeSaverScore(donorId) {
    try {
      const donor = await Donor.findById(donorId);
      if (!donor) {
        return {
          status: 'error',
          data: null,
          explanation: 'Donor not found'
        };
      }

      const scoreData = this.calculateLifeSaverScore(donor);

      // Persist to database
      donor.lifeSaverScore = scoreData.totalScore;
      donor.lifeSaverTier = scoreData.tier;
      donor.scoreBreakdown = scoreData.breakdown;
      donor.estimatedLivesSaved = scoreData.metrics.livesSaved;
      donor.lastScoreUpdate = new Date();

      await donor.save();

      return {
        status: 'success',
        data: scoreData,
        explanation: `Life Saver Score updated: ${scoreData.totalScore}/100 (${scoreData.tier})`
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
   * Batch update all donors' scores
   */
  async updateAllDonorScores() {
    try {
      const donors = await Donor.find({ isActive: true });

      const results = await Promise.all(
        donors.map(donor => this.updateLifeSaverScore(donor._id))
      );

      const successCount = results.filter(r => r.status === 'success').length;

      return {
        status: 'success',
        data: {
          totalProcessed: donors.length,
          successful: successCount,
          failed: donors.length - successCount,
          timestamp: new Date().toISOString()
        },
        explanation: `Updated ${successCount}/${donors.length} donor scores`
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
   * Get donor leaderboard
   */
  async getLifeSaverLeaderboard(limit = 10) {
    try {
      const leaderboard = await Donor.find({ isActive: true })
        .sort({ lifeSaverScore: -1 })
        .limit(limit)
        .select('name lifeSaverScore lifeSaverTier donationCount estimatedLivesSaved email');

      const ranked = leaderboard.map((donor, index) => ({
        rank: index + 1,
        name: donor.name,
        score: donor.lifeSaverScore || 0,
        tier: donor.lifeSaverTier || 'New Member',
        donations: donor.donationCount || 0,
        livesSaved: donor.estimatedLivesSaved || 0,
        email: donor.email
      }));

      return {
        status: 'success',
        data: {
          leaderboard: ranked,
          timestamp: new Date().toISOString()
        },
        explanation: `Top ${limit} Life Saver Heroes`
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
   * Get donor's detailed score report
   */
  async getDonorScoreReport(donorId) {
    try {
      const donor = await Donor.findById(donorId);
      if (!donor) {
        return {
          status: 'error',
          data: null,
          explanation: 'Donor not found'
        };
      }

      const scoreData = this.calculateLifeSaverScore(donor);

      return {
        status: 'success',
        data: {
          donorId,
          name: donor.name,
          email: donor.email,
          ...scoreData
        },
        explanation: `Complete score report for ${donor.name}`
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

module.exports = new LifeSaverScoreEngine();
