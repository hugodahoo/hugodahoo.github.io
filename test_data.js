// Test script to validate data.js
const fs = require('fs');

try {
    const content = fs.readFileSync('site/data.js', 'utf8');
    
    // Extract the projects array
    const start = content.indexOf('window.projects = [');
    const end = content.lastIndexOf('];') + 2;
    const jsonStr = content.substring(start + 18, end - 2);
    
    console.log('Extracted JSON length:', jsonStr.length);
    
    // Try to parse as JSON
    const projects = JSON.parse(jsonStr);
    console.log('✅ JSON is valid!');
    console.log('Number of projects:', projects.length);
    
    // Check for projects with fullDescription
    const withFullDesc = projects.filter(p => p.fullDescription);
    console.log('Projects with fullDescription:', withFullDesc.length);
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Line:', error.lineNumber);
}


















