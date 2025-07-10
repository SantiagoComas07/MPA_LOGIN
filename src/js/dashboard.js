//i choose my elements of the DOM that i'll need.

const $closeSection= document.getElementById("logout-btn");
//It get the information about the user with the key currentUser
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if(!currentUser){

    window.location.href ="../index.html"; // If the user isn't loggin, it don´t allow continue

}


$closeSection.addEventListener('click', ()=>{

localStorage.removeItem("currentUser"); // Here i deete the data of the user
window.location.href ="/index.html"; // I redirect to the login


});