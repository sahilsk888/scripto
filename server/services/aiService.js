import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load environment variables reliably from server/.env or root .env
function loadEnv() {
  const serverEnvPath = path.resolve(__dirname, '../.env');
  const rootEnvPath = path.resolve(__dirname, '../../.env');

  dotenv.config({ path: serverEnvPath, override: true });
  dotenv.config({ path: rootEnvPath });
}

// Initial load
loadEnv();

/**
 * Service to generate letters using Google Gemini API (@google/genai)
 */
export async function generateLetterWithAI({
  topic,
  letterType = 'Formal Letter',
  tone = 'Formal',
  language = 'English',
  length = 'Medium',
  recipientName = '',
  senderName = '',
  organization = '',
  date = '',
  additionalInstructions = ''
}) {
  // Reload in case .env was updated while server was running
  loadEnv();

  let apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
  }

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const error = new Error(
      'Gemini API Key is missing or not configured. Please add your valid GEMINI_API_KEY in the server/.env file to generate letters with AI.'
    );
    error.status = 401;
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey
  });

  const systemInstruction = `You are an expert professional letter writer.

Create a complete, polished, natural-sounding letter based on the user's information.

Requirements:
- Understand casual or grammatically incorrect user input.
- Correct grammar and spelling.
- Expand the user's idea into a complete meaningful letter.
- Follow the selected letter type.
- Follow the selected tone.
- Follow the selected language. If the language is not English (e.g. Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Urdu), write the entire letter body and salutation naturally in that language's authentic script.
- Follow the requested length.
- Use proper letter formatting (sender address/header if provided, date, recipient address/header, subject line where applicable, formal/informal salutation, well-structured paragraphs, professional closing, and sign-off).
- Use appropriate salutations and closings.
- Do not invent personal facts that were not provided.
- If information is missing, use sensible placeholders or neutral wording (like [Your Address] or [Contact Information]) only where standard letter etiquette strictly requires it.
- Return ONLY the finished letter.
- Do not explain what you did.
- Do not wrap the letter in JSON.
- Do not use Markdown code fences (do not enclose in \`\`\` or \`\`\`markdown).
- Do not include conversational remarks before or after the letter (do not say "Here is your letter:").`;

  // Build clear length guidance
  let lengthGuidance = 'standard medium length with 2 to 3 well-developed paragraphs';
  if (length.toLowerCase() === 'short') {
    lengthGuidance = 'concise and direct to the point, around 1 to 2 focused paragraphs';
  } else if (length.toLowerCase() === 'detailed') {
    lengthGuidance = 'thorough and comprehensive, with 3 to 4 detailed paragraphs covering all context, background, and proposed next steps';
  }

  const userPromptParts = [
    `Topic / Intent: "${topic}"`,
    `Letter Type: ${letterType}`,
    `Tone: ${tone}`,
    `Language: ${language}`,
    `Target Length: ${length} (${lengthGuidance})`
  ];

  if (senderName?.trim()) {
    userPromptParts.push(`Sender Name: ${senderName.trim()}`);
  }
  if (recipientName?.trim()) {
    userPromptParts.push(`Recipient Name: ${recipientName.trim()}`);
  }
  if (organization?.trim()) {
    userPromptParts.push(`Organization / Company / School: ${organization.trim()}`);
  }
  if (date?.trim()) {
    userPromptParts.push(`Date: ${date.trim()}`);
  }
  if (additionalInstructions?.trim()) {
    userPromptParts.push(`Additional Instructions: ${additionalInstructions.trim()}`);
  }

  const fullPrompt = `${systemInstruction}\n\nPlease generate the letter using these specifications:\n\n${userPromptParts.join('\n')}`;

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const modelsToTry = [primaryModel, 'gemini-3.8-flash', 'gemini-3.6-flash'].filter(
    (model, index, self) => self.indexOf(model) === index
  );

  let response;
  let lastError;

  for (const model of modelsToTry) {
    try {
      response = await ai.models.generateContent({
        model: model,
        contents: fullPrompt
      });
      if (response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        break;
      }
    } catch (err) {
      lastError = err;
      const status = err?.status || (err?.code && typeof err.code === 'number' ? err.code : 500);
      const msg = err?.message || '';

      // If invalid key or quota, don't try other models - fail immediately with specific error
      if (status === 401 || status === 403 || msg.includes('API_KEY_INVALID') || status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
        handleGeminiError(err);
      }

      // If 503 (overload) or 404 (model not found), proceed to try next candidate model
      console.warn(`Gemini model ${model} failed (status: ${status}), attempting next model if available...`);
    }
  }

  if (!response && lastError) {
    handleGeminiError(lastError);
  }

  // Verify response content
  let letter = response?.text;
  if (!letter && response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    letter = response.candidates[0].content.parts[0].text;
  }

  if (!letter || !letter.trim()) {
    const error = new Error('No letter text was returned by the AI service.');
    error.status = 502;
    error.code = 'EMPTY_AI_RESPONSE';
    throw error;
  }

  // Clean any markdown code block wrappers if model accidentally wrapped output
  letter = letter.trim();
  if (letter.startsWith('```') && letter.endsWith('```')) {
    letter = letter.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  return letter;
}

