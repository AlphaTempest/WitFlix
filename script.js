// WitFlix için JavaScript kodları - Ana dosya

document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde tüm filmler bölümünü gizle
    const allMoviesSection = document.getElementById('all-movies-section');
    if (allMoviesSection) {
        allMoviesSection.style.display = 'none';
    }
    
    // Popüler filmleri yükle
    populatePopularNow();
    
    // Önerilen filmleri rastgele seç ve yükle
    populateRecommended();
    
    // Film resimlerini ayarla
    setMovieImages();
    
    // Öne çıkan film carousel'ini başlat
    initFeaturedCarousel();
    
    // Navigasyon linklerine tıklama olayları ekle
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Logo tıklama olayı - ana sayfaya dön
    const homeLogo = document.getElementById('home-logo');
    
    if (homeLogo) {
        homeLogo.addEventListener('click', function() {
            goToMainPage();
        });
    }

    // Film oynatma butonlarına tıklama olayları ekle
    const moviePlayButtons = document.querySelectorAll('.movie-play-button');
    
    moviePlayButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieCard = this.closest('.movie-card');
            const movieTitle = movieCard.querySelector('h3').textContent;
            const movieInfo = movieCard.querySelector('p').textContent;
            
            document.querySelector('.movie-title').textContent = movieTitle;
            document.querySelector('.movie-description').textContent = 
                `Watch "${movieTitle}". ${movieInfo} A great movie.`;
            
            setMovieDetailsBackground(movieTitle);
            
            document.getElementById('movie-details').style.display = 'flex';
            
            document.querySelector('.featured-video').style.display = 'none';
            document.querySelectorAll('.recommended, .all-movies').forEach(section => {
                section.style.display = 'none';
            });
            document.querySelector('.site-footer').style.display = 'none';
            document.querySelector('.navbar').style.display = 'none';
        });
    });

    // Öne çıkan film oynatma butonu olayı
    const playButton = document.querySelector('.play-button');
    
    playButton.addEventListener('click', function() {
        const currentMovie = featuredMovies[currentFeaturedIndex];
        
        document.querySelector('.movie-title').textContent = currentMovie.title;
        document.querySelector('.movie-description').textContent = 
            `Watch "${currentMovie.title}". ${currentMovie.description} A great movie.`;
        
        setMovieDetailsBackground(currentMovie.title);
        
        document.getElementById('movie-details').style.display = 'flex';
        
        document.querySelector('.featured-video').style.display = 'none';
        document.querySelectorAll('.recommended, .all-movies').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector('.site-footer').style.display = 'none';
        document.querySelector('.navbar').style.display = 'none';
    });

    // Geri dönme butonu fonksiyonu
    window.goBack = function() {
        document.getElementById('movie-details').style.display = 'none';
        
        const allMoviesSection = document.getElementById('all-movies-section');
        if (allMoviesSection && allMoviesSection.style.display === 'block') {
            allMoviesSection.style.display = 'none';
            document.querySelector('.featured-video').style.display = 'flex';
            document.querySelectorAll('.recommended, .all-movies').forEach(section => {
                if (section.id !== 'all-movies-section') {
                    section.style.display = 'block';
                }
            });
        } else {
            document.querySelector('.featured-video').style.display = 'flex';
            document.querySelectorAll('.recommended, .all-movies').forEach(section => {
                if (section.id !== 'all-movies-section') {
                    section.style.display = 'block';
                }
            });
        }
        
        document.querySelector('.site-footer').style.display = 'flex';
        document.querySelector('.navbar').style.display = 'block';
    };

    // Arama fonksiyonu - film arama ve filtreleme
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        const movieCards = document.querySelectorAll('.movie-card');
        const featuredVideo = document.querySelector('.featured-video');
        const allMoviesSection = document.getElementById('all-movies-section');
        
        if (searchTerm.length > 0) {
            featuredVideo.style.display = 'none';
            if (allMoviesSection) {
                allMoviesSection.style.display = 'none';
            }
        } else {
            featuredVideo.style.display = 'flex';
            if (allMoviesSection) {
                allMoviesSection.style.display = 'none';
            }
        }
        
        movieCards.forEach(card => {
            const movieTitle = card.querySelector('h3').textContent.toLowerCase();
            const movieInfo = card.querySelector('p').textContent.toLowerCase();
            
            if (movieTitle.includes(searchTerm) || movieInfo.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Tüm filmleri listele butonu olayı
    const listAllButton = document.querySelector('.list-all-button');
    
    if (listAllButton) {
        listAllButton.addEventListener('click', function(e) {
            e.preventDefault();
            showAllMovies();
        });
    }
    
    // Kaydırma efekti - navbar arka plan rengini değiştir
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
    });
});

