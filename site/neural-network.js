// Neural Network Portfolio Implementation
const projects = window.projects || [];

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
    // All cards same size now - smaller to allow more spreading
    return {
        width: 100,
        height: 40
    };
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
    const media = window.mediaIndex || {};
    const project = media.projects?.[projectId];
    
    if (!project) {
        return null;
    }
    
    const imageFiles = project.files.filter(f => f.type === 'image');
    if (imageFiles.length === 0) {
        return null;
    }
    
    const originalPath = imageFiles[0].path;
    
    // Try to use thumbnail version first (smaller file)
    // Preserve original extension for GIFs, convert others to JPG
    let thumbnailPath;
    if (originalPath.toLowerCase().endsWith('.gif')) {
        thumbnailPath = originalPath; // Keep GIF as GIF
    } else {
        thumbnailPath = originalPath.replace(/\.(jpg|jpeg|png|webp)$/i, '.jpg');
    }
    
    // Use the optimized thumbnail path
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
            // Random positioning with some structure
            const viewportWidth = window.innerWidth;
            const viewportHeight = Math.max(window.innerHeight, 1000);
            
            // Create a more structured random layout
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
    
    keyboardListenerAdded = true;
    console.log('⌨️ Shape cycling keyboard listener added');
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
    const dimensions = getCardDimensions(sizeClass);
    const viewportWidth = window.innerWidth;
    const viewportHeight = Math.max(window.innerHeight, 1000);
    
    let position;
    
    if (currentShape === 'random') {
        // Use organic positioning for random layout
        position = positionCardOrganically(index, totalCards);
    } else {
        // Use geometric shapes for other layouts
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        
        // Adjust radius based on viewport size and number of cards (doubled for larger shapes)
        const baseRadius = Math.min(viewportWidth, viewportHeight) * 0.5; // Doubled from 0.25 to 0.5
        const radius = Math.max(baseRadius, 400); // Doubled minimum radius from 200 to 400
        
        // Get shape-based position
        position = calculateShapePosition(index, totalCards, centerX, centerY, radius);
    }
    
    // Center the card on the calculated position
    const x = position.x - dimensions.width / 2;
    const y = position.y - dimensions.height / 2;
    
    // Ensure cards don't go off-screen
    const maxX = viewportWidth - dimensions.width - 20;
    const maxY = viewportHeight - dimensions.height - 20;
    
    const finalX = Math.min(Math.max(x, 20), maxX);
    const finalY = Math.min(Math.max(y, 20), maxY);
    
    card.style.left = finalX + 'px';
    card.style.top = finalY + 'px';
    card.style.width = dimensions.width + 'px';
    card.style.height = dimensions.height + 'px';
    
    // Store positioned card info for collision detection (for random layout)
    if (currentShape === 'random') {
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
    const viewportCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
    
    // Clear existing lines
    document.querySelectorAll('.connection-line').forEach(line => line.remove());
    
    // Wait to ensure all cards are positioned with the new algorithm
    setTimeout(() => {
        projectCards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = {
                x: cardRect.left + cardRect.width / 2,
                y: cardRect.top + cardRect.height / 2
            };
            
            
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
                
                const targetRect = targetCard.getBoundingClientRect();
                const targetCenter = {
                    x: targetRect.left + targetRect.width / 2,
                    y: targetRect.top + targetRect.height / 2
                };
                createCurvedLine(cardCenter, targetCenter, 'card');
            }
        });
    }, 150); // Delay to ensure positioning is complete
}

