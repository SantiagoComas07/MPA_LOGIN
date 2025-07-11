const $registerForm = document.getElementById("register-form");
const $nameUser =document.getElementById("nameUser")
const $email = document.getElementById("emailUser");
const $password = document.getElementById("passwordUser");
const endPoint = "http://localhost:3000/users";

$registerForm.addEventListener("submit", (event) => {
    event.preventDefault()
    register();


});



async function register() {
// Sending registration information
const person={
    name: $nameUser.value,
    email: $email.value,
    password: $password.value
}

console.log("Iniciando register")
    let response = await fetch(`${endPoint}?email=${$email.value}`);
    //Here I give you time to convert the .json to javascript
    let data = await response.json()
    console.log("Respuesta del register", response);

if (data.length > 0) {
    alert("Este correo ya está registrado.");
    return;
  }

// We do the POST
let saveResponse = await fetch(endPoint, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"

    },
    body: JSON.stringify(person)


});
console.log(saveResponse);

if (!saveResponse.ok) {
    alert("Error al guardar el usuario. Intenta de nuevo.");
    return;
  }

    // If the data returns empty then the user is told to go and register.

        localStorage.setItem("currentUser", JSON.stringify(saveResponse))
        window.location.href="/src/views/login.html";
        alert("register exitoso");
  
    };