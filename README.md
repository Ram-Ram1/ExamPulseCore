# ExamPulseCore

ExamPulseCore is a draft MVP for helping students track assessments, visualize countdowns, and plan study tasks before each exam.

## Included in this draft

- Assessment entry form with title, subject, room, date, time, and test type
- Countdown dashboard with urgency states
- Reminder schedule for 7-day, 2-day, and morning-of alerts
- Study task checklist for micro-planning
- Local browser persistence using `localStorage`

## Run locally

Open `index.html` in a browser.

If you prefer a local web server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project direction

This draft is aligned to the Essential tier features from the blueprint:

1. Assessment Entry & Subject Tagging
2. Automated Countdown Dashboard
3. Multi-Stage Reminder Engine

## Next enhancements

- Connect to a real database and backend
- Add auth and multi-user profiles
- Introduce grade-weighted exam priorities
- Sync with Google Calendar / Outlook
- Build mobile-friendly deepening flows

## Files

- `index.html` — application layout
- `styles.css` — app styling
- `app.js` — assessment logic, countdown rendering, and reminders

## License

This project is a draft and is intended for prototype exploration.
