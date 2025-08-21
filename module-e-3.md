# Module E - Task 3: Course Info Site with Theme Switching

## Challenge Overview

Create a responsive course information website with multiple visual themes and persistent user preference storage. You will implement this from scratch based on the provided wireframe.

## SkillShare Academy Course: "Web Development Fundamentals"

### Content to Display

**Course Information:**
- Course Title: "Web Development Fundamentals"
- Instructor: Dr. Sarah Chen
- Duration: 12 weeks
- Price: $299
- Rating: 4.8/5 (324 reviews)
- Students: 2,847 enrolled

**Course Description:**
"Learn the essential skills for modern web development. This comprehensive course covers HTML, CSS, JavaScript, responsive design, and basic backend concepts. Perfect for beginners looking to start their web development journey."

**What You'll Learn (4 key points):**
- HTML structure and semantic markup
- CSS styling and responsive design
- JavaScript programming fundamentals
- Version control with Git

**Course Sections (3 sections):**
1. HTML Foundations (4 lessons, 2.5 hours)
2. CSS Styling & Layout (6 lessons, 4 hours)
3. JavaScript Basics (8 lessons, 5.5 hours)

**Instructor Bio:**
"Dr. Sarah Chen is a Senior Software Engineer with 10 years of experience in web development. She has worked at major tech companies and taught over 50,000 students online."

## Layout Requirements

### Wireframe Description

```
┌─────────────────────────────────────────────────────────────┐
│ [Header]                                                    │
│ Course Title                    [Theme Selector] [Enroll]   │
├─────────────────────────────────────────────────────────────┤
│ [Course Info Bar]                                           │
│ Rating | Students | Duration | Price                        │
├─────────────────────────────────────────────────────────────┤
│ [Main Content - Two Column Layout]                          │
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Left Column             │ │ Right Column                │ │
│ │                         │ │                             │ │
│ │ Course Description      │ │ Instructor Card             │ │
│ │ (paragraph text)        │ │ - Name                      │ │
│ └─────────────────────────┘ │ - Bio                       │ │
│ ┌─────────────────────────┐ │ - Photo placeholder         │ │
│ │ What You'll Learn       │ └─────────────────────────────┘ │
│ │ - Bullet point 1        │ ┌─────────────────────────────┐ │
│ │ - Bullet point 2        │ │ Course Sections             │ │
│ │ - Bullet point 3        │ │ 1. Section title + info     │ │
│ │ - Bullet point 4        │ │ 2. Section title + info     │ │
│ └─────────────────────────┘ │ 3. Section title + info     │ │
│                             └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ [Footer]                                                    │
│ © 2024 SkillShare Academy                                   │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop (1024px+)**: Two-column layout as shown
- **Tablet (768px-1023px)**: Two-column layout, smaller gaps
- **Mobile (767px and below)**: Single column, stacked layout

## Technical Requirements

### 1. HTML Structure
- Semantic HTML elements (header, main, section, aside, footer)
- Proper heading hierarchy (h1, h2, h3)
- Accessible form elements
- ARIA labels where appropriate

### 2. CSS Implementation
- CSS custom properties for theming
- Flexbox and/or CSS Grid for layout
- Responsive design with media queries
- Smooth transitions for theme changes

### 3. Theme Requirements

**Light Theme:**
- Clean, professional appearance
- Good contrast for readability
- Suitable for daytime use

**Dark Theme:**
- Dark backgrounds with light text
- Comfortable for low-light viewing
- Maintain visual hierarchy

**High Contrast Theme:**
- Maximum accessibility compliance
- WCAG 2.1 AA contrast ratios (4.5:1 normal text, 3:1 large text)
- Enhanced focus indicators
- Clear distinction between interactive elements

### 4. JavaScript Functionality
- Theme selector dropdown/toggle
- localStorage persistence of theme preference
- System preference detection (`prefers-color-scheme`)
- Smooth theme transitions
- No page flash when loading saved theme

### 5. Theme Selector
- Visible theme selector in header
- Options: Light, Dark, High Contrast
- Visual feedback for current selection
- Keyboard accessible