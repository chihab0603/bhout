// Global state
let currentLanguage = 'ar';
let generatedImages = [];
let selectedImageForPlacement = null;

// Language configurations
const translations = {
    ar: {
        appTitle: 'مساعد الأبحاث الذكي',
        topicLabel: 'أدخل موضوع البحث',
        topicPlaceholder: 'مثال: المجموعة الشمسية',
        generateBtnText: 'إنشاء البحث',
        downloadBtnText: 'تحميل كملف PDF',
        imageSidebarTitle: 'معرض الصور',
        placeholderTitle: 'سيظهر بحثك هنا',
        placeholderText: 'أدخل موضوعاً واضغط على زر الإنشاء لتبدأ.',
        modalTitle: 'اختر مكان وضع الصورة',
        cancelText: 'إلغاء',
        generating: 'جاري الإنشاء...',
        searchingImages: 'جاري البحث عن الصور...',
        error: 'حدث خطأ',
        success: 'تم بنجاح',
        translateBtnTitle: 'ترجمة الموضوع',
        translating: 'جاري الترجمة...'
    },
    en: {
        appTitle: 'Smart Research Assistant',
        topicLabel: 'Enter Research Topic',
        topicPlaceholder: 'Example: Solar System',
        generateBtnText: 'Generate Research',
        downloadBtnText: 'Download as PDF',
        imageSidebarTitle: 'Image Gallery',
        placeholderTitle: 'Your research will appear here',
        placeholderText: 'Enter a topic and click generate to start.',
        modalTitle: 'Choose image placement',
        cancelText: 'Cancel',
        generating: 'Generating...',
        searchingImages: 'Searching for images...',
        error: 'An error occurred',
        success: 'Success',
        translateBtnTitle: 'Translate Topic',
        translating: 'Translating...'
    },
    fr: {
        appTitle: 'Assistant de Recherche Intelligent',
        topicLabel: 'Entrez le Sujet de Recherche',
        topicPlaceholder: 'Exemple: Système Solaire',
        generateBtnText: 'Générer la Recherche',
        downloadBtnText: 'Télécharger en PDF',
        imageSidebarTitle: 'Galerie d\'Images',
        placeholderTitle: 'Votre recherche apparaîtra ici',
        placeholderText: 'Entrez un sujet et cliquez sur générer pour commencer.',
        modalTitle: 'Choisir l\'emplacement de l\'image',
        cancelText: 'Annuler',
        generating: 'Génération...',
        searchingImages: 'Recherche d\'images...',
        error: 'Une erreur s\'est produite',
        success: 'Succès',
        translateBtnTitle: 'Traduire le Sujet',
        translating: 'Traduction...'
    }
};

// DOM Elements
const elements = {
    arBtn: document.getElementById('arBtn'),
    frBtn: document.getElementById('frBtn'),
    enBtn: document.getElementById('enBtn'),
    appTitle: document.getElementById('appTitle'),
    topicLabel: document.getElementById('topicLabel'),
    topicInput: document.getElementById('topicInput'),
    translateBtn: document.getElementById('translateBtn'),
    translateBtnIcon: document.getElementById('translateBtnIcon'),
    generateBtn: document.getElementById('generateBtn'),
    generateBtnText: document.getElementById('generateBtnText'),
    generateBtnIcon: document.getElementById('generateBtnIcon'),
    downloadPdfBtn: document.getElementById('downloadPdfBtn'),
    downloadBtnText: document.getElementById('downloadBtnText'),
    imageSidebarTitle: document.getElementById('imageSidebarTitle'),
    outputPlaceholder: document.getElementById('outputPlaceholder'),
    placeholderTitle: document.getElementById('placeholderTitle'),
    placeholderText: document.getElementById('placeholderText'),
    loader: document.getElementById('loader'),
    researchOutputContainer: document.getElementById('researchOutputContainer'),
    researchOutputContent: document.getElementById('researchOutputContent'),
    imagePanelLoader: document.getElementById('imagePanelLoader'),
    imageGrid: document.getElementById('imageGrid'),
    placementModal: document.getElementById('placementModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalSlots: document.getElementById('modalSlots'),
    cancelPlacement: document.getElementById('cancelPlacement'),
    cancelText: document.getElementById('cancelText')
};

// Language switching for content generation and interface direction
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(lang + 'Btn').classList.add('active');
    
    // Update text direction and language based on selection
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }
    
    // Update container class to show selected language for content
    elements.researchOutputContainer.className = `research-output-container content-lang-${lang} rounded-lg shadow-lg p-8 overflow-y-auto w-full`;
    
    // Update interface text based on selected language
    const t = translations[lang];
    elements.appTitle.textContent = t.appTitle;
    elements.topicLabel.textContent = t.topicLabel;
    elements.topicInput.placeholder = t.topicPlaceholder;
    elements.generateBtnText.textContent = t.generateBtnText;
    elements.downloadBtnText.textContent = t.downloadBtnText;
    elements.imageSidebarTitle.textContent = t.imageSidebarTitle;
    elements.placeholderTitle.textContent = t.placeholderTitle;
    elements.placeholderText.textContent = t.placeholderText;
    elements.modalTitle.textContent = t.modalTitle;
    elements.cancelText.textContent = t.cancelText;
    elements.translateBtn.title = t.translateBtnTitle;
    
    // Show language selection indicator
    updateLanguageIndicator(lang);
}

