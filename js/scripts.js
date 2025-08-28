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

    // ★ Accessibility requirement:
    button.setAttribute(
      'aria-label',
      `Details for ${capitalize(pokemon.name)}`
    );

    button.addEventListener('click', () => showDetails(pokemon));

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
    return fetch(pokemon.detailsUrl)
      .then((response) => response.json())
      .then((details) => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height; // decimeters
        pokemon.types = details.types.map((t) => t.type.name);
      })
      .catch((e) => console.error(e));
  }

  // UI: load details into the modal
  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      const meters = (pokemon.height / 10).toFixed(1);

      modalTitleEl.textContent = capitalize(pokemon.name);
      modalBodyEl.innerHTML = '';

      const img = document.createElement('img');
      img.src = pokemon.imageUrl || '';
      img.alt = `${capitalize(pokemon.name)} sprite`;
      img.classList.add('img-fluid', 'rounded', 'mb-3');

      const p1 = document.createElement('p');
      p1.textContent = `Height: ${meters} m`;

      const p2 = document.createElement('p');
      p2.textContent = `Types: ${pokemon.types.join(', ')}`;

      modalBodyEl.append(img, p1, p2);
    });
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
