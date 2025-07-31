let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: "Bulbasaur",
      height: 7,
      types: ["grass", "poison"]
    },
    {
      name: "Charmander",
      height: 6,
      types: ["fire"]
    },
    {
      name: "Squirtle",
      height: 5,
      types: ["water"]
    }
  ];

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }
  
  // Function to log Pokémon details
  function showDetails(pokemon) {
    console.log(pokemon);
  }

  // Function to create button and append to list

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

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem
  };
})();

pokemonRepository.getAll().forEach(function(pokemon) {
 pokemonRepository.addListItem(pokemon);
});
