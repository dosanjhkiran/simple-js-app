let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  let modalContainer = document.querySelector('#modal-container');

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');

    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('pokemon-button');

    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);

    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
  }

  // --- Data loading ---
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(pokemon) {
    return fetch(pokemon.detailsUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height; 
        pokemon.types = details.types;   
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // UI
  function showDetails(pokemon) {
    
    loadDetails(pokemon).then(function () {
      const meters = (pokemon.height / 10).toFixed(1); 
      showModal(
        pokemon.name,
        `Height: ${meters} m`,
        pokemon.imageUrl
      );
    });
  }

  function showModal(title, text, imgUrl) {
    // clear any previous modal content
    modalContainer.innerHTML = '';


    let modal = document.createElement('div');
    modal.classList.add('modal');

    // Close button
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    // Title
    let titleElement = document.createElement('h1');
    titleElement.innerText = title;

    // Content
    let contentElement = document.createElement('p');
    contentElement.innerText = text;

    // Image (responsive)
    let imageElement = document.createElement('img');
    imageElement.src = imgUrl;
    imageElement.alt = `${title} sprite`;
    imageElement.classList.add('modal-img'); // CSS will make it responsive

    // build modal
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(contentElement);
    modal.appendChild(imageElement);
    modalContainer.appendChild(modal);

    // show modal
    modalContainer.classList.add('is-visible');

    closeButtonElement.focus();
  }

  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

  // Close on Esc
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });

  // Close on overlay click (only if click is on the container, not on modal)
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      hideModal();
    }
  });

  // Public API
  return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    addListItem: addListItem,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
