# ExamPulseCore Project Plan

## Project summary
ExamPulseCore is a student-focused assessment planning app designed to reduce missed exam dates and last-minute panic. The product combines three essential benefits:

- Fast assessment capture and subject tagging
- Visual countdown dashboards with urgency-based prioritization
- Timed reminder notifications before each assessment

## Product vision
Create a simple, reliable, and motivating app that helps students stay ahead of deadlines without feeling overwhelmed. The app should turn assessment tracking into a calm planning workflow rather than another task to manage.

## MVP goals
The initial release should validate the core experience:

1. Users can add an assessment with required details
2. Assessments appear in a dashboard sorted by upcoming date
3. Countdown urgency is clearly visible
4. Reminder thresholds are easy to understand and schedule
5. Students can add study micro-tasks linked to assessments

## Core user stories
### Assessment capture
- As a student, I want to add an exam or assessment quickly so I can track it in one place.
- As a student, I want to include subject/course, room, date, time, and test type so I can find the right information later.

### Dashboard and urgency
- As a student, I want to see upcoming assessments by urgency so I know what matters most.
- As a student, I want clear visual states for <48h, <7d, and 7d+ so I can respond without reading everything.

### Reminder system
- As a student, I want reminders 7 days out, 2 days out, and on the morning of the exam so I stay prepared.
- As a student, I want reminders to be configurable so I can choose notification timing.

### Study planning
- As a student, I want to break revision into short tasks so test prep feels manageable.
- As a student, I want to connect tasks directly to a specific assessment so I stay focused.

## Product priorities

### Tier 1: Essential (MVP)
- Assessment entry and subject tagging
- Automated countdown dashboard
- Reminder engine

### Tier 2: Optional
- Study task breakdowns
- Grade weighting calculator

### Tier 3: Future
- Google Calendar / Outlook / iCal sync
- Cross-device sync and notifications

## Recommended technical approach
### Frontend
- React + Vite for a fast, modular UI
- CSS Modules or Tailwind for cleaner component styling
- Local storage for early prototype and demo validation

### Backend
- Node.js + Express or Next.js API routes
- PostgreSQL for persistent assessment data
- Prisma or Sequelize for schema and migration management

### Notifications
- Email and in-app reminder service abstraction
- Scheduling via CRON or queue-based worker for time-triggered delivery

### Authentication
- Email/password or OAuth for personal account access
- User-owned assessment lists and profile settings

## Milestone plan

### Phase 1: Prototype and validation (Weeks 1-2)
Objectives:
- Finalize the MVP UX and dashboard layout
- Validate form flow and urgency logic
- Confirm the reminder cadence matches real student needs

Deliverables:
- Working assessment form
- Countdown dashboard
- Reminder schedule skeleton
- Basic task checklist

Acceptance criteria:
- User can create, view, and track at least one assessment
- Dashboard clearly shows urgency categories
- Reminder schedule is visible and understandable

### Phase 2: Data persistence and app foundation (Weeks 3-4)
Objectives:
- Replace local storage with persistent backend storage
- Add user accounts and secure assessment ownership
- Introduce editing and deleting for assessments

Deliverables:
- Database schema for users and assessments
- REST API for CRUD operations
- Authentication flow

Acceptance criteria:
- Assessments persist across sessions
- Users can manage their own set of assessments
- Data is protected and scoped to the authenticated user

### Phase 3: Reminder engine and automation (Weeks 5-6)
Objectives:
- Add real scheduled reminders
- Support multiple notification types
- Improve the timing logic for early warnings

Deliverables:
- Reminder service
- Notification queue or scheduler
- Reminder status tracking

Acceptance criteria:
- Reminders trigger at defined intervals
- Users receive timely, relevant alerts
- Reminder delivery failures are logged and visible

### Phase 4: Study planning and priority calculations (Weeks 7-8)
Objectives:
- Add task breakdowns per assessment
- Support weighted importance scoring
- Improve recommendations using assessment impact

Deliverables:
- Study tasks tied to assessment records
- Weight-based ranking or priority model
- Suggested study plan views

Acceptance criteria:
- Users can create study tasks for each exam
- Higher-weight assessments rank earlier in the dashboard
- Priority recommendations make sense to users

### Phase 5: Integration and polish (Weeks 9-10)
Objectives:
- Add calendar sync integrations
- Improve accessibility and responsiveness
- Prepare launch-ready UX and deployment pipeline

Deliverables:
- Calendar integration flow
- Final dashboard polish
- Deployment environment setup

Acceptance criteria:
- Users can connect external calendars
- The app is mobile friendly and accessible
- The app is ready for a beta release

## Success metrics
- Users can add and manage assessments in under 2 minutes
- 80%+ of users successfully complete the assessment setup flow
- Reminder alerts are delivered on time for at least 95% of scheduled events
- A high share of users return to the app during the week before exams

## Risks and mitigations
### Risk: reminder reliability
Mitigation:
- Use a robust scheduler and test against edge cases like timezone differences and DST

### Risk: overly complex UX
Mitigation:
- Keep the first screen simple; add deeper features later

### Risk: student overload from too many notifications
Mitigation:
- Default to only 3 strategic reminders and allow user customizations

### Risk: incorrect prioritization
Mitigation:
- Start with date-based urgency before adding grade-weight logic

## Immediate next actions
1. Convert the current static draft into a React-based app shell
2. Define the data model for users, assessments, tasks, and reminders
3. Build the CRUD API for assessments
4. Implement a scheduler foundation for reminder delivery
5. Validate the MVP with a small set of student scenarios

## Recommended working order
1. Frontend polish and component separation
2. Database and backend setup
3. API integration with the UI
4. Reminder engine with testing
5. Study tasks and weighting module
6. Calendar integration
7. Beta launch preparation

## Closing note
This project should be delivered in stages. The MVP must be simple, trustworthy, and useful on day one. Once the core countdown and reminder experience works well, the optional high-value features can expand the product without compromising clarity.
