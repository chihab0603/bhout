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
        success: 'تم بنجاح'
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
        success: 'Success'
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
        success: 'Succès'
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

// Language switching
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(lang + 'Btn').classList.add('active');
    
    // Update text direction
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // Update container class
    elements.researchOutputContainer.className = `research-output-container lang-${lang} rounded-lg shadow-lg p-8 overflow-y-auto w-full`;
    
    // Update all text elements
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
}

// Event listeners for language buttons
elements.arBtn.addEventListener('click', () => switchLanguage('ar'));
elements.frBtn.addEventListener('click', () => switchLanguage('fr'));
elements.enBtn.addEventListener('click', () => switchLanguage('en'));

// Research generation
async function generateResearch() {
    const topic = elements.topicInput.value.trim();
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
            // Display research content
            elements.researchOutputContent.innerHTML = marked.parse(data.content);
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
    
    // Find available slots
    const slots = document.querySelectorAll('.image-placeholder');
    elements.modalSlots.innerHTML = '';
    
    slots.forEach((slot, index) => {
        const slotNumber = slot.dataset.slotNumber;
        const isOccupied = slot.querySelector('.inserted-image') !== null;
        
        const button = document.createElement('button');
        button.className = `slot-button py-2 px-4 rounded-lg transition-colors ${isOccupied ? '' : ''}`;
        button.textContent = `${currentLanguage === 'ar' ? 'موقع' : currentLanguage === 'fr' ? 'Position' : 'Slot'} ${slotNumber}`;
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
                         style="width: 100%; max-width: 350px;"
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
                         style="width: 100%; max-width: 350px;"
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
        // Calculate new width based on percentage
        const maxWidth = 400; // Maximum width in pixels
        const newWidth = (maxWidth * percentage) / 100;
        image.style.width = `${newWidth}px`;
        image.style.maxWidth = `${newWidth}px`;
        
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
        
        const opt = {
            margin: [12, 8, 12, 8], // Top, Right, Bottom, Left margins in mm (reduced side margins)
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
        alert(currentLanguage === 'ar' ? 'حدث خطأ في إنشاء ملف PDF' : 'Error generating PDF');
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
