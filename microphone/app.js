const Mic = require('node-microphone');
const fs = require('fs');
const SpeechToText = require('speech-to-text'); // Ensure this is the correct package name

// Function to transcribe audio file
async function transcribeAudio(fileName) {
  try {
    const file = fs.readFileSync(fileName);
    const audioBuffer = Buffer.from(file);

    const speech = new SpeechToText({
      lang: 'en-US' // Adjust the language code if necessary
    });

    const result = await speech.recognize(audioBuffer, {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
    });

    console.log('Transcription:', result);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

// Record audio from microphone
let mic = new Mic();
let myWritableStream = fs.createWriteStream('recorded_audio.wav');
let micStream = mic.startRecording();
micStream.pipe(myWritableStream);

// Stop recording after 20 seconds and transcribe
setTimeout(async () => {
  console.log('Stopped recording');
  mic.stopRecording();

  // Wait for the file to be fully written before attempting to read it
  myWritableStream.on('finish', async () => {
    await transcribeAudio('recorded_audio.wav');
  });
}, 20000);

mic.on('info', (info) => {
  console.log(info);
});

mic.on('error', (error) => {
  console.error(error);
});
