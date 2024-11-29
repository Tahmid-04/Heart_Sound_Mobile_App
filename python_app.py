import streamlit as st
import sounddevice as sd
import numpy as np
import scipy.signal as signal
from scipy.signal import resample
from scipy.io.wavfile import write

# Define parameters for the audio stream
FORMAT = "int16"
CHANNELS = 1
RATE = 44100
CHUNK = 1024

st.session_state["test"] = False


# Function to callback when audio is available
def callback(indata, outdata, frames, time, status):
    if status:
        print(status)
    outdata[:] = indata


# Function to start the audio stream
def start_stream():
    st.session_state["test"] = True
    try:
        with sd.Stream(
            device=(None, None), channels=CHANNELS, samplerate=RATE, callback=callback
        ):
            print("Listening...", st.session_state["test"])
            while st.session_state["test"]:
                pass

    except KeyboardInterrupt:
        print("Interrupted by user")


# Function to stop the audio stream
def stop_stream():
    st.session_state["test"] = False


# Function to record sound for specified duration
def record_sound(duration=15, sample_rate=44100):
    st.write(f"Recording {duration} seconds...")
    audio_data = sd.rec(
        int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype="float64"
    )
    sd.wait()
    st.write("Recording finished.")
    return audio_data.flatten(), sample_rate


# Function to apply bandpass filter between 50-200 Hz
def bandpass_filter(audio_data, sample_rate, low_freq=50, high_freq=200):
    b, a = signal.butter(
        4, [low_freq / (sample_rate / 2), high_freq / (sample_rate / 2)], btype="band"
    )
    filtered_audio = signal.lfilter(b, a, audio_data)
    return filtered_audio


# Define Streamlit app
st.title("StethoSmart: Heart Sound Listener")

with st.container():

    # Add a button to trigger audio recording
    if st.button("Record Sound"):
        # Record sound for 15 seconds
        audio_data, sample_rate = record_sound()

        # Resample audio data to 4000 Hz
        resampled_audio = resample(
            audio_data, int(len(audio_data) * 4000 / sample_rate)
        )

        # Apply bandpass filter
        filtered_audio = bandpass_filter(resampled_audio, 4000)

        # Save the filtered audio to a WAV file
        output_filename = "filtered_heart_sound.wav"
        write(output_filename, 4000, filtered_audio.astype(np.int16))

        st.write(f"Audio has been saved as {output_filename}")


with st.container():

    st.write("Click the below button to hear the raw sound")

    # Create buttons to start and stop the audio stream
    start_button = st.button("Start")
    stop_button = st.button("Stop")

    if start_button:
        if not st.session_state["test"]:
            start_stream()

    if stop_button:
        st.session_state["test"] = False
