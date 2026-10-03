import os
import joblib
import pandas as pandas_module
from backend.features.feature_extractor import extract_url_features

class PhishingPredictionService:

    _instance = None

    def __init__(self, model_file_path=None):
        if model_file_path is None:
            model_file_path = os.path.join('models', 'xgboost.joblib')

        self.model_file_path = model_file_path
        self.model_instance = joblib.load(model_file_path)

        self.ordered_feature_names = [
            'URLLength', 'DomainLength', 'IsDomainIP', 'TLDLength', 'NoOfSubDomain',
            'HasObfuscation', 'NoOfObfuscatedChar', 'ObfuscationRatio', 'NoOfLettersInURL',
            'LetterRatioInURL', 'NoOfDegitsInURL', 'DegitRatioInURL', 'NoOfEqualsInURL',
            'NoOfQMarkInURL', 'NoOfAmpersandInURL', 'NoOfOtherSpecialCharsInURL',
            'SpacialCharRatioInURL', 'IsHTTPS'
        ]

    @classmethod
    def get_instance(cls, model_file_path=None):
        if cls._instance is None:
            cls._instance = cls(model_file_path)
        return cls._instance

    def generate_risk_indicators(self, feature_dictionary, raw_url_string):
        indicator_list = []

        if feature_dictionary['IsHTTPS'] == 0:
            indicator_list.append('URL uses unencrypted HTTP protocol instead of HTTPS')

        if feature_dictionary['IsDomainIP'] == 1:
            indicator_list.append('Domain consists of a raw IP address instead of a domain name')

        if feature_dictionary['URLLength'] > 75:
            indicator_list.append(f"Excessive URL length detected ({feature_dictionary['URLLength']} characters)")

        if feature_dictionary['NoOfSubDomain'] >= 2:
            indicator_list.append(f"Multiple subdomains detected ({feature_dictionary['NoOfSubDomain']} subdomains)")

        if feature_dictionary['HasObfuscation'] == 1:
            indicator_list.append('URL obfuscation or hex-encoded character patterns detected')

        if feature_dictionary['DegitRatioInURL'] > 0.15:
            percentage_value = round(feature_dictionary['DegitRatioInURL'] * 100, 1)
            indicator_list.append(f"High numeric digit ratio in URL ({percentage_value}%)")

        if feature_dictionary['NoOfEqualsInURL'] + feature_dictionary['NoOfQMarkInURL'] + feature_dictionary['NoOfAmpersandInURL'] >= 3:
            indicator_list.append('Suspicious query parameter structure with multiple delimiters')

        if '@' in raw_url_string:
            indicator_list.append('URL contains user credential redirect symbol (@)')

        if len(indicator_list) == 0:
            indicator_list.append('No suspicious URL structure indicators detected')

        return indicator_list

    def predict_url_risk(self, target_url_string):
        extracted_feature_dictionary = extract_url_features(target_url_string)

        feature_row_dataframe = pandas_module.DataFrame([extracted_feature_dictionary])[self.ordered_feature_names]

        class_probabilities = self.model_instance.predict_proba(feature_row_dataframe)[0]

        phishing_probability = float(class_probabilities[0])
        legitimate_probability = float(class_probabilities[1])

        risk_score_value = int(round(phishing_probability * 100.0))

        if risk_score_value <= 45:
            prediction_label = 'SAFE'
        elif risk_score_value <= 75:
            prediction_label = 'SUSPICIOUS'
        else:
            prediction_label = 'DANGER'

        confidence_score_value = float(round(max(phishing_probability, legitimate_probability), 4))

        explainability_indicators = self.generate_risk_indicators(extracted_feature_dictionary, target_url_string)

        return {
            'url': target_url_string,
            'prediction': prediction_label,
            'risk_score': risk_score_value,
            'confidence': confidence_score_value,
            'indicators': explainability_indicators
        }
