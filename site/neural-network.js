// Neural Network Portfolio Implementation

function getSidebarWidth() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar || window.innerWidth <= 768) return 0;
    return sidebar.offsetWidth + 16;
}

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
    
    // Convert high-res paths to thumbnail paths (all thumbnails are .jpg)
    const thumbnailPath = originalPath
        .replace('high-res/', 'thumbnails/')
        .replace(/\.(png|webp|gif|tiff?)$/i, '.jpg');
    
    return `media/${thumbnailPath}`;
}

function getAllThumbnails(projectId) {
    const media = window.projectMedia || window.mediaIndex || {};
    const project = media.projects?.[projectId];
    if (!project) return [];
    const seen = new Set();
    return project.files
        .filter(f => f.type === 'image')
        .map(f => {
            const thumbPath = 'media/' + f.path
                .replace('high-res/', 'thumbnails/')
                .replace(/\.(png|webp|gif|tiff?)$/i, '.jpg');
            return thumbPath;
        })
        .filter(p => {
            if (seen.has(p)) return false;
            seen.add(p);
            return true;
        });
}

// ── Tag-Based Clustering Engine ──────────────────────────────────────────────
// Extracts real tags from project data and positions via tag-overlap similarity.
// No manual scoring -- relationships come from actual shared attributes.

const TAG_ALIASES = {
    'touchdesigner': 'TouchDesigner',
    'td': 'TouchDesigner',
    'projection': 'Projection',
    'projection mapping': 'Projection',
    'led': 'LED',
    'audio': 'Audio',
    'spatial audio': 'Audio',
    'sound': 'Audio',
    'camera tracking': 'Tracking',
    'camera': 'Tracking',
    'ir sensors': 'Sensors',
    'ir sensor': 'Sensors',
    'sensor': 'Sensors',
    'sensors': 'Sensors',
    'depth sensor': 'Sensors',
    'thermal cameras': 'Thermal',
    'thermal camera': 'Thermal',
    'thermal': 'Thermal',
    'gpu': 'GPU',
    'gpu particle systems': 'GPU',
    'intercom systems': 'Intercom',
    'intercom': 'Intercom',
    'kinect': 'Sensors',
    'lidar': 'Sensors',
    'multiple sensing systems': 'Sensors',
    'video': 'Video',
    'vr': 'VR',
    'ar': 'AR',
    'ai': 'AI',
    'machine learning': 'AI',
};

function extractProjectTags(project) {
    const tags = new Set();

    const techStr = project.technologies || '';
    techStr.split(',').forEach(t => {
        const raw = t.trim().toLowerCase();
        if (!raw) return;
        const alias = TAG_ALIASES[raw];
        if (alias) {
            tags.add(alias);
        } else {
            tags.add(t.trim());
        }
    });

    const client = (project.client || '').toLowerCase();
    if (client.includes('lozano-hemmer')) tags.add('Lozano-Hemmer');
    else if (client.includes('moment factory')) tags.add('Moment Factory');
    else if (client.includes('cirque')) tags.add('Cirque du Soleil');
    else if (client.includes('billie eilish') || client.includes('arcade fire') || client.includes('red hot') || client.includes('panasonic')) {
        const name = project.client.split('/')[0].trim();
        tags.add(name);
    }

    const desc = (project.description || '').toLowerCase();
    if (desc.includes('interactive') || desc.includes('interaction')) tags.add('Interactive');
    if (desc.includes('installation')) tags.add('Installation');
    if (desc.includes('concert') || desc.includes('tour') || desc.includes('stage') || desc.includes('arena')) tags.add('Live Show');
    if (desc.includes('museum') || desc.includes('gallery') || desc.includes('exhibition')) tags.add('Exhibition');

    return [...tags];
}

function computeTagSimilarity(tagsA, tagsB) {
    const setA = new Set(tagsA.map(t => t.toLowerCase()));
    const setB = new Set(tagsB.map(t => t.toLowerCase()));
    let intersection = 0;
    for (const t of setA) { if (setB.has(t)) intersection++; }
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
}

function computeAllTags(projectsArray) {
    for (const p of projectsArray) {
        p._tags = extractProjectTags(p);
    }
}

function computeTagPositions(projectsArray) {
    const n = projectsArray.length;
    if (n === 0) return;

    const seeded = (s) => { let v = s; return () => { v = (v * 16807) % 2147483647; return v / 2147483647; }; };
    const rand = seeded(42);

    for (const p of projectsArray) {
        p._scores = { x: 0.08 + rand() * 0.84, y: 0.08 + rand() * 0.84 };
    }

    const iterations = 200;
    const repulsion = 0.06;
    const attraction = 0.02;
    const damping = 0.88;

    const vx = new Float64Array(n);
    const vy = new Float64Array(n);

    for (let iter = 0; iter < iterations; iter++) {
        const t = 1 - iter / iterations;

        for (let i = 0; i < n; i++) {
            const pi = projectsArray[i];
            for (let j = i + 1; j < n; j++) {
                const pj = projectsArray[j];
                let dx = pi._scores.x - pj._scores.x;
                let dy = pi._scores.y - pj._scores.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.02) { dx = (rand() - 0.5) * 0.04; dy = (rand() - 0.5) * 0.04; dist = 0.04; }

                const repulse = repulsion / (dist * dist) * t;
                const nx = dx / dist;
                const ny = dy / dist;
                vx[i] += nx * repulse;
                vy[i] += ny * repulse;
                vx[j] -= nx * repulse;
                vy[j] -= ny * repulse;

                const sim = computeTagSimilarity(pi._tags, pj._tags);
                if (sim > 0.15) {
                    const attract = attraction * sim * dist * t;
                    vx[i] -= nx * attract;
                    vy[i] -= ny * attract;
                    vx[j] += nx * attract;
                    vy[j] += ny * attract;
                }
            }
        }

        for (let i = 0; i < n; i++) {
            vx[i] *= damping;
            vy[i] *= damping;
            projectsArray[i]._scores.x += vx[i];
            projectsArray[i]._scores.y += vy[i];
            projectsArray[i]._scores.x = Math.max(0.05, Math.min(0.95, projectsArray[i]._scores.x));
            projectsArray[i]._scores.y = Math.max(0.05, Math.min(0.95, projectsArray[i]._scores.y));
        }
    }

    normalizePositions(projectsArray);
}

function normalizePositions(projectsArray) {
    if (projectsArray.length < 2) return;
    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    for (const p of projectsArray) {
        minX = Math.min(minX, p._scores.x);
        maxX = Math.max(maxX, p._scores.x);
        minY = Math.min(minY, p._scores.y);
        maxY = Math.max(maxY, p._scores.y);
    }
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    for (const p of projectsArray) {
        p._scores.x = 0.05 + ((p._scores.x - minX) / rangeX) * 0.9;
        p._scores.y = 0.05 + ((p._scores.y - minY) / rangeY) * 0.9;
    }
}

function computeAllScores(projectsArray) {
    computeAllTags(projectsArray);
    computeTagPositions(projectsArray);
}

function tagDistance(a, b) {
    return Math.sqrt((a._scores.x - b._scores.x) ** 2 + (a._scores.y - b._scores.y) ** 2);
}

function scoreDistance(a, b) {
    return tagDistance(a, b);
}