// Add language indicator function
function updateLanguageIndicator(lang) {
    const langNames = {
        'ar': { ar: 'العربية', en: 'Arabic', fr: 'Arabe' },
        'en': { ar: 'الإنجليزية', en: 'English', fr: 'Anglais' }, 
        'fr': { ar: 'الفرنسية', en: 'French', fr: 'Français' }
    };
    
    const labels = {
        'ar': 'لغة المحتوى المُنشأ',
        'en': 'Content Language', 
        'fr': 'Langue du Contenu'
    };
    
    // Update any existing language indicator or create one
    let indicator = document.getElementById('languageIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'languageIndicator';
        indicator.className = 'text-sm text-gray-600 dark:text-gray-300 text-center mt-2';
        elements.topicInput.parentNode.appendChild(indicator);
    }
    
    indicator.textContent = `${labels[currentLanguage]}: ${langNames[lang][currentLanguage]}`;
}

// Event listeners for language buttons
elements.arBtn.addEventListener('click', () => switchLanguage('ar'));
elements.frBtn.addEventListener('click', () => switchLanguage('fr'));
elements.enBtn.addEventListener('click', () => switchLanguage('en'));

// Event listener for translate button
elements.translateBtn.addEventListener('click', translateTopic);

// Translate topic function
async function translateTopic() {
    const topic = elements.topicInput.value.trim();
    if (!topic) return;
    
    // Don't translate if Arabic is selected or topic is already in target language
    if (currentLanguage === 'ar') return;
    
    // Show loading state
    elements.translateBtn.disabled = true;
    elements.translateBtnIcon.className = 'fas fa-spinner fa-spin';
    elements.translateBtn.title = translations[currentLanguage].translating;

    try {
        const response = await fetch('/api/translate-topic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topic,
                target_language: currentLanguage
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.translated_topic && data.translated_topic !== topic) {
                elements.topicInput.value = data.translated_topic;
            }
        } else {
            console.error('Translation failed:', response.statusText);
        }
    } catch (error) {
        console.error('Translation error:', error);
    } finally {
        // Reset button state
        elements.translateBtn.disabled = false;
        elements.translateBtnIcon.className = 'fas fa-language';
        elements.translateBtn.title = translations[currentLanguage].translateBtnTitle;
    }
}

