let audioContext;
let recorder;
let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

function startRecording() {
    audioChunks = [];  // Clear any previous audio chunks
    
    // Request permission for microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Create an audio context
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create a MediaRecorder to capture audio
            mediaRecorder = new MediaRecorder(stream);
            
            // Capture audio chunks as the recording happens
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            // When recording is stopped, create a Blob and trigger file download
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Prompt user to enter a filename (if empty, default to "heart_sound_recording.wav")
                const filename = prompt("Enter the filename for your recording:", "heart_sound_recording.wav");
                const safeFilename = filename && filename.trim() !== "" ? filename : "heart_sound_recording.wav";

                // Create a temporary download link and click it to download the file
                const a = document.createElement('a');
                a.href = audioUrl;
                a.download = safeFilename;
                a.click();
            };
            
            // Start recording
            mediaRecorder.start();
            
            // Disable the start button and enable the stop button
            startBtn.disabled = true;
            stopBtn.disabled = false;
            
            alert("Recording started!");
        })
        .catch(error => {
            console.error("Error accessing the microphone: ", error);
            alert("Failed to start recording. Please ensure the microphone is available.");
        });
}

function stopRecording() {
    // Stop the recording
    mediaRecorder.stop();

    // Disable the stop button and enable the start button for a new recording
    stopBtn.disabled = true;
    startBtn.disabled = false;
    
    alert("Recording stopped. Please enter a filename to save your recording.");
}
