$(document).ready(function () {
    const waveElement = $('#wave');
    const WIN_HEIGHT = 95;
    let audioContext;
    let analyser;
    let source;
    let dataArray;

    $('#start-button').click(async function () {
        $(this).hide();
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Initialize audio context and components
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Setup analyser
            analyser.fftSize = 256; // Size of the FFT (frequency domain) analysis
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            // Function to visualize the audio input
            function visualizeAudio() {
                analyser.getByteFrequencyData(dataArray);

                // Find the maximum volume from the data array
                const maxVolume = Math.max(...dataArray);

                const height = (maxVolume / 256) * 100; // Adjust based on viewport height
                waveElement.css('height', height + 'vh');

                // Check if the wave has reached the top of the screen
                if (height >= WIN_HEIGHT) {
                    // Set wave height to viewport height
                    waveElement.css('height', '100vh');
                    $('.win-message').show();

                    // Stop further processing
                    return;
                }

                requestAnimationFrame(visualizeAudio);
            }

            visualizeAudio();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    });
});
