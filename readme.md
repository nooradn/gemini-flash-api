# Gemini Flash API

Simple Express.js API wrapper for Google's Gemini 2.5 Flash model.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add your Gemini API key
3. Start server: `node index.js`

Default port: 3000

## Endpoints

### Generate Text
`POST /generate-text`

```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a poem about coding"}'
```

### Generate from Image
`POST /generate-from-image`

```bash
curl -X POST http://localhost:3000/generate-from-image \
  -F "image=@path/to/image.jpg" \
  -F "prompt=Describe this image"
```

### Generate from Document
`POST /generate-from-document`

```bash
curl -X POST http://localhost:3000/generate-from-document \
  -F "document=@path/to/document.pdf" \
  -F "prompt=Summarize this document"
```

### Generate from Audio
`POST /generate-from-audio`

```bash
curl -X POST http://localhost:3000/generate-from-audio \
  -F "audio=@path/to/audio.mp3" \
  -F "prompt=Transcribe this audio"
```

## Response Format

All endpoints return JSON:
```json
{
  "text": "Generated response from Gemini"
}
```

Error responses:
```json
{
  "error": "Error message"
}
```