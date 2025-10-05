import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

// Helper function to extract text from response
// a.k.a. 'Satpam'
const extractText = (response) => {
  return response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
         response?.candidates?.[0]?.content?.parts?.[0]?.text ||
         response?.response?.text?.() ||
         response?.text?.() ||
         JSON.stringify(response, null, 2);
};

// Endpoint 1: Generate text from prompt
app.post('/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const text = extractText(result);
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 2: Generate from image
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt = 'Describe this image' } = req.body;
    const imageBase64 = req.file.buffer.toString('base64');
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: req.file.mimetype
      }
    };
    
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent([prompt, imagePart]);
    const text = extractText(result);
    
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 3: Generate from document
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  try {
    const { prompt = 'Analyze this document' } = req.body;
    const documentBase64 = req.file.buffer.toString('base64');
    
    const documentPart = {
      inlineData: {
        data: documentBase64,
        mimeType: req.file.mimetype
      }
    };
    
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent([prompt, documentPart]);
    const text = extractText(result);
    
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint 4: Generate from audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  try {
    const { prompt = 'Transcribe or analyze the following audio' } = req.body;
    const audioBase64 = req.file.buffer.toString('base64');
    
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: req.file.mimetype
      }
    };
    
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent([prompt, audioPart]);
    const text = extractText(result);
    
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));