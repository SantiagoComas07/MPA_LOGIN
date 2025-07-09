const $loginForm = document.getElementById("login-form");
const $email = document.getElementById("email");
const $password = document.getElementById("password");
//Aqui hacemos un link en donde ingresamos a los emails y lo volvemos dinamicos 
const endPoint = "http://localhost:3000/users";

$loginForm.addEventListener("submit", (event) => {
    event.preventDefault()
    login();


});



async function login() {

    let response = await fetch(`${endPoint}?email=${$email.value}`);
    //Aqui le douy tiempo para que el .json se convierta a javascript
    let data = await response.json()

    console.log(data[0]);
    // Si el data regresa vacio entonces se le dice al usuario que se vaya a registrar.
    if (data.length == 0) {

        alert("Ese correo no existe, vaya y registrese");

        // console.log(data[0]);
    } else {
        // Se evalua que la password sea correcta para conderle acceso al usuario.
        if (data[0].password == $password.value) {

            //Usuario logueado y el valor de la llave
            localStorage.setItem("currentUser", JSON.stringify(data[0]))
            window.location.href="./dashboard.html";

            alert("login exitoso");

            // Implementen logica para guardar el usuario en el local storage.
            // la variable que se llame currentUser.

        } else {
            alert("Contraseña equivocada");


        }

    }

}