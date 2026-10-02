export interface PredictionResponsePayload {
  url: string;
  prediction: 'SAFE' | 'SUSPICIOUS' | 'DANGER';
  risk_score: number;
  confidence: number;
  indicators: string[];
}

export async function requestUrlPrediction(target_url_string: string): Promise<PredictionResponsePayload> {
  const backend_api_endpoint = 'http://127.0.0.1:8000/predict';

  const http_response = await fetch(backend_api_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: target_url_string,
    }),
  });

  if (!http_response.ok) {
    const error_response_json = await http_response.json().catch(() => null);
    const error_message_detail = error_response_json?.detail?.[0]?.msg || error_response_json?.detail || 'Failed to analyze target URL';
    throw new Error(error_message_detail);
  }

  const prediction_response_data: PredictionResponsePayload = await http_response.json();
  return prediction_response_data;
}