// Önerilen filmleri rastgele seçme ve yükleme fonksiyonu
function populateRecommended() {
    // Tüm film verilerini içeren dizi
    const allMovies = [
        { title: 'Death Game', info: 'Action • 2024', description: 'A deadly tournament brings together the world\'s most skilled fighters in a battle for survival and ultimate glory. As the competition intensifies, one fighter discovers that the game is rigged and must fight not just for victory, but to expose the dark conspiracy behind it all.' },
        { title: 'Last Warrior', info: 'Action • 2023', description: 'The final surviving member of an ancient warrior clan emerges from hiding to protect his village from an invading army of ruthless mercenaries. With his legendary fighting skills and unbreakable spirit, he becomes the last hope for his people in a world where honor and tradition are fading fast.' },
        { title: 'Valley of Wolves', info: 'Action • 2023', description: 'A lone wolf hunter ventures into a treacherous valley where a pack of supernatural wolves has been terrorizing local villages. As he tracks the alpha wolf, he discovers that the creatures are not what they seem and that the valley holds secrets that could change the balance between man and nature forever.' },
        { title: 'Shadow Warrior', info: 'Action • 2022', description: 'A master of stealth and deception infiltrates a powerful criminal organization to rescue his kidnapped sister. As he moves deeper into the shadowy world of organized crime, he must use every trick in his arsenal to outmaneuver enemies who are just as deadly and cunning as he is.' },
        { title: 'Immortal War', info: 'Action • 2022', description: 'Two immortal warriors who have been locked in an endless battle for centuries must finally face their ultimate destiny. When a greater threat emerges that could destroy both their worlds, they must put aside their ancient rivalry and join forces to prevent the apocalypse that has been foretold for millennia.' },
        { title: 'Dark Path', info: 'Drama • 2024', description: 'A troubled detective investigates a series of mysterious disappearances that lead him down a path of darkness and corruption within his own police department. As he uncovers the truth, he must confront his own demons and decide whether justice is worth the price of his soul.' },
        { title: 'Last Hope', info: 'Drama • 2024', description: 'A terminally ill patient becomes the subject of an experimental treatment that could save countless lives but comes with unimaginable risks. As the treatment progresses, she must grapple with the ethical implications of her choice and the impact it will have on those she loves most.' },
        { title: 'Lonely Heart', info: 'Drama • 2024', description: 'A reclusive writer finds unexpected love when a mysterious stranger moves into the apartment next door, bringing light into her isolated world. As their relationship deepens, she discovers that love can heal old wounds but also reveal painful truths about herself and her past.' },
        { title: 'Unforgettable Memories', info: 'Drama • 2023', description: 'A woman suffering from early-onset Alzheimer\'s disease decides to document her life story before her memories fade away completely. Through the process of writing her memoir, she rediscovers forgotten moments of joy and learns to cherish every precious memory while she still can.' },
        { title: 'Last Farewell', info: 'Drama • 2023', description: 'A family gathers for what they believe will be their final Christmas together as their patriarch battles a terminal illness. As they share stories and memories, they discover that saying goodbye is never easy, but love has a way of transcending even the most difficult farewells.' },
        { title: 'Crazy Days', info: 'Comedy • 2024', description: 'A chaotic week in the life of a dysfunctional family reaches new heights of hilarity when unexpected guests arrive and nothing goes according to plan. As the madness escalates, they realize that sometimes the best memories are made when everything goes completely wrong.' },
        { title: 'Lucky Fortune', info: 'Comedy • 2023', description: 'A down-on-his-luck man suddenly inherits a fortune from a long-lost relative, but the inheritance comes with a series of increasingly absurd conditions. As he tries to fulfill the bizarre requirements, he discovers that money can\'t buy happiness, but it can certainly create some unforgettable adventures.' },
        { title: 'Mixed Affairs', info: 'Comedy • 2023', description: 'A dating app developer finds himself caught in a web of romantic confusion when his app accidentally matches him with multiple people simultaneously. As he tries to navigate the hilarious complications, he learns valuable lessons about love, honesty, and the importance of being true to oneself.' },
        { title: 'Laughter Guarantee', info: 'Comedy • 2022', description: 'A struggling comedian makes a bold promise to his audience that he will make them laugh or give them their money back, leading to increasingly desperate and outrageous attempts to fulfill his guarantee. As his antics become more extreme, he discovers that sometimes the best comedy comes from genuine human connection.' },
        { title: 'Happy Ending', info: 'Comedy • 2022', description: 'A romantic comedy writer who has never experienced true love decides to live out the plot of her own screenplay to find inspiration for her next book. As she follows her fictional story, she discovers that real life is much more complicated and wonderful than anything she could have written.' },
        { title: 'Dark House', info: 'Horror • 2024', description: 'A family moves into their dream home only to discover that the house has a dark history and is haunted by malevolent spirits that feed on fear and despair. As the supernatural activity intensifies, they must uncover the house\'s terrible secrets before it\'s too late to escape with their lives and sanity intact.' },
        { title: 'Shadow Chase', info: 'Horror • 2023', description: 'A paranormal investigator becomes trapped in a maze-like building where shadows come to life and hunt down anyone who dares to enter. As he desperately searches for a way out, he realizes that the shadows are not just trying to kill him, but are slowly consuming his very essence.' },
        { title: 'Night of Death', info: 'Horror • 2023', description: 'A small town is terrorized by a mysterious killer who only strikes during the darkest hours of the night, leaving behind gruesome scenes that defy explanation. As the body count rises, the townspeople must band together to survive the night and uncover the horrifying truth behind the killings.' },
        { title: 'Cursed Inheritance', info: 'Horror • 2022', description: 'A woman inherits an ancient family estate only to discover that the property comes with a centuries-old curse that has claimed the lives of everyone who has ever owned it. As she tries to break the curse, she uncovers dark family secrets that are more terrifying than the supernatural forces she faces.' },
        { title: 'Fear Tunnel', info: 'Horror • 2022', description: 'A group of friends exploring an abandoned subway tunnel find themselves trapped in a nightmare world where their deepest fears become reality. As they struggle to find their way out, they must confront not only the horrors around them, but the darkness within their own hearts.' },
        { title: 'Love Wind', info: 'Romance • 2024', description: 'A free-spirited artist and a reserved businessman find themselves drawn together by a mysterious wind that seems to guide their paths toward each other. As their love story unfolds against the backdrop of changing seasons, they discover that sometimes the heart knows what the mind cannot understand.' },
        { title: 'Heartbeats', info: 'Romance • 2023', description: 'Two people with heart conditions meet in a hospital waiting room and form an instant connection that transcends their medical circumstances. As they support each other through their health challenges, they learn that love can be the strongest medicine of all.' },
        { title: 'Spring of Love', info: 'Romance • 2023', description: 'A botanist studying rare flowers in a remote valley discovers that the local legend about a spring that can make people fall in love might be more than just a fairy tale. As she investigates the magical properties of the spring, she finds herself falling under its spell and into the arms of a mysterious local farmer.' },
        { title: 'Beautiful Love', info: 'Romance • 2022', description: 'A blind musician and a sighted photographer find themselves falling in love despite their different ways of experiencing the world. As they navigate the challenges of their relationship, they discover that true beauty lies not in what we see, but in how we feel and connect with each other.' },
        { title: 'Last Dance', info: 'Romance • 2022', description: 'Two former dance partners who haven\'t seen each other in twenty years are reunited when they\'re asked to perform one final dance together at their old studio\'s closing ceremony. As they rehearse their signature routine, old feelings resurface and they must decide whether to give their love story a second chance.' }
    ];
    
    // Rastgele 5 film seç - tekrar olmaması için kontrol
    const recommendedMovies = [];
    const usedIndices = new Set();
    
    while (recommendedMovies.length < 5) {
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            recommendedMovies.push(allMovies[randomIndex]);
        }
    }
    
    // Önerilen filmleri DOM'da güncelle
    const recommendedSection = document.querySelector('#home .movie-grid');
    const recommendedCards = recommendedSection.querySelectorAll('.movie-card');
    
    recommendedCards.forEach((card, index) => {
        if (recommendedMovies[index]) {
            card.querySelector('h3').textContent = recommendedMovies[index].title;
            card.querySelector('p').textContent = recommendedMovies[index].info;
        }
    });
}