function findNearestNeighbors(project, allProjects, k) {
    return allProjects
        .filter(p => p.id !== project.id && p._scores)
        .map(p => ({
            project: p,
            distance: tagDistance(project, p),
            sharedTags: (project._tags || []).filter(t => (p._tags || []).map(pt => pt.toLowerCase()).includes(t.toLowerCase()))
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, k);
}

// ── 10x10 Grid Layout Engine ─────────────────────────────────────────────────
// Projects placed in a 10x10 grid based on their axis scores.
// Empty cells filled with solid gray squares (different tone per row).

const GRID_SIZE = 10;

function sortBySimilarity(allProjects) {
    if (allProjects.length <= 1) return allProjects;

    const sorted = [];
    const remaining = new Set(allProjects.map((_, i) => i));

    let currentIdx = 0;
    remaining.delete(currentIdx);
    sorted.push(allProjects[currentIdx]);

    while (remaining.size > 0) {
        const current = allProjects[currentIdx];
        let bestIdx = -1;
        let bestSim = -1;

        for (const idx of remaining) {
            const sim = computeTagSimilarity(current._tags || [], allProjects[idx]._tags || []);
            if (sim > bestSim) {
                bestSim = sim;
                bestIdx = idx;
            }
        }

        remaining.delete(bestIdx);
        sorted.push(allProjects[bestIdx]);
        currentIdx = bestIdx;
    }

    return sorted;
}

function generateGridBackground(allProjects) {
    const G = 20; // Reduced from 40 — half the dots, same visual feel
    const pad = 1;
    const viewW = 200;
    const viewH = 120;
    const cellW = (viewW - pad * 2) / G;
    const cellH = (viewH - pad * 2) / G;
    const seeded = (s) => { let v = s; return () => { v = (v * 16807) % 2147483647; return v / 2147483647; }; };
    const rand = seeded(77);

    function makeSvg(className) {
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        s.setAttribute('class', className);
        s.setAttribute('preserveAspectRatio', 'none');
        s.setAttribute('viewBox', `0 0 ${viewW} ${viewH}`);
        return s;
    }

    let p1 = '';
    let p2 = '';
    let p3 = '';

    // ═══ LAYER 1: structural grid — dots only at major/mid intersections ═══
    for (let r = 0; r <= G; r++) {
        for (let c = 0; c <= G; c++) {
            const x = pad + c * cellW;
            const y = pad + r * cellH;
            const isMajor = (r % 5 === 0 && c % 5 === 0);
            const isMid = (r % 2 === 0 && c % 2 === 0);
            if (!isMajor && !isMid) continue; // Skip fine dots entirely
            const radius = isMajor ? 0.6 : 0.25;
            const opacity = isMajor ? 0.7 : 0.15;
            p1 += `<circle cx="${x}" cy="${y}" r="${radius}" fill="rgba(90,155,115,${opacity})"/>`;
        }
    }
    // Major grid lines only
    for (let i = 0; i <= G; i += 5) {
        const x = pad + i * cellW;
        const y = pad + i * cellH;
        const isMajor = i % 10 === 0;
        const op = isMajor ? 0.35 : 0.12;
        const sw = isMajor ? 0.2 : 0.12;
        p1 += `<line x1="${pad}" y1="${y}" x2="${viewW - pad}" y2="${y}" stroke="rgba(90,155,115,${op})" stroke-width="${sw}"/>`;
        p1 += `<line x1="${x}" y1="${pad}" x2="${x}" y2="${viewH - pad}" stroke="rgba(90,155,115,${op})" stroke-width="${sw}"/>`;
    }
    // Tick labels only at major marks
    for (let i = 0; i <= G; i += 5) {
        const x = pad + i * cellW;
        const label = (i / G * 10).toFixed(0);
        p1 += `<text x="${x}" y="${pad - 1.8}" text-anchor="middle" fill="rgba(90,155,115,0.5)" font-size="1.4" font-family="monospace">${label}</text>`;
    }

    // ═══ LAYER 2: radar rings, crosshairs, data text (reduced counts) ═══
    const cx = viewW / 2;
    const cy = viewH / 2;
    for (let r = 10; r <= 55; r += 10) {
        p2 += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(90,155,115,0.15)" stroke-width="0.12"/>`;
    }
    p2 += `<line x1="${pad}" y1="${cy}" x2="${viewW - pad}" y2="${cy}" stroke="rgba(90,155,115,0.2)" stroke-width="0.15" stroke-dasharray="1 2"/>`;
    p2 += `<line x1="${cx}" y1="${pad}" x2="${cx}" y2="${viewH - pad}" stroke="rgba(90,155,115,0.2)" stroke-width="0.15" stroke-dasharray="1 2"/>`;

    const dataWords = ['TAG', 'NODE', 'LINK', 'GRID', 'MAP', 'VEC', 'NET', 'SIM', 'EDGE', 'DIST'];
    for (let i = 0; i < 25; i++) { // Reduced from 60
        const x = pad + rand() * (viewW - pad * 2);
        const y = pad + rand() * (viewH - pad * 2);
        const word = dataWords[Math.floor(rand() * dataWords.length)];
        const val = (rand() * 10).toFixed(2);
        const op = 0.12 + rand() * 0.18;
        p2 += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="rgba(90,155,115,${op.toFixed(2)})" font-size="${(0.6 + rand() * 0.6).toFixed(1)}" font-family="monospace">${word}:${val}</text>`;
    }
    for (let i = 0; i < 12; i++) { // Reduced from 30
        const x = pad + rand() * (viewW - pad * 2);
        const y = pad + rand() * (viewH - pad * 2);
        const op = 0.12 + rand() * 0.18;
        const s = 0.4 + rand() * 0.6;
        p2 += `<rect x="${(x - s / 2).toFixed(1)}" y="${(y - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="none" stroke="rgba(90,155,115,${op.toFixed(2)})" stroke-width="0.08" transform="rotate(${(rand() * 45).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }

    // ═══ LAYER 3: data paths, project markers, info blocks ═══
    const scored = allProjects.filter(pr => pr._scores);

    scored.forEach((pr, idx) => {
        // Only 1 neighbor link instead of 3
        const ni = (idx + 1) % scored.length;
        if (!scored[ni]._scores || rand() > 0.55) return;
        const x1 = pad + pr._scores.x * (viewW - pad * 2);
        const y1 = pad + (1 - pr._scores.y) * (viewH - pad * 2);
        const x2 = pad + scored[ni]._scores.x * (viewW - pad * 2);
        const y2 = pad + (1 - scored[ni]._scores.y) * (viewH - pad * 2);
        const mx = (x1 + x2) / 2 + (rand() - 0.5) * 15;
        const my = (y1 + y2) / 2 + (rand() - 0.5) * 10;
        const isGreen = rand() > 0.4;
        const color = isGreen ? `rgba(90,180,120,${0.15 + rand() * 0.2})` : `rgba(140,140,140,${0.1 + rand() * 0.15})`;
        p3 += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(0.15 + rand() * 0.2).toFixed(2)}"/>`;
    });

    scored.forEach(pr => {
        const x = pad + pr._scores.x * (viewW - pad * 2);
        const y = pad + (1 - pr._scores.y) * (viewH - pad * 2);
        const r = 0.6 + rand() * 0.4;
        p3 += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="rgba(90,180,120,0.1)" stroke="rgba(90,180,120,0.45)" stroke-width="0.12"/>`;
        const ch = 1.0;
        p3 += `<line x1="${(x - ch).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + ch).toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(90,155,115,0.3)" stroke-width="0.08"/>`;
        p3 += `<line x1="${x.toFixed(1)}" y1="${(y - ch).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + ch).toFixed(1)}" stroke="rgba(90,155,115,0.3)" stroke-width="0.08"/>`;
        if (rand() > 0.5 && pr._tags && pr._tags.length > 0) {
            const label = pr._tags[0].substring(0, 8).toUpperCase();
            p3 += `<text x="${(x + 1).toFixed(1)}" y="${(y - 0.6).toFixed(1)}" fill="rgba(90,155,115,0.3)" font-size="0.8" font-family="monospace">${label}</text>`;
        }
    });

    const tagCount = new Set(scored.flatMap(p => p._tags || [])).size;
    const infoBlocks = [
        { x: pad + 1, y: pad + 2, lines: ['SYS:TAG_CLUSTER', 'NODES:' + scored.length, 'TAGS:' + tagCount, 'MODE:FORCE'] },
        { x: viewW - pad - 22, y: pad + 2, lines: ['LAYOUT:FORCE_DIRECTED', 'METRIC:JACCARD', 'ITER:120', 'DAMPING:0.92'] },
        { x: pad + 1, y: viewH - pad - 5, lines: ['LINKS:TAG_OVERLAP', 'REPULSION:0.012', 'ATTRACT:0.08', 'STATUS:ACTIVE'] },
        { x: viewW - pad - 18, y: viewH - pad - 5, lines: ['RENDER:SVG_OVERLAY', 'FRAME:' + Date.now().toString(36).toUpperCase(), 'BUILD:v3.0', 'UPTIME:00:00:00'] }
    ];
    infoBlocks.forEach(block => {
        block.lines.forEach((line, li) => {
            p3 += `<text x="${block.x}" y="${block.y + li * 1.5}" fill="rgba(90,155,115,0.3)" font-size="1.0" font-family="monospace">${line}</text>`;
        });
    });

    // Build 3 SVG layers
    const svg1 = makeSvg('grid-bg-svg grid-bg-layer-1');
    svg1.innerHTML = p1;
    const svg2 = makeSvg('grid-bg-svg grid-bg-layer-2');
    svg2.innerHTML = p2;
    const svg3 = makeSvg('grid-bg-svg grid-bg-layer-3');
    svg3.innerHTML = p3;
    return [svg1, svg2, svg3];
}

function sortForMobile(allProjects) {
    const featuredIds = new Set(['undercurrents', 'deriva-termica-beti-jai', 'red-hot-chili-peppers-getaway-tour']);
    return [...allProjects].sort((a, b) => {
        const af = featuredIds.has(a.id) ? 1 : 0;
        const bf = featuredIds.has(b.id) ? 1 : 0;
        if (bf !== af) return bf - af;
        const ya = parseInt(a.year) || 0;
        const yb = parseInt(b.year) || 0;
        if (yb !== ya) return yb - ya;
        return 0;
    });
}

function renderGridLayout(container, allProjects) {
    const oldWrapper = container.querySelector('.radar-grid-wrapper');
    if (oldWrapper) oldWrapper.remove();

    document.querySelectorAll('.grid-bg-svg').forEach(el => el.remove());
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        const bgLayers = generateGridBackground(allProjects);
        bgLayers.forEach(layer => document.body.appendChild(layer));
    }

    const sorted = isMobile ? sortForMobile(allProjects) : sortBySimilarity(allProjects);
    const featuredIds = new Set(['undercurrents', 'deriva-termica-beti-jai', 'red-hot-chili-peppers-getaway-tour']);

    const cards = Array.from(container.querySelectorAll('.project-block'));
    const cardMap = new Map();
    cards.forEach(c => cardMap.set(c.getAttribute('data-project-id'), c));

    const wrapper = document.createElement('div');
    wrapper.className = 'radar-grid-wrapper';

    if (isMobile) {
        // Mobile: simple sequential append — CSS grid handles layout
        let regularIdx = 0;
        sorted.forEach(p => {
            const card = cardMap.get(p.id);
            if (!card) return;
            card.style.cssText = 'position:relative;';
            if (featuredIds.has(p.id)) {
                card.classList.add('featured-project');
            } else {
                regularIdx++;
                // Wide card after every pair of 3 rows (every 6th regular)
                // but only if it falls on an even count so it starts a new row
                if (regularIdx > 0 && regularIdx % 8 === 0) {
                    card.classList.add('bento-wide');
                }
            }
            wrapper.appendChild(card);
        });
    } else {
        // Desktop: 10x10 grid placement with fillers
        const G = GRID_SIZE;
        const grid = Array.from({ length: G }, () => Array(G).fill(null));
        const occupied = Array.from({ length: G }, () => Array(G).fill(false));
        const remaining = sorted;
        let pi = 0;

        for (let r = 0; r < G && pi < remaining.length; r++) {
            for (let c = 0; c < G && pi < remaining.length; c++) {
                if (occupied[r][c]) continue;
                const isFeatured = featuredIds.has(remaining[pi].id);
                if (isFeatured && r + 1 < G && c + 1 < G &&
                    !occupied[r][c+1] && !occupied[r+1][c] && !occupied[r+1][c+1]) {
                    grid[r][c] = { project: remaining[pi], featured: true };
                    occupied[r][c] = true;
                    occupied[r][c+1] = true;
                    occupied[r+1][c] = true;
                    occupied[r+1][c+1] = true;
                    pi++;
                    continue;
                }
                if ((r + c) % 4 === 3 && !isFeatured) continue;
                grid[r][c] = { project: remaining[pi], featured: false };
                occupied[r][c] = true;
                pi++;
            }
        }

        while (pi < remaining.length) {
            for (let r = 0; r < G && pi < remaining.length; r++) {
                for (let c = 0; c < G && pi < remaining.length; c++) {
                    if (!occupied[r][c]) {
                        grid[r][c] = { project: remaining[pi], featured: false };
                        occupied[r][c] = true;
                        pi++;
                    }
                }
            }
        }

        for (let r = 0; r < G; r++) {
            for (let c = 0; c < G; c++) {
                const cell = grid[r][c];
                if (cell && cell.project) {
                    const card = cardMap.get(cell.project.id);
                    if (card) {
                        card.style.cssText = 'position:relative;';
                        if (cell.featured) card.classList.add('featured-project');
                        wrapper.appendChild(card);
                    } else {
                        const filler = document.createElement('div');
                        filler.className = 'grid-filler-invisible';
                        wrapper.appendChild(filler);
                    }
                } else {
                    const filler = document.createElement('div');
                    filler.className = 'grid-filler-invisible';
                    wrapper.appendChild(filler);
                }
            }
        }
    }

    container.innerHTML = '';
    container.appendChild(wrapper);

    let idx = 0;
    Array.from(wrapper.children).forEach((cell) => {
        if (cell.classList.contains('project-block')) {
            setTimeout(() => cell.classList.add('loaded'), idx * 30);
            idx++;
        }
    });

}

// ── Grid Connection Lines ────────────────────────────────────────────────────

function createScatterConnectionLines(allProjects) {
    document.querySelectorAll('.connection-lines-svg').forEach(l => l.remove());

    const cards = document.querySelectorAll('.project-block');
    if (cards.length === 0) return;

    // Single SVG for all connection lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('connection-lines-svg');
    svg.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:5;';

    const projectMap = new Map();
    allProjects.forEach(p => projectMap.set(p.id, p));
    const cardById = new Map();
    cards.forEach(c => {
        const id = c.getAttribute('data-project-id');
        if (id) cardById.set(id, c);
    });
    const drawn = new Set();

    cards.forEach(card => {
        const pid = card.getAttribute('data-project-id');
        const proj = projectMap.get(pid);
        if (!proj || !proj._scores) return;

        const neighbors = findNearestNeighbors(proj, allProjects, 1);
        neighbors.forEach(n => {
            const key = [pid, n.project.id].sort().join('::');
            if (drawn.has(key)) return;
            drawn.add(key);

            const targetCard = cardById.get(n.project.id);
            if (!targetCard) return;

            const sr = card.getBoundingClientRect();
            const er = targetCard.getBoundingClientRect();
            const start = { x: sr.left + sr.width/2, y: sr.top + sr.height/2 };
            const end = { x: er.left + er.width/2, y: er.top + er.height/2 };

            const opacity = Math.max(0.06, 0.18 - n.distance * 0.12);
            const mx = (start.x + end.x)/2, my = (start.y + end.y)/2;
            const dx = end.x - start.x, dy = end.y - start.y;

            const useGreen = Math.random() < 0.4;
            const color = useGreen
                ? `rgba(144,238,144,${opacity})`
                : `rgba(180,180,180,${opacity * 0.5})`;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('connection-line');
            path.setAttribute('data-from', pid);
            path.setAttribute('data-to', n.project.id);
            path.setAttribute('d', `M${start.x},${start.y} Q${mx + dy*0.08},${my - dx*0.08} ${end.x},${end.y}`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', color);
            path.setAttribute('stroke-width', '1');
            svg.appendChild(path);
        });
    });

    document.body.appendChild(svg);
    requestAnimationFrame(() => svg.classList.add('loaded'));
}

// ── Score Tooltip ────────────────────────────────────────────────────────────

let scoreTooltip = null;

function showScoreTooltip(card, project) {
    if (!scoreTooltip) {
        scoreTooltip = document.createElement('div');
        scoreTooltip.className = 'score-tooltip';
        document.body.appendChild(scoreTooltip);
    }

    const tags = project._tags || [];

    let html = `<div class="tooltip-title">${project.title}</div>`;
    if (project.year) {
        html += `<div class="tooltip-kw" style="margin-bottom:6px;opacity:0.5">${project.year}</div>`;
    }
    if (tags.length > 0) {
        html += `<div class="tooltip-tags">`;
        tags.forEach(tag => {
            html += `<span class="tooltip-tag">${tag}</span>`;
        });
        html += `</div>`;
    }

    scoreTooltip.innerHTML = html;
    scoreTooltip.classList.add('visible');

    const rect = card.getBoundingClientRect();
    let left = rect.right + 10;
    let top = rect.top;

    if (left + 320 > window.innerWidth) {
        left = rect.left - 330;
    }
    if (top + scoreTooltip.offsetHeight > window.innerHeight) {
        top = window.innerHeight - scoreTooltip.offsetHeight - 10;
    }

    scoreTooltip.style.left = left + 'px';
    scoreTooltip.style.top = Math.max(10, top) + 'px';
}

function hideScoreTooltip() {
    if (scoreTooltip) scoreTooltip.classList.remove('visible');
}

// ── Grid Interaction System ──────────────────────────────────────────────────

function initScatterInteractions(allProjects) {
    const cards = document.querySelectorAll('.project-block');
    const projectMap = new Map();
    allProjects.forEach(p => projectMap.set(p.id, p));
    const allCells = document.querySelectorAll('.radar-grid-wrapper > *');
    const connectionLines = document.querySelectorAll('.connection-line');

    cards.forEach(card => {
        const pid = card.getAttribute('data-project-id');
        const proj = projectMap.get(pid);
        if (!proj) return;

        card.addEventListener('mouseenter', () => {
            const myTags = new Set((proj._tags || []).map(t => t.toLowerCase()));
            const relatedIds = new Set([pid]);

            allProjects.forEach(p => {
                if (p.id === pid || !p._tags) return;
                const shared = p._tags.some(t => myTags.has(t.toLowerCase()));
                if (shared) relatedIds.add(p.id);
            });

            allCells.forEach(c => {
                const cid = c.getAttribute('data-project-id');
                if (cid && relatedIds.has(cid)) {
                    c.classList.add('scatter-highlight');
                    c.classList.remove('scatter-dimmed');
                } else if (cid) {
                    c.classList.add('scatter-dimmed');
                    c.classList.remove('scatter-highlight');
                } else {
                    c.classList.add('scatter-dimmed');
                }
            });

            showScoreTooltip(card, proj);

            connectionLines.forEach(line => {
                const from = line.getAttribute('data-from');
                const to = line.getAttribute('data-to');
                if (relatedIds.has(from) && relatedIds.has(to)) {
                    line.classList.add('line-highlight');
                } else {
                    line.classList.add('line-dimmed');
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            allCells.forEach(c => {
                c.classList.remove('scatter-highlight', 'scatter-dimmed');
            });
            hideScoreTooltip();

            connectionLines.forEach(line => {
                line.classList.remove('line-highlight', 'line-dimmed');
            });
        });
    });
}

function initAxisFilterInteractions(allProjects) {
    // No axis labels to filter by in tag-cluster mode
}

// ── End Grid Layout Engine ───────────────────────────────────────────────────

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
        
        
        // Reposition all cards with new shape
        if (isNeuralNetworkStyle) {
            resetPositionedCards();
            const allBlocks = document.querySelectorAll('.project-block');
            
            
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
                
                cycleShape();
            }
        }
    });
    
    // Desktop-only resize: reposition cards when viewport changes
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth <= 768) return;
        
        if (isNeuralNetworkStyle) {
            resetPositionedCards();
            const allBlocks = document.querySelectorAll('.project-block');
            allBlocks.forEach((block, index) => {
                const sizeClass = block.getAttribute('data-size') || getRandomSizeClass();
                const totalCards = allBlocks.length;
                positionCardCircularly(block, sizeClass, index, totalCards);
            });
        }
    }, 250));

    // Breakpoint crossing: full re-render when switching mobile <-> desktop
    if (window.matchMedia) {
        const mql = window.matchMedia('(max-width: 768px)');
        let lastMobile = mql.matches;
        mql.addEventListener('change', function(e) {
            if (e.matches !== lastMobile) {
                lastMobile = e.matches;
                isInitialized = false;
                initializeNeuralNetwork();
            }
        });
    }

    
    keyboardListenerAdded = true;
    
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

// (Mobile neural overlay resize handler removed)

// Mobile navigation functionality
// initializeMobileNavigation removed — hero header replaces hamburger nav

// Test function - can be called from browser console
function testShapes() {
    
    const shapeNames = Object.keys(SHAPE_BANK);
    
    let index = 0;
    const interval = setInterval(() => {
        if (index >= shapeNames.length) {
            clearInterval(interval);
            
            return;
        }
        
        const shapeName = shapeNames[index];
        
        changeShape(shapeName);
        index++;
    }, 2000);
}

// Quick test function for immediate shape switching
function quickTest() {
    
    const shapes = ['random', 'circle', 'cube', 'hand', 'sineWave', 'spiral', 'diamond'];
    let currentIndex = 0;
    
    const testInterval = setInterval(() => {
        if (currentIndex >= shapes.length) {
            clearInterval(testInterval);
            
            return;
        }
        
        const shape = shapes[currentIndex];
        
        changeShape(shape);
        currentIndex++;
    }, 1000);
}

// Function to return to default random layout
function resetToRandom() {
    changeShape('random');
    
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
    
    const margin = 80;
    const sidebarOffset = getSidebarWidth();
    const minX = sidebarOffset;
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
            // First 10 attempts: try center-biased positions within available space
            const centerBias = 0.3;
            const availableWidth = maxX - minX;
            const availableHeight = maxY - minY;
            const centerX = minX + availableWidth / 2;
            const centerY = minY + availableHeight / 2;
            
            x = centerX + (Math.random() - 0.5) * availableWidth * centerBias;
            y = centerY + (Math.random() - 0.5) * availableHeight * centerBias;
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

// (calculateMobileGridPosition and updateMasonryContainerHeight retired — mobile uses CSS grid now)


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
    
    if (currentShape === 'random') {
        // Use pre-sorted organic positions (sorted by X coordinate)
        if (window.sortedOrganicPositions && window.sortedOrganicPositions[index]) {
            position = { x: window.sortedOrganicPositions[index].x, y: window.sortedOrganicPositions[index].y };
            // Debug removed
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
        // Desktop: Keep cards within the area right of the sidebar
        const sw = getSidebarWidth();
        const maxX = viewportWidth - dimensions.width - 20 - sw;
        const maxY = viewportHeight - dimensions.height - 20;
        finalX = Math.min(Math.max(x, 0), Math.max(maxX, 0));
        finalY = Math.min(Math.max(y, 20), maxY);
    }

    // Apply sidebar offset for desktop
    if (window.innerWidth > 768) {
        card.style.left = (finalX + getSidebarWidth()) + 'px';
    } else {
    card.style.left = finalX + 'px';
    }
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
        
        // Debug removed for performance
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
    
    // Apply sidebar offset for desktop when using organic positioning
    let finalX = position.x;
    if (window.innerWidth > 768 && currentShape === 'random') {
        finalX = position.x + getSidebarWidth();
    }
    
    card.style.left = finalX + 'px';
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
                
                // Debug removed
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
            // Debug removed
        } else {
            document.body.appendChild(svg);
            // Debug removed
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
        
        // Varied scale: 40% to 100% of base size
        const baseSize = 40;
        const scaleVariation = 0.4 + (Math.random() * 0.6); // 0.4 to 1.0
        const fontSize = Math.round(baseSize * scaleVariation);
        text.setAttribute('font-size', fontSize.toString());
        
        // 30% chance of italic
        if (Math.random() < 0.3) {
            text.setAttribute('font-style', 'italic');
        }
        
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
    
    // Debug removed
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
    
    
    
    
    blocks.forEach((block, index) => {
        const style = window.getComputedStyle(block);
        const rect = block.getBoundingClientRect();
        const projectGrid = document.querySelector('.project-grid');
        const gridRect = projectGrid.getBoundingClientRect();
        
        
        
        
        
        
        
        
        
    });
    
    
    paths.forEach((path, index) => {
        const style = window.getComputedStyle(path);
        
        
        
        
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
    
    projectCache.clear();
    
}

function refreshProjectCache() {
    
    clearProjectCache();
    preloadProjectContent();
}

function preloadProjectContent() {
    
    const projectsToCache = window.projects || projects || [];
    const mediaIndex = window.projectMedia || window.mediaIndex || {};
    
    
    
    
    projectsToCache.forEach(project => {
        // Always regenerate content to ensure it's up-to-date
        const projectHTML = generateProjectHTML(project, mediaIndex);
        projectCache.set(project.id, {
            html: projectHTML,
            project: project,
            loaded: true
        });
    });
    
    
}

// Simple title formatting - just return the title as-is
function formatTitleWithItalics(title) {
    return title;
}

function generateProjectHTML(project, mediaIndex) {
    const extra = (mediaIndex || {}).projects || {};
    const mainDescription = (typeof i18n !== 'undefined' ? (i18n.tp(project, 'fullDescription') || i18n.tp(project, 'description')) : (project.fullDescription || project.description)) || "";
    
    // Separate main description from bullet points
    let mainDescHtml = '';
    let bulletPointsHtml = '';
    
    if (project.fullDescription) {
        const formattedDesc = mainDescription
            .replace(/\\n/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && line !== '---' && line !== '--');
        
        let mainHtml = '';
        let bulletHtml = '';
        let currentSection = '';
        let inBulletSection = false;
        
        let isChallengesSection = false;
        
        formattedDesc.forEach(line => {
            const isSectionHeader = (line.startsWith('**') && line.endsWith('**')) ||
                line === 'Technical details and implementation' || line === 'Détails techniques et implémentation' ||
                line === 'Challenges and solutions' || line === 'Défis et solutions' ||
                line === 'Impact and results' || line === 'Impact et résultats' ||
                line === 'Process and methodology' || line === 'Processus et méthodologie';
            
            if (isSectionHeader) {
                if (currentSection) {
                    if (isChallengesSection) bulletHtml += '</ul>';
                    else if (inBulletSection) { /* skip non-challenges closing */ }
                    else mainHtml += '</ul>';
                }
                const sectionTitle = (line.startsWith('**') && line.endsWith('**')) ? line.substring(2, line.length - 2) : line;
                
                inBulletSection = sectionTitle.includes('Technical details') || sectionTitle.includes('Détails techniques') ||
                                sectionTitle.includes('Challenges') || sectionTitle.includes('Défis') ||
                                sectionTitle.includes('Impact') ||
                                sectionTitle.includes('Process') || sectionTitle.includes('Processus');
                
                isChallengesSection = sectionTitle.includes('Challenges') || sectionTitle.includes('Défis');
                
                if (isChallengesSection) {
                    bulletHtml += `<h3 data-section="challenges">${sectionTitle}</h3><ul>`;
                }
                currentSection = sectionTitle;
            } else if (line.startsWith('•') || line.startsWith('-')) {
                const bulletText = line.slice(1).trim();
                if (isChallengesSection) {
                    bulletHtml += `<li>${bulletText}</li>`;
                } else if (!inBulletSection) {
                    mainHtml += `<li>${bulletText}</li>`;
                }
            } else if (line.length > 0) {
                if (currentSection) {
                    if (isChallengesSection) bulletHtml += '</ul>';
                    else if (!inBulletSection) mainHtml += '</ul>';
                    currentSection = '';
                    inBulletSection = false;
                    isChallengesSection = false;
                }
                
                if (!inBulletSection) {
                    const isProminent = line.length > 20 && line.length < 120 && 
                                      (line.includes('transformed') || line.includes('innovative') || 
                                       line.includes('breakthrough') || line.includes('revolutionary') || 
                                       line.includes('immersive') || line.includes('interactive') || 
                                       line.includes('cutting-edge') || line.includes('groundbreaking') ||
                                       line.includes('multiuser') || line.includes('music-oriented') ||
                                       line.includes('digital') || line.includes('experience') || 
                                       line.includes('installation') || line.includes('collaboration'));
                    mainHtml += isProminent ? `<p class="prominent-statement">${line}</p>` : `<p>${line}</p>`;
                }
            }
        });
        
        if (currentSection) {
            if (isChallengesSection) bulletHtml += '</ul>';
            else if (!inBulletSection) mainHtml += '</ul>';
        }
        
        mainDescHtml = mainHtml;
        bulletPointsHtml = bulletHtml;
    } else {
        mainDescHtml = `<p>${mainDescription}</p>`;
    }
    
    // Get media - prioritize high-res images and video embeds
    // Media debug removed
    const extraMedia = (extra[project.id] || {}).files || [];
    // Debug removed
    
    // Check for video embeds first
    const hasVideoEmbed = project.videoEmbed && project.videoEmbed.trim();
    const hasMultipleVideos = project.videoEmbeds && project.videoEmbeds.length > 0;
    
    // Get high-res media files (prefer high-res over thumbnails)
    const highResMedia = extraMedia.map(file => {
        if (typeof file === 'object') {
            // File already has the correct path - use as-is since it's from high-res folder
            const highResPath = file.path;
            const url = `media/${highResPath}`;
            // Debug removed
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
    const impactTitle = (typeof i18n !== 'undefined' ? i18n.tp(project, 'impact-title') : project['impact-title']) || '';
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
    
    if (bulletPointsHtml.trim()) {
        const sectionRegex = /<h3[^>]*>(.*?)<\/h3>\s*<ul>([\s\S]*?)<\/ul>/g;
        let cards = '';
        let match;
        while ((match = sectionRegex.exec(bulletPointsHtml)) !== null) {
            const title = match[1];
            const items = match[2];
            cards += `<div class="detail-card"><h3>${title}</h3><ul>${items}</ul></div>`;
        }
        if (cards) {
            contentBlocks.push(`<div class="content-block detail-grid">${cards}</div>`);
        }
    }
    
    const medias = contentBlocks.join('');
    
    const insta = `<a target="_blank" rel="noopener" href="https://www.instagram.com/hugodahoo/">Instagram</a>`;
    
    // Get first media file for header background
    const headerBackgroundImage = allMedia.length > 0 ? allMedia[0] : null;
    const headerStyle = headerBackgroundImage ? `style="background-image: url('${headerBackgroundImage}');"` : '';
    
    return `
        <article class="project-article">
            <header class="project-header" ${headerStyle}>
                <div class="header-overlay"></div>
                <div class="header-content">
                <h1>${formatTitleWithItalics(project.title)}</h1>
                <p class="meta">${[project.year, project.client, (typeof i18n !== 'undefined' ? i18n.tRole(project.role) : project.role)].filter(Boolean).join(" · ")}</p>
                <p class="tech">${project.technologies || ""}</p>
                </div>
            </header>
            
            <div class="project-title-bar">
                <button class="back-arrow" onclick="closeProjectOverlay()" aria-label="${typeof i18n !== 'undefined' ? i18n.t('overlay.back_aria') : 'Back to projects'}">&larr;</button>
                <div class="project-title-bar-text">
                    <h2 class="project-title-bar-name">${formatTitleWithItalics(project.title)}</h2>
                    <p class="project-title-bar-meta">${[project.year, project.client].filter(Boolean).join(" · ")}</p>
                </div>
            </div>
            
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
        // Debug removed
        
        // Handle different video embed formats
        let m;
        
        // YouTube URLs
        if ((m = embedUrl.match(/^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)/))) {
            const vid = m[1];
            return `<div class="video-embed"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${vid}?autoplay=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        if ((m = embedUrl.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/)([\w-]+)/))) {
            const vid = m[1];
            return `<div class="video-embed"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${vid}?autoplay=1&mute=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        
        // Vimeo URLs (with optional privacy hash)
        if ((m = embedUrl.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\/([a-f0-9]+))?/))) {
            const vid = m[1];
            const hash = m[2] ? `h=${m[2]}&` : '';
            return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vid}?${hash}autoplay=1&muted=1&loop=1" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
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
        // Debug removed
        
        let m;
        if ((m = url.match(/^https?:\/\/(?:www\.)?youtu\.be\/([\w-]+)/))) {
            const vid = m[1];
            return `<div class="media"><iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        if ((m = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/)([\w-]+)/))) {
            const vid = m[1];
            return `<div class="media"><iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
        if ((m = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\/([a-f0-9]+))?/))) {
            const vid = m[1];
            const hash = m[2] ? `h=${m[2]}&` : '';
            return `<div class="media"><iframe src="https://player.vimeo.com/video/${vid}?${hash}autoplay=1&muted=1&loop=1" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
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
                <a href="#" class="close-project" onclick="closeProjectOverlay()">${typeof i18n !== 'undefined' ? i18n.t('overlay.back') : '← All projects'}</a>
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
    
    // Mobile bottom-sheet setup
    if (window.innerWidth <= 768) {
        const savedScrollPosition = window.pageYOffset;

        // Add bottom-sheet class and drag handle
        overlay.classList.add('bottom-sheet');
        let handle = overlay.querySelector('.bottom-sheet-handle');
        if (!handle) {
            handle = document.createElement('div');
            handle.className = 'bottom-sheet-handle';
            handle.innerHTML = '<span class="handle-pill"></span>';
            overlay.insertBefore(handle, overlay.firstChild);
        }

        // Prevent body scroll while sheet is open
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollPosition}px`;
        document.body.style.width = '100%';

        // Drag-to-dismiss on the handle area
        let dragStartY = 0;
        let dragging = false;
        let sheetTranslate = 0;

        handle.addEventListener('touchstart', (e) => {
            dragStartY = e.touches[0].clientY;
            dragging = true;
            overlay.style.transition = 'none';
        }, { passive: true });

        overlay.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            const dy = e.touches[0].clientY - dragStartY;
            if (dy > 0) {
                sheetTranslate = dy;
                overlay.style.transform = `translateY(${dy}px)`;
            }
        }, { passive: true });

        overlay.addEventListener('touchend', () => {
            if (!dragging) return;
            dragging = false;
            overlay.style.transition = '';
            if (sheetTranslate > 120) {
                closeProjectOverlay();
            } else {
                overlay.style.transform = '';
            }
            sheetTranslate = 0;
        }, { passive: true });

        // Restore scroll on close
        overlay.addEventListener('closemobile', () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, savedScrollPosition);
        });

        // Position the content
        const contentElement = overlay.querySelector('.project-overlay-content');
        if (contentElement) {
            contentElement.style.overflowY = 'auto';
            contentElement.style.height = '100%';
        }
    }
    
    // Show overlay with animation
    overlay.style.display = 'block';
    
    const isMobileOverlay = window.innerWidth <= 768;
    overlay.style.transform = isMobileOverlay ? 'translateY(100%)' : 'translateX(100%)';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    
    overlay.offsetHeight; // reflow
    
    overlay.classList.add('active');
    
    setTimeout(() => {
        overlay.style.transform = '';
        overlay.style.opacity = '';
        overlay.style.visibility = '';
        overlay.scrollTop = 0;
        const scrollContainer = overlay.querySelector('.project-overlay-content');
        if (scrollContainer) scrollContainer.scrollTop = 0;
    }, 10);
    
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
    
    
}

