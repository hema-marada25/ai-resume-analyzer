// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { PdfReader } = require('pdfreader');

// // Configure multer
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF files are allowed!'), false);
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// // Helper function to extract text from PDF
// const extractTextFromPDF = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const textItems = [];
//     new PdfReader().parseBuffer(buffer, (err, item) => {
//       if (err) {
//         reject(err);
//       } else if (!item) {
//         resolve(textItems.join(' '));
//       } else if (item.text) {
//         textItems.push(item.text);
//       }
//     });
//   });
// };

// // Resume analyzer engine
// const analyzeResume = (text) => {
//   const lowerText = text.toLowerCase();

//   // ---- KEYWORD CHECKS ----
//   const techKeywords = [
//     'react', 'node', 'express', 'mongodb', 'javascript',
//     'typescript', 'html', 'css', 'git', 'api', 'rest',
//     'sql', 'redux', 'graphql', 'docker', 'aws', 'azure',
//     'gcp', 'ci/cd', 'agile', 'scrum', 'jwt', 'oauth'
//   ];

//   const softKeywords = [
//     'communication', 'teamwork', 'leadership', 'problem solving',
//     'collaboration', 'analytical', 'detail oriented'
//   ];

//   const sectionKeywords = [
//     'experience', 'education', 'skills', 'projects',
//     'summary', 'achievements', 'certifications'
//   ];

//   // Count matched keywords
//   const matchedTech = techKeywords.filter(k => lowerText.includes(k));
//   const matchedSoft = softKeywords.filter(k => lowerText.includes(k));
//   const matchedSections = sectionKeywords.filter(k => lowerText.includes(k));
//   const missingTech = techKeywords.filter(k => !lowerText.includes(k));

//   // ---- SCORING ----
//   const techScore = Math.round((matchedTech.length / techKeywords.length) * 40);
//   const softScore = Math.round((matchedSoft.length / softKeywords.length) * 10);
//   const sectionScore = Math.round((matchedSections.length / sectionKeywords.length) * 20);

//   // Length score
//   const wordCount = text.split(' ').length;
//   let lengthScore = 0;
//   if (wordCount >= 300 && wordCount <= 700) lengthScore = 20;
//   else if (wordCount > 700 && wordCount <= 1000) lengthScore = 15;
//   else if (wordCount > 100) lengthScore = 10;

//   // Contact info score
//   const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(lowerText);
//   const hasPhone = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/.test(text);
//   const hasLinkedIn = lowerText.includes('linkedin');
//   const hasGithub = lowerText.includes('github');
//   const contactScore = (hasEmail ? 3 : 0) + (hasPhone ? 2 : 0) +
//     (hasLinkedIn ? 2 : 0) + (hasGithub ? 3 : 0);

//   const overallScore = Math.min(
//     techScore + softScore + sectionScore + lengthScore + contactScore,
//     100
//   );

//   // ATS Score
//   const hasSpecialChars = /[★🎓📜]/.test(text);
//   const atsDeductions = hasSpecialChars ? 10 : 0;
//   const atsScore = Math.min(Math.round(overallScore * 0.9) - atsDeductions, 100);

//   // ---- STRENGTHS ----
//   const strengths = [];
//   if (matchedTech.length >= 8) strengths.push('Strong technical keyword coverage — good for ATS systems');
//   if (hasEmail && hasPhone && hasLinkedIn && hasGithub) strengths.push('Complete contact information including LinkedIn and GitHub');
//   if (matchedSections.length >= 5) strengths.push('Well structured resume with all key sections present');
//   if (lowerText.includes('project')) strengths.push('Projects section included — demonstrates practical experience');
//   if (lowerText.includes('achievement') || lowerText.includes('award') || lowerText.includes('performer'))
//     strengths.push('Achievements and awards mentioned — stands out to recruiters');
//   if (lowerText.includes('azure') || lowerText.includes('gcp') || lowerText.includes('aws'))
//     strengths.push('Cloud platform experience mentioned — highly valued in market');
//   if (strengths.length === 0) strengths.push('Resume has basic structure in place');

//   // ---- IMPROVEMENTS ----
//   const improvements = [];
//   if (wordCount < 300) improvements.push('Resume is too short — add more detail to experience and projects');
//   if (wordCount > 1000) improvements.push('Resume is too long — keep it under 1 page (600-700 words)');
//   if (!lowerText.includes('%') && !lowerText.includes('reduced') && !lowerText.includes('improved'))
//     improvements.push('Add quantified achievements — use numbers and percentages to show impact');
//   if (!lowerText.includes('graphql')) improvements.push('Add GraphQL to skills if you have experience with it');
//   if (!lowerText.includes('docker')) improvements.push('Consider learning Docker — frequently required in job postings');
//   if (matchedSoft.length < 2) improvements.push('Add more soft skills — communication, teamwork, leadership');
//   if (improvements.length === 0) improvements.push('Overall resume is well written — minor formatting tweaks recommended');

