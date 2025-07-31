// Tutorial system for first-time visitors
class TutorialGuide {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.steps = [];
        this.overlay = null;
        this.tooltip = null;
        this.language = 'ar'; // Default language
        
        this.initSteps();
        this.createOverlay();
        this.createTooltip();
    }
    
    initSteps() {
        this.steps = {
            'ar': [
                {
                    target: '#topicInput',
                    title: 'مرحباً بك في مساعد الأبحاث الذكي!',
                    content: 'ابدأ بكتابة موضوع البحث الذي تريد إنشاءه هنا. مثال: "الذكاء الاصطناعي" أو "التغير المناخي"',
                    position: 'bottom'
                },
                {
                    target: '.lang-switch',
                    title: 'اختر اللغة',
                    content: 'يمكنك اختيار لغة البحث من هنا: العربية، الفرنسية، أو الإنجليزية',
                    position: 'bottom'
                },
                {
                    target: '#generateBtn',
                    title: 'إنشاء البحث',
                    content: 'اضغط هنا لبدء إنشاء البحث بالذكاء الاصطناعي. سيتم إنشاء محتوى شامل ومفصل',
                    position: 'top'
                },
                {
                    target: '#imageGrid',
                    title: 'معرض الصور',
                    content: 'بعد إنشاء البحث، ستظهر هنا صور مناسبة للموضوع يمكنك إضافتها للبحث',
                    position: 'left'
                },
                {
                    target: '#researchOutputContent',
                    title: 'نتيجة البحث',
                    content: 'سيظهر البحث المُنشأ هنا. يمكنك إضافة الصور بالضغط على الأماكن المخصصة لها',
                    position: 'left'
                },
                {
                    target: '#downloadPdfBtn',
                    title: 'تحميل PDF',
                    content: 'بعد إضافة الصور، يمكنك تحميل البحث كملف PDF جاهز للطباعة أو المشاركة',
                    position: 'top'
                }
            ],
            'en': [
                {
                    target: '#topicInput',
                    title: 'Welcome to Smart Research Assistant!',
                    content: 'Start by writing the research topic you want to create here. Example: "Artificial Intelligence" or "Climate Change"',
                    position: 'bottom'
                },
                {
                    target: '.lang-switch',
                    title: 'Choose Language',
                    content: 'You can select the research language from here: Arabic, French, or English',
                    position: 'bottom'
                },
                {
                    target: '#generateBtn',
                    title: 'Generate Research',
                    content: 'Click here to start generating research with AI. Comprehensive and detailed content will be created',
                    position: 'top'
                },
                {
                    target: '#imageGrid',
                    title: 'Image Gallery',
                    content: 'After generating research, relevant images for the topic will appear here that you can add to the research',
                    position: 'left'
                },
                {
                    target: '#researchOutputContent',
                    title: 'Research Result',
                    content: 'The generated research will appear here. You can add images by clicking on their designated spots',
                    position: 'left'
                },
                {
                    target: '#downloadPdfBtn',
                    title: 'Download PDF',
                    content: 'After adding images, you can download the research as a PDF file ready for printing or sharing',
                    position: 'top'
                }
            ],
            'fr': [
                {
                    target: '#topicInput',
                    title: 'Bienvenue dans l\'Assistant de Recherche Intelligent!',
                    content: 'Commencez par écrire le sujet de recherche que vous voulez créer ici. Exemple: "Intelligence Artificielle" ou "Changement Climatique"',
                    position: 'bottom'
                },
                {
                    target: '.lang-switch',
                    title: 'Choisir la Langue',
                    content: 'Vous pouvez sélectionner la langue de recherche ici: Arabe, Français, ou Anglais',
                    position: 'bottom'
                },
                {
                    target: '#generateBtn',
                    title: 'Générer la Recherche',
                    content: 'Cliquez ici pour commencer à générer la recherche avec l\'IA. Un contenu complet et détaillé sera créé',
                    position: 'top'
                },
                {
                    target: '#imageGrid',
                    title: 'Galerie d\'Images',
                    content: 'Après la génération de la recherche, des images pertinentes pour le sujet apparaîtront ici que vous pouvez ajouter à la recherche',
                    position: 'left'
                },
                {
                    target: '#researchOutputContent',
                    title: 'Résultat de la Recherche',
                    content: 'La recherche générée apparaîtra ici. Vous pouvez ajouter des images en cliquant sur leurs emplacements désignés',
                    position: 'left'
                },
                {
                    target: '#downloadPdfBtn',
                    title: 'Télécharger PDF',
                    content: 'Après avoir ajouté des images, vous pouvez télécharger la recherche comme fichier PDF prêt pour l\'impression ou le partage',
                    position: 'top'
                }
            ]
        };
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: none;
            pointer-events: none;
        `;
        document.body.appendChild(this.overlay);
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        this.tooltip.style.cssText = `
            position: fixed;
            background: #1e293b;
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            max-width: 320px;
            display: none;
            border: 2px solid #3b82f6;
        `;
        document.body.appendChild(this.tooltip);
    }
    
    start(language = 'ar') {
        this.language = language;
        this.currentStep = 0;
        this.isActive = true;
        this.showOverlay();
        this.showStep();
    }
    
    showOverlay() {
        this.overlay.style.display = 'block';
        setTimeout(() => {
            this.overlay.style.opacity = '1';
        }, 10);
    }
    
    hideOverlay() {
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 300);
    }
    
    showStep() {
        if (this.currentStep >= this.steps[this.language].length) {
            this.finish();
            return;
        }
        
        const step = this.steps[this.language][this.currentStep];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.nextStep();
            return;
        }
        
        this.highlightElement(target);
        this.showTooltip(step, target);
    }
    
    highlightElement(element) {
        // Remove previous highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Add highlight to current element
        element.classList.add('tutorial-highlight');
        element.style.position = 'relative';
        element.style.zIndex = '9999';
        element.style.boxShadow = '0 0 0 4px #3b82f6, 0 0 0 8px rgba(59, 130, 246, 0.3)';
        element.style.borderRadius = '8px';
    }
    
    showTooltip(step, target) {
        const rect = target.getBoundingClientRect();
        
        // Create tooltip content
        const nextText = this.language === 'ar' ? 'التالي' : this.language === 'fr' ? 'Suivant' : 'Next';
        const skipText = this.language === 'ar' ? 'تخطي الجولة' : this.language === 'fr' ? 'Ignorer' : 'Skip Tour';
        const stepText = this.language === 'ar' ? 'خطوة' : this.language === 'fr' ? 'Étape' : 'Step';
        const ofText = this.language === 'ar' ? 'من' : this.language === 'fr' ? 'sur' : 'of';
        
        this.tooltip.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #3b82f6; font-size: 1.1rem;">${step.title}</h4>
                <p style="margin: 0; line-height: 1.5; color: #e2e8f0;">${step.content}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #94a3b8; font-size: 0.9rem;">
                    ${stepText} ${this.currentStep + 1} ${ofText} ${this.steps[this.language].length}
                </span>
                <div>
                    <button id="tutorialSkip" style="
                        background: #64748b; 
                        color: white; 
                        border: none; 
                        padding: 8px 12px; 
                        border-radius: 6px; 
                        margin-right: 10px; 
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">${skipText}</button>
                    <button id="tutorialNext" style="
                        background: #3b82f6; 
                        color: white; 
                        border: none; 
                        padding: 8px 16px; 
                        border-radius: 6px; 
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">${nextText}</button>
                </div>
            </div>
        `;
        
        // Position tooltip
        this.positionTooltip(step.position, rect);
        
        // Show tooltip
        this.tooltip.style.display = 'block';
        
        // Add event listeners
        document.getElementById('tutorialNext').onclick = () => this.nextStep();
        document.getElementById('tutorialSkip').onclick = () => this.finish();
    }
    
    positionTooltip(position, rect) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        let top, left;
        
        switch (position) {
            case 'bottom':
                top = rect.bottom + 15;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'top':
                top = rect.top - tooltipRect.height - 15;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 15;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 15;
                break;
            default:
                top = rect.bottom + 15;
                left = rect.left;
        }
        
        // Ensure tooltip stays within viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = 10;
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = window.innerHeight - tooltipRect.height - 10;
        }
        
        this.tooltip.style.top = top + 'px';
        this.tooltip.style.left = left + 'px';
    }
    
    nextStep() {
        this.currentStep++;
        this.showStep();
    }
    
    finish() {
        this.isActive = false;
        this.hideOverlay();
        this.tooltip.style.display = 'none';
        
        // Remove highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
            el.style.position = '';
            el.style.zIndex = '';
            el.style.boxShadow = '';
            el.style.borderRadius = '';
        });
        
        // Mark tutorial as completed
        localStorage.setItem('tutorialCompleted', 'true');
    }
    
    isFirstVisit() {
        return !localStorage.getItem('tutorialCompleted');
    }
}

// Initialize tutorial
let tutorial = null;

// Function to start tutorial
function startTutorial(language = 'ar') {
    if (!tutorial) {
        tutorial = new TutorialGuide();
    }
    tutorial.start(language);
}

// Auto-start tutorial for first-time visitors
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (!tutorial) {
            tutorial = new TutorialGuide();
        }
        
        if (tutorial.isFirstVisit()) {
            // Wait a bit for the page to fully load
            setTimeout(() => {
                startTutorial(currentLanguage || 'ar');
            }, 1500);
        }
    }, 500);
});