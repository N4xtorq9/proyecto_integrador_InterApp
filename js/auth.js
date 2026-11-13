import { getUsers, saveUsers, setSession, uid } from "./storage.js";
import redirectAlert from "./alert.js";
const error = document.getElementById("formError");
const register = document.getElementById("registerForm");
const login = document.getElementById("loginForm");
if (register)
  register.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    if (!name || !email || password.length < 6) {
      error.textContent =
        "Revisa los campos obligatorios. La contraseña debe tener al menos 6 caracteres.";
      return;
    }
    if (password !== confirm) {
      error.textContent = "Las contraseñas no coinciden.";
      return;
    }
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      error.textContent = "Ya existe una cuenta con ese correo.";
      return;
    }
    // DEMO ONLY: contraseñas en texto plano no son apropiadas para producción.
    const user = { id: uid(), name, email, password };
    users.push(user);
    saveUsers(users);
    setSession({ userId: user.id });
    location.href = "dashboard.html";
  });
if (login)
  login.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const user = getUsers().find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      error.textContent =
        "Correo o contraseña incorrectos. Verifica tus datos o crea una cuenta.";
      return;
    }
    setSession({ userId: user.id });
    location.href = "dashboard.html";
  });
