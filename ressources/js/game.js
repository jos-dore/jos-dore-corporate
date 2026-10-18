document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const jeuId = params.get("id");
    const jeu = window.JOSDORE_GAMES[jeuId];
    if (!jeuId || !jeu) { afficherErreur(); return; }

    let questionIndex = 0;
    let score = 0;
    let reponseDonnee = false;

    document.title = jeu.titre + " — JosDore Games";
    document.getElementById("game-breadcrumb-nom").textContent = jeu.titre;
    document.getElementById("game-icone").innerHTML = `<i class="${jeu.icone || 'fi fi-rr-gamepad'}"></i>`;
    document.getElementById("game-icone").style.background = jeu.couleur || "#6C5CE7";
    document.getElementById("game-titre").textContent = jeu.titre;
    document.getElementById("game-sous-titre").textContent = jeu.sousTitre || "";
    document.getElementById("game-categorie").textContent = jeu.categorie || "Jeu";
    document.getElementById("game-difficulte").textContent = jeu.difficulte || "—";
    document.getElementById("game-duree").textContent = jeu.duree || "—";
    document.getElementById("game-joueurs").textContent = (jeu.joueurs || 0).toLocaleString("fr-FR");

    if (jeu.type !== "quiz") {
        document.getElementById("game-presentation").style.display = "none";
        document.getElementById("game-demarrer-wrapper").style.display = "none";
        document.getElementById("game-type-non-supporte").style.display = "block";
        document.getElementById("game-type-nom").textContent = jeu.type;
        afficherAutresJeux();
        return;
    }

    document.getElementById("game-description").textContent = jeu.description || "";
    document.getElementById("game-regles").textContent = jeu.regles || "";

    document.getElementById("game-btn-demarrer").addEventListener("click", function () {
        document.getElementById("game-presentation").style.display = "none";
        document.getElementById("game-demarrer-wrapper").style.display = "none";
        document.getElementById("game-quiz").classList.add("actif");
        afficherQuestion();
    });

    document.getElementById("game-btn-rejouer").addEventListener("click", function () {
        document.getElementById("game-resultats").classList.remove("actif");
        document.getElementById("game-quiz").classList.add("actif");
        questionIndex = 0; score = 0; afficherQuestion();
    });

    document.getElementById("game-btn-suivant").addEventListener("click", function () {
        questionIndex++;
        if (questionIndex < jeu.questions.length) afficherQuestion(); else afficherResultats();
    });

    function afficherQuestion() {
        const q = jeu.questions[questionIndex];
        reponseDonnee = false;
        document.getElementById("game-progression-texte").textContent = `Question ${questionIndex + 1} / ${jeu.questions.length}`;
        document.getElementById("game-progression-barre").style.width = ((questionIndex) / jeu.questions.length * 100) + "%";
        document.getElementById("game-question-num").textContent = `Question ${questionIndex + 1}`;
        document.getElementById("game-question-texte").textContent = q.question;
        const lettres = ["A", "B", "C", "D", "E", "F"];
        const choixList = document.getElementById("game-choix-list");
        choixList.innerHTML = q.choix.map((choix, i) => `<button class="game-choix" data-index="${i}"><span class="game-choix-lettre">${lettres[i]}</span><span>${choix}</span></button>`).join("");
        document.getElementById("game-feedback").className = "game-feedback";
        document.getElementById("game-feedback").innerHTML = "";
        document.getElementById("game-btn-suivant").classList.remove("actif");
        document.querySelectorAll(".game-choix").forEach(btn => {
            btn.addEventListener("click", function () {
                if (reponseDonnee) return;
                reponseDonnee = true;
                const indexChoisi = parseInt(this.dataset.index);
                document.querySelectorAll(".game-choix").forEach(b => b.disabled = true);
                document.querySelector(`.game-choix[data-index="${q.reponse}"]`).classList.add("correct");
                if (indexChoisi === q.reponse) {
                    score++;
                    document.getElementById("game-feedback").className = "game-feedback correct";
                    document.getElementById("game-feedback").innerHTML = `<i class="fi fi-rr-check-circle"></i> Bonne réponse !`;
                } else {
                    this.classList.add("incorrect");
                    document.getElementById("game-feedback").className = "game-feedback incorrect";
                    document.getElementById("game-feedback").innerHTML = `<i class="fi fi-rr-cross-circle"></i> Mauvaise réponse. C'était : <strong>${q.choix[q.reponse]}</strong>`;
                }
                document.getElementById("game-progression-barre").style.width = ((questionIndex + 1) / jeu.questions.length * 100) + "%";
                document.getElementById("game-btn-suivant").classList.add("actif");
                document.getElementById("game-btn-suivant").innerHTML = (questionIndex === jeu.questions.length - 1) ? `Voir résultats <i class="fi fi-rr-trophy"></i>` : `Question suivante <i class="fi fi-rr-arrow-right"></i>`;
            });
        });
    }

    function afficherResultats() {
        document.getElementById("game-quiz").classList.remove("actif");
        document.getElementById("game-resultats").classList.add("actif");
        const total = jeu.questions.length;
        const pourcent = Math.round((score / total) * 100);
        document.getElementById("game-score-valeur").textContent = `${score}/${total}`;
        document.getElementById("game-pourcent").textContent = `${pourcent}%`;
        let medaille = pourcent >= 90 ? "🏆" : pourcent >= 70 ? "🥇" : pourcent >= 50 ? "🥈" : "📚";
        document.getElementById("game-medaille").textContent = medaille;
        document.getElementById("game-resultat-titre").textContent = pourcent >= 70 ? "Excellent !" : "Continue tes efforts !";
        document.getElementById("game-resultat-message").textContent = "Rejoue pour t'améliorer.";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function afficherAutresJeux() {
        const autres = Object.keys(window.JOSDORE_GAMES).filter(id => id !== jeuId);
        document.getElementById("game-autres-grid").innerHTML = autres.slice(0, 6).map(id => {
            const j = window.JOSDORE_GAMES[id];
            return `<a href="/jeu.html?id=${id}" class="game-autre-carte"><div class="game-autre-icone" style="color:${j.couleur || '#6C5CE7'};"><i class="${j.icone}"></i></div><h4>${j.titre}</h4></a>`;
        }).join("");
    }

    function afficherErreur() {
        document.getElementById("game-page").style.display = "none";
        document.getElementById("game-autres").style.display = "none";
        document.getElementById("game-erreur").style.display = "block";
    }

    afficherAutresJeux();
});