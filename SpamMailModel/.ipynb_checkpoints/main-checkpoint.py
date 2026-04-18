import joblib

# Load files
vectorizer = joblib.load("tfidf_vectorizer.pkl")
model = joblib.load("random_forest_url_classifier.pkl")

print("✅ Model & Vectorizer Loaded!")

while True:
    url = input("\nEnter URL (or 'exit'): ")

    if url.lower() == "exit":
        break

    # Transform input
    vector = vectorizer.transform([url])

    # Get probability
    probs = model.predict_proba(vector)[0]

    safe_prob = probs[0]
    malicious_prob = probs[1]

    print(f" Safe Probability: {safe_prob:.2f}")
    print(f" Malicious Probability: {malicious_prob:.2f}")