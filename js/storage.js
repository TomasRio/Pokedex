let miEquipo = [];

function showToast(text, bg = '#4CAF50') {
    if (typeof Toastify !== 'undefined') {
        Toastify({ text, duration: 3000, gravity: 'top', position: 'right', backgroundColor: bg }).showToast();
    } else {
        console.log(text);
    }
}

export function setupStorage(myListCards) {
    function renderMiEquipo() {
        myListCards.innerHTML = '';
        if (miEquipo.length === 0) {
            myListCards.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>Tu equipo está vacío</p>";
            return;
        }
        miEquipo.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <h3>${item.nombre}</h3>
                <button class="remove">Quitar ✕</button>
            `;
            card.querySelector('.remove').addEventListener('click', () => eliminarDelEquipo(item.id));
            myListCards.appendChild(card);
        });
    }

    function agregarAMiEquipo(item) {
        if (miEquipo.some(el => el.id === item.id)) return;
        if (miEquipo.length >= 6) {
            showToast('No puedes agregar más, elimina un pokémon', '#FF675C');
            return;
        }
        miEquipo.push(item);
        localStorage.setItem('miEquipo', JSON.stringify(miEquipo));
        renderMiEquipo();
        showToast(`${item.nombre} agregado a tu equipo!`, '#4CAF50');
    }

    function eliminarDelEquipo(id) {
        const pokemonEliminado = miEquipo.find(item => item.id === id);
        miEquipo = miEquipo.filter(item => item.id !== id);
        localStorage.setItem('miEquipo', JSON.stringify(miEquipo));
        renderMiEquipo();
        if (pokemonEliminado) showToast(`${pokemonEliminado.nombre} eliminado de tu equipo`, '#FF675C');
    }

    function cargarMiEquipo() {
        const equipoSaved = localStorage.getItem('miEquipo');
        if (equipoSaved) {
            miEquipo = JSON.parse(equipoSaved);
            renderMiEquipo();
        }
    }
    
    return { agregarAMiEquipo, eliminarDelEquipo, cargarMiEquipo, getMiEquipo: () => miEquipo };
}
