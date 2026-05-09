let temasList = temas['tema'];

const nameDisplay = 'Melania Pastor';
const HOME = 'assets/intro/bienvenida.html';

$(document).ready(function () {
  addLogo();
  createMenu();
  initSPA();
});

$(document).on('click', 'a[data-param]', function (e) {
  e.preventDefault();

  const param = $(this).data('param');

  navigate(param);
});

window.addEventListener('popstate', function (e) {
  const param = e.state?.param
    || new URLSearchParams(window.location.search).get('param');

  navigate(param, { push: false });
});

function getParamFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('param');
}

function addLogo() {
  let logo = document.getElementById('logo');
  logo.innerHTML = '';

  let img = document.createElement('img');
  img.id = 'logoImg';
  img.src = '../img/melaniapastor-color.svg';
  img.alt = 'Melania Pastor';
  img.width = '150';

  img.onload = () => {
    logo.appendChild(img);
  };

  img.onerror = () => {
    const p = document.createElement('p');
    p.textContent = nameDisplay;
    logo.appendChild(p);
  };
}

function createMenu() {
  let menu = document.getElementById('menu-contenido');

  temas.tema.forEach((tema) => {
    let liTemas = document.createElement('li');
    liTemas.className = 'nav-item dropdown col-2 p-0 ';

    let btn = document.createElement('button');
    btn.className = 'nav-link dropdown-toggle w-100';
    btn.setAttribute('data-bs-toggle', 'dropdown');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = tema.tituloTema;

    liTemas.appendChild(btn);

    let ul = document.createElement('ul');
    ul.className = 'dropdown-menu';

    tema.subtema.forEach(subtema => {
      let liSub = document.createElement('li');

      let aSub = document.createElement('a');
      aSub.className = 'dropdown-item';

      aSub.setAttribute('href', '?param=' + subtema.param);
      aSub.setAttribute('data-param', subtema.param);

      aSub.textContent = subtema.tituloSubtema;

      liSub.appendChild(aSub);
      ul.appendChild(liSub);
    });

    liTemas.appendChild(ul);
    menu.appendChild(liTemas);
  });
}

function initSPA() {
  const initialParam = new URLSearchParams(window.location.search).get('param');
  navigate(initialParam, { push: false });
}

function handleLinkClick(event) {
  const link = $(this);
  const param = link.data('param');

  // Si no tiene data-param, no es enlace SPA
  if (!param) return;

  event.preventDefault();
  navigate(param);

  // opcional: foco si viene de dropdown
  const parent = link.closest('.dropdown').find('.dropdown-toggle');
  if (parent.length) parent.focus();
}

function navigate(param, options = {}) {
  const { push = true } = options;

  if (!param) {
    const url = HOME;

    $('#content').load(url, function (response, status) {
      if (status === 'error') {
        $('#content').html('Error al cargar el contenido');
        return;
      }

      updateActiveLink(null);

      if (push) {
        history.pushState({ param: null }, '', location.pathname);
      }

      document.title = 'Bienvenida | Espacio de Melania Pastor';
    });

    return;
  }

  let subtema = null;

  for (const tema of temas.tema) {
    subtema = tema.subtema.find(s => s.param === param);
    if (subtema) break;
  }

  if (!subtema) {
    $('#content').html('Contenido no disponible');
    return;
  }

  $('#content').load(url, function (response, status) {
    if (status === 'error') {
      $('#content').html('Error al cargar el contenido');
      return;
    }

    updateActiveLink(param);

    if (push) {
      history.pushState({ param }, '', '?param=' + param);
    }

    document.title = `${subtema.tituloSubtema} | Espacio de Melania Pastor`;
  });
}
function navigate(param, options = {}) {
  const { push = true } = options;

  // HOME
  if (!param) {
    $('#content').load(HOME, function (response, status) {
      if (status === 'error') {
        $('#content').html('Error al cargar el contenido');
        return;
      }

      updateActiveLink(null);

      if (push) {
        history.pushState({ param: null }, '', location.pathname);
      }

      document.title = 'Bienvenida | Espacio de Melania Pastor';
    });

    return;
  }

  // BUSCAR EN JSON SIN FUNCIONES EXTRA
  let subtema = null;

  for (const tema of temas.tema) {
    subtema = tema.subtema.find(s => s.param === param);
    if (subtema) break;
  }

  if (!subtema) {
    $('#content').html('Contenido no disponible');
    return;
  }

  $('#content').load(subtema.url, function (response, status) {
    if (status === 'error') {
      $('#content').html('Error al cargar el contenido');
      return;
    }

    updateActiveLink(param);

    if (push) {
      history.pushState({ param }, '', '?param=' + param);
    }

    document.title = `${subtema.tituloSubtema} | Espacio de Melania Pastor`;
  });
}

function updateActiveLink(param) {
  document.querySelectorAll('[data-param]').forEach(el => {
    el.removeAttribute('aria-current');
  });

  const active = document.querySelector(`[data-param="${param}"]`);
  if (active) {
    active.setAttribute('aria-current', 'page');
  }
}

function resolveRoute(param) {
  for (const tema of temas.tema) {
    for (const subtema of tema.subtema) {
      if (subtema.param === param) {
        return subtema.url;
      }
    }
  }

  if (param === 'sobremi') {
    return 'assets/sobremi.html';
  }

  return null;
}
