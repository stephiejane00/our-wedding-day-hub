function filterVendors(category){
    let vendors = document.querySelectorAll(".vendor-card");
    vendors.forEach(vendor=>{
        if(category==="all"){
            vendor.style.display="block";
        } else if(vendor.classList.contains(category)){
            vendor.style.display="block";
        } else {
            vendor.style.display="none";
        }
    });
}

function searchVendors(){
    let input = document.getElementById("search").value.toLowerCase();
    let vendors = document.querySelectorAll(".vendor-card");
    vendors.forEach(vendor=>{
        let text = vendor.innerText.toLowerCase();
        vendor.style.display = text.includes(input) ? "block" : "none";
    });
}
