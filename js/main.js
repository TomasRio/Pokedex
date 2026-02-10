import { pokeCard, pokeName, pokeImg, pokeImgContainer, pokeId, pokeTypes, pokeStats, addToListBtn, myListCards, playCryBtn, searchTypeSelect, pokemonInput, suggestionsEl } from './selectors.js';
import { setCardColor, renderPokemonTypes, renderPokemonStats, renderNotFound } from './helpers.js';
import { setupStorage } from './storage.js';
import { loadPokemonNames, showSuggestions, clearSuggestions, getAllNames } from './autocomplete.js';
import { playCryFor } from './cry.js';

let currentPokemon = null;

const storage = setupStorage(myListCards);

export async function searchPokemon(event) {
    event.preventDefault();
    const { value } = event.target.pokemon;
    const { value: searchType } = event.target.searchType;
    if (!value.trim()) {
        renderNotFound(pokeName, pokeImg, pokeTypes, pokeStats, pokeId);
        return;
    }
    const searchValue = searchType === 'id' ? value : value.toLowerCase();
    try {
        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`).then(r => r.json());
        const sprite = data.sprites.front_default;
        const { stats, types } = data;
        pokeName.textContent = data.name;
        pokeImg.setAttribute('src', sprite);
        pokeId.textContent = `Nº ${data.id}`;
        setCardColor(types, pokeImg);
        renderPokemonTypes(types, pokeTypes);
        renderPokemonStats(stats, pokeStats);
        currentPokemon = { id: data.id, nombre: data.name, imagen: sprite };
    } catch (e) {
        renderNotFound(pokeName, pokeImg, pokeTypes, pokeStats, pokeId);
    }
}
window.searchPokemon = searchPokemon;

if (addToListBtn) {
    addToListBtn.addEventListener('click', () => {
        if (currentPokemon) {
            storage.agregarAMiEquipo(currentPokemon);
        } else {
            if (typeof Toastify !== 'undefined') {
                Toastify({ text: 'Primero busca un Pokémon', duration: 2000, gravity: 'top', position: 'right', backgroundColor: '#FF675C' }).showToast();
            }
        }
    });
}

if (playCryBtn) {
    playCryBtn.addEventListener('click', () => {
        if (!currentPokemon) {
            if (typeof Toastify !== 'undefined') Toastify({ text: 'Busca un Pokémon primero', duration: 2000, gravity: 'top', position: 'right', backgroundColor: '#FF675C' }).showToast();
            return;
        }
        playCryFor(currentPokemon.nombre, playCryBtn);
    });
}

let suggestionIndex = -1;
function actualizarValidacionInput() {
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
}

pokemonInput.addEventListener('keydown', (e) => {
    if (!suggestionsEl || suggestionsEl.style.display === 'none') return;
    const items = Array.from(suggestionsEl.querySelectorAll('.suggestion-item'));
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        suggestionIndex = Math.min(items.length - 1, suggestionIndex + 1);
        items.forEach(i => i.classList.remove('selected'));
        if (items[suggestionIndex]) items[suggestionIndex].classList.add('selected');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        suggestionIndex = Math.max(0, suggestionIndex - 1);
        items.forEach(i => i.classList.remove('selected'));
        if (items[suggestionIndex]) items[suggestionIndex].classList.add('selected');
    } else if (e.key === 'Enter') {
        if (suggestionIndex >= 0 && items[suggestionIndex]) {
            e.preventDefault();
            pokemonInput.value = items[suggestionIndex].dataset.name;
            clearSuggestions(suggestionsEl);
        }
    } else if (e.key === 'Escape') {
        clearSuggestions(suggestionsEl);
    }
});

pokemonInput.addEventListener('input', () => {
    actualizarValidacionInput();
    if (searchTypeSelect.value === 'name') {
        showSuggestions(pokemonInput.value, suggestionsEl, pokemonInput);
    } else {
        clearSuggestions(suggestionsEl);
    }
});

document.addEventListener('click', (e) => {
    if (!suggestionsEl) return;
    if (!e.target.closest('.input-wrap')) {
        clearSuggestions(suggestionsEl);
    }
});

searchTypeSelect.addEventListener('change', () => {
    pokemonInput.value = '';
    actualizarValidacionInput();
    clearSuggestions(suggestionsEl);
});

loadPokemonNames();
storage.cargarMiEquipo();
