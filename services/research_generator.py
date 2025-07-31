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
أنشئ بحثاً شاملاً ومفصلاً عن موضوع "{topic}" باللغة العربية. يجب أن يحتوي البحث على:
1. مقدمة شيقة ومفصلة تقدم الموضوع وأهميته
2. ثلاثة إلى أربعة أقسام رئيسية مع عناوين فرعية واضحة
3. كل قسم يجب أن يحتوي على معلومات مفصلة وأمثلة وتفسيرات عميقة
4. خاتمة شاملة تلخص النقاط الرئيسية وتقدم نظرة مستقبلية
5. النص يجب أن يكون طويل ومفصل (حوالي 1000-1200 كلمة)
6. استخدم تنسيق Markdown للعناوين والفقرات
7. اترك placeholders للصور: [IMAGE_PLACEHOLDER_1] و [IMAGE_PLACEHOLDER_2] في المواضع المناسبة
8. اكتب فقرات غنية بالتفاصيل والمعلومات المفيدة
9. استخدم أسلوباً أكاديمياً عميقاً مع شرح وافٍ لجميع الجوانب

اكتب البحث بأسلوب أكاديمي متعمق وشامل مع معلومات مفصلة وثرية.
            """,
            'en': f"""
Create a comprehensive and detailed research paper about "{topic}" in English. The research should include:
1. A detailed and engaging introduction that presents the topic and its importance
2. Three to four main sections with clear subheadings
3. Each section should contain detailed information, examples, and deep explanations
4. A comprehensive conclusion that summarizes key points and provides future outlook
5. The text should be long and detailed (around 1000-1200 words)
6. Use Markdown formatting for headings and paragraphs
7. Leave image placeholders: [IMAGE_PLACEHOLDER_1] and [IMAGE_PLACEHOLDER_2] in appropriate positions
8. Write paragraphs rich in details and useful information
9. Use a deep academic style with thorough explanation of all aspects

Write the research in a deep, comprehensive academic style with detailed and rich information.
            """,
            'fr': f"""
Créez un document de recherche complet et détaillé sur "{topic}" en français. La recherche devrait inclure:
1. Une introduction détaillée et engageante qui présente le sujet et son importance
2. Trois à quatre sections principales avec des sous-titres clairs
3. Chaque section doit contenir des informations détaillées, des exemples et des explications approfondies
4. Une conclusion complète qui résume les points clés et offre une perspective d'avenir
5. Le texte doit être long et détaillé (environ 1000-1200 mots)
6. Utilisez le formatage Markdown pour les titres et les paragraphes
7. Laissez des placeholders d'images: [IMAGE_PLACEHOLDER_1] et [IMAGE_PLACEHOLDER_2] aux positions appropriées
8. Rédigez des paragraphes riches en détails et en informations utiles
9. Utilisez un style académique approfondi avec une explication complète de tous les aspects

Rédigez la recherche dans un style académique approfondi et complet avec des informations détaillées et riches.
            """
        }
        
        try:
            if self.model and GEMINI_AVAILABLE:
                # Generate content using Gemini
                prompt = prompts.get(language, prompts['ar'])
                response = self.model.generate_content(prompt)
                content = response.text
            else:
                # Fallback content for testing (detailed version)
                if language == 'ar':
                    content = f"""# {topic}

## مقدمة

يُعتبر موضوع {topic} من الموضوعات الحيوية والمهمة في عصرنا الحالي، حيث يحتل مكانة بارزة في العديد من المجالات العلمية والعملية. إن فهم هذا الموضوع وتحليل جوانبه المختلفة أمر ضروري لمواكبة التطورات الحديثة والاستفادة من الفرص المتاحة. في هذا البحث الشامل، سنقوم بدراسة مفصلة وعميقة لموضوع {topic}، حيث سنستكشف تعريفاته، وتطبيقاته العملية، والتحديات التي يواجهها، بالإضافة إلى النظرة المستقبلية للموضوع. هدفنا هو تقديم فهم شامل ومتكامل يساعد القارئ على استيعاب جميع جوانب هذا الموضوع المهم.

[IMAGE_PLACEHOLDER_1]

## القسم الأول: التعريف والأساسيات المفاهيمية

### التعريف الشامل

