\# Relo — Testing Loop Log



\## Iteration 1



\*\*Maker:\*\* Built the core Relo feature — a Next.js page with a textarea for the user's travel/relocation situation, and an API route (`/api/travel-advice`) that calls Gemini 2.5 Flash to generate structured travel advice (documents, steps, cost of living, banking, transportation, common mistakes, checklist), displayed via tabs.



\*\*Checker:\*\* Ran TestSprite CLI against the live deployment (`https://relo-zwci.vercel.app/`) with an 8-step frontend plan covering: homepage load, form submission with valid input, tab navigation across all 7 result categories, and empty-input validation.



\*\*Result:\*\* 34/34 steps passed. No issues found.

\- Run ID: `c4081e6d-de36-480b-9468-e0d09ed2ba70`

\- Dashboard: https://www.testsprite.com/dashboard/tests/2a48db23-4d48-4c2c-80f7-ef6cad78521f/test/6569fb03-b171-453c-96e5-81677d25b015



\## Iteration 2



\*\*Maker:\*\* Added the Emergency Mode feature — a modal triggered by a red "🚨 وضع الطوارئ" button, where the user enters their current country (and optional nationality) to get AI-generated emergency info via a new API route (`/api/emergency`) powered by Gemini: police/ambulance/fire numbers, embassy-finding advice, key emergency phrases translated to the local language, and a safety tip.



\*\*Checker:\*\* Ran TestSprite CLI against the live deployment with a plan covering: opening the modal, submitting a valid country (Germany), verifying all emergency data renders correctly, closing the modal, and validating the empty-input error case.



\*\*Result:\*\* 7/7 steps passed. No issues found.

\- Run ID: `61d8ab4a-4b5b-4e15-93f6-326a5ec6ccd1`

\- Dashboard: https://www.testsprite.com/dashboard/tests/2a48db23-4d48-4c2c-80f7-ef6cad78521f/test/3a873dad-e1a7-4603-abc7-8896e5c0c1a6



\## Iteration 3



\*\*Maker:\*\* Added the Scam Alerts feature — a modal triggered by an amber "⚠️ تحذيرات النصب" button, where the user enters a destination country and receives 4-5 common real-world scams (via `/api/scam-alerts`, powered by Gemini) with descriptions and avoidance tips.



\*\*Checker:\*\* Ran TestSprite CLI against the live deployment with an 11-step plan covering the full flow. Initial run returned status `blocked` (13/15 steps passed, 2 flagged) — investigating the failure bundle (`testsprite test artifact get`) showed the root cause was not an app bug: the project-level `--instruction` set during initial project creation was scoped to the travel-advice feature only, causing the agent to flag later feature-specific test runs as incomplete for not covering unrelated app functionality.



\*\*Fix:\*\* Updated the project instruction (`testsprite project update --instruction ...`) to clarify that each test should be judged only against its own planSteps, not the whole app's feature set.



\*\*Result:\*\* Rerun after the fix passed 20/20 steps.

\- Blocked run: `cc14c163-edd5-41c4-8e39-f624617df757`

\- Fixed rerun: `706b3aff-fa32-498b-88ee-c65d7911ed19`

\- Dashboard: https://www.testsprite.com/dashboard/tests/2a48db23-4d48-4c2c-80f7-ef6cad78521f/test/82f0630c-f853-4e74-8fce-7458fd0342e8

