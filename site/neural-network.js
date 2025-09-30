// Neural Network Portfolio Implementation
console.log('Neural network script loading...');
console.log('window.projects:', window.projects);
const projects = window.projects || [];
console.log('projects array length:', projects.length);

let positionedCards = [];
let isNeuralNetworkStyle = true;

// Caching system for instant project navigation
let projectCache = new Map();
let currentProjectOverlay = null;
let isOverlayOpen = false;

// Get random size for blocks
function getRandomSize() {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const weights = [0.3, 0.4, 0.2, 0.1];
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < sizes.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) return sizes[i];
    }
    return 'medium';
}

// Get card dimensions with random aspect ratios between 2:1 and 3:1
function getCardDimensions(sizeClass) {
    // Return mobile dimensions on mobile, desktop dimensions on desktop
    if (window.innerWidth <= 768) {
        // Mobile: Single column - 25% smaller, but can extend offscreen
        const margin = 20; // Small side margins
        const cardWidth = window.innerWidth * 0.85 * 0.75; // 85% of viewport, then reduce by 25% = 63.75% of viewport
        
        // Use varied heights for visual interest - reduced by 25%
        const baseHeight = 120 * 1.25 * 0.75; // 112.5px (reduce by 25%)
        const heightVariations = [0, 15, 25, -8, 20, -5, 23, 13].map(v => v * 1.25 * 0.75); // Reduce variations by 25%
        // We need to get the current card index to determine height variation
        // This will be handled in the calling function
        const cardHeight = baseHeight; // Default height, will be overridden
        
        return {
            width: cardWidth,
            height: cardHeight
        };
    } else {
        // Desktop: All cards same size now - smaller to allow more spreading
    return {
        width: 100,
        height: 40
    };
    }
}

// Get project category with better distribution
function getProjectCategory(project) {
    const title = project.title.toLowerCase();
    const tech = project.technologies?.toLowerCase() || '';
    const client = project.client?.toLowerCase() || '';
    const desc = project.description?.toLowerCase() || '';
    
    // More specific categorization
    if (title.includes('climate') || desc.includes('climate')) {
        return 'generative';
    } else if (title.includes('spectral') || desc.includes('thermal')) {
        return 'installation';
    } else if (title.includes('field') || desc.includes('field')) {
        return 'installation';
    } else if (title.includes('kristall') || desc.includes('crystal')) {
        return 'performance';
    } else if (title.includes('ocean') || desc.includes('ocean')) {
        return 'commercial';
    } else if (title.includes('pulse') || desc.includes('pulse')) {
        return 'generative';
    } else if (title.includes('voice') || desc.includes('voice')) {
        return 'performance';
    } else if (title.includes('breath') || desc.includes('breath')) {
        return 'installation';
    } else if (title.includes('shadow') || desc.includes('shadow')) {
        return 'performance';
    } else if (title.includes('atmospheric') || desc.includes('atmospheric')) {
        return 'generative';
    } else if (title.includes('sync') || desc.includes('sync')) {
        return 'commercial';
    } else if (title.includes('thermal') || desc.includes('thermal')) {
        return 'installation';
    } else if (title.includes('ecosystem') || desc.includes('ecosystem')) {
        return 'generative';
    } else if (title.includes('universal') || desc.includes('universal')) {
        return 'commercial';
    } else if (title.includes('ozone') || desc.includes('ozone')) {
        return 'generative';
    } else if (title.includes('collider') || desc.includes('collider')) {
        return 'installation';
    } else if (title.includes('memory') || desc.includes('memory')) {
        return 'performance';
    } else if (title.includes('animistic') || desc.includes('animistic')) {
        return 'generative';
    } else if (title.includes('kontinuum') || desc.includes('kontinuum')) {
        return 'installation';
    } else if (title.includes('listening') || desc.includes('listening')) {
        return 'performance';
    } else {
        // Default distribution for remaining projects
        const categories = ['installation', 'generative', 'performance', 'commercial'];
        return categories[Math.floor(Math.random() * categories.length)];
    }
}

// Get connection text based on project relationship
function getConnectionText(start, end, type) {
    if (type === 'center') {
        // Connections to viewport center
        const centerTexts = ['interactive', 'live', 'responsive', 'dynamic', 'reactive', 'adaptive'];
        return centerTexts[Math.floor(Math.random() * centerTexts.length)];
    } else if (type === 'card') {
        // Connections between cards - find the connected cards
        const startCard = findCardByPosition(start);
        const endCard = findCardByPosition(end);
        
        if (startCard && endCard) {
            const startTags = startCard.getAttribute('data-tags')?.split(',') || [];
            const endTags = endCard.getAttribute('data-tags')?.split(',') || [];
            
            // Find common tags
            const commonTags = startTags.filter(tag => endTags.includes(tag));
            
            if (commonTags.length > 0) {
                const tag = commonTags[0];
                const connectionMap = {
                    'thermal': 'thermal',
                    'audio': 'sound',
                    'lighting': 'light',
                    'projection': 'projection',
                    'interactive': 'interactive',
                    'installation': 'space',
                    'sensing': 'sensor',
                    'network': 'network',
                    'climate': 'climate',
                    'spectral': 'spectral',
                    'field': 'field',
                    'crystal': 'crystal',
                    'ocean': 'ocean',
                    'pulse': 'pulse',
                    'voice': 'voice',
                    'breath': 'breath',
                    'shadow': 'shadow',
                    'lozano-hemmer': 'collaboration',
                    'institutional': 'institution',
                    'academic': 'research'
                };
                return connectionMap[tag] || tag;
            }
        }
        
        // Fallback connection texts
        const fallbackTexts = ['data', 'flow', 'signal', 'connection', 'link', 'bridge'];
        return fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)];
    }
    
    return null;
}

// Helper function to find card by position
function findCardByPosition(position) {
    const cards = document.querySelectorAll('.project-block');
    for (let card of cards) {
        const rect = card.getBoundingClientRect();
        const cardCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        // Check if position is close to card center (within 50px for better matching)
        const distance = Math.sqrt(
            Math.pow(position.x - cardCenter.x, 2) + 
            Math.pow(position.y - cardCenter.y, 2)
        );
        
        if (distance < 50) {
            return card;
        }
    }
    return null;
}

// Generate tags based on project data
function generateProjectTags(project) {
    const tags = [];
    const title = project.title.toLowerCase();
    const tech = project.technologies?.toLowerCase() || '';
    const desc = project.description?.toLowerCase() || '';
    const client = project.client?.toLowerCase() || '';
    
    // Technology tags
    if (desc.includes('thermal') || desc.includes('thermographic')) tags.push('thermal');
    if (desc.includes('audio') || desc.includes('sound') || desc.includes('audio-reactive')) tags.push('audio');
    if (desc.includes('light') || desc.includes('lighting') || desc.includes('illumination')) tags.push('lighting');
    if (desc.includes('projection') || desc.includes('mapping')) tags.push('projection');
    if (desc.includes('interactive') || desc.includes('interaction')) tags.push('interactive');
    if (desc.includes('installation') || desc.includes('environment')) tags.push('installation');
    if (desc.includes('camera') || desc.includes('sensor')) tags.push('sensing');
    if (desc.includes('network') || desc.includes('connection')) tags.push('network');
    
    // Theme tags
    if (title.includes('climate') || desc.includes('climate')) tags.push('climate');
    if (title.includes('spectral') || desc.includes('spectral')) tags.push('spectral');
    if (title.includes('field') || desc.includes('field')) tags.push('field');
    if (title.includes('kristall') || desc.includes('crystal')) tags.push('crystal');
    if (title.includes('ocean') || desc.includes('ocean')) tags.push('ocean');
    if (title.includes('pulse') || desc.includes('pulse')) tags.push('pulse');
    if (title.includes('voice') || desc.includes('voice')) tags.push('voice');
    if (title.includes('breath') || desc.includes('breath')) tags.push('breath');
    if (title.includes('shadow') || desc.includes('shadow')) tags.push('shadow');
    
    // Client tags
    if (client.includes('lozano-hemmer')) tags.push('lozano-hemmer');
    if (client.includes('museum') || client.includes('gallery')) tags.push('institutional');
    if (client.includes('university') || client.includes('academic')) tags.push('academic');
    
    // Default tag if none found
    if (tags.length === 0) tags.push('general');
    
    return tags;
}

// Get category-based color with variation
function getCategoryColor(category) {
    const variations = ['variation-1', 'variation-2', 'variation-3', 'variation-4'];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    return `category-${category} ${randomVariation}`;
}

// Get project thumbnail - optimized for small file sizes
function getThumbnail(projectId) {
    const media = window.projectMedia || window.mediaIndex || {};
    const project = media.projects?.[projectId];
    
    if (!project) {
        return null;
    }
    
    const imageFiles = project.files.filter(f => f.type === 'image');
    if (imageFiles.length === 0) {
        return null;
    }
    
    const originalPath = imageFiles[0].path;
    
    // Convert high-res paths to thumbnail paths for main page performance
    const thumbnailPath = originalPath.replace('high-res/', 'thumbnails/');
    
    return `media/${thumbnailPath}`;
}

// Shape bank for different project card arrangements
const SHAPE_BANK = {
    circle: {
        name: 'Circle',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            const angle = (index / totalCards) * 2 * Math.PI - Math.PI / 2;
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        }
    },
    
    cube: {
        name: 'Cube',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            // Create a cube outline with 8 vertices
            const cubeVertices = [
                { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
                { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
                { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
                { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
            ];
            
            const vertexIndex = index % cubeVertices.length;
            const vertex = cubeVertices[vertexIndex];
            
            // Simple 2D projection (ignoring z for now) - doubled scale
            return {
                x: centerX + vertex.x * radius * 1.4, // Doubled from 0.7 to 1.4
                y: centerY + vertex.y * radius * 1.4  // Doubled from 0.7 to 1.4
            };
        }
    },
    
    hand: {
        name: 'Hand',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            // Create a hand-like shape with 5 "fingers"
            const fingers = 5;
            const cardsPerFinger = Math.ceil(totalCards / fingers);
            const fingerIndex = Math.floor(index / cardsPerFinger);
            const positionInFinger = index % cardsPerFinger;
            
            const fingerAngle = (fingerIndex / fingers) * Math.PI * 0.8 - Math.PI * 0.4; // Spread fingers
            const fingerLength = radius * 1.6; // Doubled from 0.8 to 1.6
            const progress = positionInFinger / Math.max(cardsPerFinger - 1, 1);
            
            return {
                x: centerX + Math.cos(fingerAngle) * fingerLength * progress,
                y: centerY + Math.sin(fingerAngle) * fingerLength * progress
            };
        }
    },
    
    sineWave: {
        name: 'Sine Wave',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            const progress = index / Math.max(totalCards - 1, 1);
            const x = centerX + (progress - 0.5) * radius * 3.0; // Doubled from 1.5 to 3.0
            const y = centerY + Math.sin(progress * Math.PI * 3) * radius * 0.8; // Doubled from 0.4 to 0.8
            
            return { x, y };
        }
    },
    
    spiral: {
        name: 'Spiral',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            const turns = 2;
            const angle = (index / totalCards) * turns * 2 * Math.PI;
            const spiralRadius = (index / totalCards) * radius;
            
            return {
                x: centerX + spiralRadius * Math.cos(angle),
                y: centerY + spiralRadius * Math.sin(angle)
            };
        }
    },
    
    diamond: {
        name: 'Diamond',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            // Create diamond outline with 4 sides
            const sides = 4;
            const cardsPerSide = Math.ceil(totalCards / sides);
            const sideIndex = Math.floor(index / cardsPerSide);
            const positionInSide = index % cardsPerSide;
            const progress = positionInSide / Math.max(cardsPerSide - 1, 1);
            
            let x, y;
            switch (sideIndex) {
                case 0: // Top to right
                    x = centerX + progress * radius * 2; // Doubled
                    y = centerY - radius * 2 + progress * radius * 2; // Doubled
                    break;
                case 1: // Right to bottom
                    x = centerX + radius * 2 - progress * radius * 2; // Doubled
                    y = centerY + progress * radius * 2; // Doubled
                    break;
                case 2: // Bottom to left
                    x = centerX - progress * radius * 2; // Doubled
                    y = centerY + radius * 2 - progress * radius * 2; // Doubled
                    break;
                case 3: // Left to top
                    x = centerX - radius * 2 + progress * radius * 2; // Doubled
                    y = centerY - progress * radius * 2; // Doubled
                    break;
            }
            
            return { x, y };
        }
    },
    
    random: {
        name: 'Random (Alphabetical)',
        calculatePosition: (index, totalCards, centerX, centerY, radius) => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = Math.max(window.innerHeight, 1000);
            
            // Mobile-first layout: use grid on small screens
            if (window.innerWidth <= 768) {
                return calculateMobileGridPosition(index, totalCards, viewportWidth, viewportHeight);
            }
            
            // Desktop: Random positioning with some structure
            const margin = 100;
            const availableWidth = viewportWidth - (margin * 2);
            const availableHeight = viewportHeight - (margin * 2);
            
            // Add some horizontal bias for alphabetical flow
            const horizontalBias = (index / Math.max(totalCards - 1, 1)) * 0.3; // 30% bias toward left-to-right
            const randomX = Math.random() * availableWidth + margin;
            const randomY = Math.random() * availableHeight + margin;
            
            // Blend random position with alphabetical flow
            const x = randomX + (horizontalBias * availableWidth * 0.5);
            const y = randomY;
            
            return { x, y };
        }
    }
};

