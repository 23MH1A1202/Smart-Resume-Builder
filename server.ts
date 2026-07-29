import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import OpenAI from 'openai';
// @ts-ignore
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { google } from 'googleapis';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Optional if we just want client side auth, but good for backend verification)
try {
  admin.initializeApp();
} catch (e) {
  console.error("Firebase admin initialization failed", e);
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// --- GROQ API ---
const openai = process.env.GROQ_API_KEY ? new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY, 
  baseURL: 'https://api.groq.com/openai/v1' 
}) : null;

// Ensure Groq API is available
const requireAi = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!openai) {
    return res.status(500).json({ error: 'GROQ_API_KEY environment variable is missing.' });
  }
  next();
};

app.post('/api/parse-resume', upload.single('resume'), requireAi, async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Custom page render to extract embedded links
    const render_page = (pageData: any) => {
      let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false
      };
      return pageData.getTextContent(render_options)
      .then(function(textContent: any) {
          let lastY, text = '';
          for (let item of textContent.items) {
              if (lastY == item.transform[5] || !lastY){
                  text += item.str;
              } else{
                  text += '\n' + item.str;
              }    
              lastY = item.transform[5];
          }
          return pageData.getAnnotations().then(function(annotations: any[]) {
              let links = annotations.filter(a => a.subtype === 'Link' && a.url).map(a => a.url);
              if (links.length > 0) {
                 text += '\n\n--- EMBEDDED LINKS FOUND ON THIS PAGE ---\n' + links.join('\n') + '\n-----------------------------------------\n';
              }
              return text;
          });
      });
    };

    // Parse PDF text and embedded links
    const pdfData = await pdfParse(file.buffer, { pagerender: render_page });
    const pdfText = pdfData.text;
    
    // Parse using Groq
    const response = await openai!.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Extract the resume data from this document text into a structured JSON format. 
Pay very close attention to embedded links/URLs, education marks (grades/GPA), study years, and location details (e.g. Remote vs Onsite for internships). Ensure these are all fully extracted and preserved.

Return ONLY a valid JSON object matching this structure, without markdown blocks or extra text. If an array field has no data in the resume, return an empty array []. If the declaration is not present, return an empty string for text.
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string"
  },
  "summary": "string",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string (YYYY-MM or Present)",
      "endDate": "string",
      "location": "string (include Remote or Onsite if specified)",
      "description": "string (bullet points combined into a string with \\n. PRESERVE URLs if any exist)"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string",
      "location": "string",
      "gradeOrMarks": "string (extract GPA, percentage, or marks if present)"
    }
  ],
  "projects": [
    {
      "name": "string",
      "link": "string (MUST extract any embedded URLs or links found for this project)",
      "description": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string",
      "link": "string"
    }
  ],
  "workshops": [
    {
      "name": "string",
      "organizer": "string",
      "date": "string",
      "location": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "level": "string"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "string"
    }
  ],
  "declaration": {
    "text": "string (extract any declaration text if present, otherwise leave empty)",
    "showDate": false,
    "showPlace": false,
    "showSignature": false
  }
}

Resume Text:
${pdfText}`
        }
      ],
      response_format: { type: 'json_object' },
    });

    let text = response.choices[0].message.content || "{}";
    text = text.replace(/^```json\n?/, '').replace(/```$/, '').trim();
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
});

app.post('/api/optimize', requireAi, async (req, res) => {
  try {
    const { resumeData, jobDescription, targetSinglePage } = req.body;
    
    const response = await openai!.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert ATS optimizer and resume writer. 
I have a JSON object representing a resume, and a job description. 
Optimize the resume summary, experience descriptions, and skills to better match the job description while keeping it 100% truthful and sounding human-written, not AI-generated.
${targetSinglePage ? 'The user requested a SINGLE-PAGE RESUME. Minimize the content aggressively by removing older or less relevant experience bullet points, truncating long descriptions, and focusing only on the most important details based on the job description. Keep it extremely concise but impactful.' : ''}
Return ONLY valid JSON in the exact same format as the input.

Resume JSON:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}`
        }
      ],
      response_format: { type: 'json_object' },
    });

    let text = response.choices[0].message.content || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error optimizing resume:', error);
    res.status(500).json({ error: error.message || 'Failed to optimize resume' });
  }
});

app.post('/api/cover-letter', requireAi, async (req, res) => {
  try {
    const { resumeData, jobDescription, tone = 'professional' } = req.body;
    
    const response = await openai!.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Write a tailored cover letter based on this resume and job description.
Tone: ${tone}.
Make it sound human-written, concise, and focused on value add. Do not use generic buzzwords.
Return ONLY the raw text of the cover letter.

Resume JSON:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}`
        }
      ]
    });

    res.json({ coverLetter: response.choices[0].message.content || "" });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate cover letter' });
  }
});

// --- GOOGLE SHEETS API ---
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const getSheetsClient = async () => {
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient as any });
};

app.post('/api/track-application', async (req, res) => {
  try {
    const { spreadsheetId, company, role, date, status, notes } = req.body;
    
    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Spreadsheet ID is required' });
    }

    const sheets = await getSheetsClient();
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[company, role, date, status, notes]]
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error appending to sheets:', error);
    res.status(500).json({ error: 'Failed to append to sheet', details: error.message });
  }
});


// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
