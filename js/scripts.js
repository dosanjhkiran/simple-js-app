// Array 
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
  for (let i = 0; i < pokemonList.length; i++) {
    let pokemon = pokemonList[i];
    let output = pokemon.name + " (height: " + pokemon.height + ")";
    if (pokemon.height > 6) {
      output += " - Wow, that’s big!";
    }
  
    document.write(output + "<br>");
  }