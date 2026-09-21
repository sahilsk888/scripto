/**
 * Client API service for SCRIPTO
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Sends letter generation request to backend
 * @param {Object} letterParams
 * @returns {Promise<{success: boolean, letter: string}>}
 */
export async function generateLetterAPI(letterParams) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/letters/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(letterParams),
    });
  } catch (networkErr) {
    console.error('Network failure connecting to backend:', networkErr);
    throw new Error(
      'Unable to connect to the server. Please ensure the backend is running and try again.'
    );
  }

  // Safely read response as text first to prevent JSON parse crashes on empty/invalid input
  let rawText = '';
  try {
    rawText = await response.text();
  } catch (readErr) {
    console.error('Failed to read response body:', readErr);
    throw new Error('Unable to generate your letter right now. Please try again.');
  }

  // Parse JSON safely
  let data = {};
  if (rawText && rawText.trim()) {
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Invalid JSON returned by backend:', parseErr, rawText);
      throw new Error('The server returned an invalid response. Please try again.');
    }
  }

  // Handle HTTP error responses
  if (!response.ok || !data.success) {
    // Specific check for rate limit / quota
    if (response.status === 429 || data?.errorCode === 'QUOTA_EXCEEDED' || data?.error?.toLowerCase().includes('quota') || data?.error?.toLowerCase().includes('usage limit')) {
      throw new Error('The AI service has reached its current usage limit. Please try again later.');
    }

    if (response.status === 401 || data?.errorCode === 'INVALID_API_KEY' || data?.errorCode === 'MISSING_API_KEY') {
      throw new Error(data?.error || 'AI service authentication failed. Please check server configuration.');
    }

    // Validation or other server errors
    const errorMessage = data?.error || 'Unable to generate your letter right now. Please try again.';
    throw new Error(errorMessage);
  }

  if (!data?.letter || typeof data.letter !== 'string' || !data.letter.trim()) {
    throw new Error('No letter was returned by the AI service.');
  }

  return data;
}

/**
 * Sends reference image and letter parameters to backend for vision analysis and letter generation
 * @param {File|Blob} imageFile
 * @param {Object} letterParams
 * @returns {Promise<{success: boolean, letter: string, extractedContext?: Object}>}
 */
export async function analyzeImageAndGenerateLetterAPI(imageFile, letterParams = {}) {
  const formData = new FormData();
  formData.append('image', imageFile, imageFile.name || 'reference-image.jpg');

  // Append any existing user-selected options
  if (letterParams.letterType) formData.append('letterType', letterParams.letterType);
  if (letterParams.tone) formData.append('tone', letterParams.tone);
  if (letterParams.language) formData.append('language', letterParams.language);
  if (letterParams.length) formData.append('length', letterParams.length);
  if (letterParams.recipientName) formData.append('recipientName', letterParams.recipientName);
  if (letterParams.senderName) formData.append('senderName', letterParams.senderName);
  if (letterParams.organization) formData.append('organization', letterParams.organization);
  if (letterParams.date) formData.append('date', letterParams.date);
  if (letterParams.additionalInstructions) formData.append('additionalInstructions', letterParams.additionalInstructions);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/letters/analyze-image`, {
      method: 'POST',
      body: formData,
    });
  } catch (networkErr) {
    console.error('Network failure connecting to backend:', networkErr);
    throw new Error(
      'Unable to connect to the server. Please ensure the backend is running and try again.'
    );
  }

  let rawText = '';
  try {
    rawText = await response.text();
  } catch (readErr) {
    console.error('Failed to read response body:', readErr);
    throw new Error('Unable to process the reference image right now. Please try again.');
  }

  let data = {};
  if (rawText && rawText.trim()) {
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Invalid JSON returned by backend:', parseErr, rawText);
      throw new Error('The server returned an invalid response. Please try again.');
    }
  }

  if (!response.ok || !data.success) {
    if (response.status === 429 || data?.errorCode === 'QUOTA_EXCEEDED') {
      throw new Error('The AI service has reached its current usage limit. Please try again later.');
    }
    if (response.status === 401 || data?.errorCode === 'INVALID_API_KEY' || data?.errorCode === 'MISSING_API_KEY') {
      throw new Error(data?.error || 'AI service authentication failed. Please check server configuration.');
    }
    throw new Error(data?.error || "We couldn't analyze this image. Please try another image.");
  }

  if (!data?.letter || typeof data.letter !== 'string' || !data.letter.trim()) {
    throw new Error("No letter was generated from the reference image. Please try again with a clearer image.");
  }

  return data;
}

