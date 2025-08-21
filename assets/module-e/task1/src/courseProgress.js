/**
 * SkillShare Academy Course Progress Tracker
 * Manages course enrollment, chapter completion, and progress analytics
 */

class CourseProgress {
  constructor() {
    this.enrollments = new Map();
    this.courseCompletionThreshold = 0.8; // 80% completion required
  }

  /**
   * Enroll user in a course
   * @param {string} userId - User identifier
   * @param {string} courseId - Course identifier
   * @param {number} totalChapters - Total number of chapters in course
   * @returns {object} Enrollment result
   */
  enrollUser(userId, courseId, totalChapters) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a non-empty string');
    }

    if (!courseId || typeof courseId !== 'string') {
      throw new Error('Course ID must be a non-empty string');
    }

    if (typeof totalChapters !== 'number' || totalChapters <= 0) {
      throw new Error('Total chapters must be a positive number');
    }

    const enrollmentKey = `${userId}-${courseId}`;
    
    if (this.enrollments.has(enrollmentKey)) {
      return {
        success: false,
        message: 'User already enrolled in this course'
      };
    }

    const enrollment = {
      userId,
      courseId,
      totalChapters,
      completedChapters: [],
      enrollmentDate: new Date(),
      lastActivity: new Date(),
      status: 'active'
    };

    this.enrollments.set(enrollmentKey, enrollment);

    return {
      success: true,
      message: 'Successfully enrolled in course'
    };
  }

  /**
   * Mark a chapter as completed
   * @param {string} userId - User identifier
   * @param {string} courseId - Course identifier  
   * @param {number} chapterNumber - Chapter number (1-indexed)
   * @param {number} score - Completion score (0-100)
   * @param {number} timeSpent - Time spent in minutes
   * @returns {object} Completion result
   */
  completeChapter(userId, courseId, chapterNumber, score, timeSpent) {
    const enrollmentKey = `${userId}-${courseId}`;
    const enrollment = this.enrollments.get(enrollmentKey);

    if (!enrollment) {
      throw new Error('User not enrolled in this course');
    }

    if (enrollment.status !== 'active') {
      throw new Error('Course enrollment is not active');
    }

    this.validateChapterInputs(chapterNumber, score, timeSpent, enrollment.totalChapters);

    // Check if chapter already completed
    const existingCompletion = enrollment.completedChapters.find(
      ch => ch.chapterNumber === chapterNumber
    );

    const chapterCompletion = {
      chapterNumber,
      score,
      timeSpent,
      completedAt: new Date(),
      attempts: existingCompletion ? existingCompletion.attempts + 1 : 1
    };

    if (existingCompletion) {
      // Update existing completion if score improved
      if (score > existingCompletion.score) {
        const index = enrollment.completedChapters.findIndex(
          ch => ch.chapterNumber === chapterNumber
        );
        enrollment.completedChapters[index] = chapterCompletion;
      }
    } else {
      enrollment.completedChapters.push(chapterCompletion);
    }

    enrollment.lastActivity = new Date();

    // Check if course is now complete
    const courseComplete = this.isCourseComplete(userId, courseId);
    if (courseComplete && enrollment.status === 'active') {
      enrollment.status = 'completed';
      enrollment.completionDate = new Date();
    }

    return {
      success: true,
      chapterComplete: true,
      courseComplete,
      progressPercentage: this.getProgressPercentage(userId, courseId)
    };
  }

  /**
   * Get user's progress in a course
   * @param {string} userId - User identifier
   * @param {string} courseId - Course identifier
   * @returns {object} Progress information
   */
  getProgress(userId, courseId) {
    const enrollmentKey = `${userId}-${courseId}`;
    const enrollment = this.enrollments.get(enrollmentKey);

    if (!enrollment) {
      return null;
    }

    const completedCount = enrollment.completedChapters.length;
    const progressPercentage = (completedCount / enrollment.totalChapters) * 100;
    const averageScore = this.calculateAverageScore(enrollment.completedChapters);
    const totalTimeSpent = this.calculateTotalTime(enrollment.completedChapters);

    return {
      userId,
      courseId,
      totalChapters: enrollment.totalChapters,
      completedChapters: completedCount,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      averageScore: Math.round(averageScore * 100) / 100,
      totalTimeSpent,
      status: enrollment.status,
      enrollmentDate: enrollment.enrollmentDate,
      lastActivity: enrollment.lastActivity,
      isComplete: enrollment.status === 'completed'
    };
  }

  /**
   * Check if course is complete
   * @param {string} userId - User identifier
   * @param {string} courseId - Course identifier
   * @returns {boolean} Course completion status
   */
  isCourseComplete(userId, courseId) {
    const progress = this.getProgress(userId, courseId);
    if (!progress) return false;

    return (progress.progressPercentage / 100) >= this.courseCompletionThreshold;
  }

  /**
   * Get progress percentage for a user's course
   * @param {string} userId - User identifier
   * @param {string} courseId - Course identifier
   * @returns {number} Progress percentage
   */
  getProgressPercentage(userId, courseId) {
    const progress = this.getProgress(userId, courseId);
    return progress ? progress.progressPercentage : 0;
  }

  /**
   * Get next recommended chapter
   * @param {string} userId - User identifier
   * @param {string} courseId - Course identifier
   * @returns {number|null} Next chapter number or null if course complete
   */
  getNextChapter(userId, courseId) {
    const enrollment = this.enrollments.get(`${userId}-${courseId}`);
    if (!enrollment) return null;

    const completedNumbers = enrollment.completedChapters.map(ch => ch.chapterNumber);
    const maxCompleted = completedNumbers.length > 0 ? Math.max(...completedNumbers) : 0;
    
    const nextChapter = maxCompleted + 1;
    return nextChapter <= enrollment.totalChapters ? nextChapter : null;
  }

  // Private helper methods
  validateChapterInputs(chapterNumber, score, timeSpent, totalChapters) {
    if (typeof chapterNumber !== 'number' || chapterNumber < 1 || chapterNumber > totalChapters) {
      throw new Error(`Chapter number must be between 1 and ${totalChapters}`);
    }

    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new Error('Score must be between 0 and 100');
    }

    if (typeof timeSpent !== 'number' || timeSpent < 0) {
      throw new Error('Time spent must be a non-negative number');
    }
  }

  calculateAverageScore(completedChapters) {
    if (completedChapters.length === 0) return 0;
    const total = completedChapters.reduce((sum, ch) => sum + ch.score, 0);
    return total / completedChapters.length;
  }

  calculateTotalTime(completedChapters) {
    return completedChapters.reduce((total, ch) => total + ch.timeSpent, 0);
  }
}

module.exports = CourseProgress; 