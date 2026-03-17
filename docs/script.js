const vendorsContainer = document.getElementById('vendors-container');
const searchInput = document.getElementById('search');

// Load vendors from JSON
fetch('vendors.json')
  .then(response => response.json())
  .then(data => {
    window.vendorsData = data; // store globally
    displayFeaturedVendors(data);
  })
  .catch(error => console.error('Error loading vendors:', error));

// Display only featured vendors initially
function displayFeaturedVendors(vendors) {
  vendorsContainer.innerHTML = '';
  vendors
    .filter(vendor => vendor.featured)
    .forEach(vendor => {
      vendorsContainer.innerHTML += createVendorCard(vendor);
    });
}

// Create vendor card HTML
function createVendorCard(vendor) {
  return `
    <div class="vendor-card ${vendor.category}">
      <a href="${vendor.page}">
        <img src="${vendor.image}" alt="${vendor.name}">
        <h3>${vendor.name}</h3>
        <p>${vendor.description}</p>
      </a>
      <p style="font-size:0.85rem; color:#555;">${vendor.location}</p>
    </div>
  `;
}

// Search function (by name, category, or location)
function searchVendors() {
  const query = searchInput.value.toLowerCase();
  const filtered = window.vendorsData.filter(vendor => {
    return (
      vendor.name.toLowerCase().includes(query) ||
      vendor.category.toLowerCase().includes(query) ||
      vendor.location.toLowerCase().includes(query)
    );
  });

  vendorsContainer.innerHTML = '';
  filtered.forEach(vendor => {
    vendorsContainer.innerHTML += createVendorCard(vendor);
  });

  // If search is empty, go back to featured
  if (!query) displayFeaturedVendors(window.vendorsData);
}

// Update search placeholder
searchInput.placeholder = "Search by vendor, location, category";
