/**
 * Récupère le token JWT dans le localStorage.
 * Si absent, redirige vers la page de connexion.
 */
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

/**
 * Eléments du DOM pour le formulaire et la liste des réservations.
 */
const form = document.getElementById("reservationForm");
const reservationIdInput = document.getElementById("reservationId");
const clientNameInput = document.getElementById("clientName");
const boatNameInput = document.getElementById("boatName");
const catwayNumberInput = document.getElementById("catwayNumber");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const cancelEditBtn = document.getElementById("cancelEdit");
const list = document.getElementById("reservationList");

/**
 * Récupère la liste des réservations depuis l'API,
 * affiche chaque réservation dans la liste avec ses boutons Modifier et Supprimer.
 * @async
 * @throws {Error} En cas d'erreur réseau ou d'authentification.
 */
async function fetchReservations() {
  try {
    const response = await fetch("http://localhost:8080/api/reservations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Erreur réseau ou authentification");

    const reservations = await response.json();

    list.innerHTML = "";
    reservations.forEach((reservation) => {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);

      const card = document.createElement("div");
      card.className = "reservation-card";

      card.innerHTML = `
                        <div class="reservation-info">
                            <p><strong>Nom client :</strong> ${
                              reservation.clientName
                            }</p>
                            <p><strong>Bateau :</strong> ${
                              reservation.boatName
                            }</p>
                            <p><strong>Catway n° :</strong> ${
                              reservation.catwayNumber
                            }</p>
                            <p><strong>Période :</strong> du ${start.toLocaleDateString()} au ${end.toLocaleDateString()}</p>
                        </div>
                        <div class="reservation-actions">
                            <button class="btn btn-sm btn-warning btn-edit" data-id="${
                              reservation._id
                            }"
                                data-clientname="${
                                  reservation.clientName
                                }" data-boatname="${reservation.boatName}"
                                data-catwaynumber="${
                                  reservation.catwayNumber
                                }" data-startdate="${reservation.startDate}"
                                data-enddate="${
                                  reservation.endDate
                                }">Modifier</button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${
                              reservation._id
                            }">Supprimer</button>
                        </div>
                    `;
      list.appendChild(card);
    });

    // Écouteurs boutons Modifier
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        reservationIdInput.value = btn.dataset.id;
        clientNameInput.value = btn.dataset.clientname;
        boatNameInput.value = btn.dataset.boatname;
        catwayNumberInput.value = btn.dataset.catwaynumber;
        startDateInput.value = btn.dataset.startdate.slice(0, 10); // YYYY-MM-DD
        endDateInput.value = btn.dataset.enddate.slice(0, 10);
        cancelEditBtn.style.display = "inline-block";
      });
    });

    // Écouteurs boutons Supprimer
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
          await deleteReservation(btn.dataset.id);
        }
      });
    });
  } catch (error) {
    alert("Erreur de chargement : " + error.message);
    console.error(error);
  }
}

/**
 * Ajoute une nouvelle réservation via l'API.
 * @async
 * @param {Object} data Données de la réservation à créer.
 * @throws {Error} En cas d'erreur côté serveur ou validation.
 */
async function addReservation(data) {
  const res = await fetch("http://localhost:8080/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    alert("Erreur ajout : " + error.message);
    throw new Error(error.message);
  }
}

/**
 * Met à jour une réservation existante via l'API.
 * @async
 * @param {string} id Identifiant de la réservation.
 * @param {Object} data Données mises à jour.
 * @throws {Error} En cas d'erreur côté serveur ou validation.
 */
async function updateReservation(id, data) {
  const res = await fetch(`http://localhost:8080/api/reservations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    alert("Erreur mise à jour : " + error.message);
    throw new Error(error.message);
  }
}

/**
 * Supprime une réservation via l'API.
 * @async
 * @param {string} id Identifiant de la réservation à supprimer.
 * @throws {Error} En cas d'erreur serveur.
 */
async function deleteReservation(id) {
  const res = await fetch(`http://localhost:8080/api/reservations/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    alert("Erreur suppression : " + error.message);
    throw new Error(error.message);
  }
  alert("Réservation supprimée");
  await fetchReservations();
}

/**
 * Gestion de la soumission du formulaire.
 * Ajoute ou met à jour une réservation selon la présence d'un id.
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = reservationIdInput.value;
  const reservationData = {
    clientName: clientNameInput.value.trim(),
    boatName: boatNameInput.value.trim(),
    catwayNumber: Number(catwayNumberInput.value),
    startDate: startDateInput.value,
    endDate: endDateInput.value,
  };

  try {
    if (id) {
      await updateReservation(id, reservationData);
      alert("Réservation modifiée");
    } else {
      await addReservation(reservationData);
      alert("Réservation ajoutée");
    }
    form.reset();
    reservationIdInput.value = "";
    cancelEditBtn.style.display = "none";
    await fetchReservations();
  } catch (error) {
    // L'erreur est déjà affichée dans les fonctions add/update
  }
});

/**
 * Gestion du bouton Annuler édition.
 * Réinitialise le formulaire et cache le bouton.
 */
cancelEditBtn.addEventListener("click", () => {
  form.reset();
  reservationIdInput.value = "";
  cancelEditBtn.style.display = "none";
});

// Chargement initial des réservations
fetchReservations();
