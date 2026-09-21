# LetterAI — AI Letter Writing Web Application

**LetterAI** is a modern, production-ready AI-powered web application that turns any informal note, purpose, or topic into a complete, properly formatted formal or informal letter in seconds.

Built with a modular React + Vite frontend, an Express API backend, and Google Gemini models via `@google/genai`, LetterAI enforces standard correspondence formatting, correct grammar, and tailored tone while keeping API keys completely secure on the server.

---

## Features

- **17 Specialized Letter Formats**:
  Formal Letter, Informal Letter, Application Letter, Leave Application, Job Application, Complaint Letter, Request Letter, Permission Letter, Resignation Letter, Apology Letter, Invitation Letter, Thank You Letter, Business Letter, School/College Letter, Recommendation Letter, Cover Letter, Custom Letter.
- **7 Tonal Styles**:
  Very Formal, Formal, Professional, Friendly, Polite, Casual, Persuasive.
- **10 Languages**:
  English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, and Urdu (output natively in authentic script).
- **3 Length Profiles**:
  Short (1–2 paragraphs), Medium (2–3 paragraphs), Detailed (comprehensive with full background & next steps).
- **Realistic Paper Preview**:
  Rendered in a realistic paper-styled container with subtle elevation, document margins, and serif typography.
- **Live Document Editing**:
  Directly modify any sentence in the letter preview before exporting. User edits are preserved seamlessly.
- **Instant Actions**:
  - **Copy**: 1-click clipboard copy with animated visual feedback.
  - **Download**: Exports as clean `letter.txt`.
  - **Print**: Dedicated print media stylesheet (`@media print`) prints *only* the letter document without headers, form controls, or web clutter.
  - **Regenerate**: Re-runs generation with current parameters.
  - **New Letter**: Clears form and resets state.
- **Preset Quick-Fill Examples**:
  Leave Application, Job Application, Complaint Letter, and Permission Letter presets for fast testing.
- **Strict Security Architecture**:
  Gemini API key is strictly managed on the Node.js backend via environment variables and never exposed to the client browser.

---

## Technology Stack