// Current shape (can be changed)
let currentShape = 'random';

// Function to change the current shape
function changeShape(shapeName) {
    if (SHAPE_BANK[shapeName]) {
        currentShape = shapeName;
        console.log(`Switched to ${SHAPE_BANK[shapeName].name} layout`);
        
        // Reposition all cards with new shape
        if (isNeuralNetworkStyle) {
            resetPositionedCards();
            const allBlocks = document.querySelectorAll('.project-block');
            console.log(`Repositioning ${allBlocks.length} cards with ${shapeName} shape`);
            
            allBlocks.forEach((block, index) => {
                // Get size class from classList or generate one
                let sizeClass = block.getAttribute('data-size');
                if (!sizeClass) {
                    // Extract from classList or generate random
                    const classes = Array.from(block.classList);
                    const sizeClasses = ['small', 'medium', 'large', 'xlarge'];
                    sizeClass = classes.find(cls => sizeClasses.includes(cls)) || getRandomSizeClass();
                    block.setAttribute('data-size', sizeClass);
                }
                
                console.log(`Repositioning card ${index + 1} with size: ${sizeClass}`);
                // Use shuffled position mapping for random layout to maintain alphabetical order
                const positionIndex = (currentShape === 'random' && window.positionMapping) ? window.positionMapping[index] : index;
                positionCardCircularly(block, sizeClass, positionIndex, allBlocks.length);
            });
            // Update container height for masonry layout
            updateMasonryContainerHeight();
        }
    }
}

// Function to cycle through all shapes
function cycleShape() {
    const shapeNames = Object.keys(SHAPE_BANK);
    const currentIndex = shapeNames.indexOf(currentShape);
    const nextIndex = (currentIndex + 1) % shapeNames.length;
    changeShape(shapeNames[nextIndex]);
}

// Global keyboard listener for shape cycling
let keyboardListenerAdded = false;
function addShapeKeyboardListener() {
    if (keyboardListenerAdded) return;
    
    document.addEventListener('keydown', function(e) {
        // Only trigger if not typing in an input field
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                console.log('🔄 Cycling to next shape...');
                cycleShape();
            }
        }
    });
    
    // Add window resize listener for responsive repositioning
    window.addEventListener('resize', debounce(function() {
        console.log('📱 Window resized - repositioning for current device type');
        if (isNeuralNetworkStyle) {
            // Re-layout all cards on resize
            resetPositionedCards();
            const allBlocks = document.querySelectorAll('.project-block');
            allBlocks.forEach((block, index) => {
                const sizeClass = block.getAttribute('data-size') || getRandomSizeClass();
                const totalCards = allBlocks.length;
                positionCardCircularly(block, sizeClass, index, totalCards);
            });
            // Update container height for masonry layout
            updateMasonryContainerHeight();
        }
    }, 250));
    
    keyboardListenerAdded = true;
    console.log('⌨️ Shape cycling keyboard listener added');
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize for mobile neural overlay
window.addEventListener('resize', debounce(() => {
    // Recreate mobile neural overlay on resize
    createMobileNeuralOverlay();
}, 250));

// Mobile navigation functionality
function initializeMobileNavigation() {
    if (window.innerWidth > 768) return; // Only for mobile
    
    const navToggles = document.querySelectorAll('.nav-toggle');
    const projectSection = document.querySelector('.project-section');
    
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Remove active class from all toggles
            navToggles.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked toggle
            toggle.classList.add('active');
            
            const section = toggle.getAttribute('data-section');
            
            if (section === 'portfolio') {
                // Show portfolio
                projectSection.style.display = 'block';
                console.log('📱 Switched to Portfolio view');
            } else if (section === 'skills') {
                // Hide portfolio for now (we can add skills content later)
                projectSection.style.display = 'none';
                console.log('📱 Switched to Skills view');
            }
        });
    });
    
    console.log('📱 Mobile navigation initialized');
}

// Test function - can be called from browser console
function testShapes() {
    console.log('🧪 Testing all shapes...');
    const shapeNames = Object.keys(SHAPE_BANK);
    
    let index = 0;
    const interval = setInterval(() => {
        if (index >= shapeNames.length) {
            clearInterval(interval);
            console.log('✅ Shape testing complete!');
            return;
        }
        
        const shapeName = shapeNames[index];
        console.log(`Testing shape: ${shapeName}`);
        changeShape(shapeName);
        index++;
    }, 2000);
}

// Quick test function for immediate shape switching
function quickTest() {
    console.log('🚀 Quick shape test...');
    const shapes = ['random', 'circle', 'cube', 'hand', 'sineWave', 'spiral', 'diamond'];
    let currentIndex = 0;
    
    const testInterval = setInterval(() => {
        if (currentIndex >= shapes.length) {
            clearInterval(testInterval);
            console.log('✅ Quick test complete!');
            return;
        }
        
        const shape = shapes[currentIndex];
        console.log(`🔄 Switching to: ${shape}`);
        changeShape(shape);
        currentIndex++;
    }, 1000);
}

// Function to return to default random layout
function resetToRandom() {
    changeShape('random');
    console.log('🎲 Reset to default Random (Alphabetical) layout');
}

// Make functions available globally for console testing
window.changeShape = changeShape;
window.cycleShape = cycleShape;
window.testShapes = testShapes;
window.quickTest = quickTest;
window.resetToRandom = resetToRandom;
window.SHAPE_BANK = SHAPE_BANK;

// Original organic positioning function (restored for random layout)
function positionCardOrganically(index, totalCards) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = Math.max(window.innerHeight, 1000);
    
    // Define safe margins
    const margin = 80;
    const minX = margin;
    const maxX = viewportWidth - margin;
    const minY = margin;
    const maxY = viewportHeight - margin;
    
    // Try multiple positions to find a good organic placement
    let bestPosition = null;
    let bestScore = -1;
    
    for (let attempt = 0; attempt < 50; attempt++) {
        // Generate random position with some structure
        let x, y;
        
        if (attempt < 10) {
            // First 10 attempts: try center-biased positions
            const centerBias = 0.3;
            x = (viewportWidth / 2) + (Math.random() - 0.5) * viewportWidth * centerBias;
            y = (viewportHeight / 2) + (Math.random() - 0.5) * viewportHeight * centerBias;
        } else {
            // Remaining attempts: full random
            x = Math.random() * (maxX - minX) + minX;
            y = Math.random() * (maxY - minY) + minY;
        }
        
        // Ensure position is within bounds
        x = Math.max(minX, Math.min(maxX, x));
        y = Math.max(minY, Math.min(maxY, y));
        
        // Calculate score based on distance from other cards and edge proximity
        let score = 0;
        
        // Prefer positions away from edges
        const edgeDistance = Math.min(
            x - minX,
            maxX - x,
            y - minY,
            maxY - y
        );
        score += edgeDistance * 0.1;
        
        // Check distance from existing positioned cards
        let minDistance = Infinity;
        for (const existingCard of positionedCards) {
            const distance = Math.sqrt(
                Math.pow(x - existingCard.x, 2) + Math.pow(y - existingCard.y, 2)
            );
            minDistance = Math.min(minDistance, distance);
        }
        
        if (minDistance > 120) { // Minimum distance between cards
            score += minDistance * 0.5;
        } else {
            score -= 1000; // Heavy penalty for too close
        }
        
        // Add some randomness to avoid perfect patterns
        score += Math.random() * 50;
        
        if (score > bestScore) {
            bestScore = score;
            bestPosition = { x, y };
        }
    }
    
    // Fallback to simple random if no good position found
    if (!bestPosition) {
        bestPosition = {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY
        };
    }
    
    return bestPosition;
}

// Mobile grid positioning - true masonry layout with proper spacing
function calculateMobileGridPosition(index, totalCards, viewportWidth, viewportHeight, dimensions) {
    // Mobile: Single column with comfortable spacing
    const margin = 25; // Top/bottom margin
    const cardSpacing = 25; // Spacing between cards
    const cardWidth = dimensions.width;
    const cardHeight = dimensions.height;
    
    // Debug: Log the parameters
    if (index === 0) {
        console.log(`🔧 calculateMobileGridPosition called with: index=${index}, totalCards=${totalCards}, viewport=${viewportWidth}x${viewportHeight}`);
        console.log(`🔧 Card dimensions: width=${cardWidth}, height=${cardHeight}`);
    }
    
    // Single column layout - all cards with dramatic horizontal offset
    if (index === 0) {
        window.mobileColumnY = margin; // Start with top margin
        console.log(`🔧 Initialized column Y position:`, window.mobileColumnY);
    }
    
    // Calculate controlled horizontal offset - alternating left/right with max 2 consecutive
    const availableSpace = viewportWidth - cardWidth; // Space when card is fully visible (~36% of viewport)
    
    if (index === 0) {
        console.log(`🔧 Offset calculation: cardWidth=${cardWidth.toFixed(0)}px, viewportWidth=${viewportWidth}px, availableSpace=${availableSpace.toFixed(0)}px`);
        window.mobileOffsetHistory = []; // Track last 2 positions
    }
    
    // Determine if we can repeat the same position (max 2 in a row)
    const lastTwo = window.mobileOffsetHistory.slice(-2);
    const canGoLeft = !(lastTwo.length === 2 && lastTwo[0] === 'left' && lastTwo[1] === 'left');
    const canGoRight = !(lastTwo.length === 2 && lastTwo[0] === 'right' && lastTwo[1] === 'right');
    
    let randomOffset;
    let position;
    
    // Choose left or right, avoiding 3 in a row
    if (!canGoLeft && canGoRight) {
        // Must go right (already 2 lefts in a row)
        position = 'right';
    } else if (!canGoRight && canGoLeft) {
        // Must go left (already 2 rights in a row)
        position = 'left';
    } else {
        // Can go either way - random choice
        position = Math.random() > 0.5 ? 'left' : 'right';
    }
    
    if (position === 'left') {
        // Extend beyond LEFT edge (negative X)
        randomOffset = -(30 + Math.random() * 60); // -30 to -90px (goes offscreen left)
    } else {
        // Extend beyond RIGHT edge (large positive X)
        randomOffset = availableSpace + (30 + Math.random() * 60); // Push card right so it extends offscreen
    }
    
    // Track this position
    window.mobileOffsetHistory.push(position);
    
    // Calculate X position - offset directly
    const x = randomOffset;
    
    // Calculate Y position - stack vertically with spacing
    const y = window.mobileColumnY;
    
    // Update Y position for next card (add height of this card + spacing)
    window.mobileColumnY = y + cardHeight + cardSpacing;
    
    const offsetDirection = position === 'left' ? 'OFFSCREEN LEFT ←' : 'OFFSCREEN RIGHT →';
    const historyStr = window.mobileOffsetHistory.slice(-3).join('-');
    console.log(`📐 Card ${index}: x=${x.toFixed(0)}, y=${y}, position=${position} (${offsetDirection}), history=[${historyStr}], height=${cardHeight}, nextY=${window.mobileColumnY}`);
    
    // Store the calculated dimensions for CSS consistency
    window.mobileCardWidth = cardWidth;
    window.mobileCardHeight = cardHeight;
    window.mobileCardSpacing = cardSpacing;
    window.mobileMargin = margin;
    
    // Update CSS custom properties for exact positioning
    if (index === 0) { // Only update once per layout
        document.documentElement.style.setProperty('--mobile-card-width', `${Math.floor(cardWidth)}px`);
        document.documentElement.style.setProperty('--mobile-card-spacing', `${cardSpacing}px`);
        document.documentElement.style.setProperty('--mobile-margin', `${margin}px`);
        
        // Container height will be calculated after all cards are processed
        
        console.log(`📐 GRID CALCULATION DEBUG:`, {
            viewportWidth,
            margin,
            cardSpacing,
            cardWidth,
            cardHeight,
            totalCards,
            cssVariables: {
                '--mobile-card-width': `${cardWidth}px`,
                '--mobile-card-height': `${cardHeight}px`,
                '--mobile-card-spacing': `${cardSpacing}px`,
                '--mobile-margin': `${margin}px`
            }
        });
    }
    
    return { x, y };
}

// Calculate and set container height for masonry layout
function updateMasonryContainerHeight() {
    if (window.innerWidth <= 768 && window.mobileColumnHeights) {
        const margin = 16;
        const maxColumnHeight = Math.max(...window.mobileColumnHeights);
        const totalHeight = maxColumnHeight + margin + 100; // Increased padding for proper scroll ending
        const projectGrid = document.querySelector('.project-grid');
        if (projectGrid) {
            projectGrid.style.minHeight = `${totalHeight}px`;
            console.log(`📏 Set masonry container height to ${totalHeight}px (max column height: ${maxColumnHeight}px)`);
        }
    }
}


// Calculate position based on current shape
function calculateShapePosition(index, totalCards, centerX, centerY, radius) {
    if (currentShape === 'random') {
        // For random layout, use the original organic positioning approach
        return positionCardOrganically(index, totalCards);
    } else {
        const shape = SHAPE_BANK[currentShape];
        return shape.calculatePosition(index, totalCards, centerX, centerY, radius);
    }
}

