// Load items from JSON
async function loadData() {
  const res = await fetch('items.json');
  return await res.json();
}

// Show tables in tabs
function showTable(type) {
  loadData().then(data => {
    const tableHtml = `<ul>${data[type].map(item => `<li>${item}</li>`).join('')}</ul>`;
    document.getElementById('tableContainer').innerHTML = tableHtml;
  });
}

// Utility: shuffle array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Generate items when button clicked
document.getElementById('generateBtn').addEventListener('click', async () => {
  const itemType = document.getElementById('itemType').value;
  const numEnchantments = parseInt(document.getElementById('numEnchantments').value);
  const numItems = parseInt(document.getElementById('numItems').value);

  const data = await loadData();
  const baseItems = data[itemType];
  const enchantments = data.enchantments;

  const output = [];

  for (let i = 0; i < numItems; i++) {
    const item = baseItems[Math.floor(Math.random() * baseItems.length)];
    const itemEnchantments = shuffleArray(enchantments).slice(0, numEnchantments);

    output.push({
      name: item,
      enchantments: itemEnchantments
    });
  }

  displayItems(output);
});

// Display generated items
function displayItems(items) {
  const div = document.getElementById('itemOutput');
  div.innerHTML = items.map(it => `
    <div class="item">
      <h3>${it.name}</h3>
      <p>Enchantments: ${it.enchantments.join(', ')}</p>
    </div>
  `).join('');
}
