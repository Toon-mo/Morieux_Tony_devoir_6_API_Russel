/**
 * Gestionnaire de la soumission du formulaire de connexion.
 *
 * Récupère les valeurs email et mot de passe,
 * envoie une requête POST à l'API d'authentification,
 * stocke le token JWT en localStorage si succès,
 * redirige vers le dashboard,
 * sinon affiche un message d'erreur.
 */
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.message || "Erreur de connexion");
  }
});
