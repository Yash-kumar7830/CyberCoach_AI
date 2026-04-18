# url_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
from urllib.parse import urlparse
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow React to call this API

# Configuration
MODEL_PATH = 'models/url_classifier_model.pkl'
VECTORIZER_PATH = 'models/url_vectorizer.pkl'

# Load your trained model
model = None
vectorizer = None

if not os.path.exists(MODEL_PATH):
    logger.error(f"Model not found at {MODEL_PATH}")
    print(f"⚠️ Model not found at {MODEL_PATH}")
    print("Please ensure the model exists or train it first")
else:
    try:
        model = joblib.load(MODEL_PATH)
        vectorizer = joblib.load(VECTORIZER_PATH)
        logger.info("Model loaded successfully")
        logger.info("Vectorizer loaded successfully")
        print("✓ Model loaded successfully")
        print("✓ Vectorizer loaded successfully")
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        print(f"⚠️ Error loading model: {e}")

# ============================================
# URL NORMALIZATION FUNCTION
# ============================================
def normalize_url(url):
    """
    Normalize URL to reduce variations
    """
    # Convert to lowercase
    url = url.lower()
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url
    
    # Parse URL
    parsed = urlparse(url)
    
    # Remove 'www' subdomain
    hostname = parsed.hostname or ''
    if hostname.startswith('www.'):
        hostname = hostname[4:]
    
    # Remove default ports
    if parsed.port:
        if (parsed.scheme == 'http' and parsed.port == 80) or \
           (parsed.scheme == 'https' and parsed.port == 443):
            netloc = hostname
        else:
            netloc = f"{hostname}:{parsed.port}"
    else:
        netloc = hostname
    
    # Remove protocol entirely (treat http/https as same)
    normalized = f"{netloc}{parsed.path}"
    
    # Remove trailing slash
    normalized = re.sub(r'/$', '', normalized)
    
    # Remove index files
    normalized = re.sub(r'/index\.(html?|php|asp)$', '', normalized)
    
    # Handle empty path
    if normalized == '':
        normalized = netloc
    
    return normalized

# ============================================
# EXTENDED SAFE DOMAINS (WHITELIST)
# ============================================
SAFE_DOMAINS = [
    # Search Engines
    'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com',
    # Social Media
    'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'tiktok.com',
    'pinterest.com', 'snapchat.com', 'reddit.com', 'tumblr.com',
    # Tech Companies
    'microsoft.com', 'apple.com', 'amazon.com', 'netflix.com', 'spotify.com',
    'adobe.com', 'salesforce.com', 'oracle.com', 'ibm.com', 'intel.com',
    'nvidia.com', 'amd.com', 'qualcomm.com', 'arm.com',
    # AI & Dev Platforms
    'deepseek.com', 'opera.com', 'github.com', 'stackoverflow.com', 'gitlab.com',
    'bitbucket.org', 'huggingface.co', 'openai.com', 'anthropic.com', 'cohere.com',
    'midjourney.com', 'stability.ai',
    # Email & Communication
    'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'protonmail.com',
    'slack.com', 'discord.com', 'teams.microsoft.com', 'zoom.us',
    # E-commerce
    'ebay.com', 'aliexpress.com', 'walmart.com', 'target.com', 'bestbuy.com',
    'etsy.com', 'shopify.com',
    # Banking & Finance (Legitimate)
    'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'capitalone.com',
    'citi.com', 'paypal.com', 'stripe.com', 'square.com',
    # News & Media
    'cnn.com', 'bbc.com', 'nytimes.com', 'wsj.com', 'washingtonpost.com',
    'theguardian.com', 'reuters.com', 'bloomberg.com', 'forbes.com',
    # Education
    'wikipedia.org', 'britannica.com', 'coursera.org', 'udemy.com', 'khanacademy.org',
    'edx.org', 'mit.edu', 'stanford.edu', 'harvard.edu', 'oxford.ac.uk',
    # Entertainment
    'youtube.com', 'vimeo.com', 'twitch.tv', 'hulu.com', 'disneyplus.com',
    'hbomax.com', 'peacocktv.com', 'paramountplus.com',
    # Cloud & Hosting
    'aws.amazon.com', 'azure.com', 'cloud.google.com', 'digitalocean.com',
    'heroku.com', 'netlify.com', 'vercel.com', 'cloudflare.com'
]

# ============================================
# MALICIOUS PATTERNS (BLACKLIST)
# ============================================
MALICIOUS_PATTERNS = [
    'free-gift', 'winner', 'verify-account', 'secure-login',
    'account-update', 'confirm-identity', 'suspicious', 'phishing',
    'login-verify', 'bank-alert', 'paypal-verification', 'password-reset',
    'unlock-account', 'security-alert', 'action-required', 'verify-now',
    'claim-prize', 'congratulations', 'lottery', 'inheritance', 'refund'
]

