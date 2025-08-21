/**
 * SkillShare Academy Mentor Matching System
 * Matches learners with suitable mentors using strategy pattern
 */

// Base strategy class
class MatchingStrategy {
  constructor(name) {
    if (this.constructor === MatchingStrategy) {
      throw new Error('Cannot instantiate abstract MatchingStrategy');
    }
    this.name = name;
  }

  /**
   * Calculate match score between mentor and learner
   * @param {object} mentor - Mentor data
   * @param {object} learnerProfile - Learner profile
   * @param {object} sessionRequirements - Session requirements
   * @returns {number} Match score (0-1)
   */
  calculateScore(mentor, learnerProfile, sessionRequirements) {
    throw new Error('calculateScore method must be implemented by concrete strategy');
  }
}

// Balanced strategy
class BalancedStrategy extends MatchingStrategy {
  constructor() {
    super('Balanced');
    this.weights = {
      expertise: 0.5,
      rating: 0.3,
      preference: 0.2
    };
  }

  calculateScore(mentor, learnerProfile, sessionRequirements) {
    const expertiseScore = this.calculateExpertiseScore(mentor, sessionRequirements.topic);
    const ratingScore = mentor.rating / 5.0;
    const preferenceScore = this.calculatePreferenceScore(mentor, learnerProfile);

    return (
      expertiseScore * this.weights.expertise +
      ratingScore * this.weights.rating +
      preferenceScore * this.weights.preference
    );
  }

  calculateExpertiseScore(mentor, topic) {
    const topicMatches = mentor.expertise.filter(exp => 
      exp.toLowerCase().includes(topic.toLowerCase())
    );
    return topicMatches.length > 0 ? 0.8 : 0.2;
  }

  calculatePreferenceScore(mentor, learnerProfile) {
    let score = 0.5; // Base score

    // Language preference
    if (learnerProfile.preferredLanguage && mentor.languages.includes(learnerProfile.preferredLanguage)) {
      score += 0.3;
    }

    // Level compatibility
    if (mentor.level === learnerProfile.level) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }
}

// Rating-focused strategy
class RatingStrategy extends MatchingStrategy {
  constructor() {
    super('Rating-Focused');
    this.weights = {
      rating: 0.6,
      sessions: 0.2,
      expertise: 0.2
    };
  }

  calculateScore(mentor, learnerProfile, sessionRequirements) {
    const ratingScore = mentor.rating / 5.0;
    const sessionScore = Math.min((mentor.totalSessions || 0) / 50, 1.0);
    const expertiseScore = this.hasRelevantExpertise(mentor, sessionRequirements.topic) ? 1.0 : 0.3;

    return (
      ratingScore * this.weights.rating +
      sessionScore * this.weights.sessions +
      expertiseScore * this.weights.expertise
    );
  }

  hasRelevantExpertise(mentor, topic) {
    return mentor.expertise.some(exp => 
      exp.toLowerCase().includes(topic.toLowerCase())
    );
  }
}

class MentorMatching {
  constructor() {
    this.mentors = new Map();
    this.strategies = {
      'balanced': new BalancedStrategy(),
      'rating': new RatingStrategy()
    };
    this.currentStrategy = 'balanced';
  }

  /**
   * Set the matching strategy
   * @param {string} strategyName - Name of the strategy to use
   */
  setStrategy(strategyName) {
    if (!this.strategies[strategyName]) {
      throw new Error(`Unknown strategy: ${strategyName}`);
    }
    this.currentStrategy = strategyName;
  }

  /**
   * Get current strategy name
   * @returns {string} Current strategy name
   */
  getCurrentStrategy() {
    return this.currentStrategy;
  }

