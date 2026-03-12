function filterVendors(category) {

let vendors = document.querySelectorAll(".vendor-card");

vendors.forEach(vendor => {

if(category === "all"){
vendor.style.display = "block";
}

else if(vendor.classList.contains(category)){
vendor.style.display = "block";
}

else{
vendor.style.display = "none";
}

});

}
