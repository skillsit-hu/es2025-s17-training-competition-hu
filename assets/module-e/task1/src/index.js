/**
 * SkillShare Academy - Main Application Entry Point
 * Demonstrates integration of all core modules
 */

const CreditSystem = require('./creditSystem');
const CourseProgress = require('./courseProgress');
const MentorMatching = require('./mentorMatching');
const UserProfile = require('./userProfile');
const RatingSystem = require('./ratingSystem');

class SkillShareAcademy {
  constructor() {
    this.creditSystem = new CreditSystem();
    this.courseProgress = new CourseProgress();
    this.mentorMatching = new MentorMatching();
    this.userProfiles = new Map(); // Store user profiles by ID
    this.ratingSystem = new RatingSystem();
  }

  /**
   * Create a user profile
   * @param {object} userData - User data
   * @returns {object} Creation result
   */
  createUserProfile(userData) {
    try {
      const userProfile = new UserProfile(userData);
      this.userProfiles.set(userData.id, userProfile);
      return {
        success: true,
        message: 'User profile created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Add credits to a user
   * @param {string} userId - User ID
   * @param {number} amount - Credits to add
   * @param {string} source - Source of credits
   * @returns {object} Transaction result
   */
  addCreditsToUser(userId, amount, source) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    return userProfile.addCredits(amount);
  }

  /**
   * Demo function showing platform workflow
   * This function is for demonstration purposes only and doesn't need testing
   */
  demonstratePlatform() {
    console.log('🎓 Welcome to SkillShare Academy!');
    console.log('Initializing platform modules...');
    
    // Create a user profile
    const userData = {
      id: 'user123',
      email: 'learner@skillshare.com',
      name: 'John Learner',
      interests: ['JavaScript', 'Web Development'],
      skillLevel: 'intermediate'
    };
    
    const profileResult = this.createUserProfile(userData);
    console.log('✅ User profile created:', profileResult.message);
    
    // Register a mentor
    const mentorData = {
      id: 'mentor456',
      name: 'Jane Expert',
      expertise: ['JavaScript', 'React', 'Node.js'],
      level: 'senior',
      hourlyRate: 12
    };
    
    const mentorResult = this.mentorMatching.registerMentor(mentorData);
    console.log('✅ Mentor registered:', mentorResult.message);
    
    // Enroll user in a course
    const enrollmentResult = this.courseProgress.enrollUser('user123', 'js101', 10);
    console.log('✅ Course enrollment:', enrollmentResult.message);
    
    // Complete a chapter and earn credits
    const chapterResult = this.courseProgress.completeChapter('user123', 'js101', 1, 95, 45);
    const creditsEarned = this.creditSystem.calculateChapterCredits('intermediate', 45, 95);
    this.addCreditsToUser('user123', creditsEarned, 'course_completion');
    
    console.log(`✅ Chapter completed! Earned ${creditsEarned} credits`);
    
    // Rate the course
    this.ratingSystem.addRating({
      userId: 'user123',
      targetId: 'js101',
      targetType: 'course',
      score: 5
    });
    console.log('✅ Course rated successfully');
    
    // Find mentor matches
    const learnerProfile = {
      id: 'user123',
      interests: ['JavaScript'],
      level: 'intermediate'
    };
    
    const sessionRequirements = {
      topic: 'JavaScript',
      duration: 1
    };
    
    const matches = this.mentorMatching.findMatches(learnerProfile, sessionRequirements);
    console.log(`✅ Found ${matches.length} mentor matches`);
    
    console.log('🎉 Platform demonstration complete!');
  }
}

// Export for potential testing (though this main file is excluded from coverage)
module.exports = SkillShareAcademy;

// Run demonstration if this file is executed directly
if (require.main === module) {
  const academy = new SkillShareAcademy();
  academy.demonstratePlatform();
} 