// Film resimlerini ayarlama fonksiyonu - film kartlarına arka plan resmi ata
function setMovieImages() {
    // Film adı ve resim yolu eşleştirmesi
    const movieImageMap = {
        // Action
        'Death Game': './images/movies/action/death-game.png',
        'Last Warrior': './images/movies/action/last-warrior.png',
        'Valley of Wolves': './images/movies/action/valley-of-wolves.png',
        'Shadow Warrior': './images/movies/action/shadow-warrior.png',
        'Immortal War': './images/movies/action/immortal-war.png',
        
        // Drama
        'Dark Path': './images/movies/drama/dark-path.png',
        'Last Hope': './images/movies/drama/last-hope.png',
        'Lonely Heart': './images/movies/drama/lonely-heart.png',
        'Unforgettable Memories': './images/movies/drama/unforgettable-memories.png',
        'Last Farewell': './images/movies/drama/last-farewell.png',
        
        // Comedy
        'Crazy Days': './images/movies/comedy/crazy-days.png',
        'Lucky Fortune': './images/movies/comedy/lucky-fortune.png',
        'Mixed Affairs': './images/movies/comedy/mixed-affairs.png',
        'Laughter Guarantee': './images/movies/comedy/laughter-guarantee.png',
        'Happy Ending': './images/movies/comedy/happy-ending.png',
        
        // Horror
        'Dark House': './images/movies/horror/dark-house.png',
        'Shadow Chase': './images/movies/horror/shadow-chase.png',
        'Night of Death': './images/movies/horror/night-of-death.png',
        'Cursed Inheritance': './images/movies/horror/cursed-inheritance.png',
        'Fear Tunnel': './images/movies/horror/fear-tunnel.png',
        
        // Romance
        'Love Wind': './images/movies/romance/love-wind.png',
        'Heartbeats': './images/movies/romance/heartbeats.png',
        'Spring of Love': './images/movies/romance/spring-of-love.png',
        'Beautiful Love': './images/movies/romance/beautiful-love.png',
        'Last Dance': './images/movies/romance/last-dance.png'
    };
    
    // Tüm film kartlarına uygun resim ata
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        const movieTitle = card.querySelector('h3').textContent;
        const imagePath = movieImageMap[movieTitle];
        
        if (imagePath) {
            card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${imagePath}')`;
        }
    });
}

