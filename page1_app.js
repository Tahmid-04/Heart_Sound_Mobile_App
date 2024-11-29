let audioContext;
let microphone;
let scriptProcessor;
let isStreaming = false;

function startStream() {
    if (isStreaming) return;  // If it's already streaming, don't start again
    
    isStreaming = true;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();  // Create an AudioContext

    // Request audio permission from the user
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            microphone = audioContext.createMediaStreamSource(stream);  // Create microphone input stream

            // Create a ScriptProcessorNode to handle real-time audio
            scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);  // Buffer size = 2048 (can adjust based on latency needs)
            scriptProcessor.onaudioprocess = function (event) {
                // Here we can do something with the audio data (like filtering, etc.)
                const inputBuffer = event.inputBuffer.getChannelData(0);  // Get the audio data
                const outputBuffer = event.outputBuffer.getChannelData(0);  // Output to speakers

                // Directly pass the audio from input to output (real-time relaying)
                outputBuffer.set(inputBuffer);
            };

            microphone.connect(scriptProcessor);  // Connect microphone to ScriptProcessor
            scriptProcessor.connect(audioContext.destination);  // Connect ScriptProcessor to speakers/output
            alert("Heart sound relaying started!");  // Alert for start
        })
        .catch(function (error) {
            console.error("Error accessing the microphone: ", error);
        });
}

function stopStream() {
    if (!isStreaming) return;  // If it's not streaming, nothing to stop
    
    isStreaming = false;
    
    // Disconnect the microphone and script processor to stop the stream
    if (microphone && scriptProcessor) {
        microphone.disconnect();
        scriptProcessor.disconnect();
    }

    alert("Heart sound relaying stopped!");  // Alert for stop
}

// Adding event listeners to buttons
document.getElementById('startBtn').addEventListener('click', startStream);
document.getElementById('stopBtn').addEventListener('click', stopStream);
