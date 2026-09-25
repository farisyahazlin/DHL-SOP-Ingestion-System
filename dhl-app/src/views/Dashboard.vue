<template>
  <div class="dashboard-root">
    <nav class="dhl-sidebar-panel">
      <div class="brand-identity-container">
        <img src="../assets/images.png" alt="DHL Logo" class="dhl-logo-render" />
      </div>
      
      <div class="navigation-matrix">
        <div :class="{ active: currentTab === 'feed' }" @click="currentTab = 'feed'" class="nav-item">
          <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="nav-text-label">Operations Feed</span>
        </div>

        <div :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'" class="nav-item">
          <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span class="nav-text-label">System Audit Logs</span>
        </div>

        <div @click="confirmLogout" class="logout-action-link nav-item">
          <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span class="nav-text-label">Logout</span>
        </div>
      </div>
    </nav>

    <main class="workspace-main">
      <div v-if="currentTab === 'feed'">
        <header class="workspace-header-node">
          <div>
            <h1>Operational Knowledge Base</h1>
            <p class="subtitle">Live standard operating procedures (SOP) repository</p>
          </div>
          
          <div class="metrics-flexbox">
            <div class="metric-card-block">
              <span class="label">TOTAL MANIFESTS</span>
              <span class="value">{{ articles.length }}</span>
            </div>
            <div class="metric-card-block high-priority-accent">
              <span class="label">URGENT ACTION</span>
              <span class="value">{{ articles.filter(a => a.status === 'High').length }}</span>
            </div>
          </div>
        </header>

        <section class="dhl-panel-card creation-suite">
          <div class="panel-header-accent">
            <h3>Dispatch New Operational Node</h3>
          </div>
          
          <div class="form-premium-layout">
            <div class="form-grid-row">
              <div class="input-group flex-triple">
                <span class="input-addon">📝</span>
                <input 
                  type="text" 
                  v-model="newTitle" 
                  placeholder="Enter complete SOP description sequence..." 
                  @keyup.enter="addArticle"
                  class="dhl-text-input"
                />
              </div>
              <div class="input-group flex-single">
                <span class="input-addon">👤</span>
                <input 
                  type="text" 
                  v-model="newCreator" 
                  placeholder="Creator / Editor Name" 
                  class="dhl-text-input"
                />
              </div>
              <div class="input-group flex-single">
                <span class="input-addon">⚠️</span>
                <select v-model="newStatus" class="dhl-dropdown-select">
                  <option value="Normal">Normal Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>

            <div class="upload-premium-container">
              <div class="upload-instruction">
                <span class="upload-icon">📁</span>
                <div class="upload-text-stack">
                  <span class="upload-title">Attach Reference Source Materials</span>
                  <span class="upload-subtitle">Accepts document files format: .TXT, .PDF, .DOCX</span>
                </div>
              </div>
              <div class="upload-action-zone">
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileSelection"
                  accept=".txt,.pdf,.docx" 
                  multiple 
                  id="premium-file-picker"
                  class="hidden-file-input"
                />
                <label for="premium-file-picker" class="dhl-btn-secondary">
                  Choose Files
                </label>
                <span v-if="selectedFiles.length === 0" class="file-status-text">No file chosen</span>
                <div v-else class="staged-files-badge">
                  ⚡ <strong>{{ selectedFiles.length }}</strong> item(s) staged for RPA
                </div>
              </div>
            </div>

            <div class="action-row-dispatch">
              <button @click="addArticle" class="dhl-btn-submit">Publish SOP Manifest</button>
            </div>
          </div>
          
          <p v-if="feedbackMessage" :class="['feedback-prompt', isError ? 'error-prompt' : 'success-prompt']">
            {{ feedbackMessage }}
          </p>
        </section>

        <section class="dhl-panel-card analytics-toolbar">
          <div class="panel-header-accent">
            <h3>Data Filtration Matrix</h3>
          </div>
          <div class="filter-flex-grid">
            <div class="input-group flex-double">
              <span class="input-addon">🔍</span>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search by Tracking ID or SOP Title..." 
                class="dhl-text-input"
              />
            </div>
            <div class="input-group flex-single">
              <span class="input-addon">👤</span>
              <input 
                type="text" 
                v-model="filterCreator" 
                placeholder="Filter by Creator..." 
                class="dhl-text-input"
              />
            </div>
            <div class="input-group flex-single">
              <span class="input-addon">⚙️</span>
              <select v-model="filterLifecycle" class="dhl-dropdown-select">
                <option value="ALL">All Lifecycle States</option>
                <option value="Draft">Draft</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </section>

        <section class="dhl-panel-card table-suite">
          <div class="table-title-area">
            <h3>Global Logistics Index</h3>
          </div>
          <div class="table-scroll-wrapper">
            <table class="dhl-data-matrix">
              <thead>
                <tr>
                  <th style="width: 14%">Tracking ID</th>
                  <th style="width: 36%">Standard Operating Procedure (SOP) Title</th>
                  <th style="width: 12%">Origin Cluster</th>
                  <th style="width: 12%">Priority Level</th>
                  <th style="width: 14%">Lifecycle Status</th>
                  <th style="width: 12%; text-align: center;">Controls Matrix</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="article in filteredArticles" :key="article._id" :class="{ 'row-active-modification': editingId === article._id }">
                  
                  <td :class="['id-monospace-cell', 'priority-indicator', (article.status || 'Normal').toLowerCase()]">
                    {{ article.sopId }}
                  </td>
                  
                  <td>
                    <div v-if="editingId === article._id" class="inline-edit-box">
                      <input type="text" v-model="editingTitle" class="inline-input-element" />
                    </div>
                    <span v-else class="sop-title-bold">{{ article.title }}</span>
                  </td>
                  
                  <td><span class="origin-badge-tag">{{ article.source || 'MANUAL' }}</span></td>
                  
                  <td>
                    <select v-if="editingId === article._id" v-model="editingStatus" class="inline-select-element">
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                    </select>
                    <span v-else :class="['priority-label-badge', (article.status || 'Normal').toLowerCase()]">
                      {{ article.status || 'Normal' }}
                    </span>
                  </td>

                  <td>
                    <select 
                      v-if="editingId === article._id" 
                      v-model="editingLifecycle" 
                      class="inline-select-element"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Published">Published</option>
                    </select>
                    <span v-else :class="['lifecycle-badge', (article.lifecycleStatus || 'Published').toLowerCase()]">
                      {{ article.lifecycleStatus || 'Published' }}
                    </span>
                  </td>
                  
                  <td style="text-align: center;">
                    <div v-if="editingId === article._id" class="control-actions-flex">
                      <button @click="saveEdit(article._id)" class="matrix-text-btn save-action">Save</button>
                      <button @click="cancelEdit" class="matrix-text-btn cancel-action">Cancel</button>
                    </div>
                    <div v-else class="control-actions-flex">
                      <button @click="startEdit(article)" class="matrix-text-btn edit-action" title="Edit Record">Edit</button>
                      <button @click="deleteArticle(article._id, article.sopId)" class="matrix-text-btn delete-action" title="Delete Record">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredArticles.length === 0">
                  <td colspan="6" class="matrix-empty-state">No structural standard processing documents match active query filters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div v-if="currentTab === 'history'">
        <header class="workspace-header-node">
          <div>
            <h1>Database Audit Logging Matrix</h1>
            <p class="subtitle">System events ledger capturing CRUD transactions</p>
          </div>
        </header>

        <section class="audit-stream-container">
          <div class="audit-matrix-header">
            <span class="header-col col-time">Timestamp</span>
            <span class="header-col col-action">Operation</span>
            <span class="header-col col-desc">Transaction Details Sequence</span>
          </div>
          
          <div class="audit-matrix-body">
            <div v-for="(log, idx) in logs" :key="idx" class="audit-log-row" :class="(log.action || '').toLowerCase()">
              <span class="log-timestamp-label">{{ log.timestamp }}</span>
              <div class="badge-wrapper">
                <span class="log-system-badge">{{ log.action }}</span>
              </div>
              <span class="log-message-body">{{ log.details }}</span>
            </div>
            <p v-if="logs.length === 0" class="matrix-empty-state">No audit sequence traces available.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DashboardView',
  data() {
    return {
      currentTab: 'feed',
      articles: [],
      logs: [],
      newTitle: '',
      newCreator: '',
      newStatus: 'Normal',
      selectedFiles: [],
      feedbackMessage: '',
      isError: false,
      
      // Inline Editing Registry States
      editingId: null,
      editingTitle: '',
      editingStatus: 'Normal',
      editingLifecycle: 'Published', // Stores temporary user select updates before sync

      // Realtime Client Filtration Query State
      searchQuery: '',
      filterCreator: '',
      filterLifecycle: 'ALL'
    };
  },
  computed: {
    filteredArticles() {
      return this.articles.filter(article => {
        const matchesQuery = 
          (article.sopId && article.sopId.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (article.title && article.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
        
        const matchesCreator = 
          !this.filterCreator.trim() || 
          (article.creator && article.creator.toLowerCase().includes(this.filterCreator.toLowerCase()));
        
        const matchesLifecycle = 
          this.filterLifecycle === 'ALL' || 
          (article.lifecycleStatus || 'Published') === this.filterLifecycle;

        return matchesQuery && matchesCreator && matchesLifecycle;
      });
    }
  },
  mounted() {
    this.fetchArticles();
    this.fetchLogs();
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return { headers: { Authorization: `Bearer ${token}` } };
    },
    async fetchArticles() {
      try {
        const response = await axios.get('http://localhost:3000/api/articles', this.getAuthHeaders());
        this.articles = response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) this.handleLogout();
      }
    },
    async fetchLogs() {
      try {
        const response = await axios.get('http://localhost:3000/api/logs', this.getAuthHeaders());
        this.logs = response.data.reverse(); 
      } catch (error) {
        console.error('Audit sync disruption:', error);
      }
    },
    handleFileSelection(event) {
      this.selectedFiles = Array.from(event.target.files);
    },
    async addArticle() {
      if (!this.newTitle.trim()) {
        this.isError = true;
        this.feedbackMessage = 'Validation Alert: SOP description payload cannot be blank.';
        return;
      }
      try {
        const nextIndex = this.articles.length + 1;
        const generatedSopId = `SOP-${String(nextIndex).padStart(3, '0')}`;

        const payload = {
          sopId: generatedSopId,
          title: this.newTitle,
          status: this.newStatus,
          creator: this.newCreator.trim() ? this.newCreator : 'System_Admin',
          lifecycleStatus: 'Draft',
          source: this.selectedFiles.length > 0 ? 'DIGITAL_ATTACHMENT' : 'MANUAL'
        };

        const response = await axios.post('http://localhost:3000/api/articles', payload, this.getAuthHeaders());

        if (response.status === 201) {
          this.newTitle = '';
          this.newCreator = '';
          this.selectedFiles = [];
          if (this.$refs.fileInput) this.$refs.fileInput.value = '';
          this.isError = false;
          this.feedbackMessage = 'SOP data node cleanly staged to central registry.';
          this.fetchArticles();
          this.fetchLogs();
        }
      } catch (error) {
        this.isError = true;
        this.feedbackMessage = 'Synchronization exception error during document generation.';
      }
    },
    startEdit(article) {
      this.editingId = article._id;
      this.editingTitle = article.title;
      this.editingStatus = article.status || 'Normal';
      this.editingLifecycle = article.lifecycleStatus || 'Published'; // Seed setup matching current record state
    },
    cancelEdit() {
      this.editingId = null;
      this.editingTitle = '';
    },
    async saveEdit(id) {
      if (!this.editingTitle.trim()) {
        alert('Validation exception: Title parameter string cannot be empty.');
        return;
      }
      try {
        // FIXED: Explicitly including editingLifecycle tracking states into payload sequence
        const response = await axios.put(`http://localhost:3000/api/articles/${id}`, {
          title: this.editingTitle,
          status: this.editingStatus,
          lifecycleStatus: this.editingLifecycle
        }, this.getAuthHeaders());

        if (response.status === 200) {
          this.editingId = null;
          this.fetchArticles();
          this.fetchLogs();
        }
      } catch (error) {
        alert('Update transaction rejected by host infrastructure routing engine.');
      }
    },
    async deleteArticle(id, sopId) {
      if (confirm(`CRITICAL MAINTENANCE ACTION: Confirm terminal drop of record sequence ${sopId}?`)) {
        try {
          const response = await axios.delete(`http://localhost:3000/api/articles/${id}`, this.getAuthHeaders());
          if (response.status === 200) {
            this.fetchArticles();
            this.fetchLogs();
          }
        } catch (error) {
          alert('Purge sequence broken. Clearance validation framework conflict discovered.');
        }
      }
    },
    confirmLogout() {
      if (confirm('Are you sure you want to log out?')) {
        this.handleLogout();
      }
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Core Corporate Typography & Theme Mapping */
.dashboard-root { 
  display: flex; 
  height: 100vh; 
  background-color: #f4f5f7; 
  font-family: 'Delivery', 'Frutiger', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Red Sidebar Corporate Control Panel */
.dhl-sidebar-panel { 
  width: 280px; 
  background-color: #D40511; 
  color: white; 
  padding: 35px 24px; 
  display: flex; 
  flex-direction: column; 
  box-shadow: 4px 0 15px rgba(212,5,17,0.15);
  z-index: 10;
}

.brand-identity-container { 
  background: #FFFFFF; 
  padding: 14px 18px;
  margin-bottom: 40px; 
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
}
.dhl-logo-render {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Formal Corporate Navigation Menu Item Links */
.navigation-matrix {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.nav-item { 
  padding: 12px 16px; 
  cursor: pointer; 
  border-radius: 4px; 
  display: flex;
  align-items: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
}
.nav-svg-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.2s ease-in-out;
}
.nav-text-label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* Menu Hover Interaction Configuration */
.nav-item:hover { 
  background-color: rgba(0, 0, 0, 0.12);
  color: #FFFFFF;
}
.nav-item:hover .nav-svg-icon {
  color: #FFFFFF;
}

/* Menu Dynamic Activation State matching corporate guidelines */
.nav-item.active { 
  background-color: #FFCC00 !important; 
  color: #1c1b1a !important; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.15); 
}
.nav-item.active .nav-svg-icon {
  color: #1c1b1a !important;
}

/* Separated Lower Session Action Configuration */
.logout-action-link { 
  margin-top: auto !important; 
  background: rgba(0, 0, 0, 0.18); 
  border: 1px solid rgba(255,255,255,0.08); 
}
.logout-action-link:hover { 
  background-color: #1c1b1a !important; 
  border-color: #1c1b1a !important;
  color: #FFFFFF !important; 
}
.logout-action-link:hover .nav-svg-icon {
  color: #D40511 !important;
}

/* Main Main Workspace Layout Content Canvas */
.workspace-main { flex: 1; padding: 40px 45px; overflow-y: auto; }
.workspace-header-node { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  border-bottom: 2px solid #e2e5e9; 
  padding-bottom: 20px; 
  margin-bottom: 30px; 
}
h1 { color: #1c1b1a; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
.subtitle { color: #5a6578; margin: 4px 0 0 0; font-size: 14px; font-weight: 500; }

/* Metrics Module Displays */
.metrics-flexbox { display: flex; gap: 15px; }
.metric-card-block { 
  background: white; 
  border-top: 4px solid #FFCC00; 
  padding: 14px 22px; 
  border-radius: 4px; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.05); 
  display: flex; 
  flex-direction: column; 
  min-width: 140px; 
}
.metric-card-block.high-priority-accent { border-top-color: #D40511; }
.metric-card-block .label { font-size: 10px; color: #7a869a; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 2px; }
.metric-card-block .value { font-size: 28px; font-weight: 800; color: #1c1b1a; }

/* Premium Panel Form Layout Elements */
.dhl-panel-card { 
  background: white; 
  padding: 24px; 
  border-radius: 6px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
  border: 1px solid #e2e5e9; 
  margin-bottom: 25px; 
}
.panel-header-accent { border-left: 3px solid #D40511; padding-left: 12px; margin-bottom: 20px; }
.panel-header-accent h3 { margin: 0; color: #1c1b1a; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

/* Ingestion Control Matrix Stack formatting */
.form-premium-layout { display: flex; flex-direction: column; gap: 16px; }
.form-grid-row { display: flex; gap: 12px; }

/* Integrated Input Icon Blocks */
.input-group { display: flex; align-items: center; background-color: #fff; border: 1px solid #ced4da; border-radius: 4px; transition: all 0.2s; }
.input-group:focus-within { border-color: #D40511; box-shadow: 0 0 0 3px rgba(212,5,17,0.08); }
.input-addon { padding: 0 12px; background: #f8f9fa; color: #6c757d; height: 100%; display: flex; align-items: center; border-right: 1px solid #ced4da; font-size: 14px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; }

.dhl-text-input { flex: 1; border: none; padding: 12px 14px; font-size: 14px; outline: none; background: transparent; width: 100%; }
.dhl-dropdown-select { border: none; padding: 12px 14px; font-size: 13.5px; outline: none; background: transparent; font-weight: 600; cursor: pointer; width: 100%; color: #495057; }

/* Flexible Width Utilities */
.flex-single { flex: 1; }
.flex-double { flex: 2; }
.flex-triple { flex: 3; }

/* Sleek Integrated Document Upload Box Style */
.upload-premium-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fdfcf7;
  border: 1px dashed #FFCC00;
  padding: 14px 20px;
  border-radius: 4px;
}
.upload-instruction { display: flex; align-items: center; gap: 14px; }
.upload-icon { font-size: 22px; color: #FFCC00; }
.upload-text-stack { display: flex; flex-direction: column; }
.upload-title { font-size: 13px; font-weight: 700; color: #1c1b1a; text-transform: uppercase; }
.upload-subtitle { font-size: 11.5px; color: #6c757d; font-weight: 500; }

.upload-action-zone { display: flex; align-items: center; gap: 15px; }
.hidden-file-input { display: none; }
.dhl-btn-secondary { background: white; border: 1px solid #ced4da; color: #495057; padding: 8px 16px; border-radius: 4px; font-size: 12.5px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.15s; }
.dhl-btn-secondary:hover { background: #f8f9fa; border-color: #adb5bd; }
.file-status-text { font-size: 12.5px; color: #7a869a; font-style: italic; }
.staged-files-badge { font-size: 12.5px; color: #155724; background: #d4edda; padding: 6px 14px; border-radius: 4px; border: 1px solid #c3e6cb; }

.action-row-dispatch { display: flex; justify-content: flex-end; margin-top: 4px; }
.dhl-btn-submit { 
  background-color: #D40511; 
  color: white; 
  border: none; 
  font-weight: 700; 
  padding: 12px 28px; 
  border-radius: 4px; 
  font-size: 13px; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer; 
  transition: background 0.15s; 
}
.dhl-btn-submit:hover { background-color: #b3040e; }

/* Realtime Data Filtering Layout Modifiers */
.filter-flex-grid { display: flex; gap: 12px; }

/* Premium Data Matrix Grid Architecture */
.table-title-area { border-bottom: 2px solid #f4f5f7; padding-bottom: 12px; margin-bottom: 18px; }
.table-scroll-wrapper { overflow-x: auto; }
.dhl-data-matrix { width: 100%; border-collapse: collapse; background: white; text-align: left; }
.dhl-data-matrix th { 
  background: #f8f9fa; 
  padding: 12px 14px; 
  color: #5a6578; 
  font-weight: 700; 
  font-size: 11.5px; 
  letter-spacing: 0.5px; 
  border-bottom: 2px solid #e2e5e9; 
  text-transform: uppercase; 
}
.dhl-data-matrix td { padding: 12px 14px; border-bottom: 1px solid #f0f2f5; color: #212529; font-size: 13.5px; vertical-align: middle; }
.dhl-data-matrix tbody tr:hover { background-color: #fffdec; } 
.row-active-modification { background-color: #f4f7fa !important; }

/* Ultra-light Premium Enterprise Left Side Accents */
.priority-indicator { position: relative; border-left: 4px solid transparent !important; }

/* Soft Light Crimson Highlight tint for High Priority */
.priority-indicator.high { 
  border-left-color: #e12d3d !important; 
  background-color: #fff8f8 !important;
}

/* Soft Light Blue Highlight tint for Normal Priority */
.priority-indicator.normal { 
  border-left-color: #0066cc !important; 
  background-color: #f7faff !important;
}

/* Priority Visual Badges inside columns */
.priority-label-badge { padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: 700; text-transform: uppercase; border: 1px solid transparent; display: inline-block; }
.priority-label-badge.high { background: #fff5f5; color: #e12d3d; border-color: #fad2d6; }
.priority-label-badge.normal { background: #f0f7ff; color: #0066cc; border-color: #cce3ff; }

/* UI Tags Badges Styles */
.id-monospace-cell { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 700; color: #1c1b1a; font-size: 13px; }
.sop-title-bold { font-weight: 600; color: #1c1b1a; }
.origin-badge-tag { background: #f1f3f5; color: #495057; padding: 4px 8px; border-radius: 3px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; border: 1px solid #e9ecef; }

/* Corporate Multi-State Process Lifecycle Tag Badges */
.lifecycle-badge { padding: 4px 10px; border-radius: 3px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; display: inline-block; text-align: center; letter-spacing: 0.3px; }
.lifecycle-badge.draft { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
.lifecycle-badge.reviewed { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
.lifecycle-badge.published { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }

/* Text Button Actions Matrix Layout Links */
.control-actions-flex { display: flex; gap: 8px; justify-content: center; }
.matrix-text-btn { background: transparent; border: none; font-size: 12.5px; font-weight: 700; text-transform: uppercase; cursor: pointer; padding: 4px 6px; transition: color 0.15s ease; }
.edit-action { color: #0056b3; }
.edit-action:hover { color: #FFCC00; text-decoration: underline; }
.delete-action { color: #dc3545; }
.delete-action:hover { color: #b3040e; text-decoration: underline; }
.save-action { color: #28a745; }
.save-action:hover { color: #1e7e34; }
.cancel-action { color: #6c757d; }
.cancel-action:hover { color: #495057; }

/* Inline Inputs Component Modifiers */
.inline-input-element { width: 100%; padding: 6px 10px; border: 1px solid #D40511; border-radius: 4px; box-sizing: border-box; font-size: 13px; outline: none; }
.inline-select-element { padding: 5px 8px; border: 1px solid #ced4da; border-radius: 4px; font-size: 12px; background-color: white; }

/* Refined Audit Log Grid styles */
.audit-stream-container { 
  background: white; 
  border-radius: 6px; 
  border: 1px solid #e2e5e9; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* Column Headers for Grid Alignment */
.audit-matrix-header {
  display: flex;
  background: #f8f9fa;
  padding: 12px 20px;
  border-bottom: 2px solid #e2e5e9;
}
.header-col {
  color: #5a6578;
  font-weight: 700;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Grid Width Declarations matching corporate matrices */
.col-time, .log-timestamp-label { flex-basis: 220px; flex-shrink: 0; }
.col-action, .badge-wrapper { flex-basis: 140px; flex-shrink: 0; }
.col-desc, .log-message-body { flex-grow: 1; }

.audit-matrix-body {
  max-height: 600px;
  overflow-y: auto;
}

/* High Aligned Table Rows */
.audit-log-row { 
  display: flex; 
  align-items: center; 
  padding: 12px 20px; 
  border-bottom: 1px solid #f0f2f5; 
  font-size: 13px; 
  transition: background-color 0.15s;
}
.audit-log-row:last-child { border-bottom: none; }
.audit-log-row:hover { background-color: #fafbfc; }

/* Clean Monospace Engineer Layout for Timestamp Strings */
.log-timestamp-label { 
  color: #5a6578; 
  font-family: 'SFMono-Regular', Consolas, monospace; 
  font-size: 12px; 
  font-weight: 500;
}

/* Operation Badges Design Framework */
.log-system-badge { 
  display: inline-block;
  padding: 4px 10px; 
  border-radius: 3px; 
  font-size: 10.5px; 
  font-weight: 800; 
  text-transform: uppercase; 
  letter-spacing: 0.3px;
  text-align: center;
  min-width: 90px;
}

/* Categorized Operation Colors mapping matching data status sets */
.audit-log-row.create_sop .log-system-badge { background-color: #e6f4ea; color: #137333; border: 1px solid #ceead6; }
.audit-log-row.update_sop .log-system-badge { background-color: #fef7e0; color: #b06000; border: 1px solid #feefc3; }
.audit-log-row.delete_sop .log-system-badge { background-color: #fce8e6; color: #c5221f; border: 1px solid #fad2cf; }

/* Corporate descriptions configuration styling */
.log-message-body { 
  color: #1c1b1a; 
  font-weight: 500; 
  line-height: 1.4;
}

.feedback-prompt { font-size: 13.5px; margin-top: 12px; font-weight: 700; }
.error-prompt { color: #D40511; }
.success-prompt { color: #28a745; }
.matrix-empty-state { text-align: center; color: #7a869a; padding: 35px !important; font-weight: 500; font-style: italic; }
</style>