/* FitWeb Gym — SPA con localStorage (HTML/CSS/JS puro) */

const KEY = "fitweb_db_v2";
const SES = "fitweb_ses";

const sedes = ["FitWeb Norte", "FitWeb Central", "FitWeb Sur", "FitWeb Este"];

const defaultDb = {
  planes: [
    {
      id: 1,
      nombre: "Plan Básico",
      precio: 89,
      destacado: false,
      desc: "Ideal para empezar y mantenerte activo.",
      beneficios: [
        "Acceso a la sede elegida",
        "Zona de pesas y cardio",
        "Vestuarios y duchas",
        "Horario de 6:00 a 22:00",
        "App de seguimiento básica"
      ]
    },
    {
      id: 2,
      nombre: "Plan Pro",
      precio: 129,
      destacado: true,
      desc: "El más elegido. Entrenamiento completo.",
      beneficios: [
        "Todo lo del Plan Básico",
        "Acceso a todas las sedes",
        "Clases grupales ilimitadas",
        "1 evaluación antropométrica/mes",
        "Reserva prioritaria de servicios",
        "Invitado 2 veces al mes"
      ]
    },
    {
      id: 3,
      nombre: "Plan Elite",
      precio: 189,
      destacado: false,
      desc: "Máximo rendimiento y acompañamiento.",
      beneficios: [
        "Todo lo del Plan Pro",
        "2 sesiones de personal trainer/mes",
        "Plan nutricional orientativo",
        "Acceso 24/7 en sedes seleccionadas",
        "Toalla y locker prioritario",
        "Descuentos en tienda FitWeb"
      ]
    }
  ],
  servicios: [
    { id: 1, nombre: "Yoga", descripcion: "Clase grupal de yoga para todos los niveles", precio: 30 },
    { id: 2, nombre: "Spinning", descripcion: "Ciclismo indoor de alta intensidad", precio: 25 },
    { id: 3, nombre: "Entrenamiento personalizado", descripcion: "Sesión 1 a 1 con un coach certificado", precio: 60 },
    { id: 4, nombre: "Cross Training", descripcion: "Circuito funcional de fuerza y resistencia", precio: 35 },
    { id: 5, nombre: "Pilates", descripcion: "Control corporal y flexibilidad", precio: 28 }
  ],
  usuarios: [
    {
      id: 1,
      nombre: "Admin FitWeb",
      correo: "admin@fitweb.com",
      clave: "admin123",
      telefono: "900000000",
      rol: "ADMIN",
      planId: null,
      sede: null
    },
    {
      id: 2,
      nombre: "Demo Usuario",
      correo: "demo@fitweb.com",
      clave: "demo123",
      telefono: "912345678",
      rol: "USER",
      planId: 2,
      sede: "FitWeb Central"
    }
  ],
  reservas: []
};

function loadDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultDb);
    return JSON.parse(raw);
  } catch {
    return structuredClone(defaultDb);
  }
}

function saveDb() {
  localStorage.setItem(KEY, JSON.stringify(db));
}

let db = loadDb();

function nextId(arr) {
  return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1;
}

function sesion() {
  const id = +localStorage.getItem(SES);
  return db.usuarios.find((u) => u.id === id) || null;
}

function logout() {
  localStorage.removeItem(SES);
  location.hash = "#inicio";
  ruta();
  toast("Sesión cerrada");
}

function planById(id) {
  return db.planes.find((p) => p.id === +id);
}

function servicioById(id) {
  return db.servicios.find((s) => s.id === +id);
}

function toast(msg, tipo = "ok") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show " + tipo;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => (el.hidden = true), 250);
  }, 2800);
}

function aviso(msg, tipo = "err") {
  return `<div class="alert alert-${tipo}">${msg}</div>`;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ========== MENU ========== */
function menu() {
  const u = sesion();
  const hash = location.hash.slice(1).split("/")[0] || "inicio";
  const link = (h, label) =>
    `<a href="#${h}" class="${hash === h ? "active" : ""}">${label}</a>`;

  let html = `
    ${link("inicio", "Inicio")}
    ${link("planes", "Planes")}
    ${link("servicios", "Servicios")}
  `;

  if (u) {
    if (u.rol === "ADMIN") {
      html += `${link("admin-reservas", "Reservas")}
               ${link("admin-servicios", "Admin servicios")}`;
    } else {
      html += `${link("reservas", "Mis reservas")}
               ${link("perfil", "Mi perfil")}`;
    }
    html += `<button type="button" onclick="logout()">Salir (${esc(u.nombre.split(" ")[0])})</button>`;
  } else {
    html += `${link("login", "Iniciar sesión")}
             <a href="#registro" class="btn-nav">Sé miembro</a>`;
  }

  const nav = document.getElementById("menu");
  nav.innerHTML = html;
  nav.classList.remove("open");
}

document.getElementById("navToggle").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("open");
});

