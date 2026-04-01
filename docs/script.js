let vendors = [];
let currentSlide = 0;
let autoSlideInterval = null;

/* LOAD DATA */
fetch('./vendors.json')
  .then(res => res.json())
  .then(data => {
    vendors = data;

    // Only run featured slider if that section exists
    if (document.getElementById("slider-track")) {
      loadFeatured();
    }
  })
  .catch(error => {
    console.error("Error loading vendors.json:", error);
  });

/* FEATURED SLIDER (GROUPED) */
function loadFeatured() {
  const track = document.getElementById("slider-track");
  if (!track) return;

  track.innerHTML = "";

  const featured = vendors.filter(v => v.featured === true);

  if (featured.length === 0) {
    track.innerHTML = "<p>No featured vendors found.</p>";
    return;
  }

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

  currentSlide = 0;
  updateSlider();
  autoSlide();
}

/* SLIDER CONTROLS */
function updateSlider() {
  const track = document.getElementById("slider-track");
  if (!track) return;

  const total = document.querySelectorAll(".slide").length;
  if (total === 0) return;

  track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
  const total = document.querySelectorAll(".slide").length;
  if (total === 0) return;

  currentSlide = (currentSlide + 1) % total;
  updateSlider();
}

function prevSlide() {
  const total = document.querySelectorAll(".slide").length;
  if (total === 0) return;

  currentSlide = (currentSlide - 1 + total) % total;
  updateSlider();
}

/* AUTO SLIDE */
function autoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
  }

  const total = document.querySelectorAll(".slide").length;
  if (total <= 1) return;

  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

/* SEARCH */
function searchVendors() {
  const searchInput = document.getElementById("search");
  const container = document.getElementById("vendors-container");

  if (!searchInput || !container) return;

  const query = searchInput.value.toLowerCase();
  container.innerHTML = "";

  const results = vendors.filter(v =>
    v.name.toLowerCase().includes(query) ||
    v.category.toLowerCase().includes(query) ||
    v.location.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    container.innerHTML = "<p>No vendors found.</p>";
    return;
  }

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
