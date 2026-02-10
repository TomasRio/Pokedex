let allPokemonNames = [];

export async function loadPokemonNames() {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=200000');
        const data = await res.json();
        allPokemonNames = data.results.map(r => r.name);
    } catch (e) {
        console.log('No se pudo cargar lista de nombres:', e);
    }
}

export function clearSuggestions(suggestionsEl) {
    if (suggestionsEl) {
        suggestionsEl.innerHTML = '';
        suggestionsEl.style.display = 'none';
        suggestionsEl.setAttribute('aria-hidden', 'true');
    }
}

export function showSuggestions(query, suggestionsEl, pokemonInput) {
    if (!suggestionsEl) return;
    const q = query.trim().toLowerCase();
    if (!q) { clearSuggestions(suggestionsEl); return; }
    const matches = allPokemonNames.filter(n => n.startsWith(q)).slice(0, 10);
    if (matches.length === 0) { clearSuggestions(suggestionsEl); return; }
    suggestionsEl.innerHTML = '';
    matches.forEach(name => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = name;
        item.dataset.name = name;
        item.addEventListener('mousedown', () => {
            pokemonInput.value = name;
            clearSuggestions(suggestionsEl);
        });
        suggestionsEl.appendChild(item);
    });
    suggestionsEl.style.display = 'block';
    suggestionsEl.setAttribute('aria-hidden', 'false');
}

export function getAllNames() { return allPokemonNames; }
