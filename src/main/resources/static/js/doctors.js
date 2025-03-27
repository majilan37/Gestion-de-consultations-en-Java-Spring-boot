const API_URL = "/doctors";

// Fetch all doctors and display in table
async function fetchDoctors() {
  const response = await fetch(API_URL);
  const doctors = await response.json();

  const tableBody = document.getElementById("doctorsTable");
  if (!tableBody) return;
  tableBody.innerHTML = ""; // Clear table before adding new data

  doctors.forEach((doctor) => {
    tableBody.innerHTML += `
            <tr>
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>
                    <a href="add-doctor.html?id=${doctor.id}" class="btn btn-warning btn-sm">Modifier</a>
                    <button onclick="deleteDoctor(${doctor.id})" class="btn btn-danger btn-sm">Supprimer</button>
                </td>
            </tr>
        `;
  });
}

// Delete doctor by ID
async function deleteDoctor(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchDoctors(); // Refresh the list
  }
}

// Load doctors on page load
document.addEventListener("DOMContentLoaded", fetchDoctors);

// Add doctor form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("doctorForm");
  const doctorId = new URLSearchParams(window.location.search).get("id");

  if (doctorId) {
    document.getElementById("formTitle").innerText = "Modifier un Médecin";
    fetchDoctor(doctorId);
  }

  form?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("doctorName").value;
    const specialization = document.getElementById(
      "doctorSpecialization"
    ).value;

    const doctorData = { name, specialization };

    if (doctorId) {
      await fetch(`${API_URL}/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData),
      });
    }

    window.location.href = "index.html";
  });
});

// Fetch doctor for edit
async function fetchDoctor(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const doctor = await response.json();
  document.getElementById("doctorId").value = doctor.id;
  document.getElementById("doctorName").value = doctor.name;
  document.getElementById("doctorSpecialization").value = doctor.specialization;
}
