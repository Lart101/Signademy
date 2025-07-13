# Sound Effects for Signademy

## Directory Structure

Place your sound files in the following structure:

```
assets/sounds/
├── feedback/
│   ├── correct.mp3          # Played when correct sign is detected
│   ├── incorrect.mp3        # Played when incorrect sign is detected  
│   ├── success.mp3          # Played when advancing to next letter
│   └── completion.mp3       # Played when all letters are completed
├── ui/
│   ├── button_press.mp3     # General button interactions
│   ├── button_hover.mp3     # Button hover/focus effects
│   ├── page_swipe.mp3       # Navigation between screens
│   ├── camera_toggle.mp3    # Camera enable/disable
│   └── countdown.mp3        # Countdown timer effects
└── ambient/
    └── learning_ambient.mp3 # Optional background ambient sound
```

## Recommended Sound Types

**Feedback Sounds:**
- **correct.mp3**: Pleasant chime, bell, or positive tone (0.5-1s)
- **incorrect.mp3**: Gentle buzz or neutral tone (0.3-0.5s)
- **success.mp3**: Uplifting sound for level advancement (1-2s)
- **completion.mp3**: Celebratory fanfare for full completion (2-3s)

**UI Sounds:**
- **button_press.mp3**: Short click or tap sound (0.1-0.2s)
- **button_hover.mp3**: Subtle hover effect (0.1s)
- **page_swipe.mp3**: Whoosh or swipe sound (0.3-0.5s)
- **camera_toggle.mp3**: Camera shutter or click (0.2-0.3s)
- **countdown.mp3**: Tick or beep sound (0.2s)

**Ambient:**
- **learning_ambient.mp3**: Soft, non-distracting background (loopable)

## Audio Format Recommendations

- **Format**: MP3 (best compatibility) or M4A
- **Quality**: 44.1kHz, 128-192 kbps (good balance of quality/size)
- **Volume**: Normalize all sounds to consistent levels
- **Duration**: Keep UI sounds short (under 1s), feedback sounds 1-2s max

## Where to Find Sounds

1. **Free Resources:**
   - Freesound.org
   - Zapsplat.com
   - Pixabay Audio
   - YouTube Audio Library

2. **Paid Resources:**
   - AudioJungle
   - Pond5
   - Epidemic Sound

## Integration

The sounds are automatically integrated into your app through the `useSoundEffects` hook. The system includes:

- Automatic audio configuration for mobile
- Volume control
- Enable/disable functionality
- Error handling and fallbacks
- Memory management (automatic cleanup)
