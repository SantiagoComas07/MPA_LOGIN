
import '../css/dashboard.css';
import { alertError, alertSuccess } from './alerts';

// Logout logic
const $closeSection = document.getElementById("logout-btn");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "../views/login.html";
}

$closeSection.addEventListener('click', () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/index.html";
  console.log("Funciona")
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

    if (!response.ok) {
      alertError("Sorry, please try again later.");
      throw new Error(response.statusText);
    } else {
      alertSuccess("scheduled appointment");
      return newAppointment;
    }

  } catch (error) {
    console.log(error.message);
  }
}

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

async function deleteAppointment(id) {
  try {
    const response = await fetch(`${endPointAppointments}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("The appointment could not be deleted.");
    }

    alertSuccess("The quote has been successfully deleted");

    const citas = await getAppointment();
    showCards(citas);

  } catch (error) {
    alertError("Hubo un problema al eliminar");
  }
}

async function getAppointment() {
  const response = await fetch(endPointAppointments);
  const data = await response.json();
  const appointmentsArray = Object.values(data);
  return appointmentsArray;
}

function showCards(data) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  data.forEach(appointment => {
    const card = document.createElement("div");
    card.className = "box-father";

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
            <a href="#" class="btn edit-btn" data-id="${appointment.id}">Edit</a>
            <a href="#" class="btn delete-btn"  data-id="${appointment.id}">Delete</a>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

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