// Research generation
async function generateResearch() {
    let topic = elements.topicInput.value.trim();
    if (!topic) return;

    // Show loading state
    elements.outputPlaceholder.classList.add('hidden');
    elements.researchOutputContent.classList.add('hidden');
    elements.loader.classList.remove('hidden');
    elements.loader.classList.add('flex');
    
    elements.generateBtn.disabled = true;
    elements.generateBtnText.textContent = translations[currentLanguage].generating;
    elements.generateBtnIcon.className = 'fas fa-spinner fa-spin';

    try {
        // Translate topic if language is not Arabic
        if (currentLanguage !== 'ar') {
            try {
                const translateResponse = await fetch('/api/translate-topic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        topic: topic,
                        target_language: currentLanguage
                    })
                });

                if (translateResponse.ok) {
                    const translateData = await translateResponse.json();
                    if (translateData.success && translateData.translated_topic) {
                        topic = translateData.translated_topic;
                        console.log(`Topic translated to ${currentLanguage}: ${topic}`);
                    }
                }
            } catch (translateError) {
                console.warn('Topic translation failed, using original:', translateError);
            }
        }
        
        // Generate research content
        const response = await fetch('/api/generate-research', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topic,
                language: currentLanguage
            })
        });

        const data = await response.json();

        if (data.success) {
            // Process content and replace topic in title if translated
            let content = data.content;
            
            // If topic was translated, replace the Arabic topic in the content with translated version
            if (currentLanguage !== 'ar' && topic !== elements.topicInput.value.trim()) {
                const originalTopic = elements.topicInput.value.trim();
                // Replace the topic in the first h1 (main title)
                content = content.replace(
                    new RegExp(`^# ${originalTopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm'),
                    `# ${topic}`
                );
                
                // Also replace any other occurrences in the content
                const regex = new RegExp(originalTopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                content = content.replace(regex, topic);
            }
            
            // Display research content
            elements.researchOutputContent.innerHTML = marked.parse(content);
            elements.loader.classList.add('hidden');
            elements.loader.classList.remove('flex');
            elements.researchOutputContent.classList.remove('hidden');
            
            // Enable PDF download
            elements.downloadPdfBtn.disabled = false;
            
            // Search for images
            await searchImages(topic);
            
        } else {
            throw new Error(data.error || 'Failed to generate research');
        }

    } catch (error) {
        console.error('Error generating research:', error);
        alert(`${translations[currentLanguage].error}: ${error.message}`);
        
        // Show placeholder again
        elements.loader.classList.add('hidden');
        elements.loader.classList.remove('flex');
        elements.outputPlaceholder.classList.remove('hidden');
    } finally {
        // Reset button state
        elements.generateBtn.disabled = false;
        elements.generateBtnText.textContent = translations[currentLanguage].generateBtnText;
        elements.generateBtnIcon.className = 'fas fa-cogs';
    }
}

// Image search
async function searchImages(topic) {
    elements.imagePanelLoader.classList.remove('hidden');
    elements.imagePanelLoader.classList.add('flex');

    try {
        const response = await fetch('/api/search-images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: topic,
                language: currentLanguage
            })
        });

        const data = await response.json();

        if (data.success) {
            generatedImages = data.images;
            displayImages(data.images);
        } else {
            throw new Error(data.error || 'Failed to search images');
        }

    } catch (error) {
        console.error('Error searching images:', error);
        elements.imageGrid.innerHTML = `<p class="text-red-500 text-sm">${translations[currentLanguage].error}: ${error.message}</p>`;
    } finally {
        elements.imagePanelLoader.classList.add('hidden');
        elements.imagePanelLoader.classList.remove('flex');
    }
}

// Display images in grid
function displayImages(images) {
    elements.imageGrid.innerHTML = '';
    
    images.forEach((image, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.innerHTML = `
            <img src="${image.thumbnail || image.url}" 
                 alt="${image.title}" 
                 title="${image.title}"
                 loading="lazy"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2U8L3RleHQ+PC9zdmc+'" />
            <div class="image-number">${index + 1}</div>
        `;
        
        imageContainer.addEventListener('click', () => openPlacementModal(image));
        elements.imageGrid.appendChild(imageContainer);
    });
}

