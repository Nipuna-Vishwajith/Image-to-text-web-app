const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const app = express();
const upload = multer({ dest: 'uploads/' });

const MODEL_NAME = "gemini-pro-vision";
const API_KEY = "AIzaSyAOX22sD2qFz6QxEJqnilyPrOyYRidmDWg";

app.use(express.static('public'));

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    if (!req.file) {
      throw new Error("No image file uploaded.");
    }

    const parts = [
      { text: "write a paragraph about the image" },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: fs.readFileSync(req.file.path).toString("base64"),
        },
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    console.log(response.text());

    res.send(response.text());
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during image upload and generation.');
  } finally {
    // Delete the uploaded image file after processing
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});