AI Social Media Content Analyzer

About the Project

This project is a small web application that analyzes social media posts and suggests improvements using AI.

The idea came from a common problem:
Sometimes we write captions but we don’t know whether they are engaging, positive, or suitable for a specific audience. So instead of guessing, this tool lets a user upload a post (image or PDF) and get feedback automatically.
The system extracts text from the uploaded file.
If it is a normal PDF then text is read directly
If it is an image or scanned PDF → OCR reads the text
After that, an AI model analyzes the content and suggests a better caption along with insights.
The goal of this project is not just sentiment detection but helping users improve their posts before publishing.

Brief Working (Simple Explanation)
1. User uploads an image or PDF
2. Backend extracts text from the file
3. AI analyzes tone, sentiment and engagement level
4. System suggests improvements and hashtags
5. User can rewrite their caption accordingly

So basically:
File → Text → AI → Suggestions

Features
1. Upload image or PDF post
2. Detect sentiment (positive / neutral / negative)
3. Engagement score (1–10)
4. Tone detection
5. Target audience prediction
6. Improved caption suggestion
7. Hashtag recommendations
8. Works for scanned and normal documents

Tech Stack

Frontend:
React.js

Backend:
Node.js
Express.js

Libraries Used:
pdf-parse (PDF text extraction)
Tesseract.js (OCR for images)
Gemini AI API (analysis)
Multer (file upload)

How to Run

1. Install Dependencies
Frontend:
cd clientnpm install

Backend:
cd server
npm install

2. Add API Key
Create .env inside server folder
GEMINI_KEY=your_api_key_here

3. Start Server
cd server
node index.js

Runs on:
http://localhost:5000

4. Start Client
cd client
npm start

Open:
http://localhost:3000

Folder Structure
client/
  src/
  public/

server/
  uploads/
  index.js
  .env

Limitations

1. Very long PDFs may be trimmed
2. OCR accuracy depends on image quality
3. AI suggestions may vary sometimes

Future Improvements

1. Platform-specific suggestions (Instagram / LinkedIn / Twitter)
2. Emoji recommendations
3. Engagement prediction using dataset training
4. Multi-language support

Conclusion

This project demonstrates how file processing, OCR and AI analysis can be combined into a single useful application. Instead of manually judging a post, users can quickly evaluate and improve it before publishing.