const API_BASE = 'http://localhost:8000';

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Handle PDB load
document.getElementById('loadPdb').onclick = async () => {
  const pdbid = document.getElementById('pdbid').value.trim();
  if (!pdbid) return alert('Enter PDB ID');

  setLoading('viewer', true);
  try {
    const res = await fetch(`${API_BASE}/fetch/pdb?pdbid=${encodeURIComponent(pdbid)}`);
    if (!res.ok) throw new Error(`PDB ${pdbid} not found`);
    const data = await res.json();
    renderViewer(data.pdb);
    switchTab('viewer-tab');
  } catch (err) {
    showError('viewer', err.message);
  } finally {
    setLoading('viewer', false);
  }
};

// Handle sequence analysis
document.getElementById('analyzeSeq').onclick = async () => {
  const seq = document.getElementById('sequence').value.trim();
  if (!seq) return alert('Paste sequence or FASTA');

  setLoading('results', true);
  try {
    const res = await fetch(`${API_BASE}/analyze/sequence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seq })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Bad sequence');
    }
    const data = await res.json();
    renderResults(data);
    switchTab('results-tab');
  } catch (err) {
    showError('results', err.message);
  } finally {
    setLoading('results', false);
  }
};

// Render protein in viewer (fixed so it stays in the div)
function renderViewer(pdbText) {
  const viewerDiv = document.getElementById('viewer');
  viewerDiv.innerHTML = ''; // Clear old render
  viewerDiv.style.height = '500px'; // Lock height for layout

  const gl = $3Dmol.createViewer(viewerDiv, { backgroundColor: 'white' });
  gl.addModel(pdbText, 'pdb');
  gl.setStyle({}, { cartoon: { color: 'spectrum' } });
  gl.zoomTo();
  gl.render();
}

// Render sequence analysis results
function renderResults(data) {
  const container = document.getElementById('results');
  container.innerHTML = '';
  Object.entries(data).forEach(([key, value]) => {
    container.innerHTML += `
      <div class="metric"><span>${key}:</span> ${typeof value === 'object' ? JSON.stringify(value) : value}</div>
    `;
  });
}

// Switch tab
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Loading & error states
function setLoading(target, state) {
  const el = target === 'viewer' ? document.getElementById('viewer') : document.getElementById('results');
  if (state) el.innerHTML = `<div class="loading">Loading...</div>`;
}
function showError(target, message) {
  const el = target === 'viewer' ? document.getElementById('viewer') : document.getElementById('results');
  el.innerHTML = `<div class="loading" style="color:red;">${message}</div>`;
}
