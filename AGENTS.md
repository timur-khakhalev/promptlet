### **Tech Requirements: AI Prompt Playground**
#### **2. Core Concept (The Elevator Pitch)**

**Promptlet** is a browser-based, stateless web application for interacting with Google's Gemini models. It allows users to create, manage, and use custom "mini-apps"—pre-configured prompts for specific tasks like translation, code generation, or text summarization. All user data, including API keys and mini-app configurations, is stored exclusively in the user's browser, ensuring complete privacy and no server-side history.

#### **3. Key Features & Business Logic**

**3.1. Stateless Interaction**
*   The application **must not** store any conversation history (user messages or model responses) between sessions or even after a page refresh.
*   Each interaction is a "one-shot" request and response.

**3.2. Mini-App Management (CRUD on Local Storage)**
*   **Create:** Users must be able to create a new mini-app by providing:
    *   A unique **Name** (e.g., "JavaScript Code Explainer").
    *   A **System Prompt** (the instruction that guides the model's behavior).
    *   The **Model** to be used (e.g., `gemini-1.5-flash-latest`, `gemini-pro`). This should be a dropdown list of supported models.
*   **Read:** Users must see a list of their created mini-apps, allowing them to easily switch between them.
*   **Update:** Users must be able to edit the name, system prompt, and model of an existing mini-app.
*   **Delete:** Users must be able to delete a mini-app they no longer need.
*   All mini-app data will be stored in the browser's **Local Storage**.

**3.3. Main Interaction Interface**
*   When a mini-app is selected, the interface will show a large text area for the user's message.
*   **Markdown Support:**
    *   The user's input text area should support Markdown for easy formatting.
    *   The model's response must be rendered as Markdown, correctly displaying headings, lists, code blocks, etc.
*   **Streaming Response:** The model's response must be displayed token-by-token (streamed) in real-time to improve perceived performance.
*   **Copy Functionality:**
    *   A "Copy" button must be available for the user's message.
    *   A "Copy" button must be available for the model's full response.
*   **New Chat:** A "New Chat" or "Clear" button must be present to clear the user input and the previous response, allowing for a fresh prompt within the same mini-app context.

**3.4. API Key Management**
*   The application must have a settings area (e.g., a modal or a separate page) where the user can manage their Gemini API key.
*   The user will have a single input field to paste their API key.
*   A checkbox or toggle labeled **"Save API key in browser"** must be present.
    *   **If checked (default):** The API key is stored in the browser's **Local Storage**. It will be automatically loaded on subsequent visits.
    *   **If unchecked:** The API key is held in memory for the current session only and is **not** written to Local Storage. The user will need to re-enter it on their next visit.

#### **4. High-Level User Flows**

**Flow 1: First-Time User**
1.  User opens the app for the first time.
2.  A welcome screen or modal appears, prompting them to enter their Gemini API key.
3.  The user pastes their key and decides whether to save it locally.
4.  The app presents a default view, perhaps with a pre-made example mini-app ("General Chat").
5.  User clicks "Create New Mini-App."
6.  They fill in the name ("My Translator"), system prompt ("Translate the following text to Spanish"), and select a model.
7.  The new mini-app is saved and appears in their list. The UI switches to this new mini-app.
8.  The user types "Hello, world!" into the message box and hits "Send."
9.  The response area populates in real-time with "Hola, mundo."
10. The user clicks the "Copy" button next to the response.

**Flow 2: Returning User**
1.  User opens the app.
2.  The application automatically loads the API key (if saved) and the list of mini-apps from Local Storage.
3.  The user sees their list of mini-apps (e.g., "My Translator," "JavaScript Code Explainer").
4.  They click on "JavaScript Code Explainer."
5.  The interface updates, ready for a new prompt in that context.

#### **5. Key Technical Specifications**

*   **Core SDK:** The application must use the **`@google/genai`** npm library for all interactions with the Gemini API.
*   **Streaming:** The `model.generateContentStream()` method from the SDK must be used to achieve the real-time streaming response.
*   **Data Storage:** All persistent data (mini-apps, API key preference) will use the browser's `window.localStorage` API. No backend or database is required.
*   **Frontend Framework:** A modern JavaScript framework is recommended (e.g., React, Svelte, Vue).
*   **Markdown:** A library like `react-markdown` (for React) or `marked` should be used to render the model's response.

#### **6. Local Storage Data Structure (Example)**

This is a suggested shape for the data stored in `localStorage`.

```json
{
  "settings": {
    "apiKey": "gsk_...", // Stored only if user gives consent, otherwise null
    "theme": "dark" // Example of a future setting
  },
  "miniApps": [
    {
      "id": "c7a4a2b9-a2a4-4d8b-9d2a-4c28f6f5d84a",
      "name": "Grammar Corrector",
      "systemPrompt": "You are an expert proofreader. Correct any grammatical errors in the following text and provide a short explanation for each correction. Do not change the original meaning.",
      "model": "gemini-1.5-flash-latest"
    },
    {
      "id": "f8d3b1e0-b3e1-4c6e-8e3b-9d1a3c7b2e1f",
      "name": "Code Explainer (Python)",
      "systemPrompt": "You are a senior Python developer. Explain the following code snippet in a clear and concise way, suitable for a junior developer. Use markdown for code blocks.",
      "model": "gemini-pro"
    }
  ]
}
```

### **6. Technology Stack**
pnpm + vite + react + typescript

The technology stack is selected to prioritize a fast user experience, rapid development, and maintainability, while strictly adhering to the client-side-only architecture. The foundation of this stack is **Vite**, a modern frontend build tool.

#### **6.1. Guiding Philosophy**

The choices below are guided by the following principles:

*   **No Server-Side Complexity:** The stack is 100% client-side. There will be no Node.js backend, API routes, or server-side rendering, as all logic resides in the user's browser.
*   **Performance:** The application must load quickly and provide a responsive interface, especially when streaming responses from the AI model.
*   **Modern Developer Experience:** The tools are chosen to enable fast development cycles, hot module replacement, and strong typing to reduce errors.

#### **6.2. Core Stack**

| Category | Selected Technology | Justification |
| :--- | :--- | :--- |
| **Build Tool & Dev Environment** | **Vite** | Provides an extremely fast development server with near-instant Hot Module Replacement (HMR). It builds a highly optimized static output (HTML, CSS, JS) perfect for deployment on any static host. This is the ideal lightweight alternative to more comprehensive frameworks like Next.js. |
| **Frontend Library** | **React (with TypeScript)** | React's component-based architecture is perfect for building the modular UI (Mini-app list, Chat window, Settings). TypeScript adds essential type safety for managing API keys, model responses, and the data structures stored in Local Storage, significantly reducing runtime errors. |
| **Styling** | **Tailwind CSS** | A utility-first CSS framework that allows for rapid and consistent UI development directly within the component markup. It eliminates the need for writing custom CSS files and is easily configurable to create a unique design. |
| **Data Persistence** | **Browser Local Storage** | A native browser API used to store all user-generated data, including the list of mini-apps and the (optional) user API key. This choice directly fulfills the core requirement that all data remains on the client side, ensuring user privacy. |
| **State Management** | **React Context API** | For managing global application state (such as the currently selected mini-app or UI theme), the built-in React Context API is sufficient. It avoids the unnecessary complexity and boilerplate of external libraries like Redux for an application of this scale. |

#### **6.3. Key Libraries & Tools**

| Tool / Library | Purpose | Implementation Notes |
| :--- | :--- | :--- |
| **`@google/genai`** | **Gemini API SDK** | The official Google AI SDK for JavaScript. It will be used for all communication with the Gemini API. The `model.generateContentStream()` method is critical for implementing the real-time streaming response feature. |
| **`react-markdown`** | **Markdown Rendering** | A React component to safely render Markdown content received from the model. It will be configured to handle various elements like lists, code blocks, and headings. Plugins like `rehype-highlight` can be added for syntax highlighting in code blocks. |
| **`uuid`** | **Unique ID Generation** | To create a unique `id` for each new mini-app saved to Local Storage. This is essential for reliable CRUD (Create, Read, Update, Delete) operations and for use as keys in React lists. |
| **`lucide-react` or a similar icon library** | **UI Icons** | To provide high-quality, consistent icons for buttons like "Copy," "New Chat," and "Delete," enhancing the user experience. |

#### **6.4. Development and Deployment**

*   **Development:** The project will be run locally using Vite's development server (`npm run dev`).
*   **Deployment:** The `npm run build` command will generate a `dist` folder containing static HTML, CSS, and JavaScript files. This folder can be deployed to any static hosting provider.
*   **Recommended Hosts:** **Vercel**, **Netlify**, or **GitHub Pages** are ideal choices as they offer robust free tiers and seamless, automated deployment from a Git repository.

## 7. Deployment

This app should be deployed at Vercel


