document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlElement.setAttribute('data-theme', 'dark');
        }
    }

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        let currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Simple interaction for search bar focus
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-bar input');

    searchInput.addEventListener('focus', () => {
        searchBar.style.boxShadow = 'var(--shadow-lg)';
        searchBar.style.borderColor = 'var(--brand-primary)';
    });

    searchInput.addEventListener('blur', () => {
        searchBar.style.boxShadow = '';
        searchBar.style.borderColor = '';
    });

    // Modal Logic
    const openSignInBtn = document.getElementById('openSignIn');
    const signInModal = document.getElementById('signInModal');
    const closeModalBtn = document.getElementById('closeModal');

    // Open Modal
    if (openSignInBtn && signInModal) {
        openSignInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signInModal.classList.add('active');
        });
    }

    // Close Modal via button
    if (closeModalBtn && signInModal) {
        closeModalBtn.addEventListener('click', () => {
            signInModal.classList.remove('active');
        });
    }

    // Close Modal via clicking outside
    if (signInModal) {
        signInModal.addEventListener('click', (e) => {
            if (e.target === signInModal) {
                signInModal.classList.remove('active');
            }
        });
    }

    // Modal Tabs Logic (Buyer vs Seller)
    const tabSeller = document.getElementById('tabSeller');
    const tabBuyer = document.getElementById('tabBuyer');
    const formSeller = document.getElementById('formSeller');
    const formBuyer = document.getElementById('formBuyer');

    if (tabSeller && tabBuyer && formSeller && formBuyer) {
        tabSeller.addEventListener('click', () => {
            tabSeller.classList.add('active');
            tabBuyer.classList.remove('active');
            formSeller.style.display = 'block';
            formBuyer.style.display = 'none';
        });

        tabBuyer.addEventListener('click', () => {
            tabBuyer.classList.add('active');
            tabSeller.classList.remove('active');
            formBuyer.style.display = 'block';
            formSeller.style.display = 'none';
        });
    }

    // --- Login Logic ---
    const sellerLoginBtn = document.querySelector('#formSeller .btn-primary');
    const buyerLoginBtn = document.querySelector('#formBuyer .btn-primary');
    const sellerEmailInput = document.querySelector('#formSeller input[type="email"]');
    const buyerEmailInput = document.querySelector('#formBuyer input[type="email"]');

    function handleLogin(email, isSeller) {
        if (!email) {
            alert("Please enter a valid email.");
            return;
        }

        // Close modal
        if (signInModal) {
            signInModal.classList.remove('active');
        }

        // Update Nav UI
        if (openSignInBtn) openSignInBtn.style.display = 'none';
        const joinNowBtn = document.querySelector('.nav-actions .btn-primary');
        if (joinNowBtn) joinNowBtn.textContent = 'Welcome, ' + email.split('@')[0];

        // Process Email Domain
        const domain = email.split('@')[1] ? email.split('@')[1].toLowerCase() : '';
        let userType = 'enterprise'; // default to enterprise

        if (domain.endsWith('.edu')) {
            userType = 'student';
        } else {
            const individualDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
            if (individualDomains.includes(domain)) {
                userType = 'individual';
            }
        }

        // Update Pricing Layouts
        const priceModels = document.querySelectorAll('.price-model');
        priceModels.forEach(model => {
            const studentTier = model.querySelector('.price-tier.student');
            const enterpriseTier = model.querySelector('.price-tier.enterprise');
            const divider = model.querySelector('.divider');

            if (userType === 'student') {
                if (studentTier) studentTier.style.display = 'flex';
                if (enterpriseTier) enterpriseTier.style.display = 'none';
                if (divider) divider.style.display = 'none';
            } else if (userType === 'enterprise') {
                if (studentTier) studentTier.style.display = 'none';
                if (enterpriseTier) enterpriseTier.style.display = 'flex';
                if (divider) divider.style.display = 'none';
            } else if (userType === 'individual') {
                if (studentTier) studentTier.style.display = 'flex';
                if (enterpriseTier) enterpriseTier.style.display = 'flex';
                if (divider) divider.style.display = 'block';
            }
        });

        // Show seller dashboard if applicable
        if (isSeller) {
            const landingView = document.getElementById('landingView');
            const dashboardView = document.getElementById('sellerDashboardView');
            if (landingView) landingView.style.display = 'none';
            if (dashboardView) {
                dashboardView.style.display = 'block';
                const dashUserName = document.getElementById('dashUserName');
                if (dashUserName) dashUserName.textContent = email.split('@')[0];
            }
        }
    }

    if (sellerLoginBtn) {
        sellerLoginBtn.addEventListener('click', () => handleLogin(sellerEmailInput.value, true));
    }

    if (buyerLoginBtn) {
        buyerLoginBtn.addEventListener('click', () => handleLogin(buyerEmailInput.value, false));
    }

    // Nav Links interactions
    const navExplore = document.getElementById('navExplore');
    if (navExplore) {
        navExplore.addEventListener('click', (e) => {
            e.preventDefault();
            const landingView = document.getElementById('landingView');
            const dashboardView = document.getElementById('sellerDashboardView');
            if (landingView) landingView.style.display = 'block';
            if (dashboardView) dashboardView.style.display = 'none';
        });
    }

    // --- AI Chatbot Logic ---
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle Chat Window
    if (chatToggleBtn && chatWindow && closeChatBtn) {
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.classList.add('open');
            chatInput.focus();
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }

    // Handle sending messages
    const handleSendMessage = async () => {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        // 1. Add User Message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'message user-message';
        userMsgDiv.innerHTML = `<div class="message-content">${messageText}</div>`;
        chatMessages.appendChild(userMsgDiv);

        // Clear input and scroll down
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 2. Real AI Response via Gemini API
        // NOTE: You need a free Gemini API key for this to work!
        const GEMINI_API_KEY = "AIzaSyAD0c1TyLRbI4ceMxNHZEyHm_d36zfPC9A";

        // Add a temporary "Thinking..." message
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'message ai-message';
        aiMsgDiv.innerHTML = `<div class="message-content" style="opacity: 0.7;">Thinking...</div>`;
        chatMessages.appendChild(aiMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            setTimeout(() => {
                aiMsgDiv.innerHTML = `<div class="message-content"><b>I'm currently asleep!</b> To make me smart, get a free Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--brand-primary); text-decoration: underline;">aistudio.google.com</a> and paste it into <code>script.js</code> (line 106)!</div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 800);
            return;
        }

        try {
            const systemPrompt = "You are the friendly and helpful AI assistant for 'SooqSwap', a student freelance marketplace. Keep your answers very short, concise, and related to student services (like tutoring, design, coding). Do not use markdown headers, just plain text.";

            const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemPrompt}\n\nUser: ${messageText}`
                        }]
                    }]
                })
            });

            const data = await apiResponse.json();

            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                // Replace newlines with <br> for HTML formatting
                aiMsgDiv.innerHTML = `<div class="message-content">${aiText.replace(/\n/g, '<br>')}</div>`;
            } else if (data.error) {
                // If Google rate limits us, use a smart fallback so your presentation doesn't crash!
                console.warn("API was busy or rate limited. Using local fallback response.", data.error.message);

                let fallbackResponse = "I'm currently at my API limit, so I'm running in offline mode. I can still help you navigate the site though!";

                const lowerInput = messageText.toLowerCase();
                if (lowerInput.includes('logo') || lowerInput.includes('design') || lowerInput.includes('art')) {
                    fallbackResponse = "I see you're looking for design work! Alex M. is a highly rated Level 2 Seller who specializes in modern minimalist logos.";
                } else if (lowerInput.includes('code') || lowerInput.includes('website') || lowerInput.includes('app') || lowerInput.includes('react')) {
                    fallbackResponse = "For web development, Jamie L. can build a fully responsive React website starting at ₹4000. Want me to open their profile?";
                } else if (lowerInput.includes('math') || lowerInput.includes('tutor') || lowerInput.includes('algebra')) {
                    fallbackResponse = "Emma T. is an amazing tutor for College Algebra and Calculus. She charges ₹1000/hr for students!";
                } else if (lowerInput.includes('video') || lowerInput.includes('edit')) {
                    fallbackResponse = "Check out Sam K! They edit YouTube videos with dynamic effects starting at ₹2000 for students.";
                } else if (lowerInput.includes('wyd') || lowerInput.includes('what are you doing')) {
                    fallbackResponse = "The full form of 'wyd' is 'What you doing?'. As for me, I'm currently helping you find amazing student freelancers on SooqSwap!";
                } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
                    fallbackResponse = "Hello there! How can I help you find the right student freelancer for your project today?";
                } else {
                    fallbackResponse = "Because my API quota was hit, I'm currently in 'mock' mode! I can't answer complex questions, but try asking me about finding a 'coder', 'designer', or 'tutor'!";
                }

                aiMsgDiv.innerHTML = `<div class="message-content">${fallbackResponse}</div>`;
            } else {
                aiMsgDiv.innerHTML = `<div class="message-content">Sorry, I didn't get a proper response... Try again!</div>`;
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;

        } catch (error) {
            console.error("Chatbot Error:", error);
            aiMsgDiv.innerHTML = `<div class="message-content">Connection error. Please try again.</div>`;
        }
    };

    // Send on button click
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', handleSendMessage);
    }

    // Send on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
    // --- Global Modal Logic for Dashboard & Details ---
    window.showInfoModal = function (title, bodyHTML) {
        const infoModal = document.getElementById('infoModal');
        const titleEl = document.getElementById('infoModalTitle');
        const bodyEl = document.getElementById('infoModalBody');
        if (infoModal && titleEl && bodyEl) {
            titleEl.textContent = title;
            bodyEl.innerHTML = bodyHTML;
            infoModal.classList.add('active');
        }
    };

    const closeInfoModalBtn = document.getElementById('closeInfoModal');
    const infoModalAckBtn = document.getElementById('infoModalAckBtn');
    const infoModal = document.getElementById('infoModal');

    const closeInfo = () => {
        if (infoModal) infoModal.classList.remove('active');
    };

    if (closeInfoModalBtn) closeInfoModalBtn.addEventListener('click', closeInfo);
    if (infoModalAckBtn) infoModalAckBtn.addEventListener('click', closeInfo);
    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeInfo();
        });
    }

    // --- Dynamic Search Logic ---
    const searchBtn = document.querySelector('.search-btn');
    const noResultsMsg = document.getElementById('noResultsMsg');
    const servicesGrid = document.querySelector('.services-grid');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    function performSearch() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        const serviceCards = document.querySelectorAll('.service-card');
        let hasVisibleCards = false;

        serviceCards.forEach(card => {
            const textContent = card.innerText.toLowerCase();
            // simple text matching
            if (textContent.includes(query)) {
                card.style.display = 'block';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (hasVisibleCards) {
            if (noResultsMsg) noResultsMsg.style.display = 'none';
            if (servicesGrid) servicesGrid.style.display = 'grid';
        } else {
            if (noResultsMsg) noResultsMsg.style.display = 'block';
            if (servicesGrid) servicesGrid.style.display = 'none';
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Also trigger search on enter key from the global searchInput defined at the top
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            performSearch();
        });
    }

    // --- Live Autocomplete Dropdown Logic ---
    const heroSearchInput = document.getElementById('heroSearchInput');
    const searchDropdown = document.getElementById('searchDropdown');

    function performLiveSearch() {
        if (!heroSearchInput || !searchDropdown) return;

        const query = heroSearchInput.value.toLowerCase().trim();
        searchDropdown.innerHTML = '';

        if (query === '') {
            searchDropdown.style.display = 'none';
            return;
        }

        // Also perform the general page search to sync grid
        if (searchInput) {
            searchInput.value = query;
            performSearch();
        }

        let matches = 0;
        const allServiceCards = document.querySelectorAll('.service-card');

        allServiceCards.forEach(card => {
            const textContent = card.innerText.toLowerCase();
            const sellerName = card.querySelector('.seller-name').textContent;
            const serviceTitle = card.querySelector('h3').textContent;
            const iconName = card.querySelector('.card-icon').getAttribute('name');

            if (textContent.includes(query) && matches < 5) { // Show up to 5 results in dropdown
                matches++;

                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div class="item-icon"><ion-icon name="${iconName}"></ion-icon></div>
                    <div class="item-details">
                        <div class="item-title">${serviceTitle}</div>
                        <div class="item-seller">by ${sellerName}</div>
                    </div>
                `;

                item.addEventListener('click', () => {
                    window.location.href = `seller.html?seller=${encodeURIComponent(sellerName)}`;
                });

                searchDropdown.appendChild(item);
            }
        });

        if (matches > 0) {
            searchDropdown.style.display = 'block';
        } else {
            searchDropdown.innerHTML = `<div style="padding: 1rem; color: var(--text-secondary); text-align: center;">No exact matches found</div>`;
            searchDropdown.style.display = 'block';
        }
    }

    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', performLiveSearch);

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar-container')) {
                if (searchDropdown) searchDropdown.style.display = 'none';
            }
        });

        // Show when focused again
        heroSearchInput.addEventListener('focus', () => {
            if (heroSearchInput.value.trim() !== '') {
                performLiveSearch();
            }
        });

        // Let main search button execute full search
        const heroSearchBtn = document.getElementById('heroSearchBtn');
        if (heroSearchBtn) {
            heroSearchBtn.addEventListener('click', () => {
                if (searchDropdown) searchDropdown.style.display = 'none';
                if (searchInput) {
                    searchInput.value = heroSearchInput.value;
                    performSearch();
                }
                const servicesSection = document.getElementById('services');
                if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // --- Wire Grid Cards to Seller Page ---
    const gridCards = document.querySelectorAll('.service-card');
    gridCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const sellerEl = card.querySelector('.seller-name');
            if (sellerEl) {
                const sellerName = sellerEl.textContent;
                window.location.href = `seller.html?seller=${encodeURIComponent(sellerName)}`;
            }
        });
    });

});
