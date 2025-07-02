const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "index.html";
}

/**
 * Récupère les informations de l'utilisateur connecté via l'API.
 * Affiche l'adresse email dans la page.
 *
 * @async
 * @function fetchUser
 * @throws {Error} En cas d'erreur d'authentification ou requête échouée.
 * @returns {Promise<void>}
 */
async function fetchUser() {
  try {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Non autorisé");
    const data = await res.json();
    document.getElementById("userEmail").textContent = data.email;
  } catch (error) {
    alert("Erreur d'authentification. Veuillez vous reconnecter.");
    logout();
  }
}

/**
 * Affiche la date et l'heure courante locale dans la page.
 *
 * @function displayCurrentDate
 * @returns {void}
 */
function displayCurrentDate() {
  const now = new Date();
  document.getElementById("serverDate").textContent = now.toLocaleString();
}

/**
 * Récupère les réservations via l'API et affiche uniquement
 * celles dont la date de fin est égale ou supérieure à aujourd'hui.
 *
 * @async
 * @function fetchReservations
 * @throws {Error} En cas d'erreur lors du chargement des réservations.
 * @returns {Promise<void>}
 */
async function fetchReservations() {
  try {
    const res = await fetch("http://localhost:8080/api/reservations", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
    const reservations = await res.json();

    const tbody = document.getElementById("reservationsTableBody");
    tbody.innerHTML = "";

    const today = new Date();

    // Filtrer les réservations en cours/futures
    const currentReservations = reservations.filter(
      (r) => new Date(r.endDate) >= today
    );

    if (currentReservations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center">Aucune réservation en cours.</td></tr>`;
      return;
    }

    currentReservations.forEach((r) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${r.catwayNumber}</td>
        <td>${r.clientName}</td>
        <td>${r.boatName}</td>
        <td>${new Date(r.startDate).toLocaleDateString()}</td>
        <td>${new Date(r.endDate).toLocaleDateString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Impossible de charger les réservations.");
  }
}

/**
 * Supprime le token stocké et redirige vers la page de login.
 *
 * @function logout
 * @returns {void}
 */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/**
 * Initialise le tableau de bord en affichant l'email,
 * la date actuelle, les réservations, et les liens utiles.
 *
 * @async
 * @function setupDashboard
 * @returns {Promise<void>}
 */
async function setupDashboard() {
  await fetchUser();
  displayCurrentDate();
  await fetchReservations();

  const list = document.getElementById("dashboardList");
  list.innerHTML = `
    <li class="list-group-item"><a href="catways.html">Gérer les catways</a></li>
    <li class="list-group-item"><a href="users.html">Gérer les utilisateurs</a></li>
    <li class="list-group-item"><a href="reservations.html">Gérer les réservations</a></li>
  `;
}

setupDashboard();
