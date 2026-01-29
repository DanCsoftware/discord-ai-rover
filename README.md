# Rover

A concept prototype demonstrating an AI assistant for Discord community navigation and discovery.

## What This Is

Rover is a **web-based prototype** that demonstrates how an AI assistant could help users navigate and discover Discord communities. It simulates Discord's interface and uses Google Gemini to show what such an assistant might do.

**Important:** This is not a real Discord bot. It's a standalone web application built to explore the concept.

## The Concept

Discord has millions of communities, but finding the right one is difficult. Rover demonstrates how an AI assistant could:

- Summarize server announcements by topic
- Verify suspicious links before clicking
- Find message threads you participated in
- Discover communities with nuanced matching ("beginner-friendly gaming servers")
- Provide context-aware help without cluttering channels

## How It Works (Current Implementation)
```
Web UI (Discord-like) → User input → Gemini API → AI response displayed
```

**Stack:**
- Frontend built with Lovable
- Google Gemini API for AI reasoning
- Simulated Discord UI (not connected to real Discord)

## Setup

### Prerequisites
- Node.js 18+
- Google Gemini API key

### Installation
```bash
git clone https://github.com/DanCsoftware/Rover.git
cd Rover
npm install
```

### Configuration

Create `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Run
```bash
npm run dev
```

Visit `http://localhost:5173` to see the prototype.

## Demo Features

The prototype demonstrates:
- Conversational AI interface
- Context-aware responses
- Link verification concept
- Community discovery queries
- Private response simulation

## Project Status

**This is a concept prototype.** To make this a real Discord bot would require:

1. Discord bot token and proper bot setup
2. Discord.js or similar framework
3. Actual Discord API integration
4. OAuth for server connections
5. Proper message handling and permissions

## Why This Exists

This prototype was built to:
- Explore the UX of AI-assisted Discord navigation
- Test Gemini's capabilities for community discovery
- Demonstrate the concept to potential collaborators
- Learn about AI assistant design patterns

## Future Path

To make this production-ready:
- [ ] Convert to actual Discord bot integration
- [ ] Real server data access via Discord API
- [ ] Ephemeral message implementation
- [ ] Server discovery API integration
- [ ] Link safety verification service
- [ ] Rate limiting and scaling

## Tech Stack

- Frontend: Lovable + React
- AI: Google Gemini API
- Styling: Tailwind CSS
- Current: Web prototype
- Future: Discord.js bot

## Contributing

This is a concept prototype. If you're interested in turning this into a real Discord bot, open an issue to discuss.

## License

MIT

---

**Note:** This is a prototype demonstrating a concept, not a production Discord bot.