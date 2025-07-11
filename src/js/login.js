const $loginForm = document.getElementById("login-form");
const $email = document.getElementById("email");
const $password = document.getElementById("password");
//Here we make a link where we enter the emails and make it dynamic.
const endPoint = "http://localhost:3000/users";

$loginForm.addEventListener("submit", (event) => {
    event.preventDefault()
    login();


});



async function login() {
console.log("Iniciando login")
    let response = await fetch(`${endPoint}?email=${$email.value}`);
    //Here I give you time to convert the .json to javascript
    let data = await response.json()
    console.log("Respuesta del login", response)

    console.log(data[0]);
    // If the data returns empty then the user is told to go and register.
    if (data.length == 0) {

        alert("Ese correo no existe, vaya y registrese");

        // console.log(data[0]);
    } else {
        // The password is evaluated to ensure it is correct in order to grant access to the user.
        if (data[0].password == $password.value) {

            //Logged in user and key value
            localStorage.setItem("currentUser", JSON.stringify(data[0]))
            window.location.href="/src/views/dashboard.html";
            console.log("Ingresado al localstorage")

            alert("login exitoso");

            // Implement logic to save the user to local storage.
            // the variable called currentUser.

        } else {
            alert("Contraseña equivocada");


        }

    }

}