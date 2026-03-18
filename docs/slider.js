const sliderTrack = document.getElementById("sliderTrack");
let currentSlide = 0;

// Featured vendors
const featuredVendors = [
  { id: "kaity-kissed-nails-and-designs", name: "Kaity Kissed Nails & Design", img: "images/nails1.jpg", desc: "Luxury nails and beauty services." },
  { id: "moments-with-koarlie-studios", name: "Moments with Koarlie Studios", img: "images/koarlie1.jpg", desc: "Capturing your wedding memories beautifully." },
  { id: "the-roamed-collective", name: "The Roamed Collective", img: "images/trc1.jpg", desc: "Creative photography & videography." },
  { id: "rosita-flowers", name: "Rosita Flowers", img: "images/rosita2.jpg", desc: "Beautiful floral arrangements." },
  { id: "passion-cakes", name: "Passion For Cakes", img: "images/cake2.jpg", desc: "Delicious wedding cakes." },
  { id: "brazilian-beauty", name: "Bridal Beauty Collective", img: "images/beauty2.jpg", desc: "Bridal hair & makeup services." }
];

// Clear previous slides
sliderTrack.innerHTML = "";

// Create vendor slides
featuredVendors.forEach(vendor => {
  const link = document.createElement("a");
  link.href = `vendors/${vendor.id}.html`; // clickable link
  link.classList.add("vendor-link");

  const card = document.createElement("div");
  card.classList.add("vendor-card");
  card.style.borderRadius = "0"; // straight corners
  card.style.boxShadow = "0 10px 25px rgba(222, 210, 195, 0.4), 0 0 25px rgba(222, 210, 195, 0.2) inset"; // beige glow

  card.innerHTML = `
    <img src="${vendor.img}" alt="${vendor.name}">
    <h3>${vendor.name}</h3>
    <p>${vendor.desc}</p>
  `;

  link.appendChild(card);
  sliderTrack.appendChild(link);
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