// Popüler filmleri rastgele seçme ve yükleme fonksiyonu
function populatePopularNow() {
    // Tüm film verilerini içeren dizi
    const allMovies = [
        { title: 'Death Game', info: 'Action • 2024', description: 'A deadly tournament brings together the world\'s most skilled fighters in a battle for survival and ultimate glory. As the competition intensifies, one fighter discovers that the game is rigged and must fight not just for victory, but to expose the dark conspiracy behind it all.' },
        { title: 'Last Warrior', info: 'Action • 2023', description: 'The final surviving member of an ancient warrior clan emerges from hiding to protect his village from an invading army of ruthless mercenaries. With his legendary fighting skills and unbreakable spirit, he becomes the last hope for his people in a world where honor and tradition are fading fast.' },
        { title: 'Valley of Wolves', info: 'Action • 2023', description: 'A lone wolf hunter ventures into a treacherous valley where a pack of supernatural wolves has been terrorizing local villages. As he tracks the alpha wolf, he discovers that the creatures are not what they seem and that the valley holds secrets that could change the balance between man and nature forever.' },
        { title: 'Shadow Warrior', info: 'Action • 2022', description: 'A master of stealth and deception infiltrates a powerful criminal organization to rescue his kidnapped sister. As he moves deeper into the shadowy world of organized crime, he must use every trick in his arsenal to outmaneuver enemies who are just as deadly and cunning as he is.' },
        { title: 'Immortal War', info: 'Action • 2022', description: 'Two immortal warriors who have been locked in an endless battle for centuries must finally face their ultimate destiny. When a greater threat emerges that could destroy both their worlds, they must put aside their ancient rivalry and join forces to prevent the apocalypse that has been foretold for millennia.' },
        { title: 'Dark Path', info: 'Drama • 2024', description: 'A troubled detective investigates a series of mysterious disappearances that lead him down a path of darkness and corruption within his own police department. As he uncovers the truth, he must confront his own demons and decide whether justice is worth the price of his soul.' },
        { title: 'Last Hope', info: 'Drama • 2024', description: 'A terminally ill patient becomes the subject of an experimental treatment that could save countless lives but comes with unimaginable risks. As the treatment progresses, she must grapple with the ethical implications of her choice and the impact it will have on those she loves most.' },
        { title: 'Lonely Heart', info: 'Drama • 2024', description: 'A reclusive writer finds unexpected love when a mysterious stranger moves into the apartment next door, bringing light into her isolated world. As their relationship deepens, she discovers that love can heal old wounds but also reveal painful truths about herself and her past.' },
        { title: 'Unforgettable Memories', info: 'Drama • 2023', description: 'A woman suffering from early-onset Alzheimer\'s disease decides to document her life story before her memories fade away completely. Through the process of writing her memoir, she rediscovers forgotten moments of joy and learns to cherish every precious memory while she still can.' },
        { title: 'Last Farewell', info: 'Drama • 2023', description: 'A family gathers for what they believe will be their final Christmas together as their patriarch battles a terminal illness. As they share stories and memories, they discover that saying goodbye is never easy, but love has a way of transcending even the most difficult farewells.' },
        { title: 'Crazy Days', info: 'Comedy • 2024', description: 'A chaotic week in the life of a dysfunctional family reaches new heights of hilarity when unexpected guests arrive and nothing goes according to plan. As the madness escalates, they realize that sometimes the best memories are made when everything goes completely wrong.' },
        { title: 'Lucky Fortune', info: 'Comedy • 2023', description: 'A down-on-his-luck man suddenly inherits a fortune from a long-lost relative, but the inheritance comes with a series of increasingly absurd conditions. As he tries to fulfill the bizarre requirements, he discovers that money can\'t buy happiness, but it can certainly create some unforgettable adventures.' },
        { title: 'Mixed Affairs', info: 'Comedy • 2023', description: 'A dating app developer finds himself caught in a web of romantic confusion when his app accidentally matches him with multiple people simultaneously. As he tries to navigate the hilarious complications, he learns valuable lessons about love, honesty, and the importance of being true to oneself.' },
        { title: 'Laughter Guarantee', info: 'Comedy • 2022', description: 'A struggling comedian makes a bold promise to his audience that he will make them laugh or give them their money back, leading to increasingly desperate and outrageous attempts to fulfill his guarantee. As his antics become more extreme, he discovers that sometimes the best comedy comes from genuine human connection.' },
        { title: 'Happy Ending', info: 'Comedy • 2022', description: 'A romantic comedy writer who has never experienced true love decides to live out the plot of her own screenplay to find inspiration for her next book. As she follows her fictional story, she discovers that real life is much more complicated and wonderful than anything she could have written.' },
        { title: 'Dark House', info: 'Horror • 2024', description: 'A family moves into their dream home only to discover that the house has a dark history and is haunted by malevolent spirits that feed on fear and despair. As the supernatural activity intensifies, they must uncover the house\'s terrible secrets before it\'s too late to escape with their lives and sanity intact.' },
        { title: 'Shadow Chase', info: 'Horror • 2023', description: 'A paranormal investigator becomes trapped in a maze-like building where shadows come to life and hunt down anyone who dares to enter. As he desperately searches for a way out, he realizes that the shadows are not just trying to kill him, but are slowly consuming his very essence.' },
        { title: 'Night of Death', info: 'Horror • 2023', description: 'A small town is terrorized by a mysterious killer who only strikes during the darkest hours of the night, leaving behind gruesome scenes that defy explanation. As the body count rises, the townspeople must band together to survive the night and uncover the horrifying truth behind the killings.' },
        { title: 'Cursed Inheritance', info: 'Horror • 2022', description: 'A woman inherits an ancient family estate only to discover that the property comes with a centuries-old curse that has claimed the lives of everyone who has ever owned it. As she tries to break the curse, she uncovers dark family secrets that are more terrifying than the supernatural forces she faces.' },
        { title: 'Fear Tunnel', info: 'Horror • 2022', description: 'A group of friends exploring an abandoned subway tunnel find themselves trapped in a nightmare world where their deepest fears become reality. As they struggle to find their way out, they must confront not only the horrors around them, but the darkness within their own hearts.' },
        { title: 'Love Wind', info: 'Romance • 2024', description: 'A free-spirited artist and a reserved businessman find themselves drawn together by a mysterious wind that seems to guide their paths toward each other. As their love story unfolds against the backdrop of changing seasons, they discover that sometimes the heart knows what the mind cannot understand.' },
        { title: 'Heartbeats', info: 'Romance • 2023', description: 'Two people with heart conditions meet in a hospital waiting room and form an instant connection that transcends their medical circumstances. As they support each other through their health challenges, they learn that love can be the strongest medicine of all.' },
        { title: 'Spring of Love', info: 'Romance • 2023', description: 'A botanist studying rare flowers in a remote valley discovers that the local legend about a spring that can make people fall in love might be more than just a fairy tale. As she investigates the magical properties of the spring, she finds herself falling under its spell and into the arms of a mysterious local farmer.' },
        { title: 'Beautiful Love', info: 'Romance • 2022', description: 'A blind musician and a sighted photographer find themselves falling in love despite their different ways of experiencing the world. As they navigate the challenges of their relationship, they discover that true beauty lies not in what we see, but in how we feel and connect with each other.' },
        { title: 'Last Dance', info: 'Romance • 2022', description: 'Two former dance partners who haven\'t seen each other in twenty years are reunited when they\'re asked to perform one final dance together at their old studio\'s closing ceremony. As they rehearse their signature routine, old feelings resurface and they must decide whether to give their love story a second chance.' }
    ];
    
    // Rastgele 5 film seç - tekrar olmaması için kontrol
    const popularMovies = [];
    const usedIndices = new Set();
    
    while (popularMovies.length < 5) {
        const randomIndex = Math.floor(Math.random() * allMovies.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            popularMovies.push(allMovies[randomIndex]);
        }
    }
    
    // Popüler filmleri DOM'da güncelle
    const popularSection = document.querySelector('#popular .movie-grid');
    const popularCards = popularSection.querySelectorAll('.movie-card');
    
    popularCards.forEach((card, index) => {
        if (popularMovies[index]) {
            card.querySelector('h3').textContent = popularMovies[index].title;
            card.querySelector('p').textContent = popularMovies[index].info;
        }
    });
}

