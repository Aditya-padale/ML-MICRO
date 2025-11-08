const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || 'http://localhost:8001';

export async function uploadAndAnalyze(formData) {
  console.log('Making API call to:', `${API_BASE}/upload`);
  try {
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    console.log('API response status:', res.status, res.statusText);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API error response:', errorText);
      throw new Error(`Upload/Analyze failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    const data = await res.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}

export async function fetchGradcam(formData) {
  const res = await fetch(`${API_BASE}/gradcam`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Grad-CAM failed');
  return res.json();
}

export async function requestReport(payload) {
  const res = await fetch(`${API_BASE}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Report generation failed');
  return res.json();
}

export async function exportAnalysis(payload) {
  const res = await fetch(`${API_BASE}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Export failed');
  return res.json();
}