يمكن تعريف {topic} على أنه مجال معرفي واسع يشمل العديد من العناصر والمكونات المترابطة. هذا التعريف يتطلب فهماً عميقاً للأسس النظرية والعملية التي يقوم عليها الموضوع. من خلال التحليل المفصل، نجد أن {topic} يتضمن جوانب متعددة تتداخل مع بعضها البعض لتشكل منظومة متكاملة.

### الأسس النظرية

تقوم الأسس النظرية لـ {topic} على مجموعة من المبادئ الأساسية التي تم تطويرها عبر سنوات طويلة من البحث والدراسة. هذه المبادئ تشكل الإطار العام الذي يحكم فهمنا للموضوع وتطبيقاته المختلفة. إن دراسة هذه الأسس بعمق تساعد على بناء فهم صحيح ومتين للموضوع ككل.

### العناصر الأساسية

يتكون {topic} من عدة عناصر أساسية تتفاعل مع بعضها البعض في منظومة معقدة ومتوازنة. كل عنصر من هذه العناصر له دوره المحدد ووظيفته الخاصة، ولكنها جميعاً تعمل معاً لتحقيق الأهداف الكلية للموضوع. فهم هذه العناصر وطبيعة تفاعلها أمر أساسي لإدراك كيفية عمل المنظومة ككل.

## القسم الثاني: التطبيقات والاستخدامات العملية

### التطبيقات في المجالات المختلفة

يجد {topic} تطبيقاته في مجالات متنوعة ومتعددة، مما يؤكد على أهميته وقيمته العملية. في كل مجال من هذه المجالات، يتم تطبيق مبادئ وأسس {topic} بطرق مختلفة تتناسب مع طبيعة واحتياجات كل مجال. هذا التنوع في التطبيقات يعكس المرونة والقابلية للتكيف التي يتمتع بها الموضوع.

[IMAGE_PLACEHOLDER_2]

### الفوائد والمزايا

تتعدد الفوائد التي يمكن الحصول عليها من تطبيق مبادئ {topic} في الحياة العملية. هذه الفوائد تشمل جوانب اقتصادية واجتماعية وتقنية، مما يجعل الموضوع ذا قيمة عالية في المجتمع الحديث. إن فهم هذه الفوائد وكيفية تحقيقها أمر مهم لكل من يريد الاستفادة من إمكانيات هذا المجال.

### التحديات في التطبيق

رغم الفوائد الكثيرة، إلا أن تطبيق {topic} يواجه عدداً من التحديات والصعوبات التي تتطلب حلولاً مبتكرة ومدروسة. هذه التحديات قد تكون تقنية أو اقتصادية أو اجتماعية، وتحتاج إلى نهج شامل ومتكامل للتعامل معها بفعالية.

## القسم الثالث: الاتجاهات الحديثة والتطورات المستقبلية

### التطورات الحديثة

يشهد مجال {topic} تطورات مستمرة ومتسارعة، حيث تظهر أساليب وتقنيات جديدة باستمرار. هذه التطورات تفتح آفاقاً جديدة وتقدم حلولاً مبتكرة للتحديات القائمة. من المهم متابعة هذه التطورات وفهم تأثيرها على مستقبل المجال.

### النظرة المستقبلية

تشير التوقعات إلى أن {topic} سيشهد نمواً وتطوراً كبيراً في السنوات القادمة. هذا النمو المتوقع يعتمد على عدة عوامل، منها التقدم التقني والاستثمار في البحث والتطوير. إن فهم هذه التوقعات يساعد على التخطيط الصحيح والاستعداد للمستقبل.

## خاتمة

في ختام هذا البحث الشامل، يمكننا القول أن {topic} يمثل مجالاً حيوياً ومهماً يستحق الاهتمام والدراسة المتعمقة. لقد استعرضنا في هذا البحث الجوانب المختلفة للموضوع، بدءاً من التعريفات الأساسية والأسس النظرية، مروراً بالتطبيقات العملية والفوائد المحققة، وانتهاءً بالتطورات الحديثة والتوقعات المستقبلية. إن هذا الفهم الشامل يمكّننا من تقدير أهمية الموضوع وإمكانياته الهائلة في تحسين حياتنا وتطوير مجتمعاتنا. ننصح بمواصلة البحث والدراسة في هذا المجال للاستفادة الكاملة من إمكانياته وفرصه المتنوعة."""
                elif language == 'en':
                    content = f"""# {topic}

