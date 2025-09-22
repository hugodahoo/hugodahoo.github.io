const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'site' directory
app.use(express.static('site'));

// Serve main index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'site', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Main site: http://localhost:${PORT}/`);
    console.log(`📝 Project pages: http://localhost:${PORT}/project.html?id=PROJECT_ID`);
});