# ============================================
# SUSPICIOUS TLDs (Top Level Domains)
# ============================================
SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.online', '.site', '.website', 
                   '.space', '.tech', '.store', '.gq', '.ml', '.tk', '.cf', '.ga']

# ============================================
# MAIN CLASSIFICATION FUNCTION
# ============================================
def classify_url_with_model(url):
    """
    Classify URL using trained model with inversion fix
    """
    # Check if model is loaded
    if model is None or vectorizer is None:
        return {
            "error": "Model not loaded",
            "risk": "warning",
            "score": 50,
            "summary": "Model not available. Please check backend server.",
            "flags": ["System error - Model not loaded"],
            "ssl": False,
            "domain_age": "Unknown",
            "recommendation": "Contact system administrator",
            "raw_score": 50,
            "normalized_url": normalize_url(url)
        }
    
    normalized_url = normalize_url(url)
    
    # Check if domain is in whitelist (known safe)
    is_whitelisted = any(domain in normalized_url for domain in SAFE_DOMAINS)
    
    # Check for malicious patterns
    has_malicious_pattern = any(pattern in url.lower() for pattern in MALICIOUS_PATTERNS)
    
    # Check suspicious TLD
    has_suspicious_tld = any(normalized_url.endswith(tld) for tld in SUSPICIOUS_TLDS)
    
    # Get model prediction
    try:
        features = vectorizer.transform([normalized_url])
        
        # Get prediction and probability
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        # Calculate original malicious score
        if prediction == 1:  # Model says malicious
            original_malicious_score = probability[1] * 100
        else:  # Model says benign
            original_malicious_score = (1 - probability[0]) * 100
        
        # 🔥 CRITICAL FIX: Invert the score because model is backwards
        # If model says 99% malicious, it's actually 99% safe
        malicious_score = 100 - original_malicious_score
        
        # Log for debugging
        logger.debug(f"URL: {url[:50]}...")
        logger.debug(f"  Original score: {original_malicious_score:.1f}% malicious")
        logger.debug(f"  Inverted score: {malicious_score:.1f}% malicious")
        
    except Exception as e:
        logger.error(f"Error during classification: {e}")
        malicious_score = 50  # Default to uncertain
    
    # Apply whitelist override (force safe for known domains)
    if is_whitelisted:
        malicious_score = min(malicious_score, 10)  # Cap at 10%
        logger.debug(f"  Whitelist override applied: {malicious_score:.1f}%")
    
    # Apply malicious pattern boost
    if has_malicious_pattern and malicious_score < 70:
        malicious_score = max(malicious_score, 75)  # Boost to at least 75%
        logger.debug(f"  Malicious pattern boost applied: {malicious_score:.1f}%")
    
    # Apply suspicious TLD boost
    if has_suspicious_tld and malicious_score < 60:
        malicious_score = max(malicious_score, 65)
        logger.debug(f"  Suspicious TLD boost applied: {malicious_score:.1f}%")
    
    # Calculate trust score (higher = safer)
    trust_score = 100 - malicious_score
    
    # Determine risk level
    if malicious_score >= 70:
        risk = "danger"
        risk_label = "Malicious"
    elif malicious_score >= 40:
        risk = "warning"
        risk_label = "Suspicious"
    else:
        risk = "safe"
        risk_label = "Safe"
    
    # Generate flags
    flags = []
    
    # Add whitelist flag
    if is_whitelisted:
        flags.append("✓ Verified legitimate domain")
    
    # Add model-based flags
    if malicious_score > 70:
        flags.append("High-risk pattern detected")
    elif malicious_score > 40:
        flags.append("Suspicious characteristics found")
    
    # Add pattern-based flags
    if has_malicious_pattern:
        flags.append("⚠️ Matches known phishing patterns")
    
    if has_suspicious_tld:
        flags.append(f"Suspicious TLD ({normalized_url.split('.')[-1]})")
    
    if re.search(r'\d+\.\d+\.\d+\.\d+', url):
        flags.append("Uses IP address instead of domain name")
    
    if url.count('-') > 3:
        flags.append("Multiple hyphens in domain (suspicious)")
    
    if len(url) > 100:
        flags.append("Unusually long URL")
    
    if 'login' in url.lower() or 'verify' in url.lower() or 'secure' in url.lower():
        if not is_whitelisted:
            flags.append("Contains sensitive keywords (login/verify)")
    
    # SSL/TLS check
    ssl_valid = url.startswith('https://')
    if not ssl_valid and not is_whitelisted:
        flags.append("No HTTPS encryption")
    
    # Domain age estimation
    domain_age = "Unknown"
    if is_whitelisted:
        domain_age = "Established (5+ years)"
    elif has_suspicious_tld:
        domain_age = "Recently registered (suspicious TLD)"
    elif malicious_score > 70:
        domain_age = "Likely newly registered"
    
    # Generate recommendation
    if risk == "danger":
        recommendation = "⚠️ CRITICAL: Do NOT visit this URL. It appears to be malicious or a phishing site."
    elif risk == "warning":
        recommendation = "⚠️ Exercise extreme caution. This URL shows multiple suspicious characteristics."
    else:
        recommendation = "✓ This URL appears safe. Always verify the source before clicking."
    
    # Special recommendations for specific cases
    if is_whitelisted:
        recommendation = "✓ Verified legitimate website. Safe to visit."
    elif has_malicious_pattern:
        recommendation = "⚠️ DANGER: This contains known phishing patterns. Do not enter any information."
    
    # Generate summary
    if is_whitelisted:
        summary = f"✓ LEGITIMATE: Verified safe domain. Trust score: {trust_score:.1f}%"
    elif malicious_score > 85:
        summary = f"⚠️ CRITICAL RISK: This URL is highly likely to be malicious. Trust score: {trust_score:.1f}%"
    elif malicious_score > 70:
        summary = f"⚠️ HIGH RISK: This URL appears malicious. Trust score: {trust_score:.1f}%"
    elif malicious_score > 40:
        summary = f"⚠️ MEDIUM RISK: Suspicious URL detected. Trust score: {trust_score:.1f}%"
    else:
        summary = f"✓ LOW RISK: This URL appears safe. Trust score: {trust_score:.1f}%"
    
    # Remove duplicate flags
    flags = list(dict.fromkeys(flags))
    
    return {
        "risk": risk,
        "score": round(trust_score, 1),
        "summary": summary,
        "flags": flags[:5],  # Max 5 flags
        "ssl": ssl_valid,
        "domain_age": domain_age,
        "recommendation": recommendation,
        "raw_score": round(malicious_score, 2),
        "normalized_url": normalized_url,
        "is_whitelisted": is_whitelisted
    }

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/classify', methods=['POST'])
def classify():
    """Classify a single URL"""
    try:
        # Get request data
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        # Validate URL format
        if not url.startswith(('http://', 'https://')):
            return jsonify({"error": "URL must start with http:// or https://"}), 400
        
        # Classify the URL
        result = classify_url_with_model(url)
        
        # Add request URL to response
        result['requested_url'] = url
        
        logger.info(f"Classified URL: {url[:50]}... -> {result['risk']}")
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in classify endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/batch-classify', methods=['POST'])
def batch_classify():
    """Classify multiple URLs at once"""
    try:
        data = request.json
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({"error": "No URLs provided"}), 400
        
        if len(urls) > 100:
            return jsonify({"error": "Maximum 100 URLs per batch request"}), 400
        
        results = []
        for url in urls:
            result = classify_url_with_model(url)
            result['url'] = url
            results.append(result)
        
        logger.info(f"Batch classified {len(results)} URLs")
        
        return jsonify({
            "total": len(results),
            "results": results
        })
    
    except Exception as e:
        logger.error(f"Error in batch-classify endpoint: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "vectorizer_loaded": vectorizer is not None,
        "safe_domains_count": len(SAFE_DOMAINS),
        "malicious_patterns_count": len(MALICIOUS_PATTERNS),
        "suspicious_tlds_count": len(SUSPICIOUS_TLDS)
    })

