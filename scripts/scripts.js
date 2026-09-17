const temasList = temas.tema;

const nameDisplay = 'Melania Pastor';
const HOME = 'assets/intro/inicio.html';
const DEFAULT_TITLE = 'Recursos de accesibilidad digital';

$(document).ready(function () {
  createMenu();
  initSPA();
    inicializarAcordeones();
});

$(document).on('click', 'a[data-param]', function (e) {
  e.preventDefault();

  const param = $(this).data('param');

  navigate(param);

  const parent = $(this)
    .closest('.dropdown')
    .find('.dropdown-toggle');

  if (parent.length) {
    parent.focus();
  }
});

window.addEventListener('popstate', function (e) {
  const param = e.state?.param
    || new URLSearchParams(window.location.search).get('param');

  navigate(param, { push: false });
});

function createMenu() {
  const menu = document.getElementById('menu-contenido');

  temasList.forEach((tema) => {
    const liTemas = document.createElement('li');

    liTemas.className = 'nav-item dropdown';

    const btn = document.createElement('button');

    btn.className = 'nav-link dropdown-toggle';
    btn.setAttribute('data-bs-toggle', 'dropdown');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = tema.tituloTema;

    const ul = document.createElement('ul');

    ul.className = 'dropdown-menu';

    tema.subtema.forEach((subtema) => {
      const liSub = document.createElement('li');
      const aSub = document.createElement('a');

      aSub.className = 'dropdown-item';
      aSub.href = `?param=${subtema.param}`;
      aSub.dataset.param = subtema.param;
      aSub.textContent = subtema.tituloSubtema;

      liSub.appendChild(aSub);
      ul.appendChild(liSub);
    });

    liTemas.appendChild(btn);
    liTemas.appendChild(ul);

    menu.appendChild(liTemas);
  });
}

function initSPA() {
  const initialParam = new URLSearchParams(window.location.search).get('param');

  navigate(initialParam, { push: false });
}

function navigate(param, options = {}) {
  const { push = true } = options;

  const route = resolveRoute(param);

  if (!route) {
    $('#content').html('Contenido no disponible');
    return;
  }

  loadContent(route.url, {
    push,
    title: route.title,
    state: param,
    url: param ? `?param=${param}` : location.pathname
  });
}

function loadContent(url, config) {
  $('#content').load(url, function (response, status) {
    if (status === 'error') {
      $('#content').html('Error al cargar el contenido');
      return;
    }

    updateActiveLink(config.state);

    document.title = config.title;

    if (config.push) {
      history.pushState(
        { param: config.state },
        '',
        config.url
      );
    }

    inicializarAcordeones();
  });
}

function findSubtema(param) {
  for (const tema of temasList) {
    const subtema = tema.subtema.find(
      (item) => item.param === param
    );

    if (subtema) {
      return subtema;
    }
  }

  return null;
}

function resolveRoute(param) {
  if (!param) {
    return {
      url: HOME,
      title: `${nameDisplay} | ${DEFAULT_TITLE}`
    };
  }

  const subtema = findSubtema(param);

  if (subtema) {
    return {
      url: subtema.url,
      title: `${subtema.tituloSubtema} | ${DEFAULT_TITLE}`
    };
  }

  if (param === 'sobremi') {
    return {
      url: 'assets/sobremi.html',
      title: `Sobre mí | ${DEFAULT_TITLE}`
    };
  }

  if (param === 'accesibilidad') {
    return {
      url: 'assets/accesibilidad.html',
      title: `Declaración de accesibilidad | ${DEFAULT_TITLE}`
    };
  }

  return null;
}

function updateActiveLink(param) {
  document.querySelectorAll('[data-param]').forEach((el) => {
    el.removeAttribute('aria-current');
  });

  const active = document.querySelector(
    `[data-param="${param}"]`
  );

  if (active) {
    active.setAttribute('aria-current', 'page');
  }
}

function inicializarAcordeones() {
  const acordeones = document.querySelectorAll('.accordion-btn');

  acordeones.forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const idContenido = button.getAttribute('aria-controls');
      const contenido = document.getElementById(idContenido);
      const icon = button.querySelector('.bi');

      if (!contenido) {
        return;
      }

      button.setAttribute('aria-expanded', !expanded);

      contenido.hidden = expanded;

      icon.classList.toggle('bi-caret-down', expanded);
      icon.classList.toggle('bi-caret-up', !expanded);
    });
  });
}