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
   
    // printArrayDetails function declaration
  function add(pokemon) {
      pokemonList.push(pokemon);
    }
  
    function getAll() {
      return pokemonList;
    }
  
    return {
      add: add,
      getAll: getAll
    };
  })();
  pokemonRepository.getAll().forEach(function(pokemon) {
    let ul = document.getElementById("pokemon-list");
    let li = document.createElement("li");
    li.textContent = `${pokemon.name} (Height: ${pokemon.height})`;
    ul.appendChild(li);
  });
  
  
  