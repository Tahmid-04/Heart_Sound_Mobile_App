let isRecording = false;
let audioContext;
let microphone;
let analyser;
let dataArray;
let bufferLength;
let audioChunks = [];
let time = 0;
let interval;

// Create the chart
function createChart() {
  const ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 512 }, (_, i) => i),
      datasets: [{
        label: 'Heart Sound',
        data: Array(512).fill(0),
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          ticks: {
            stepSize: 1,
            beginAtZero: true
          }
        },
        y: {
          suggestedMin: -30000,
          suggestedMax: 30000
        }
      }
    }
  });
}

// Start recording
document.getElementById('startBtn').addEventListener('click', function() {
  if (isRecording) return;

  alert("Phonocardiograph recording started!");
  isRecording = true;

  // Initialize the audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Request access to the microphone
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      // Create a media stream source from the microphone input
      microphone = audioContext.createMediaStreamSource(stream);

      // Create an analyser node to process the audio
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Float32Array(bufferLength);

      // Connect the microphone input to the analyser node
      microphone.connect(analyser);

      // Start the data update loop
      interval = setInterval(updateGraph, 100);  // Update graph every 100ms
    })
    .catch(function(err) {
      alert("Error accessing microphone: " + err);
    });

  // Disable the start button and enable the stop button
  document.getElementById('startBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
});

// Stop recording
document.getElementById('stopBtn').addEventListener('click', function() {
  alert("Phonocardiograph recording stopped!");
  isRecording = false;

  // Stop the data update loop
  clearInterval(interval);

  // Disable the stop button and enable the start button
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('startBtn').disabled = false;

  // Stop the audio context
  audioContext.close();
});

// Update the graph with new audio data
function updateGraph() {
  // Get the raw time-domain data from the analyser
  analyser.getFloatTimeDomainData(dataArray);

  // Update the graph data with the new time-domain data
  chart.data.datasets[0].data = Array.from(dataArray); // Convert Float32Array to normal array

  // Update the chart to reflect new data
  chart.update();
}

// Create the chart when the page loads
createChart();
