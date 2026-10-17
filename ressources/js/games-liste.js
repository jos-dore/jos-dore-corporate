document.addEventListener("DOMContentLoaded", function () {
    if (!window.JOSDORE_GAMES) return;
    const jeux = window.JOSDORE_GAMES;
    const chiffresEl = document.getElementById("games-hero-chiffres");
    if (chiffresEl) {
        const total = Object.keys(jeux).length;
        const quiz = Object.values(jeux).filter(j => j.type === "quiz").length;
        const arcade = Object.values(jeux).filter(j => j.type === "arcade").length;
        const memoire = Object.values(jeux).filter(j => j.type === "memory").length;
        const english = Object.values(jeux).filter(j => j.type === "english").length;
        chiffresEl.innerHTML = `<div class="games-hero-chiffre"><div class="games-hero-chiffre-valeur">${total}</div><div class="games-hero-chiffre-label">Jeux au total</div></div><div class="games-hero-chiffre"><div class="games-hero-chiffre-valeur">${quiz}</div><div class="games-hero-chiffre-label">Quiz</div></div><div class="games-hero-chiffre"><div class="games-hero-chiffre-valeur">${arcade}</div><div class="games-hero-chiffre-label">Arcade</div></div><div class="games-hero-chiffre"><div class="games-hero-chiffre-valeur">${memoire}</div><div class="games-hero-chiffre-label">Mémoire</div></div><div class="games-hero-chiffre"><div class="games-hero-chiffre-valeur">${english}</div><div class="games-hero-chiffre-label">Anglais</div></div>`;
    }
    const categoriesEl = document.getElementById("games-categories");
    if (categoriesEl) {
        const categories = [{ id: "quiz", nom: "Quiz", icone: "fi fi-rr-question", desc: "Teste tes connaissances" }, { id: "arcade", nom: "Arcade", icone: "fi fi-rr-gamepad", desc: "Joue pour le fun" }, { id: "memoire", nom: "Mémoire", icone: "fi fi-rr-brain", desc: "Entraîne ta mémoire" }, { id: "calcul", nom: "Calcul", icone: "fi fi-rr-calculator", desc: "Calcul mental" }, { id: "langue", nom: "Langues", icone: "fi fi-rr-language", desc: "Anglais, français" }, { id: "culture", nom: "Culture", icone: "fi fi-rr-globe", desc: "Afrique & monde" }, { id: "english", nom: "English", icone: "fi fi-rr-comments", desc: "Jeux en anglais" }];
        categoriesEl.innerHTML = categories.map(c => { const nb = Object.values(jeux).filter(j => j.categorie === c.id || j.type === c.id).length; return `<div class="games-categorie" data-cat="${c.id}"><div class="games-categorie-icone"><i class="${c.icone}"></i></div><div class="games-categorie-info"><h3>${c.nom}</h3><p>${nb} jeu${nb > 1 ? 'x' : ''} • ${c.desc}</p></div></div>`; }).join("");
        categoriesEl.querySelectorAll(".games-categorie").forEach(cat => { cat.addEventListener("click", () => { const catId = cat.dataset.cat; const btn = document.querySelector(`.games-filtre[data-filtre="${catId}"]`); if (btn) { btn.click(); document.getElementById("jeux").scrollIntoView({ behavior: "smooth" }); } else { filtreActif = catId; afficherJeux(); document.getElementById("jeux").scrollIntoView({ behavior: "smooth" }); } }); });
    }
    const gridEl = document.getElementById("games-grid");
    const videEl = document.getElementById("games-vide");
    let filtreActif = "tous";
    let rechercheActive = "";
    function afficherJeux() {
        const jeuxFiltres = Object.entries(jeux).filter(([id, jeu]) => {
            if (filtreActif !== "tous") { if (filtreActif === "english") { if (jeu.type !== "english") return false; } else if (filtreActif === "facile" || filtreActif === "moyen" || filtreActif === "difficile") { if ((jeu.difficulte || "").toLowerCase() !== filtreActif) return false; } else { if (jeu.categorie !== filtreActif && jeu.type !== filtreActif) return false; } }
            if (rechercheActive) { const terme = rechercheActive.toLowerCase(); const matchTitre = (jeu.titre || "").toLowerCase().includes(terme); const matchDesc = (jeu.description || "").toLowerCase().includes(terme); const matchCat = (jeu.categorie || "").toLowerCase().includes(terme); const matchType = (jeu.type || "").toLowerCase().includes(terme); if (!matchTitre && !matchDesc && !matchCat && !matchType) return false; }
            return true;
        });
        if (jeuxFiltres.length === 0) { gridEl.innerHTML = ""; videEl.style.display = "block"; return; }
        videEl.style.display = "none";
        gridEl.innerHTML = jeuxFiltres.map(([id, jeu]) => { const catClass = (jeu.categorie || jeu.type || "quiz").toLowerCase(); const diffLabel = jeu.difficulte || "Tous niveaux"; return `<a href="/jeu.html?id=${id}" class="games-carte"><div class="games-carte-image ${catClass}"><i class="${jeu.icone || 'fi fi-rr-gamepad'}"></i></div><div class="games-carte-contenu"><div class="games-carte-meta"><span class="games-carte-tag">${jeu.categorie || jeu.type || "jeu"}</span><span class="games-carte-tag">${diffLabel}</span></div><h3>${jeu.titre}</h3><p class="games-carte-desc">${jeu.description || ""}</p><span class="games-carte-lien">Jouer <i class="fi fi-rr-arrow-right"></i></span></div></a>`; }).join("");
    }
    const filtres = document.querySelectorAll(".games-filtre");
    filtres.forEach(btn => { btn.addEventListener("click", () => { filtres.forEach(b => b.classList.remove("actif")); btn.classList.add("actif"); filtreActif = btn.dataset.filtre; afficherJeux(); }); });
    const recherche = document.getElementById("games-recherche");
    if (recherche) { recherche.addEventListener("input", (e) => { rechercheActive = e.target.value.trim(); afficherJeux(); }); }
    afficherJeux();
});