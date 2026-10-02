import csv
import math
import random

def load_raw_dataset(file_path):
    with open(file_path, 'r', encoding='utf-8-sig', errors='ignore') as file_stream:
        csv_reader = csv.DictReader(file_stream)
        all_rows = list(csv_reader)
    return all_rows

def clean_dataset(all_rows, target_features, target_label_name, url_column_name):
    seen_url_strings = set()
    cleaned_rows = []

    for single_row in all_rows:
        current_url_string = single_row.get(url_column_name, "")

        if current_url_string in seen_url_strings:
            continue

        seen_url_strings.add(current_url_string)

        filtered_row = {}
        for feature_name in target_features:
            filtered_row[feature_name] = single_row[feature_name]

        filtered_row[target_label_name] = single_row[target_label_name]
        cleaned_rows.append(filtered_row)

    return cleaned_rows

def perform_stratified_split(cleaned_rows, target_label_name, random_seed=42):
    random.seed(random_seed)

    legitimate_rows = []
    phishing_rows = []

    for row_item in cleaned_rows:
        if str(row_item[target_label_name]) == '1':
            legitimate_rows.append(row_item)
        else:
            phishing_rows.append(row_item)

    random.shuffle(legitimate_rows)
    random.shuffle(phishing_rows)

    legitimate_total_count = len(legitimate_rows)
    phishing_total_count = len(phishing_rows)

    legitimate_train_count = int(math.floor(legitimate_total_count * 0.70))
    legitimate_val_count = int(math.floor(legitimate_total_count * 0.15))

    phishing_train_count = int(math.floor(phishing_total_count * 0.70))
    phishing_val_count = int(math.floor(phishing_total_count * 0.15))

    train_rows = legitimate_rows[:legitimate_train_count] + phishing_rows[:phishing_train_count]
    val_rows = legitimate_rows[legitimate_train_count:legitimate_train_count + legitimate_val_count] + phishing_rows[phishing_train_count:phishing_train_count + phishing_val_count]
    test_rows = legitimate_rows[legitimate_train_count + legitimate_val_count:] + phishing_rows[phishing_train_count + phishing_val_count:]

    random.shuffle(train_rows)
    random.shuffle(val_rows)
    random.shuffle(test_rows)

    return train_rows, val_rows, test_rows

def save_processed_csv(output_file_path, data_rows, field_names):
    with open(output_file_path, 'w', newline='', encoding='utf-8') as output_stream:
        csv_writer = csv.DictWriter(output_stream, fieldnames=field_names)
        csv_writer.writeheader()
        csv_writer.writerows(data_rows)

def main():
    raw_dataset_path = r'data/raw/PhiUSIIL_Phishing_URL_Dataset.csv'
    train_output_path = r'data/processed/train.csv'
    validation_output_path = r'data/processed/val.csv'
    test_output_path = r'data/processed/test.csv'

    target_features = [
        'URLLength', 'DomainLength', 'IsDomainIP', 'TLDLength', 'NoOfSubDomain',
        'HasObfuscation', 'NoOfObfuscatedChar', 'ObfuscationRatio', 'NoOfLettersInURL',
        'LetterRatioInURL', 'NoOfDegitsInURL', 'DegitRatioInURL', 'NoOfEqualsInURL',
        'NoOfQMarkInURL', 'NoOfAmpersandInURL', 'NoOfOtherSpecialCharsInURL',
        'SpacialCharRatioInURL', 'IsHTTPS'
    ]
    target_label_name = 'label'
    url_column_name = 'URL'

    all_raw_rows = load_raw_dataset(raw_dataset_path)

    cleaned_rows = clean_dataset(all_raw_rows, target_features, target_label_name, url_column_name)

    train_rows, validation_rows, test_rows = perform_stratified_split(cleaned_rows, target_label_name, random_seed=42)

    export_field_names = target_features + [target_label_name]

    save_processed_csv(train_output_path, train_rows, export_field_names)
    save_processed_csv(validation_output_path, validation_rows, export_field_names)
    save_processed_csv(test_output_path, test_rows, export_field_names)

    print(f"Raw rows: {len(all_raw_rows)}")
    print(f"Cleaned rows: {len(cleaned_rows)}")
    print(f"Train split: {len(train_rows)}")
    print(f"Validation split: {len(validation_rows)}")
    print(f"Test split: {len(test_rows)}")

if __name__ == '__main__':
    main()
