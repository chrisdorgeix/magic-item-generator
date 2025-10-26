const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

async function loadData() {
  const res = await fetch('items.json');
  return await res.json();
}

function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function renderTable(container, columns, rows) {
  const html = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr>${columns.map(c => `<td>${r[c.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>`;
  container.innerHTML = html;
}

function setupTabs() {
  $$('.tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    $$('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tab}`).classList.add('active');
  }));
}

function setupGenerator(data) {
  const form = $('#generator-form');
  const tbody = $('#results-table tbody');
  const meta = $('#results-meta');
  $('#clear-results').addEventListener('click', () => { tbody.innerHTML = ''; meta.textContent = ''; });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const kind = form.kind.value;
    const count = +form.count.value;

    const items = data.items[kind];
    const ench = data.enchantments[kind];

    const rows = Array.from({ length: count }, (_, i) => {
      const base = randPick(items);
      const affix = randPick(ench);
      return { idx: i + 1, item: `${base.name} of ${affix.name}`, enchant: affix.name, notes: affix.effect };
    });

    tbody.innerHTML = rows.map(r => `<tr><td>${r.idx}</td><td>${r.item}</td><td>${r.enchant}</td><td>${r.notes}</td></tr>`).join('');
    meta.textContent = `Generated ${count} ${kind}${count>1?'s':''}.`;
  });
}

async function init() {
  setupTabs();
  const data = await loadData();
  setupGenerator(data);

  // Render items
  const itemContainer = $('#items-container');
  Object.entries(data.items).forEach(([kind, arr]) => {
    const section = document.createElement('section');
    section.innerHTML = `<h3>${kind[0].toUpperCase()+kind.slice(1)}</h3>`;
    const columns = Object.keys(arr[0]||{}).map(k => ({key:k,label:k}));
    renderTable(section, columns, arr);
    itemContainer.appendChild(section);
  });

  // Render enchantments
  const enchContainer = $('#ench-container');
  Object.entries(data.enchantments).forEach(([kind, arr]) => {
    const section = document.createElement('section');
    section.innerHTML = `<h3>${kind[0].toUpperCase()+kind.slice(1)}</h3>`;
    const columns = Object.keys(arr[0]||{}).map(k => ({key:k,label:k}));
    renderTable(section, columns, arr);
    enchContainer.appendChild(section);
  });
}

init();

