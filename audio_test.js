const record = require('node-record-lpcm16');
const fs = require('fs');

// Create a writeable stream to save the audio data
const file = fs.createWriteStream('output.wav', { encoding: 'binary' });

// Start recording audio from the default microphone
console.log("Recording started. Press Ctrl+C to stop.");

const recording = record
  .start({
    sampleRateHertz: 16000,
    threshold: 0,
    silence: 1000,
  })
  .pipe(file); // Pipe the recording to a file

// Stop the recording after 10 seconds (for testing purposes)
setTimeout(() => {
  record.stop();
  console.log("Recording stopped.");
}, 10000); // Stop after 10 seconds
