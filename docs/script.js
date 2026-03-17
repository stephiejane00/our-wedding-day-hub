const vendorsContainer = document.getElementById('vendors-container');
let vendors = [];

fetch('vendors.json')
  .then(res => res.json())
  .then(data => {
    vendors = data;
    displayFeatured();
  });

function displayFeatured() {
  vendorsContainer.innerHTML = '';

  vendors
    .filter(v => v.featured)
    .forEach(v => {
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

function searchVendors() {
  const query = document.getElementById('search').value.toLowerCase();
  vendorsContainer.innerHTML = '';

  vendors
    .filter(v =>
      v.name.toLowerCase().includes(query) ||
      v.category.toLowerCase().includes(query) ||
      v.location.toLowerCase().includes(query)
    )
    .forEach(v => {
      vendorsContainer.innerHTML += `
        <div class="vendor-card">
          <img src="${v.image}" alt="${v.name}">
          <h3>${v.name}</h3>
          <p>${v.description}</p>
          <p><small>${v.location}</small></p>
        </div>
      `;
    });
}
