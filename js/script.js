const roles = [
            "Géomaticien",
            "Chargé d'études SIG",
            "Analyste territorial",
            "Urbaniste data",
            "Chef de projet géomatique",
            "Consultant en systèmes d'information géographique"
        ];
        
        let index = 0;
        const wordElement = document.getElementById('changing-word');
        
        function changeWord() {
            index = (index + 1) % roles.length;
            wordElement.style.opacity = '0';
            setTimeout(() => {
                wordElement.textContent = roles[index];
                wordElement.style.opacity = '1';
            }, 200);
        }
        
        setInterval(changeWord, 2000);

        // Hamburger menu toggle
        const hamburger = document.getElementById('hamburger');
        const navContainer = document.querySelector('.nav-container');
        const navLinks = document.querySelectorAll('.nav-container a');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navContainer.classList.toggle('open');
        });

        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navContainer.classList.remove('open');
            });
        });

        // Menu actif au scroll
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.style.fontWeight = '400';
                if (link.getAttribute('href').includes(current)) {
                    link.style.fontWeight = '600';
                }
            });
        });

        // Modal functions
        function openModal(projectId) {
            const modal = document.getElementById(projectId + '-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeModal(projectId) {
            const modal = document.getElementById(projectId + '-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }

        // Fermer modal au clic en dehors
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    const projectId = modal.id.replace('-modal', '');
                    closeModal(projectId);
                }
            });
        });

        // Fermer modal à la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    const projectId = modal.id.replace('-modal', '');
                    closeModal(projectId);
                });
            }
        });