// Modal functionality
function openPlacementModal(image) {
    selectedImageForPlacement = image;
    
    // Update image preview
    const previewImage = document.getElementById('previewImage');
    const previewTitle = document.getElementById('previewTitle');
    
    if (previewImage && previewTitle) {
        previewImage.src = image.thumbnail || image.url;
        previewTitle.textContent = image.title || 'صورة مختارة';
        
        // Show preview section
        const previewSection = document.getElementById('imagePreviewSection');
        if (previewSection) {
            previewSection.style.display = 'block';
        }
    }
    
    // Find available slots
    const slots = document.querySelectorAll('.image-placeholder');
    elements.modalSlots.innerHTML = '';
    
    slots.forEach((slot, index) => {
        const slotNumber = slot.dataset.slotNumber;
        const isOccupied = slot.querySelector('.inserted-image') !== null;
        
        const button = document.createElement('button');
        button.className = `slot-button py-2 px-4 rounded-lg transition-colors ${isOccupied ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`;
        const slotLabels = {
            'ar': 'موقع',
            'en': 'Slot',
            'fr': 'Position'
        };
        button.textContent = `${slotLabels[currentLanguage]} ${slotNumber}`;
        button.disabled = isOccupied;
        
        if (!isOccupied) {
            button.addEventListener('click', () => placeImageInSlot(slotNumber));
        }
        
        elements.modalSlots.appendChild(button);
    });
    
    elements.placementModal.classList.remove('hidden');
    elements.placementModal.classList.add('flex');
}

function closePlacementModal() {
    elements.placementModal.classList.add('hidden');
    elements.placementModal.classList.remove('flex');
    selectedImageForPlacement = null;
}

async function placeImageInSlot(slotNumber) {
    if (!selectedImageForPlacement) return;
    
    const slot = document.getElementById(`image-slot-${slotNumber}`);
    if (slot) {
        // Show loading indicator while placing image
        slot.innerHTML = `
            <div class="image-container-pdf avoid-break">
                <div class="flex items-center justify-center h-32">
                    <div class="loader" style="width: 30px; height: 30px; border-width: 3px;"></div>
                </div>
            </div>
        `;
        
        try {
            // Try to get base64 version for better PDF compatibility
            const proxyResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(selectedImageForPlacement.url)}`);
            let imageSource = selectedImageForPlacement.url;
            
            if (proxyResponse.ok) {
                const proxyData = await proxyResponse.json();
                if (proxyData.success) {
                    imageSource = proxyData.data;
                }
            }
            
            // Create the image with size controls and PDF-optimized container
            slot.innerHTML = `
                <div class="image-container-pdf avoid-break">
                    <img src="${imageSource}" 
                         alt="${selectedImageForPlacement.title}" 
                         class="inserted-image"
                         id="inserted-image-${slotNumber}"
                         style="width: 100%; max-width: 100%;"
                         crossorigin="anonymous" />
                    <div class="image-size-controls mt-2 flex justify-center gap-2">
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all" onclick="resizeImage(${slotNumber}, 25)">25%</button>
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all" onclick="resizeImage(${slotNumber}, 50)">50%</button>
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all" onclick="resizeImage(${slotNumber}, 75)">75%</button>
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all active" onclick="resizeImage(${slotNumber}, 100)">100%</button>
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.warn('Failed to proxy image, using direct URL:', error);
            // Fallback to direct URL
            slot.innerHTML = `
                <div class="image-container-pdf avoid-break">
                    <img src="${selectedImageForPlacement.url}" 
                         alt="${selectedImageForPlacement.title}" 
                         class="inserted-image"
                         id="inserted-image-${slotNumber}"
                         style="width: 100%; max-width: 100%;"
                         crossorigin="anonymous" />
                    <div class="image-size-controls mt-2 flex justify-center gap-2">
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all" onclick="resizeImage(${slotNumber}, 25)">25%</button>
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all" onclick="resizeImage(${slotNumber}, 50)">50%</button>
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all" onclick="resizeImage(${slotNumber}, 75)">75%</button>
                        <button class="size-btn text-xs px-2 py-1 rounded transition-all active" onclick="resizeImage(${slotNumber}, 100)">100%</button>
                    </div>
                </div>
            `;
        }
        
        closePlacementModal();
    }
}

