/**
 * SkillShare Academy User Profile Management
 * Handles user profiles with inheritance pattern
 */

// Base User class
class User {
  constructor(userData) {
    if (this.constructor === User) {
      throw new Error('Cannot instantiate abstract User class directly');
    }
    
    this.id = userData.id;
    this.email = userData.email;
    this.name = userData.name;
    this.createdAt = new Date();
    this.isActive = true;
  }

  /**
   * Get basic user info (to be overridden)
   * @returns {object} Basic user information
   */
  getBasicInfo() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isActive: this.isActive
    };
  }

  /**
   * Deactivate user account
   */
  deactivate() {
    this.isActive = false;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// UserProfile class extending User
class UserProfile extends User {
  constructor(userData) {
    super(userData);
    
    this.bio = userData.bio || '';
    this.interests = userData.interests || [];
    this.skillLevel = userData.skillLevel || 'beginner';
    this.preferredLanguage = userData.preferredLanguage || 'English';
    this.credits = 0;
    this.coursesCompleted = 0;
    this.achievements = [];
  }

  /**
   * Override getBasicInfo to include profile-specific data
   * @returns {object} Extended user information
   */
  getBasicInfo() {
    const basicInfo = super.getBasicInfo();
    return {
      ...basicInfo,
      skillLevel: this.skillLevel,
      credits: this.credits,
      coursesCompleted: this.coursesCompleted
    };
  }

  /**
   * Update profile data
   * @param {object} updates - Fields to update
   * @returns {object} Update result
   */
  updateProfile(updates) {
    this.validateUpdates(updates);

    const allowedFields = ['name', 'bio', 'interests', 'skillLevel', 'preferredLanguage'];

    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        this[field] = updates[field];
      }
    }

    return { success: true, message: 'Profile updated successfully' };
  }

  /**
   * Add credits to account
   * @param {number} amount - Credits to add
   * @returns {object} Transaction result
   */
  addCredits(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    this.credits += amount;

    return {
      success: true,
      newBalance: this.credits,
      message: `${amount} credits added`
    };
  }

  /**
   * Deduct credits from account
   * @param {number} amount - Credits to deduct
   * @returns {object} Transaction result
   */
  deductCredits(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    if (this.credits < amount) {
      return {
        success: false,
        message: 'Insufficient credits',
        currentBalance: this.credits
      };
    }

    this.credits -= amount;

    return {
      success: true,
      newBalance: this.credits,
      message: `${amount} credits deducted`
    };
  }

  /**
   * Add achievement to profile
   * @param {object} achievement - Achievement data
   * @returns {object} Achievement result
   */
  addAchievement(achievement) {
    if (!achievement || !achievement.id || !achievement.title) {
      throw new Error('Achievement must have id and title');
    }

    const existingAchievement = this.achievements.find(a => a.id === achievement.id);
    if (existingAchievement) {
      return {
        success: false,
        message: 'Achievement already earned'
      };
    }

    this.achievements.push({
      ...achievement,
      earnedAt: new Date()
    });

    return {
      success: true,
      message: 'Achievement added successfully'
    };
  }

  // Private validation methods
  validateUpdates(updates) {
    const validSkillLevels = ['beginner', 'intermediate', 'advanced'];
    const validLanguages = ['English', 'Spanish', 'French', 'German'];

    if (updates.skillLevel && !validSkillLevels.includes(updates.skillLevel)) {
      throw new Error('Invalid skill level');
    }

    if (updates.preferredLanguage && !validLanguages.includes(updates.preferredLanguage)) {
      throw new Error('Invalid preferred language');
    }

    if (updates.interests && (!Array.isArray(updates.interests) || updates.interests.length > 5)) {
      throw new Error('Interests must be an array with maximum 5 items');
    }

    if (updates.bio && typeof updates.bio !== 'string') {
      throw new Error('Bio must be a string');
    }

    if (updates.name && (typeof updates.name !== 'string' || !updates.name.trim())) {
      throw new Error('Name must be a non-empty string');
    }
  }
}

module.exports = UserProfile; 