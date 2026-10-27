# ShiftLoop

Good shifts. Great work. A responsive factory workforce dashboard built for PromptWars 2026.

Factories often coordinate people through paper attendance registers, spreadsheets and scattered chats. ShiftLoop places daily workforce and floor operations in one consistent workspace with 15 working modules.

## The 15 features

1. **Overview** — live attendance, output, staffing and pending-request metrics.
2. **People** — add, edit, search and remove worker profiles, roles, departments and rates.
3. **Attendance** — clock in, clock out, calculate elapsed hours and maintain daily records.
4. **Shift planner** — schedule crews and compare assigned versus required headcount.
5. **Time off** — record, approve or decline leave requests.
6. **Overtime** — review requests and estimate approved hours × rate.
7. **Task board** — move assigned work from To do to In progress to Done.
8. **Production** — record output and compare batches against targets.
9. **Machines** — manage machine availability and manually recorded uptime.
10. **Maintenance** — create, assign and resolve work orders.
11. **Safety desk** — record incidents, severity, response and resolution.
12. **Inventory** — maintain quantities and flag reorder thresholds.
13. **Training** — schedule training and track participant completion.
14. **Noticeboard** — publish, edit and archive factory notices inside the app.
15. **Reports** — derived operational summaries and CSV export.

## Run locally

Requires Node.js 22 or newer. No package installation or build is required.

```sh
npm start
# http://localhost:8080
npm test
```

For Firebase, copy `.env.example` to `.env.local`, populate it with your Firebase **web app** configuration, then run:

```sh
node --env-file=.env.local server.mjs
```

`FIREBASE_CONFIG` is a JSON string. Include `databaseId` with your exact Firestore database ID. The configured project uses the named database `default`, not `(default)`.

## Firebase architecture

- Firebase modular Web SDK 12.4.0, loaded from Google's CDN.
- Email/password Authentication with persistent sign-in.
- Firestore Enterprise Native, `asia-south1`, database `default`.
- Records: `workspaces/{authenticatedUid}/records/{recordId}`.
- Real-time core API listeners are intentional: the dashboard must update immediately after edits across sessions. Each workspace query is limited to 2,000 records.
- Every write is acknowledged by Firestore before showing a saved confirmation. Errors remain visible.
- Every account owns an isolated workspace. This prototype does not implement shared multi-manager membership or employee self-service permissions.
- Signed-out demo data is synthetic and stored separately in browser localStorage. Sample data is never automatically copied into a signed-in account. Use **My account → Load sample factory** in an empty workspace.
- Analytics identifiers are accepted in config, but Analytics collection is not enabled by default.

Enable Email/Password in Firebase Authentication and deploy the included rules to database `default`:

```sh
npx firebase-tools deploy --only firestore:rules --project promptwars-c840c
```

The prototype rules validate creates and updates, restrict reads/writes to the owner UID, bound text/numeric values, reject unknown fields and protect record kind and clock-in timestamps. Review them and add organization membership, App Check, quota controls and audit logging before a real factory rollout. Dates and attendance are client-entered operational records, not verified biometric or payroll data.

## Google Cloud Run

Cloud Run is the intended final host. The repository includes a non-root Node container, port support through `PORT`, security headers and `/healthz`.

From a signed-in Google Cloud Shell with billing linked and project permissions:

```sh
git clone https://github.com/PROPARA18/shiftloop-factory.git
cd shiftloop-factory
export FIREBASE_CONFIG='your Firebase web app configuration JSON'
bash deploy.sh
```

The deployment script reads runtime configuration from the environment and keeps it out of Git. Firebase web configuration is necessarily sent to the browser; it is not a service-account secret. Access control is enforced by Firebase Authentication and Firestore Rules. Never put service-account keys, OAuth tokens or passwords in `FIREBASE_CONFIG`.

Required project access for source builds includes Cloud Run Admin, Service Usage Admin, Cloud Build Editor and Service Account User; the actual build service account must have the Cloud Run Builder role. Your administrator may need to grant these according to the project's policy.

## Verification

`npm test` covers the 15-module manifest, sample validation, unique daily attendance, output totals, invalid input, percentage/participant limits, CSV quoting/formula protection, HTTP routes, security headers and private-file isolation.

Live Firebase checks on the configured project passed owner create/read/update/delete, anonymous and cross-user denial, invalid types, negative values, oversized text, missing/extra fields, record-kind mutation and stale timestamps. Temporary test records and users were removed afterward.

Keyboard-accessible forms, labeled controls, dialog focus containment, skip navigation, reduced-motion support and narrow-screen layouts are included. Monetary values are planning estimates, not statutory payroll calculations.

## Submission

Public repository: https://github.com/PROPARA18/shiftloop-factory.git

Keep only the `main` branch. Source files are well below the guide's 10 MB initial limit; do not commit dependencies, credentials, generated archives or videos. The final deployment must be a verified Google Cloud Run URL. A LinkedIn post is a separate requirement in the supplied guide; this project does not publish one automatically.
