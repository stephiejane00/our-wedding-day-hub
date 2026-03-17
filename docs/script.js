let vendors = [];
let currentSlide = 0;

/* LOAD DATA */
fetch('./vendors.json')
  .then(res => res.json())
  .then(data => {
    vendors = data;
    loadFeatured();
  });

/* FEATURED SLIDER (GROUPED) */
function loadFeatured() {
  const track = document.getElementById("slider-track");
  track.innerHTML = "";

  const featured = vendors.filter(v => v.featured === true);

  // GROUP INTO SETS OF 3
  for (let i = 0; i < featured.length; i += 3) {
    const group = featured.slice(i, i + 3);

    let slideHTML = `<div class="slide">`;

    group.forEach(v => {
      slideHTML += `
        <div class="vendor-card" onclick="openVendor('${v.id}')">
          <img src="images/${v.image}" alt="${v.name}">
          <h3>${v.name}</h3>
          <p>${v.category} • ${v.location}</p>
        </div>
      `;
    });

    slideHTML += `</div>`;
    track.innerHTML += slideHTML;
  }

  updateSlider();
  autoSlide();
}

/* SLIDER CONTROLS */
function updateSlider() {
  const track = document.getElementById("slider-track");
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  const total = document.querySelectorAll(".slide").length;
  currentSlide = (currentSlide + 1) % total;
  updateSlider();
}

function prevSlide() {
  const total = document.querySelectorAll(".slide").length;
  currentSlide = (currentSlide - 1 + total) % total;
  updateSlider();
}

/* AUTO SLIDE */
function autoSlide() {
  setInterval(() => {
    nextSlide();
  }, 5000);
}

/* SEARCH */
function searchVendors() {
  const query = document.getElementById("search").value.toLowerCase();
  const container = document.getElementById("vendors-container");

  container.innerHTML = "";

  const results = vendors.filter(v =>
    v.name.toLowerCase().includes(query) ||
    v.category.toLowerCase().includes(query) ||
    v.location.toLowerCase().includes(query)
  );

  results.forEach(v => {
    container.innerHTML += `
      <div class="vendor-card" onclick="openVendor('${v.id}')">
        <img src="images/${v.image}" alt="${v.name}">
        <h3>${v.name}</h3>
        <p>${v.category} • ${v.location}</p>
      </div>
    `;
  });
}

/* OPEN PAGE */
function openVendor(id) {
  window.location.href = `vendor.html?id=${id}`;
}
