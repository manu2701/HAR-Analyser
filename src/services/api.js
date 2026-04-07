/**
 * API service layer — stub functions matching future backend contracts.
 * Currently returns mock data. Replace with fetch() calls when backend is ready.
 */

import harMockData from '../mock/harMock';

// Simulates network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Parse a HAR file and return analyzed data.
 * Future: POST /api/v1/har/parse (multipart/form-data)
 */
export async function parseHarFile(file) {
  await delay(800);
  // In production: upload file, get parsed result
  return harMockData;
}

/**
 * Load demo HAR data.
 * Future: GET /api/v1/har/demo
 */
export async function loadDemoData() {
  await delay(400);
  return harMockData;
}

/**
 * Get AI analysis response.
 * Future: POST /api/v1/ai/analyze
 */
export async function getAiResponse(message, context) {
  await delay(1000);

  const lowerMsg = message.toLowerCase();
  const responses = harMockData.aiResponses;

  const match = responses.find((r) => lowerMsg.includes(r.trigger));
  return match ? match.response : responses.find((r) => r.trigger === 'default').response;
}

/**
 * Export HAR analysis as report.
 * Future: POST /api/v1/export
 */
export async function exportReport(format = 'json') {
  await delay(500);
  return { success: true, format, downloadUrl: '#' };
}
