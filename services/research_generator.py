import os
import json

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

class ResearchGenerator:
    def __init__(self):
        # Configure Gemini API if available
        if GEMINI_AVAILABLE:
            api_key = os.environ.get("GEMINI_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
            else:
                self.model = None
        else:
            self.model = None
    
    def generate_research(self, topic, language='ar'):
        """Generate research content using Gemini AI"""
        
        # Language-specific prompts
        prompts = {
            'ar': f"""
أنشئ بحثاً شاملاً عن موضوع "{topic}" باللغة العربية مُحسن لحجم ورقة A4. يجب أن يحتوي البحث على:
1. مقدمة شيقة (فقرة واحدة قصيرة)
2. ثلاثة أقسام رئيسية مع عناوين فرعية
3. خاتمة مفيدة (فقرة واحدة قصيرة)
4. النص مفصل ومفيد (حوالي 600-800 كلمة لتناسب A4)
5. استخدم تنسيق Markdown للعناوين والفقرات
6. اترك placeholders للصور: [IMAGE_PLACEHOLDER_1] و [IMAGE_PLACEHOLDER_2] في المواضع المناسبة
7. اجعل الفقرات قصيرة ومتوسطة الطول (3-4 جمل لكل فقرة)
8. اترك مساحات مناسبة بين الأقسام

اكتب البحث بأسلوب أكاديمي واضح ومفهوم مع مراعاة تخطيط الصفحة.
            """,
            'en': f"""
Create a comprehensive research paper about "{topic}" in English optimized for A4 page size. The research should include:
1. An engaging introduction (one short paragraph)
2. Three main sections with subheadings
3. A useful conclusion (one short paragraph)
4. Detailed and informative text (around 600-800 words to fit A4)
5. Use Markdown formatting for headings and paragraphs
6. Leave image placeholders: [IMAGE_PLACEHOLDER_1] and [IMAGE_PLACEHOLDER_2] in appropriate positions
7. Keep paragraphs short to medium length (3-4 sentences each)
8. Leave appropriate spacing between sections

Write the research in a clear academic style considering page layout.
            """,
            'fr': f"""
Créez un document de recherche complet sur "{topic}" en français optimisé pour la taille de page A4. La recherche devrait inclure:
1. Une introduction engageante (un court paragraphe)
2. Trois sections principales avec des sous-titres
3. Une conclusion utile (un court paragraphe)
4. Texte détaillé et informatif (environ 600-800 mots pour s'adapter à A4)
5. Utilisez le formatage Markdown pour les titres et les paragraphes
6. Laissez des placeholders d'images: [IMAGE_PLACEHOLDER_1] et [IMAGE_PLACEHOLDER_2] aux positions appropriées
7. Gardez les paragraphes courts à moyens (3-4 phrases chacun)
8. Laissez des espaces appropriés entre les sections

Rédigez la recherche dans un style académique clair en considérant la mise en page.
            """
        }
        
        try:
            if self.model and GEMINI_AVAILABLE:
                # Generate content using Gemini
                prompt = prompts.get(language, prompts['ar'])
                response = self.model.generate_content(prompt)
                content = response.text
            else:
                # Fallback content for testing
                if language == 'ar':
                    content = f"""# {topic}

## مقدمة
{topic} موضوع مهم يستحق الدراسة والبحث. سنستكشف في هذا البحث الجوانب المختلفة لهذا الموضوع.

[IMAGE_PLACEHOLDER_1]

## القسم الأول: التعريف والأساسيات
هذا القسم يتناول الأساسيات والتعريفات المهمة المتعلقة بـ {topic}.

## القسم الثاني: التطبيقات والاستخدامات
يركز هذا القسم على التطبيقات العملية والاستخدامات المتنوعة.

[IMAGE_PLACEHOLDER_2]

## القسم الثالث: التحديات والمستقبل
نناقش هنا التحديات الحالية والتوقعات المستقبلية.

## خاتمة
في الختام، {topic} موضوع متنوع وغني بالمعلومات المفيدة."""
                else:
                    content = f"""# {topic}

## Introduction
{topic} is an important subject that deserves study and research. We will explore different aspects of this topic.

[IMAGE_PLACEHOLDER_1]

## Section 1: Definition and Basics
This section covers the basics and important definitions related to {topic}.

## Section 2: Applications and Uses
This section focuses on practical applications and various uses.

[IMAGE_PLACEHOLDER_2]

## Section 3: Challenges and Future
Here we discuss current challenges and future expectations.

## Conclusion
In conclusion, {topic} is a diverse topic rich in useful information."""
            
            # Process the content to add image slots
            content = self._process_image_placeholders(content)
            
            return content
            
        except Exception as e:
            raise Exception(f"Research generation error: {str(e)}")
    
    def _process_image_placeholders(self, content):
        """Convert [IMAGE_PLACEHOLDER_X] to proper HTML image slots"""
        import re
        
        # Replace [IMAGE_PLACEHOLDER_1] with proper HTML
        content = re.sub(
            r'\[IMAGE_PLACEHOLDER_1\]',
            '<div class="image-placeholder" id="image-slot-1" data-slot-number="1" title="مكان مخصص للصورة رقم 1"><i class="fas fa-image mr-2 ml-2"></i><span class="placeholder-text">ضع الصورة رقم 1 هنا</span></div>',
            content
        )
        
        content = re.sub(
            r'\[IMAGE_PLACEHOLDER_2\]',
            '<div class="image-placeholder" id="image-slot-2" data-slot-number="2" title="مكان مخصص للصورة رقم 2"><i class="fas fa-image mr-2 ml-2"></i><span class="placeholder-text">ضع الصورة رقم 2 هنا</span></div>',
            content
        )
        
        # Add more placeholders if needed
        for i in range(3, 6):
            content = re.sub(
                rf'\[IMAGE_PLACEHOLDER_{i}\]',
                f'<div class="image-placeholder" id="image-slot-{i}" data-slot-number="{i}" title="مكان مخصص للصورة رقم {i}"><i class="fas fa-image mr-2 ml-2"></i><span class="placeholder-text">ضع الصورة رقم {i} هنا</span></div>',
                content
            )
        
        return content
