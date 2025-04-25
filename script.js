document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});

const btnSolicitar = document.getElementById("btnSolicitar");
const formularioTurno = document.getElementById("formularioTurno");
const contenidoPrincipal = document.getElementById("contenidoPrincipal");
const overlay = document.getElementById("overlay");
const btnCancelar = document.getElementById("btnCancelar");

btnSolicitar.addEventListener("click", () => {
  formularioTurno.style.display = "block";
  overlay.style.display = "block";
  contenidoPrincipal.classList.add("blur-background");
});

btnCancelar.addEventListener("click", () => {
  formularioTurno.style.display = "none";
  overlay.style.display = "none";
  contenidoPrincipal.classList.remove("blur-background");
});

document.getElementById("horaInicio").addEventListener("input", function () {
  const horaInicio = this.value;
  if (horaInicio) {
    const [h, m] = horaInicio.split(":".map(Number));
    const horaFin = new Date();
    horaFin.setHours(h);
    horaFin.setMinutes(m + 60);
    const finStr = horaFin.toTimeString().substring(0, 5);
    document.getElementById("horaFin").value = finStr;
  }
});

document
  .getElementById("turnoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const turno = {
      nombre: document.getElementById("nombreCliente").value,
      fecha: document.getElementById("fecha").value,
      horaInicio: document.getElementById("horaInicio").value,
      horaFin: document.getElementById("horaFin").value,
      servicio: document.getElementById("servicio").value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(turno),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al enviar el turno:", error);
      alert("No se pudo conectar con el servidor.");
    }

    this.reset();
    document.getElementById("horaFin").value = "";
    formularioTurno.style.display = "none";
    overlay.style.display = "none";
    contenidoPrincipal.classList.remove("blur-background");
  });
