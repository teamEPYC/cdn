// --- Constants (Shared across all instances) ---
const INITIAL_RIGHT_EDGE = 300;
const INITIAL_BOTTOM_EDGE = 400;
const TOP_LEFT_HUMP_RIGHT_X = 81;
const TOP_RIGHT_HUMP_LEFT_X = 219;
const BOTTOM_LEFT_HUMP_RIGHT_X = 61;
const BOTTOM_RIGHT_HUMP_LEFT_X = 239;
const TOP_BAR_MAX_Y = 91;
const BOTTOM_BAR_MIN_Y = 332;

// The SVG template string
const SVG_TEMPLATE = `
    <svg class="frame-mask-svg" style="position: absolute;" width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <mask id="frame-mask">
                <rect class="center-fill-rect" x="0" y="${TOP_BAR_MAX_Y}" fill="white" /> 
                <rect class="top-connector-rect" x="${TOP_LEFT_HUMP_RIGHT_X}" y="0" height="${TOP_BAR_MAX_Y}" fill="white"/> 
                
                <path class="top-left-hump" d="M81 0V91H0C0 75.3952 8.71369 61.8497 21.5176 54.9219C24.5409 44.1218 31.8647 35.1405 41.5186 29.9189C46.355 12.6557 62.1925 0 81 0Z" fill="white"/>

                <path class="top-right-hump" d="M219 0V91H300C300 75.3952 291.286 61.8497 278.482 54.9219C275.459 44.1218 268.135 35.1405 258.481 29.9189C253.645 12.6557 237.808 0 219 0Z" fill="white"/>
                
                <rect class="bottom-connector-rect" x="${BOTTOM_LEFT_HUMP_RIGHT_X}" y="${BOTTOM_BAR_MIN_Y}" height="${INITIAL_BOTTOM_EDGE - BOTTOM_BAR_MIN_Y}" fill="white"/> 

                <path class="bottom-left-hump" d="M61 400C42.1908 400 26.3535 387.342 21.5186 370.076C8.94515 363.273 0.315072 350.09 0.00878906 334.84L0 334V332H61V400Z" fill="white"/>

                <path class="bottom-right-hump" d="M239 400C257.809 400 273.646 387.342 278.481 370.076C291.055 363.273 299.685 350.09 299.991 334.84L300 334V332H239V400Z" fill="white"/>
            </mask>
        </defs>
    </svg>
`;

class FrameMaskManager {
    constructor(targetElement) {
        this.targetElement = targetElement;
        
        // Store last observed dimensions to avoid unnecessary updates
        this.lastObservedWidth = 0;
        this.lastObservedHeight = 0;

        this.maskId = `frame-mask-${Math.random().toString(36).substr(2, 9)}`;

        this.setupMask();
        this.updatePositions = this.updatePositions.bind(this);
        
        // --- Setup ResizeObserver ---
        this.observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const newWidth = entry.contentRect.width;
            const newHeight = entry.contentRect.height;
            
            // Check for change before running the expensive update
            if (this.lastObservedWidth !== newWidth || this.lastObservedHeight !== newHeight) {
                this.updatePositions();
            }
        });

        // Start observing the target element for all size changes
        this.observer.observe(this.targetElement);
        
        // Initial update
        this.updatePositions();
    }

    setupMask() {
        const svgWithUniqueId = SVG_TEMPLATE.replace(/id="frame-mask"/g, `id="${this.maskId}"`);
        this.targetElement.insertAdjacentHTML('afterbegin', svgWithUniqueId);

        this.svg = this.targetElement.querySelector('.frame-mask-svg');
        this.trShape = this.svg.querySelector('.top-right-hump');
        this.blShape = this.svg.querySelector('.bottom-left-hump');
        this.brShape = this.svg.querySelector('.bottom-right-hump');
        this.topRect = this.svg.querySelector('.top-connector-rect');
        this.bottomRect = this.svg.querySelector('.bottom-connector-rect');
        this.centerFillRect = this.svg.querySelector('.center-fill-rect');

        const maskUrl = `url(#${this.maskId})`;
        this.targetElement.style.maskImage = maskUrl;
        this.targetElement.style.webkitMaskImage = maskUrl;
        this.targetElement.style.maskRepeat = 'no-repeat';
        this.targetElement.style.webkitMaskRepeat = 'no-repeat';
        this.targetElement.style.maskSize = '100% 100%';
        this.targetElement.style.webkitMaskSize = '100% 100%';
    }

    updatePositions() {
        const currentWidth = this.targetElement.clientWidth;
        const currentHeight = this.targetElement.clientHeight;
        
        // Update the last observed state
        this.lastObservedWidth = currentWidth;
        this.lastObservedHeight = currentHeight;

        const shiftX = currentWidth - INITIAL_RIGHT_EDGE;
        const shiftY = currentHeight - INITIAL_BOTTOM_EDGE;

        // Apply Corner Hump Transforms
        this.trShape.setAttribute('transform', `translate(${shiftX}, 0)`);
        this.blShape.setAttribute('transform', `translate(0, ${shiftY})`);
        this.brShape.setAttribute('transform', `translate(${shiftX}, ${shiftY})`);

        // Top Connector Rectangle Logic
        const newTopRightHumpX = TOP_RIGHT_HUMP_LEFT_X + shiftX;
        const topRectWidth = newTopRightHumpX - TOP_LEFT_HUMP_RIGHT_X;
        this.topRect.setAttribute('width', topRectWidth);

        // Bottom Connector Rectangle Logic
        const bottomRectWidth = (BOTTOM_RIGHT_HUMP_LEFT_X + shiftX) - BOTTOM_LEFT_HUMP_RIGHT_X;
        this.bottomRect.setAttribute('width', bottomRectWidth);
        this.bottomRect.setAttribute('transform', `translate(0, ${shiftY})`);

        // Center Fill Rectangle Logic
        this.centerFillRect.setAttribute('width', currentWidth);
        const centerRectBottomY = BOTTOM_BAR_MIN_Y + shiftY; 
        const centerRectHeight = centerRectBottomY - TOP_BAR_MAX_Y;
        this.centerFillRect.setAttribute('height', centerRectHeight);
    }
}

// --- Initialization (Finds and initializes ALL frames) ---
document.querySelectorAll('[data-frame]').forEach(targetElement => {
    new FrameMaskManager(targetElement); 
});