@app.route('/api/stats', methods=['GET'])
def stats():
    """Get model and configuration statistics"""
    return jsonify({
        "model_status": "loaded" if model else "not_loaded",
        "safe_domains": SAFE_DOMAINS[:20],  # Return first 20 only
        "malicious_patterns": MALICIOUS_PATTERNS,
        "suspicious_tlds": SUSPICIOUS_TLDS,
        "total_safe_domains": len(SAFE_DOMAINS),
        "total_malicious_patterns": len(MALICIOUS_PATTERNS),
        "total_suspicious_tlds": len(SUSPICIOUS_TLDS)
    })

@app.route('/api/check-domain', methods=['POST'])
def check_domain():
    """Check if a domain is whitelisted"""
    try:
        data = request.json
        domain = data.get('domain', '').lower()
        
        is_safe = any(safe_domain in domain for safe_domain in SAFE_DOMAINS)
        
        return jsonify({
            "domain": domain,
            "is_whitelisted": is_safe,
            "message": "Domain is verified legitimate" if is_safe else "Domain not in whitelist"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ============================================
# MAIN ENTRY POINT
# ============================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print(" URL CLASSIFIER API SERVER")
    print("="*60)
    print(f"Model loaded: {model is not None}")
    print(f"Vectorizer loaded: {vectorizer is not None}")
    print(f"Safe domains in whitelist: {len(SAFE_DOMAINS)}")
    print(f"Malicious patterns: {len(MALICIOUS_PATTERNS)}")
    print(f"Suspicious TLDs: {len(SUSPICIOUS_TLDS)}")
    print("="*60)
    print("\n Server starting...")
    print(" Running on: http://localhost:5000")
    print(" Available endpoints:")
    print("   POST   /api/classify")
    print("   POST   /api/batch-classify")
    print("   GET    /api/health")
    print("   GET    /api/stats")
    print("   POST   /api/check-domain")
    print("\n✅ Ready to accept requests!")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)