## Introduction

The topic of {topic} represents one of the most vital and significant areas of study in our contemporary world, occupying a prominent position across numerous scientific and practical domains. Understanding this subject and analyzing its various dimensions is essential for keeping pace with modern developments and capitalizing on available opportunities. In this comprehensive research, we will conduct a detailed and in-depth examination of {topic}, exploring its definitions, practical applications, challenges it faces, and future perspectives. Our objective is to provide a holistic and integrated understanding that helps readers comprehend all aspects of this important subject.

[IMAGE_PLACEHOLDER_1]

## Section One: Definition and Conceptual Foundations

### Comprehensive Definition

{topic} can be defined as an extensive field of knowledge encompassing numerous interconnected elements and components. This definition requires a deep understanding of the theoretical and practical foundations upon which the subject is built. Through detailed analysis, we find that {topic} includes multiple aspects that interact with each other to form an integrated system.

### Theoretical Foundations

The theoretical foundations of {topic} are based on a set of fundamental principles that have been developed over many years of research and study. These principles form the general framework that governs our understanding of the subject and its various applications. Studying these foundations in depth helps build a correct and solid understanding of the subject as a whole.

### Basic Elements

{topic} consists of several basic elements that interact with each other in a complex and balanced system. Each of these elements has its specific role and particular function, but they all work together to achieve the overall objectives of the subject. Understanding these elements and the nature of their interaction is fundamental to realizing how the system works as a whole.

## Section Two: Applications and Practical Uses

### Applications in Different Fields

{topic} finds its applications in diverse and multiple fields, confirming its importance and practical value. In each of these fields, the principles and foundations of {topic} are applied in different ways that suit the nature and needs of each field. This diversity in applications reflects the flexibility and adaptability that the subject enjoys.

[IMAGE_PLACEHOLDER_2]

### Benefits and Advantages

The benefits that can be obtained from applying the principles of {topic} in practical life are numerous. These benefits include economic, social, and technical aspects, making the subject of high value in modern society. Understanding these benefits and how to achieve them is important for anyone who wants to benefit from the potential of this field.

### Implementation Challenges

Despite the many benefits, implementing {topic} faces a number of challenges and difficulties that require innovative and well-studied solutions. These challenges may be technical, economic, or social, and need a comprehensive and integrated approach to deal with them effectively.

## Section Three: Modern Trends and Future Developments

### Recent Developments

The field of {topic} is witnessing continuous and accelerating developments, with new methods and techniques appearing constantly. These developments open new horizons and provide innovative solutions to existing challenges. It is important to follow these developments and understand their impact on the future of the field.

### Future Perspective

Expectations indicate that {topic} will witness significant growth and development in the coming years. This expected growth depends on several factors, including technological advancement and investment in research and development. Understanding these expectations helps in proper planning and preparation for the future.

## Conclusion

In conclusion of this comprehensive research, we can say that {topic} represents a vital and important field that deserves attention and in-depth study. We have reviewed in this research the different aspects of the subject, starting from basic definitions and theoretical foundations, through practical applications and achieved benefits, and ending with recent developments and future expectations. This comprehensive understanding enables us to appreciate the importance of the subject and its enormous potential in improving our lives and developing our societies. We recommend continuing research and study in this field to fully benefit from its potential and diverse opportunities."""
                else:
                    # French fallback - comprehensive version
                    content = f"""# {topic}

## Introduction

Le sujet de {topic} représente l'un des domaines d'étude les plus vitaux et significatifs de notre monde contemporain, occupant une position proéminente dans de nombreux domaines scientifiques et pratiques. Comprendre ce sujet et analyser ses différentes dimensions est essentiel pour suivre le rythme des développements modernes et capitaliser sur les opportunités disponibles. Dans cette recherche complète, nous effectuerons un examen détaillé et approfondi de {topic}, explorant ses définitions, applications pratiques, défis auxquels il fait face, et perspectives d'avenir. Notre objectif est de fournir une compréhension holistique et intégrée qui aide les lecteurs à appréhender tous les aspects de ce sujet important.

[IMAGE_PLACEHOLDER_1]

## Section 1: Définition et Fondements Conceptuels

### Définition Complète

