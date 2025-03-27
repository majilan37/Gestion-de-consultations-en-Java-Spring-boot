const API_URL = "/consultations";
const DOCTORS_API_URL = "/doctors";
const PATIENTS_API_URL = "/patients";

// Fetch and display consultations
async function fetchConsultations() {
  const response = await fetch(API_URL);
  const consultations = await response.json();

  const tableBody = document.getElementById("consultationsTable");
  tableBody.innerHTML = ""; // Clear table before adding new data

  consultations.forEach((consultation) => {
    tableBody.innerHTML += `
            <tr>
                <td>${consultation.id}</td>
                <td>${consultation.doctor.name}</td>
                <td>${consultation.patient.name}</td>
                <td>${new Date(
                  consultation.consultationDate
                ).toLocaleString()}</td>
                <td>${consultation.notes}</td>
                <td>
                    <a href="add-consultation.html?id=${
                      consultation.id
                    }" class="btn btn-warning btn-sm">Modifier</a>
                    <button onclick="deleteConsultation(${
                      consultation.id
                    })" class="btn btn-danger btn-sm">Supprimer</button>
                </td>
            </tr>
        `;
  });
}

// Delete a consultation
async function deleteConsultation(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette consultation ?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchConsultations(); // Refresh the list
  }
}

// Fetch doctors & patients for the dropdown lists
async function loadDoctorsAndPatients() {
  const doctorSelect = document.getElementById("doctorId");
  const patientSelect = document.getElementById("patientId");

  const doctors = await (await fetch(DOCTORS_API_URL)).json();
  const patients = await (await fetch(PATIENTS_API_URL)).json();

  doctors.forEach((doctor) => {
    doctorSelect.innerHTML += `<option value="${doctor.id}">${doctor.name}</option>`;
  });

  patients.forEach((patient) => {
    patientSelect.innerHTML += `<option value="${patient.id}">${patient.name}</option>`;
  });
}

// Handle consultation form (Add / Edit)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("consultationForm");
  if (!form) return;

  const consultationId = new URLSearchParams(window.location.search).get("id");

  // Load doctors and patients when the form is opened
  loadDoctorsAndPatients().then(() => {
    if (consultationId) {
      document.getElementById("formTitle").innerText =
        "Modifier une Consultation";
      fetchConsultation(consultationId);
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const doctorId = document.getElementById("doctorId").value;
    const patientId = document.getElementById("patientId").value;
    const date = document.getElementById("consultationDate").value;
    const notes = document.getElementById("notes").value;

    const consultationData = {
      doctor: { id: doctorId },
      patient: { id: patientId },
      consultationDate: date,
      notes,
    };

    if (consultationId) {
      await fetch(`${API_URL}/${consultationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultationData),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultationData),
      });
    }

    window.location.href = "consultations.html";
  });
});

// Fetch a consultation for editing
async function fetchConsultation(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const consultation = await response.json();
  document.getElementById("consultationId").value = consultation.id;
  document.getElementById("doctorId").value = consultation.doctor.id;
  document.getElementById("patientId").value = consultation.patient.id;
  document.getElementById("notes").value = consultation.notes;
  document.getElementById("consultationDate").value =
    consultation.consultationDate.replace(" ", "T");
}

// Load consultations on page load
document.addEventListener("DOMContentLoaded", fetchConsultations);