function closeProjectOverlay() {
    if (!currentProjectOverlay || !isOverlayOpen) return;
    
    // Trigger mobile close event if on mobile
    if (window.innerWidth <= 768 && currentProjectOverlay) {
        currentProjectOverlay.dispatchEvent(new Event('closemobile'));
    }
    
    // Ensure overlay is in the correct state for slide-out
    currentProjectOverlay.style.transform = '';
    currentProjectOverlay.style.opacity = '';
    currentProjectOverlay.style.visibility = '';
    
    // Force a reflow to ensure styles are applied
    currentProjectOverlay.offsetHeight;
    
    // Start slide-out animation
    currentProjectOverlay.classList.remove('active');
    
    // Wait for animation to complete, then hide
    setTimeout(() => {
        currentProjectOverlay.style.display = 'none';
        isOverlayOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.width = '';
        
        // Restore scroll position
        if (typeof savedScrollPosition !== 'undefined' && savedScrollPosition !== null) {
            window.scrollTo(0, savedScrollPosition);
        }
    }, 400); // Match the CSS transition duration (0.4s)
    
    
}

// Make functions globally available
window.showProjectOverlay = showProjectOverlay;
window.closeProjectOverlay = closeProjectOverlay;
window.refreshProjectCache = refreshProjectCache;
window.clearProjectCache = clearProjectCache;

