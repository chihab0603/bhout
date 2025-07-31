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

function placeImageInSlot(slotNumber) {
    if (!selectedImageForPlacement) return;
    
    const slot = document.getElementById(`image-slot-${slotNumber}`);
    if (slot) {
        slot.innerHTML = `<img src="${selectedImageForPlacement.url}" alt="${selectedImageForPlacement.title}" class="inserted-image" />`;
        closePlacementModal();
    }
}

// PDF download
function downloadPDF() {
    const element = elements.researchOutputContent;
    const opt = {
        margin: 1,
        filename: `research-${currentLanguage}-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
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
