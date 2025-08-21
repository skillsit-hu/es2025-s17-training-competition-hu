/**
 * SkillShare Academy Credit System
 * Manages credit earning through course completion and credit spending for mentorship
 */

class CreditSystem {
  constructor() {
    this.CREDITS_PER_CHAPTER = { min: 3, max: 5 };
    this.MENTOR_RATES = { junior: 5, intermediate: 8, senior: 12, expert: 15 };
  }

  /**
   * Calculate credits earned for completing a course chapter
   * @param {string} chapterDifficulty - 'basic', 'intermediate', 'advanced'
   * @param {number} chapterLength - Length in minutes
   * @param {number} completionScore - Score out of 100
   * @returns {number} Credits earned
   */
  calculateChapterCredits(chapterDifficulty, chapterLength, completionScore) {
    if (typeof chapterDifficulty !== 'string' || !chapterDifficulty) {
      throw new Error('Chapter difficulty must be a non-empty string');
    }

    if (typeof chapterLength !== 'number' || chapterLength <= 0) {
      throw new Error('Chapter length must be a positive number');
    }

    if (typeof completionScore !== 'number' || completionScore < 0 || completionScore > 100) {
      throw new Error('Completion score must be a number between 0 and 100');
    }

    const difficultyMultiplier = this.getDifficultyMultiplier(chapterDifficulty);
    const lengthBonus = this.getLengthBonus(chapterLength);
    const scoreMultiplier = this.getScoreMultiplier(completionScore);

    let baseCredits = this.CREDITS_PER_CHAPTER.min;
    let totalCredits = Math.floor(baseCredits * difficultyMultiplier * scoreMultiplier + lengthBonus);

    return Math.min(totalCredits, this.CREDITS_PER_CHAPTER.max);
  }

  /**
   * Calculate cost for mentorship session
   * @param {string} mentorLevel - 'junior', 'intermediate', 'senior', 'expert'
   * @param {number} duration - Session duration in hours
   * @param {boolean} isPeakTime - Whether session is during peak hours
   * @returns {number} Credit cost
   */
  calculateMentorshipCost(mentorLevel, duration, isPeakTime = false) {
    if (!this.MENTOR_RATES[mentorLevel]) {
      throw new Error('Invalid mentor level');
    }

    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('Duration must be a positive number');
    }

    if (duration > 4) {
      throw new Error('Maximum session duration is 4 hours');
    }

    let baseCost = this.MENTOR_RATES[mentorLevel] * duration;
    
    if (isPeakTime) {
      baseCost *= 1.2; // 20% peak time surcharge
    }

    return Math.ceil(baseCost);
  }

  /**
   * Process credit transaction
   * @param {number} currentCredits - User's current credit balance
   * @param {number} amount - Amount to add (positive) or subtract (negative)
   * @returns {object} Transaction result
   */
  processTransaction(currentCredits, amount) {
    if (typeof currentCredits !== 'number' || currentCredits < 0) {
      throw new Error('Current credits must be a non-negative number');
    }

    if (typeof amount !== 'number') {
      throw new Error('Amount must be a number');
    }

    const newBalance = currentCredits + amount;

    if (newBalance < 0) {
      return {
        success: false,
        balance: currentCredits,
        message: 'Insufficient credits'
      };
    }

    return {
      success: true,
      balance: newBalance,
      message: amount >= 0 ? 'Credits added successfully' : 'Credits deducted successfully'
    };
  }

  /**
   * Check if user can afford mentorship session
   * @param {number} userCredits - User's current credits
   * @param {string} mentorLevel - Mentor expertise level
   * @param {number} duration - Session duration in hours
   * @param {boolean} isPeakTime - Peak time flag
   * @returns {object} Affordability check result
   */
  canAffordMentorship(userCredits, mentorLevel, duration, isPeakTime = false) {
    try {
      const cost = this.calculateMentorshipCost(mentorLevel, duration, isPeakTime);
      const canAfford = userCredits >= cost;

      return {
        canAfford,
        cost,
        remainingCredits: canAfford ? userCredits - cost : userCredits,
        shortfall: canAfford ? 0 : cost - userCredits
      };
    } catch (error) {
      throw error;
    }
  }

  // Private helper methods
  getDifficultyMultiplier(difficulty) {
    const multipliers = {
      'basic': 1.0,
      'intermediate': 1.2,
      'advanced': 1.4
    };
    return multipliers[difficulty] || 1.0;
  }

  getLengthBonus(length) {
    if (length >= 60) return 1;
    if (length >= 30) return 0.5;
    return 0;
  }

  getScoreMultiplier(score) {
    if (score >= 90) return 1.0;
    if (score >= 80) return 0.9;
    if (score >= 70) return 0.8;
    return 0.7;
  }
}

module.exports = CreditSystem; 