- **Frontend**:
  - [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/) for modern styling & responsive design
  - [Lucide React](https://lucide.dev/) for clean UI icons
  - Google Fonts (`Plus Jakarta Sans` & `Merriweather`)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai`, using `gemini-3.8-flash` / `gemini-3.6-flash`)
  - [dotenv](https://github.com/motdotla/dotenv) for environment variables
  - [cors](https://github.com/expressjs/cors) for cross-origin management
- **Orchestration**:
  - `concurrently` for simultaneous client & server execution with a single command.

---

## Folder Structure

```
letterapp/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Navbar with branding, links & CTA
│   │   │   ├── Hero.jsx             # Hero section with value badges
│   │   │   ├── LetterForm.jsx       # 2-column left form with dropdowns & inputs
│   │   │   ├── LetterPreview.jsx    # Realistic paper document view, actions & editor
│   │   │   ├── LoadingState.jsx     # Animated skeleton & writing stage indicator
│   │   │   ├── HowItWorks.jsx       # 3-step visual guide
│   │   │   ├── Features.jsx         # 9 feature cards grid
│   │   │   ├── ExampleLetters.jsx   # 4 quick-populate interactive presets
│   │   │   ├── FaqSection.jsx       # Accordion FAQ answers
│   │   │   └── Footer.jsx           # Clean footer & links
│   │   ├── services/
│   │   │   └── api.js               # Frontend API client
│   │   ├── App.jsx                  # Main application state & coordinator
│   │   ├── main.jsx                 # Vite entry point
│   │   └── index.css                # Tailwind directives & @media print styles
│   ├── index.html                   # HTML template with fonts & SEO tags
│   ├── vite.config.js               # Vite config with /api proxy to backend
│   ├── tailwind.config.js           # Custom typography, colors, shadows
│   ├── postcss.config.js
│   └── package.json
│
├── server/
│   ├── routes/
│   │   └── letterRoutes.js          # POST /api/letters/generate & GET /api/health
│   ├── controllers/
│   │   └── letterController.js      # Input validation & error handling
│   ├── services/
│   │   └── aiService.js             # Google Gemini prompt engineering & API invocation
│   ├── server.js                    # Express app & middleware configuration
│   ├── .env.example                 # Example environment template
│   ├── .env                         # Local environment configuration (git-ignored)
│   └── package.json
│
├── package.json                     # Root orchestrator scripts
├── README.md                        # Documentation
└── .gitignore                       # Git ignore rules
```

---

## Installation & Setup

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (version 9 or higher)

### 1. Clone or Open the Repository
```bash
cd letterapp
```

### 2. Install All Dependencies
You can install dependencies for the root, server, and client all at once:
```bash
npm run install:all
```
Or manually install them in each directory:
```bash
# In root:
npm install

# In server/:
cd server && npm install && cd ..

# In client/:
cd client && npm install && cd ..
```

---

## How to Configure GEMINI_API_KEY

1. Open `server/.env` (or copy from `server/.env.example` if not present):
   ```bash
   cp server/.env.example server/.env
   ```
2. Open `server/.env` in your editor and enter your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```
3. *(Optional)* You can also specify an alternate model (defaults to `gemini-3.8-flash`):
   ```env
   GEMINI_MODEL=gemini-3.8-flash
   ```

> **Security Note**: Never commit `server/.env` to source control. It is already added to `.gitignore`.

---

## How to Run the Application

### Option A: Unified Hosting on a Single Localhost (Frontend + Backend on Port 5000)
Run the entire application (React frontend + Express Gemini API) unified on a single port:
```bash
npm start
```
Visit **`http://localhost:5000`** in your browser. Both the web application and all `/api/*` endpoints run together on the same origin.

### Option B: Concurrent Development Mode (Vite HMR + Server Watch)
If you are modifying frontend UI and want Vite Hot Module Replacement:
```bash
npm run dev
```
- **Unified Backend & Hosted App**: `http://localhost:5000`
- **Vite HMR Dev Server**: `http://localhost:3000`

---

## API Specification

### `POST /api/letters/generate`

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "topic": "I want to write a leave application to my college because I am sick and need 3 days leave.",
  "letterType": "Leave Application",
  "tone": "Polite",
  "language": "English",
  "length": "Medium",
  "recipientName": "The Principal",
  "senderName": "Sahil Kumar",
  "organization": "ABC College of Engineering",
  "date": "September 15, 2026",
  "additionalInstructions": "Mention doctor advised complete rest."
}
```

#### Successful Response (`200 OK`)
```json
{
  "success": true,
  "letter": "Sahil Kumar\nABC College of Engineering\n\nSeptember 15, 2026\n\nThe Principal\nABC College of Engineering\n\nSubject: Leave Application for 3 Days Due to Sickness\n\nRespected Sir/Madam,\n\nI am writing to formally request leave of absence from college for three days..."
}
```

#### Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Please enter a topic or describe the letter you want to write."
}
```

---

## How to Use the Application

1. Open `http://localhost:3000` in your web browser.
2. In the **Generator** section:
   - Type your letter reason/topic in the main textarea (or click any of the 4 **Popular Example Letters** below).
   - Select your **Letter Type** (e.g., Leave Application, Job Application, Resignation).
   - Select your desired **Tone** (e.g., Polite, Professional, Formal).
   - Select your desired **Language** (e.g., English, Hindi, Tamil, etc.).
   - Select **Length** (Short, Medium, or Detailed).
   - (Optional) Expand **Optional Letter Details** to specify recipient name, your name, organization, or custom dates.
3. Click **✨ Generate Letter**.
4. Once generated:
   - **Review**: The letter appears on a realistic textured paper document.
   - **Edit**: Click **Edit Letter** to tweak any sentence right inside the paper.
   - **Copy**: Click **Copy** to copy text directly to your clipboard.
   - **Download**: Click **Download** to save as `letter.txt`.
   - **Print**: Click **Print** to open the browser print dialog with page-optimized styles.
   - **Regenerate / New Letter**: Re-run with the same parameters or clear the form for a fresh letter.

---

## Troubleshooting

### 1. `Gemini API Key is missing or not configured`
- Ensure you have created `server/.env` and supplied a valid key in `GEMINI_API_KEY=...`.
- Ensure there are no surrounding quotes or extra spaces around the key.
- Restart the backend server after modifying `.env`.

### 2. `Unable to connect to the backend server`
- Check that the server is running on `http://localhost:5000`.
- Run `curl http://localhost:5000/api/health` to confirm server status.

### 3. Port 5000 is already in use
- Change `PORT=5001` in `server/.env` and update the proxy in `client/vite.config.js`.

---

## License
MIT License © LetterAI.
