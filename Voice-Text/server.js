const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const say = require("say");

const app = express();
app.use(cors());
const port = 3000;

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the HTML file
app.get("/home", function(req, res)  {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI("AIzaSyCUmVIg0PhklgS98HjvaN6LD-YsIjCdRY4");

app.post("/test", async (req, res) => {
    const receivedData = req.body.text;
    console.log('Received data:', receivedData);

    try {
        // Create the prompt using the received data
        const prompt = receivedData;

        // Generate content using the Google Generative AI API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        console.log('AI Response:', text);

        // Write the AI response to a file
        fs.writeFile('output.txt', text, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).json({ message: 'Error writing to file', error: err.message });
                return;
            }
            console.log('The file has been saved!');

            // Use the say module to convert the text to speech
            say.speak(text, 'Alex', 1.0, (err) => {
                if (err) {
                    console.error('Error speaking text:', err);
                    res.status(500).json({ message: 'Error speaking text', error: err.message });
                    return;
                }
                console.log('Text has been spoken!');
                // Send the AI response back to the client
                res.json({ message: 'Data received and processed successfully', aiResponse: text });
            });
        });
    } catch (error) {
        console.error('Error processing AI request:', error);
        res.status(500).json({ message: 'Error processing AI request', error: error.message });
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