/**
 * Service to analyze a reference image with Gemini Vision and generate a professional letter
 */
export async function generateLetterFromImageWithAI({
  imageBuffer,
  mimeType = 'image/jpeg',
  letterType,
  tone,
  language = 'English',
  length = 'Medium',
  recipientName = '',
  senderName = '',
  organization = '',
  date = '',
  additionalInstructions = ''
}) {
  loadEnv();

  let apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
  }

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    const error = new Error(
      'Gemini API Key is missing or not configured. Please add your valid GEMINI_API_KEY in the server/.env file.'
    );
    error.status = 401;
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey });

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const candidateModels = [primaryModel, 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-latest'].filter(
    (model, index, self) => self.indexOf(model) === index
  );

  const base64Data = imageBuffer.toString('base64');
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: mimeType
    }
  };

  // STAGE 1: Vision / OCR & Structured Context Extraction
  const visionPrompt = `You are an expert document and letter analyst.
Analyze this reference image in detail. The image may be a handwritten letter, printed document, notice, memo, rough complaint, or instructions.
Extract structured information in JSON format with exactly these fields:
{
  "document_type": "e.g., Leave Application, Formal Request, Complaint Letter, Permission Letter, etc.",
  "purpose": "A concise summary of the letter purpose and intent",
  "recipient": "Recipient name, title, or department if visible, else empty string",
  "sender": "Sender name, title, or student/employee ID if visible, else empty string",
  "organization": "Organization, school, college, or company name if visible, else empty string",
  "date": "Date if visible, else empty string",
  "subject": "Clear subject line representing the request/topic",
  "key_points": ["Specific point or reason 1", "Specific point 2"],
  "tone": "Formal, Urgent, Polite, or Professional based on context",
  "extracted_text": "Verbatim or key text deciphered from the image",
  "missing_information": ["Missing details such as specific dates, recipient department, etc."]
}

CRITICAL: Return ONLY valid JSON. Do not wrap in markdown or backticks. Do not include conversational remarks.`;

  let structuredContext = {
    document_type: 'Formal Letter',
    purpose: '',
    recipient: '',
    sender: '',
    organization: '',
    date: '',
    subject: '',
    key_points: [],
    tone: 'Formal',
    extracted_text: '',
    missing_information: []
  };

  let visionSuccess = false;
  for (const model of candidateModels) {
    try {
      const visionResponse = await ai.models.generateContent({
        model: model,
        contents: [imagePart, visionPrompt]
      });

      let rawVisionText = visionResponse?.text || visionResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawVisionText) {
        rawVisionText = rawVisionText.trim();
        // Clean JSON markdown code fences if present
        if (rawVisionText.startsWith('```')) {
          rawVisionText = rawVisionText.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
        }
        try {
          const parsed = JSON.parse(rawVisionText);
          structuredContext = { ...structuredContext, ...parsed };
          visionSuccess = true;
          break;
        } catch (jsonErr) {
          console.warn('Could not parse vision JSON, attempting fallback regex/extraction:', jsonErr.message);
          structuredContext.extracted_text = rawVisionText;
          visionSuccess = true;
          break;
        }
      }
    } catch (err) {
      console.warn(`Vision analysis with model ${model} failed:`, err?.message || err);
      // If terminal authentication/quota error, handle immediately
      const status = err?.status || (err?.code && typeof err.code === 'number' ? err.code : 500);
      const msg = err?.message || '';
      if (status === 401 || status === 403 || msg.includes('API_KEY_INVALID') || status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
        handleGeminiError(err);
      }
    }
  }

  if (!visionSuccess && !structuredContext.extracted_text) {
    const error = new Error("We couldn't analyze this image. Please try another image.");
    error.status = 422;
    error.code = 'IMAGE_ANALYSIS_FAILED';
    throw error;
  }

  // STAGE 2: Professional Letter Generation from Context & Reference
  const finalLetterType = letterType || structuredContext.document_type || 'Formal Letter';
  const finalTone = tone || structuredContext.tone || 'Formal';
  const finalRecipient = recipientName?.trim() || structuredContext.recipient || '';
  const finalSender = senderName?.trim() || structuredContext.sender || '';
  const finalOrg = organization?.trim() || structuredContext.organization || '';
  const finalDate = date?.trim() || structuredContext.date || '';

  const generationInstruction = `You are an expert professional letter writer.
A user provided an image reference for their letter. The AI vision system extracted the following structured context from the image:

- Document Type: ${structuredContext.document_type || 'Letter'}
- Purpose: ${structuredContext.purpose || 'Not specified'}
- Subject: ${structuredContext.subject || 'Not specified'}
- Recipient in Reference: ${finalRecipient || 'Not specified'}
- Sender in Reference: ${finalSender || 'Not specified'}
- Organization: ${finalOrg || 'Not specified'}
- Date: ${finalDate || 'Not specified'}
- Key Points: ${(structuredContext.key_points || []).join('; ') || 'See extracted text'}
- Visible Extracted Text from Image:
"""
${structuredContext.extracted_text || 'No text extracted'}
"""

BEHAVIOR GUIDELINES:
1. If the reference is an existing handwritten or rough letter/complaint/notice, use it as a reference and rewrite it into an exemplary, professional letter while strictly preserving the intended meaning and core issue.
2. Polish grammar, sentence structure, formality, clarity, and organization.
3. DO NOT invent facts, medical claims, dates, or personal details not present in the image or context.
4. If essential information is missing (e.g., recipient name, date, sender contact, address), DO NOT hallucinate it. Use standard placeholders such as [Recipient Name], [Your Name], [Date], [Organization Name], [Contact Information].
5. Target Language: ${language}. If the language is not English, write the entire letter authentically in that language.
6. Target Tone: ${finalTone}.
7. Target Length: ${length}.
8. Use standard formal letter formatting: sender info/header, date, recipient info, clear subject line (if applicable), polite salutation, well-structured paragraphs, professional sign-off, and signature area.
9. User additional instructions: "${additionalInstructions || 'None provided'}".
10. Return ONLY the finished letter text. Do not wrap in markdown fences or include introductory conversational text.`;

  let letter = '';
  for (const model of candidateModels) {
    try {
      const genResponse = await ai.models.generateContent({
        model: model,
        contents: generationInstruction
      });
      letter = genResponse?.text || genResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (letter.trim()) {
        break;
      }
    } catch (err) {
      console.warn(`Letter generation from image with model ${model} failed:`, err?.message || err);
      const status = err?.status || (err?.code && typeof err.code === 'number' ? err.code : 500);
      const msg = err?.message || '';
      if (status === 401 || status === 403 || msg.includes('API_KEY_INVALID') || status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
        handleGeminiError(err);
      }
    }
  }

  if (!letter || !letter.trim()) {
    const error = new Error("We couldn't generate a letter from this image. Please try again.");
    error.status = 502;
    error.code = 'GENERATION_FAILED';
    throw error;
  }

  letter = letter.trim();
  if (letter.startsWith('```') && letter.endsWith('```')) {
    letter = letter.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  return {
    letter,
    extractedContext: {
      documentType: structuredContext.document_type || '',
      purpose: structuredContext.purpose || '',
      recipient: finalRecipient,
      sender: finalSender,
      organization: finalOrg,
      date: finalDate,
      subject: structuredContext.subject || '',
      keyPoints: structuredContext.key_points || [],
      tone: finalTone,
      missingInformation: structuredContext.missing_information || []
    }
  };
}

