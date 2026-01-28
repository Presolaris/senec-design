import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true,
}));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  // Try to serve the specific HTML file for the route
  const htmlPath = join(__dirname, 'dist', req.path, 'index.html');
  res.sendFile(htmlPath, (err) => {
    if (err) {
      // Fallback to main index.html
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
