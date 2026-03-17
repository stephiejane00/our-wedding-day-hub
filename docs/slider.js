const sliderTrack = document.getElementById("sliderTrack");
let currentSlide = 0;

// Replace these with your vendors JSON data
const featuredVendors = [
  { name: "Kaity Kissed Nails & Design", img: "images/nails1.jpg", desc: "Luxury nails and beauty services." },
  { name: "Moments with Koarlie Studios", img: "images/koarlie1.jpg", desc: "Capturing your wedding memories beautifully." },
  { name: "The Roamed Collective", img: "images/trc1.jpg", desc: "Creative photography & videography." },
  { name: "Rosita Flowers", img: "images/rosita2.jpg", desc: "Beautiful floral arrangements." },
  { name: "Passion For Cakes", img: "images/cake2.jpg", desc: "Delicious wedding cakes." }
];

// Populate slides
featuredVendors.forEach(vendor => {
  const card = document.createElement("div");
  card.classList.add("vendor-card");
  card.innerHTML = `
    <img src="${vendor.img}" alt="${vendor.name}">
    <h3>${vendor.name}</h3>
    <p>${vendor.desc}</p>
  `;
  sliderTrack.appendChild(card);
});

// Slider functionality
function nextSlide() {
  currentSlide = (currentSlide + 1) % featuredVendors.length;
  sliderTrack.scrollBy({ left: 270, behavior: 'smooth' });
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + featuredVendors.length) % featuredVendors.length;
  sliderTrack.scrollBy({ left: -270, behavior: 'smooth' });
}
