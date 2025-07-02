/**
 * Vérifie la présence du token dans localStorage,
 * redirige vers la page d’accueil si absent.
 */
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

/** @type {HTMLFormElement} */
const form = document.getElementById("catwayForm");
const catwayIdInput = document.getElementById("catwayId");
const catwayNumberInput = document.getElementById("catwayNumber");
const catwayTypeInput = document.getElementById("catwayType");
const catwayStateInput = document.getElementById("catwayState");
const cancelEditBtn = document.getElementById("cancelEdit");
const list = document.getElementById("catwayList");

/**
 * Récupère la liste des catways depuis l'API,
 * affiche les cartes dans la page,
 * ajoute les événements pour modifier ou supprimer.
 *
 * @async
 */
async function fetchCatways() {
  try {
    const response = await fetch("http://localhost:8080/api/catways", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Erreur réseau ou authentification");

    const catways = await response.json();

    list.innerHTML = "";
    catways.forEach((catway) => {
      const card = document.createElement("div");
      card.className = "catway-card";

      card.innerHTML = `
                        <div class="catway-info">
                            <p><strong>Numéro :</strong> ${catway.catwayNumber}</p>
                            <p><strong>Type :</strong> ${catway.catwayType}</p>
                            <p><strong>État :</strong> ${catway.catwayState}</p>
                        </div>
                        <div class="catway-actions">
                            <button class="btn btn-warning btn-sm" 
                                    data-id="${catway._id}" 
                                    data-number="${catway.catwayNumber}" 
                                    data-type="${catway.catwayType}" 
                                    data-state="${catway.catwayState}">
                                Modifier
                            </button>
                            <button class="btn btn-danger btn-sm" data-id="${catway._id}">Supprimer</button>
                        </div>
                    `;
      list.appendChild(card);
    });

    // Ajouter les listeners sur les boutons Modifier
    list.querySelectorAll(".btn-warning").forEach((btn) => {
      btn.addEventListener("click", () => {
        catwayIdInput.value = btn.dataset.id;
        catwayNumberInput.value = btn.dataset.number;
        catwayTypeInput.value = btn.dataset.type;
        catwayStateInput.value = btn.dataset.state;
        cancelEditBtn.style.display = "inline-block";
      });
    });

    // Ajouter les listeners sur les boutons Supprimer
    list.querySelectorAll(".btn-danger").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Voulez-vous vraiment supprimer ce catway ?")) {
          await deleteCatway(btn.dataset.id);
        }
      });
    });
  } catch (error) {
    alert("Erreur de chargement : " + error.message);
    console.error(error);
  }
}

/**
 * Ajoute un nouveau catway via l’API.
 * Force l’état à "bon" à la création.
 *
 * @async
 * @param {Object} catwayData - Données du catway.
 * @param {number} catwayData.catwayNumber - Numéro unique.
 * @param {string} catwayData.catwayType - Type (short, long).
 * @throws {Error} En cas d’erreur API.
 */
async function addCatway(catwayData) {
  catwayData.catwayState = "bon";

  const res = await fetch("http://localhost:8080/api/catways", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(catwayData),
  });
  if (!res.ok) {
    const error = await res.json();
    alert("Erreur ajout: " + error.message);
    throw new Error(error.message);
  }
}

/**
 * Met à jour un catway existant via l’API.
 *
 * @async
 * @param {string} id - ID du catway.
 * @param {Object} updatedData - Données mises à jour.
 * @throws {Error} En cas d’erreur API.
 */
async function updateCatway(id, updatedData) {
  const res = await fetch(`http://localhost:8080/api/catways/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const error = await res.json();
    alert("Erreur mise à jour: " + error.message);
    throw new Error(error.message);
  }
}

/**
 * Supprime un catway via l’API.
 *
 * @async
 * @param {string} id - ID du catway.
 * @throws {Error} En cas d’erreur API.
 */
async function deleteCatway(id) {
  const res = await fetch(`http://localhost:8080/api/catways/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    alert("Erreur suppression: " + error.message);
    throw new Error(error.message);
  }
  alert("Catway supprimé");
  await fetchCatways();
}

// Gestion du formulaire ajout/modification
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = catwayIdInput.value;
  const catwayData = {
    catwayNumber: Number(catwayNumberInput.value),
    catwayType: catwayTypeInput.value.trim(),
    catwayState: catwayStateInput.value.trim(),
  };

  try {
    if (id) {
      await updateCatway(id, catwayData);
      alert("Catway modifié");
    } else {
      await addCatway(catwayData);
      alert("Catway ajouté");
    }
    form.reset();
    catwayIdInput.value = "";
    cancelEditBtn.style.display = "none";
    await fetchCatways();
  } catch (error) {
    // erreur déjà affichée dans add/update
  }
});

// Annuler la modification
cancelEditBtn.addEventListener("click", () => {
  form.reset();
  catwayIdInput.value = "";
  cancelEditBtn.style.display = "none";
});

// Chargement initial de la liste
fetchCatways();
