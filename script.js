// --- Adjust filenames here if needed ---
const ITEMS_CSV = 'data/items.csv';          // if yours is tables.csv, change to 'data/tables.csv'
const ENCH_CSV  = 'data/enchantments.csv';

const $ = (sel) => document.querySelector(sel);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function loadCSV(path) {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,      // expects a "name" column
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject
    });
  });
}

function renderTable(rows) {
  if (!rows.length) {
    $('#table-wrap').innerHTML = '<p class="muted">No rows to display.</p>';
    return;
  }
  const html = `
    <table>
      <thead><tr><th>Item</th><th>Enchantment</th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr><td>${r.item}</td><td>${r.enchantment}</td></tr>`).join('')}
      </tbody>
    </table>`;
  $('#table-wrap').innerHTML = html;
}

async function generate() {
  const btn = $('#generate');
  const status = $('#status');
  btn.disabled = true;
  status.textContent = 'Loading data…';
  try {
    const [items, ench] = await Promise.all([loadCSV(ITEMS_CSV), loadCSV(ENCH_CSV)]);
    if (!items.length || !ench.length) throw new Error('CSV is empty or missing a "name" column.');

    // Pair each item with a random enchantment
    const pairs = items.map(it => ({
      item: it.name,
      enchantment: rand(ench)?.name ?? ''
    }));

    status.textContent = `Generated ${pairs.length} matches.`;
    renderTable(pairs);
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  } finally {
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('#generate')?.addEventListener('click', generate);
});
