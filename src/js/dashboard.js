import '../css/dashboard.css';
import { alertError, alertSuccess } from './alerts';

// Logout logic
const $closeSection = document.getElementById("logout-btn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// I check if the user is logged in
if (!currentUser) {
  window.location.href = "../views/login.html";
}

const userRole = currentUser?.role || "user";

$closeSection.addEventListener('click', () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/index.html";
  console.log("Sesión cerrada");
});

// DOM Elements
const endPointAppointments = "http://localhost:3000/appointments";
const $petName = document.getElementById("petName");
const $ownerName = document.getElementById("ownerName");
const $phone = document.getElementById("phone");
const $date = document.getElementById("date");
const $time = document.getElementById("time");
const $notes = document.getElementById("notes");
const $form = document.getElementById("form");

let isEditing = false;
let editingId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const data = await getAppointment();
  showCards(data);

  // Disables the form if the user is not an administrator
 
    alertError("Solo los administradores pueden registrar o modificar citas.");

});

$form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (isEditing) {
    await updateAppointment(editingId);
  } else {
    await createAppointment();
  }

  const data = await getAppointment();
  showCards(data);

  $form.reset();
  isEditing = false;
  editingId = null;
});

// This is a function to create a new appointment
async function createAppointment() {
  const newAppointment = {
    namePet: $petName.value,
    namePerson: $ownerName.value,
    phone: $phone.value,
    date: $date.value,
    time: $time.value,
    description: $notes.value
  };

  try {
    const response = await fetch(endPointAppointments, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newAppointment)
    });

    // Here i check if the response is ok
    if (!response.ok) {
      alertError("Sorry, please try again later.");
      throw new Error(response.statusText);
    } else {
      alertSuccess("Scheduled appointment");
      return newAppointment;
    }

  } catch (error) {
    console.log(error.message);
  }
}

// Here we update an appointment
async function updateAppointment(id) {
  const updatedAppointment = {
    namePet: $petName.value,
    namePerson: $ownerName.value,
    phone: $phone.value,
    date: $date.value,
    time: $time.value,
    description: $notes.value
  };

  try {
    const response = await fetch(`${endPointAppointments}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedAppointment)
    });

    if (!response.ok) {
      alertError("Error updating the appointment");
      throw new Error(response.statusText);
    }

    alertSuccess("Appointment updated successfully");

  } catch (error) {
    console.log(error.message);
  }
}

// This function deletes an appointment
async function deleteAppointment(id) {
  try {
    const response = await fetch(`${endPointAppointments}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("The appointment could not be deleted.");
    }

    alertSuccess("The appointment has been successfully deleted");

    const citas = await getAppointment();
    showCards(citas);

  } catch (error) {
    alertError("There was a problem deleting the appointment.");
  }
}


// This function retrieves all appointments
async function getAppointment() {
  const response = await fetch(endPointAppointments);
  const data = await response.json();
  const appointmentsArray = Object.values(data);
  return appointmentsArray;
}



// This function displays the appointments in cards
function showCards(data) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  data.forEach(appointment => {
    const card = document.createElement("div");
    card.className = "box-father";

    // Solo muestra botones si el rol es admin
    const actionButtons = userRole === "admin" ? `
      <a href="#" class="btn edit-btn" data-id="${appointment.id}">Edit</a>
      <a href="#" class="btn delete-btn" data-id="${appointment.id}">Delete</a>
    ` : '';

    // Create the card with the appointment details
    card.innerHTML = `
      <div class="card-box">    
        <div class="card-body">
          <h5 class="card-title">Appointment</h5>
          <p class="card-text">User: ${appointment.namePerson}</p>
          <p class="card-text">Contact: ${appointment.phone}</p>
          <p class="card-text">Date: ${appointment.date}</p>
          <p class="card-text">Hour: ${appointment.time}</p>
          <p class="card-text">Notes: ${appointment.description}</p>
          <p class="card-text">Pet: ${appointment.namePet}</p>
          <div class="btn-box">
            ${actionButtons}
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Events only if the user is an administrator
  if (userRole === "admin") {
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = button.getAttribute("data-id");
        await deleteAppointment(id);
      });
    });

    document.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const id = button.getAttribute("data-id");
        const appointment = data.find(item => item.id == id);
        if (appointment) {
          $petName.value = appointment.namePet;
          $ownerName.value = appointment.namePerson;
          $phone.value = appointment.phone;
          $date.value = appointment.date;
          $time.value = appointment.time;
          $notes.value = appointment.description;

          isEditing = true;
          editingId = id;
          alertSuccess("Edit mode activated");
        }
      });
    });
  }
}