// Ana sayfaya dönme fonksiyonu - tüm bölümleri sıfırla
function goToMainPage() {
    // Bölümleri gizle
    const allMoviesSection = document.getElementById('all-movies-section');
    if (allMoviesSection) {
        allMoviesSection.style.display = 'none';
    }
    document.getElementById('movie-details').style.display = 'none';
    
    // Ana sayfa bölümlerini göster
    document.querySelector('.featured-video').style.display = 'flex';
    document.querySelectorAll('.recommended, .all-movies').forEach(section => {
        if (section.id !== 'all-movies-section') {
            section.style.display = 'block';
        }
    });
    document.querySelector('.site-footer').style.display = 'flex';
    document.querySelector('.navbar').style.display = 'block';
    
    // Arama kutusunu temizle
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Sayfanın en üstüne kaydır
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Tüm filmleri göster fonksiyonu - ana sayfayı gizle, tüm filmler bölümünü göster
function showAllMovies() {
    populateAllMovies();
    
    // Ana sayfa bölümlerini gizle
    document.querySelector('.featured-video').style.display = 'none';
    document.querySelectorAll('.recommended, .all-movies').forEach(section => {
        if (section.id !== 'all-movies-section') {
            section.style.display = 'none';
        }
    });
    
    // Tüm filmler bölümünü göster
    const allMoviesSection = document.getElementById('all-movies-section');
    if (allMoviesSection) {
        allMoviesSection.style.display = 'block';
    }
    document.querySelector('.site-footer').style.display = 'flex';
    document.querySelector('.navbar').style.display = 'block';
    document.getElementById('movie-details').style.display = 'none';
    
    // Arama kutusunu temizle
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Tüm filmler bölümüne kaydır
    if (allMoviesSection) {
        allMoviesSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Tüm filmleri yükleme fonksiyonu - film verilerini hazırla ve DOM'a ekle
function populateAllMovies() {
    console.log('populateAllMovies started');
    
    // Tüm film verilerini içeren dizi
    const allMovies = [
        // Action
        { title: 'Death Game', info: 'Action • 2024', rating: '4.5/5 (1,876 reviews)', description: 'A deadly tournament brings together the world\'s most skilled fighters in a battle for survival and ultimate glory. As the competition intensifies, one fighter discovers that the game is rigged and must fight not just for victory, but to expose the dark conspiracy behind it all.' },
        { title: 'Last Warrior', info: 'Action • 2023', rating: '4.2/5 (1,543 reviews)', description: 'The final surviving member of an ancient warrior clan emerges from hiding to protect his village from an invading army of ruthless mercenaries. With his legendary fighting skills and unbreakable spirit, he becomes the last hope for his people in a world where honor and tradition are fading fast.' },
        { title: 'Valley of Wolves', info: 'Action • 2023', rating: '4.0/5 (987 reviews)', description: 'A lone wolf hunter ventures into a treacherous valley where a pack of supernatural wolves has been terrorizing local villages. As he tracks the alpha wolf, he discovers that the creatures are not what they seem and that the valley holds secrets that could change the balance between man and nature forever.' },
        { title: 'Shadow Warrior', info: 'Action • 2022', rating: '4.6/5 (2,234 reviews)', description: 'A master of stealth and deception infiltrates a powerful criminal organization to rescue his kidnapped sister. As he moves deeper into the shadowy world of organized crime, he must use every trick in his arsenal to outmaneuver enemies who are just as deadly and cunning as he is.' },
        { title: 'Immortal War', info: 'Action • 2022', rating: '4.3/5 (1,765 reviews)', description: 'Two immortal warriors who have been locked in an endless battle for centuries must finally face their ultimate destiny. When a greater threat emerges that could destroy both their worlds, they must put aside their ancient rivalry and join forces to prevent the apocalypse that has been foretold for millennia.' },
        
        // Drama
        { title: 'Dark Path', info: 'Drama • 2024', rating: '4.7/5 (2,891 reviews)', description: 'A troubled detective investigates a series of mysterious disappearances that lead him down a path of darkness and corruption within his own police department. As he uncovers the truth, he must confront his own demons and decide whether justice is worth the price of his soul.' },
        { title: 'Last Hope', info: 'Drama • 2024', rating: '4.4/5 (1,432 reviews)', description: 'A terminally ill patient becomes the subject of an experimental treatment that could save countless lives but comes with unimaginable risks. As the treatment progresses, she must grapple with the ethical implications of her choice and the impact it will have on those she loves most.' },
        { title: 'Lonely Heart', info: 'Drama • 2024', rating: '4.1/5 (756 reviews)', description: 'A reclusive writer finds unexpected love when a mysterious stranger moves into the apartment next door, bringing light into her isolated world. As their relationship deepens, she discovers that love can heal old wounds but also reveal painful truths about herself and her past.' },
        { title: 'Unforgettable Memories', info: 'Drama • 2023', rating: '4.5/5 (1,987 reviews)', description: 'A woman suffering from early-onset Alzheimer\'s disease decides to document her life story before her memories fade away completely. Through the process of writing her memoir, she rediscovers forgotten moments of joy and learns to cherish every precious memory while she still can.' },
        { title: 'Last Farewell', info: 'Drama • 2023', rating: '4.2/5 (1,234 reviews)', description: 'A family gathers for what they believe will be their final Christmas together as their patriarch battles a terminal illness. As they share stories and memories, they discover that saying goodbye is never easy, but love has a way of transcending even the most difficult farewells.' },
        
        // Comedy
        { title: 'Crazy Days', info: 'Comedy • 2024', rating: '4.0/5 (1,123 reviews)', description: 'A chaotic week in the life of a dysfunctional family reaches new heights of hilarity when unexpected guests arrive and nothing goes according to plan. As the madness escalates, they realize that sometimes the best memories are made when everything goes completely wrong.' },
        { title: 'Lucky Fortune', info: 'Comedy • 2023', rating: '4.3/5 (987 reviews)', description: 'A down-on-his-luck man suddenly inherits a fortune from a long-lost relative, but the inheritance comes with a series of increasingly absurd conditions. As he tries to fulfill the bizarre requirements, he discovers that money can\'t buy happiness, but it can certainly create some unforgettable adventures.' },
        { title: 'Mixed Affairs', info: 'Comedy • 2023', rating: '4.1/5 (654 reviews)', description: 'A dating app developer finds himself caught in a web of romantic confusion when his app accidentally matches him with multiple people simultaneously. As he tries to navigate the hilarious complications, he learns valuable lessons about love, honesty, and the importance of being true to oneself.' },
        { title: 'Laughter Guarantee', info: 'Comedy • 2022', rating: '4.4/5 (1,456 reviews)', description: 'A struggling comedian makes a bold promise to his audience that he will make them laugh or give them their money back, leading to increasingly desperate and outrageous attempts to fulfill his guarantee. As his antics become more extreme, he discovers that sometimes the best comedy comes from genuine human connection.' },
        { title: 'Happy Ending', info: 'Comedy • 2022', rating: '4.2/5 (1,789 reviews)', description: 'A romantic comedy writer who has never experienced true love decides to live out the plot of her own screenplay to find inspiration for her next book. As she follows her fictional story, she discovers that real life is much more complicated and wonderful than anything she could have written.' },
        
        // Horror
        { title: 'Dark House', info: 'Horror • 2024', rating: '4.6/5 (2,345 reviews)', description: 'A family moves into their dream home only to discover that the house has a dark history and is haunted by malevolent spirits that feed on fear and despair. As the supernatural activity intensifies, they must uncover the house\'s terrible secrets before it\'s too late to escape with their lives and sanity intact.' },
        { title: 'Shadow Chase', info: 'Horror • 2023', rating: '4.3/5 (1,678 reviews)', description: 'A paranormal investigator becomes trapped in a maze-like building where shadows come to life and hunt down anyone who dares to enter. As he desperately searches for a way out, he realizes that the shadows are not just trying to kill him, but are slowly consuming his very essence.' },
        { title: 'Night of Death', info: 'Horror • 2023', rating: '4.5/5 (2,123 reviews)', description: 'A small town is terrorized by a mysterious killer who only strikes during the darkest hours of the night, leaving behind gruesome scenes that defy explanation. As the body count rises, the townspeople must band together to survive the night and uncover the horrifying truth behind the killings.' },
        { title: 'Cursed Inheritance', info: 'Horror • 2022', rating: '4.2/5 (1,456 reviews)', description: 'A woman inherits an ancient family estate only to discover that the property comes with a centuries-old curse that has claimed the lives of everyone who has ever owned it. As she tries to break the curse, she uncovers dark family secrets that are more terrifying than the supernatural forces she faces.' },
        { title: 'Fear Tunnel', info: 'Horror • 2022', rating: '4.4/5 (1,987 reviews)', description: 'A group of friends exploring an abandoned subway tunnel find themselves trapped in a nightmare world where their deepest fears become reality. As they struggle to find their way out, they must confront not only the horrors around them, but the darkness within their own hearts.' },
        
        // Romance
        { title: 'Love Wind', info: 'Romance • 2024', rating: '4.5/5 (1,876 reviews)', description: 'A free-spirited artist and a reserved businessman find themselves drawn together by a mysterious wind that seems to guide their paths toward each other. As their love story unfolds against the backdrop of changing seasons, they discover that sometimes the heart knows what the mind cannot understand.' },
        { title: 'Heartbeats', info: 'Romance • 2023', rating: '4.3/5 (1,234 reviews)', description: 'Two people with heart conditions meet in a hospital waiting room and form an instant connection that transcends their medical circumstances. As they support each other through their health challenges, they learn that love can be the strongest medicine of all.' },
        { title: 'Spring of Love', info: 'Romance • 2023', rating: '4.6/5 (2,567 reviews)', description: 'A botanist studying rare flowers in a remote valley discovers that the local legend about a spring that can make people fall in love might be more than just a fairy tale. As she investigates the magical properties of the spring, she finds herself falling under its spell and into the arms of a mysterious local farmer.' },
        { title: 'Beautiful Love', info: 'Romance • 2022', rating: '4.2/5 (987 reviews)', description: 'A blind musician and a sighted photographer find themselves falling in love despite their different ways of experiencing the world. As they navigate the challenges of their relationship, they discover that true beauty lies not in what we see, but in how we feel and connect with each other.' },
        { title: 'Last Dance', info: 'Romance • 2022', rating: '4.4/5 (1,543 reviews)', description: 'Two former dance partners who haven\'t seen each other in twenty years are reunited when they\'re asked to perform one final dance together at their old studio\'s closing ceremony. As they rehearse their signature routine, old feelings resurface and they must decide whether to give their love story a second chance.' }
    ];
    
    console.log('Total movies to create:', allMovies.length); // Debug log
    
    const allMoviesGrid = document.getElementById('all-movies-grid');
    console.log('All movies grid found:', allMoviesGrid); // Debug log
    
    if (!allMoviesGrid) {
        console.error('All movies grid not found!');
        return;
    }
    
    // Mevcut içeriği temizle
    allMoviesGrid.innerHTML = '';
    
    // Tüm film kartlarını oluştur
    for (let i = 0; i < allMovies.length; i++) {
        const movie = allMovies[i];
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('./images/movies/placeholder.png')`;
        
        movieCard.innerHTML = `
            <div class="movie-overlay">
                <h3>${movie.title}</h3>
                <p>${movie.info}</p>
                <div class="movie-rating">
                    <span class="star">★</span>
                    <span class="rating-text">${movie.rating}</span>
                </div>
            </div>
            <button class="movie-play-button">▶ Play</button>
        `;
        
        allMoviesGrid.appendChild(movieCard);
        console.log(`Created movie ${i + 1}: ${movie.title}`); // Debug log
    }
    
    console.log('Total movie cards created:', allMoviesGrid.children.length); // Debug log
    
    // Film resimlerini ayarla
    setAllMoviesImages();
    
    // Oynatma butonlarına olay dinleyicileri ekle
    const newPlayButtons = allMoviesGrid.querySelectorAll('.movie-play-button');
    console.log('Play buttons found:', newPlayButtons.length); // Debug log
    
    newPlayButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieCard = this.closest('.movie-card');
            const movieTitle = movieCard.querySelector('h3').textContent;
            const movieInfo = movieCard.querySelector('p').textContent;
            
            document.querySelector('.movie-title').textContent = movieTitle;
            document.querySelector('.movie-description').textContent = 
                `Watch "${movieTitle}". ${movieInfo} A great movie.`;
            
            // Film detayları arka plan resmini ayarla
            setMovieDetailsBackground(movieTitle);
            
            document.getElementById('movie-details').style.display = 'flex';
            const allMoviesSection = document.getElementById('all-movies-section');
            if (allMoviesSection) {
                allMoviesSection.style.display = 'none';
            }
            document.querySelector('.site-footer').style.display = 'none';
            document.querySelector('.navbar').style.display = 'none';
        });
    });
}

// Film detayları arka plan resmini ayarlama fonksiyonu - film detay sayfası için
function setMovieDetailsBackground(movieTitle) {
    // Film adı ve resim yolu eşleştirmesi
    const movieImageMap = {
        // Action
        'Death Game': './images/movies/action/death-game.png',
        'Last Warrior': './images/movies/action/last-warrior.png',
        'Valley of Wolves': './images/movies/action/valley-of-wolves.png',
        'Shadow Warrior': './images/movies/action/shadow-warrior.png',
        'Immortal War': './images/movies/action/immortal-war.png',
        
        // Drama
        'Dark Path': './images/movies/drama/dark-path.png',
        'Last Hope': './images/movies/drama/last-hope.png',
        'Lonely Heart': './images/movies/drama/lonely-heart.png',
        'Unforgettable Memories': './images/movies/drama/unforgettable-memories.png',
        'Last Farewell': './images/movies/drama/last-farewell.png',
        
        // Comedy
        'Crazy Days': './images/movies/comedy/crazy-days.png',
        'Lucky Fortune': './images/movies/comedy/lucky-fortune.png',
        'Mixed Affairs': './images/movies/comedy/mixed-affairs.png',
        'Laughter Guarantee': './images/movies/comedy/laughter-guarantee.png',
        'Happy Ending': './images/movies/comedy/happy-ending.png',
        
        // Horror
        'Dark House': './images/movies/horror/dark-house.png',
        'Shadow Chase': './images/movies/horror/shadow-chase.png',
        'Night of Death': './images/movies/horror/night-of-death.png',
        'Cursed Inheritance': './images/movies/horror/cursed-inheritance.png',
        'Fear Tunnel': './images/movies/horror/fear-tunnel.png',
        
        // Romance
        'Love Wind': './images/movies/romance/love-wind.png',
        'Heartbeats': './images/movies/romance/heartbeats.png',
        'Spring of Love': './images/movies/romance/spring-of-love.png',
        'Beautiful Love': './images/movies/romance/beautiful-love.png',
        'Last Dance': './images/movies/romance/last-dance.png',
        
        // Featured movies
        'Sword and Shadow': './images/movies/featuredmovie/featuredmovie.png',
        'Sky and Moon': './images/movies/featuredmovie/featuredmovie2.png',
        'The Assassin': './images/movies/featuredmovie/featuredmovie3.png',
        'Origins': './images/movies/featuredmovie/featuredmovie4.png',
        'The Horde': './images/movies/featuredmovie/featuredmovie5.png'
    };
    
    const movieDetails = document.getElementById('movie-details');
    const imagePath = movieImageMap[movieTitle];
    
    if (imagePath) {
        movieDetails.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%), url('${imagePath}')`;
    } else {
        // Film bulunamazsa öne çıkan film resmini kullan
        movieDetails.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.4) 100%), url('./images/movies/featuredmovie/featuredmovie.png')`;
    }
}

// Tüm filmler için resim ayarlama fonksiyonu - tüm filmler bölümü için
function setAllMoviesImages() {
    // Film adı ve resim yolu eşleştirmesi
    const movieImageMap = {
        // Action
        'Death Game': './images/movies/action/death-game.png',
        'Last Warrior': './images/movies/action/last-warrior.png',
        'Valley of Wolves': './images/movies/action/valley-of-wolves.png',
        'Shadow Warrior': './images/movies/action/shadow-warrior.png',
        'Immortal War': './images/movies/action/immortal-war.png',
        
        // Drama
        'Dark Path': './images/movies/drama/dark-path.png',
        'Last Hope': './images/movies/drama/last-hope.png',
        'Lonely Heart': './images/movies/drama/lonely-heart.png',
        'Unforgettable Memories': './images/movies/drama/unforgettable-memories.png',
        'Last Farewell': './images/movies/drama/last-farewell.png',
        
        // Comedy
        'Crazy Days': './images/movies/comedy/crazy-days.png',
        'Lucky Fortune': './images/movies/comedy/lucky-fortune.png',
        'Mixed Affairs': './images/movies/comedy/mixed-affairs.png',
        'Laughter Guarantee': './images/movies/comedy/laughter-guarantee.png',
        'Happy Ending': './images/movies/comedy/happy-ending.png',
        
        // Horror
        'Dark House': './images/movies/horror/dark-house.png',
        'Shadow Chase': './images/movies/horror/shadow-chase.png',
        'Night of Death': './images/movies/horror/night-of-death.png',
        'Cursed Inheritance': './images/movies/horror/cursed-inheritance.png',
        'Fear Tunnel': './images/movies/horror/fear-tunnel.png',
        
        // Romance
        'Love Wind': './images/movies/romance/love-wind.png',
        'Heartbeats': './images/movies/romance/heartbeats.png',
        'Spring of Love': './images/movies/romance/spring-of-love.png',
        'Beautiful Love': './images/movies/romance/beautiful-love.png',
        'Last Dance': './images/movies/romance/last-dance.png'
    };
    
    const allMoviesCards = document.querySelectorAll('#all-movies-grid .movie-card');
    
    allMoviesCards.forEach(card => {
        const movieTitle = card.querySelector('h3').textContent;
        const imagePath = movieImageMap[movieTitle];
        
        if (imagePath) {
            card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${imagePath}')`;
        }
    });
} 

