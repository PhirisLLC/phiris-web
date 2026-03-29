# Phiris Web App

React + Vite + Firebase web application for the Phiris beta MVP.

---

## Prerequisites

- Node.js 18+ and npm
- A Firebase project (free Spark plan works for beta)
- A web browser with camera access (for scanning)

---

## 1. Firebase Setup

### Create your project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it "phiris-beta" → create
3. In the project dashboard, click the **Web** icon (`</>`) to add a web app
4. Register the app (any name) → copy the `firebaseConfig` object shown

### Enable Authentication
1. In Firebase console → **Authentication** → **Get started**
2. Under **Sign-in method**, enable **Email/Password**

### Enable Firestore
1. In Firebase console → **Firestore Database** → **Create database**
2. Choose **Start in test mode** (we'll add security rules before launch)
3. Pick any region (us-east1 is fine)

### Enable Storage
1. In Firebase console → **Storage** → **Get started**
2. Start in test mode → pick same region as Firestore

### Firestore Security Rules (before going live)
Replace the default rules with these in **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Responders can read any patient profile (for emergency lookup)
    match /users/{userId} {
      allow read: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.accountType == 'responder';
    }
  }
}
```

---

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then open `.env` and paste your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=phiris-beta.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=phiris-beta
VITE_FIREBASE_STORAGE_BUCKET=phiris-beta.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# AWS Rekognition (leave blank for beta — uses demo mode)
VITE_AWS_REGION=us-east-1
VITE_AWS_REKOGNITION_COLLECTION_ID=phiris-faces
```

> **Note:** In beta, `VITE_AWS_*` variables are not used. The scan interface runs in demo mode and returns the first enrolled patient as a match. See `src/pages/Responder/ScanInterface.jsx` for the `matchFaceToPatient` function where you'll plug in the real AWS Rekognition call.

---

## 3. Install & Run

```bash
# From the phiris-web directory
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 4. Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Firebase Hosting, Vercel, Netlify, or any static host.

### Deploy to Firebase Hosting (optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select your project, set public dir to "dist", SPA: yes
npm run build
firebase deploy
```

---

## 5. App Structure

```
src/
├── firebase.js              # Firebase init (auth, db, storage)
├── main.jsx                 # Entry — BrowserRouter + AuthProvider
├── App.jsx                  # Route definitions + guards
├── index.css                # Global styles + Phiris design tokens
├── contexts/
│   └── AuthContext.jsx      # Auth state, user profile, register/login
├── components/
│   └── Header.jsx           # Nav header (light + dark variants)
└── pages/
    ├── Landing.jsx           # Public homepage
    ├── Auth.jsx              # Login + patient/responder registration
    ├── Profile.jsx           # Patient's own profile view
    ├── NotFound.jsx          # 404
    └── EnrollWizard/
    │   ├── index.jsx         # 4-step wizard shell + Firebase save
    │   ├── Step1Personal.jsx # DOB, sex, blood type, height, weight
    │   ├── Step2Medical.jsx  # Allergies, conditions, meds, DNR
    │   ├── Step3Contacts.jsx # Emergency contacts (up to 3)
    │   └── Step4Photo.jsx    # Photo capture / upload
    └── Responder/
        ├── ResponderHome.jsx  # Responder dashboard
        ├── ScanInterface.jsx  # Camera scan + file upload
        └── PatientResult.jsx  # Emergency medical profile display
```

---

## 6. User Flows

### Patient Flow
1. `/register` → create patient account
2. `/enroll` → 4-step wizard (personal info → medical → contacts → photo)
3. `/profile` → view completed profile, edit via `/enroll`

### Responder Flow
1. `/responder/register` → create responder account (requires agency + badge number)
2. `/responder` → dashboard
3. `/responder/scan` → camera or photo upload
4. `/responder/result/:patientId` → matched patient's emergency profile

---

## 7. AWS Rekognition Integration (Production)

The `matchFaceToPatient` function in `ScanInterface.jsx` currently returns a demo match. To go live:

1. Create an AWS account and enable Rekognition in your region
2. Create a face collection: `aws rekognition create-collection --collection-id phiris-faces`
3. Build a backend API endpoint (Lambda or Express) that:
   - Accepts `POST /api/identify { image: base64 }`
   - Calls `rekognition.searchFacesByImage()` with your collection
   - Returns `{ matched: true, patientId: '...' }` or `{ matched: false }`
4. When a patient enrolls, index their face:
   - Call `rekognition.indexFaces()` with their photo + their Firebase UID as `ExternalImageId`
5. Replace the `matchFaceToPatient` function body with a fetch to your endpoint

> AWS Rekognition is HIPAA-eligible when used with a signed BAA. Never call Rekognition directly from the browser — always proxy through your backend to keep AWS credentials server-side.

---

## 8. Accounts for Testing

Create two test accounts manually through the app:

**Test Patient:**
- Go to `/register` → create patient account
- Go through the full `/enroll` wizard
- Use a clear face photo

**Test Responder:**
- Go to `/responder/register` → create responder account
- Go to `/responder/scan` → scan the patient photo
- In beta demo mode it will match to the enrolled patient

---

## Brand Colors

| Token | Value | Use |
|-------|-------|-----|
| `--phiris-dark` | `#0D1A1A` | Dark backgrounds |
| `--phiris-teal` | `#1E8484` | Primary actions |
| `--phiris-teal-light` | `#3AABAB` | Accents, borders |
| `--phiris-gold` | `#C8A04A` | Highlights |
| `--text-dark` | `#1C2A2A` | Body text on light |

---

Built with React 18 + Vite 5 + Firebase 10
