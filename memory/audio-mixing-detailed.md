# Audio Mixing Knowledge - Detailed

## What is Audio Mixing?

The process of taking multiple recorded tracks and balancing, shaping, and positioning them so they sound like one cohesive piece of audio.

### Inputs
- WAV stems
- MP3 references
- MP4 video with audio
- Multitrack recordings

### Outputs
- Stereo WAV master
- Broadcast mix
- Streaming-ready mix

---

## Core Mixing Tasks

### 1. Level Balancing
Setting volume of each track - vocal louder than guitar

### 2. EQ (Equalization)
Adjust frequencies - remove muddy 200Hz from kick

### 3. Compression
Control dynamic range - smooth vocal peaks

### 4. Panning
Place sounds left/right - hi-hats slightly right

### 5. Reverb/Delay
Create space/depth - vocal hall reverb

### 6. Automation
Change parameters over time - chorus louder

### 7. Bus Processing
Process groups of tracks - drum bus compression

### 8. Stereo Imaging
Width and placement - wider synth pads

### 9. Saturation
Add harmonic character - analog warmth

### 10. Final Balance
Make mix translate to speakers - car test

---

## Goal
**Clarity + Emotional Impact + Balance + Translation across speakers**

---

## Processing Chain

```
Raw Audio
   ↓
Noise Removal
   ↓
EQ (subtractive first)
   ↓
Compression
   ↓
Saturation / Color
   ↓
Spatial Effects (reverb/delay)
   ↓
Stereo Placement
   ↓
Automation
   ↓
Bus Processing
   ↓
Limiter / Master Bus
```

---

## Lead Vocal Chain Example

1. Remove noise
2. High-pass at 80Hz
3. Compress (3:1 ratio)
4. De-esser at 6kHz
5. Add plate reverb
6. Automate chorus +2dB

---

## Audio Features to Detect

### Frequency (20Hz – 20kHz)

| Instrument | Main Frequencies |
|-----------|-----------------|
| Kick | 40–100Hz |
| Bass | 60–250Hz |
| Snare | 150–250Hz |
| Vocal | 200Hz–5kHz |
| Hi-hat | 6kHz–12kHz |

### Key Rule
```
if kick and bass overlap <120Hz
   sidechain compress bass
```

### Dynamic Range
- RMS
- LUFS
- Peak
- Crest factor

### Stereo Field
- Left / Center / Right
- Width
- Phase

### Standard Panning
- vocals = center
- kick = center
- snare = center
- guitars = ±40
- pads = ±70

---

*Source: Dot Com - Quality Control Music*
*Date: March 6, 2026*
