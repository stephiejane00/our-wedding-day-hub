const vendorsContainer = document.getElementById('vendors-container');
let vendors = [];

// Fetch vendors
fetch('vendors.json')
  .then(res => res.json())
  .then(data => {
    vendors = data;
    displayVendors();
  });

function displayVendors() {
  vendorsContainer.innerHTML = '';
  const featuredVendors = vendors.filter(v => v.featured);
  
  featuredVendors.forEach(vendor => {
    const card = document.createElement('div');
    card.className = 'vendor-card ' + vendor.category;
    card.innerHTML = `
      <a href="vendors/${vendor.name.toLowerCase().replace(/ /g,'-')}.html">
        <img src="${vendor.image}" alt="${vendor.name}">
        <h3>${vendor.name}</h3>
        <p>${vendor.description}</p>
        <p><small>${vendor.location}</small></p>
      </a>
    `;
    vendorsContainer.appendChild(card);
  });
}

// SEARCH
function searchVendors() {
  const query = document.getElementById('search').value.toLowerCase();
  vendorsContainer.innerHTML = '';
  const filtered = vendors.filter(v => 
    v.name.toLowerCase().includes(query) ||
    v.category.toLowerCase().includes(query) ||
    v.location.toLowerCase().includes(query)
  );

  filtered.forEach(vendor => {
    const card = document.createElement('div');
    card.className = 'vendor-card ' + vendor.category;
    card.innerHTML = `
      <a href="vendors/${vendor.name.toLowerCase().replace(/ /g,'-')}.html">
        <img src="${vendor.image}" alt="${vendor.name}">
        <h3>${vendor.name}</h3>
        <p>${vendor.description}</p>
        <p><small>${vendor.location}</small></p>
      </a>
    `;
    vendorsContainer.appendChild(card);
  });
}
