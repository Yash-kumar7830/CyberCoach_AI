# app.py - Backend API
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Enable CORS for React

# Load your trained model
model = joblib.load('models/url_classifier_model.pkl')
vectorizer = joblib.load('models/url_vectorizer.pkl')

# Add the same normalize_url function you used in training
def normalize_url(url):
    url = url.lower()
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    parsed = urlparse(url)
    hostname = parsed.hostname or ''
    if hostname.startswith('www.'):
        hostname = hostname[4:]
    netloc = hostname
    normalized = f"{netloc}{parsed.path}"
    normalized = re.sub(r'/$', '', normalized)
    if normalized == '':
        normalized = netloc
    return normalized

def classify_url(url):
    normalized_url = normalize_url(url)
    features = vectorizer.transform([normalized_url])
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]
    
    if prediction == 1:
        score = probability[1] * 100
    else:
        score = (1 - probability[0]) * 100
    
    if score >= 70:
        verdict = "MALICIOUS"
        risk = "High"
    elif score >= 40:
        verdict = "SUSPICIOUS"
        risk = "Medium"
    else:
        verdict = "BENIGN"
        risk = "Low"
    
    return {
        'url': url,
        'normalized_url': normalized_url,
        'score': round(score, 2),
        'verdict': verdict,
        'risk': risk,
        'is_malicious': verdict == "MALICIOUS"
    }

@app.route('/api/classify', methods=['POST'])
def classify():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    result = classify_url(url)
    return jsonify(result)

@app.route('/api/batch-classify', methods=['POST'])
def batch_classify():
    data = request.json
    urls = data.get('urls', [])
    
    results = [classify_url(url) for url in urls]
    return jsonify({'results': results})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)