// Render neural network section
function renderNeuralNetworkSection(sectionId, projectIds) {
    const list = document.getElementById(sectionId);
    const allProjects = window.sortedProjectsWithMedia || window.projects || projects || [];
    const projectsToUse = allProjects.filter(p => !p.hidden);
    const sectionProjects = projectsToUse.filter(p => projectIds.includes(p.id));
    
    
    
    
    const projectsWithMedia = sectionProjects;
    
    if (!list) {
        console.error('List element not found:', sectionId);
        return;
    }
    
    resetPositionedCards();
    
    // Generate HTML for project blocks
    // Sort: featured first, then by title
    const featuredProjects = projectsWithMedia.filter(p => p.featured);
    const regularProjects = projectsWithMedia.filter(p => !p.featured);
    const orderedProjects = [...featuredProjects, ...regularProjects];

    const isMobileRender = window.innerWidth <= 768;
    const htmlContent = orderedProjects.map((p, index) => {
        const shortTitle = p.title || p.id || (typeof i18n !== 'undefined' ? i18n.t('untitled') : 'Untitled Project');
        const categories = ['installation', 'generative', 'performance', 'commercial'];
        const category = p.category || categories[index % categories.length];
        const variation = (index % 4) + 1;
        const featuredClass = p.featured ? ' featured-project' : '';
        
        const className = `project-block category-${category} variation-${variation}${featuredClass}`;
        const projectNumber = String(index + 1).padStart(2, '0');
        const yearStr = p.year ? String(p.year) : '';
        const projectHref = typeof i18n !== 'undefined' ? i18n.localHref('project.html?id=' + p.id) : ('project.html?id=' + p.id);
        return `<article class="${className}" data-project-title="${p.title}" data-project-id="${p.id}" data-score-x="${(p._scores?.x || 0.5).toFixed(3)}" data-score-y="${(p._scores?.y || 0.5).toFixed(3)}">
            <a href="${projectHref}" class="project-link">
                <div class="block-surface">
                    <div class="block-title" data-number="${projectNumber}">${shortTitle}</div>
                    <div class="thumbnail-overlay lazy-thumbnail" data-project-id="${p.id}"></div>
                    <div class="project-hover-text">
                        <div class="project-title">${shortTitle}</div>
                        ${p.client && p.client !== 'N/A' ? `<div class="project-artist">${p.client}</div>` : ''}
                        ${p.year ? `<div class="project-year">${p.year}</div>` : ''}
                    </div>
                    ${isMobileRender ? `<div class="card-scrim">
                        <span class="card-scrim-title">${shortTitle}</span>
                    </div>
                    ${yearStr ? `<span class="card-year-badge">${yearStr}</span>` : ''}
                    <div class="card-slideshow-dots"></div>` : ''}
                </div>
            </a>
        </article>`;
    }).join("");
    
    
    
    
    
    try {
        list.innerHTML = htmlContent;
        
    } catch (error) {
        console.error('Error setting innerHTML:', error);
        
    }
    
    
    
    
    
    // Check immediately without timeout
    const blocksImmediate = list.querySelectorAll('.project-block');
    
    
    // Force visibility test
    if (blocksImmediate.length > 0) {
        
    }
    
    // Mutation observer removed - no longer needed
    
    setTimeout(() => {
        const blocks = list.querySelectorAll('.project-block');
        
        
        
        
        
        if (blocks.length === 0) {
            
            
            
            return;
        }
        
        const isMobile = window.innerWidth <= 768;

        renderGridLayout(list, orderedProjects);

        refreshParallaxEffect();

        if (!isMobile) {
            setTimeout(() => {
                initScatterInteractions(orderedProjects);
            }, 300);
        }
    }, 100);
}

