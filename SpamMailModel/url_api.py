# url_api.py - Complete working version for React frontend
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from urllib.parse import urlparse
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

# Enable CORS for your React app (Vite runs on port 5173)
CORS(app, origins=[
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
])

# Or allow all origins for development (simpler)
# CORS(app, resources={r"/api/*": {"origins": "*"}})

# ============================================================================
# WHITELIST - Known safe domains
# ============================================================================

SAFE_DOMAINS = [
    # Search Engines
    'google.com', 'youtube.com', 'gmail.com', 'drive.google.com',
    'bing.com', 'yahoo.com', 'duckduckgo.com',
    
    # Social Media
    'facebook.com', 'instagram.com', 'whatsapp.com', 'twitter.com',
    'linkedin.com', 'github.com', 'gitlab.com', 'stackoverflow.com',
    'reddit.com', 'pinterest.com', 'tumblr.com',
    
    # Tech Companies
    'microsoft.com', 'outlook.com', 'office.com', 'apple.com', 'icloud.com',
    'amazon.com', 'aws.amazon.com', 'netflix.com', 'spotify.com',
    'openai.com', 'anthropic.com', 'deepseek.com', 'huggingface.co',
    'cohere.com', 'replicate.com', 'vercel.com', 'netlify.com',
    
    # Payment & Banking
    'paypal.com', 'stripe.com', 'square.com', 'chase.com',
    'bankofamerica.com', 'wellsfargo.com', 'capitalone.com',
    
    # Other Safe Sites
    'wikipedia.org', 'cloudflare.com', 'zoom.us', 'slack.com',
    'discord.com', 'twitch.tv', 'medium.com', 'dev.to'
]

# ============================================================================
# SUSPICIOUS PATTERNS
# ============================================================================

SUSPICIOUS_TLDS = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.club', '.online', '.site', '.space']

PHISHING_KEYWORDS = [
    'login', 'verify', 'account', 'secure', 'update', 'confirm', 
    'signin', 'password', 'banking', 'paypal', 'amazon', 'netflix',
    'verify-account', 'secure-login', 'account-update', 'password-reset'
]

# ============================================================================
# CLASSIFICATION FUNCTION
# ============================================================================

def classify_url(url):
    """Classify URL and return response matching React frontend expectations"""
    
    # Normalize URL
    original_url = url
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Check whitelist
    is_whitelisted = any(domain in url.lower() for domain in SAFE_DOMAINS)
    
    # Calculate malicious score (0-100)
    malicious_score = 0
    flags = []
    
    # URL structure checks
    if is_whitelisted:
        malicious_score = 0
        flags.append("✅ Verified legitimate domain")
    else:
        # Check for IP address
        if re.search(r'\d+\.\d+\.\d+\.\d+', url):
            malicious_score += 30
            flags.append("⚠️ Uses IP address instead of domain name")
        
        # Check for suspicious TLD
        if any(url.lower().endswith(tld) for tld in SUSPICIOUS_TLDS):
            malicious_score += 35
            flags.append("⚠️ Suspicious top-level domain detected")
        
        # Check for phishing keywords
        keyword_matches = [kw for kw in PHISHING_KEYWORDS if kw in url.lower()]
        if keyword_matches:
            malicious_score += 40
            flags.append(f"⚠️ Contains suspicious keywords: {keyword_matches[0]}")
        
        # Check URL length
        if len(url) > 100:
            malicious_score += 10
            flags.append("⚠️ Unusually long URL")
        
        # Check for multiple hyphens
        if url.count('-') > 3:
            malicious_score += 10
            flags.append("⚠️ Multiple hyphens in domain")
        
        # Check for HTTPS
        if not url.startswith('https://'):
            malicious_score += 15
            flags.append("⚠️ No HTTPS encryption")
        
        # Check for multiple subdomains
        try:
            parsed = urlparse(url)
            hostname = parsed.hostname or ''
            if hostname.count('.') > 2:
                malicious_score += 10
                flags.append("⚠️ Multiple subdomains detected")
        except:
            pass
        
        # Check for @ symbol
        if '@' in url:
            malicious_score += 25
            flags.append("⚠️ Contains @ symbol (URL spoofing)")
        
        # Check for double slash after domain
        if '//' in url[url.find('//')+2:]:
            malicious_score += 10
            flags.append("⚠️ Unusual URL structure")
        
        # Cap score at 100
        malicious_score = min(malicious_score, 100)
    
    # Calculate trust score
    trust_score = 100 - malicious_score
    
    # Determine risk level
    if malicious_score >= 70:
        risk = "danger"
        summary = f"⚠️ HIGH RISK: This URL appears malicious. Trust score: {trust_score:.1f}%"
        recommendation = "⚠️ CRITICAL: Do NOT visit this URL. It appears to be malicious or a phishing site."
    elif malicious_score >= 40:
        risk = "warning"
        summary = f"⚠️ MEDIUM RISK: Suspicious URL detected. Trust score: {trust_score:.1f}%"
        recommendation = "⚠️ Exercise extreme caution. This URL shows multiple suspicious characteristics."
    else:
        risk = "safe"
        summary = f"✓ LOW RISK: This URL appears safe. Trust score: {trust_score:.1f}%"
        recommendation = "✓ This URL appears safe. Always verify the source before clicking."
    
    # Override for whitelisted domains
    if is_whitelisted:
        risk = "safe"
        summary = f"✓ LEGITIMATE: Verified safe domain. Trust score: {trust_score:.1f}%"
        recommendation = "✓ Verified legitimate website. Safe to visit."
        flags = ["✅ Verified legitimate domain"]
    
    # SSL status
    ssl_valid = url.startswith('https://')
    
    # Domain age (simplified for API)
    if is_whitelisted:
        domain_age = "Established (5+ years)"
    elif malicious_score > 70:
        domain_age = "Likely newly registered"
    else:
        domain_age = "Unknown"
    
    # Return response matching React frontend expectations
    return {
        'risk': risk,
        'score': round(trust_score, 1),
        'summary': summary,
        'flags': flags,
        'ssl': ssl_valid,
        'domain_age': domain_age,
        'recommendation': recommendation,
        'raw_score': round(malicious_score, 2),
        'url': original_url,
        'timestamp': datetime.now().isoformat()
    }

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/v2/classify', methods=['POST'])
def classify_url_endpoint():
    """Main classification endpoint - called by React frontend"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        url = data.get('url', '')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Validate URL format
        if not url.startswith(('http://', 'https://')):
            # Don't auto-add https, just warn
            pass
        
        # Classify the URL
        result = classify_url(url)
        
        print(f"✅ {datetime.now().strftime('%H:%M:%S')} - {url[:50]}... -> {result['risk']} (score: {result['score']})")
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint - for testing connection"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': False,  # Using rule-based for now
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'endpoints': ['/api/v2/classify', '/api/health']
    })

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Simple test endpoint"""
    return jsonify({
        'message': 'Backend is working!',
        'status': 'online',
        'port': 5000
    })

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🔐 PHISHING URL DETECTOR API")
    print("="*60)
    print("\n📡 API Endpoints:")
    print("   POST /api/v2/classify  - URL classification")
    print("   GET  /api/health       - Health check")
    print("   GET  /api/test         - Test connection")
    
    print("\n📍 Server running on:")
    print("   http://localhost:5000")
    print("   http://127.0.0.1:5000")
    
    print("\n🔗 React app should connect to:")
    print("   http://localhost:5000/api/v2/classify")
    
    print("\n⚠️  Running in rule-based mode (no ML model)")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)