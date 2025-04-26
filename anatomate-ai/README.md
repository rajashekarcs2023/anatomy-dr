# AnatoMate.ai

AnatoMate.ai is a modern healthcare web application that helps patients and doctors understand complex medical conditions through plain English explanations and 3D anatomical visualizations.

## Features

- **Dual Mode Interface**: Toggle between Patient mode and Doctor mode
- **Multiple Input Methods**: Text input, file upload, and voice recording
- **Plain English Explanations**: Medical jargon translated into simple language
- **3D Anatomical Visualization**: Interactive 3D models of the human body
- **Accessibility Features**: Text-to-speech and downloadable explanations

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Integration Points

### AI Integration

The application is designed to integrate with Gemini 2.5 for processing medical text. The integration point is in `lib/process-input.ts`.

To implement the AI integration:
1. Replace the mock processing function with actual Gemini API calls
2. Add proper error handling and rate limiting
3. Implement context-aware responses based on the selected mode (Patient/Doctor)

### 3D Model Integration

The 3D visualization is currently using a placeholder model. To implement full anatomical models:

1. Replace the placeholder in `components/human-model.tsx` with detailed anatomical models
2. Add logic to highlight specific body parts based on the input
3. Implement animations for medical procedures if needed

### Speech-to-Text Integration

For the voice recording feature:
1. Implement actual recording using the MediaRecorder API
2. Integrate with a speech-to-text service (e.g., Deepgram or Gemini)
3. Process the transcribed text through the AI pipeline

## Input Format Support

- **Text**: Free-form text input for symptoms or diagnoses
- **Files**: PDF, DOCX, and TXT files (doctor's notes, medical reports)
- **Audio**: MP3 and WAV files (voice recordings of symptoms or diagnoses)

## Future Enhancements

- Multilingual support
- More detailed 3D models and animations
- Integration with electronic health records
- Mobile app version