// Initialize background dots and image preview effects
function initBackgroundImageHover() {
    // Detect if device is mobile/touch
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    const sectionEl = document.querySelector('.project-section');
    
    function extractProjectId(href) {
        try {
            var u = new URL(href, window.location.origin);
            return u.searchParams.get('id');
        } catch (_) {
            var m = href.match(/[?&]id=([^&#]+)/);
            return m ? m[1] : null;
        }
    }

    if (isMobile) {
        // Mobile: Use the same overlay system, not card expansion
        document.addEventListener('click', function(e) {
            const projectLink = e.target.closest('a[href*="project.html"]');
            if (projectLink) {
                e.preventDefault();
                
                const projectBlock = projectLink.closest('.project-block');
            if (projectBlock) {
                    const projectId = extractProjectId(projectLink.getAttribute('href'));
                    
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
                    const projectId = extractProjectId(projectLink.getAttribute('href'));
                    
                    if (projectId) {
                        // Show instant overlay
                        showProjectOverlay(projectId);
                    }
                }
            }
        });
        
        // Desktop: Handle hover events for background dots
        document.addEventListener('mouseover', function(e) {
            const projectBlock = e.target.closest('.project-block');
            if (projectBlock && !projectBlock.classList.contains('transitioning-to-page')) {
                sectionEl.classList.add('dots-active');
            }
        }, { passive: true });
        
        // Hide effects when not hovering over project blocks
        document.addEventListener('mouseout', function(e) {
            const projectBlock = e.target.closest('.project-block');
            if (projectBlock && !projectBlock.classList.contains('transitioning-to-page')) {
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !relatedTarget.closest('.project-block')) {
                    sectionEl.classList.remove('dots-active');
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
                        const img = document.createElement('img');
                        img.src = thumbnail;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.objectPosition = 'center';
                        img.style.position = 'absolute';
                        img.style.top = '0';
                        img.style.left = '0';
                        
                        thumbnailDiv.innerHTML = '';
                        thumbnailDiv.appendChild(img);
                        thumbnailDiv.classList.add('loaded');

                        const allThumbs = getAllThumbnails(projectId);
                        if (allThumbs.length > 1) {
                            thumbnailDiv.dataset.images = JSON.stringify(allThumbs);
                        }
                    } else {
                        const card = thumbnailDiv.closest('.project-block');
                        if (card) card.style.display = 'none';
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
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center';
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

// ── Mobile Slideshow ─────────────────────────────────────────────────────────

// ── Shared Slideshow Engine ───────────────────────────────────────────────────

const _slideshowState = new Map();

function _advanceSlide(state, direction) {
    const { images, currentImg, nextImg, dotsContainer } = state;
    if (state._transitioning) return;
    state._transitioning = true;

    state.currentIdx = (state.currentIdx + direction + images.length) % images.length;
    nextImg.src = images[state.currentIdx];
    nextImg.onload = () => {
        nextImg.classList.add('visible');
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            if (dots.length > 0) {
                dots.forEach(d => d.classList.remove('active'));
                dots[state.currentIdx % dots.length].classList.add('active');
            }
        }
        setTimeout(() => {
            currentImg.src = images[state.currentIdx];
            nextImg.classList.remove('visible');
            state._transitioning = false;
        }, 850);
    };
}

function _resetAutoTimer(state) {
    clearInterval(state.intervalId);
    state.intervalId = setInterval(() => _advanceSlide(state, 1), 3000);
}

function startSlideshow(card) {
    if (_slideshowState.has(card)) return;
    const overlay = card.querySelector('.thumbnail-overlay');
    if (!overlay) return;

    const raw = overlay.dataset.images;
    if (!raw) return;

    let images;
    try { images = JSON.parse(raw); } catch(e) { return; }
    if (images.length < 2) return;

    const currentImg = overlay.querySelector('img:not(.slideshow-next)');
    if (!currentImg) return;

    const dotsContainer = card.querySelector('.card-slideshow-dots');
    if (dotsContainer && dotsContainer.children.length === 0) {
        const dotCount = Math.min(images.length, 5);
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        }
    }

    const nextImg = document.createElement('img');
    nextImg.className = 'slideshow-next';
    nextImg.style.position = 'absolute';
    nextImg.style.top = '0';
    nextImg.style.left = '0';
    nextImg.style.width = '100%';
    nextImg.style.height = '100%';
    nextImg.style.objectFit = 'cover';
    nextImg.style.objectPosition = 'center';
    overlay.appendChild(nextImg);

    const state = {
        images,
        currentImg,
        nextImg,
        dotsContainer,
        currentIdx: 0,
        intervalId: null,
        _transitioning: false
    };

    state.intervalId = setInterval(() => _advanceSlide(state, 1), 3000);
    _slideshowState.set(card, state);

    // Swipe-to-advance on mobile
    if (window.innerWidth <= 768 && !card._swipeAttached) {
        card._swipeAttached = true;
        let startX = 0, startY = 0, tracking = false;
        let swiped = false;

        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            tracking = true;
            swiped = false;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            if (!tracking) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (Math.abs(dx) > 15 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                if (e.cancelable) e.preventDefault();
            }
        }, { passive: false });

        card.addEventListener('touchend', (e) => {
            if (!tracking) return;
            tracking = false;
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                swiped = true;
                if (e.cancelable) e.preventDefault();
                const s = _slideshowState.get(card);
                if (s) {
                    _advanceSlide(s, dx < 0 ? 1 : -1);
                    _resetAutoTimer(s);
                }
            }
        }, { passive: false });

        // Suppress click after swipe so it doesn't open the overlay
        card.addEventListener('click', (e) => {
            if (swiped) {
                e.preventDefault();
                e.stopPropagation();
                swiped = false;
            }
        }, { capture: true });
    }
}

function stopSlideshow(card) {
    const state = _slideshowState.get(card);
    if (!state) return;
    clearInterval(state.intervalId);
    if (state.nextImg.parentNode) state.nextImg.remove();
    _slideshowState.delete(card);
}

// ── Mobile: visibility-based slideshow ────────────────────────────────────────

function initMobileSlideshow() {
    if (window.innerWidth > 768) return;

    const visibilityMap = new Map();
    let retryTimer = null;

    function updateSlideshows() {
        const sorted = [...visibilityMap.entries()]
            .filter(([, ratio]) => ratio > 0.2)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([card]) => card);

        const activeSet = new Set(sorted);

        for (const card of _slideshowState.keys()) {
            if (!activeSet.has(card)) stopSlideshow(card);
        }

        let started = 0;
        for (const card of sorted) {
            const overlay = card.querySelector('.thumbnail-overlay');
            if (overlay && overlay.dataset.images) {
                startSlideshow(card);
                started++;
            }
        }

        if (started === 0 && !retryTimer) {
            retryTimer = setTimeout(() => {
                retryTimer = null;
                updateSlideshows();
            }, 2000);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            visibilityMap.set(entry.target, entry.intersectionRatio);
        });
        updateSlideshows();
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
    });

    setTimeout(() => {
        document.querySelectorAll('.project-block').forEach(card => {
            observer.observe(card);
        });
    }, 500);
}

