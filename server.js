const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files from the 'site' directory
app.use(express.static('site'));

// Serve main index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'site', 'index.html'));
});

app.get('/project-review', (req, res) => {
    res.sendFile(path.join(__dirname, 'PROJECT_REVIEW.html'));
});

app.post('/api/project/:id', (req, res) => {
    const projectId = req.params.id;
    const updates = req.body || {};
    const dataPath = path.join(__dirname, 'site', 'data.js');

    let fileContent;
    try {
        fileContent = fs.readFileSync(dataPath, 'utf8');
    } catch (error) {
        console.error('Failed to read data.js:', error);
        return res.status(500).json({ success: false, error: 'Failed to read data.js' });
    }

    const match = fileContent.match(/window\.projects\s*=\s*(\[\s*[\s\S]*\])\s*;?/);
    if (!match) {
        return res.status(500).json({ success: false, error: 'Unable to parse project data' });
    }

    let projects;
    try {
        projects = JSON.parse(match[1]);
    } catch (parseError) {
        console.error('Failed to parse project JSON:', parseError);
        return res.status(500).json({ success: false, error: 'Project data is invalid JSON' });
    }

    const projectIndex = projects.findIndex(project => project.id === projectId);
    if (projectIndex === -1) {
        return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const normalizeString = (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== 'string') return value;
        const trimmed = value.trim();
        return trimmed.length ? trimmed : null;
    };

    const project = projects[projectIndex];
    const updatableFields = ['year', 'role', 'technologies', 'videoEmbed'];

    updatableFields.forEach(field => {
        if (Object.prototype.hasOwnProperty.call(updates, field)) {
            project[field] = normalizeString(updates[field]);
        }
    });

    if (Object.prototype.hasOwnProperty.call(updates, 'media')) {
        const mediaArray = Array.isArray(updates.media)
            ? updates.media.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
            : [];
        project.media = mediaArray;
        project.hasMedia = mediaArray.length > 0;
    }

    const serialized = `window.projects = ${JSON.stringify(projects, null, 2)};\n`;

    try {
        fs.writeFileSync(dataPath, serialized, 'utf8');
    } catch (writeError) {
        console.error('Failed to write data.js:', writeError);
        return res.status(500).json({ success: false, error: 'Failed to write data.js' });
    }

    return res.json({ success: true, project: projects[projectIndex] });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Main site: http://localhost:${PORT}/`);
    console.log(`📝 Project pages: http://localhost:${PORT}/project.html?id=PROJECT_ID`);
});
