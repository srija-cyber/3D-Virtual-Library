// Global variables
        let scene, camera, renderer, controls;
        let player = {
            x: 0,
            z: 0,
            rotation: 0
        };
        let books = [];
        let isDayMode = false;
        let dayLight, nightLight, ambientLight;
        let raycaster, mouse;
        let hoveredBook = null;

        // Book data with Wikipedia links
        const bookData = [{
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                summary: "A classic American novel set in the summer of 1922, following the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan. A tale of love, wealth, and the American Dream in the Jazz Age.",
                progress: 43,
                color: 0x8B4513,
                genre: "Classic Literature",
                wikipediaUrl: "https://en.wikipedia.org/wiki/The_Great_Gatsby",
                id: "gatsby"
            },
            {
                title: "Dune",
                author: "Frank Herbert",
                summary: "Set in the distant future amidst a feudal interstellar society, this epic science fiction novel follows Paul Atreides as he navigates political intrigue, mystical powers, and desert warfare on the planet Arrakis.",
                progress: 67,
                color: 0xDAA520,
                genre: "Science Fiction",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Dune_(novel)",
                id: "dune"
            },
            {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                summary: "A romantic novel that follows the emotional development of Elizabeth Bennet, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
                progress: 89,
                color: 0x9370DB,
                genre: "Romance",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Pride_and_Prejudice",
                id: "pride"
            },
            {
                title: "1984",
                author: "George Orwell",
                summary: "A dystopian social science fiction novel that follows Winston Smith, a low-ranking member of 'the Party' in London, in the nation of Oceania, where the Party exercises total control over its people.",
                progress: 12,
                color: 0x2F4F4F,
                genre: "Dystopian Fiction",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Nineteen_Eighty-Four",
                id: "1984"
            },
            {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                summary: "A fantasy adventure that follows Bilbo Baggins, a hobbit who embarks on an incredible journey with thirteen dwarves and the wizard Gandalf to reclaim the lost Dwarf Kingdom of Erebor from the dragon Smaug.",
                progress: 78,
                color: 0x228B22,
                genre: "Fantasy",
                wikipediaUrl: "https://en.wikipedia.org/wiki/The_Hobbit",
                id: "hobbit"
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                summary: "Set in the American South during the 1930s, this novel deals with serious issues of rape and racial inequality through the eyes of young Scout Finch, whose father defends a black man falsely accused of rape.",
                progress: 55,
                color: 0xB22222,
                genre: "Classic Literature",
                wikipediaUrl: "https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird",
                id: "mockingbird"
            },
            {
                title: "Harry Potter and the Philosopher's Stone",
                author: "J.K. Rowling",
                summary: "The first novel in the Harry Potter series, following young Harry Potter as he discovers his magical heritage and begins his education at Hogwarts School of Witchcraft and Wizardry.",
                progress: 92,
                color: 0x800080,
                genre: "Fantasy",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Harry_Potter_and_the_Philosopher%27s_Stone",
                id: "harry_potter"
            },
            {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                summary: "An epic high fantasy novel that follows the quest to destroy the One Ring and defeat the Dark Lord Sauron. A tale of friendship, courage, and the struggle between good and evil.",
                progress: 34,
                color: 0x8B4513,
                genre: "Fantasy",
                wikipediaUrl: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings",
                id: "lotr"
            },
            {
                title: "The Shining",
                author: "Stephen King",
                summary: "A psychological horror novel about Jack Torrance, an aspiring writer and recovering alcoholic who accepts a position as the off-season caretaker of the isolated Overlook Hotel.",
                progress: 25,
                color: 0x8B0000,
                genre: "Horror",
                wikipediaUrl: "https://en.wikipedia.org/wiki/The_Shining_(novel)",
                id: "shining"
            },
            {
                title: "Murder on the Orient Express",
                author: "Agatha Christie",
                summary: "A detective novel featuring the Belgian detective Hercule Poirot. The story concerns the murder of an American businessman aboard the Orient Express train.",
                progress: 60,
                color: 0x4682B4,
                genre: "Mystery",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Murder_on_the_Orient_Express",
                id: "orientexpress"
            },
            {
                title: "Steve Jobs",
                author: "Walter Isaacson",
                summary: "The authorized biography of Apple co-founder Steve Jobs, based on more than forty interviews with Jobs conducted over two years.",
                progress: 45,
                color: 0x696969,
                genre: "Biography",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Steve_Jobs_(book)",
                id: "stevejobs"
            },
            {
                title: "The Martian",
                author: "Andy Weir",
                summary: "A science fiction novel about an astronaut who is mistakenly presumed dead and left behind on Mars, and his struggle to survive and signal Earth that he is alive.",
                progress: 80,
                color: 0xCD5C5C,
                genre: "Science Fiction",
                wikipediaUrl: "https://en.wikipedia.org/wiki/The_Martian_(Weir_novel)",
                id: "martian"
            },
            {
                title: "The Silent Patient",
                author: "Alex Michaelides",
                summary: "A psychological thriller about a woman who shoots her husband and then stops speaking, and the criminal psychotherapist who tries to unravel the mystery.",
                progress: 30,
                color: 0x708090,
                genre: "Mystery",
                wikipediaUrl: "https://en.wikipedia.org/wiki/The_Silent_Patient",
                id: "silentpatient"
            },
            {
                title: "Educated",
                author: "Tara Westover",
                summary: "A memoir about the author's upbringing in a survivalist family in Idaho and her subsequent pursuit of education, despite her family's opposition.",
                progress: 55,
                color: 0x556B2F,
                genre: "Biography",
                wikipediaUrl: "https://en.wikipedia.org/wiki/Educated_(book)",
                id: "educated"
            }
        ];

        // Global variables for bookmarks and filtering
        let bookmarks = JSON.parse(localStorage.getItem('libraryBookmarks')) || [];
        let currentFilter = 'all';
        let searchQuery = '';
        let currentBookData = null;
        let isMusicPlaying = false;
        let backgroundMusic = document.getElementById('backgroundMusic');

        // Initialize the 3D scene
        function init() {
            // Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 1.6, 5);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x1a1a2e);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById('container').appendChild(renderer.domElement);

            // Raycaster for mouse interaction
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            // Lighting setup
            setupLighting();

            // Create the library
            createLibrary();

            // Controls
            setupControls();

            // Event listeners
            setupEventListeners();

            // Start render loop
            animate();

            // Initialize minimap
            initMinimap();
        }

        function setupLighting() {
            // Ambient light
            ambientLight = new THREE.AmbientLight(0x404040, 0.3);
            scene.add(ambientLight);

            // Day light (sun)
            dayLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dayLight.position.set(10, 10, 5);
            dayLight.castShadow = true;
            dayLight.shadow.mapSize.width = 2048;
            dayLight.shadow.mapSize.height = 2048;
            dayLight.visible = false;
            scene.add(dayLight);

            // Night light (warm library lighting)
            nightLight = new THREE.DirectionalLight(0xffd700, 0.6);
            nightLight.position.set(0, 8, 0);
            nightLight.castShadow = true;
            nightLight.shadow.mapSize.width = 2048;
            nightLight.shadow.mapSize.height = 2048;
            scene.add(nightLight);

            // Point lights for cozy atmosphere
            const pointLight1 = new THREE.PointLight(0xffd700, 0.5, 10);
            pointLight1.position.set(-5, 3, -5);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0xffd700, 0.5, 10);
            pointLight2.position.set(5, 3, -5);
            scene.add(pointLight2);
        }

        function createLibrary() {
            // Floor
            const floorGeometry = new THREE.PlaneGeometry(30, 30);
            const floorMaterial = new THREE.MeshLambertMaterial({
                color: 0x8B4513,
                map: createWoodTexture()
            });
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            scene.add(floor);

            // Walls
            createWalls();

            // Bookshelves
            createBookshelves();

            // Ceiling
            const ceilingGeometry = new THREE.PlaneGeometry(30, 30);
            const ceilingMaterial = new THREE.MeshLambertMaterial({
                color: 0x654321
            });
            const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
            ceiling.rotation.x = Math.PI / 2;
            ceiling.position.y = 8;
            scene.add(ceiling);

            // Add some decorative elements
            createDecorations();
        }

        function createWoodTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            // Create wood grain pattern
            const gradient = ctx.createLinearGradient(0, 0, 512, 0);
            gradient.addColorStop(0, '#8B4513');
            gradient.addColorStop(0.5, '#A0522D');
            gradient.addColorStop(1, '#8B4513');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);

            // Add wood grain lines
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * 25);
                ctx.lineTo(512, i * 25 + Math.sin(i) * 10);
                ctx.stroke();
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(4, 4);
            return texture;
        }

        function createWalls() {
            const wallMaterial = new THREE.MeshLambertMaterial({
                color: 0x8B7355
            });

            // Back wall
            const backWallGeometry = new THREE.PlaneGeometry(30, 8);
            const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
            backWall.position.set(0, 4, -15);
            scene.add(backWall);

            // Side walls
            const sideWallGeometry = new THREE.PlaneGeometry(30, 8);
            const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
            leftWall.rotation.y = Math.PI / 2;
            leftWall.position.set(-15, 4, 0);
            scene.add(leftWall);

            const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
            rightWall.rotation.y = -Math.PI / 2;
            rightWall.position.set(15, 4, 0);
            scene.add(rightWall);
        }

        function createBookshelves() {
            const shelfPositions = [{
                    x: -10,
                    z: -10,
                    rotation: 0
                },
                {
                    x: 0,
                    z: -10,
                    rotation: 0
                },
                {
                    x: 10,
                    z: -10,
                    rotation: 0
                },
                {
                    x: -10,
                    z: 0,
                    rotation: Math.PI / 2
                },
                {
                    x: 10,
                    z: 0,
                    rotation: -Math.PI / 2
                },
                {
                    x: -5,
                    z: 5,
                    rotation: 0
                },
                {
                    x: 5,
                    z: 5,
                    rotation: 0
                }
            ];

            shelfPositions.forEach((pos, index) => {
                createBookshelf(pos.x, pos.z, pos.rotation, index);
            });
        }

        function createBookshelf(x, z, rotation, shelfIndex) {
            const group = new THREE.Group();

            // Shelf structure
            const shelfMaterial = new THREE.MeshLambertMaterial({
                color: 0x654321
            });

            // Vertical supports
            const supportGeometry = new THREE.BoxGeometry(0.2, 6, 0.5);
            const leftSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
            leftSupport.position.set(-2, 3, 0);
            leftSupport.castShadow = true;
            group.add(leftSupport);

            const rightSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
            rightSupport.position.set(2, 3, 0);
            rightSupport.castShadow = true;
            group.add(rightSupport);

            // Horizontal shelves
            const shelfGeometry = new THREE.BoxGeometry(4, 0.1, 0.5);
            for (let i = 0; i < 4; i++) {
                const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
                shelf.position.set(0, i * 1.5 + 0.5, 0);
                shelf.castShadow = true;
                shelf.receiveShadow = true;
                group.add(shelf);

                // Add books to each shelf
                createBooksOnShelf(group, i * 1.5 + 0.6, shelfIndex * 4 + i);
            }

            group.position.set(x, 0, z);
            group.rotation.y = rotation;
            scene.add(group);
        }

        function createBooksOnShelf(shelfGroup, y, shelfNumber) {
            const booksPerShelf = 8;
            const bookWidth = 0.15;
            const startX = -1.8;

            for (let i = 0; i < booksPerShelf; i++) {
                const bookIndex = (shelfNumber * booksPerShelf + i) % bookData.length;
                const book = createBook(bookData[bookIndex], bookIndex);

                book.position.set(
                    startX + i * (bookWidth + 0.05),
                    y,
                    0.2
                );

                // Add slight random rotation for realism
                book.rotation.y = (Math.random() - 0.5) * 0.1;
                book.rotation.z = (Math.random() - 0.5) * 0.05;

                book.userData = {
                    bookData: bookData[bookIndex],
                    originalPosition: book.position.clone(),
                    isBook: true
                };

                books.push(book);
                shelfGroup.add(book);
            }
        }

        function createBook(data, index) {
            const bookGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.05);
            const bookMaterial = new THREE.MeshLambertMaterial({
                color: data.color
            });
            const book = new THREE.Mesh(bookGeometry, bookMaterial);
            book.castShadow = true;
            book.receiveShadow = true;

            // Add book spine text (simplified)
            const spineGeometry = new THREE.PlaneGeometry(0.05, 0.6);
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(32, 256);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(data.title.substring(0, 15), 0, 8);
            ctx.restore();

            const spineTexture = new THREE.CanvasTexture(canvas);
            const spineMaterial = new THREE.MeshLambertMaterial({
                map: spineTexture
            });
            const spine = new THREE.Mesh(spineGeometry, spineMaterial);
            spine.position.set(0, 0, 0.026);
            book.add(spine);

            return book;
        }

        function createDecorations() {
            // Add a reading table
            const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
            const tableMaterial = new THREE.MeshLambertMaterial({
                color: 0x8B4513
            });
            const table = new THREE.Mesh(tableGeometry, tableMaterial);
            table.position.set(0, 0.8, 8);
            table.castShadow = true;
            table.receiveShadow = true;
            scene.add(table);

            // Table legs
            const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
            const legMaterial = new THREE.MeshLambertMaterial({
                color: 0x654321
            });

            const legPositions = [{
                    x: -0.9,
                    z: 0.4
                },
                {
                    x: 0.9,
                    z: 0.4
                },
                {
                    x: -0.9,
                    z: -0.4
                },
                {
                    x: 0.9,
                    z: -0.4
                }
            ];

            legPositions.forEach(pos => {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(pos.x, 0.4, 8 + pos.z);
                leg.castShadow = true;
                scene.add(leg);
            });

            // Add a chair
            const chairSeat = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.05, 0.8),
                new THREE.MeshLambertMaterial({
                    color: 0x8B4513
                })
            );
            chairSeat.position.set(0, 0.9, 10);
            chairSeat.castShadow = true;
            scene.add(chairSeat);

            const chairBack = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 1.2, 0.05),
                new THREE.MeshLambertMaterial({
                    color: 0x8B4513
                })
            );
            chairBack.position.set(0, 1.5, 10.4);
            chairBack.castShadow = true;
            scene.add(chairBack);
        }

        function setupControls() {
            // Movement controls
            const keys = {
                w: false,
                a: false,
                s: false,
                d: false,
                ArrowUp: false,
                ArrowLeft: false,
                ArrowDown: false,
                ArrowRight: false
            };

            document.addEventListener('keydown', (event) => {
                if (keys.hasOwnProperty(event.key)) {
                    keys[event.key] = true;
                }
                if (event.key === 'Escape') {
                    closeBook();
                }
            });

            document.addEventListener('keyup', (event) => {
                if (keys.hasOwnProperty(event.key)) {
                    keys[event.key] = false;
                }
            });

            // Mouse look
            let mouseX = 0,
                mouseY = 0;
            let isMouseDown = false;

            document.addEventListener('mousemove', (event) => {
                if (isMouseDown) {
                    const deltaX = event.clientX - mouseX;
                    const deltaY = event.clientY - mouseY;

                    camera.rotation.y -= deltaX * 0.002;
                    camera.rotation.x -= deltaY * 0.002;
                    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
                }

                mouseX = event.clientX;
                mouseY = event.clientY;

                // Update mouse for raycasting
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            });

            document.addEventListener('mousedown', () => {
                isMouseDown = true;
            });

            document.addEventListener('mouseup', () => {
                isMouseDown = false;
            });

            // Movement update function
            function updateMovement() {
                const speed = 0.1;
                const direction = new THREE.Vector3();

                if (keys.w || keys.ArrowUp) direction.z -= speed;
                if (keys.s || keys.ArrowDown) direction.z += speed;
                if (keys.a || keys.ArrowLeft) direction.x -= speed;
                if (keys.d || keys.ArrowRight) direction.x += speed;

                if (direction.length() > 0) {
                    direction.applyQuaternion(camera.quaternion);
                    camera.position.add(direction);

                    // Boundary constraints
                    camera.position.x = Math.max(-14, Math.min(14, camera.position.x));
                    camera.position.z = Math.max(-14, Math.min(14, camera.position.z));
                    camera.position.y = Math.max(1.6, Math.min(6, camera.position.y));

                    updateMinimap();
                }
            }

            // Add movement to animation loop
            this.updateMovement = updateMovement;
        }

        function setupEventListeners() {
            // Click to interact with books
            document.addEventListener('click', onDocumentClick);

            // Window resize
            window.addEventListener('resize', onWindowResize);

            // Close dropdowns when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.genre-dropdown')) {
                    document.getElementById('genreDropdown').classList.remove('show');
                }
            });

            // Initialize bookmarks on load
            updateBookmarksList();
        }

        function onDocumentClick(event) {
            // Don't process clicks on UI elements
            if (event.target.closest('.ui-overlay')) return;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(books);

            if (intersects.length > 0) {
                const book = intersects[0].object;
                if (book.userData && book.userData.isBook) {
                    openBook(book.userData.bookData);
                }
            }
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            // Update movement
            if (this.updateMovement) {
                this.updateMovement();
            }

            // Book hover effect with tooltip
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(books);

            // Reset previous hover
            if (hoveredBook) {
                hoveredBook.scale.set(1, 1, 1);
                hoveredBook = null;
                hideTooltip();
            }

            // Apply hover effect and show tooltip
            if (intersects.length > 0) {
                const book = intersects[0].object;
                if (book.userData && book.userData.isBook && shouldShowBook(book.userData.bookData)) {
                    book.scale.set(1.1, 1.1, 1.1);
                    hoveredBook = book;
                    document.body.style.cursor = 'pointer';
                    showTooltip(book.userData.bookData.title, mouse.x, mouse.y);
                } else {
                    document.body.style.cursor = 'none';
                }
            } else {
                document.body.style.cursor = 'none';
            }

            renderer.render(scene, camera);
        }

        // New UI Functions
        function setActiveNav(element, section) {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            element.classList.add('active');
        }

        function toggleGenreDropdown() {
            const dropdown = document.getElementById('genreDropdown');
            dropdown.classList.toggle('show');
        }

        function filterByGenre(genre) {
            currentFilter = genre;
            updateBookVisibility();
            toggleGenreDropdown();
        }

        function searchBooks() {
            const searchInput = document.getElementById('searchInput');
            searchQuery = searchInput.value.toLowerCase();

            // Visual feedback for search
            if (searchQuery.length > 0) {
                searchInput.style.background = 'rgba(255, 215, 0, 0.1)';
            } else {
                searchInput.style.background = 'rgba(255, 255, 255, 0.1)';
            }

            updateBookVisibility();
        }

        function shouldShowBook(bookData) {
            const matchesFilter = currentFilter === 'all' || bookData.genre === currentFilter;
            const matchesSearch = searchQuery === '' ||
                bookData.title.toLowerCase().includes(searchQuery) ||
                bookData.author.toLowerCase().includes(searchQuery) ||
                bookData.genre.toLowerCase().includes(searchQuery);
            return matchesFilter && matchesSearch;
        }

        function updateBookVisibility() {
            books.forEach(book => {
                if (book.userData && book.userData.bookData) {
                    const bookData = book.userData.bookData;
                    const matchesFilter = currentFilter === 'all' || bookData.genre === currentFilter;
                    const matchesSearch = searchQuery === '' ||
                        bookData.title.toLowerCase().includes(searchQuery) ||
                        bookData.author.toLowerCase().includes(searchQuery) ||
                        bookData.genre.toLowerCase().includes(searchQuery);

                    book.visible = matchesFilter && matchesSearch;

                    // Add pulsing animation for search matches
                    if (searchQuery.length > 0 && matchesSearch) {
                        gsap.to(book.scale, {
                            duration: 0.5,
                            yoyo: true,
                            repeat: -1,
                            x: 1.05,
                            y: 1.05,
                            z: 1.05,
                            ease: "sine.inOut"
                        });
                    } else {
                        gsap.killTweensOf(book.scale);
                        book.scale.set(1, 1, 1);
                    }
                }
            });
        }

        function showTooltip(text, mouseX, mouseY) {
            const tooltip = document.getElementById('bookTooltip');
            tooltip.textContent = text;
            tooltip.style.left = (mouseX / window.innerWidth) * 100 + '%';
            tooltip.style.top = (mouseY / window.innerHeight) * 100 + '%';
            tooltip.classList.add('show');
        }

        function hideTooltip() {
            const tooltip = document.getElementById('bookTooltip');
            tooltip.classList.remove('show');
        }

        function toggleBookmarks() {
            const sidebar = document.getElementById('bookmarksSidebar');
            sidebar.classList.toggle('open');
            if (sidebar.classList.contains('open')) {
                updateBookmarksList();
            }
        }

        function updateBookmarksList() {
            const bookmarksList = document.getElementById('bookmarksList');

            if (bookmarks.length === 0) {
                bookmarksList.innerHTML = '<div class="empty-bookmarks">No bookmarks yet. Click the bookmark button on any book to save it here!</div>';
                return;
            }

            bookmarksList.innerHTML = bookmarks.map(bookmark => `
                <div class="bookmark-item" onclick="openBookmarkDetails('${bookmark.id}')">
                    <div class="bookmark-title">${bookmark.title}</div>
                    <div class="bookmark-author">by ${bookmark.author}</div>
                    <div class="bookmark-genre">${bookmark.genre}</div>
                    <div class="bookmark-actions">
                        <button class="bookmark-btn" onclick="event.stopPropagation(); window.open('${bookmark.wikipediaUrl}', '_blank')">Read More</button>
                        <button class="bookmark-btn" onclick="event.stopPropagation(); removeBookmark('${bookmark.id}')">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        function openBookmarkDetails(bookId) {
            const foundBook = bookData.find(book => book.id === bookId);
            if (foundBook) {
                openBook(foundBook);
                toggleBookmarks();
            }
        }

        function removeBookmark(bookId) {
            bookmarks = bookmarks.filter(bookmark => bookmark.id !== bookId);
            localStorage.setItem('libraryBookmarks', JSON.stringify(bookmarks));
            updateBookmarksList();
        }

        function toggleMusic() {
            const musicToggle = document.querySelector('.music-toggle');
            isMusicPlaying = !isMusicPlaying;

            if (isMusicPlaying) {
                musicToggle.textContent = '🎵 Music: ON';
                backgroundMusic.play().catch(e => {
                    console.log("Autoplay prevented. Please interact with the page first.");
                    musicToggle.textContent = '🎵 Music: OFF';
                    isMusicPlaying = false;
                });
            } else {
                musicToggle.textContent = '🎵 Music: OFF';
                backgroundMusic.pause();
            }
        }

        function toggleAIAssistant() {
            const messages = [
                "🤖 Hello! I'm here to recommend great reads in your favorite genres.",
                "📚 I recommend starting with classics if you're new to literature!",
                "🔍 Try searching for books by your favorite author!",
                "⭐ Don't forget to bookmark books you want to read later!",
                "🌙 Night mode creates a cozy reading atmosphere!",
                "📖 A chapter a day keeps reality away!",
                "✨ Let your imagination travel farther than your feet ever could.",
                "🔖 Mark the moments that moved you — your bookmarks tell your story.",
                "📘 Every book holds a universe waiting to be explored.",
                "💬 Words have power — and you hold that power with every page you turn.",
                "🌟 Great stories stay with you, even after the last page.",
                "🕰 No time is ever wasted when you're reading.",
                "🎧 Try audiobooks for a hands-free literary escape!",
                "🌍 Reading one book is like living many lives — start your next one today!",
                "☕ Pair a warm drink with a good book for the perfect reading session.",
                "📱 Switching to ebook mode? Your library travels with you!",
                "🔥 Some stories spark fires — find the one that lights yours.",
                "🧠 Feed your mind with ideas, one paragraph at a time.",
                "📈 Track your reading streak and celebrate your progress!",
                "🌈 Fiction or nonfiction — every genre has its own magic.",
                "🎨 Let books color your thoughts and brighten your world.",
                "💡 Need inspiration? The right quote might change your day.",
                "📅 Even 10 minutes of reading a day builds a lifetime habit.",
                "🧳 Books are the best travel companions — no passport needed.",
                "🔄 Revisiting a favorite book is like catching up with an old friend."
            ];

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            alert(randomMessage);
        }

        function openBook(bookData) {
            currentBookData = bookData;
            const bookInfo = document.getElementById('bookInfo');
            document.getElementById('bookTitle').textContent = bookData.title;
            document.getElementById('bookAuthor').textContent = `by ${bookData.author}`;
            document.getElementById('bookSummary').textContent = bookData.summary;
            document.getElementById('progressFill').style.width = bookData.progress + '%';
            document.getElementById('progressText').textContent = bookData.progress + '%';

            // Smooth camera transition to book
            gsap.to(camera.position, {
                duration: 1,
                ease: "power2.inOut"
            });

            bookInfo.classList.add('show');
        }

        function closeBook() {
            const bookInfo = document.getElementById('bookInfo');
            bookInfo.classList.remove('show');
            currentBookData = null;
        }

        function readMore() {
            if (currentBookData && currentBookData.wikipediaUrl) {
                window.open(currentBookData.wikipediaUrl, '_blank');
                // Update reading progress
                currentBookData.progress = Math.min(100, currentBookData.progress + 5);
                document.getElementById('progressFill').style.width = currentBookData.progress + '%';
                document.getElementById('progressText').textContent = currentBookData.progress + '%';
            }
        }

        function addToBookmarks() {
            if (currentBookData) {
                const existingBookmark = bookmarks.find(b => b.id === currentBookData.id);
                if (!existingBookmark) {
                    bookmarks.push({
                        id: currentBookData.id,
                        title: currentBookData.title,
                        author: currentBookData.author,
                        genre: currentBookData.genre,
                        wikipediaUrl: currentBookData.wikipediaUrl,
                        dateAdded: new Date().toLocaleDateString()
                    });
                    localStorage.setItem('libraryBookmarks', JSON.stringify(bookmarks));
                    updateBookmarksList();

                    // Show success animation
                    gsap.fromTo('.btn-secondary', {
                        scale: 1
                    }, {
                        scale: 1.1,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1
                    });

                    alert('📚 Book added to your bookmarks!');
                } else {
                    alert('📖 This book is already in your bookmarks!');
                }
            }
        }

        function recommendBook() {
            if (currentBookData) {
                const message = `I recommend "${currentBookData.title}" by ${currentBookData.author}. ${currentBookData.summary.substring(0, 100)}... Check it out: ${currentBookData.wikipediaUrl}`;

                if (navigator.share) {
                    navigator.share({
                        title: `Book Recommendation: ${currentBookData.title}`,
                        text: message,
                        url: currentBookData.wikipediaUrl
                    });
                } else {
                    // Fallback to copying to clipboard
                    navigator.clipboard.writeText(message).then(() => {
                        alert('📋 Book recommendation copied to clipboard!');
                    });
                }
            }
        }

        function toggleDayNight() {
            isDayMode = !isDayMode;
            const toggle = document.querySelector('.mode-toggle');

            if (isDayMode) {
                // Day mode
                dayLight.visible = true;
                nightLight.visible = false;
                ambientLight.intensity = 0.6;
                scene.fog.color.setHex(0x87CEEB);
                renderer.setClearColor(0x87CEEB);
                toggle.textContent = '☀️ Day Mode';
            } else {
                // Night mode
                dayLight.visible = false;
                nightLight.visible = true;
                ambientLight.intensity = 0.3;
                scene.fog.color.setHex(0x1a1a2e);
                renderer.setClearColor(0x1a1a2e);
                toggle.textContent = '🌙 Night Mode';
            }
        }

        function initMinimap() {
            const canvas = document.getElementById('minimapCanvas');
            const ctx = canvas.getContext('2d');
            updateMinimap();
        }

        function updateMinimap() {
            const canvas = document.getElementById('minimapCanvas');
            const ctx = canvas.getContext('2d');

            // Clear canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw library outline
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

            // Draw bookshelves
            ctx.fillStyle = '#8B4513';
            const shelfPositions = [{
                    x: 50,
                    y: 30
                }, {
                    x: 98,
                    y: 30
                }, {
                    x: 146,
                    y: 30
                },
                {
                    x: 30,
                    y: 60
                }, {
                    x: 166,
                    y: 60
                },
                {
                    x: 70,
                    y: 90
                }, {
                    x: 126,
                    y: 90
                }
            ];

            shelfPositions.forEach(pos => {
                ctx.fillRect(pos.x - 8, pos.y - 4, 16, 8);
            });

            // Draw player position
            const playerX = ((camera.position.x + 15) / 30) * (canvas.width - 20) + 10;
            const playerY = ((camera.position.z + 15) / 30) * (canvas.height - 20) + 10;

            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(playerX, playerY, 3, 0, Math.PI * 2);
            ctx.fill();

            // Draw player direction
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(playerX, playerY);
            ctx.lineTo(
                playerX + Math.sin(camera.rotation.y) * 10,
                playerY + Math.cos(camera.rotation.y) * 10
            );
            ctx.stroke();
        }

        // Initialize the application
        init();
