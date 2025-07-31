import os
import logging
from flask import Flask, render_template, request, jsonify
from services.research_generator import ResearchGenerator
from services.image_search import ImageSearchService

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key_for_dev")

# Set Gemini API key
os.environ["GEMINI_API_KEY"] = "AIzaSyD9M0M88svvMfwkniwIPG_ECMc2wbOmrUk"

# Initialize services
research_generator = ResearchGenerator()
image_search = ImageSearchService()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate-research', methods=['POST'])
def generate_research():
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        language = data.get('language', 'ar')
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400
        
        # Generate research content
        research_content = research_generator.generate_research(topic, language)
        
        return jsonify({
            'success': True,
            'content': research_content
        })
    
    except Exception as e:
        logging.error(f"Error generating research: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to generate research: {str(e)}'
        }), 500

@app.route('/api/search-images', methods=['POST'])
def search_images():
    try:
        data = request.get_json()
        query = data.get('query', '')
        language = data.get('language', 'ar')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Search for images
        images = image_search.search_images(query, language)
        
        return jsonify({
            'success': True,
            'images': images
        })
    
    except Exception as e:
        logging.error(f"Error searching images: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to search images: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
