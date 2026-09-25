const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'dhl_corporate_secure_token_matrix_secret_key';

// Middleware Configuration
app.use(cors());
app.use(express.json());

// ==========================================
// 1. DATABASE SCHEMA DEFINITION (Mongoose)
// ==========================================
const ArticleSchema = new mongoose.Schema({
  sopId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  creator: { type: String, default: 'System_Admin' },
  status: { type: String, enum: ['Normal', 'High'], default: 'Normal' },
  source: { type: String, default: 'MANUAL' },
  // Explicitly defined lifecycleStatus with allowed array states in the schema
  lifecycleStatus: { 
    type: String, 
    enum: ['Draft', 'Reviewed', 'Published'], 
    default: 'Draft' 
  }
}, { timestamps: true });

const Article = mongoose.model('Article', ArticleSchema);

// System Audit Logs Schema
const LogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'CREATE_SOP', 'UPDATE_SOP', 'DELETE_SOP'
  details: { type: String, required: true },
  timestamp: { type: String, required: true }
});

const Log = mongoose.model('Log', LogSchema);

// ==========================================
// 2. GLOBAL AUDIT LOG HELPER ENGINE
// ==========================================
global.createAuditLog = async function(action, details) {
  try {
    const timestamp = new Date().toLocaleString('en-US', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
    });
    
    await Log.create({ action, details, timestamp });
    console.log(`[AUDIT LOG SAVED] Action: ${action} | Details: ${details}`);
  } catch (error) {
    console.error('Audit registration exception failure:', error);
  }
};

// ==========================================
// 3. SECURITY AUTHENTICATION MIDDLEWARE
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: Missing clearance validation token.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Infrastructure signature invalid.' });
    req.user = user;
    next();
  });
};

// ==========================================
// 4. ROUTE ROUTING CONTROLLERS (REST API)
// ==========================================

// Mock Authentication Login Token Generation Endpoint
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  const userPayload = { name: username || 'DHL_Operator' };
  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });
  res.status(200).json({ token });
});

// GET: Fetch All Operational SOP Manifest Nodes
app.get('/api/articles', authenticateToken, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: 1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Registry pull retrieval exception error.' });
  }
});

// POST: Publish/Ingest a New Operational SOP Document Node
app.post('/api/articles', authenticateToken, async (req, res) => {
  try {
    const { sopId, title, status, creator, source, lifecycleStatus } = req.body;

    const newArticle = await Article.create({
      sopId,
      title,
      status,
      creator,
      source,
      lifecycleStatus: lifecycleStatus || 'Draft'
    });

    // Capture Log Activity Transaction
    await global.createAuditLog(
      'CREATE_SOP', 
      `Published new structural manifest node [${newArticle.sopId}] - Title: "${newArticle.title}"`
    );

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: 'Ingestion transaction dropped at database interface layer.' });
  }
});

// PUT: Update SOP Manifest Fields explicitly tracking Lifecycle updates
app.put('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    // 1. Safely extract all variables from the incoming Vue client JSON payload body
    const { title, status, lifecycleStatus } = req.body;

    // 2. Ensure lifecycleStatus is passed down into the mongoose criteria cluster object
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        status, 
        lifecycleStatus // Maps directly to update state changes to Draft, Reviewed, etc.
      },
      { new: true, runValidators: true } // returns the document configuration *after* update execution
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: 'SOP Document targeted query node not found.' });
    }

    // 3. Register transaction parameters sequence to System Audit Logs Matrix
    await global.createAuditLog(
      'UPDATE_SOP',
      `Modified record elements for [${updatedArticle.sopId}]. Lifecycle status transition saved as: "${updatedArticle.lifecycleStatus}"`
    );

    // 4. Emit back the completely processed database schema entry
    res.status(200).json(updatedArticle);

  } catch (error) {
    console.error('Update operation failure details:', error);
    res.status(500).json({ error: 'Data pipeline transition routing mapping exception error.' });
  }
});

// DELETE: Terminally Drop/Purge SOP Record Node from Infrastructure
app.delete('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ error: 'Target manifest key missing from document store index.' });
    }

    // Capture Dropped Trace Log Action
    await global.createAuditLog(
      'DELETE_SOP',
      `Terminally dropped record sequence [${deletedArticle.sopId}] ("${deletedArticle.title}") from global index.`
    );

    res.status(200).json({ message: 'Record purge transaction cleanly committed.' });
  } catch (error) {
    res.status(500).json({ error: 'Purge runtime security validation structure disruption.' });
  }
});

// GET: Pull System Log Matrix Stream
app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find().sort({ _id: 1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Unable to stream system logging matrix.' });
  }
});

// ==========================================
// 5. DATABASE HOOKS & SYSTEM INITIALIZATION
// ==========================================
// FIXED: Removed deprecated options (useNewUrlParser, useUnifiedTopology) for clean launch
mongoose.connect('mongodb://127.0.0.1:27017/dhl_ops_db')
.then(() => {
  console.log('====================================================');
  console.log('SUCCESS: Connected cleanly to MongoDB (dhl_ops_db)');
  app.listen(PORT, () => {
    console.log(`Express routing infrastructure engine running on Port: ${PORT}`);
    console.log('====================================================');
  });
})
.catch((err) => {
  console.error('CRITICAL ERROR: Cluster connection drop failure:', err);
});