// ── Desktop: hover-based slideshow ────────────────────────────────────────────

function initDesktopSlideshow() {
    if (window.innerWidth <= 768) return;

    function attach() {
        document.querySelectorAll('.project-block').forEach(card => {
            if (card._slideshowHover) return;
            card._slideshowHover = true;

            card.addEventListener('mouseenter', () => {
                const overlay = card.querySelector('.thumbnail-overlay');
                if (overlay && overlay.dataset.images) {
                    startSlideshow(card);
                }
            });

            card.addEventListener('mouseleave', () => {
                stopSlideshow(card);
            });
        });
    }

    setTimeout(attach, 600);
}

// Initialize
let isInitialized = false;
// ── Axis Labels ──────────────────────────────────────────────────────────────

function injectAxisLabels(container) {
    container.querySelectorAll('.scatter-axis-label, .scatter-crosshair, .cluster-label').forEach(e => e.remove());

    const hLine = document.createElement('div');
    hLine.className = 'scatter-crosshair scatter-crosshair-h';
    container.appendChild(hLine);

    const vLine = document.createElement('div');
    vLine.className = 'scatter-crosshair scatter-crosshair-v';
    container.appendChild(vLine);
}

function injectClusterLabels(container, allProjects) {
    container.querySelectorAll('.cluster-label').forEach(e => e.remove());

    const tagGroups = {};
    allProjects.forEach(p => {
        if (!p._tags || !p._scores) return;
        p._tags.forEach(tag => {
            if (!tagGroups[tag]) tagGroups[tag] = [];
            tagGroups[tag].push(p);
        });
    });

    const sidebarW = getSidebarWidth();
    const containerWidth = window.innerWidth - sidebarW;
    const containerHeight = window.innerHeight;

    Object.entries(tagGroups).forEach(([tag, members]) => {
        if (members.length < 2) return;
        const avgX = members.reduce((s, p) => s + p._scores.x, 0) / members.length;
        const avgY = members.reduce((s, p) => s + p._scores.y, 0) / members.length;

        const spread = members.reduce((s, p) => {
            return s + Math.sqrt((p._scores.x - avgX) ** 2 + (p._scores.y - avgY) ** 2);
        }, 0) / members.length;

        if (spread > 0.35) return;

        const el = document.createElement('div');
        el.className = 'cluster-label';
        el.textContent = tag;
        el.style.left = (sidebarW + avgX * containerWidth) + 'px';
        el.style.top = ((1 - avgY) * containerHeight) + 'px';
        container.appendChild(el);
    });
}