// Calculate overlap between cards (simplified for circular layout)
function calculateOverlap(newCard, existingCards) {
    let totalOverlap = 0;
    
    existingCards.forEach(card => {
        const overlapX = Math.max(0, Math.min(newCard.x + newCard.width, card.x + card.width) - Math.max(newCard.x, card.x));
        const overlapY = Math.max(0, Math.min(newCard.y + newCard.height, card.y + card.height) - Math.max(newCard.y, card.y));
        totalOverlap += overlapX * overlapY;
    });
    
    return totalOverlap;
}

// Position card with collision detection to prevent overlaps
function getRandomSizeClass() {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// Fast static positioning - no collision detection needed
function positionCardCircularly(card, sizeClass, index, totalCards) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = Math.max(window.innerHeight, 1000);
    
    // Get card dimensions
    let dimensions = getCardDimensions(sizeClass);
    
    // Override height for mobile staggered masonry
    if (window.innerWidth <= 768) {
        // Staggered heights for natural masonry feel - reduced by 25%
        const baseHeight = 120 * 1.25 * 0.75; // 112.5px
        const heightVariations = [0, 15, 25, -8, 20, -5, 23, 13].map(v => v * 1.25 * 0.75);
        const heightVariation = heightVariations[index % heightVariations.length];
        const cardHeight = baseHeight + heightVariation;
        
        dimensions = {
            width: dimensions.width, // Use the 2x viewport width from getCardDimensions
            height: cardHeight
        };
    }
    
    let position;
    
    // Mobile: Use grid layout for all shapes
    if (window.innerWidth <= 768) {
        position = calculateMobileGridPosition(index, totalCards, viewportWidth, viewportHeight, dimensions);
        console.log(`🔍 Mobile card ${index}: position=${JSON.stringify(position)}, dimensions=${JSON.stringify(dimensions)}`);
        console.log(`📱 Viewport: ${viewportWidth}x${viewportHeight}, Total cards: ${totalCards}`);
        
        // Enhanced debug for card positioning and sizing
        setTimeout(() => {
            const allCards = document.querySelectorAll('.project-block');
            const card = allCards[index];
            if (card) {
                const cardRect = card.getBoundingClientRect();
                const computedStyle = getComputedStyle(card);
                const thumbnail = card.querySelector('.thumbnail-overlay');
                const img = thumbnail?.querySelector('img');
                const blockSurface = card.querySelector('.block-surface');
                
                console.log(`🎯 CARD ${index} DETAILED DEBUG:`, {
                    // Card positioning
                    cardPosition: {
                        left: card.style.left,
                        top: card.style.top,
                        position: computedStyle.position
                    },
                    // Card dimensions
                    cardDimensions: {
                        width: card.style.width,
                        height: card.style.height,
                        computedWidth: computedStyle.width,
                        computedHeight: computedStyle.height
                    },
                    // Actual rendered size
                    cardRect: {
                        x: cardRect.x,
                        y: cardRect.y,
                        width: cardRect.width,
                        height: cardRect.height
                    },
                    // CSS variables
                    cssVariables: {
                        mobileCardWidth: getComputedStyle(document.documentElement).getPropertyValue('--mobile-card-width'),
                        mobileCardHeight: getComputedStyle(document.documentElement).getPropertyValue('--mobile-card-height'),
                        mobileCardSpacing: getComputedStyle(document.documentElement).getPropertyValue('--mobile-card-spacing'),
                        mobileMargin: getComputedStyle(document.documentElement).getPropertyValue('--mobile-margin')
                    },
                    // Thumbnail info
                    thumbnail: {
                        rect: thumbnail?.getBoundingClientRect(),
                        imgRect: img?.getBoundingClientRect(),
                        imgSrc: img?.src?.split('/').pop()
                    }
                });
                
                // Check for overlaps with other cards (desktop only - mobile uses perfect grid)
                if (window.innerWidth > 768) {
                    const otherCards = Array.from(allCards).filter((c, i) => i !== index);
                    const overlaps = otherCards.filter(otherCard => {
                        const otherRect = otherCard.getBoundingClientRect();
                        return !(cardRect.right <= otherRect.left || 
                               cardRect.left >= otherRect.right || 
                               cardRect.bottom <= otherRect.top || 
                               cardRect.top >= otherRect.bottom);
                    });
                    
                    if (overlaps.length > 0) {
                        console.warn(`⚠️ CARD ${index} OVERLAPS with cards:`, overlaps.map(c => Array.from(allCards).indexOf(c)));
                    }
                }
            }
        }, 1000 + index * 100); // Stagger debug logs
        
        // No need to store positioned cards for grid layout
    } else if (currentShape === 'random') {
        // Use pre-sorted organic positions (sorted by X coordinate)
        if (window.sortedOrganicPositions && window.sortedOrganicPositions[index]) {
            position = { x: window.sortedOrganicPositions[index].x, y: window.sortedOrganicPositions[index].y };
            console.log(`Project ${index} using position:`, position);
        } else {
            position = positionCardOrganically(index, totalCards);
        }
    } else {
        // Use geometric shapes for other layouts on desktop
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        
        // Adjust radius based on viewport size and number of cards (doubled for larger shapes)
        const baseRadius = Math.min(viewportWidth, viewportHeight) * 0.5; // Doubled from 0.25 to 0.5
        const radius = Math.max(baseRadius, 400); // Doubled minimum radius from 200 to 400
        
        // Get shape-based position
        position = calculateShapePosition(index, totalCards, centerX, centerY, radius);
    }
    
    // For mobile grid, use exact positioning; for desktop, center the card
    let x, y;
    if (window.innerWidth <= 768) {
        // Mobile: Use exact grid positioning
        x = position.x;
        y = position.y;
    } else {
        // Desktop: Center the card on the calculated position
        x = position.x - dimensions.width / 2;
        y = position.y - dimensions.height / 2;
    }
    
    // Ensure cards don't go off-screen (desktop only - mobile allows scrolling)
    let finalX, finalY;
    if (window.innerWidth <= 768) {
        // Mobile: Allow cards to extend beyond viewport (including negative X for left-cropping)
        finalX = x; // Allow negative X for left-side cropping!
        finalY = Math.max(y, 0); // Only prevent negative Y
    } else {
        // Desktop: Keep cards within viewport
    const maxX = viewportWidth - dimensions.width - 20;
    const maxY = viewportHeight - dimensions.height - 20;
        finalX = Math.min(Math.max(x, 20), maxX);
        finalY = Math.min(Math.max(y, 20), maxY);
    }
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    card.style.width = Math.floor(dimensions.width) + 'px';
    card.style.height = dimensions.height + 'px';
    
    // Force mobile dimensions to override any CSS
    if (window.innerWidth <= 768) {
        // Use the calculated dimensions directly - no overrides!
        card.style.width = Math.floor(dimensions.width) + 'px';
        card.style.minWidth = Math.floor(dimensions.width) + 'px';
        card.style.minHeight = dimensions.height + 'px';
        
        // Store offset data for scroll animation
        card.dataset.initialX = finalX;
        card.dataset.finalY = finalY;
        card.dataset.cardWidth = Math.floor(dimensions.width);
        
        console.log(`📏 Applied mobile card dimensions: ${dimensions.width}px x ${dimensions.height}px`);
    }
    
    // Store positioned card info for collision detection (for random layout, desktop only)
    if (currentShape === 'random' && window.innerWidth > 768) {
        positionedCards.push({
            x: finalX + dimensions.width / 2,
            y: finalY + dimensions.height / 2,
            width: dimensions.width,
            height: dimensions.height
        });
    }
    
    return { x: finalX, y: finalY, width: dimensions.width, height: dimensions.height };
}

function positionCardStatically(card, sizeClass, index) {
    const dimensions = getCardDimensions(sizeClass);
    const viewportWidth = window.innerWidth;
    const viewportHeight = Math.max(window.innerHeight, 1000);
    
    // Simple grid layout
    const margin = 40;
    const spacing = 60;
    const cardsPerRow = Math.floor((viewportWidth - margin * 2) / (dimensions.width + spacing));
    
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    
    const x = margin + col * (dimensions.width + spacing);
    const y = margin + row * (dimensions.height + spacing);
    
    // Ensure cards don't go off-screen
    const maxX = viewportWidth - dimensions.width - margin;
    const maxY = viewportHeight - dimensions.height - margin;
    
    card.style.left = Math.min(x, maxX) + 'px';
    card.style.top = Math.min(y, maxY) + 'px';
    card.style.position = 'absolute';
}

function positionCardRandomly(card, sizeClass, index) {
    const dimensions = getCardDimensions(sizeClass);
    const viewportWidth = window.innerWidth;
    const viewportHeight = Math.max(window.innerHeight, 1000);
    
    const margin = 40;
    const spacing = 40; // Increased spacing between cards for better viewport utilization
    const availableWidth = Math.max(viewportWidth - dimensions.width - margin * 2, 100);
    const availableHeight = viewportHeight - margin * 2; // Use full viewport height
    
    // Try to find a non-overlapping position
    let attempts = 0;
    let position;
    
    do {
        // Much more aggressive approach - force cards to use full viewport height
        const gridCols = Math.floor(availableWidth / (dimensions.width + spacing));
        
        // Calculate grid column
        const gridCol = index % gridCols;
        
        // Center the grid horizontally
        const totalGridWidth = gridCols * (dimensions.width + spacing) - spacing;
        const gridStartX = (viewportWidth - totalGridWidth) / 2;
        const baseX = gridStartX + gridCol * (dimensions.width + spacing);
        
        // Force vertical distribution across full height
        const totalCards = document.querySelectorAll('.project-block').length;
        const verticalStep = availableHeight / Math.max(totalCards / gridCols, 1);
        
        // Base vertical position with forced distribution
        let baseY = margin + (index / gridCols) * verticalStep;
        
        // Add significant random offset to break up the grid
        const randomOffsetX = (Math.random() - 0.5) * 80; // ±40px randomness
        const randomOffsetY = (Math.random() - 0.5) * 150; // ±75px randomness - very aggressive
        
        // Force some cards to go much lower
        if (index > 0 && index % 3 === 0) {
            baseY += Math.random() * 300; // Push cards way down
        }
        
        let finalX = baseX + randomOffsetX;
        let finalY = baseY + randomOffsetY;
        
        // Ensure cards stay within bounds but use full viewport height with bottom safety
        finalX = Math.max(margin, Math.min(finalX, availableWidth));
        finalY = Math.max(margin, Math.min(finalY, availableHeight - 100)); // 100px safety margin at bottom
        
        position = {
            x: finalX,
            y: finalY,
            width: dimensions.width,
            height: dimensions.height
        };
        
        attempts++;
        
        // If we've tried too many times, just use the position (fallback)
        if (attempts > 50) break;
        
    } while (calculateOverlap(position, positionedCards) > 0);
    
    positionedCards.push(position);
    
    card.style.left = position.x + 'px';
    card.style.top = position.y + 'px';
    card.style.zIndex = 20 + index;
    
    return position;
}


// Create curved connection lines between project cards
// Simplified connection lines - much faster
function createConnectionLinesSimple() {
    const projectCards = document.querySelectorAll('.project-block');
    const viewportCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    
    // Clear existing lines
    document.querySelectorAll('.connection-line').forEach(line => line.remove());
    
    // Create only a few strategic lines instead of many
    projectCards.forEach((card, index) => {
        // Only create lines for every 3rd card to reduce complexity
        if (index % 3 === 0) {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = {
                x: cardRect.left + cardRect.width / 2,
                y: cardRect.top + cardRect.height / 2
            };
            
            // Create line to center (simplified)
            createSimpleLine(cardCenter, viewportCenter);
        }
    });
}

function createSimpleLine(start, end) {
    const line = document.createElement('div');
    line.className = 'connection-line';
    
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
    
    line.style.position = 'absolute';
    line.style.left = start.x + 'px';
    line.style.top = start.y + 'px';
    line.style.width = distance + 'px';
    line.style.height = '1px';
    line.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    line.style.pointerEvents = 'none';
    line.style.zIndex = '1';
    
    document.body.appendChild(line);
    
    // Animate in
    setTimeout(() => {
        line.style.opacity = '0.8';
        line.style.transition = 'opacity 0.5s ease';
    }, 100);
}

