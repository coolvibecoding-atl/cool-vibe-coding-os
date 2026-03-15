# Audio Mixing - Bot Training & ML

## Lesson 3: Building an AI Mixing Bot

---

## 5. Bot Training Instructions

### Rule-Based Reasoning

**INPUT:** multi-track WAV

**PROCESS:**
1. Analyze frequency spectrum
2. Detect instrument type
3. Apply subtractive EQ
4. Balance levels
5. Compress dynamic instruments
6. Place instruments in stereo field
7. Add reverb based on depth rules
8. Apply bus compression
9. Normalize loudness to -14 LUFS

---

## 6. Mixing Decision Tree

```
IF vocal present
   center vocal
   compress 3:1
   boost 5kHz

IF kick and bass overlap
   sidechain bass

IF mix sounds muddy
   reduce 200–400Hz
```

---

## 7. File Types

### WAV
- Best quality
- 24bit / 48kHz recommended

### MP3
- Lossy compression
- Bot rule: avoid heavy EQ boosting

### MP4
- Extract audio track first
- Command: `mp4 → wav`

---

## 8. Machine Learning Features

### Extract for Learning
- Spectrogram
- MFCC (mel-frequency cepstral coefficients)
- Tempo
- Loudness
- Transients
- Instrument classification

### Model Types

| Model | Purpose |
|-------|---------|
| CNN | Spectral analysis |
| Transformer | Mix decision |
| Reinforcement Learning | Optimize mix quality |

---

## 9. Evaluation Metrics

The bot must evaluate mix quality:

| Metric | Description |
|--------|-------------|
| LUFS | Loudness |
| Spectral balance | Frequency distribution |
| Dynamic range | Loud to soft ratio |
| Stereo width | L/R spread |
| Masking index | Frequency masking |

**Important:** Human reference mixes are essential.

---

## 10. Reference Mix Learning

### Dataset Structure

| Field | Description |
|-------|-------------|
| Song | Track name |
| Raw Stems | Input files |
| Reference Mix | Target output |
| Engineer | Who mixed it |
| Processing chain | Steps used |

**Goal:** Learn raw stems → professional mix

---

## 11. Simple Mixing Example

### Input Tracks
- Kick.wav
- Snare.wav
- Bass.wav
- Guitar.wav
- Vocal.wav

### Bot Output

| Track | Level | Pan |
|-------|-------|-----|
| Kick | -6dB | center |
| Snare | -5dB | center |
| Bass | -8dB | center |
| Guitar | -12dB | left/right |
| Vocal | -3dB | center |

### Effects
- Reverb bus
- Drum compression bus
- Master limiter

---

## 💡 Key Insight

**Top engineers don't follow fixed rules.**

They optimize:
- **Emotion**
- **Clarity**
- **Impact**
- **Translation across speakers**

**Bot should learn patterns, not rigid formulas.**

---

*Source: Dot Com - Quality Control Music*
*Lesson 3: March 6, 2026*
