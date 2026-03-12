// SEARCH FUNCTION
function searchVendors() {
  let input = document.getElementById('search').value.toLowerCase();
  let vendors = document.querySelectorAll('.vendor-card');

  vendors.forEach(vendor => {
    let name = vendor.querySelector('h3').innerText.toLowerCase();
    if(name.includes(input)) {
      vendor.style.display = '';
    } else {
      vendor.style.display = 'none';
    }
  });
}

// CATEGORY FILTER
function filterVendors(category) {
  let vendors = document.querySelectorAll('.vendor-card');

  vendors.forEach(vendor => {
    if(category === 'all' || vendor.classList.contains(category)) {
      vendor.style.display = '';
    } else {
      vendor.style.display = 'none';
    }
  });
}
