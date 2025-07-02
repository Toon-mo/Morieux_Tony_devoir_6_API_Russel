/**
 * Gestionnaire de la soumission du formulaire d'inscription.
 *
 * Récupère les valeurs du formulaire, nettoie les espaces inutiles,
 * envoie une requête POST à l'API d'enregistrement utilisateur,
 * affiche un message de succès et redirige vers la page de connexion,
 * ou affiche un message d'erreur en cas d'échec.
 */
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, firstname, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Inscription réussie, vous pouvez maintenant vous connecter.");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Erreur lors de l'inscription");
    }
  });
