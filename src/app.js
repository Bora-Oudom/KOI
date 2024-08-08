import './firebaseConfig';

$(document).ready(function () {
    const waterElement = $('#water');
    const contentSection = $('#content-section');
    const winSection = $('#win-section');
    let audioContext;
    const WIN_HEIGHT = 99;
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

            // Set up gain node with a lower gain value
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.15;

            source.connect(gainNode);
            gainNode.connect(analyser);

            // Setup analyser
            analyser.fftSize = 256; // Size of the FFT (frequency domain) analysis
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            // Function to visualize the audio input
            function visualizeAudio() {
                analyser.getByteFrequencyData(dataArray);

                // Find the maximum volume from the data array
                let maxVolume = Math.max(...dataArray);


                const height = (maxVolume / 256) * 100 ;

                waterElement.css('height', height  + 'vh');

                // Check if the wave has reached the top of the screen
                if (height >= WIN_HEIGHT) {
                    // Set wave height to viewport height
                    waterElement.css('height', '100vh');

                    contentSection.addClass('hide').removeClass('show');
                    setTimeout(function() {
                        contentSection.css('display', 'none');
                        winSection.css('display', 'block');
                        setTimeout(function() {
                            winSection.addClass('show').removeClass('hide');
                            $('body').css('background', '#646464')
                        }, 20);
                    }, 500);

                    // Show Winning message
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