{topic} peut être défini comme un vaste domaine de connaissance englobant de nombreux éléments et composants interconnectés. Cette définition nécessite une compréhension profonde des fondements théoriques et pratiques sur lesquels le sujet est construit. Grâce à une analyse détaillée, nous constatons que {topic} inclut de multiples aspects qui interagissent entre eux pour former un système intégré.

### Fondements Théoriques

Les fondements théoriques de {topic} reposent sur un ensemble de principes fondamentaux qui ont été développés au cours de nombreuses années de recherche et d'étude. Ces principes forment le cadre général qui régit notre compréhension du sujet et ses diverses applications.

### Éléments Essentiels

{topic} se compose de plusieurs éléments essentiels qui interagissent dans un système complexe et équilibré. Chaque élément a son rôle spécifique et sa fonction particulière, mais ils travaillent tous ensemble pour atteindre les objectifs globaux du sujet.

## Section 2: Applications et Utilisations Pratiques

### Applications dans Différents Domaines

{topic} trouve ses applications dans des domaines variés et multiples, ce qui confirme son importance et sa valeur pratique. Dans chaque domaine, les principes et fondements de {topic} sont appliqués de manières différentes qui s'adaptent à la nature et aux besoins de chaque domaine.

[IMAGE_PLACEHOLDER_2]

### Avantages et Bénéfices

Les avantages qui peuvent être obtenus de l'application des principes de {topic} dans la vie pratique sont multiples. Ces avantages incluent des aspects économiques, sociaux et techniques, rendant le sujet de grande valeur dans la société moderne.

### Défis dans l'Application

Malgré les nombreux avantages, l'application de {topic} fait face à plusieurs défis et difficultés qui nécessitent des solutions innovantes et réfléchies. Ces défis peuvent être techniques, économiques ou sociaux, et nécessitent une approche complète et intégrée pour les traiter efficacement.

## Section 3: Tendances Modernes et Développements Futurs

### Développements Récents

Le domaine de {topic} connaît des développements continus et accélérés, avec de nouvelles méthodes et techniques qui apparaissent constamment. Ces développements ouvrent de nouveaux horizons et fournissent des solutions innovantes aux défis existants.

### Perspective Future

Les prévisions indiquent que {topic} connaîtra une croissance et un développement significatifs dans les années à venir. Cette croissance attendue dépend de plusieurs facteurs, notamment l'avancement technologique et l'investissement dans la recherche et le développement.

## Conclusion

En conclusion de cette recherche complète, nous pouvons dire que {topic} représente un domaine vital et important qui mérite attention et étude approfondie. Nous avons passé en revue dans cette recherche les différents aspects du sujet, en commençant par les définitions de base et les fondements théoriques, en passant par les applications pratiques et les avantages obtenus, et en terminant par les développements récents et les attentes futures. Cette compréhension complète nous permet d'apprécier l'importance du sujet et son énorme potentiel pour améliorer nos vies et développer nos sociétés."""
            
            # Process the content to add image slots
            content = self._process_image_placeholders(content, language)
            
            return content
            
        except Exception as e:
            raise Exception(f"Research generation error: {str(e)}")
    
    def _process_image_placeholders(self, content, language='ar'):
        """Convert [IMAGE_PLACEHOLDER_X] to proper HTML image slots"""
        import re
        
        # Language-specific placeholder texts
        placeholder_texts = {
            'ar': {
                'title': 'مكان مخصص للصورة رقم',
                'text': 'ضع الصورة رقم {} هنا'
            },
            'en': {
                'title': 'Image slot number',
                'text': 'Place image {} here'
            },
            'fr': {
                'title': 'Emplacement d\'image numéro',
                'text': 'Placez l\'image {} ici'
            }
        }
        
        texts = placeholder_texts.get(language, placeholder_texts['ar'])
        
        # Replace placeholders with proper HTML
        for i in range(1, 6):
            pattern = rf'\[IMAGE_PLACEHOLDER_{i}\]'
            replacement = f'<div class="image-placeholder" id="image-slot-{i}" data-slot-number="{i}" title="{texts["title"]} {i}"><i class="fas fa-image mr-2 ml-2"></i><span class="placeholder-text">{texts["text"].format(i)}</span></div>'
            content = re.sub(pattern, replacement, content)
        
        return content