//   // ---- MISSING KEYWORDS ----
//   const importantMissing = missingTech.slice(0, 6);

//   // ---- SUGGESTIONS ----
//   const suggestions = [];
//   if (!lowerText.includes('available') && !lowerText.includes('immediate'))
//     suggestions.push('Add "Available to join immediately" in your summary');
//   if (!lowerText.includes('linkedin.com'))
//     suggestions.push('Add your full LinkedIn URL in contact section');
//   if (!lowerText.includes('github.com'))
//     suggestions.push('Add your full GitHub URL in contact section');
//   suggestions.push('Tailor your resume keywords to match each job description before applying');
//   suggestions.push('Use action verbs like "Designed", "Built", "Implemented", "Optimized" to start bullet points');
//   if (!lowerText.includes('open to') && !lowerText.includes('seeking'))
//     suggestions.push('Add a clear job seeking statement in your professional summary');

//   return {
//     overallScore,
//     atsScore,
//     summary: `Your resume scores ${overallScore}/100 overall and ${atsScore}/100 for ATS compatibility. 
//     You have strong technical skills coverage with ${matchedTech.length} out of ${techKeywords.length} key tech keywords present. 
//     ${overallScore >= 70 ? 'Your resume is in good shape — focus on quantifying achievements.' : 'Focus on adding more keywords and quantified impact to improve your score.'}`,
//     strengths: strengths.slice(0, 5),
//     improvements: improvements.slice(0, 5),
//     missingKeywords: importantMissing,
//     suggestions: suggestions.slice(0, 5),
//   };
// };

// // Analyze resume route
// router.post('/analyze', upload.single('resume'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No PDF file uploaded' });
//     }

//     // Extract text from PDF
//     const resumeText = await extractTextFromPDF(req.file.buffer);
// // Clean spaced text - remove extra spaces between characters
// const cleanedText = resumeText
//   .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
//   .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
//   .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
//   .replace(/\s+/g, ' ')
//   .trim();

// console.log('Cleaned text:', cleanedText.substring(0, 500));
//     if (!resumeText || resumeText.trim().length === 0) {
//       return res.status(400).json({ error: 'Could not extract text from PDF' });
//     }

//     // Analyze resume
    
//     const analysis = analyzeResume(cleanedText);

//     res.json({ success: true, analysis });

//   } catch (error) {
//     console.error('Error analyzing resume:', error);
//     res.status(500).json({
//       error: 'Failed to analyze resume',
//       details: error.message
//     });
//   }
// });

// module.exports = router;

















const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PdfReader } = require('pdfreader');
const { CohereClient } = require('cohere-ai');

// Configure Cohere
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Helper function to extract text from PDF
const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const textItems = [];
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(textItems.join(' '));
      } else if (item.text) {
        textItems.push(item.text);
      }
    });
  });
};

// Clean extracted PDF text
const cleanText = (text) => {
  return text
    .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
    .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
    .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
    .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
    .replace(/([a-zA-Z])\s([a-zA-Z])/g, '$1$2')
    .replace(/\.\s+js/gi, '.js')
    .replace(/\.\s+ts/gi, '.ts')
    .replace(/\s+/g, ' ')
    .trim();
};

// Analyze resume route
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    // Extract and clean text from PDF
    const rawText = await extractTextFromPDF(req.file.buffer);
    const resumeText = cleanText(rawText);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    // Send to Cohere
    const response = await cohere.chat({
    model: 'command-a-03-2025',
      message: `You are an expert resume reviewer and career coach.
Analyze the resume below and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

Return exactly this structure:
{
  "overallScore": (number out of 100),
  "summary": (2-3 sentence overall assessment as a string),
  "strengths": (array of 3-5 strong points as strings),
  "improvements": (array of 3-5 areas to improve as strings),
  "missingKeywords": (array of 5-6 important missing keywords as strings),
  "atsScore": (number out of 100),
  "suggestions": (array of 4-5 specific actionable suggestions as strings)
}

Resume to analyze:
${resumeText.substring(0, 3000)}`,
    });

    // Parse response
    const responseText = response.text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse response from Cohere');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      error: 'Failed to analyze resume',
      details: error.message
    });
  }
});

module.exports = router;