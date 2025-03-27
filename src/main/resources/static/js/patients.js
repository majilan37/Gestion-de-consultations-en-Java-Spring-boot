const API_URL = "/patients";

// Fetch all patients and display in table
async function fetchPatients() {
  const response = await fetch(API_URL);
  const patientsTable = await response.json();

  const tableBody = document.getElementById("patientsTable");
  tableBody.innerHTML = ""; // Clear table before adding new data

  patientsTable.forEach((patient) => {
    tableBody.innerHTML += `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>
                    <a href="add-patient.html?id=${patient.id}" class="btn btn-warning btn-sm">Modifier</a>
                    <button onclick="deletePatient(${patient.id})" class="btn btn-danger btn-sm">Supprimer</button>
                </td>
            </tr>
        `;
  });
}

// Delete patient by ID
async function deletePatient(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchPatients(); // Refresh the list
  }
}

// Load patients on page load
document.addEventListener("DOMContentLoaded", fetchPatients);

// handle Add & edit doctor form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("patientForm");
  const patientId = new URLSearchParams(window.location.search).get("id");

  if (patientId) {
    document.getElementById("formTitle").innerText = "Modifier un Patient";
    fetchPatient(patientId);
  }

  form?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("patientName").value;
    const age = document.getElementById("patientAge").value;

    const patientData = { name, age };

    if (patientId) {
      await fetch(`${API_URL}/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });
    }

    window.location.href = "patients.html";
  });
});

// Fetch patient for edit
async function fetchPatient(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const patient = await response.json();
  document.getElementById("patientId").value = patient.id;
  document.getElementById("patientName").value = patient.name;
  document.getElementById("patientAge").value = patient.age;
}
