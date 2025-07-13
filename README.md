# 🤟 Signademy

**Sign language gesture detection app using Google MediaPipe**

Signademy is a React Native mobile application that uses Google's MediaPipe framework to detect sign language gestures through frame-by-frame camera capture.

## ✨ Features

- 📷 **Frame-by-Frame Detection** - Captures camera frames every 500ms for gesture analysis
- 📱 **Cross-platform** - Built with React Native and Expo for iOS and Android
- 🎨 **Simple UI** - Clean interface with camera controls
- 📷 **Camera Integration** - Front/back camera switching
- 🔄 **Basic Feedback** - Shows detected gestures with confidence scores
- ♿ **Accessible** - Designed for ease of use

## 🛠️ Technical Stack

- **Frontend**: React Native 0.79.5
- **Framework**: Expo SDK 53
- **Camera**: expo-camera 16.1.10
- **AI/ML**: Google MediaPipe Tasks Vision 0.10.3
- **WebView**: react-native-webview 13.13.5
- **Model Storage**: Supabase (hosting the gesture model)
- **Architecture**: Component-based structure

## 📁 Project Structure

```
Signademy/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SplashScreen.js  # Animated splash screen
│   │   ├── LoadingOverlay.js # Loading and error states
│   │   ├── CameraView.js    # Camera component
│   │   ├── DetectionWebView.js # MediaPipe WebView
│   │   └── CameraControls.js # Camera control buttons
│   ├── hooks/               # Custom React hooks
│   │   ├── useCameraHooks.js # Camera permissions & capture
│   │   └── useModelState.js # AI model state management
│   ├── styles/              # Centralized styling
│   │   └── MainStyles.js    # All StyleSheet objects
│   └── webview/             # WebView content
│       └── MediaPipeHTML.js # HTML for MediaPipe integration
├── assets/                  # App icons and images
├── App.js                  # Main application component
├── package.json            # Dependencies and scripts
└── app.json               # Expo configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lart101/Signademy.git
   cd Signademy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/emulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## 📱 Usage

1. **Launch the app** - Splash screen loads the application
2. **Grant camera permission** - Required for gesture detection
3. **Enable camera** - Use the camera toggle button
4. **Start signing** - Make gestures in front of the camera
5. **View results** - Detection happens every 500ms with confidence scores shown
6. **Switch camera** - Use flip button to change between front/back camera

## 🤖 How It Works

Signademy uses Google's MediaPipe Gesture Recognition framework:

- **Model**: Pre-trained gesture recognition model from Google MediaPipe
- **Documentation**: Based on https://ai.google.dev/edge/mediapipe/solutions/customization/gesture_recognizer
- **Detection Method**: Frame-by-frame capture (not real-time streaming)
- **Capture Interval**: Takes a photo every 500ms for analysis
- **Processing**: Each frame is sent to MediaPipe for gesture detection
- **Results**: Displays detected gestures with confidence percentages

**Note**: This is not real-time detection - the app captures frames at intervals for processing.

## 🎨 App Features

- **Splash Screen**: Loading screen while app initializes
- **Camera Controls**: Simple buttons to toggle camera on/off and flip between front/back
- **Frame Capture**: Automatic photo capture every 500ms when camera is active
- **Detection Display**: Shows gesture recognition results in a web view
- **Error Handling**: Basic error messages for camera/model issues

## 🔧 Technical Details

### Camera Settings
- **Capture Quality**: 0.3 (optimized for processing speed)
- **Capture Interval**: 500ms between frames
- **Format**: JPEG with base64 encoding
- **Features**: Front/back switching, permission handling

### Detection Processing
- **Method**: Frame-by-frame analysis (not real-time streaming)
- **Interval**: New detection every 500ms minimum
- **Model**: Google MediaPipe gesture recognition
- **Results**: Confidence scores and gesture names displayed

## 📊 Limitations

- **Not Real-time**: Detection happens on captured frames, not live video stream
- **Processing Delay**: 500ms intervals between captures for performance
- **Model Dependency**: Requires internet connection to download MediaPipe model
- **Basic Gestures**: Limited to gestures supported by Google's pre-trained model

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Signademy Development Team**

## 🙏 Acknowledgments

- Google MediaPipe team for the gesture recognition framework
- Expo team for the React Native development platform
- React Native community for the mobile framework

## 📞 Support

For support, please open an issue on GitHub.

---

**Simple gesture detection using Google MediaPipe**

🤟 **Signademy** - Frame-by-frame sign language gesture detection.
