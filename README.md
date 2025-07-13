# 🤟 Signademy

**Sign language gesture detection app using Google MediaPipe**

Signademy is a React Native mobile application that uses Google's MediaPipe framework## 🔧 Building APK

### Using GitHub Actions (Manual Only)

1. **Fork this repository**
2. **Set up Expo secrets** in GitHub repository settings:
   - Go to Settings → Secrets and Variables → Actions
   - Add these secrets:
     - `EXPO_USERNAME`: Your Expo account username
     - `EXPO_PASSWORD`: Your Expo account password  
     - `EXPO_TOKEN`: Your Expo access token (from expo.dev)

3. **Trigger build manually**:
   - Go to Actions tab → "Manual APK Release" → "Run workflow"
   - Click "Run workflow" button

4. **Download APK** from the Releases page after build completesnguage gestures through frame-by-frame camera capture.

## ✨ Features

- 📷 **Frame-by-Frame Detection** - Captures camera frames every 500ms for gesture analysis
- 📱 **Cross-platform** - Built with React Native and Expo for iOS and Android
- 🎨 **Simple UI** - Clean interface with camera controls
- 📷 **Camera Integration** - Front/back camera switching
- 🔄 **Basic Feedback** - Shows detected gestures with confidence scores
- ♿ **Accessible** - Designed for ease of use

## � Download APK

### Option 1: Download from Releases
1. Go to [Releases](https://github.com/Lart101/Signademy/releases)
2. Download the latest `signademy.apk` file
3. Install on your Android device

### Option 2: Build Your Own APK

#### Prerequisites for Building
- Node.js (18 or higher)
- Expo account (free at expo.dev)
- EAS CLI

#### Local APK Build
```bash
# Clone the repository
git clone https://github.com/Lart101/Signademy.git
cd Signademy

# Install dependencies
npm install

# Install Expo CLI and EAS CLI
npm install -g @expo/cli eas-cli

# Login to Expo (create account at expo.dev if needed)
npx expo login

# Build APK locally
npx eas build --platform android --profile preview --local
```

#### GitHub Actions Build
The repository includes manual APK builds via GitHub Actions:

1. **Manual builds** can be triggered from the Actions tab
2. Go to Actions → "Manual APK Release" → "Run workflow"
3. APK will be available in Releases after build completes

## �🛠️ Technical Stack

- **Frontend**: React Native 0.79.5
- **Framework**: Expo SDK 53
- **Camera**: expo-camera 16.1.10
- **AI/ML**: Google MediaPipe Tasks Vision 0.10.3
- **WebView**: react-native-webview 13.13.5
- **Model Storage**: Supabase (hosting the gesture model)
- **Build System**: EAS Build (Expo Application Services)

## 📁 Project Structure

```
Signademy/
├── .github/workflows/       # GitHub Actions for manual APK builds
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
├── eas.json                # EAS Build configuration
├── App.js                  # Main application component
├── package.json            # Dependencies and scripts
└── app.json               # Expo configuration
```

## 🚀 Getting Started

### For Development

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

### For Testing (APK)

1. **Download APK** from [Releases](https://github.com/Lart101/Signademy/releases)
2. **Enable unknown sources** in Android settings
3. **Install the APK** on your Android device
4. **Grant camera permission** when prompted

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

## � Building APK

### Using GitHub Actions (Recommended)

1. **Fork this repository**
2. **Set up Expo secrets** in GitHub repository settings:
   - Go to Settings → Secrets and Variables → Actions
   - Add these secrets:
     - `EXPO_USERNAME`: Your Expo account username
     - `EXPO_PASSWORD`: Your Expo account password  
     - `EXPO_TOKEN`: Your Expo access token (from expo.dev)

3. **Trigger build**:
   - Push to main branch (automatic)
   - Create a new release tag: `git tag v1.0.0 && git push origin v1.0.0`
   - Manually trigger from Actions tab

4. **Download APK** from the Actions artifacts or Releases

### Local Build Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS project (if needed)
eas build:configure

# Build APK locally
eas build --platform android --profile preview --local
```

## �📊 Limitations

- **Not Real-time**: Detection happens on captured frames, not live video stream
- **Processing Delay**: 500ms intervals between captures for performance
- **Model Dependency**: Requires internet connection to download MediaPipe model
- **Basic Gestures**: Limited to gestures supported by Google's pre-trained model
- **Android Only**: APK builds are for Android devices only

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
