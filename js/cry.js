export async function playCryFor(name, playCryBtn) {
    if (!name) return;
    const lower = name.toLowerCase();
    const candidates = [
        `https://play.pokemonshowdown.com/audio/cries/${lower}.mp3`,
        `https://play.pokemonshowdown.com/audio/cries/${lower}.ogg`
    ];

    if (playCryBtn) playCryBtn.disabled = true;
    for (const url of candidates) {
        try {
            const audio = new Audio(url);
            await audio.play();
            if (playCryBtn) playCryBtn.disabled = false;
            return;
        } catch (e) {
            console.error('Cry failed for', url, e);
        }
    }
    if (playCryBtn) playCryBtn.disabled = false;
    if (typeof Toastify !== 'undefined') {
        Toastify({ text: 'Cry no disponible para ' + name, duration: 3000, gravity: 'top', position: 'right', backgroundColor: '#FF675C' }).showToast();
    }
}