// Öne çıkan filmler carousel sistemi - değişkenler ve veriler
let currentFeaturedIndex = 0;
let featuredMovies = [
    { title: 'Sword and Shadow', description: 'A master samurai embarks on a perilous journey to avenge his fallen clan and restore honor to his family name. As he delves deeper into the shadows of feudal Japan, he discovers ancient secrets that could change the course of history forever.', image: './images/movies/featuredmovie/featuredmovie.png' },
    { title: 'Sky and Moon', description: 'Two star-crossed lovers find themselves separated by an impossible distance when one is chosen to become a celestial guardian of the night sky. Their love story spans across time and space as they fight against cosmic forces to reunite in a world where dreams and reality collide.', image: './images/movies/featuredmovie/featuredmovie2.png' },
    { title: 'The Assassin', description: 'A legendary hitman with a mysterious past is forced out of retirement when his former organization targets his estranged daughter. As he navigates a world of betrayal and deception, he must confront his own dark history while protecting the only family he has left.', image: './images/movies/featuredmovie/featuredmovie3.png' },
    { title: 'Origins', description: 'A brilliant archaeologist discovers an ancient artifact that reveals the true beginning of human civilization, hidden beneath the ruins of a forgotten city. As she uncovers the shocking truth about humanity\'s origins, she must race against time to prevent a global catastrophe that could rewrite history itself.', image: './images/movies/featuredmovie/featuredmovie4.png' },
    { title: 'The Horde', description: 'A small group of survivors must band together to defend their fortified settlement against an overwhelming army of mutated creatures that have overrun the world. As they face impossible odds, they discover that the key to survival lies not just in fighting the horde, but in understanding what created them.', image: './images/movies/featuredmovie/featuredmovie5.png' }
];