/**
 * Categorize and normalize Gemini API errors
 */
function handleGeminiError(err) {
  const msg = err?.message || '';
  const status = err?.status || (err?.code && typeof err.code === 'number' ? err.code : 500);

  // Authentication error (401 / 403 / API_KEY_INVALID)
  if (status === 401 || status === 403 || msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('unauthenticated')) {
    const error = new Error('Invalid Gemini API key. Please verify your key in server/.env.');
    error.status = 401;
    error.code = 'INVALID_API_KEY';
    throw error;
  }

  // Rate limit / Quota exceeded (429 / RESOURCE_EXHAUSTED)
  if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('rate limit')) {
    const error = new Error('The AI service has reached its current usage limit. Please try again later.');
    error.status = 429;
    error.code = 'QUOTA_EXCEEDED';
    throw error;
  }

  // Model not found (404)
  if (status === 404 || msg.includes('NOT_FOUND')) {
    const error = new Error('The requested Gemini model is currently not available. Please check server configuration.');
    error.status = 404;
    error.code = 'MODEL_NOT_FOUND';
    throw error;
  }

  // Generic controlled error
  const error = new Error('Unable to generate the letter right now. Please try again.');
  error.status = status >= 400 && status < 600 ? status : 500;
  error.code = 'AI_GENERATION_ERROR';
  throw error;
}
