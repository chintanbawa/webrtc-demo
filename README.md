
# WebRTC Demo App

This is a full-stack web application built using the (Express.js, React.js, Node.js, WebSocket and WebRTC). In this app, you can do 1-1 video call with your buddy.

## Features

- Create meeting link 
- Copy meeting link and share with your buddy
- Open meeting link in your favorite browser to start meeting
- Join the meeting
- Mute/unMute audio, Enable/disable video, Hang up the meeting

## Prerequisites

- Node.js installed on your machine
- npm or yarn package manager

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/chintanbawa/webrtc-demo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd webrtc-demo
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   yarn
   ```

4. Install frontend dependencies:

   ```bash
   cd frontend
   yarn
   ```

5. Install root project dependencies:

   ```bash
   cd ..
   yarn
   ```      

6. Start the server:

   ```bash
   yarn dev
   ```

7. The application will be accessible at `http://localhost:3000` by default.

## License

This project is licensed under the [MIT License](licence.md).