function createConnectionLines() {
    const projectCards = document.querySelectorAll('.project-block');
    const isMobile = window.innerWidth <= 768;
    
    const viewportCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    
    // Clear existing lines and mobile SVG
    document.querySelectorAll('.connection-line').forEach(line => line.remove());
    document.querySelectorAll('.mobile-connections-svg').forEach(svg => svg.remove());
    
    // Wait to ensure all cards are positioned with the new algorithm
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            let cardCenter;
            
            // Mobile: use absolute position from style, Desktop: use viewport position
            if (isMobile) {
                const x = parseFloat(card.style.left) || 0;
                const y = parseFloat(card.style.top) || 0;
                const width = parseFloat(card.style.width) || card.offsetWidth;
                const height = parseFloat(card.style.height) || card.offsetHeight;
                
                cardCenter = {
                    x: x + width / 2,
                    y: y + height / 2
                };
                
                console.log(`📍 Card ${index} center: ${cardCenter.x.toFixed(0)},${cardCenter.y.toFixed(0)} (from style: ${x},${y} + ${width}x${height})`);
            } else {
                const cardRect = card.getBoundingClientRect();
                cardCenter = {
                    x: cardRect.left + cardRect.width / 2,
                    y: cardRect.top + cardRect.height / 2
                };
            }
            
            
            // Create lines to viewport center (50% chance)
            if (Math.random() < 0.5) {
                createCurvedLine(cardCenter, viewportCenter, 'center');
            }
            
            // Create lines to other cards with similar tags (40% chance)
            if (Math.random() < 0.4 && projectCards.length > 1) {
                const currentTags = card.getAttribute('data-tags')?.split(',') || [];
                const otherCards = Array.from(projectCards).filter((_, i) => i !== index);
                
                // Find cards with matching tags
                const matchingCards = otherCards.filter(otherCard => {
                    const otherTags = otherCard.getAttribute('data-tags')?.split(',') || [];
                    return currentTags.some(tag => otherTags.includes(tag));
                });
                
                // If no matching tags, connect to random card
                const targetCard = matchingCards.length > 0 ? 
                    matchingCards[Math.floor(Math.random() * matchingCards.length)] :
                    otherCards[Math.floor(Math.random() * otherCards.length)];
                
                let targetCenter;
                if (isMobile) {
                    const x = parseFloat(targetCard.style.left) || 0;
                    const y = parseFloat(targetCard.style.top) || 0;
                    const width = parseFloat(targetCard.style.width) || targetCard.offsetWidth;
                    const height = parseFloat(targetCard.style.height) || targetCard.offsetHeight;
                    
                    targetCenter = {
                        x: x + width / 2,
                        y: y + height / 2
                    };
                } else {
                    const targetRect = targetCard.getBoundingClientRect();
                    targetCenter = {
                        x: targetRect.left + targetRect.width / 2,
                        y: targetRect.top + targetRect.height / 2
                    };
                }
                
                createCurvedLine(cardCenter, targetCenter, 'card');
            }
        });
    }, 150); // Delay to ensure positioning is complete
}