// Öne çıkan filmler carousel'ini başlatma fonksiyonu - otomatik geçiş ve kontroller
function initFeaturedCarousel() {
    const featuredVideo = document.querySelector('.featured-video');
    const featuredOverlay = document.querySelector('.featured-overlay');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    if (!featuredVideo || !featuredOverlay) return;
    
    updateFeaturedMovie(0);
    
    // Önceki film butonu olayı
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevFeaturedMovie();
            resetAutoAdvanceTimer();
        });
    }
    
    // Sonraki film butonu olayı
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextFeaturedMovie();
            resetAutoAdvanceTimer();
        });
    }
    
    // Klavye ok tuşları ile kontrol
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('.featured-video').style.display !== 'none') {
            if (e.key === 'ArrowLeft') {
                prevFeaturedMovie();
                resetAutoAdvanceTimer();
            } else if (e.key === 'ArrowRight') {
                nextFeaturedMovie();
                resetAutoAdvanceTimer();
            }
        }
    });
    
    let autoAdvanceTimer;
    
    // Otomatik geçiş zamanlayıcısını başlat
    function startAutoAdvanceTimer() {
        autoAdvanceTimer = setTimeout(() => {
            nextFeaturedMovie();
            startAutoAdvanceTimer();
        }, 10000);
    }
    
    // Otomatik geçiş zamanlayıcısını sıfırla
    function resetAutoAdvanceTimer() {
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
        }
        startAutoAdvanceTimer();
    }
    
    startAutoAdvanceTimer();
}

