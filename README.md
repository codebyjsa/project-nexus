# 🎓 Project Nexus - Ultimate College Companion App

**The all-in-one campus life management platform powered by AI**

## 🌟 Features

### 📧 Daily Pulse (Mail Summarizer + Mess Menu)
- **AI-Powered Mail Summarization** using Groq's Llama 3.3 70B
- Automatic email categorization and priority detection
- Deadline extraction and action item identification
- **Live Mess Menu** with dietary information and allergen warnings
- Real-time meal timings and nutritional details

### 🔄 Exchange Hub
- **Lost & Found** - Report and find lost items on campus
- **Marketplace** - Buy/sell items with condition badges
- **Cab Pool** - Share rides and split costs
- Full CRUD operations with file-based JSON storage
- iOS 18+ inspired glassmorphic UI

### 🗺️ Explorer
- Discover nearby places and hangouts
- Filter by category (cafes, libraries, parks, etc.)
- Distance and rating information
- Beautiful card-based interface

### 📚 Academics
- Interactive timetable with class schedules
- Course management
- Grade tracking
- iOS-style calendar view

### 🤖 Nexus AI Chatbot
- Context-aware campus assistant
- Knows all app data (mess menu, emails, timetable, etc.)
- Powered by Groq API
- Conversational and helpful responses

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS with custom iOS 18+ design system
- **AI**: Groq API (Llama 3.3 70B)
- **Storage**: File-based JSON (no database required)
- **Deployment**: Vercel-ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/codebyjsa/project-nexus.git
cd project-nexus

# Install dependencies
npm install

# Create .env.local file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🔑 Environment Variables

Create a `.env.local` file:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at: https://console.groq.com/keys

## 📁 Project Structure

```
project-nexus/
├── app/
│   ├── academics/          # Timetable & courses
│   ├── exchange/           # Lost & Found, Marketplace, Cab Pool
│   ├── explorer/           # Places discovery
│   ├── mail-pulse/         # Mail summarizer + Mess menu
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── exchange/           # Exchange module components
│   ├── academics/          # Academic components
│   └── mail-pulse/         # Mail & mess components
├── data/                   # JSON data files
├── lib/                    # Utilities and helpers
└── public/                 # Static assets
```

## 🎨 Design System

- **iOS 18+ Aesthetic** with glassmorphism
- **Spring animations** for smooth interactions
- **Dynamic Island** inspired components
- **Custom scrollbars** and transitions
- **Dark mode** support (coming soon)

## 🔥 Key Features

### Exchange Hub CRUD Operations
- ✅ Create new items/products/rides
- ✅ Read and display all entries
- ✅ Update existing entries with edit button
- ✅ Delete entries with confirmation
- ✅ Real-time updates
- ✅ Form validation

### AI Mail Summarization
- Automatic email parsing
- Priority scoring (1-5)
- Deadline extraction
- Action item identification
- Category classification

### Mess Menu Intelligence
- Daily menu display
- Dietary information (veg/non-veg)
- Allergen warnings
- Meal timings
- Nutritional details

## 👥 Team

- **Jasdeep** - Exchange Hub (Lost & Found, Marketplace, Cab Pool)
- **Manmohan** - Mail Pulse, Mess Menu, Core UI
- **Sehaj** - Academics, Explorer, Integration

## 📄 License

MIT License - feel free to use this project for learning!

## 🙏 Acknowledgments

- Groq for the amazing AI API
- Next.js team for the incredible framework
- Tailwind CSS for the utility-first styling

---

**Built with ❤️ for college students by college students**