// ── Mobile Entrance Animations ────────────────────────────────────────────────

function initMobileEntranceAnimations() {
    if (window.innerWidth > 768) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('card-enter')) {
                const idx = parseInt(entry.target.dataset.entranceIdx || '0', 10);
                const delay = Math.min(idx * 50, 300);
                entry.target.style.animationDelay = delay + 'ms';
                entry.target.classList.add('card-enter');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    setTimeout(() => {
        let idx = 0;
        document.querySelectorAll('.project-block').forEach(card => {
            card.dataset.entranceIdx = String(idx % 6);
            card.style.opacity = '0';
            observer.observe(card);
            idx++;
        });
    }, 200);
}

// ── Mobile Scatter Layout (retired — mobile now uses renderGridLayout) ───────

function initializeNeuralNetwork() {
    
    if (isInitialized) {
        
        return;
    }
    
    
    
    
    const allProjects = window.projects || projects || [];
    const projectsToUse = allProjects.filter(p => !p.hidden);
    
    
    
    isInitialized = true;
    
    // Preload all project content for instant navigation
    preloadProjectContent();
    
    if (!projectsToUse.length) {
        
        document.querySelectorAll('.project-grid').forEach(grid => {
            grid.innerHTML = '<p style="padding:16px;color:#9aa">' + (typeof i18n !== 'undefined' ? i18n.t('loading.empty') : 'No projects loaded.') + '</p>';
        });
        return;
    }
    
    
    
    // Show loading state
    const projectGrid = document.getElementById('list-1');
    if (projectGrid) {
        projectGrid.innerHTML = '<div class="loading loading-dots">' + (typeof i18n !== 'undefined' ? i18n.t('loading.network') : 'Generating neural network') + '</div>';
    }
    
    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
        const projectsWithMedia = [...projectsToUse];
        
        // Sort alphabetically
        projectsWithMedia.sort((a, b) => {
            const titleA = (a.title || a.id || '').toLowerCase();
            const titleB = (b.title || b.id || '').toLowerCase();
            return titleA.localeCompare(titleB);
        });
        
        // Compute scatter scores for all projects
        computeAllScores(projectsWithMedia);
        
        // Store globally
        window.sortedProjectsWithMedia = projectsWithMedia;
        
        const allProjectIds = projectsWithMedia.map(p => p.id);
        
        
        
        const gridContainer = document.getElementById('list-1');
        if (gridContainer && window.innerWidth > 768) {
            injectAxisLabels(gridContainer);
        }
        
        // Render
        renderNeuralNetworkSection('list-1', allProjectIds);
        
        if (gridContainer && window.innerWidth > 768) {
            setTimeout(() => injectClusterLabels(gridContainer, projectsWithMedia), 600);
        }
        
        initBackgroundImageHover();
        initLazyThumbnailLoading();
        initMobileSlideshow();
        initDesktopSlideshow();
        initMobileEntranceAnimations();
        
        
    });
    
    // Debug removed for performance
}

