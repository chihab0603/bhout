import os
import requests
import logging
from ddgs import DDGS

class ImageSearchService:
    def __init__(self):
        self.ddgs = DDGS()
    
    def search_images(self, query, language='ar', max_results=10):
        """Search for images using DuckDuckGo"""
        try:
            # Translate query based on language for better results
            search_query = self._prepare_query(query, language)
            
            logging.info(f"Searching images for query: {search_query}")
            
            # Search for images using DuckDuckGo
            results = list(self.ddgs.images(
                search_query,
                region="wt-wt",  # Worldwide
                safesearch="moderate",
                size="medium",
                max_results=max_results
            ))
            
            # Process and filter results
            processed_images = []
            for i, result in enumerate(results):
                try:
                    # Verify image is accessible
                    image_url = result.get('image', '')
                    if self._is_image_accessible(image_url):
                        processed_images.append({
                            'id': i + 1,
                            'url': image_url,
                            'thumbnail': result.get('thumbnail', image_url),
                            'title': result.get('title', ''),
                            'source': result.get('source', ''),
                            'width': result.get('width', 0),
                            'height': result.get('height', 0)
                        })
                except Exception as e:
                    logging.warning(f"Error processing image result: {str(e)}")
                    continue
            
            logging.info(f"Found {len(processed_images)} accessible images")
            return processed_images
            
        except Exception as e:
            logging.error(f"Error searching images: {str(e)}")
            raise Exception(f"Failed to search images: {str(e)}")
    
    def _prepare_query(self, query, language):
        """Prepare search query based on language"""
        # Add language-specific keywords for better results
        if language == 'ar':
            return f"{query} صور عالية الجودة"
        elif language == 'fr':
            return f"{query} images haute qualité"
        else:  # English
            return f"{query} high quality images"
    
    def _is_image_accessible(self, url):
        """Check if image URL is accessible"""
        try:
            response = requests.head(url, timeout=5, allow_redirects=True)
            content_type = response.headers.get('content-type', '').lower()
            return (
                response.status_code == 200 and
                any(img_type in content_type for img_type in ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
            )
        except:
            return False
    
    def get_image_data(self, image_url):
        """Download image data for embedding in PDF"""
        try:
            response = requests.get(image_url, timeout=10)
            if response.status_code == 200:
                return response.content
            return None
        except Exception as e:
            logging.error(f"Error downloading image: {str(e)}")
            return None
