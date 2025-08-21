/**
 * SkillShare Academy Rating System
 * Handles ratings for courses and mentors
 */

class RatingSystem {
  constructor() {
    this.ratings = new Map();
    this.minRating = 1;
    this.maxRating = 5;
  }

  /**
   * Add a rating for a course or mentor
   * @param {object} ratingData - Rating information
   * @returns {object} Rating result
   */
  addRating(ratingData) {
    this.validateRatingData(ratingData);

    const ratingId = this.generateRatingId(ratingData.userId, ratingData.targetId, ratingData.targetType);
    
    // Check if user has already rated this target
    if (this.ratings.has(ratingId)) {
      return this.updateRating(ratingData);
    }

    const rating = {
      id: ratingId,
      userId: ratingData.userId,
      targetId: ratingData.targetId,
      targetType: ratingData.targetType,
      score: ratingData.score,
      createdAt: new Date()
    };

    this.ratings.set(ratingId, rating);

    return {
      success: true,
      message: 'Rating added successfully',
      ratingId
    };
  }

  /**
   * Get average rating for a target
   * @param {string} targetId - Target identifier (course or mentor ID)
   * @param {string} targetType - Type of target ('course' or 'mentor')
   * @returns {object} Rating statistics
   */
  getAverageRating(targetId, targetType) {
    this.validateTargetType(targetType);
    
    const targetRatings = this.getRatingsForTarget(targetId, targetType);
    
    if (targetRatings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const total = targetRatings.reduce((sum, rating) => sum + rating.score, 0);
    const average = total / targetRatings.length;
    const distribution = this.calculateRatingDistribution(targetRatings);

    return {
      averageRating: Math.round(average * 100) / 100,
      totalRatings: targetRatings.length,
      distribution
    };
  }

  /**
   * Get top-rated targets
   * @param {string} targetType - Type of target
   * @param {number} limit - Number of results to return
   * @param {number} minRatings - Minimum number of ratings required
   * @returns {Array} Top-rated targets
   */
  getTopRated(targetType, limit = 10, minRatings = 3) {
    this.validateTargetType(targetType);

    const targetStats = new Map();

    // Calculate stats for each target
    Array.from(this.ratings.values())
      .filter(rating => rating.targetType === targetType)
      .forEach(rating => {
        if (!targetStats.has(rating.targetId)) {
          targetStats.set(rating.targetId, { total: 0, count: 0 });
        }
        const stats = targetStats.get(rating.targetId);
        stats.total += rating.score;
        stats.count += 1;
      });

    // Filter and sort by average rating
    const topRated = Array.from(targetStats.entries())
      .filter(([targetId, stats]) => stats.count >= minRatings)
      .map(([targetId, stats]) => ({
        targetId,
        averageRating: Math.round((stats.total / stats.count) * 100) / 100,
        totalRatings: stats.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);

    return topRated;
  }

  // Private helper methods
  updateRating(ratingData) {
    const ratingId = this.generateRatingId(ratingData.userId, ratingData.targetId, ratingData.targetType);
    const existingRating = this.ratings.get(ratingId);
    
    existingRating.score = ratingData.score;
    existingRating.updatedAt = new Date();

    return {
      success: true,
      message: 'Rating updated successfully',
      ratingId
    };
  }

  validateRatingData(ratingData) {
    const requiredFields = ['userId', 'targetId', 'targetType', 'score'];
    
    for (const field of requiredFields) {
      if (!ratingData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof ratingData.score !== 'number' || ratingData.score < this.minRating || ratingData.score > this.maxRating) {
      throw new Error(`Rating score must be between ${this.minRating} and ${this.maxRating}`);
    }

    this.validateTargetType(ratingData.targetType);
  }

  validateTargetType(targetType) {
    const validTypes = ['course', 'mentor'];
    if (!validTypes.includes(targetType)) {
      throw new Error('Invalid target type. Must be "course" or "mentor"');
    }
  }

  generateRatingId(userId, targetId, targetType) {
    return `${userId}-${targetId}-${targetType}`;
  }

  getRatingsForTarget(targetId, targetType) {
    return Array.from(this.ratings.values()).filter(rating => 
      rating.targetId === targetId && rating.targetType === targetType
    );
  }

  calculateRatingDistribution(ratings) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    ratings.forEach(rating => {
      const score = rating.score;
      if (score >= 1 && score <= 5) {
        distribution[score] += 1;
      }
    });

    return distribution;
  }
}

module.exports = RatingSystem; 