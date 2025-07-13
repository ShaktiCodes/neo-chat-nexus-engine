# 🤖 AI Plugin Chatbot Interface

A powerful, AI-enhanced chatbot built using React.js, TypeScript, and Vite. This chatbot supports a plugin-based architecture, enabling dynamic command execution using slash commands (`/weather Paris`, `/define empathy`, `/calc math`). It also supports natural language understanding, letting users interact in a fluid, conversational manner.

## 🧩 Features

- 💬 Chat Interface with command and message support
- 🧠 Natural Language Command Parsing (e.g., "What’s the weather in Tokyo?")
- 🔌 Plugin Architecture to support modular command functionality
- 🌦️ `/weather` plugin (uses OpenWeatherMap API)
- 📖 `/define` plugin (uses Dictionary API)
- 📝 `/gemini` plugin (uses Google Gemini API)
- 🔍 `/calc` plugin supports inline math like `Calculate 5 * 10`
- 🎨 Rich chat formatting: markdown & styled plugin cards
- ⚙️ Dynamic plugin addition
- 🌐 Routing with `react-router-dom`
- ⚡ Built with Vite for fast dev and builds

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| React.js + TypeScript | UI & typing support |
| Vite | Fast development/build system |
| shadcn/ui | Accessible and modern UI components |
| Tailwind CSS | Utility-first styling |
| React Router DOM | SPA routing for plugin pages |
| OpenWeatherMap API | `/weather` command |
| Dictionary API | `/define` command |
| Google Gemini API | `/gemini` content generation |
| Calc | '/math' expression |
| Framer Motion | Animations & transitions (optional) |

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ShaktiCodes/plugin-powered-chat-hub.git
cd plugin-powered-chat-hub
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory and add in plugin file:

```env
VITE_OPENWEATHER_API_KEY=your_weather_api_key
VITE_DICTIONARY_API_URL=https://api.dictionaryapi.dev/
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_MATH_API_KEY=your_expression_evolution_api_key
```

### 4. Run the Project

```bash
npm run dev
```



---

## ✅ Bonus Features

* 🧩 Dynamic Plugin Loader – Easily plug new tools into chat
* ✨ Markdown & Rich Responses – Styled chat messages and plugin cards
* ⏳ Loading & Error States – UX feedback during async plugin calls
* 🔍 Smart Command Routing – Natural message → command mapping

---

## 📦 Future Enhancements

* ✅ Voice Input (Speech-to-text)
* ✅ AI Response Memory Context
* ✅ Admin UI for Plugin Management
* ✅ User Authentication