function createMobileSVGConnection(start, end, type) {
    // Get or create SVG container for mobile connections (absolute positioned, scrolls with content)
    let svg = document.querySelector('.mobile-connections-svg');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('mobile-connections-svg');
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 20;
            overflow: visible;
        `;
        
        // Add to project-grid so it scrolls with cards
        const projectGrid = document.querySelector('.project-grid');
        if (projectGrid) {
            projectGrid.appendChild(svg);
            console.log('🔗 SVG container added to project-grid');
        } else {
            document.body.appendChild(svg);
            console.log('🔗 SVG container added to body (fallback)');
        }
    }
    
    // Coordinates are already absolute (from card.style.left/top), no conversion needed
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const curveRadius = Math.min(Math.abs(deltaX), Math.abs(deltaY)) * 0.25;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (length === 0) return;
    
    // Create single center path (simplified for mobile - no triple paths)
    let pathData;
    
    // Use same rounded corner logic as desktop
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal first (L-shape)
        if (deltaX > 0 && deltaY > 0) {
            pathData = `M ${start.x} ${start.y} L ${end.x - curveRadius} ${start.y} Q ${end.x} ${start.y}, ${end.x} ${start.y + curveRadius} L ${end.x} ${end.y}`;
        } else if (deltaX > 0 && deltaY < 0) {
            pathData = `M ${start.x} ${start.y} L ${end.x - curveRadius} ${start.y} Q ${end.x} ${start.y}, ${end.x} ${start.y - curveRadius} L ${end.x} ${end.y}`;
        } else if (deltaX < 0 && deltaY > 0) {
            pathData = `M ${start.x} ${start.y} L ${end.x + curveRadius} ${start.y} Q ${end.x} ${start.y}, ${end.x} ${start.y + curveRadius} L ${end.x} ${end.y}`;
        } else {
            pathData = `M ${start.x} ${start.y} L ${end.x + curveRadius} ${start.y} Q ${end.x} ${start.y}, ${end.x} ${start.y - curveRadius} L ${end.x} ${end.y}`;
        }
    } else {
        // Vertical first (Z-shape)
        if (deltaX > 0 && deltaY > 0) {
            pathData = `M ${start.x} ${start.y} L ${start.x} ${end.y - curveRadius} Q ${start.x} ${end.y}, ${start.x + curveRadius} ${end.y} L ${end.x} ${end.y}`;
        } else if (deltaX > 0 && deltaY < 0) {
            pathData = `M ${start.x} ${start.y} L ${start.x} ${end.y + curveRadius} Q ${start.x} ${end.y}, ${start.x + curveRadius} ${end.y} L ${end.x} ${end.y}`;
        } else if (deltaX < 0 && deltaY > 0) {
            pathData = `M ${start.x} ${start.y} L ${start.x} ${end.y - curveRadius} Q ${start.x} ${end.y}, ${start.x - curveRadius} ${end.y} L ${end.x} ${end.y}`;
        } else {
            pathData = `M ${start.x} ${start.y} L ${start.x} ${end.y + curveRadius} Q ${start.x} ${end.y}, ${start.x - curveRadius} ${end.y} L ${end.x} ${end.y}`;
        }
    }
    
    // Use same color scheme as desktop: green, grey, pale grey
    const colors = [
        'rgba(144,238,144,1.0)', // Pastel green
        'rgba(128,128,128,1.0)', // Grey
        'rgba(200,200,200,1.0)'  // Pale grey
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create path with desktop styling
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1'); // Match desktop
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.6'); // Match desktop
    
    svg.appendChild(path);
    
    // Add text label (same as desktop)
    const connectionText = getConnectionText(start, end, type);
    if (connectionText) {
        const midPoint = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2
        };
        
        // Calculate offset direction along the line
        const offsetDistance = 500; // pixels to travel along the line (much more dramatic)
        const offsetX = deltaX !== 0 ? (deltaX / length) * offsetDistance : 0;
        const offsetY = deltaY !== 0 ? (deltaY / length) * offsetDistance : 0;
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midPoint.x);
        text.setAttribute('y', midPoint.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-family', 'JetBrains Mono');
        text.setAttribute('font-size', '40');
        text.setAttribute('font-weight', '200');
        text.setAttribute('fill', 'rgba(144,238,144,0.8)');
        text.setAttribute('opacity', '0.7');
        text.textContent = connectionText;
        
        // Store initial position and offset for scroll animation
        text.dataset.initialX = midPoint.x;
        text.dataset.initialY = midPoint.y;
        text.dataset.offsetX = offsetX;
        text.dataset.offsetY = offsetY;
        
        svg.appendChild(text);
    }
    
    console.log(`🔗 Mobile connection: ${start.x.toFixed(0)},${start.y.toFixed(0)} → ${end.x.toFixed(0)},${end.y.toFixed(0)}, color: ${color}, text: ${connectionText}`);
}

function createCurvedLine(start, end, type) {
    // Create mobile SVG paths or desktop div lines
    if (window.innerWidth <= 768) {
        createMobileSVGConnection(start, end, type);
        return;
    }
    
    const line = document.createElement('div');
    line.className = 'connection-line';
    
    // Calculate direction and determine curve type
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const curveRadius = Math.min(Math.abs(deltaX), Math.abs(deltaY)) * 0.25;
    
    // Calculate perpendicular offset for parallel lines
    const lineSpacing = 12; // Increased spacing between parallel lines
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Prevent division by zero
    if (length === 0) {
        return;
    }
    
    const perpX = (-deltaY / length) * lineSpacing;
    const perpY = (deltaX / length) * lineSpacing;
    
    // Create three parallel lines with different starting points
    const lineOffsets = [
        { x: -perpX, y: -perpY, startOffset: { x: -8, y: 8 } }, // Left line - bottom left of card
        { x: 0, y: 0, startOffset: { x: 0, y: 0 } },           // Center line - center of card
        { x: perpX, y: perpY, startOffset: { x: 8, y: 8 } }    // Right line - bottom right of card
    ];
    
    let pathData = '';
    
    lineOffsets.forEach((offset, index) => {
        const adjustedStart = {
            x: start.x + offset.x + offset.startOffset.x,
            y: start.y + offset.y + offset.startOffset.y
        };
        const adjustedEnd = {
            x: end.x + offset.x,
            y: end.y + offset.y
        };
        
        let singlePathData;
        
        // Determine path based on direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal first (L-shape)
            if (deltaX > 0 && deltaY > 0) {
                // Right and down
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedEnd.x - curveRadius} ${adjustedStart.y} Q ${adjustedEnd.x} ${adjustedStart.y}, ${adjustedEnd.x} ${adjustedStart.y + curveRadius} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            } else if (deltaX > 0 && deltaY < 0) {
                // Right and up
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedEnd.x - curveRadius} ${adjustedStart.y} Q ${adjustedEnd.x} ${adjustedStart.y}, ${adjustedEnd.x} ${adjustedStart.y - curveRadius} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            } else if (deltaX < 0 && deltaY > 0) {
                // Left and down
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedEnd.x + curveRadius} ${adjustedStart.y} Q ${adjustedEnd.x} ${adjustedStart.y}, ${adjustedEnd.x} ${adjustedStart.y + curveRadius} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            } else {
                // Left and up
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedEnd.x + curveRadius} ${adjustedStart.y} Q ${adjustedEnd.x} ${adjustedStart.y}, ${adjustedEnd.x} ${adjustedStart.y - curveRadius} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            }
        } else {
            // Vertical first (Z-shape)
            if (deltaX > 0 && deltaY > 0) {
                // Right and down
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedStart.x} ${adjustedEnd.y - curveRadius} Q ${adjustedStart.x} ${adjustedEnd.y}, ${adjustedStart.x + curveRadius} ${adjustedEnd.y} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            } else if (deltaX > 0 && deltaY < 0) {
                // Right and up
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedStart.x} ${adjustedEnd.y + curveRadius} Q ${adjustedStart.x} ${adjustedEnd.y}, ${adjustedStart.x + curveRadius} ${adjustedEnd.y} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            } else if (deltaX < 0 && deltaY > 0) {
                // Left and down
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedStart.x} ${adjustedEnd.y - curveRadius} Q ${adjustedStart.x} ${adjustedEnd.y}, ${adjustedStart.x - curveRadius} ${adjustedEnd.y} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            } else {
                // Left and up
                singlePathData = `M ${adjustedStart.x} ${adjustedStart.y} L ${adjustedStart.x} ${adjustedEnd.y + curveRadius} Q ${adjustedStart.x} ${adjustedEnd.y}, ${adjustedStart.x - curveRadius} ${adjustedEnd.y} L ${adjustedEnd.x} ${adjustedEnd.y}`;
            }
        }
        
        // Different colors for each line
        const colors = [
            'rgba(144,238,144,1.0)', // Pastel green
            'rgba(128,128,128,1.0)', // Grey
            'rgba(200,200,200,1.0)'  // Pale grey
        ];
        
        const connectionText = getConnectionText(start, end, type);
        
        // Create static path with no animation
        pathData += `<path d="${singlePathData}" stroke="${colors[index]}" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>`;
        
        // Add static text label for the middle line only
        if (index === 1 && connectionText) { // Middle line (grey)
            const midPoint = {
                x: (adjustedStart.x + adjustedEnd.x) / 2,
                y: (adjustedStart.y + adjustedEnd.y) / 2
            };
            
            pathData += `<text x="${midPoint.x}" y="${midPoint.y}" text-anchor="middle" dominant-baseline="middle" 
                font-family="JetBrains Mono" font-size="8" font-weight="200" fill="rgba(144,238,144,0.8)" 
                opacity="0.7">
                ${connectionText}
            </text>`;
        }
    });
    
    line.innerHTML = `
        <svg style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 15; overflow: visible;">
            ${pathData}
        </svg>
    `;
    
    document.body.appendChild(line);
    
}

// Debug function to compare positions
function debugPositions() {
    const blocks = document.querySelectorAll('.project-block');
    const paths = document.querySelectorAll('.connection-path');
    
    console.log('=== POSITION DEBUG COMPARISON ===');
    console.log('Project Blocks:');
    
    blocks.forEach((block, index) => {
        const style = window.getComputedStyle(block);
        const rect = block.getBoundingClientRect();
        const projectGrid = document.querySelector('.project-grid');
        const gridRect = projectGrid.getBoundingClientRect();
        
        console.log(`Block ${index}: "${block.querySelector('.block-title')?.textContent || 'No title'}"`);
        console.log(`  CSS left: ${style.left}, CSS top: ${style.top}`);
        console.log(`  CSS width: ${style.width}, CSS height: ${style.height}`);
        console.log(`  getBoundingClientRect: left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`);
        console.log(`  Relative to grid: left=${rect.left - gridRect.left}, top=${rect.top - gridRect.top}`);
        console.log(`  Center (CSS): x=${parseFloat(style.left) + parseFloat(style.width)/2}, y=${parseFloat(style.top) + parseFloat(style.height)/2}`);
        console.log(`  Center (getBoundingClientRect): x=${rect.left + rect.width/2}, y=${rect.top + rect.height/2}`);
        console.log('---');
    });
    
    console.log('Connection Paths:');
    paths.forEach((path, index) => {
        const style = window.getComputedStyle(path);
        console.log(`Path ${index}:`);
        console.log(`  CSS left: ${style.left}, CSS top: ${style.top}`);
        console.log(`  CSS width: ${style.width}, CSS transform: ${style.transform}`);
        console.log('---');
    });
}

// Connection path drawing temporarily disabled
function drawConnectingPaths() {
    // Feature disabled for now
    return;
}

// Reset positioned cards
function resetPositionedCards() {
    positionedCards = [];
}

// Caching system for instant project navigation
function clearProjectCache() {
    console.log('Clearing project cache...');
    projectCache.clear();
    console.log('Project cache cleared successfully');
}

function refreshProjectCache() {
    console.log('Refreshing project cache...');
    clearProjectCache();
    preloadProjectContent();
}

function preloadProjectContent() {
    console.log('Preloading project content...');
    const projectsToCache = window.projects || projects || [];
    const mediaIndex = window.projectMedia || window.mediaIndex || {};
    
    console.log('Media index available:', !!mediaIndex);
    console.log('Media index projects:', Object.keys(mediaIndex.projects || {}));
    
    projectsToCache.forEach(project => {
        // Always regenerate content to ensure it's up-to-date
        const projectHTML = generateProjectHTML(project, mediaIndex);
        projectCache.set(project.id, {
            html: projectHTML,
            project: project,
            loaded: true
        });
    });
    
    console.log(`Cached ${projectCache.size} projects`);
}

// Simple title formatting - just return the title as-is
function formatTitleWithItalics(title) {
    return title;
}

function generateProjectHTML(project, mediaIndex) {
    const extra = (mediaIndex || {}).projects || {};
    const mainDescription = project.fullDescription || project.description || "";
    
    // Separate main description from bullet points
    let mainDescHtml = '';
    let bulletPointsHtml = '';
    
    if (project.fullDescription) {
        const formattedDesc = mainDescription
            .replace(/\\n/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        let mainHtml = '';
        let bulletHtml = '';
        let currentSection = '';
        let inBulletSection = false;
        
        formattedDesc.forEach(line => {
            // Check for section headers (with ** markdown formatting)
            if (line.startsWith('**') && line.endsWith('**')) {
                // Section header - remove ** markers
                if (currentSection) {
                    if (inBulletSection) {
                        bulletHtml += '</ul>';
                    } else {
                        mainHtml += '</ul>';
                    }
                }
                const sectionTitle = line.substring(2, line.length - 2);
                
                // Determine if this is a bullet point section
                inBulletSection = sectionTitle.includes('Technical details') || 
                                sectionTitle.includes('Challenges') || 
                                sectionTitle.includes('Impact') || 
                                sectionTitle.includes('Process');
                
                // Add data attribute for styling
                let dataSection = '';
                if (sectionTitle.includes('Technical details')) dataSection = 'technical';
                else if (sectionTitle.includes('Challenges')) dataSection = 'challenges';
                else if (sectionTitle.includes('Impact')) dataSection = 'impact';
                else if (sectionTitle.includes('Process')) dataSection = 'process';
                
                const headerHtml = `<h3 data-section="${dataSection}">${sectionTitle}</h3><ul>`;
                
                if (inBulletSection) {
                    bulletHtml += headerHtml;
                } else {
                    mainHtml += headerHtml;
                }
                currentSection = sectionTitle;
            } else if (line === 'Technical details and implementation' || 
                       line === 'Challenges and solutions' || 
                       line === 'Impact and results' || 
                       line === 'Process and methodology') {
                // Section header - plain text format
                if (currentSection) {
                    if (inBulletSection) {
                        bulletHtml += '</ul>';
                    } else {
                        mainHtml += '</ul>';
                    }
                }
                const sectionTitle = line;
                
                // Determine if this is a bullet point section
                inBulletSection = sectionTitle.includes('Technical details') || 
                                sectionTitle.includes('Challenges') || 
                                sectionTitle.includes('Impact') || 
                                sectionTitle.includes('Process');
                
                // Add data attribute for styling
                let dataSection = '';
                if (sectionTitle.includes('Technical details')) dataSection = 'technical';
                else if (sectionTitle.includes('Challenges')) dataSection = 'challenges';
                else if (sectionTitle.includes('Impact')) dataSection = 'impact';
                else if (sectionTitle.includes('Process')) dataSection = 'process';
                
                const headerHtml = `<h3 data-section="${dataSection}">${sectionTitle}</h3><ul>`;
                
                if (inBulletSection) {
                    bulletHtml += headerHtml;
                } else {
                    mainHtml += headerHtml;
                }
                currentSection = sectionTitle;
            } else if (line.startsWith('•') || line.startsWith('-')) {
                // Bullet point
                const bulletText = line.slice(1).trim();
                const bulletItem = `<li>${bulletText}</li>`;
                
                if (inBulletSection) {
                    bulletHtml += bulletItem;
                } else {
                    mainHtml += bulletItem;
                }
            } else if (line.length > 0) {
                // Regular paragraph
                if (currentSection) {
                    if (inBulletSection) {
                        bulletHtml += '</ul>';
                    } else {
                        mainHtml += '</ul>';
                    }
                    currentSection = '';
                    inBulletSection = false;
                }
                
                // Check if this should be a prominent statement
                const isProminent = line.length > 20 && line.length < 120 && 
                                  (line.includes('transformed') || 
                                   line.includes('innovative') || 
                                   line.includes('breakthrough') || 
                                   line.includes('revolutionary') || 
                                   line.includes('immersive') || 
                                   line.includes('interactive') || 
                                   line.includes('cutting-edge') || 
                                   line.includes('groundbreaking') ||
                                   line.includes('multiuser') ||
                                   line.includes('music-oriented') ||
                                   line.includes('digital') ||
                                   line.includes('experience') ||
                                   line.includes('installation') ||
                                   line.includes('collaboration'));
                
                const paragraph = isProminent ? 
                    `<p class="prominent-statement">${line}</p>` : 
                    `<p>${line}</p>`;
                
                if (inBulletSection) {
                    bulletHtml += paragraph;
                } else {
                    mainHtml += paragraph;
                }
            }
        });
        
        if (currentSection) {
            if (inBulletSection) {
                bulletHtml += '</ul>';
    } else {
                mainHtml += '</ul>';
            }
        }
        
        mainDescHtml = mainHtml;
        bulletPointsHtml = bulletHtml;
    } else {
        mainDescHtml = `<p>${mainDescription}</p>`;
    }
    
    // Get media - prioritize high-res images and video embeds
    console.log('Looking for media for project:', project.id);
    console.log('Media index structure:', extra);
    console.log('Project media entry:', extra[project.id]);
    const extraMedia = (extra[project.id] || {}).files || [];
    console.log('Extra media files:', extraMedia);
    
    // Check for video embeds first
    const hasVideoEmbed = project.videoEmbed && project.videoEmbed.trim();
    const hasMultipleVideos = project.videoEmbeds && project.videoEmbeds.length > 0;
    
    // Get high-res media files (prefer high-res over thumbnails)
    const highResMedia = extraMedia.map(file => {
        if (typeof file === 'object') {
            // File already has the correct path - use as-is since it's from high-res folder
            const highResPath = file.path;
            const url = `media/${highResPath}`;
            console.log('Generated high-res URL:', url);
            return url;
        }
        return file;
    }).filter(url => {
        // Only include local media files, no external URLs
        return !url.startsWith('http') && !url.startsWith('https') && !url.startsWith('www.');
    });
    
    // Get thumbnail media files (reliable fallback)
    const thumbnailMedia = extraMedia.map(file => 
        typeof file === 'object' ? `media/${file.path}` : file
    ).filter(url => {
        return !url.startsWith('http') && !url.startsWith('https') && !url.startsWith('www.');
    });
    
    // Use high-res if available, otherwise fallback to thumbnails
    const localMedia = highResMedia.length > 0 ? highResMedia : thumbnailMedia;
    const allMedia = localMedia; // Use all available media instead of just first 3
    
    console.log('Media for', project.id, ':', allMedia);
    
    // Create content with images integrated
    let contentBlocks = [];
    
    // Split main description into sections for better image placement
    const mainDescSections = mainDescHtml.split('</ul>').filter(section => section.trim());
    
    // First block: Video embeds (if available) - almost full width
    if (hasVideoEmbed || hasMultipleVideos) {
        let videoContent = '';
        
        if (hasMultipleVideos) {
            // Render multiple videos
            videoContent = project.videoEmbeds.map((videoUrl, index) => `
                <div class="video-embed-item">
                    <h4>Video ${index + 1}</h4>
                    ${renderVideoEmbed(videoUrl)}
                </div>
            `).join('');
        } else if (hasVideoEmbed) {
            // Render single video
            videoContent = renderVideoEmbed(project.videoEmbed);
        }
        
        contentBlocks.push(`
            <div class="content-block video-embed-section">
                <div class="video-section">
                    ${videoContent}
                </div>
            </div>
        `);
    }
    
    // Add impact title section after videos (if exists)
    const impactTitle = project['impact-title'] || '';
    if (impactTitle) {
        // Extract the description part after " — "
        let descriptionOnly = impactTitle;
        const dashIndex = impactTitle.indexOf(' — ');
        if (dashIndex !== -1) {
            descriptionOnly = impactTitle.substring(dashIndex + 3); // Skip " — "
        }
        
        contentBlocks.push(`
            <div class="content-block impact-title-block">
                <div class="impact-title-section">
                    <h2 class="impact-title">${descriptionOnly}</h2>
                </div>
            </div>
        `);
    }
    
    // Second block: main description text + first image (or just text if no video)
    if (allMedia.length > 0) {
        contentBlocks.push(`
            <div class="content-block text-with-image">
                <div class="image-section" onclick="openImageFullscreen('${allMedia[0]}')" style="cursor: pointer;">
                    ${renderMedia(allMedia[0], project.title)}
                </div>
                <div class="text-section">
                    ${mainDescSections[0] || mainDescHtml}
                </div>
            </div>
        `);
    } else {
        // No images, just main description text
        contentBlocks.push(`
            <div class="content-block text-only">
                <div class="text-section">
                    ${mainDescHtml}
                </div>
            </div>
        `);
    }
    
    // Additional blocks: display remaining images in a grid layout
    if (allMedia.length > 1) {
        // Create image grid for remaining images
        const remainingImages = allMedia.slice(1);
        const imageGrid = remainingImages.map(imageUrl => 
            `<div class="image-grid-item" onclick="openImageFullscreen('${imageUrl}')">${renderMedia(imageUrl, project.title)}</div>`
        ).join('');
        
        contentBlocks.push(`
            <div class="content-block image-grid-section">
                <div class="image-grid">
                    ${imageGrid}
                </div>
            </div>
        `);
    }
    
    // Add bullet points section at the end
    if (bulletPointsHtml.trim()) {
        contentBlocks.push(`
            <div class="content-block bullet-points-section">
                <div class="text-section bullet-points">
                    ${bulletPointsHtml}
                </div>
            </div>
        `);
    }
    
    const medias = contentBlocks.join('');
    
    // Get Instagram links
    const insta = (project.instagram || []).map(u => `<a target="_blank" rel="noopener" href="${u}">Instagram</a>`).join(" · ");
    
    // Get first media file for header background
    const headerBackgroundImage = allMedia.length > 0 ? allMedia[0] : null;
    const headerStyle = headerBackgroundImage ? `style="background-image: url('${headerBackgroundImage}');"` : '';
    
    return `
        <article class="project-article">
            <header class="project-header" ${headerStyle}>
                <div class="header-overlay"></div>
                <div class="header-content">
                <h1>${formatTitleWithItalics(project.title)}</h1>
                <p class="meta">${[project.year, project.client, project.role].filter(Boolean).join(" · ")}</p>
                <p class="tech">${project.technologies || ""}</p>
                </div>
            </header>
            
            <div class="project-content">
                ${medias}
            </div>
            
            <footer class="project-footer">
                <p class="links">${insta}</p>
            </footer>
        </article>
    `;
}

function renderVideoEmbed(embedUrl) {
    try {
        console.log('Rendering video embed:', embedUrl);
        
        // Handle different video embed formats
        let m;
        
        // YouTube URLs
        if ((m = embedUrl.match(/^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)/))) {
            const vid = m[1];
            return `<div class="video-embed"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${vid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        if ((m = embedUrl.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/)([\w-]+)/))) {
            const vid = m[1];
            return `<div class="video-embed"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${vid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        
        // Vimeo URLs
        if ((m = embedUrl.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/))) {
            const vid = m[1];
            return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vid}" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
        }
        
        // Direct iframe embed code
        if (embedUrl.includes('<iframe')) {
            return `<div class="video-embed">${embedUrl}</div>`;
        }
        
        // Fallback for other video URLs
        return `<div class="video-embed"><video controls width="100%" height="400" src="${embedUrl}" preload="metadata"></video></div>`;
        
    } catch (e) {
        console.error('Error rendering video embed:', embedUrl, e);
        return `<div class="media-error">Failed to load video: ${embedUrl}</div>`;
    }
}

function renderMedia(url, title) {
    try {
        console.log('Rendering media:', url, 'for title:', title);
        
        let m;
        if ((m = url.match(/^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)/))) {
            const vid = m[1];
            return `<div class="media"><iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        if ((m = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/)([\w-]+)/))) {
            const vid = m[1];
            return `<div class="media"><iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        if ((m = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/))) {
            const vid = m[1];
            return `<div class="media"><iframe src="https://player.vimeo.com/video/${vid}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
        }
        const isVideo = /\.(mp4|webm|mov)$/i.test(url);
        const mediaElement = isVideo ? 
            `<video controls src="${url}" preload="metadata" onerror="console.error('Video failed to load:', '${url}')"></video>` : 
            `<img loading="lazy" src="${url}" alt="${title}" onerror="console.error('Image failed to load:', '${url}')">`;
        return mediaElement;
    } catch (e) {
        console.error('Error rendering media:', url, e);
        return `<div class="media-error">Failed to load: ${url}</div>`;
    }
}