// Function to resize images
function resizeImage(slotNumber, percentage) {
    const image = document.getElementById(`inserted-image-${slotNumber}`);
    const slot = document.getElementById(`image-slot-${slotNumber}`);
    const buttons = slot.querySelectorAll('.size-btn');
    
    if (image) {
        // Set width as percentage of container
        image.style.width = `${percentage}%`;
        image.style.maxWidth = `${percentage}%`;
        
        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
}

// PDF download with A4 optimization and image loading
async function downloadPDF() {
    const element = elements.researchOutputContent;
    
    // Show loading indicator
    const originalDownloadText = elements.downloadPdfBtn.innerHTML;
    elements.downloadPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (currentLanguage === 'ar' ? 'جاري الإنشاء...' : currentLanguage === 'fr' ? 'Génération...' : 'Generating...');
    elements.downloadPdfBtn.disabled = true;
    
    try {
        // Convert external images to base64 for PDF compatibility
        await convertImagesToBase64(element);
        
        // Add PDF-specific classes before generation
        element.classList.add('pdf-generation');
        
        // Force hide all size control buttons
        const sizeControls = element.querySelectorAll('.image-size-controls, .size-btn');
        sizeControls.forEach(control => {
            control.style.display = 'none';
            control.style.visibility = 'hidden';
            control.style.opacity = '0';
            control.style.height = '0';
        });
        
        // Center the main title and remove top spacing
        const mainTitle = element.querySelector('h1');
        if (mainTitle) {
            mainTitle.style.textAlign = 'center';
            mainTitle.style.marginTop = '0';
            mainTitle.style.paddingTop = '0';
        }
        
        const opt = {
            margin: [8, 8, 12, 8], // Top, Right, Bottom, Left margins in mm (reduced top margin)
            filename: `research-${currentLanguage}-${Date.now()}.pdf`,
            image: { 
                type: 'jpeg', 
                quality: 0.9,
                crossOrigin: 'anonymous'
            },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                allowTaint: true,
                letterRendering: true,
                logging: false,
                imageTimeout: 30000,
                removeContainer: true,
                foreignObjectRendering: false,
                onrendered: function(canvas) {
                    console.log('Canvas rendered successfully');
                }
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.page-break',
                after: '.section-break'
            }
        };
        
        await html2pdf().set(opt).from(element).save();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        const errorMessages = {
            'ar': 'حدث خطأ في إنشاء ملف PDF',
            'en': 'Error generating PDF',
            'fr': 'Erreur lors de la génération du PDF'
        };
        alert(errorMessages[currentLanguage]);
    } finally {
        // Restore button state
        elements.downloadPdfBtn.innerHTML = originalDownloadText;
        elements.downloadPdfBtn.disabled = false;
        element.classList.remove('pdf-generation');
        
        // Restore size control buttons visibility
        const sizeControls = element.querySelectorAll('.image-size-controls, .size-btn');
        sizeControls.forEach(control => {
            control.style.display = '';
            control.style.visibility = '';
            control.style.opacity = '';
            control.style.height = '';
        });
    }
}

// Convert external images to base64 for PDF compatibility
async function convertImagesToBase64(container) {
    const images = container.querySelectorAll('.inserted-image');
    
    for (let img of images) {
        try {
            // Skip if already base64
            if (img.src.startsWith('data:')) {
                continue;
            }
            
            // Try proxy first, then fallback to direct conversion
            let base64 = null;
            try {
                const proxyResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(img.src)}`);
                if (proxyResponse.ok) {
                    const proxyData = await proxyResponse.json();
                    if (proxyData.success) {
                        base64 = proxyData.data;
                    }
                }
            } catch (e) {
                console.warn('Proxy failed, trying direct conversion');
            }
            
            // Fallback to direct conversion
            if (!base64) {
                base64 = await imageToBase64(img.src);
            }
            
            if (base64) {
                img.src = base64;
                // Ensure image loads properly
                await new Promise(resolve => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to convert image to base64:', error);
        }
    }
}

// Convert image URL to base64
function imageToBase64(url) {
    return new Promise((resolve) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                try {
                    const base64 = canvas.toDataURL('image/jpeg', 0.9);
                    resolve(base64);
                } catch (e) {
                    console.warn('Canvas tainted, using original URL');
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = url;
        } catch (error) {
            resolve(null);
        }
    });
}

// Event listeners
elements.generateBtn.addEventListener('click', generateResearch);
elements.downloadPdfBtn.addEventListener('click', downloadPDF);
elements.cancelPlacement.addEventListener('click', closePlacementModal);

// Close modal when clicking outside
elements.placementModal.addEventListener('click', (e) => {
    if (e.target === elements.placementModal) {
        closePlacementModal();
    }
});

// Enter key support for topic input
elements.topicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !elements.generateBtn.disabled) {
        generateResearch();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage('ar'); // Default to Arabic
});
