const items = [
  { name: "Sword of Ember", type: "Weapon", rarity: "Rare", effect: "+1 fire damage" },
  { name: "Cloak of Shadows", type: "Armor", rarity: "Uncommon", effect: "Grants invisibility for 1 minute" },
  { name: "Potion of Swiftness", type: "Potion", rarity: "Common", effect: "Increase speed by 10 ft for 1 hour" }
];

document.getElementById("generateBtn").addEventListener("click", () => {
  const item = items[Math.floor(Math.random() * items.length)];
  document.getElementById("itemOutput").innerHTML = `
    <h2>${item.name}</h2>
    <p>Type: ${item.type}</p>
    <p>Rarity: ${item.rarity}</p>
    <p>Effect: ${item.effect}</p>
  `;
});
