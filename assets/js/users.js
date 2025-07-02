/**
 * Récupère le token JWT dans le localStorage.
 * Si absent, redirige vers la page de connexion.
 */
const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

/**
 * Eléments DOM liés au formulaire utilisateur et à la liste des utilisateurs.
 */
const form = document.getElementById("userForm");
const userId = document.getElementById("userId");
const name = document.getElementById("name");
const firstname = document.getElementById("firstname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const cancelBtn = document.getElementById("cancelEdit");
const list = document.getElementById("userList");

/**
 * Récupère la liste des utilisateurs via l'API et affiche la liste.
 * En cas d'erreur, affiche un message d'alerte.
 * @async
 */
async function fetchUsers() {
  const res = await fetch("http://localhost:8080/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Erreur inconnue" }));
    alert("Erreur: " + err.message);
    return;
  }

  const users = await res.json();
  list.innerHTML = "";
  users.forEach((u) => {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
                    <div class="user-info">
                        <p><strong>Nom d'utilisateur :</strong> ${
                          u.firstname || ""
                        } ${u.name}</p>
                        <p><strong>Email :</strong> ${u.email}</p>
                    </div>
                    <div class="user-actions">
                        <button class="btn btn-warning btn-sm" onclick='editUser(${JSON.stringify(
                          u
                        )})'>Modifier</button>
                        <button class="btn btn-danger btn-sm" onclick='deleteUser("${
                          u._id
                        }")'>Supprimer</button>
                    </div>
                `;
    list.appendChild(card);
  });
}

/**
 * Soumet le formulaire pour créer ou mettre à jour un utilisateur.
 * Si userId est rempli, met à jour l'utilisateur, sinon crée un nouvel utilisateur.
 * @param {Event} e Evénement submit du formulaire.
 * @async
 */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: name.value,
    firstname: firstname.value,
    email: email.value,
    password: password.value,
  };

  if (userId.value) {
    await fetch(`http://localhost:8080/api/users/${userId.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } else {
    await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  form.reset();
  userId.value = "";
  cancelBtn.style.display = "none";
  fetchUsers();
});

/**
 * Remplit le formulaire avec les données de l'utilisateur pour édition.
 * Affiche le bouton Annuler.
 * @param {Object} user Objet utilisateur contenant _id, name, firstname, email.
 */
function editUser(user) {
  userId.value = user._id;
  name.value = user.name;
  firstname.value = user.firstname;
  email.value = user.email;
  password.value = "";
  cancelBtn.style.display = "inline-block";
}

/**
 * Réinitialise le formulaire et cache le bouton Annuler.
 */
cancelBtn.addEventListener("click", () => {
  form.reset();
  userId.value = "";
  cancelBtn.style.display = "none";
});

/**
 * Supprime un utilisateur après confirmation.
 * @param {string} id Identifiant MongoDB de l'utilisateur à supprimer.
 * @async
 */
async function deleteUser(id) {
  if (confirm("Supprimer cet utilisateur ?")) {
    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }
}

// Chargement initial de la liste des utilisateurs
fetchUsers();