// Handle window resize -- grid is CSS-driven, just refresh connections
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (isNeuralNetworkStyle && window.sortedProjectsWithMedia) {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                setTimeout(() => createScatterConnectionLines(window.sortedProjectsWithMedia), 200);
            }
        }
    }, 200);
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

// Parallax effect for background SVG layers
let _parallaxBound = false;
let _parallaxMouseX = 0;
let _parallaxMouseY = 0;
let _parallaxRafId = null;
let _parallaxLayers = null;

function initParallaxEffect() {
    // Cache layer references once
    _parallaxLayers = {
        bg1: document.querySelector('.grid-bg-layer-1'),
        bg2: document.querySelector('.grid-bg-layer-2'),
        bg3: document.querySelector('.grid-bg-layer-3'),
        dots: Array.from(document.querySelectorAll('.dot-layer'))
    };
    if (!_parallaxBound) {
        _parallaxBound = true;
        document.addEventListener('mousemove', function(e) {
            _parallaxMouseX = e.clientX;
            _parallaxMouseY = e.clientY;
            if (!_parallaxRafId) {
                _parallaxRafId = requestAnimationFrame(doParallax);
            }
        }, { passive: true });
    }
}

function doParallax() {
    _parallaxRafId = null;
    if (!_parallaxLayers) return;
    const { bg1, bg2, bg3, dots } = _parallaxLayers;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const nx = (_parallaxMouseX / w) * 2 - 1;
    const ny = (_parallaxMouseY / h) * 2 - 1;

    const layerSpeeds = [0.3, 0.6, 0.9];
    for (let i = 0; i < dots.length; i++) {
        const s = layerSpeeds[i] || 0.5;
        dots[i].style.transform = `translate3d(${nx * s * 8}px, ${ny * s * 8}px, 0)`;
    }

    if (bg1) bg1.style.transform = `translate3d(${nx * 4}px, ${ny * 3}px, 0)`;
    if (bg2) bg2.style.transform = `translate3d(${nx * 10}px, ${ny * 7}px, 0)`;
    if (bg3) bg3.style.transform = `translate3d(${nx * 18}px, ${ny * 12}px, 0)`;
}

// Refresh parallax — re-cache layer references after DOM changes
function refreshParallaxEffect() {
    setTimeout(() => {
        _parallaxLayers = {
            bg1: document.querySelector('.grid-bg-layer-1'),
            bg2: document.querySelector('.grid-bg-layer-2'),
            bg3: document.querySelector('.grid-bg-layer-3'),
            dots: Array.from(document.querySelectorAll('.dot-layer'))
        };
        initParallaxEffect();
    }, 100);
}

// (createMobileNeuralOverlay retired — mobile uses same CSS grid as desktop)

// (Dead mobile scroll animation and neural overlay code removed)


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Clear project cache to ensure fresh content
    if (window.clearProjectCache) {
        window.clearProjectCache();
    }
    generateConcentricSquares();
    initializeNeuralNetwork();
    initParallaxEffect();
    
    // Initialize mobile navigation
    
    // Add keyboard controls for shape cycling
    addShapeKeyboardListener();
    
    // Add shape info to console
    
    Object.keys(SHAPE_BANK).forEach(shapeKey => {
        
    });
    
    
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
        
        // Initialize mobile navigation
    });
} else {
    generateConcentricSquares();
    // Don't initialize immediately - let the HTML script handle it
    // initializeNeuralNetwork();
    initParallaxEffect();
    
    // Initialize mobile navigation
    
    // Add keyboard controls for shape cycling
    addShapeKeyboardListener();
    
    // Add shape info to console
    
    Object.keys(SHAPE_BANK).forEach(shapeKey => {
        
    });
    
    
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
