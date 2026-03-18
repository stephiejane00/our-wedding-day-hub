const sliderTrack = document.getElementById("sliderTrack");
let currentSlide = 0;

// Featured vendors — you can keep this dynamic if using vendors.json later
const featuredVendors = [
  { id: "nails", name: "Kaity Kissed Nails & Design", img: "images/nails1.jpg", desc: "Luxury nails and beauty services." },
  { id: "koarlie", name: "Moments with Koarlie Studios", img: "images/koarlie1.jpg", desc: "Capturing your wedding memories beautifully." },
  { id: "trc", name: "The Roamed Collective", img: "images/trc1.jpg", desc: "Creative photography & videography." },
  { id: "rosita", name: "Rosita Flowers", img: "images/rosita2.jpg", desc: "Beautiful floral arrangements." },
  { id: "cakes", name: "Passion For Cakes", img: "images/cake2.jpg", desc: "Delicious wedding cakes." },
  { id: "beauty", name: "Bridal Beauty Collective", img: "images/beauty2.jpg", desc: "Bridal hair & makeup services." }
];

// Clear previous slides
sliderTrack.innerHTML = "";

// Populate slides
featuredVendors.forEach(vendor => {
  const card = document.createElement("div");
  card.classList.add("vendor-card");
  card.style.borderRadius = "0px"; // straight corners
  card.style.boxShadow = "0 10px 25px rgba(222, 210, 195, 0.4), 0 0 25px rgba(222, 210, 195, 0.2) inset"; // beige glow

  card.innerHTML = `
    <img src="${vendor.img}" alt="${vendor.name}">
    <h3>${vendor.name}</h3>
    <p>${vendor.desc}</p>
  `;

  // Make card clickable
  card.addEventListener("click", () => {
    window.location.href = `vendors/${vendor.id}.html`;
  });

  sliderTrack.appendChild(card);
});

// Slider controls
const slideWidth = 320 + 30; // card width + gap

function nextSlide() {
  if (currentSlide < featuredVendors.length - 3) {
    currentSlide++;
    sliderTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    sliderTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
  }
}
