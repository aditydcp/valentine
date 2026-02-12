💖 Interactive Valentine Web App

A playful, animated Valentine web experience featuring name validation, dynamic buttons, confetti effects, floating hearts, sparkles, music playback, and interactive reactions. **This project is only meant for personal purpose, uses hardcoded string**.

⸻

✨ Features

🎭 Interactive Flow
	•	Name validation with progressive error messages
	•	Animated welcome transition overlay
	•	Dynamic question screen behavior modes:
	•	Anti-Reject Mode → No button runs away
	•	Pro-Yes Mode → Yes button grows bigger

🎉 Visual Effects
	•	Confetti burst, spray, and falling particles
	•	Floating drifting hearts background
	•	Sparkle particle overlay
	•	Shake animations for feedback
	•	Smooth screen transitions

🔊 Audio System
	•	Background music per screen
	•	Sound effects support
	•	Programmatic playback control
	•	Music indicator UI with track info

📱 Mobile Optimized
	•	Responsive layout
	•	Viewport-safe positioning
	•	Touch vibration feedback

⸻

📁 Project Structure

project/
│
├── assets/
│   ├── images
│   ├── audio
│   └── icons
│
├── css/
│   └── style.css
│
├── js/
│   ├── script.js
│   └── texts.js
│
└── index.html


⸻

🚀 How It Works

1. Name Validation

The app checks if the user enters the correct name:
	•	Empty → error message
	•	Wrong → error message
	•	Partial → hint message
	•	Correct → proceeds

Validation is order-aware and prevents word skipping.

⸻

2. Screen System

Screens are swapped by toggling visibility:

showScreen("screen-id")

All screens follow the naming pattern:

[id$="-screen"]


⸻

3. Confetti Engine

Uses canvas-confetti with a custom canvas instance:

Effects included:
	•	Explosion pop
	•	Side spray
	•	Continuous falling particles

All share the same canvas for performance.

⸻

4. Hearts Background

Hearts are generated dynamically and drift down randomly.

Key design goals:
	•	sparse
	•	slow
	•	romantic
	•	non-patterned

The interval uses randomized timing so it looks natural.

⸻

5. Music Controller

Audio is handled via HTMLAudioElements and helper functions:

playSound(id)
stopSound(id)
loopSound(id)

Includes an animated Now Playing indicator.

⸻

🛠 Technologies Used
	•	HTML5
	•	TailwindCSS (CDN)
	•	Vanilla JavaScript (ES Modules)
	•	Canvas Confetti

No frameworks required.

⸻

🎨 Design Philosophy

This project focuses on:
	•	Delightful micro-interactions
	•	Emotional feedback
	•	Playful UX
	•	Lightweight performance
	•	Mobile-first feel

Every interaction should feel rewarding.

⸻

🧪 Debugging Tips

If effects don’t appear:

Issue	Fix
Confetti not showing	Ensure canvas appended to body
Audio won’t play	Must be triggered by user interaction
Buttons not moving	Check bounding container exists
Animations stuck	Verify CSS classes present


⸻

🔮 Possible Improvements

Ideas for future upgrades:
	•	Love letter screen
	•	Typing text animation
	•	Fireworks finale
	•	Heart cursor trail
	•	Theme color switcher
	•	Personalized messages JSON
	•	Multi-language support

⸻

❤️ Credits

Made with love and JavaScript.

⸻

📜 License

Personal / private use project.

Modify freely for your own special someone 💕