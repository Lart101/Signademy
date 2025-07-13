# 🤟 Signademy

**AI-powered sign language learning app with real-time gesture detection**

Signademy is a React Native mobile application that uses advanced AI technology to help users learn sign language through real-time gesture detection and recognition.

## ✨ Features

- 🤖 **Real-time AI Detection** - Uses MediaPipe and custom ASL model for accurate gesture recognition
- 📱 **Cross-platform** - Built with React Native and Expo for iOS and Android
- 🎨 **Beautiful UI** - Kid-friendly design with smooth animations
- 📷 **Camera Integration** - Front/back camera switching with optimized capture
- 🔄 **Live Feedback** - Instant gesture recognition with confidence scores
- ♿ **Accessible** - Designed for all ages and abilities
- 🚀 **Performance Optimized** - Throttled processing for smooth experience

## 🛠️ Technical Stack

- **Frontend**: React Native 0.79.5
- **Framework**: Expo SDK 53
- **Camera**: expo-camera 16.1.10
- **AI/ML**: MediaPipe Tasks Vision 0.10.3
- **WebView**: react-native-webview 13.13.5
- **Model Storage**: Supabase
- **Architecture**: Modular component-based structure

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

1. **Launch the app** - Beautiful splash screen with Signademy branding
2. **Grant camera permission** - Required for gesture detection
3. **Enable camera** - Use the camera toggle button
4. **Start signing** - Make ASL gestures in front of the camera
5. **View results** - Real-time detection with confidence scores
6. **Switch camera** - Use flip button to change between front/back camera

## 🤖 AI Model

Signademy uses a custom-trained ASL (American Sign Language) model:

- **Training Data**: 14,000+ ASL gesture images
- **Model Format**: MediaPipe Task format (.task)
- **Hosting**: Supabase cloud storage
- **Recognition**: Real-time gesture classification with confidence scores
- **Performance**: Optimized for mobile devices with GPU acceleration

## 🎨 Design Features

- **Splash Screen**: Animated logo with feature highlights
- **Loading States**: Professional loading overlays during AI model initialization
- **Error Handling**: User-friendly error messages with retry functionality
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: High contrast colors and clear typography
- **Smooth Animations**: React Native Animated API for fluid transitions

## 🔧 Configuration

### Camera Settings
- **Quality**: Optimized for performance (0.3 quality)
- **Capture Interval**: 500ms for smooth detection
- **Format**: JPEG with base64 encoding
- **Features**: Front/back switching, permission management

### AI Processing
- **Throttling**: 300ms minimum between AI processing
- **GPU Acceleration**: Enabled for better performance
- **Model Loading**: Automatic retry on failure
- **Results Display**: Confidence threshold filtering

## 📊 Performance

- **Bundle Size**: ~7MB total
- **Startup Time**: ~2-3 seconds
- **AI Model Load**: ~3-5 seconds (network dependent)
- **Frame Processing**: 500ms intervals
- **AI Processing**: 300ms throttled
- **Memory Usage**: Optimized for mobile devices

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

**Signademy Team** - AI-powered education technology

## 🙏 Acknowledgments

- MediaPipe team for the AI/ML framework
- Expo team for the development platform
- React Native community for the mobile framework
- ASL community for gesture recognition insights

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for accessible education**

🤟 **Signademy** - Making sign language learning accessible to everyone through AI technology.
