// =========================================
// 1. LE CURSEUR PERSONNALISÉ
// =========================================
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

const cliquables = 'a, button, .project-card, .game-box, .close-btn, video, .itch-link';
document.addEventListener('mouseover', (e) => {
    if (e.target.closest(cliquables)) cursor.classList.add('hover-active');
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest(cliquables)) cursor.classList.remove('hover-active');
});

// =========================================
// 2. APPARITION AU SCROLL (REVEAL)
// =========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// =========================================
// 3. NAVIGATION DOCK (SCROLL FLUIDE)
// =========================================
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20, 
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// 4. ANIMATION BOUTON INIT (HYPERSPACE)
// =========================================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const btnInit = document.getElementById('btn-init');

if(btnInit) {
    btnInit.addEventListener('click', function(e) {
        e.preventDefault();
        const textSpan = this.querySelector('.btn-text');
        const original = textSpan.dataset.value;
        let iteration = 0;
        
        this.classList.add('hyperspace-active');

        const interval = setInterval(() => {
            textSpan.innerText = original.split("").map((l, i) => {
                if(i < iteration) return original[i];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join("");

            if(iteration >= original.length) {
                clearInterval(interval);
                this.classList.remove('hyperspace-active');
                window.scrollTo({ top: document.querySelector('#projects').offsetTop - 20, behavior: 'smooth' });
            }
            iteration += 1/3;
        }, 30);
    });
}

// =========================================
// 5. GESTION DE LA MODALE ET DU LECTEUR MP4
// =========================================
const modal = document.getElementById("project-modal");

window.openModal = function(projectId) {
    if(modal) {
        // 1. Affiche le fond noir
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Coupe le scroll du site principal
        
        // 2. Cache TOUTES les sections et stoppe toutes les vidéos
        const allContents = document.querySelectorAll('.modal-project-content');
        allContents.forEach(content => {
            content.style.display = 'none';
            const vid = content.querySelector('video');
            if (vid) {
                vid.pause(); // Met en pause la vidéo des projets cachés
                vid.currentTime = 0;
            }
        });
        
        // 3. Affiche uniquement le projet cliqué
        const targetProject = document.getElementById(projectId);
        if(targetProject) {
            targetProject.style.display = 'block';
            
            // Lancement automatique du trailer MP4 !
            const vid = targetProject.querySelector('video');
            if (vid) {
                vid.play().catch(e => console.log("Autoplay bloqué par le navigateur", e));
            }
        }
    }
};

window.closeModal = function() {
    if(modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Réactive le scroll du site
        
        // Stoppe la vidéo en cours quand on ferme la fenêtre
        const videos = modal.querySelectorAll('video');
        videos.forEach(vid => {
            vid.pause();
            vid.currentTime = 0;
        });
    }
};

// Ferme la modale si on clique sur le fond noir
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
};

// =========================================
// 6. PARALLAXE DE LA PHOTO
// =========================================
const profileFrame = document.querySelector('.hero-image-container');

if (profileFrame) {
    window.addEventListener('mousemove', (e) => {
        const xOffset = (e.clientX / window.innerWidth - 0.5);
        const yOffset = (e.clientY / window.innerHeight - 0.5);
        
        profileFrame.style.transform = `rotateX(${yOffset * 20}deg) rotateY(${xOffset * -20}deg) translate(${xOffset * 10}px, ${yOffset * 10}px)`;
    });
    
    window.addEventListener('mouseleave', () => {
        profileFrame.style.transform = `rotateX(0deg) rotateY(0deg) translate(0, 0)`;
        profileFrame.style.transition = 'transform 0.5s ease';
    });
}