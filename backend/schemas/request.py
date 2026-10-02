from pydantic import BaseModel, Field, field_validator
from urllib.parse import urlparse

class URLPredictionRequest(BaseModel):

    url: str = Field(
        ...,
        description="The raw target URL string to analyze for phishing risk",
        examples=["https://example.com"]
    )

    @field_validator('url')

    def validate_url_string_format(cls, value_string):
        stripped_value = value_string.strip()

        if len(stripped_value) == 0:
            raise ValueError("URL string cannot be empty")

        if not stripped_value.startswith(('http://', 'https://')):
            formatted_url_string = 'http://' + stripped_value
        else:
            formatted_url_string = stripped_value

        parsed_url_result = urlparse(formatted_url_string)

        if not parsed_url_result.netloc:
            raise ValueError("Invalid URL structure: host domain missing")

        return stripped_value