// Overlay system for instant project navigation
function createProjectOverlay() {
    if (currentProjectOverlay) return currentProjectOverlay;
    
    const overlay = document.createElement('div');
    overlay.id = 'project-overlay';
    overlay.className = 'project-overlay';
    overlay.innerHTML = `
        <div class="project-overlay-content">
            <header class="project-overlay-header">
                <a href="#" class="close-project" onclick="closeProjectOverlay()">← Tous les projets</a>
            </header>
            <main id="project-overlay-main"></main>
        </div>
    `;
    
    document.body.appendChild(overlay);
    currentProjectOverlay = overlay;
    return overlay;
}

function showProjectOverlay(projectId) {
    const cachedProject = projectCache.get(projectId);
    if (!cachedProject) {
        console.error('Project not found in cache:', projectId);
        return;
    }
    
    const overlay = createProjectOverlay();
    const main = overlay.querySelector('#project-overlay-main');
    
    // Set the cached HTML content
    main.innerHTML = cachedProject.html;
    
    // Add swipe detection for mobile
    if (window.innerWidth <= 768) {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let isSwipeGesture = false;
        
        console.log('🎯 SWIPE DEBUG: Adding touch event listeners to overlay');
        
        overlay.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            isSwipeGesture = false;
            
            console.log('🎯 SWIPE DEBUG: touchstart', {
                startX: startX,
                startY: startY,
                startTime: startTime,
                timestamp: new Date().toISOString()
            });
        }, { passive: false });
        
        overlay.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            console.log('🎯 SWIPE DEBUG: touchmove', {
                currentX: currentX,
                currentY: currentY,
                deltaX: deltaX,
                deltaY: deltaY,
                absDeltaX: Math.abs(deltaX),
                absDeltaY: Math.abs(deltaY),
                isHorizontal: Math.abs(deltaX) > Math.abs(deltaY),
                thresholdMet: Math.abs(deltaX) > 20
            });
            
            // If horizontal movement is significant and more than vertical, prevent default
            if (Math.abs(deltaX) > 20 && Math.abs(deltaX) > Math.abs(deltaY)) {
                isSwipeGesture = true;
                console.log('🎯 SWIPE DEBUG: Preventing default browser behavior');
                e.preventDefault(); // Prevent browser back gesture
            }
        }, { passive: false });
        
        overlay.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            console.log('🎯 SWIPE DEBUG: touchend', {
                endX: endX,
                endY: endY,
                deltaX: deltaX,
                deltaY: deltaY,
                deltaTime: deltaTime,
                isSwipeGesture: isSwipeGesture,
                rightSwipe: deltaX > 50,
                horizontalDominant: Math.abs(deltaX) > Math.abs(deltaY),
                fastGesture: deltaTime < 500,
                allConditions: isSwipeGesture && deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 500
            });
            
            // Check for right swipe (deltaX > 50px, horizontal movement > vertical, fast gesture)
            if (isSwipeGesture && deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 500) {
                console.log('🎯 SWIPE DEBUG: ✅ RIGHT SWIPE DETECTED - CLOSING OVERLAY');
                e.preventDefault();
                e.stopPropagation();
                closeProjectOverlay();
            } else {
                console.log('🎯 SWIPE DEBUG: ❌ Not a valid right swipe');
            }
            
            // Reset values
            startX = 0;
            startY = 0;
            startTime = 0;
            isSwipeGesture = false;
        }, { passive: false });
    }
    
    // Mobile viewport fixes
    if (window.innerWidth <= 768) {
        // Save scroll position
        const savedScrollPosition = window.pageYOffset;
        
        // Force mobile overlay to be positioned correctly
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateZ(0)';
        overlay.style.overflowY = 'hidden';
        
        // Ensure the content container is also mobile-positioned
        const contentElement = overlay.querySelector('.project-overlay-content');
        if (contentElement) {
            contentElement.style.height = '100vh';
            contentElement.style.maxHeight = '100vh';
            contentElement.style.overflowY = 'auto';
            contentElement.style.padding = '0.5rem';
            contentElement.style.width = '100%';
        }
        
        // Ensure main content area is visible
        const mainElement = main;
        if (mainElement) {
            mainElement.style.position = 'relative';
            mainElement.style.zIndex = '10002';
            mainElement.style.height = 'auto';
            mainElement.style.minHeight = '100vh';
            mainElement.style.overflow = 'visible';
            mainElement.style.backgroundColor = 'transparent';
            mainElement.style.opacity = '1';
            mainElement.style.display = 'block';
        }
        
        // Force the overlay to show content instead of just "darkening"
        setTimeout(() => {
            overlay.classList.add('active');
            overlay.style.opacity = '1';
            overlay.style.display = 'block';
            // Debug log for mobile
            console.log('Mobile overlay positioned:', {
                overlay: {
                    width: overlay.offsetWidth,
                    height: overlay.offsetHeight,
                    display: overlay.style.display,
                    zIndex: overlay.style.zIndex
                },
                content: contentElement ? {
                    width: contentElement.offsetWidth,
                    height: contentElement.offsetHeight
                } : null
            });
        }, 50);
        
        // Prevent body scroll on mobile
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollPosition}px`;
        document.body.style.width = '100%';
        
        // Add swipe gesture support for mobile
        let startX = 0;
        let startY = 0;
        let isSwipeGesture = false;
        
        overlay.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipeGesture = false;
        }, { passive: true });
        
        overlay.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Check if this is a horizontal swipe (more horizontal than vertical movement)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                isSwipeGesture = true;
            }
        }, { passive: true });
        
        overlay.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // Left swipe detected (swipe left to go back)
            if (isSwipeGesture && diffX > 100) {
                console.log('Left swipe detected - closing overlay');
                closeProjectOverlay();
            }
            
            // Reset values
            startX = 0;
            startY = 0;
            isSwipeGesture = false;
        }, { passive: true });
        
        // Restore scroll position when overlay closes
        overlay.addEventListener('closemobile', function() {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, savedScrollPosition);
        });
    }
    
    // Show overlay with animation
    overlay.style.display = 'block';
    overlay.classList.add('active');
    isOverlayOpen = true;
    
    // Add click-outside-to-close functionality
    overlay.addEventListener('click', function(e) {
        // Only close if clicking on the overlay background, not the content
        if (e.target === overlay) {
            closeProjectOverlay();
        }
    });
    
    // Initialize background for project page
    setTimeout(() => {
        generateConcentricSquares();
        initParallaxEffect();
    }, 50);
    
    console.log('Project overlay opened:', projectId);
}

function closeProjectOverlay() {
    if (!currentProjectOverlay || !isOverlayOpen) return;
    
    // Trigger mobile close event if on mobile
    if (window.innerWidth <= 768 && currentProjectOverlay) {
        currentProjectOverlay.dispatchEvent(new Event('closemobile'));
    }
    
    currentProjectOverlay.classList.remove('active');
    setTimeout(() => {
        currentProjectOverlay.style.display = 'none';
        isOverlayOpen = false;
    }, 300);
    
    console.log('Project overlay closed');
}

// Make functions globally available
window.showProjectOverlay = showProjectOverlay;
window.closeProjectOverlay = closeProjectOverlay;
window.refreshProjectCache = refreshProjectCache;
window.clearProjectCache = clearProjectCache;

// Render neural network section
function renderNeuralNetworkSection(sectionId, projectIds) {
    const list = document.getElementById(sectionId);
    // Use the sorted projectsWithMedia array instead of the original unsorted window.projects
    const projectsToUse = window.sortedProjectsWithMedia || window.projects || projects || [];
    const sectionProjects = projectsToUse.filter(p => projectIds.includes(p.id));
    
    console.log('Rendering section:', sectionId);
    console.log('Section projects:', sectionProjects.length);
    
    // Don't filter by thumbnails during initial render - use lazy loading instead
    const projectsWithMedia = sectionProjects;
    
    console.log('Projects with media in section:', projectsWithMedia.length);
    console.log('List element found:', !!list);
    
    if (!list) {
        console.error('List element not found:', sectionId);
        return;
    }
    
    resetPositionedCards();
    
    // Generate HTML for project blocks
    console.log('Creating project blocks HTML...');
    const htmlContent = projectsWithMedia.map((p, index) => {
        console.log(`Processing project ${index + 1}: ${p.title}`);
        
        const shortTitle = p.title || p.id || 'Untitled Project';
        
        // Assign categories based on project characteristics or random distribution
        const categories = ['installation', 'generative', 'performance', 'commercial'];
        const category = p.category || categories[index % categories.length]; // Cycle through categories
        const variation = (index % 4) + 1;
        
        const className = `project-block category-${category} variation-${variation}`;
        const projectNumber = String(index + 1).padStart(2, '0'); // Format as 01, 02, etc.
        console.log(`Project ${index + 1} classes: ${className}`);
        return `<article class="${className}" data-project-title="${p.title}" data-project-id="${p.id}">
            <a href="project.html?id=${p.id}" class="project-link">
                <div class="block-surface">
                    <div class="block-title" data-number="${projectNumber}">${shortTitle}</div>
                    <div class="thumbnail-overlay lazy-thumbnail" data-project-id="${p.id}"></div>
                    <div class="project-hover-text">
                        <div class="project-name">${shortTitle}</div>
                        <div class="project-type">${p.type || 'Installation'}</div>
                        <div class="project-client">${p.client || 'N/A'}</div>
                        <div class="project-location">${p.location || 'N/A'}</div>
                    </div>
                </div>
            </a>
        </article>`;
    }).join("");
    
    console.log('Generated HTML length:', htmlContent.length);
    console.log('First 500 chars of HTML:', htmlContent.substring(0, 500));
    console.log('Setting innerHTML...');
    
    try {
        list.innerHTML = htmlContent;
        console.log('HTML set successfully');
    } catch (error) {
        console.error('Error setting innerHTML:', error);
        console.log('Problematic HTML:', htmlContent.substring(0, 1000));
    }
    
    console.log('HTML set, checking for blocks...');
    console.log('List innerHTML length after set:', list.innerHTML.length);
    console.log('List innerHTML preview:', list.innerHTML.substring(0, 200));
    
    // Check immediately without timeout
    const blocksImmediate = list.querySelectorAll('.project-block');
    console.log('Found blocks immediately after HTML set:', blocksImmediate.length);
    
    // Force visibility test
    if (blocksImmediate.length > 0) {
        console.log('First block found and ready for positioning');
    }
    
    // Mutation observer removed - no longer needed
    
    setTimeout(() => {
        const blocks = list.querySelectorAll('.project-block');
        console.log('Found blocks after timeout:', blocks.length);
        console.log('List element:', list);
        console.log('List innerHTML length:', list.innerHTML.length);
        console.log('List innerHTML preview:', list.innerHTML.substring(0, 500));
        
        if (blocks.length === 0) {
            console.log('NO BLOCKS FOUND - Checking what happened to the HTML');
            console.log('List children:', list.children);
            console.log('List children length:', list.children.length);
            return;
        }
        
        // Position cards randomly (restored visual appeal)
        blocks.forEach((block, index) => {
            const sizeClass = getRandomSizeClass();
            block.classList.add(sizeClass);
            block.setAttribute('data-size', sizeClass); // Ensure data-size is set
            
            // Use shuffled position mapping for random layout to maintain alphabetical order
            const positionIndex = (currentShape === 'random' && window.positionMapping) ? window.positionMapping[index] : index;
            positionCardCircularly(block, sizeClass, positionIndex, blocks.length);
            
            // Progressive loading: fade in cards with staggered timing (much faster)
            setTimeout(() => {
                block.classList.add('loaded');
            }, index * 20); // Reduced from 80ms to 20ms
        });
        
        // Create connection lines (restored full version)
        setTimeout(() => {
            createConnectionLines();
        }, 50);
        
        
        // Refresh parallax effect for new cards (optimized)
        refreshParallaxEffect();
        
        // Create curved connection lines with progressive loading
        setTimeout(() => {
            console.log('About to create connection lines...');
            createConnectionLines();
            
            // Show connection lines after cards are loaded
            setTimeout(() => {
                const connectionLines = document.querySelectorAll('.connection-line');
                connectionLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.classList.add('loaded');
                    }, index * 120); // 120ms delay between each connection line
                });
            }, 500); // Wait 500ms after cards start loading
        }, 200);
    }, 100);
}

// Initialize background dots and image preview effects
function initBackgroundImageHover() {
    // Detect if device is mobile/touch
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    // Create the green dots overlay element
    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.className = 'project-background-image';
    document.body.appendChild(backgroundOverlay);
    
    // Create the side panel for image preview (desktop only)
    const sidePanel = document.createElement('div');
    sidePanel.className = 'image-preview-panel';
    document.body.appendChild(sidePanel);
    
    // Create mobile overlay background
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
    
    if (isMobile) {
        // Mobile: Use the same overlay system, not card expansion
        document.addEventListener('click', function(e) {
            const projectLink = e.target.closest('a[href*="project.html"]');
            if (projectLink) {
                e.preventDefault();
                
                const projectBlock = projectLink.closest('.project-block');
            if (projectBlock) {
                    // Get project ID from URL
                    const projectUrl = projectLink.getAttribute('href');
                    const projectId = projectUrl.split('id=')[1];
                    
                    if (projectId) {
                        // Show instant overlay on mobile (same as desktop)
                        showProjectOverlay(projectId);
                    }
                }
            }
        });
        
    } else {
        // Desktop: Handle click events for instant overlay
        document.addEventListener('click', function(e) {
            const projectLink = e.target.closest('a[href*="project.html"]');
            if (projectLink) {
                e.preventDefault();
                
                const projectBlock = projectLink.closest('.project-block');
                if (projectBlock) {
                    // Get project ID from URL
                    const projectUrl = projectLink.getAttribute('href');
                    const projectId = projectUrl.split('id=')[1];
                    
                    if (projectId) {
                        // Show instant overlay
                        showProjectOverlay(projectId);
                    }
                }
            }
        });
        
        // Desktop: Handle hover events for side panel
        document.addEventListener('mouseover', function(e) {
            const projectBlock = e.target.closest('.project-block');
            if (projectBlock && !projectBlock.classList.contains('transitioning-to-page')) {
                // Show green dots
                backgroundOverlay.classList.add('active');
                
                // Get project ID and find high-res image
                const projectId = projectBlock.getAttribute('data-project-title');
                const project = projects.find(p => p.title === projectId);
                if (project) {
                    const thumbnail = getThumbnail(project.id);
                    if (thumbnail) {
                        // Create and load image in side panel
                        const img = document.createElement('img');
                        img.src = thumbnail;
                        img.loading = 'lazy';
                        sidePanel.innerHTML = '';
                        sidePanel.appendChild(img);
                        sidePanel.classList.add('active');
                    }
                }
            }
        });
        
        // Hide effects when not hovering over project blocks
        document.addEventListener('mouseout', function(e) {
            const projectBlock = e.target.closest('.project-block');
            if (projectBlock && !projectBlock.classList.contains('transitioning-to-page')) {
                // Check if mouse is still over any project block
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !relatedTarget.closest('.project-block')) {
                    backgroundOverlay.classList.remove('active');
                    sidePanel.classList.remove('active');
                }
            }
        });
    }
}

// Lazy loading implementation
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.style.backgroundImage = `url('${src}')`;
                        img.classList.remove('lazy-image');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.style.backgroundImage = `url('${src}')`;
                img.classList.remove('lazy-image');
                img.classList.add('loaded');
            }
        });
    }
}

// Lazy loading for project thumbnails
function initLazyThumbnailLoading() {
    const lazyThumbnails = document.querySelectorAll('.lazy-thumbnail');
    
    if ('IntersectionObserver' in window) {
        const thumbnailObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const thumbnailDiv = entry.target;
                    const projectId = thumbnailDiv.dataset.projectId;
                    const thumbnail = getThumbnail(projectId);
                    
                    if (thumbnail) {
                        // Create img element for GIF animation support
                        const img = document.createElement('img');
                        img.src = thumbnail;
                        
                        // Get the card and its offset to determine object-position
                        const card = thumbnailDiv.closest('.project-block');
                        
                        // Wait for image to load to get aspect ratio
                        img.onload = function() {
                            const aspectRatio = img.naturalWidth / img.naturalHeight;
                            
                            // Make card match the image's aspect ratio
                            if (card && window.innerWidth <= 768) {
                                const cardWidth = parseFloat(card.style.width) || 412;
                                const cardHeight = cardWidth / aspectRatio; // Match image's aspect ratio
                                card.style.height = cardHeight + 'px';
                                
                                console.log(`📸 Card ${projectId}: aspect=${aspectRatio.toFixed(2)}, width=${cardWidth}px, height=${cardHeight.toFixed(0)}px`);
                            }
                        };
                        
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'contain';
                        img.style.position = 'absolute';
                        img.style.top = '0';
                        img.style.left = '0';
                        
                        // Clear any existing content and add the image
                        thumbnailDiv.innerHTML = '';
                        thumbnailDiv.appendChild(img);
                    } else {
                        // Hide thumbnail if no image available
                        thumbnailDiv.style.display = 'none';
                    }
                    
                    thumbnailObserver.unobserve(thumbnailDiv);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before the element comes into view
        });

        lazyThumbnails.forEach(thumbnail => thumbnailObserver.observe(thumbnail));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyThumbnails.forEach(thumbnailDiv => {
            const projectId = thumbnailDiv.dataset.projectId;
            const thumbnail = getThumbnail(projectId);
            
            if (thumbnail) {
                // Create img element for GIF animation support
                const img = document.createElement('img');
                img.src = thumbnail;
                
                // Get the card and its offset to determine object-position
                const card = thumbnailDiv.closest('.project-block');
                
                // Wait for image to load to get aspect ratio
                img.onload = function() {
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    
                    // Make card match the image's aspect ratio
                    if (card && window.innerWidth <= 768) {
                        const cardWidth = parseFloat(card.style.width) || 412;
                        const cardHeight = cardWidth / aspectRatio; // Match image's aspect ratio
                        card.style.height = cardHeight + 'px';
                    }
                };
                
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                
                // Clear any existing content and add the image
                thumbnailDiv.innerHTML = '';
                thumbnailDiv.appendChild(img);
            } else {
                thumbnailDiv.style.display = 'none';
            }
        });
    }
}

// Initialize
let isInitialized = false;
function initializeNeuralNetwork() {
    console.log('initializeNeuralNetwork called, isInitialized:', isInitialized);
    if (isInitialized) {
        console.log('Neural network already initialized, skipping...');
        return;
    }
    
    console.log('=== NEURAL NETWORK INITIALIZATION START ===');
    console.log('window.projects:', window.projects);
    console.log('projects (local):', projects);
    const projectsToUse = window.projects || projects || [];
    console.log('projectsToUse:', projectsToUse);
    console.log('Initializing neural network with projects:', projectsToUse.length);
    
    isInitialized = true;
    
    // Preload all project content for instant navigation
    preloadProjectContent();
    
    if (!projectsToUse.length) {
        console.log('NO PROJECTS FOUND! Showing error message.');
        document.querySelectorAll('.project-grid').forEach(grid => {
            grid.innerHTML = '<p style="padding:16px;color:#9aa">Aucun projet chargé. Vérifiez data.js.</p>';
        });
        return;
    }
    
    console.log('Projects found, proceeding with rendering...');
    
    // Show loading state
    const projectGrid = document.getElementById('list-1');
    if (projectGrid) {
        projectGrid.innerHTML = '<div class="loading loading-dots">Generating neural network</div>';
    }
    
    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
        // Get all project IDs that have media (optimized filtering)
        const projectsWithMedia = projectsToUse.filter(p => {
            const thumbnail = getThumbnail(p.id);
            return thumbnail !== null;
        });
        
        // Sort projects alphabetically by title for consistent ordering
        projectsWithMedia.sort((a, b) => {
            const titleA = (a.title || a.id || '').toLowerCase();
            const titleB = (b.title || b.id || '').toLowerCase();
            return titleA.localeCompare(titleB);
        });
        
        // Create position mapping for random layout
        // Generate positions using the same logic as positionCardOrganically but adapted
        const viewportWidth = window.innerWidth;
        const viewportHeight = Math.max(window.innerHeight, 1000);
        const margin = 80;
        const minX = margin;
        const maxX = viewportWidth - margin;
        const minY = margin;
        const maxY = viewportHeight - margin;
        
        const organicPositions = [];
        const usedPositions = []; // Track used positions for collision detection
        
        for (let i = 0; i < projectsWithMedia.length; i++) {
            let bestPosition = null;
            let bestScore = -1;
            
            // Try multiple positions to find a good organic placement (same logic as positionCardOrganically)
            for (let attempt = 0; attempt < 50; attempt++) {
                let x, y;
                
                if (attempt < 10) {
                    // First 10 attempts: try center-biased positions
                    const centerBias = 0.3;
                    x = (viewportWidth / 2) + (Math.random() - 0.5) * viewportWidth * centerBias;
                    y = (viewportHeight / 2) + (Math.random() - 0.5) * viewportHeight * centerBias;
                } else {
                    // Remaining attempts: full random
                    x = Math.random() * (maxX - minX) + minX;
                    y = Math.random() * (maxY - minY) + minY;
                }
                
                // Simple collision detection
                let hasCollision = false;
                for (const used of usedPositions) {
                    const distance = Math.sqrt((x - used.x) ** 2 + (y - used.y) ** 2);
                    if (distance < 120) { // Minimum distance between cards
                        hasCollision = true;
                        break;
                    }
                }
                
                if (!hasCollision) {
                    const score = Math.random(); // Random score for variety
                    if (score > bestScore) {
                        bestScore = score;
                        bestPosition = { x, y };
                    }
                }
            }
            
            // If no good position found, use a random one
            if (!bestPosition) {
                bestPosition = {
                    x: Math.random() * (maxX - minX) + minX,
                    y: Math.random() * (maxY - minY) + minY
                };
            }
            
            organicPositions.push({ index: i, x: bestPosition.x, y: bestPosition.y });
            usedPositions.push(bestPosition);
        }
        
        // Sort positions by X coordinate (left to right)
        organicPositions.sort((a, b) => a.x - b.x);
        
        // Store the sorted positions globally
        window.sortedOrganicPositions = organicPositions;
        
        // Create mapping: first project (alphabetically) gets leftmost position, etc.
        window.positionMapping = Array.from({length: projectsWithMedia.length}, (_, i) => i);
        
        // Store the sorted projects globally for the rendering function
        window.sortedProjectsWithMedia = projectsWithMedia;
        
        const allProjectIds = projectsWithMedia.map(p => p.id);
        
        console.log('Projects with media:', projectsWithMedia.length);
        console.log('All project IDs:', allProjectIds);
        console.log('First 5 projects alphabetically:', projectsWithMedia.slice(0, 5).map(p => p.title));
        console.log('First 5 positions (X sorted):', window.sortedOrganicPositions.slice(0, 5).map(p => ({ x: p.x, y: p.y })));
        console.log('Position mapping:', window.positionMapping.slice(0, 5));
        
        // Render all projects with media in the first section
        console.log('About to render with project IDs:', allProjectIds.slice(0, 5));
        renderNeuralNetworkSection('list-1', allProjectIds);
        
        // Initialize background image hover effect
        initBackgroundImageHover();
        
// Initialize lazy loading for thumbnails
initLazyThumbnailLoading();
        
        // Hide loading state - REMOVED: was clearing the actual content!
        // if (projectGrid) {
        //     projectGrid.innerHTML = '';
        // }
        
        console.log('Neural network initialization complete');
    });
    
    // Debug: Check if titles are in DOM
    setTimeout(() => {
        const titles = document.querySelectorAll('.block-title');
        console.log(`Found ${titles.length} titles in DOM`);
        titles.forEach((title, index) => {
            console.log(`Title ${index}: "${title.textContent}"`);
            console.log(`  Computed styles:`, window.getComputedStyle(title));
            console.log(`  Position:`, title.getBoundingClientRect());
        });
    }, 100);
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (isNeuralNetworkStyle) {
            resetPositionedCards();
            const allBlocks = document.querySelectorAll('.project-block');
            allBlocks.forEach((block, index) => {
                const sizeClass = block.getAttribute('data-size');
                if (sizeClass) {
                    // Use shuffled position mapping for random layout to maintain alphabetical order
                    const positionIndex = (currentShape === 'random' && window.positionMapping) ? window.positionMapping[index] : index;
                    positionCardCircularly(block, sizeClass, positionIndex, allBlocks.length);
                }
            });
            // Update container height for masonry layout
            updateMasonryContainerHeight();
            // Recreate connection lines
            setTimeout(() => {
                createConnectionLines();
            }, 200);
        }
    }, 100);
});


// Generate 3 layered dot patterns for parallax effect
function generateConcentricSquares() {
    const container = document.querySelector('.concentric-squares');
    if (!container) return;
    
    // Clear existing layers
    container.innerHTML = '';
    
    // Create 3 dot layers with different sizes and opacities
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'dot-layer';
        container.appendChild(layer);
    }
}

// Parallax effect for layered dot patterns
function initParallaxEffect() {
    const dotLayers = document.querySelectorAll('.dot-layer');
    
    if (!dotLayers.length) return;
    
    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let lastUpdate = 0;
    let isActive = false;
    const throttleMs = 8; // ~120fps for smoother animation
    
    // Different speeds for each layer (more subtle differences)
    const layerSpeeds = [0.3, 0.6, 0.9]; // Very slow, slow, medium
    
    function updateParallax(timestamp) {
        if (!isActive) {
            animationId = null;
            return;
        }
        
        if (timestamp - lastUpdate < throttleMs) {
            animationId = requestAnimationFrame(updateParallax);
            return;
        }
        lastUpdate = timestamp;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate normalized mouse position (-1 to 1)
        const normalizedX = (mouseX / windowWidth) * 2 - 1;
        const normalizedY = (mouseY / windowHeight) * 2 - 1;
        
        // Update each dot layer with different speeds - much more subtle
        dotLayers.forEach((layer, index) => {
            const speed = layerSpeeds[index];
            const offsetX = normalizedX * speed * 8; // Much smaller movement range
            const offsetY = normalizedY * speed * 8;
            
            layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
        });
        
        // No parallax for page content - only background dots move
        
        animationId = requestAnimationFrame(updateParallax);
    }
    
    // Mouse move handler with lazy activation
    let mouseThrottle = false;
    document.addEventListener('mousemove', function(e) {
        if (!isActive) {
            isActive = true;
        }
        
        if (mouseThrottle) return;
        mouseThrottle = true;
        
        requestAnimationFrame(() => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            mouseThrottle = false;
        });
        
        if (!animationId && isActive) {
            animationId = requestAnimationFrame(updateParallax);
        }
    });
    
    // Stop animation when mouse leaves
    document.addEventListener('mouseleave', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });
}

// Refresh parallax effect when cards are repositioned
function refreshParallaxEffect() {
    // Re-initialize parallax effect for dot layers
    setTimeout(initParallaxEffect, 100);
}

// Create mobile neural network connections overlay
function createMobileNeuralOverlay() {
    if (window.innerWidth > 768) return; // Only for mobile
    
    console.log('🧠 Creating mobile neural network overlay...');
    
    // Remove existing mobile neural overlay
    const existingOverlay = document.querySelector('.mobile-neural-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-neural-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 15;
        overflow: hidden;
    `;
    
    // Create SVG for connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    `;
    
    // Add gradient definition to SVG
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'mobileNeuralGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    // Create gradient stops to match desktop connection paths
    const stops = [
        { offset: '0%', color: 'rgba(255,255,255,0.8)' },
        { offset: '25%', color: 'rgba(255,255,255,0.4)' },
        { offset: '50%', color: 'rgba(255,255,255,0.1)' },
        { offset: '75%', color: 'rgba(255,255,255,0.4)' },
        { offset: '100%', color: 'rgba(255,255,255,0.8)' }
    ];
    
    stops.forEach(stop => {
        const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stopElement.setAttribute('offset', stop.offset);
        stopElement.setAttribute('stop-color', stop.color);
        gradient.appendChild(stopElement);
    });
    
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    overlay.appendChild(svg);
    document.body.appendChild(overlay);
    
    // Generate mobile neural connections
    generateMobileNeuralConnections(svg);
    
    console.log('🧠 Mobile neural network overlay created with', svg.children.length, 'connections');
    
    // Add parallax scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const parallaxSpeed = 0.3;
        overlay.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
    });
}

