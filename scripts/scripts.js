const temasList = temas.tema;

const nameDisplay = 'Melania Pastor';
const HOME = 'assets/intro/inicio.html';
const DEFAULT_TITLE = 'Recursos de accesibilidad digital';

$(document).ready(function () {
  addLogo();
  createMenu();
  initSPA();
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

function addLogo() {
  const logo = document.getElementById('logo');

  logo.innerHTML = '';

  const img = document.createElement('img');

  img.id = 'logoImg';
  img.src = '../img/melaniapastor-color.svg';
  img.alt = nameDisplay;
  img.width = 150;

  img.onload = () => logo.appendChild(img);

  img.onerror = () => {
    const p = document.createElement('p');

    p.textContent = nameDisplay;

    logo.appendChild(p);
  };
}

function createMenu() {
  const menu = document.getElementById('menu-contenido');

  temasList.forEach((tema) => {
    const liTemas = document.createElement('li');

    liTemas.className = 'nav-item dropdown col-2 p-0';

    const btn = document.createElement('button');

    btn.className = 'nav-link dropdown-toggle w-100';
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

  const subtema = findSubtema(param);

  loadContent(route, {
    push,
    title: subtema
      ? `${subtema.tituloSubtema} | ${DEFAULT_TITLE}`
      : DEFAULT_TITLE,
    state: param,
    url: `?param=${param}`
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