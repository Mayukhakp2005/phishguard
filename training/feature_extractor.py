import re
from urllib.parse import urlparse

def extract_url_features(url_string):
    if not url_string.startswith(('http://', 'https://')):
        url_string = 'http://' + url_string

    parsed_url = urlparse(url_string)

    scheme_string = parsed_url.scheme.lower()
    netloc_string = parsed_url.netloc.lower()

    if ':' in netloc_string and not netloc_string.startswith('['):
        netloc_string = netloc_string.split(':')[0]

    url_length = len(url_string)
    domain_length = len(netloc_string)

    ip_pattern = re.compile(r'^(\d{1,3}\.){3}\d{1,3}$')
    is_domain_ip = 1 if ip_pattern.match(netloc_string) else 0

    domain_parts = netloc_string.split('.')
    if is_domain_ip == 1 or len(domain_parts) <= 1:
        top_level_domain = ''
        number_of_subdomains = 0
    else:
        top_level_domain = domain_parts[-1]
        number_of_subdomains = max(0, len(domain_parts) - 2)

    top_level_domain_length = len(top_level_domain)

    number_of_obfuscated_characters = url_string.count('%')
    has_obfuscation = 1 if (number_of_obfuscated_characters > 0 or '@' in url_string or is_domain_ip == 1) else 0
    obfuscation_ratio = float(number_of_obfuscated_characters) / float(url_length) if url_length > 0 else 0.0

    number_of_letters = sum(1 for character_item in url_string if character_item.isalpha())
    letter_ratio = float(number_of_letters) / float(url_length) if url_length > 0 else 0.0

    number_of_digits = sum(1 for character_item in url_string if character_item.isdigit())
    digit_ratio = float(number_of_digits) / float(url_length) if url_length > 0 else 0.0

    number_of_equals = url_string.count('=')
    number_of_question_marks = url_string.count('?')
    number_of_ampersands = url_string.count('&')

    standard_characters = set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/.:-_')
    number_of_other_special_characters = sum(1 for character_item in url_string if character_item not in standard_characters and character_item not in ['=', '?', '&', '%'])

    total_special_characters = number_of_equals + number_of_question_marks + number_of_ampersands + number_of_other_special_characters + number_of_obfuscated_characters
    special_character_ratio = float(total_special_characters) / float(url_length) if url_length > 0 else 0.0

    is_https = 1 if scheme_string == 'https' else 0

    return {
        'URLLength': url_length,
        'DomainLength': domain_length,
        'IsDomainIP': is_domain_ip,
        'TLDLength': top_level_domain_length,
        'NoOfSubDomain': number_of_subdomains,
        'HasObfuscation': has_obfuscation,
        'NoOfObfuscatedChar': number_of_obfuscated_characters,
        'ObfuscationRatio': obfuscation_ratio,
        'NoOfLettersInURL': number_of_letters,
        'LetterRatioInURL': letter_ratio,
        'NoOfDegitsInURL': number_of_digits,
        'DegitRatioInURL': digit_ratio,
        'NoOfEqualsInURL': number_of_equals,
        'NoOfQMarkInURL': number_of_question_marks,
        'NoOfAmpersandInURL': number_of_ampersands,
        'NoOfOtherSpecialCharsInURL': number_of_other_special_characters,
        'SpacialCharRatioInURL': special_character_ratio,
        'IsHTTPS': is_https
    }
