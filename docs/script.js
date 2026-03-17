// script.js

let vendors = [];

// Fetch vendors from vendors.json
fetch('vendors.json')
  .then(response => response.json())
  .then(data => {
    vendors = data;
    displayVendors();
  });

// Display vendors
function displayVendors(searchTerm = '') {
  const container = document.getElementById('vendors-container');
  container.innerHTML = '';

  let filtered = vendors;

  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filtered = vendors.filter(v => 
      v.name.toLowerCase().includes(term) ||
      v.category.toLowerCase().includes(term) ||
      v.location.toLowerCase().includes(term)
    );
  } else {
    // Show only featured vendors when search is empty
    filtered = vendors.filter(v => v.featured);
  }

  filtered.forEach(vendor => {
    const card = document.createElement('div');
    card.classList.add('vendor-card');

    card.innerHTML = `
      <a href="${vendor.page}">
        <img src="${vendor.image}" alt="${vendor.name}">
        <h3>${vendor.name}</h3>
        <p>${vendor.category} - ${vendor.location}</p>
      </a>
    `;

    container.appendChild(card);
  });
}

// Search input event
document.getElementById('search').addEventListener('keyup', e => {
  displayVendors(e.target.value);
});
