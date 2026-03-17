const sliderTrack = document.getElementById("sliderTrack");
let currentSlide = 0;

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

// Show 3 slides at a time
const slideWidth = 270; // 250px card + 20px gap
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
