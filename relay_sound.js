const record = require('node-record-lpcm16');
const speaker = require('speaker');

// Create a Speaker instance to output audio to the speakers
const audioOutput = new speaker.Speaker({
  channels: 1,          // Mono sound
  bitDepth: 16,         // 16-bit depth
  sampleRate: 16000     // Sample rate (matches node-record-lpcm16's default)
});

let isStreaming = false;

// Function to start the audio stream
function startStream() {
  if (isStreaming) {
    console.log("Audio stream is already running.");
    return;
  }

  console.log("Starting audio stream...");
  isStreaming = true;

  // Record audio from the microphone and pipe it directly to the speakers
  record
    .start({
      sampleRateHertz: 16000,  // Ensure the sample rate matches
      threshold: 0,            // No threshold to stop recording
      silence: 1000            // 1 second of silence will stop recording
    })
    .pipe(audioOutput); // Pipe audio input directly to the speakers

  console.log("Audio streaming started. Press Ctrl+C to stop.");
}

// Function to stop the audio stream
function stopStream() {
  if (!isStreaming) {
    console.log("Audio stream is not running.");
    return;
  }

  console.log("Stopping audio stream...");
  isStreaming = false;

  record.stop(); // Stop the audio recording
  audioOutput.end(); // Close the audio output stream
  console.log("Audio stream stopped.");
}

// Listen for termination signals (Ctrl+C)
process.on('SIGINT', () => {
  stopStream();
  process.exit();
});

// Start the audio stream
startStream();
