const vendorsContainer = document.getElementById('vendors-container');
let vendors = [];

// LOAD DATA
fetch('vendors.json')
  .then(res => res.json())
  .then(data => {
    vendors = data;
    displayFeatured();
  });

// SHOW ONLY FEATURED
function displayFeatured() {
  vendorsContainer.innerHTML = '';

  const featured = vendors.filter(v => v.featured === true);

  featured.forEach(v => {
    vendorsContainer.innerHTML += `
      <div class="vendor-card">
        <img src="${v.image}" alt="${v.name}">
        <h3>${v.name || ''}</h3>
        <p>${v.description || ''}</p>
        <p><small>${v.location || ''}</small></p>
      </div>
    `;
  });
}

// SEARCH FUNCTION
function searchVendors() {
  const query = document.getElementById('search').value.toLowerCase();
  vendorsContainer.innerHTML = '';

  const filtered = vendors.filter(v =>
    (v.name && v.name.toLowerCase().includes(query)) ||
    (v.category && v.category.toLowerCase().includes(query)) ||
    (v.location && v.location.toLowerCase().includes(query))
  );

  filtered.forEach(v => {
    vendorsContainer.innerHTML += `
      <div class="vendor-card">
        <img src="${v.image}" alt="${v.name}">
        <h3>${v.name || ''}</h3>
        <p>${v.description || ''}</p>
        <p><small>${v.location || ''}</small></p>
      </div>
    `;
  });
}
