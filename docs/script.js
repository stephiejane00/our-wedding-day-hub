const vendorsContainer = document.getElementById('vendors-container');
let vendors = [];

// Load vendors.json
fetch('vendors.json')
  .then(res => res.json())
  .then(data => {
    vendors = data;

    // Show only featured vendors on homepage
    const featuredVendors = vendors.filter(v => v.featured);
    displayVendors(featuredVendors);
  });

function displayVendors(vendorList) {
  vendorsContainer.innerHTML = '';
  vendorList.forEach(vendor => {
    const card = document.createElement('div');
    card.className = 'vendor-card';

    card.innerHTML = `
      <img src="${vendor.image}" alt="${vendor.name}">
      <h3>${vendor.name}</h3>
      <p>${vendor.description}</p>
      <a href="vendor.html?name=${encodeURIComponent(vendor.name)}">View Profile</a>
    `;
    vendorsContainer.appendChild(card);
  });
}

// Enquiry Button Logic (on vendor page)
const enquireBtn = document.getElementById('enquireBtn');
if (enquireBtn) {
  const urlParams = new URLSearchParams(window.location.search);
  const vendorName = urlParams.get('name');
  const vendor = vendors.find(v => v.name === vendorName);
  if (vendor && vendor.email) {
    enquireBtn.href = `mailto:${vendor.email}?subject=Wedding Enquiry - ${vendor.name}`;
  }
}
