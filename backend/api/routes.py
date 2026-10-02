from fastapi import APIRouter, HTTPException, status
from backend.schemas.request import URLPredictionRequest
from backend.schemas.response import URLPredictionResponse
from backend.prediction_service import PhishingPredictionService

api_router = APIRouter()

@api_router.post(
    "/predict",
    response_model=URLPredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze URL Phishing Risk",
    description="Accepts a target URL, extracts structural features, executes ML model inference, and returns risk score, classification, and explainability indicators."
)

def predict_url_phishing_risk(request_payload: URLPredictionRequest):
    try:
        prediction_service = PhishingPredictionService.get_instance()
        prediction_result_dictionary = prediction_service.predict_url_risk(request_payload.url)

        raw_confidence_value = prediction_result_dictionary['confidence']
        formatted_confidence_percentage = round(raw_confidence_value * 100.0, 1) if raw_confidence_value <= 1.0 else round(raw_confidence_value, 1)

        return URLPredictionResponse(
            url=prediction_result_dictionary['url'],
            prediction=prediction_result_dictionary['prediction'],
            risk_score=prediction_result_dictionary['risk_score'],
            confidence=formatted_confidence_percentage,
            indicators=prediction_result_dictionary['indicators']
        )

    except ValueError as validation_error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(validation_error)
        )
    except Exception as internal_error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction service processing failure: {str(internal_error)}"
        )