function createCurvedLine(start, end, type) {
    const line = document.createElement('div');
    line.className = 'connection-line';
    
    
    // Calculate direction and determine curve type
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const curveRadius = Math.min(Math.abs(deltaX), Math.abs(deltaY)) * 0.25;
    
    // Calculate perpendicular offset for parallel lines
    const lineSpacing = 12; // Increased spacing between parallel lines
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
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
function preloadProjectContent() {
    console.log('Preloading project content...');
    const projectsToCache = window.projects || projects || [];
    const mediaIndex = window.mediaIndex || {};
    
    console.log('Media index available:', !!mediaIndex);
    console.log('Media index projects:', Object.keys(mediaIndex.projects || {}));
    
    projectsToCache.forEach(project => {
        if (projectCache.has(project.id)) return; // Already cached
        
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
    
    // Create description HTML
    let descHtml;
    if (project.fullDescription) {
        const formattedDesc = mainDescription
            .replace(/\\n/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        let html = '';
        let currentSection = '';
        
        formattedDesc.forEach(line => {
            // Check for section headers (with ** markdown formatting)
            if (line.startsWith('**') && line.endsWith('**')) {
                // Section header - remove ** markers
                if (currentSection) html += '</ul>';
                const sectionTitle = line.substring(2, line.length - 2);
                
                // Add data attribute for styling
                let dataSection = '';
                if (sectionTitle.includes('Technical details')) dataSection = 'technical';
                else if (sectionTitle.includes('Challenges')) dataSection = 'challenges';
                else if (sectionTitle.includes('Impact')) dataSection = 'impact';
                else if (sectionTitle.includes('Process')) dataSection = 'process';
                
                html += `<h3 data-section="${dataSection}">${sectionTitle}</h3><ul>`;
                currentSection = sectionTitle;
            } else if (line === 'Technical details and implementation' || 
                       line === 'Challenges and solutions' || 
                       line === 'Impact and results' || 
                       line === 'Process and methodology') {
                // Section header - plain text format
                if (currentSection) html += '</ul>';
                const sectionTitle = line;
                
                // Add data attribute for styling
                let dataSection = '';
                if (sectionTitle.includes('Technical details')) dataSection = 'technical';
                else if (sectionTitle.includes('Challenges')) dataSection = 'challenges';
                else if (sectionTitle.includes('Impact')) dataSection = 'impact';
                else if (sectionTitle.includes('Process')) dataSection = 'process';
                
                html += `<h3 data-section="${dataSection}">${sectionTitle}</h3><ul>`;
                currentSection = sectionTitle;
            } else if (line.startsWith('•') || line.startsWith('-')) {
                // Bullet point
                const bulletText = line.slice(1).trim();
                html += `<li>${bulletText}</li>`;
            } else if (line.length > 0) {
                // Regular paragraph
                if (currentSection) {
                    html += '</ul>';
                    currentSection = '';
                }
                html += `<p>${line}</p>`;
            }
        });
        
        if (currentSection) html += '</ul>';
        descHtml = html;
    } else {
        descHtml = `<p>${mainDescription}</p>`;
    }
    
    // Get media - take first 3 images from media folder
    const extraMedia = (extra[project.id] || {}).files || [];
    
    // Only use local media files, ignore external links
    const localMedia = extraMedia.map(file => 
        typeof file === 'object' ? `media/${file.path}` : file
    ).filter(url => {
        // Only include local media files, no external URLs
        return !url.startsWith('http') && !url.startsWith('https') && !url.startsWith('www.');
    });
    
    const firstThreeMedia = localMedia.slice(0, 3);
    
    console.log('Media for', project.id, ':', firstThreeMedia);
    
    // Create content with images integrated
    let contentBlocks = [];
    
    // Split description into sections for better image placement
    const descSections = descHtml.split('</ul>').filter(section => section.trim());
    
    // First block: text + first image
    if (firstThreeMedia.length > 0) {
        contentBlocks.push(`
            <div class="content-block text-with-image">
                <div class="text-section">
                    ${descSections[0] || descHtml}
                </div>
                <div class="image-section">
                    ${renderMedia(firstThreeMedia[0], project.title)}
                </div>
            </div>
        `);
    } else {
        // No images, just text
        contentBlocks.push(`
            <div class="content-block text-only">
                <div class="text-section">
                    ${descHtml}
                </div>
            </div>
        `);
    }
    
    // Second block: second image + remaining text
    if (firstThreeMedia.length > 1 && descSections.length > 1) {
        contentBlocks.push(`
            <div class="content-block image-with-text">
                <div class="image-section">
                    ${renderMedia(firstThreeMedia[1], project.title)}
                </div>
                <div class="text-section">
                    ${descSections[1]}
                </div>
            </div>
        `);
    }
    
    // Third block: full width image
    if (firstThreeMedia.length > 2) {
        contentBlocks.push(`
            <div class="content-block full-width-image">
                <div class="image-section">
                    ${renderMedia(firstThreeMedia[2], project.title)}
                </div>
            </div>
        `);
    }
    
    
    const medias = contentBlocks.join('');
    
    // Get Instagram links
    const insta = (project.instagram || []).map(u => `<a target="_blank" rel="noopener" href="${u}">Instagram</a>`).join(" · ");
    
    return `
        <article class="project-article">
            <header class="project-header">
                <h1>${formatTitleWithItalics(project.title)}</h1>
                <p class="meta">${[project.year, project.client, project.role].filter(Boolean).join(" · ")}</p>
                <p class="tech">${project.technologies || ""}</p>
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

// Render neural network section
function renderNeuralNetworkSection(sectionId, projectIds) {
    const list = document.getElementById(sectionId);
    const projectsToUse = window.projects || projects || [];
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
        console.log(`Project ${index + 1} classes: ${className}`);
        return `<article class="${className}" data-project-title="${p.title}" data-project-id="${p.id}">
            <a href="project.html?id=${p.id}" class="project-link">
                <div class="block-surface">
                    <div class="block-title">${shortTitle}</div>
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
            // Temporarily disable connection lines
            // createConnectionLines();
            
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
        // Mobile: Handle click events for card expansion
        document.addEventListener('click', function(e) {
            const projectBlock = e.target.closest('.project-block');
            if (projectBlock) {
                e.preventDefault(); // Prevent default link behavior
                
                // Toggle expansion
                if (projectBlock.classList.contains('mobile-expanded')) {
                    // Close expanded card
                    projectBlock.classList.remove('mobile-expanded');
                    mobileOverlay.classList.remove('active');
                } else {
                    // Close any other expanded cards first
                    document.querySelectorAll('.project-block.mobile-expanded').forEach(card => {
                        card.classList.remove('mobile-expanded');
                    });
                    mobileOverlay.classList.remove('active');
                    
                    // Expand this card
                    setTimeout(() => {
                        projectBlock.classList.add('mobile-expanded');
                        mobileOverlay.classList.add('active');
                    }, 50);
                }
            } else {
                // Click outside - close any expanded cards
                document.querySelectorAll('.project-block.mobile-expanded').forEach(card => {
                    card.classList.remove('mobile-expanded');
                });
                mobileOverlay.classList.remove('active');
            }
        });
        
        // Close expanded cards when clicking overlay
        mobileOverlay.addEventListener('click', function() {
            document.querySelectorAll('.project-block.mobile-expanded').forEach(card => {
                card.classList.remove('mobile-expanded');
            });
            mobileOverlay.classList.remove('active');
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
                        img.style.width = '100px';
                        img.style.height = '40px';
                        img.style.objectFit = 'cover';
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
                img.style.width = '100px';
                img.style.height = '40px';
                img.style.objectFit = 'cover';
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
    if (isInitialized) {
        console.log('Neural network already initialized, skipping...');
        return;
    }
    
    console.log('=== NEURAL NETWORK INITIALIZATION START ===');
    const projectsToUse = window.projects || projects || [];
    console.log('Initializing neural network with projects:', projectsToUse.length);
    
    isInitialized = true;
    
    // Preload all project content for instant navigation
    preloadProjectContent();
    
    if (!projectsToUse.length) {
        document.querySelectorAll('.project-grid').forEach(grid => {
            grid.innerHTML = '<p style="padding:16px;color:#9aa">Aucun projet chargé. Vérifiez data.js.</p>';
        });
        return;
    }
    
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
        
        // Create shuffled position mapping for random layout
        // This keeps projects in alphabetical order but assigns them to random positions
        window.positionMapping = Array.from({length: projectsWithMedia.length}, (_, i) => i);
        if (currentShape === 'random') {
            // Shuffle the position indices to create random positioning
            for (let i = window.positionMapping.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [window.positionMapping[i], window.positionMapping[j]] = [window.positionMapping[j], window.positionMapping[i]];
            }
        }
        
        const allProjectIds = projectsWithMedia.map(p => p.id);
        
        console.log('Projects with media:', projectsWithMedia.length);
        console.log('All project IDs:', allProjectIds);
        
        // Render all projects with media in the first section
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


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    generateConcentricSquares();
    initializeNeuralNetwork();
    initParallaxEffect();
    
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
        generateConcentricSquares();
        initializeNeuralNetwork();
        initParallaxEffect();
    });
} else {
    generateConcentricSquares();
    // Don't initialize immediately - let the HTML script handle it
    // initializeNeuralNetwork();
    initParallaxEffect();
    
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

// Make functions globally available for project pages
window.generateConcentricSquares = generateConcentricSquares;
window.initParallaxEffect = initParallaxEffect;
