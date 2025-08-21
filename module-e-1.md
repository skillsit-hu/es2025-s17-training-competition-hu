# Module E - Task 1: Writing Automated Tests

## SkillShare Academy Testing Challenge

### Background

SkillShare Academy is a community-based digital learning platform that democratizes education through a free course marketplace and innovative credit-based mentor matching system. Learners earn 3-5 credits per completed course chapter and can use these credits to access personalized mentorship from expert mentors (rates vary from 5-15 credits per hour based on expertise level and specialization), creating a thriving ecosystem where skill development is accessible to everyone while rewarding learning progress.

### Task Description

You are provided with a JavaScript project that implements core functionality for the SkillShare Academy platform. The project currently has **no automated tests**. Your task is to write comprehensive automated unit tests for all the provided code.

### Requirements

1. **Complete Test Coverage**: Write tests that achieve 100% code coverage of the provided JavaScript modules
2. **Logical Test Organization**: Group tests logically and ensure they are easy to understand
3. **Mutation Testing Ready**: Tests must pass against the original code but fail against logically mutated versions
4. **Testing Framework**: Use Jest (already configured in the project)

### Project Structure

The project contains the following modules that require testing:

- `src/creditSystem.js` - Manages credit earning and spending
- `src/courseProgress.js` - Tracks course completion and chapter progress  
- `src/mentorMatching.js` - Handles mentor-learner matching logic
- `src/userProfile.js` - Manages user profiles and preferences
- `src/ratingSystem.js` - Handles course and mentor ratings

### Key Testing Challenges

While focusing on core testing fundamentals, you'll encounter several interesting challenges:

#### **Complex Business Logic**
- Mathematical calculations with multiple variables (credit scoring, matching algorithms)
- Weighted scoring systems and normalization
- Date/time handling and availability checking
- Statistical calculations and aggregations

#### **Edge Case Scenarios**
- Boundary value testing (min/max credits, rates, scores)
- Empty data sets and missing information
- Invalid input validation and error handling
- Complex object filtering and sorting

#### **Algorithm Testing**
- Mentor-learner matching algorithms with multiple criteria
- Score calculations with weighted factors
- Availability time slot checking
- Data aggregation and statistics

### Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Examine the source code in the `src/` directory
4. Create your test files in the `tests/` directory
5. Run tests with `npm test`
6. Check coverage with `npm run coverage`

### Test File Organization

Create test files following this naming convention:
- `tests/creditSystem.test.js`
- `tests/courseProgress.test.js`
- `tests/mentorMatching.test.js`
- `tests/userProfile.test.js`
- `tests/ratingSystem.test.js`

### Testing Approach

Each module offers unique testing challenges:

#### **CreditSystem** - Mathematical & Business Rules
- Test credit calculations with different difficulty levels
- Verify mentorship cost calculations with peak time surcharges
- Test transaction processing and validation
- Handle edge cases like maximum session durations

#### **CourseProgress** - State Management & Progress Tracking
- Test enrollment and chapter completion workflows
- Verify progress percentage calculations
- Test course completion detection logic
- Handle duplicate enrollments and score improvements

#### **MentorMatching** - Complex Algorithms & Filtering
- Test mentor registration and validation
- Verify matching algorithm with multiple criteria weights
- Test availability checking with time slots
- Test filtering by expertise, rating, language preferences

#### **UserProfile** - Data Validation & Management
- Test profile creation with comprehensive validation
- Verify credit management (adding/deducting)
- Test achievement system and activity tracking
- Handle user search and filtering functionality

#### **RatingSystem** - Statistics & Aggregation
- Test rating submission and validation
- Verify average rating calculations
- Test top-rated item retrieval with minimum thresholds
- Handle rating distribution statistics

### Commands

- `npm test` - Run all tests
- `npm run coverage` - Generate coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Check code style