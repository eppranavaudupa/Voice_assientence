console.log("hey I am developer");

const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
    apiKey: "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"
});

const audioFun = async () => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream("sample2.mp3"),
            model: "whisper-1"
        });
        console.log(transcription);
    } catch (error) {
        console.error("Error during transcription:", error);
    }
};

audioFun();
