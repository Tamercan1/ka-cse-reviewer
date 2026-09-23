# Ka-CSE Reviewer

Ka-CSE Reviewer is a student-friendly web application built to help Philippine Civil Service Examination (CSE) examinees practice, review, and track their progress.

It provides focused practice quizzes, a full exam simulator, daily vocabulary challenges, and browser-based progress persistence.

**Live Demo:** https://kacsereviewer.netlify.app/

## Features

* **Practice Mode** — Review specific CSE areas including Numerical, Verbal, Analytical, Clerical, and General Information.
* **Full Exam Simulator** — Take a timed CSE simulation with question navigation, flagging, and randomized questions.
* **Daily Vocabulary Challenge** — Practice vocabulary through daily synonym and antonym quizzes.
* **Session Persistence** — Automatically saves quiz and exam progress using the browser's `LocalStorage` API.
* **Performance Tracking** — Track scores, streaks, vocabulary progress, and previous exam results.
* **Question Randomization** — Uses the Fisher-Yates shuffle algorithm to randomize questions during practice and exam simulations.
* **Responsive Interface** — Designed for students to use across desktop and mobile devices.

## Tech Stack

* HTML5
* JavaScript (ES6+)
* Tailwind CSS
* LocalStorage
  
## Why I Built It

I built Ka-CSE Reviewer while preparing for the Philippine Civil Service Examination.

I wanted a more convenient way to practice than relying entirely on static review materials, so I built a browser-based reviewer that combines practice questions, a full exam simulation, vocabulary exercises, and progress tracking in one place.

The project was also an opportunity for me to practice building a complete frontend application with JavaScript, managing client-side state, working with structured data, and designing an application around an actual user need.

After deploying it, I shared the reviewer with classmates who used it for their own CSE preparation.

## What I Learned

This project helped me strengthen my understanding of:

* JavaScript application logic and state management
* DOM manipulation and event handling
* Browser `LocalStorage`
* Data organization and client-side persistence
* The Fisher-Yates shuffle algorithm
* Building reusable UI and quiz components
* Deploying a web application with Netlify
* Designing software around a real-world use case

## Status

**Completed — v1**

The current version is a functional frontend-only CSE reviewer. Future improvements may include a backend, user accounts, cloud-based progress synchronization, and additional study features.

## License

This project is licensed under the MIT License.
