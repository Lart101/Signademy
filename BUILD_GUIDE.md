# 🏗️ Building Signademy APK

## GitHub Actions Workflow

Your repository is now configured with an automated APK build system using GitHub Actions.

### 🚀 How to Build an APK

1. **Go to your GitHub repository**
2. **Navigate to Actions tab**
3. **Click on "Build Signademy APK Release"**
4. **Click "Run workflow"**
5. **Optionally add release notes**
6. **Click "Run workflow" button**

### 📋 Prerequisites

Before running the workflow, make sure you have these GitHub Secrets configured:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `EXPO_USERNAME`: Your Expo account username
   - `EXPO_PASSWORD`: Your Expo account password

### 🔧 Workflow Features

- ✅ **Automated APK building** with EAS Build
- ✅ **Automatic release creation** with detailed descriptions
- ✅ **Build verification** and file size reporting
- ✅ **Error handling** and debugging support
- ✅ **Professional release notes** with feature descriptions
- ✅ **Build metadata** (build number, commit, timestamp)

### 📦 What Gets Built

- **APK File**: `signademy-v1.0.0.apk`
- **Release Tag**: `v1.0.0-build-{number}`
- **Release Assets**: APK file attached for download

### 🎯 Release Features Included

- Complete A-Z Letters Learning system
- Numbers (0-9) Learning module
- AI-powered gesture recognition (91%+ accuracy)
- Sound effects system with feedback
- Progress tracking and celebrations
- Optimized mobile UI
- 36 instructional videos

### 🛠️ Manual Local Build (Alternative)

If you want to build locally:

```bash
# Install dependencies
npm install

# Install EAS CLI
npm install -g @expo/cli eas-cli

# Login to Expo
npx expo login

# Build APK
npx eas build --platform android --profile preview --local
```

### 📱 Testing the APK

1. Download the APK from the GitHub release
2. Enable "Install from unknown sources" on Android
3. Install the APK
4. Grant camera permissions
5. Start learning!

### 🐛 Troubleshooting

**Build Fails?**
- Check that Expo credentials are correct
- Verify `eas.json` configuration
- Check workflow logs for specific errors

**APK Won't Install?**
- Enable unknown sources in Android settings
- Check Android version (requires 7.0+)
- Clear storage if previous version exists

**Need Help?**
- Check the Actions tab for build logs
- Review the workflow file for configuration
- Test locally first with `npx eas build --profile preview --local`

---

🎉 **Ready to build your Signademy APK!** Just go to Actions → Build Signademy APK Release → Run workflow!
