const state = { students: [], recentlyAdded: new Set(), editingId: null };
const $ = (selector) => document.querySelector(selector);
const rows = $('#studentRows');
const modal = $('#modalBackdrop');
const form = $('#studentForm');
let toastTimer;

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';
    try { message = await response.text() || message; } catch (_) { /* Keep fallback message. */ }
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

async function loadStudents() {
  try {
    state.students = await api('/students');
    render();
  } catch (error) {
    showToast('Could not load students. Is the server running?', true);
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function render() {
  const query = $('#searchInput').value.trim().toLocaleLowerCase();
  const visible = state.students.filter((student) => student.name.toLocaleLowerCase().includes(query));
  $('#totalCount').textContent = state.students.length;
  $('#studentTotal').textContent = state.students.length;
  $('#navCount').textContent = state.students.length;
  $('#recentCount').textContent = state.recentlyAdded.size;
  $('#resultCount').textContent = visible.length;
  $('#footerCount').textContent = `Showing ${visible.length} ${visible.length === 1 ? 'student' : 'students'}`;
  rows.innerHTML = visible.map((student) => `<tr>
    <td><div class="student-cell"><span class="student-avatar">${escapeHtml(initials(student.name))}</span>${escapeHtml(student.name)}</div></td>
    <td><span class="roll-pill">${escapeHtml(student.rollNo)}</span></td>
    <td><span class="id-label">#${student.id}</span></td>
    <td><div class="row-actions"><button class="icon-button" data-action="edit" data-id="${student.id}" aria-label="Edit ${escapeHtml(student.name)}" title="Edit">&#9998;</button><button class="icon-button delete" data-action="delete" data-id="${student.id}" aria-label="Delete ${escapeHtml(student.name)}" title="Delete">&#9003;</button></div></td>
  </tr>`).join('');
  $('#emptyState').classList.toggle('visible', visible.length === 0);
}

function showView(viewName) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active-view', view.id === `view-${viewName}`));
  document.querySelectorAll('.workspace-nav [data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === viewName));
  const navButton = document.querySelector(`.workspace-nav [data-view="${viewName}"]`);
  $('#breadcrumbTitle').textContent = navButton ? navButton.textContent.trim().replace(/\s+\d+$/, '') : 'Overview';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(student) {
  state.editingId = student?.id ?? null;
  $('#modalTitle').textContent = student ? 'Edit student' : 'Add a student';
  $('.modal-description').textContent = student ? 'Update this student’s details below.' : 'Enter the details below to add a student to your directory.';
  $('#saveButton').innerHTML = student ? 'Save changes <span>&#8594;</span>' : 'Add student <span>&#8594;</span>';
  $('#studentName').value = student?.name ?? '';
  $('#rollNo').value = student?.rollNo ?? '';
  $('#formError').textContent = '';
  modal.hidden = false;
  setTimeout(() => $('#studentName').focus(), 30);
}

function closeModal() {
  modal.hidden = true;
  form.reset();
  state.editingId = null;
}

function showToast(message, error = false) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.toggle('error', error);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.go)));
$('#addButton').addEventListener('click', () => openModal());
$('#emptyAdd').addEventListener('click', () => openModal());
$('#closeModal').addEventListener('click', closeModal);
$('#cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
$('#searchInput').addEventListener('input', render);
$('#clearSearch').addEventListener('click', () => { $('#searchInput').value = ''; render(); $('#searchInput').focus(); });
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); showView('students'); $('#searchInput').focus(); }
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = { name: $('#studentName').value.trim(), rollNo: $('#rollNo').value.trim() };
  if (!payload.name || !payload.rollNo) return;
  const button = $('#saveButton');
  button.disabled = true;
  $('#formError').textContent = '';
  try {
    if (state.editingId) {
      await api(`/students/${state.editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Student details updated.');
    } else {
      const created = await api('/students', { method: 'POST', body: JSON.stringify(payload) });
      state.recentlyAdded.add(created.id);
      showToast('Student added to the directory.');
    }
    closeModal();
    await loadStudents();
  } catch (error) {
    $('#formError').textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

rows.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const student = state.students.find((item) => item.id === Number(button.dataset.id));
  if (!student) return;
  if (button.dataset.action === 'edit') { openModal(student); return; }
  if (!window.confirm(`Delete ${student.name} from the directory?`)) return;
  try {
    await api(`/students/${student.id}`, { method: 'DELETE' });
    state.recentlyAdded.delete(student.id);
    showToast('Student deleted.');
    await loadStudents();
  } catch (error) {
    showToast(error.message, true);
  }
});

$('#loadSamples').addEventListener('click', async () => {
  const samples = [
    { name: 'Asha Patel', rollNo: 'CS2026001' },
    { name: 'Rohan Mehta', rollNo: 'CS2026002' },
    { name: 'Priya Shah', rollNo: 'CS2026003' },
    { name: 'Arjun Desai', rollNo: 'CS2026004' },
    { name: 'Neha Kulkarni', rollNo: 'CS2026005' }
  ];
  try {
    await loadStudents();
    const knownRollNumbers = new Set(state.students.map((student) => student.rollNo.toLocaleLowerCase()));
    const missingSamples = samples.filter((student) => !knownRollNumbers.has(student.rollNo.toLocaleLowerCase()));
    if (missingSamples.length === 0) {
      showToast('All sample students are already in the directory.');
      return;
    }
    for (const student of missingSamples) {
      const created = await api('/students', { method: 'POST', body: JSON.stringify(student) });
      state.recentlyAdded.add(created.id);
    }
    await loadStudents();
    showToast(`${missingSamples.length} sample student${missingSamples.length === 1 ? '' : 's'} added. Try search, edit, and delete.`);
  } catch (error) {
    showToast(`Could not load all sample records: ${error.message}`, true);
    await loadStudents();
  }
});

loadStudents();
