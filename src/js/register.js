const $registerForm = document.getElementById("register-form");
const $nameUser =document.getElementById("nameUser")
const $email = document.getElementById("emailUser");
const $password = document.getElementById("passwordUser");
//Aqui hacemos un link en donde ingresamos a los emails y lo volvemos dinamicos 
const endPoint = "http://localhost:3000/users";

$registerForm.addEventListener("submit", (event) => {
    event.preventDefault()
    register();


});



async function register() {
// Envio de informacion del register
const person={
    name: $nameUser.value,
    email: $email.value,
    password: $password.value
}

console.log("Iniciando register")
    let response = await fetch(`${endPoint}?email=${$email.value}`);
    //Aqui le douy tiempo para que el .json se convierta a javascript
    let data = await response.json()
    console.log("Respuesta del register", response);

if (data.length > 0) {
    alert("Este correo ya está registrado.");
    return;
  }

// Hacemos el POST
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

    // Si el data regresa vacio entonces se le dice al usuario que se vaya a registrar.

        localStorage.setItem("currentUser", JSON.stringify(saveResponse))
        window.location.href="/src/views/login.html";
        alert("register exitoso");
        // console.log(data[0]);
    // } else {
    //     if (data[0].password == $password.value) {
    //     } else {
    //         alert("Contraseña equivocada");


    //     }

    // }
    };