/* ========== VISTAS ========== */
const vistas = {
  inicio() {
    return `
      <section class="hero">
        <span class="hero-badge">🏋️ Nuevo · FitWeb 2026</span>
        <h1>Entrena a otro nivel</h1>
        <p>Gestiona tu plan, reserva clases y sigue tu progreso. Todo desde una sola plataforma simple y rápida.</p>
        <div class="hero-actions">
          <a href="#planes" class="btn btn-primary">Ver planes</a>
          <a href="#registro" class="btn btn-outline">Crear cuenta gratis</a>
        </div>
      </section>

      <section class="features">
        <div class="feature">
          <div class="feature-icon">📅</div>
          <h3>Reservas online</h3>
          <p>Agenda yoga, spinning o entrenamientos personalizados en segundos.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">📍</div>
          <h3>Varias sedes</h3>
          <p>Elige la sede que más te convenga: Norte, Central, Sur o Este.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">💎</div>
          <h3>Planes flexibles</h3>
          <p>Básico, Pro o Elite. Cambia cuando quieras según tus metas.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <h3>Sin complicaciones</h3>
          <p>Todo en el navegador. Tus datos se guardan de forma local y segura.</p>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2>Nuestros planes</h2>
            <p>Elige el que mejor se adapte a ti</p>
          </div>
          <a href="#planes" class="btn btn-ghost btn-sm">Ver todos →</a>
        </div>
        ${renderPlanes(true)}
      </section>
    `;
  },

  planes() {
    return `
      <section class="section">
        <div class="section-head">
          <div>
            <h2>Planes de membresía</h2>
            <p>Precios mensuales · Cancela cuando quieras · Acceso a sedes según plan</p>
          </div>
        </div>
        ${renderPlanes(false)}
        <p class="text-center mt-3" style="color:var(--mut);font-size:0.9rem">
          ¿Ya tienes cuenta? <a href="#login" class="text-acc">Inicia sesión</a> ·
          ¿Nuevo? <a href="#registro" class="text-acc">Regístrate ahora</a>
        </p>
      </section>
    `;
  },

  servicios() {
    const cards = db.servicios
      .map(
        (s) => `
      <div class="card">
        <h3>${esc(s.nombre)}</h3>
        <p>${esc(s.descripcion)}</p>
        <div class="price">S/ ${s.precio.toFixed(2)}</div>
        <p style="font-size:0.8rem;color:var(--mut)">por sesión</p>
      </div>`
      )
      .join("");

    return `
      <section class="section">
        <div class="section-head">
          <div>
            <h2>Servicios disponibles</h2>
            <p>Reserva clases y sesiones desde tu cuenta de miembro</p>
          </div>
        </div>
        <div class="grid">${cards}</div>
        ${
          sesion() && sesion().rol === "USER"
            ? `<p class="text-center mt-3"><a href="#reservas" class="btn btn-primary">Ir a mis reservas</a></p>`
            : `<p class="text-center mt-3" style="color:var(--mut)">Inicia sesión como miembro para reservar.</p>`
        }
      </section>
    `;
  },

  login(args, extra = "") {
    return `
      <div class="form-card">
        <h2>Iniciar sesión</h2>
        <p class="form-sub">Accede a tu cuenta FitWeb</p>
        ${extra}
        <form onsubmit="return doLogin(event)">
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <input class="form-control" id="correo" type="email" required placeholder="tu@correo.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="clave">Contraseña</label>
            <input class="form-control" id="clave" type="password" required placeholder="••••••••" autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary btn-block mt-1">Entrar</button>
        </form>
        <div class="form-footer">
          ¿No tienes cuenta? <a href="#registro">Regístrate</a><br>
          <small style="opacity:0.7">Demo: demo@fitweb.com / demo123 · Admin: admin@fitweb.com / admin123</small>
        </div>
      </div>
    `;
  },

  registro(args, extra = "") {
    const planOpts = db.planes
      .map((p) => `<option value="${p.id}">${esc(p.nombre)} — S/ ${p.precio}/mes</option>`)
      .join("");
    const sedeOpts = sedes.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join("");

    return `
      <div class="form-card" style="max-width:480px">
        <h2>Crear cuenta</h2>
        <p class="form-sub">Únete a FitWeb y elige tu plan</p>
        ${extra}
        <form onsubmit="return doRegistro(event)">
          <div class="form-group">
            <label for="nombre">Nombre completo</label>
            <input class="form-control" id="nombre" required placeholder="Tu nombre" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="correo">Correo electrónico</label>
            <input class="form-control" id="correo" type="email" required placeholder="tu@correo.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="clave">Contraseña</label>
            <input class="form-control" id="clave" type="password" required minlength="4" placeholder="Mínimo 4 caracteres">
          </div>
          <div class="form-group">
            <label for="tel">Teléfono</label>
            <input class="form-control" id="tel" type="tel" placeholder="987654321">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="plan">Plan</label>
              <select class="form-control" id="plan" required>${planOpts}</select>
            </div>
            <div class="form-group">
              <label for="sede">Sede</label>
              <select class="form-control" id="sede" required>${sedeOpts}</select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block mt-1">Inscribirme ahora</button>
        </form>
        <div class="form-footer">
          ¿Ya eres miembro? <a href="#login">Inicia sesión</a>
        </div>
      </div>
    `;
  },

  perfil() {
    const u = sesion();
    if (!u || u.rol !== "USER") return vistas.login([], aviso("Debes iniciar sesión como miembro."));
    const plan = planById(u.planId);
    const misReservas = db.reservas.filter((r) => r.usuarioId === u.id && r.estado === "ACTIVA");
    const iniciales = u.nombre
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    return `
      <section class="section">
        <div class="section-head">
          <div><h2>Mi perfil</h2><p>Tu información de miembro</p></div>
        </div>
        <div class="profile-box">
          <div class="avatar">${esc(iniciales)}</div>
          <div class="profile-meta">
            <h3>${esc(u.nombre)}</h3>
            <p>${esc(u.correo)} · ${esc(u.telefono || "Sin teléfono")}</p>
          </div>
          <div class="profile-stats">
            <div class="stat">
              <strong>${plan ? esc(plan.nombre) : "—"}</strong>
              <span>Plan actual</span>
            </div>
            <div class="stat">
              <strong>${esc(u.sede || "—")}</strong>
              <span>Sede</span>
            </div>
            <div class="stat">
              <strong>${misReservas.length}</strong>
              <span>Reservas activas</span>
            </div>
          </div>
        </div>
        ${
          plan
            ? `
          <div class="card" style="max-width:420px">
            <h3>Beneficios de tu plan</h3>
            <ul class="plan-list" style="margin-top:12px">
              ${plan.beneficios
                .map((b) => `<li><span class="check">✓</span> ${esc(b)}</li>`)
                .join("")}
            </ul>
          </div>`
            : ""
        }
        <p class="mt-2"><a href="#reservas" class="btn btn-primary">Ver mis reservas</a></p>
      </section>
    `;
  },

  reservas(args, extra = "") {
    const u = sesion();
    if (!u || u.rol !== "USER") return vistas.login([], aviso("Inicia sesión para gestionar reservas."));

    const servOpts = db.servicios
      .map((s) => `<option value="${s.id}">${esc(s.nombre)} (S/ ${s.precio})</option>`)
      .join("");

    const mis = db.reservas
      .filter((r) => r.usuarioId === u.id)
      .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

    const rows =
      mis.length === 0
        ? `<tr><td colspan="4"><div class="empty"><div class="empty-icon">📋</div>Aún no tienes reservas</div></td></tr>`
        : mis
            .map((r) => {
              const s = servicioById(r.servicioId);
              const fecha = new Date(r.fechaHora).toLocaleString("es-PE", {
                dateStyle: "medium",
                timeStyle: "short"
              });
              return `
            <tr>
              <td>${esc(s?.nombre || "—")}</td>
              <td>${fecha}</td>
              <td><span class="badge ${r.estado === "ACTIVA" ? "badge-ok" : "badge-cancel"}">${r.estado}</span></td>
              <td>
                ${
                  r.estado === "ACTIVA"
                    ? `<button class="btn btn-danger btn-sm" onclick="cancelarReserva(${r.id})">Cancelar</button>`
                    : "—"
                }
              </td>
            </tr>`;
            })
            .join("");

    return `
      <section class="section">
        <div class="section-head">
          <div><h2>Mis reservas</h2><p>Agenda y gestiona tus clases</p></div>
        </div>
        ${extra}
        <div class="card mb-2" style="max-width:480px">
          <h3 style="color:var(--txt);margin-bottom:14px">Nueva reserva</h3>
          <form onsubmit="return doReservar(event)">
            <div class="form-group">
              <label for="serv">Servicio</label>
              <select class="form-control" id="serv" required>${servOpts}</select>
            </div>
            <div class="form-group">
              <label for="fh">Fecha y hora</label>
              <input class="form-control" id="fh" type="datetime-local" required>
            </div>
            <button type="submit" class="btn btn-primary">Reservar</button>
          </form>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Servicio</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  },

  "admin-reservas"() {
    const u = sesion();
    if (!u || u.rol !== "ADMIN") return vistas.login([], aviso("Solo administradores."));

    const rows =
      db.reservas.length === 0
        ? `<tr><td colspan="5"><div class="empty"><div class="empty-icon">📋</div>No hay reservas</div></td></tr>`
        : [...db.reservas]
            .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
            .map((r) => {
              const user = db.usuarios.find((x) => x.id === r.usuarioId);
              const s = servicioById(r.servicioId);
              const fecha = new Date(r.fechaHora).toLocaleString("es-PE", {
                dateStyle: "medium",
                timeStyle: "short"
              });
              return `
            <tr>
              <td>${esc(user?.nombre || "—")}</td>
              <td>${esc(s?.nombre || "—")}</td>
              <td>${fecha}</td>
              <td><span class="badge ${r.estado === "ACTIVA" ? "badge-ok" : "badge-cancel"}">${r.estado}</span></td>
              <td>
                ${
                  r.estado === "ACTIVA"
                    ? `<button class="btn btn-danger btn-sm" onclick="cancelarReserva(${r.id})">Cancelar</button>`
                    : "—"
                }
              </td>
            </tr>`;
            })
            .join("");

    return `
      <section class="section">
        <div class="section-head">
          <div><h2>Todas las reservas</h2><p>Panel de administración</p></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Usuario</th><th>Servicio</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  },

  "admin-servicios"() {
    const u = sesion();
    if (!u || u.rol !== "ADMIN") return vistas.login([], aviso("Solo administradores."));

    const rows = db.servicios
      .map(
        (s) => `
      <tr>
        <td>${esc(s.nombre)}</td>
        <td>${esc(s.descripcion)}</td>
        <td>S/ ${s.precio.toFixed(2)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="editarServ(${s.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="borrarServ(${s.id})">Eliminar</button>
        </td>
      </tr>`
      )
      .join("");

    return `
      <section class="section">
        <div class="section-head">
          <div><h2>Administrar servicios</h2><p>Crear, editar o eliminar servicios</p></div>
        </div>
        <div class="card mb-2" style="max-width:480px">
          <h3 style="color:var(--txt);margin-bottom:14px" id="formTitle">Nuevo servicio</h3>
          <form onsubmit="return guardarServ(event)">
            <input type="hidden" id="sid" value="">
            <div class="form-group">
              <label for="sn">Nombre</label>
              <input class="form-control" id="sn" required>
            </div>
            <div class="form-group">
              <label for="sd">Descripción</label>
              <input class="form-control" id="sd" required>
            </div>
            <div class="form-group">
              <label for="sp">Precio (S/)</label>
              <input class="form-control" id="sp" type="number" min="0" step="0.01" required>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" class="btn btn-outline" onclick="limpiarFormServ()">Limpiar</button>
          </form>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th></th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
  }
};

function renderPlanes(compact) {
  return `
    <div class="plans-grid">
      ${db.planes
        .map((p) => {
          const featured = p.destacado ? "featured" : "";
          const badge = p.destacado ? `<span class="plan-badge">Más popular</span>` : "";
          const benefits = (compact ? p.beneficios.slice(0, 4) : p.beneficios)
            .map((b) => `<li><span class="check">✓</span> ${esc(b)}</li>`)
            .join("");
          return `
          <div class="plan-card ${featured}">
            ${badge}
            <div class="plan-name">${esc(p.nombre)}</div>
            <div class="plan-desc">${esc(p.desc)}</div>
            <div class="plan-price">S/ ${p.precio}<small></small></div>
            <div class="plan-period">por mes</div>
            <ul class="plan-list">${benefits}</ul>
            <a href="#registro" class="btn ${p.destacado ? "btn-primary" : "btn-outline"} btn-block">
              Elegir ${esc(p.nombre)}
            </a>
          </div>`;
        })
        .join("")}
    </div>
  `;
}

/* ========== ACCIONES ========== */
function doLogin(e) {
  e.preventDefault();
  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const clave = document.getElementById("clave").value;
  const u = db.usuarios.find((x) => x.correo === correo && x.clave === clave);
  if (!u) {
    document.getElementById("app").innerHTML = vistas.login([], aviso("Correo o contraseña incorrectos."));
    return false;
  }
  localStorage.setItem(SES, u.id);
  toast("¡Bienvenido, " + u.nombre.split(" ")[0] + "!");
  location.hash = u.rol === "ADMIN" ? "#admin-reservas" : "#reservas";
  ruta();
  return false;
}

function doRegistro(e) {
  e.preventDefault();
  const correo = document.getElementById("correo").value.trim().toLowerCase();
  if (db.usuarios.some((x) => x.correo === correo)) {
    document.getElementById("app").innerHTML = vistas.registro([], aviso("Ese correo ya está registrado."));
    return false;
  }
  const u = {
    id: nextId(db.usuarios),
    nombre: document.getElementById("nombre").value.trim(),
    correo,
    clave: document.getElementById("clave").value,
    telefono: document.getElementById("tel").value.trim(),
    rol: "USER",
    planId: +document.getElementById("plan").value,
    sede: document.getElementById("sede").value
  };
  db.usuarios.push(u);
  saveDb();
  localStorage.setItem(SES, u.id);
  toast("Cuenta creada. ¡Bienvenido!");
  location.hash = "#perfil";
  ruta();
  return false;
}

function doReservar(e) {
  e.preventDefault();
  const u = sesion();
  if (!u) return false;
  const fh = document.getElementById("fh").value;
  if (new Date(fh) < new Date()) {
    document.getElementById("app").innerHTML = vistas.reservas([], aviso("Elige una fecha y hora futuras."));
    return false;
  }
  db.reservas.push({
    id: nextId(db.reservas),
    usuarioId: u.id,
    servicioId: +document.getElementById("serv").value,
    fechaHora: fh,
    estado: "ACTIVA"
  });
  saveDb();
  toast("Reserva creada");
  document.getElementById("app").innerHTML = vistas.reservas([], aviso("Reserva creada correctamente.", "ok"));
  return false;
}

function cancelarReserva(id) {
  const r = db.reservas.find((x) => x.id === id);
  if (!r) return;
  if (!confirm("¿Cancelar esta reserva?")) return;
  r.estado = "CANCELADA";
  saveDb();
  toast("Reserva cancelada");
  ruta();
}

function guardarServ(e) {
  e.preventDefault();
  const id = +document.getElementById("sid").value || 0;
  const data = {
    nombre: document.getElementById("sn").value.trim(),
    descripcion: document.getElementById("sd").value.trim(),
    precio: +document.getElementById("sp").value
  };
  if (id) {
    Object.assign(db.servicios.find((s) => s.id === id), data);
    toast("Servicio actualizado");
  } else {
    db.servicios.push({ id: nextId(db.servicios), ...data });
    toast("Servicio creado");
  }
  saveDb();
  ruta();
  return false;
}

function editarServ(id) {
  const s = db.servicios.find((x) => x.id === id);
  if (!s) return;
  document.getElementById("sid").value = id;
  document.getElementById("sn").value = s.nombre;
  document.getElementById("sd").value = s.descripcion;
  document.getElementById("sp").value = s.precio;
  document.getElementById("formTitle").textContent = "Editar servicio";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormServ() {
  document.getElementById("sid").value = "";
  document.getElementById("sn").value = "";
  document.getElementById("sd").value = "";
  document.getElementById("sp").value = "";
  document.getElementById("formTitle").textContent = "Nuevo servicio";
}

function borrarServ(id) {
  if (db.reservas.some((r) => r.servicioId === id && r.estado === "ACTIVA")) {
    alert("No se puede eliminar: tiene reservas activas.");
    return;
  }
  if (!confirm("¿Eliminar este servicio?")) return;
  db.servicios = db.servicios.filter((s) => s.id !== id);
  saveDb();
  toast("Servicio eliminado");
  ruta();
}

/* ========== ROUTER ========== */
function ruta() {
  const [nombre] = (location.hash.slice(1) || "inicio").split("/");
  const view = vistas[nombre] || vistas.inicio;
  document.getElementById("app").innerHTML = view();
  menu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("hashchange", ruta);
saveDb();
ruta();
