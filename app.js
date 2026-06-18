document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Toggler ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // --- 2. Hash-Based SPA Routing ---
    const pageSections = document.querySelectorAll('.page-section');

    const handleRouting = () => {
        let currentHash = window.location.hash;
        if (!currentHash || currentHash === '#') {
            currentHash = '#beranda';
        }

        // Hide all page sections, show active one
        pageSections.forEach(section => {
            if (`#${section.getAttribute('id')}` === currentHash) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Highlight active navigation link in header
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll to top of the page on route change
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    };

    window.addEventListener('hashchange', handleRouting);
    // Execute routing on page load
    handleRouting();

    // --- 3. Program Kerja (Proker) Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const prokerCards = document.querySelectorAll('.proker-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons, add to current
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            prokerCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Add transitional scaling out
                card.style.transform = 'scale(0.85)';
                card.style.opacity = '0';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    // --- 4. Interactive Team Photo Section ---
    const teamMembers = {
        'albet': {
            name: "Albet Bastanta Surbakti",
            shortName: "Albet",
            shortRole: "pdd",
            role: "Divisi PDD",
            major: "Teknik Perminyakan",
            quote: "Mendokumentasikan setiap kegiatan KKN dalam bentuk visual dan desain yang bermakna.",
            iconClass: "fa-solid fa-camera-retro",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/albet.JPG"
        },
        'ardila': {
            name: "Ardila Zakilla Putri",
            shortName: "Ardila",
            shortRole: "bendahara",
            role: "Bendahara",
            major: "Administrasi Bisnis",
            quote: "Mengelola anggaran pengabdian secara transparan, efisien, dan bertanggung jawab.",
            iconClass: "fa-solid fa-wallet",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/ardilllla.JPG"
        },
        'dewa': {
            name: "Anak Agung Ngurah Sadewa Tedja Jaya Negara",
            shortName: "Dewa",
            shortRole: "ketua",
            role: "Ketua",
            major: "Teknik Informatika",
            quote: "Memimpin dengan dedikasi untuk mengabdi secara nyata bagi kemajuan Andongsili.",
            iconClass: "fa-solid fa-user-tie",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/dewa.JPG"
        },
        'fadia': {
            name: "Fadia Azhar Budiwihani",
            shortName: "Fadia",
            shortRole: "sekre",
            role: "Sekretaris",
            major: "Manajemen",
            quote: "Penyusunan administrasi dan dokumentasi laporan yang rapi demi keberlanjutan KKN.",
            iconClass: "fa-solid fa-file-signature",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/DSCF4345.JPG"
        },
        'faza': {
            name: "Muhammad Faza Fadhlurrahman",
            shortName: "Faza",
            shortRole: "perkap",
            role: "Divisi Perlengkapan",
            major: "Teknik Industri",
            quote: "Menyiapkan dan mengelola perlengkapan dengan teliti agar setiap kegiatan berjalan lancar.",
            iconClass: "fa-solid fa-boxes-stacked",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/faza.JPG"
        },
        'ilham': {
            name: "Aufa Ilham Annindra",
            shortName: "Ilham",
            shortRole: "humas",
            role: "Divisi Humas",
            major: "Teknik Geologi",
            quote: "Membangun relasi harmonis dan menjembatani komunikasi antara mahasiswa dan warga desa.",
            iconClass: "fa-solid fa-bullhorn",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/ilham.JPG"
        },
        'rara': {
            name: "Nabilla Dara Larasaty",
            shortName: "Rara",
            shortRole: "sekre",
            role: "Sekretaris",
            major: "Teknik Metalurgi",
            quote: "Mengarsipkan setiap data dan laporan dengan tertib untuk kelancaran administrasi kelompok.",
            iconClass: "fa-solid fa-file-signature",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/rara.JPG"
        },
        'rifki': {
            name: "Rifki Farros Pandu Pradana",
            shortName: "Rifky",
            shortRole: "perkap",
            role: "Divisi Perlengkapan",
            major: "Teknik Pertambangan",
            quote: "Kesiapan teknis di lapangan adalah pondasi kesuksesan setiap program kerja.",
            iconClass: "fa-solid fa-screwdriver-wrench",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/rifky.JPG"
        },
        'tata': {
            name: "Dinta Ayu Amalia",
            shortName: "Tata",
            shortRole: "pdd",
            role: "Divisi PDD",
            major: "Agroteknologi",
            quote: "Mendokumentasikan setiap momen pengabdian agar cerita KKN tetap hidup dan menginspirasi.",
            iconClass: "fa-solid fa-palette",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/tata.JPG"
        },
        'zahra': {
            name: "Zahra Aulia Chairunnisa",
            shortName: "Zahra",
            shortRole: "acara",
            role: "Divisi Acara",
            major: "Akuntansi",
            quote: "Mengoordinasikan dan melaksanakan kegiatan acara demi tercapainya program kerja yang bermakna.",
            iconClass: "fa-solid fa-calendar-check",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
            photo: "assets/profilepic/zahra.JPG"
        }
    };

    const hotspots = document.querySelectorAll('.hotspot');
    const tooltip = document.getElementById('team-tooltip');
    const svgElement = document.getElementById('team-svg');
    const placeholder = document.getElementById('team-detail-placeholder');
    const content = document.getElementById('team-detail-content');
    const card = document.getElementById('team-detail-card');

    const detailName = document.getElementById('detail-name');
    const detailRole = document.getElementById('detail-role');
    const detailMajor = document.getElementById('detail-major');
    const detailQuote = document.getElementById('detail-quote');
    const detailIcon = document.getElementById('detail-icon');
    const detailPhoto = document.getElementById('detail-photo');
    const detailIg = document.getElementById('detail-ig');
    const detailLi = document.getElementById('detail-li');

    if (hotspots && tooltip && svgElement) {
        hotspots.forEach(hotspot => {
            const id = hotspot.getAttribute('data-member');
            const member = teamMembers[id];

            // Hover effect to show tooltip, dim others, and highlight cutout
            hotspot.addEventListener('mouseenter', () => {
                if (!member) return;
                tooltip.textContent = `${member.shortName} (${member.shortRole})`;
                tooltip.classList.add('visible');

                // Dim base photo
                const basePhoto = document.getElementById('team-base-photo');
                if (basePhoto) basePhoto.classList.add('dimmed');

                // Activate cutout
                const cutout = document.getElementById(`cutout-${id}`);
                if (cutout) cutout.classList.add('active');
            });

            hotspot.addEventListener('mousemove', (e) => {
                // Position the tooltip based on mouse coordinates relative to svg container
                const rect = svgElement.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
            });

            hotspot.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');

                // Restore base photo dimming only if there are no selected cutouts
                const hasSelected = document.querySelector('.cutout-overlay.selected');
                if (!hasSelected) {
                    const basePhoto = document.getElementById('team-base-photo');
                    if (basePhoto) basePhoto.classList.remove('dimmed');
                }

                // Deactivate cutout
                const cutout = document.getElementById(`cutout-${id}`);
                if (cutout) cutout.classList.remove('active');
            });

            // Click effect to select and show profile details
            hotspot.addEventListener('click', () => {
                if (!member) return;

                // Remove selected class from all hotspots
                hotspots.forEach(h => h.classList.remove('selected'));

                // Add selected class to clicked one
                hotspot.classList.add('selected');

                // Remove selected class from all cutout overlays, and add to current
                const cutouts = document.querySelectorAll('.cutout-overlay');
                cutouts.forEach(c => c.classList.remove('selected'));

                const cutout = document.getElementById(`cutout-${id}`);
                if (cutout) cutout.classList.add('selected');

                // Keep base photo dimmed while someone is selected
                const basePhoto = document.getElementById('team-base-photo');
                if (basePhoto) basePhoto.classList.add('dimmed');

                // Hide placeholder, show content
                if (placeholder) placeholder.classList.add('hidden');
                if (content) content.classList.remove('hidden');

                // Update content details
                if (detailName) detailName.textContent = member.name;
                if (detailRole) detailRole.textContent = member.role;
                if (detailMajor) detailMajor.textContent = member.major;
                if (detailQuote) detailQuote.textContent = `"${member.quote}"`;
                if (detailIg) detailIg.href = member.instagram;
                if (detailLi) detailLi.href = member.linkedin;

                if (member.photo) {
                    if (detailPhoto) {
                        detailPhoto.src = member.photo;
                        detailPhoto.alt = member.name;
                        detailPhoto.classList.remove('hidden');
                    }
                    if (detailIcon) {
                        detailIcon.classList.add('hidden');
                    }
                } else {
                    if (detailPhoto) {
                        detailPhoto.classList.add('hidden');
                        detailPhoto.src = '';
                    }
                    if (detailIcon) {
                        detailIcon.classList.remove('hidden');
                        detailIcon.className = member.iconClass;
                    }
                }

                // Trigger animation
                if (content) {
                    content.style.animation = 'none';
                    // Trigger reflow
                    void content.offsetWidth;
                    content.style.animation = 'detailFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }

                // Highlight card border temporary
                if (card) {
                    card.style.borderColor = 'var(--color-primary)';
                    setTimeout(() => {
                        card.style.borderColor = 'rgba(108, 8, 32, 0.04)';
                    }, 500);
                }
            });
        });
    }

    // --- 4b. Click Outside to Deselect Member ---
    document.addEventListener('click', (e) => {
        const photoWrapper = document.querySelector('.team-photo-wrapper');
        const detailCard = document.getElementById('team-detail-card');

        if (photoWrapper && detailCard) {
            // If click is outside the photo wrapper AND outside the detail card
            if (!photoWrapper.contains(e.target) && !detailCard.contains(e.target)) {
                // Remove selected class from all hotspots
                if (hotspots) hotspots.forEach(h => h.classList.remove('selected'));

                // Remove selected class from all cutouts
                const cutouts = document.querySelectorAll('.cutout-overlay');
                cutouts.forEach(c => c.classList.remove('selected'));

                // Undim base photo
                const basePhoto = document.getElementById('team-base-photo');
                if (basePhoto) basePhoto.classList.remove('dimmed');

                // Restore placeholder and hide details
                if (placeholder) placeholder.classList.remove('hidden');
                if (content) content.classList.add('hidden');
                if (detailPhoto) {
                    detailPhoto.classList.add('hidden');
                    detailPhoto.src = '';
                }
                if (detailIcon) {
                    detailIcon.classList.remove('hidden');
                }
            }
        }
    });

    // --- 5. Guestbook Functional Logic ---
    const commentForm = document.getElementById('comment-form');
    const messagesList = document.getElementById('messages-list');
    const messagesCountSpan = document.getElementById('messages-count');

    // Default sample comments to display if guestbook is empty
    const defaultComments = [
        {
            name: "Placeholder",
            role: "Placeholder",
            message: "Placeholder",
            date: "Placeholder"
        },
    ];

    // Load messages from localStorage or initialize with defaults
    let guestbookMessages = JSON.parse(localStorage.getItem('kkn_messages'));
    if (!guestbookMessages || guestbookMessages.length === 0) {
        guestbookMessages = defaultComments;
        localStorage.setItem('kkn_messages', JSON.stringify(guestbookMessages));
    }

    // Render all comments
    const renderComments = () => {
        if (!messagesList) return;
        messagesList.innerHTML = '';
        if (messagesCountSpan) messagesCountSpan.textContent = guestbookMessages.length;

        guestbookMessages.forEach(msg => {
            const commentCard = document.createElement('div');
            commentCard.className = 'comment-card';

            commentCard.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${escapeHTML(msg.name)}</span>
                    <span class="comment-role">${escapeHTML(msg.role)}</span>
                </div>
                <p class="comment-text">${escapeHTML(msg.message)}</p>
                <div class="comment-date">${msg.date}</div>
            `;
            messagesList.appendChild(commentCard);
        });
    };

    // Helper to escape HTML and prevent XSS
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    };

    // Handle new message submission
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('input-name');
            const roleInput = document.getElementById('input-role');
            const messageInput = document.getElementById('input-message');

            const dateNow = new Date();
            const dateFormatted = dateNow.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }) + ', ' + dateNow.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            }).replace('.', ':');

            const newMessage = {
                name: nameInput.value.trim(),
                role: roleInput.value,
                message: messageInput.value.trim(),
                date: dateFormatted
            };

            // Prepend new comment to current messages list
            guestbookMessages.unshift(newMessage);
            localStorage.setItem('kkn_messages', JSON.stringify(guestbookMessages));

            // Render and reset form
            renderComments();
            commentForm.reset();

            // Smooth scroll first comment into view
            messagesList.scrollTop = 0;
        });
    }

    // Initialize comments on page load
    renderComments();
});