// Öne çıkan filmi güncelleme fonksiyonu - film bilgilerini ve resmini değiştir
function updateFeaturedMovie(index) {
    const featuredVideo = document.querySelector('.featured-video');
    const featuredOverlay = document.querySelector('.featured-overlay');
    
    if (!featuredVideo || !featuredOverlay || !featuredMovies[index]) return;
    
    const movie = featuredMovies[index];
    
    // Film arka plan resmini güncelle
    featuredVideo.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${movie.image}')`;
    
    const titleElement = featuredOverlay.querySelector('h1');
    const descElement = featuredOverlay.querySelector('p');
    
    if (titleElement) titleElement.textContent = movie.title;
    if (descElement) descElement.textContent = movie.description;
    
    // Geçiş animasyonu
    featuredVideo.style.opacity = '0';
    setTimeout(() => {
        featuredVideo.style.opacity = '1';
    }, 100);
}

// Sonraki öne çıkan filme geçiş fonksiyonu
function nextFeaturedMovie() {
    currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredMovies.length;
    updateFeaturedMovie(currentFeaturedIndex);
}

// Önceki öne çıkan filme geçiş fonksiyonu
function prevFeaturedMovie() {
    currentFeaturedIndex = (currentFeaturedIndex - 1 + featuredMovies.length) % featuredMovies.length;
    updateFeaturedMovie(currentFeaturedIndex);
} 