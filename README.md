
# YouTubeClone-NullClass

## Introduction
This project involved enhancing a YouTube-inspired web application with three primary features: a points allocation system for watching videos, a custom video player with gesture-based controls, and a VoIP feature for video calls and screen sharing. The objective was to create an engaging and interactive user experience while maintaining functionality and ease of use.

## Features
### 1. Points System
- Allocate 5 points for each video watched.
- Points are displayed in the user profile section.

### 2. Custom Video Player
- Double Tap on Right Side: Playback moves 10 seconds forward.
- Double Tap on Left Side: Playback moves 10 seconds backward.
- Single Tap in Middle: Pause the video.
- Three Taps in Middle: Move to next video.
- Three Taps on Right Side: Close the website.
- Three Taps on Left Side: Show the comment section.
- Single Tap on Top Right Corner: Display current location and temperature.
- Hold Right Side: Play video at 2X speed.
- Hold Left Side: Play video at 0.5X speed.

### 3. VoIP Feature
- Video calling with screen sharing and recording capabilities.
- Calls are enabled only from 6 PM to 12 AM.

## Setup Instructions
### Frontend
The frontend is hosted on Vercel: [YouTube Clone Frontend](https://you-tube-clone-frontend-xi.vercel.app/)
   
### Backend
The backend is hosted on Render: [YouTube Clone Backend](https://youtubeclone-nullclass.onrender.com/)

**Note:** If the frontend does not load correctly, please reload the Render site as it may be required due to free tier limitations.

### Local Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/AthulTM/YouTubeClone-NullClass.git
   cd YouTubeClone-NullClass
   ```

2. Install dependencies:
   - Frontend:
     ```sh
     cd client
     npm install
     npm start
     ```
   - Backend:
     ```sh
     cd server
     npm install
     npm start
     ```

## Internship Report
The detailed internship report is available [here](./report.docx).

## Challenges and Solutions
### Challenge 1: Implementing Gesture Controls
**Solution:** Implemented gesture controls by adding reference to the video element and handling taps with conditional statements.

### Challenge 2: VoIP Feature
**Solution:** Used React Media Recorder for recording and ensured that both video and audio streams were recorded.

### Challenge 3: Implementing Video Stream on Vercel
**Solution:** Used UseEffect hooks to ensure correct stream rendering on load.

### Challenge 4: Hosting and Deployment
**Solution:** Deployed backend on Render and frontend on Vercel due to static file serving issues with Vercel.

## Skills and Competencies
- Proficiency in React.
- Experience with video player libraries and custom gesture controls.
- Knowledge of WebRTC for VoIP features.
- Understanding of hosting web applications on platforms like Netlify or Vercel.

## Feedback and Evidence
Users appreciated the intuitive gesture controls and the seamless integration of the video call feature. Feedback was collected through user testing sessions.

## Conclusion
The project achieved its objectives of enhancing user engagement and functionality. The points system, custom video player, and VoIP feature significantly improved the user experience.
