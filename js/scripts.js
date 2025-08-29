let pokemonRepository = (function () {
  const pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  const listEl = document.getElementById('pokemon-list');
  const modalTitleEl = document.getElementById('detailsModalLabel');
  const modalBodyEl = document.getElementById('detailsModalBody');

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  // Create one list item with a Details button
  function addListItem(pokemon) {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );

    const nameSpan = document.createElement('span');
    nameSpan.textContent = capitalize(pokemon.name);

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.textContent = 'Details';
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#detailsModal');

    // Accessibility
    button.setAttribute('aria-label', `Details for ${capitalize(pokemon.name)}`);

    button.addEventListener('click', async () => {
      // Prevent double-trigger while loading
      button.disabled = true;
      try {
        await showDetails(pokemon);
      } finally {
        button.disabled = false;
      }
    });

    li.appendChild(nameSpan);
    li.appendChild(button);
    listEl.appendChild(li);
  }

  // --- Data loading ---
  function loadList() {
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach((item) => {
          add({ name: item.name, detailsUrl: item.url });
        });
      })
      .catch((e) => console.error(e));
  }

  function loadDetails(pokemon) {
    // Simple cache: if already loaded, skip fetch
    if (pokemon.height && pokemon.types && pokemon.imageUrl) {
      return Promise.resolve();
    }

    return fetch(pokemon.detailsUrl)
      .then((response) => response.json())
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height; // decimeters
        pokemon.types = details.types.map((t) => t.type.name);
      })
      .catch((e) => console.error(e));
  }

  // --- UI helpers for modal ---

  function renderLoading(pokemon) {
    modalTitleEl.textContent = `Loading ${capitalize(pokemon.name)}…`;
    modalBodyEl.setAttribute('aria-busy', 'true');

    // Structure matches the final layout to avoid shifts
    modalBodyEl.innerHTML = `
      <div class="poke-grid">
        <div class="poke-art">
          <div class="spinner-border" role="status" aria-label="Loading"></div>
        </div>
        <div>
          <div class="skeleton skel-line" style="width: 60%"></div>
          <div class="skeleton skel-line" style="width: 40%"></div>
          <div class="skeleton skel-line" style="width: 80%"></div>
          <div class="skeleton skel-line" style="width: 50%"></div>
        </div>
      </div>
    `;
  }

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  }

  function renderDetails(pokemon, preloadedSrc) {
    const meters = (pokemon.height / 10).toFixed(1);
    modalTitleEl.textContent = capitalize(pokemon.name);

    const types = (pokemon.types && pokemon.types.length)
      ? pokemon.types.join(', ')
      : 'Unknown';

    modalBodyEl.innerHTML = `
      <div class="poke-grid">
        <div class="poke-art">
          ${
            preloadedSrc
              ? `<img src="${preloadedSrc}" alt="${capitalize(pokemon.name)} sprite" class="img-fluid rounded">`
              : `<div class="text-muted">No image</div>`
          }
        </div>
        <div>
          <p class="mb-1"><strong>Height:</strong> ${meters} m</p>
          <p class="mb-1"><strong>Types:</strong> ${types}</p>
        </div>
      </div>
    `;

    modalBodyEl.removeAttribute('aria-busy');
  }

  async function showDetails(pokemon) {
    // Show loading UI immediately (before network)
    renderLoading(pokemon);

    try {
      await loadDetails(pokemon);
      // Preload image so it doesn’t “pop in”
      const src = await preloadImage(pokemon.imageUrl).catch(() => null);
      renderDetails(pokemon, src);
    } catch (e) {
      console.error(e);
      modalTitleEl.textContent = 'Error loading details';
      modalBodyEl.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Could not load details. Please try again.
        </div>
      `;
      modalBodyEl.removeAttribute('aria-busy');
    }
  }

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  return { add, getAll, loadList, loadDetails, addListItem };
})();

// Init
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
