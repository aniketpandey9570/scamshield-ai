import { SAMPLE_MESSAGES } from '../data/sampleMessages';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      analysis_mode: 'UNAVAILABLE',
      provider_configured: false,
      model_name: 'Backend disconnected',
      error: err.message
    };
  }
}

export async function fetchSamples() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/samples`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to load samples (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    // Fall back to client-side samples so demo works even if backend samples route stalls
    return SAMPLE_MESSAGES;
  }
}

export async function analyzeMessage(message, messageType, imageBase64 = null) {
  try {
    const payload = {
      message: message || '',
      message_type: messageType
    };
    if (imageBase64) {
      payload.image_base64 = imageBase64;
    }

    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      let errorDetail = `Analysis failed with HTTP status ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          if (Array.isArray(errJson.detail)) {
            errorDetail = errJson.detail.map(d => d.msg || d).join(', ');
          } else {
            errorDetail = errJson.detail;
          }
        }
      } catch (e) {
        // use fallback text
      }
      throw new Error(errorDetail);
    }

    return await res.json();
  } catch (err) {
    throw err;
  }
}