// Animate connection text labels on scroll (mobile only)
function animateConnectionTextOnScroll() {
    if (window.innerWidth > 768) return;
    
    const textLabels = document.querySelectorAll('.mobile-connections-svg text');
    if (textLabels.length === 0) return;
    
    // Get scroll progress (0 to 1)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollTop / docHeight, 1);
    
    // Update each text position based on scroll
    textLabels.forEach(text => {
        const initialX = parseFloat(text.dataset.initialX);
        const initialY = parseFloat(text.dataset.initialY);
        const offsetX = parseFloat(text.dataset.offsetX);
        const offsetY = parseFloat(text.dataset.offsetY);
        
        // Move from initial position to initial + offset as we scroll
        const newX = initialX + (offsetX * scrollProgress);
        const newY = initialY + (offsetY * scrollProgress);
        
        text.setAttribute('x', newX);
        text.setAttribute('y', newY);
        
        // Also add scale and opacity effects for more drama
        const scale = 1 + (scrollProgress * 0.5); // Grow 50% larger
        const opacity = 0.7 + (scrollProgress * 0.3); // Get more visible
        text.setAttribute('transform', `scale(${scale})`);
        text.setAttribute('opacity', opacity);
    });
}

// Animate card positions on scroll - reduce offset when near viewport center
function animateCardPositionsOnScroll() {
    if (window.innerWidth > 768) return;
    
    const cards = document.querySelectorAll('.project-block');
    if (cards.length === 0) return;
    
    const viewportCenter = window.innerHeight / 2;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportWidth = window.innerWidth;
    const margin = 25;
    
    let debugCount = 0;
    
    cards.forEach((card, index) => {
        const offsetX = parseFloat(card.dataset.initialX); // The original offset position
        const finalY = parseFloat(card.dataset.finalY); // Card's Y position in document
        const cardWidth = parseFloat(card.dataset.cardWidth);
        const cardHeight = parseFloat(card.style.height) || 112.5;
        
        // Validate data
        if (isNaN(offsetX) || isNaN(finalY) || isNaN(cardWidth)) {
            if (index < 3) console.warn(`⚠️ Card ${index}: Missing data - offsetX=${offsetX}, finalY=${finalY}, cardWidth=${cardWidth}`);
            return;
        }
        
        // Get card's position relative to viewport center
        const cardTopInViewport = finalY - scrollTop;
        const cardCenterInViewport = cardTopInViewport + (cardHeight / 2);
        
        // Distance from viewport center (0 = at center, 1+ = at/beyond edge)
        const distanceFromCenter = Math.abs(cardCenterInViewport - viewportCenter) / viewportCenter;
        const centerProximity = Math.max(0, Math.min(1, 1 - distanceFromCenter)); // Clamp 0-1: 1 = at center, 0 = far away
        
        // Calculate centered position
        const centeredX = (viewportWidth - cardWidth) / 2;
        
        // Interpolate between offset position and centered position based on proximity
        // When far: use offsetX, When at center: use centeredX
        const newX = offsetX + (centeredX - offsetX) * centerProximity;
        
        card.style.left = `${newX}px`;
        
        // Debug cards in viewport
        if (cardTopInViewport > -cardHeight && cardTopInViewport < window.innerHeight && debugCount < 3) {
            console.log(`📍 Card ${index}: scrollTop=${scrollTop.toFixed(0)}, cardY=${finalY}, viewportY=${cardTopInViewport.toFixed(0)}, proximity=${centerProximity.toFixed(2)}, offsetX=${offsetX.toFixed(0)}, newX=${newX.toFixed(0)}`);
            debugCount++;
        }
    });
}

