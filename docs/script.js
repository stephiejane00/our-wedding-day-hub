let vendorsData = [];
let currentCategory = "all";

// load vendors from vendors.json
fetch("vendors.json")
  .then(response => response.json())
  .then(data => {
    vendorsData = data;
    displayVendors(data);
  });

function displayVendors(vendors) {

  const container = document.getElementById("vendors-container");

  container.innerHTML = "";

  vendors.forEach(vendor => {

    const card = document.createElement("div");
    card.classList.add("vendor-card", vendor.category);

    card.innerHTML = `
      <a href="${vendor.page}">
        <img src="${vendor.image}" alt="${vendor.name}">
        <h3>${vendor.name}</h3>
        <p>${vendor.description}</p>
      </a>
    `;

    container.appendChild(card);

  });

}

// search
function searchVendors() {

  const search = document
    .getElementById("search")
    .value
    .toLowerCase();

  const filtered = vendorsData.filter(vendor =>
    vendor.name.toLowerCase().includes(search) &&
    (currentCategory === "all" || vendor.category === currentCategory)
  );

  displayVendors(filtered);

}

// category filter
function filterVendors(category) {

  currentCategory = category;

  const search = document
    .getElementById("search")
    .value
    .toLowerCase();

  const filtered = vendorsData.filter(vendor =>
    vendor.name.toLowerCase().includes(search) &&
    (category === "all" || vendor.category === category)
  );

  displayVendors(filtered);

}
