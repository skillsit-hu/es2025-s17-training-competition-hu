# SkillShare Academy - Security Assessment Task

## Background

SkillShare Academy is a community-based digital learning platform that democratizes education through a free course marketplace and innovative credit-based mentor matching system. Learners earn 3-5 credits per completed course chapter and can use these credits to access personalized mentorship from expert mentors (rates vary from 5-15 credits per hour based on expertise level and specialization).

## Task Objective

You have been hired as a security consultant to perform a security assessment of the SkillShare Academy web application. Your task is to identify security vulnerabilities in the codebase and document them in the Gitea repository's issue tracker.

## Quick Start

```bash
npm install
npm start
```

The server will start on `http://localhost:3000` and automatically create the database with sample data.

## Test Credentials

- **Admin**: `admin` / `admin123`
- **Student**: `john_doe` / `password123`  
- **Mentor**: `jane_mentor` / `mentor123`

## API Endpoints to Test

The application provides these main endpoints:
- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `GET /api/users/:id` - Get user profile
- `GET /api/courses` - List courses (with search)
- `GET /api/courses/:id` - Get course details
- `POST /api/chapters/:id/complete` - Mark chapter as completed
- `POST /api/mentor-sessions` - Book mentor session
- `POST /api/upload` - File upload
- `GET /api/admin/users` - Admin panel (requires authentication)
- `GET /api/debug` - Debug information

## Your Task

### Step 1: Enable Issue Tracking
1. Go to your Gitea repository settings
2. Enable the **Issues** feature if not already enabled
3. Navigate to the **Issues** tab in your repository

### Step 2: Perform Security Assessment
1. **Code Review**: Review the source code thoroughly (`server.js`)
2. **Identify Vulnerabilities**: Look for security issues in the code and API behavior

### Step 3: Document Vulnerabilities as Issues

**Creating Issues from Source Code:**
1. Navigate to the `server.js` file in your Gitea repository
2. Find the line(s) where you identified a vulnerability
3. Click on the **3 horizontal dots (⋯)** that appear before the line number
4. Select **"Reference in New Issue"** from the dropdown menu
5. This will automatically create a new issue with the line reference included

**Complete the Issue Description**: Provide a comprehensive description that includes the type of vulnerability, explains the security problem and its potential impact, suggests recommendations for fixing the issue, and assesses the severity level.

**For vulnerabilities spanning multiple lines:**
- Create the issue from the first problematic line
- Mention the additional line numbers in the description
- Example: "This vulnerability affects lines 31-38 in the session configuration"

## Areas to Focus On

Consider examining these common vulnerability categories:
- Authentication and Authorization
- Input Validation
- SQL Injection
- Information Disclosure
- File Upload Security
- Session Management
- Configuration Issues
- Access Control
- Data Protection

## Submission Requirements

- All vulnerabilities must be documented as **separate issues** in the Gitea repository
- Each issue must include proper line number references

## Hints

- Pay attention to how user input is handled in API endpoints
- Look for hardcoded credentials or secrets
- Check authentication and authorization mechanisms
- Examine database interactions for SQL injection
- Review error handling and information disclosure
- Consider file operations and uploads
- Look at session and cookie configurations
- Test for access control bypasses

## Project Structure

- `server.js` - Main application file with all API endpoints
- `package.json` - Dependencies and scripts
- `database.db` - SQLite database (created automatically)

Good luck with your security assessment! 