// Add scroll listener for mobile animations
if (window.innerWidth <= 768) {
    window.addEventListener('scroll', () => {
        animateConnectionTextOnScroll();
        animateCardPositionsOnScroll();
    }, { passive: true });
    // Also run on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            animateConnectionTextOnScroll();
            animateCardPositionsOnScroll();
        }
    });
    // Run initial animation
    animateCardPositionsOnScroll();
}

// Generate mobile neural network connections
function generateMobileNeuralConnections(svg) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    console.log('🔴 DEBUG: Viewport dimensions:', { viewportWidth, viewportHeight });
    console.log('🔴 DEBUG: SVG element:', svg);
    
    // Create connection points (nodes)
    const nodes = [];
    const nodeCount = 8; // Even fewer nodes for cleaner look
    
    for (let i = 0; i < nodeCount; i++) {
        const node = {
            x: Math.random() * viewportWidth,
            y: Math.random() * viewportHeight * 2, // Extend beyond viewport for scroll effect
            id: i
        };
        nodes.push(node);
    }
    
    console.log('🔴 DEBUG: Created nodes:', nodes);
    
    // Create connections between nearby nodes
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.sqrt(
                Math.pow(nodes[i].x - nodes[j].x, 2) + 
                Math.pow(nodes[i].y - nodes[j].y, 2)
            );
            
            // Connect nodes that are reasonably close - more selective for cleaner look
            if (distance < Math.min(viewportWidth, viewportHeight) * 0.4) {
                connections.push({
                    from: nodes[i],
                    to: nodes[j],
                    distance: distance
                });
            }
        }
    }
    
    console.log('🔴 DEBUG: Created connections:', connections.length);
    console.log('🔴 DEBUG: Connection threshold:', Math.min(viewportWidth, viewportHeight) * 0.6);
    
    // Remove the ugly test line - no longer needed
    console.log('✅ Clean mobile neural network created');
    
    // Draw connections
    connections.forEach((connection, index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Create smooth rounded path like desktop version
        const startX = connection.from.x;
        const startY = connection.from.y;
        const endX = connection.to.x;
        const endY = connection.to.y;
        
        // Calculate smooth rounded path with multiple control points
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Create smooth rounded angles with multiple curves
        const controlOffset = distance * 0.3; // Larger offset for smoother curves
        const angle = Math.atan2(dy, dx);
        
        // Add some organic variation but keep it smooth
        const variation = (Math.random() - 0.5) * 0.2;
        const controlAngle1 = angle + variation;
        const controlAngle2 = angle - variation;
        
        const control1X = startX + Math.cos(controlAngle1) * controlOffset;
        const control1Y = startY + Math.sin(controlAngle1) * controlOffset;
        const control2X = endX - Math.cos(controlAngle2) * controlOffset;
        const control2Y = endY - Math.sin(controlAngle2) * controlOffset;
        
        // Use cubic Bézier curve for smooth rounded angles
        const pathData = `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
        line.setAttribute('d', pathData);
        
        // Style the connection to match desktop - white gradient with subtle glow
        const opacity = Math.max(0.5, 0.8 - (connection.distance / (viewportWidth * 0.6)) * 0.2);
        line.style.cssText = `
            stroke: url(#mobileNeuralGradient);
            stroke-width: 1.5;
            fill: none;
            stroke-opacity: ${opacity};
            filter: drop-shadow(0 0 8px rgba(255,255,255,0.4));
            animation: mobileNeuralPulse 4s ease-in-out infinite;
            animation-delay: ${index * 0.1}s;
        `;
        
        console.log(`🔴 DEBUG: Created connection ${index}:`, {
            from: { x: connection.from.x, y: connection.from.y },
            to: { x: connection.to.x, y: connection.to.y },
            distance: connection.distance,
            pathData: pathData
        });
        
        svg.appendChild(line);
    });
    
    // Add pulsing animation
    if (!document.querySelector('#mobile-neural-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-neural-styles';
        style.textContent = `
            @keyframes mobileNeuralPulse {
                0%, 100% { 
                    stroke-opacity: 0.4; 
                    filter: drop-shadow(0 0 6px rgba(255,255,255,0.3));
                }
                50% { 
                    stroke-opacity: 0.7; 
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
                }
            }
        `;
        document.head.appendChild(style);
    }
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Clear project cache to ensure fresh content
    if (window.clearProjectCache) {
        window.clearProjectCache();
    }
    generateConcentricSquares();
    initializeNeuralNetwork();
    initParallaxEffect();
    
    // Create mobile neural overlay
    createMobileNeuralOverlay();
    
    // Initialize mobile navigation
    initializeMobileNavigation();
    
    // Add keyboard controls for shape cycling
    addShapeKeyboardListener();
    
    // Add shape info to console
    console.log('🎨 Shape Bank Available:');
    Object.keys(SHAPE_BANK).forEach(shapeKey => {
        console.log(`- ${shapeKey}: ${SHAPE_BANK[shapeKey].name}`);
    });
    console.log('⌨️ Press "S" to cycle through shapes');
    console.log('🎲 Default: Random (Alphabetical) layout');
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Clear project cache to ensure fresh content
        if (window.clearProjectCache) {
            window.clearProjectCache();
        }
        generateConcentricSquares();
        initializeNeuralNetwork();
        initParallaxEffect();
        
        // Create mobile neural overlay
        createMobileNeuralOverlay();
        
        // Initialize mobile navigation
        initializeMobileNavigation();
    });
} else {
    generateConcentricSquares();
    // Don't initialize immediately - let the HTML script handle it
    // initializeNeuralNetwork();
    initParallaxEffect();
    
    // Create mobile neural overlay
    createMobileNeuralOverlay();
    
    // Initialize mobile navigation
    initializeMobileNavigation();
    
    // Add keyboard controls for shape cycling
    addShapeKeyboardListener();
    
    // Add shape info to console
    console.log('🎨 Shape Bank Available:');
    Object.keys(SHAPE_BANK).forEach(shapeKey => {
        console.log(`- ${shapeKey}: ${SHAPE_BANK[shapeKey].name}`);
    });
    console.log('⌨️ Press "S" to cycle through shapes');
    console.log('🎲 Default: Random (Alphabetical) layout');
}

// Regenerate squares on window resize
window.addEventListener('resize', function() {
    generateConcentricSquares();
    setTimeout(() => {
        initParallaxEffect();
    }, 100);
});

// Image fullscreen functionality
function openImageFullscreen(imageUrl) {
    // Create fullscreen overlay if it doesn't exist
    let overlay = document.getElementById('image-fullscreen-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'image-fullscreen-overlay';
        overlay.className = 'image-fullscreen-overlay';
        overlay.innerHTML = `
            <img src="${imageUrl}" alt="Fullscreen image">
            <button class="close-btn" onclick="closeImageFullscreen()">&times;</button>
        `;
        document.body.appendChild(overlay);
    } else {
        // Update the image source
        const img = overlay.querySelector('img');
        img.src = imageUrl;
    }
    
    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeImageFullscreen();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Close on background click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeImageFullscreen();
        }
    };
}

function closeImageFullscreen() {
    const overlay = document.getElementById('image-fullscreen-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make functions globally available for project pages
window.generateConcentricSquares = generateConcentricSquares;
window.initParallaxEffect = initParallaxEffect;
window.initializeNeuralNetwork = initializeNeuralNetwork;
window.openImageFullscreen = openImageFullscreen;
window.closeImageFullscreen = closeImageFullscreen;
