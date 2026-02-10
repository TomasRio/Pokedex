const pokeCard = document.querySelector('[data-poke-card]');
const pokeName = document.querySelector('[data-poke-name]');
const pokeImg = document.querySelector('[data-poke-img]');
const pokeImgContainer = document.querySelector('[data-poke-img-container]');
const pokeId = document.querySelector('[data-poke-id]');
const pokeTypes = document.querySelector('[data-poke-types]');
const pokeStats = document.querySelector('[data-poke-stats]');
const addToListBtn = document.querySelector('#addToListBtn');
const myListCards = document.querySelector('[data-my-list]');
const searchTypeSelect = document.querySelector('#searchType');
const pokemonInput = document.querySelector('#pokemonInput');

let miEquipo = [];
let currentPokemon = null;

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
};


const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target.pokemon;
    const { value: searchType } = event.target.searchType;
    
    if (!value.trim()) {
        renderNotFound();
        return;
    }
    
    const searchValue = searchType === 'id' ? value : value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`)
        .then(data => data.json())
        .then(response => renderPokemonData(response))
        .catch(err => renderNotFound());
}

const renderPokemonData = data => {
    const sprite =  data.sprites.front_default;
    const { stats, types } = data;

    pokeName.textContent = data.name;
    pokeImg.setAttribute('src', sprite);
    pokeId.textContent = `Nº ${data.id}`;
    setCardColor(types);
    renderPokemonTypes(types);
    renderPokemonStats(stats);
    currentPokemon = {
        id: data.id,
        nombre: data.name,
        imagen: sprite
    };
}


const setCardColor = types => {
    const colorOne = typeColors[types[0].type.name];
    const colorTwo = types[1] ? typeColors[types[1].type.name] : typeColors.default;
    pokeImg.style.background =  `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
    pokeImg.style.backgroundSize = ' 5px 5px';
}

const renderPokemonTypes = types => {
    pokeTypes.innerHTML = '';
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.color = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        pokeTypes.appendChild(typeTextElement);
    });
}

const renderPokemonStats = stats => {
    pokeStats.innerHTML = '';
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokeStats.appendChild(statElement);
    });
}

const renderNotFound = () => {
    pokeName.textContent = 'No encontrado';
    pokeImg.setAttribute('src', 'poke-shadow.png');
    pokeImg.style.background =  '#fff';
    pokeTypes.innerHTML = '';
    pokeStats.innerHTML = '';
    pokeId.textContent = '';
    currentPokemon = null;
}

const agregarAMiEquipo = (item) => {
    if (miEquipo.some(el => el.id === item.id)) {
        return;
    }
    
    if (miEquipo.length >= 6) {
        Toastify({
            text: "No puedes agregar más, elimina un pokémon",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF675C"
        }).showToast();
        return;
    }
    
    miEquipo.push(item);
    localStorage.setItem("miEquipo", JSON.stringify(miEquipo));
    renderMiEquipo();
    Toastify({
        text: `${item.nombre} agregado a tu equipo!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50"
    }).showToast();
}

const eliminarDelEquipo = (id) => {
    const pokemonEliminado = miEquipo.find(item => item.id === id);
    miEquipo = miEquipo.filter(item => item.id !== id);
    localStorage.setItem("miEquipo", JSON.stringify(miEquipo));
    renderMiEquipo();
    Toastify({
        text: `${pokemonEliminado.nombre} eliminado de tu equipo`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF675C"
    }).showToast();
}

const renderMiEquipo = () => {
    myListCards.innerHTML = "";

    if (miEquipo.length === 0) {
        myListCards.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>Tu equipo está vacío</p>";
        return;
    }

    miEquipo.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <h3>${item.nombre}</h3>
            <button class="remove">Quitar ✕</button>
        `;

        card.querySelector(".remove").addEventListener("click", () => eliminarDelEquipo(item.id));
        myListCards.appendChild(card);
    });
}

 const cargarMiEquipo = () => {
    const equipoSaved = localStorage.getItem("miEquipo");
    if (equipoSaved) {
        miEquipo = JSON.parse(equipoSaved);
        renderMiEquipo();
    }
}
addToListBtn.addEventListener("click", () => {
    if (currentPokemon) {
        agregarAMiEquipo(currentPokemon);
    } else {
        alert('Primero busca un Pokémon');
    }
});
cargarMiEquipo();

searchTypeSelect.addEventListener('change', () => {
    pokemonInput.value = '';
    actualizarValidacionInput();
});

pokemonInput.addEventListener('input', () => {
    actualizarValidacionInput();
});

const actualizarValidacionInput = () => {
    const searchType = searchTypeSelect.value;
    let valor = pokemonInput.value;
    
    if (searchType === 'name') {
        valor = valor.replace(/[0-9]/g, '');
        pokemonInput.placeholder = 'Nombre del Pokémon...';
    } else if (searchType === 'id') {
        valor = valor.replace(/[a-zA-Z]/g, '');
        pokemonInput.placeholder = 'ID del Pokémon...';
    }
    
    pokemonInput.value = valor;
};
cargarMiLista();
