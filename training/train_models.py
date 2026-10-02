import os
import joblib
import numpy as numpy_module
import pandas as pandas_module
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def load_dataset_split(file_path):
    dataset_dataframe = pandas_module.read_csv(file_path)

    feature_matrix = dataset_dataframe.drop(columns=['label'])
    label_vector = dataset_dataframe['label']

    return feature_matrix, label_vector

def evaluate_model_performance(model_instance, feature_matrix, label_vector):
    predicted_labels = model_instance.predict(feature_matrix)
    predicted_probabilities = model_instance.predict_proba(feature_matrix)[:, 1]

    accuracy_value = float(accuracy_score(label_vector, predicted_labels))
    precision_value = float(precision_score(label_vector, predicted_labels))
    recall_value = float(recall_score(label_vector, predicted_labels))
    f1_score_value = float(f1_score(label_vector, predicted_labels))
    roc_auc_value = float(roc_auc_score(label_vector, predicted_probabilities))

    return {
        'accuracy': accuracy_value,
        'precision': precision_value,
        'recall': recall_value,
        'f1_score': f1_score_value,
        'roc_auc': roc_auc_value
    }

def main():
    train_file_path = os.path.join('data', 'processed', 'train.csv')
    validation_file_path = os.path.join('data', 'processed', 'val.csv')
    test_file_path = os.path.join('data', 'processed', 'test.csv')

    models_directory = 'models'
    os.makedirs(models_directory, exist_ok=True)

    train_features, train_labels = load_dataset_split(train_file_path)
    validation_features, validation_labels = load_dataset_split(validation_file_path)
    test_features, test_labels = load_dataset_split(test_file_path)

    feature_scaler = StandardScaler()
    scaled_train_features = feature_scaler.fit_transform(train_features)
    scaled_validation_features = feature_scaler.transform(validation_features)
    scaled_test_features = feature_scaler.transform(test_features)

    scaler_artifact_path = os.path.join(models_directory, 'scaler.joblib')
    joblib.dump(feature_scaler, scaler_artifact_path)

    logistic_regression_model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        C=1.0,
        solver='lbfgs'
    )
    logistic_regression_model.fit(scaled_train_features, train_labels)

    logistic_regression_artifact_path = os.path.join(models_directory, 'logistic_regression.joblib')
    joblib.dump(logistic_regression_model, logistic_regression_artifact_path)

    random_forest_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=20,
        random_state=42,
        n_jobs=-1
    )
    random_forest_model.fit(train_features, train_labels)

    random_forest_artifact_path = os.path.join(models_directory, 'random_forest.joblib')
    joblib.dump(random_forest_model, random_forest_artifact_path)

    xgboost_model = XGBClassifier(
        n_estimators=200,
        max_depth=10,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='logloss',
        n_jobs=-1
    )
    xgboost_model.fit(train_features, train_labels)

    xgboost_artifact_path = os.path.join(models_directory, 'xgboost.joblib')
    joblib.dump(xgboost_model, xgboost_artifact_path)

    logistic_regression_val_metrics = evaluate_model_performance(logistic_regression_model, scaled_validation_features, validation_labels)
    logistic_regression_test_metrics = evaluate_model_performance(logistic_regression_model, scaled_test_features, test_labels)

    random_forest_val_metrics = evaluate_model_performance(random_forest_model, validation_features, validation_labels)
    random_forest_test_metrics = evaluate_model_performance(random_forest_model, test_features, test_labels)

    xgboost_val_metrics = evaluate_model_performance(xgboost_model, validation_features, validation_labels)
    xgboost_test_metrics = evaluate_model_performance(xgboost_model, test_features, test_labels)

    print("LOGISTIC REGRESSION TEST METRICS:")
    print(logistic_regression_test_metrics)

    print("\nRANDOM FOREST TEST METRICS:")
    print(random_forest_test_metrics)

    print("\nXGBOOST TEST METRICS:")
    print(xgboost_test_metrics)

if __name__ == '__main__':
    main()
