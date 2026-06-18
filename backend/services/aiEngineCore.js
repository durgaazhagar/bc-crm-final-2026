/**
 * AI CORE INTELLIGENCE ENGINE
 * Computes system health, donor activity analytics, emergency readiness score
 */

const Donor = require('../models/Donor');
const Emergency = require('../models/Emergency');

class AIEngineCore {
  /**
   * Calculate System Health Score (0-100)
   * Based on donor availability, recent donations, emergency response rate
   */
  async computeSystemHealth() {
    try {
      const totalDonors = await Donor.countDocuments({ isActive: true });
      const availableDonors = await Donor.countDocuments({
        isActive: true,
        bloodType: { $exists: true },
        lastDonation: { $gt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) }
      });

      const recentEmergencies = await Emergency.countDocuments({
        createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      const successfulMatches = await Emergency.countDocuments({
        status: 'fulfilled',
        createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      const availabilityScore = totalDonors > 0 ? (availableDonors / totalDonors) * 40 : 0;
      const responseScore = recentEmergencies > 0 ? (successfulMatches / recentEmergencies) * 40 : 20;
      const systemStabilityScore = 20;

      const healthScore = Math.round(availabilityScore + responseScore + systemStabilityScore);

      return {
        status: 'success',
        data: {
          systemHealthScore: Math.min(100, healthScore),
          totalDonors,
          availableDonors,
          availability: Math.round((availableDonors / totalDonors) * 100),
          recentEmergencies,
          successfulMatches,
          responseRate: recentEmergencies > 0 ? Math.round((successfulMatches / recentEmergencies) * 100) : 100
        },
        explanation: `System operating at ${Math.min(100, healthScore)}% efficiency. ${availableDonors}/${totalDonors} donors available.`
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
   * Donor Activity Analytics
   * Tracks engagement, donation frequency, and churn risk
   */
  async analyzeDonorActivity() {
    try {
      const donors = await Donor.find({ isActive: true })
        .select('name bloodType lastDonation donationCount email createdAt');

      const now = Date.now();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

      const activeThirtyDays = donors.filter(d => d.lastDonation && d.lastDonation > thirtyDaysAgo).length;
      const activeNinetyDays = donors.filter(d => d.lastDonation && d.lastDonation > ninetyDaysAgo).length;
      const inactive = donors.filter(d => !d.lastDonation || d.lastDonation <= ninetyDaysAgo).length;

      const avgDonationFrequency = donors.length > 0
        ? (donors.reduce((sum, d) => sum + (d.donationCount || 0), 0) / donors.length).toFixed(2)
        : 0;

      return {
        status: 'success',
        data: {
          totalActiveDonors: donors.length,
          activeThirtyDays,
          activeNinetyDays,
          inactiveDonors: inactive,
          averageDonationFrequency: parseFloat(avgDonationFrequency),
          bloodTypeDistribution: this.calculateBloodTypeDistribution(donors),
          churnRisk: {
            highRisk: inactive,
            mediumRisk: activeNinetyDays - activeThirtyDays,
            lowRisk: activeThirtyDays
          }
        },
        explanation: `Analyzed ${donors.length} active donors. ${activeThirtyDays} active in last 30 days. Churn risk identified in ${inactive} donors.`
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
   * Emergency Readiness Score
   * Evaluates system capacity to handle emergencies
   */
  async computeEmergencyReadiness() {
    try {
      const availableDonors = await Donor.countDocuments({
        isActive: true,
        bloodType: { $exists: true }
      });

      const totalEmergencyCapacity = availableDonors * 0.7; // Assume 70% can respond quickly

      const pendingEmergencies = await Emergency.countDocuments({
        status: { $in: ['pending', 'matching'] }
      });

      const capacityUtilization = totalEmergencyCapacity > 0
        ? (pendingEmergencies / totalEmergencyCapacity) * 100
        : 0;

      const readinessScore = Math.max(0, 100 - capacityUtilization);

      return {
        status: 'success',
        data: {
          readinessScore: Math.round(readinessScore),
          availableDonorCapacity: Math.round(totalEmergencyCapacity),
          currentEmergencies: pendingEmergencies,
          capacityUtilization: Math.round(capacityUtilization),
          systemStatus: readinessScore > 80 ? 'optimal' : readinessScore > 50 ? 'good' : 'critical'
        },
        explanation: `Emergency readiness at ${Math.round(readinessScore)}%. System can handle ${Math.round(totalEmergencyCapacity)} simultaneous emergencies. ${pendingEmergencies} currently pending.`
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
   * Helper: Calculate blood type distribution
   */
  calculateBloodTypeDistribution(donors) {
    const distribution = {};
    const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

    bloodTypes.forEach(type => {
      distribution[type] = donors.filter(d => d.bloodType === type).length;
    });

    return distribution;
  }

  /**
   * Comprehensive System Analysis
   * Returns all AI metrics in one call
   */
  async getComprehensiveAnalysis() {
    try {
      const [health, activity, readiness] = await Promise.all([
        this.computeSystemHealth(),
        this.analyzeDonorActivity(),
        this.computeEmergencyReadiness()
      ]);

      return {
        status: 'success',
        data: {
          systemHealth: health.data,
          donorActivity: activity.data,
          emergencyReadiness: readiness.data,
          timestamp: new Date().toISOString()
        },
        explanation: 'Comprehensive AI analysis complete'
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

module.exports = new AIEngineCore();