  /**
   * Register a new mentor
   * @param {object} mentorData - Mentor information
   * @returns {object} Registration result
   */
  registerMentor(mentorData) {
    const requiredFields = ['id', 'name', 'expertise', 'level', 'hourlyRate'];
    
    for (const field of requiredFields) {
      if (!mentorData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    this.validateMentorData(mentorData);

    const mentor = {
      ...mentorData,
      rating: mentorData.rating || 0,
      totalSessions: mentorData.totalSessions || 0,
      languages: mentorData.languages || ['English'],
      isActive: true
    };

    this.mentors.set(mentorData.id, mentor);

    return {
      success: true,
      message: 'Mentor registered successfully',
      mentorId: mentorData.id
    };
  }

  /**
   * Find matching mentors for a learner
   * @param {object} learnerProfile - Learner's profile and requirements
   * @param {object} sessionRequirements - Session requirements
   * @param {string} strategyName - Optional strategy override
   * @returns {Array} Array of matched mentors with scores
   */
  findMatches(learnerProfile, sessionRequirements, strategyName = null) {
    this.validateLearnerProfile(learnerProfile);
    this.validateSessionRequirements(sessionRequirements);

    const strategy = this.strategies[strategyName || this.currentStrategy];
    const availableMentors = this.getAvailableMentors();
    
    const scoredMentors = availableMentors
      .map(mentor => ({
        mentor,
        score: strategy.calculateScore(mentor, learnerProfile, sessionRequirements),
        strategy: strategy.name
      }))
      .filter(match => match.score > 0.3)
      .sort((a, b) => b.score - a.score);

    return scoredMentors.slice(0, 5); // Return top 5 matches
  }

  /**
   * Get best mentor match
   * @param {object} learnerProfile - Learner's profile
   * @param {object} sessionRequirements - Session requirements
   * @param {string} strategyName - Optional strategy override
   * @returns {object|null} Best matching mentor or null if no matches
   */
  getBestMatch(learnerProfile, sessionRequirements, strategyName = null) {
    const matches = this.findMatches(learnerProfile, sessionRequirements, strategyName);
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Get mentor by ID
   * @param {string} mentorId - Mentor identifier
   * @returns {object|null} Mentor data or null if not found
   */
  getMentor(mentorId) {
    return this.mentors.get(mentorId) || null;
  }

  /**
   * Filter mentors by criteria
   * @param {object} filters - Filter criteria
   * @returns {Array} Filtered mentors
   */
  filterMentors(filters) {
    const mentors = Array.from(this.mentors.values()).filter(mentor => mentor.isActive);

    return mentors.filter(mentor => {
      if (filters.expertise && !mentor.expertise.includes(filters.expertise)) {
        return false;
      }
      if (filters.level && mentor.level !== filters.level) {
        return false;
      }
      if (filters.minRating && mentor.rating < filters.minRating) {
        return false;
      }
      return true;
    });
  }

  // Private helper methods
  validateMentorData(mentorData) {
    const validLevels = ['junior', 'intermediate', 'senior', 'expert'];
    if (!validLevels.includes(mentorData.level)) {
      throw new Error('Invalid mentor level');
    }

    if (typeof mentorData.hourlyRate !== 'number' || mentorData.hourlyRate < 5 || mentorData.hourlyRate > 15) {
      throw new Error('Hourly rate must be between 5 and 15 credits');
    }

    if (!Array.isArray(mentorData.expertise) || mentorData.expertise.length === 0) {
      throw new Error('Expertise must be a non-empty array');
    }
  }

  validateLearnerProfile(learnerProfile) {
    const requiredFields = ['id', 'level'];
    for (const field of requiredFields) {
      if (!learnerProfile[field]) {
        throw new Error(`Missing required learner field: ${field}`);
      }
    }

    // Ensure interests is always an array
    if (!learnerProfile.interests) {
      learnerProfile.interests = [];
    }
    
    if (!Array.isArray(learnerProfile.interests)) {
      throw new Error('Interests must be an array');
    }
  }

  validateSessionRequirements(sessionRequirements) {
    const requiredFields = ['topic', 'duration'];
    for (const field of requiredFields) {
      if (!sessionRequirements[field]) {
        throw new Error(`Missing required session field: ${field}`);
      }
    }
  }

  getAvailableMentors() {
    return Array.from(this.mentors.values()).filter(mentor => mentor.isActive);
  }
}

module.exports = MentorMatching; 