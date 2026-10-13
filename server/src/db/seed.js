const db = require('./database');
const bcrypt = require('bcryptjs');

const defaultPassword = bcrypt.hashSync('kinoverse123', 10);

const users = [
  {
    id: 'user_superadmin_01',
    email: 'admin@kinoverse.uz',
    username: 'superadmin',
    name: 'Shoxrux Mirzayev (Super Admin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'super_admin',
    password: defaultPassword,
    googleId: 'google_superadmin_01'
  },
  {
    id: 'user_admin_02',
    email: 'ali@kinoverse.uz',
    username: 'ali_valiyev',
    name: 'Ali Valiyev',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    role: 'admin',
    password: defaultPassword,
    googleId: 'google_ali_02'
  },
  {
    id: 'user_mod_03',
    email: 'madina@kinoverse.uz',
    username: 'madina_k',
    name: 'Madina Karimova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    role: 'moderator',
    password: defaultPassword,
    googleId: 'google_madina_03'
  },
  {
    id: 'user_demo_04',
    email: 'jasur@kinoverse.uz',
    username: 'jasur_cinema',
    name: 'Jasur Toshmatov',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    password: defaultPassword,
    googleId: 'google_jasur_04'
  },
  {
    id: 'user_demo_05',
    email: 'nodira@kinoverse.uz',
    username: 'nodira_u',
    name: 'Nodira Umarova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    password: defaultPassword,
    googleId: 'google_nodira_05'
  }
];

const movies = [
  {
    id: 'movie_01',
    title: 'Yulduzlararo Sayohat (Interstellar)',
    originalTitle: 'Interstellar',
    description: 'Insoniyat kelajagi xavf ostida qolganda, bir guruh jasur fazogirlar yangi yashash sayyorasini topish maqsadida koinotning noma’lum tublariga va qora tuynuk tomon yo‘l oladilar. Vaqt, sevgi va fanning ajoyib uyg‘unligi.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    genre: 'Fantastika, Drama, Sarguzasht',
    category: 'Mashhur kinolar',
    year: 2014,
    duration: '2 soat 49 daqiqa',
    rating: 4.9,
    ratingCount: 1420,
    ageLimit: '12+',
    quality: '4K Ultra HD',
    director: 'Kristofer Nolan',
    actors: 'Metyu Makkonaxi, Enn Xeteuey, Jessika Chesteyn',
    language: 'O‘zbekcha (Professional dublyaj)',
    isFeatured: 1,
    isApproved: 1,
    viewsCount: 38400
  },
  {
    id: 'movie_02',
    title: 'Abdullajon',
    originalTitle: 'Abdullajon yoxud Graff Monte-Kristo',
    description: 'O‘zbek kinosining oltin durdonasi. Qishloqqa o‘zga sayyoralik bola tushib qoladi va unga Abdullajon deb nom berishadi. Ajoyib mo‘jizalar, samimiy qishloq hayoti va kulguli voqealar.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    genre: 'Komediya, Fantastika, Oilaviy',
    category: 'O‘zbek kinolari',
    year: 1991,
    duration: '1 soat 28 daqiqa',
    rating: 5.0,
    ratingCount: 2310,
    ageLimit: '6+',
    quality: '1080p Full HD',
    director: 'Zulfiqor Musoqov',
    actors: 'Rajab Adashev, Tuychi Oripov, Tutixon Bo‘ronova',
    language: 'O‘zbek tili (Asl nusxa)',
    isFeatured: 1,
    isApproved: 1,
    viewsCount: 52100
  },
  {
    id: 'movie_03',
    title: 'Gladiator: Rim Qasosi',
    originalTitle: 'Gladiator',
    description: 'Imperatorning sevimli sarkardasi Maksimus xiyonat qurboniga aylanadi. Oilasidan ayrilgan qahramon qulga aylanadi va qasos olish uchun gladiatorlar arenasida afsonaviy jang olib boradi.',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    genre: 'Jangari, Tarixiy, Drama',
    category: 'Yangi kinolar',
    year: 2024,
    duration: '2 soat 35 daqiqa',
    rating: 4.8,
    ratingCount: 980,
    ageLimit: '16+',
    quality: '4K Ultra HD',
    director: 'Ridli Skott',
    actors: 'Pol Meskal, Pedro Paskal, Denzel Vashington',
    language: 'O‘zbekcha (Professional dublyaj)',
    isFeatured: 1,
    isApproved: 1,
    viewsCount: 24700
  },
  {
    id: 'movie_04',
    title: 'Mahallada Duv-Duv Gap',
    originalTitle: 'Mahallada Duv-Duv Gap',
    description: 'Toshkentning eski shahar mahallasidagi ikki qo‘shni onaning o‘z farzandlariga mos kelin va kuyov topish yo‘lidagi qiziqarli va kulguli sarguzashtlari.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    genre: 'Komediya, Melodrama, Klassika',
    category: 'O‘zbek kinolari',
    year: 1960,
    duration: '1 soat 24 daqiqa',
    rating: 4.9,
    ratingCount: 3120,
    ageLimit: '6+',
    quality: '1080p Full HD (Restavritsiya)',
    director: 'Yo‘ldosh A’zamov',
    actors: 'Lutfixonim Sarimsoqova, Ikbila Aliyeva, Xamza Umarov',
    language: 'O‘zbek tili (Asl nusxa)',
    isFeatured: 0,
    isApproved: 1,
    viewsCount: 41900
  },
  {
    id: 'movie_05',
    title: 'Avatar: Suv Yo‘li',
    originalTitle: 'Avatar: The Way of Water',
    description: 'Pandora sayyorasida Jeyk Salli va Neytiri oila qurib yashamoqda. Ammo eski dushmanlar yana hujum qilganda, ular suv qabilalari panohiga boradilar va okean tubidagi buyuk jangga tayyorlanadilar.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    genre: 'Fantastika, Jangari, Sarguzasht',
    category: 'O‘zbek tilidagi kinolar',
    year: 2022,
    duration: '3 soat 12 daqiqa',
    rating: 4.7,
    ratingCount: 1650,
    ageLimit: '12+',
    quality: '4K Ultra HD',
    director: 'Jeyms Kemeron',
    actors: 'Sem Uortington, Zoe Saldana, Sigurni Uiver',
    language: 'O‘zbekcha (Professional dublyaj)',
    isFeatured: 1,
    isApproved: 1,
    viewsCount: 61000
  },
  {
    id: 'movie_06',
    title: 'Ilhaq',
    originalTitle: 'Ilhaq',
    description: 'Ikkinchi jahon urushida besh o‘g‘lidan ayrilgan Zulfiya Zokirova va uning oilasi haqidagi yurakni larzaga soluvchi haqiqiy vatanparvarlik dramasi.',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    genre: 'Tarixiy, Drama, Harbiy',
    category: 'Drama',
    year: 2020,
    duration: '2 soat 20 daqiqa',
    rating: 4.9,
    ratingCount: 1890,
    ageLimit: '16+',
    quality: '4K Ultra HD',
    director: 'Jahongir Ahmedov',
    actors: 'Dilorom Karimova, Dilnavoz Ahmedova, Ilhom Berdiyev',
    language: 'O‘zbek tili',
    isFeatured: 0,
    isApproved: 1,
    viewsCount: 33200
  },
  {
    id: 'movie_07',
    title: 'Qirol Sher: Mufasa Afsonasi',
    originalTitle: 'Mufasa: The Lion King',
    description: 'Buyuk qirol Mufasaning yoshlik yillari va uning o‘z taxtiga qanday yetib borgani haqidagi ajoyib animatsion sarguzasht.',
    poster: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    genre: 'Multfilm, Sarguzasht, Oilaviy',
    category: 'Multfilm',
    year: 2024,
    duration: '1 soat 58 daqiqa',
    rating: 4.8,
    ratingCount: 750,
    ageLimit: '6+',
    quality: '4K Ultra HD',
    director: 'Barri Jenkins',
    actors: 'Aaron Pyer, Kelvin Harrison, Jon Kani',
    language: 'O‘zbekcha (Ovozli)',
    isFeatured: 0,
    isApproved: 1,
    viewsCount: 18300
  },
  {
    id: 'movie_08',
    title: 'Qora Ritsar (The Dark Knight)',
    originalTitle: 'The Dark Knight',
    description: 'Betmen Gotem shahrini jinoyatchilikdan qutqarishga urinayotganda shafqatsiz va aqlbovar qilmas tartibsizlik ustasi Joker maydonga chiqadi.',
    poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    genre: 'Jangari, Jinoyat, Triller',
    category: 'Mashhur kinolar',
    year: 2008,
    duration: '2 soat 32 daqiqa',
    rating: 4.9,
    ratingCount: 3950,
    ageLimit: '16+',
    quality: '4K Ultra HD',
    director: 'Kristofer Nolan',
    actors: 'Kristian Beyl, Hit Lejer, Aaron Ekxart',
    language: 'O‘zbekcha (Dublyaj)',
    isFeatured: 0,
    isApproved: 1,
    viewsCount: 57900
  },
  {
    id: 'movie_09',
    title: 'Jimjitlik Joyi: Birinchi Kun',
    originalTitle: 'A Quiet Place: Day One',
    description: 'Tovushga qarab ov qiluvchi maxluqlar Yerni egallagan dahshatli birinchi kunda Nyu-Yorklik Samira o‘z mushugi bilan omon qolish uchun jimjitlikda harakatlanadi.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    genre: 'Horror, Triller, Fantastika',
    category: 'Horror',
    year: 2024,
    duration: '1 soat 40 daqiqa',
    rating: 4.6,
    ratingCount: 620,
    ageLimit: '18+',
    quality: '1080p Full HD',
    director: 'Maykl Sarnoski',
    actors: 'Lupita Niongo, Jozef Kuinn, Aleks Vulf',
    language: 'O‘zbekcha (Dublyaj)',
    isFeatured: 0,
    isApproved: 1,
    viewsCount: 14500
  },
  {
    id: 'movie_10',
    title: 'Taxtlar O‘yini: Ajdarho Xonadoni',
    originalTitle: 'House of the Dragon',
    description: 'Targariyenlar sulolasining ichki urushi — Ajdarlar raqsi boshlanadi. Taxtga da’vogarlar o‘rtasidagi shafqatsiz kurash va ulug‘vor olovli to‘qnashuvlar.',
    poster: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    genre: 'Seriallar, Fentezi, Drama, Jangari',
    category: 'Seriallar',
    year: 2024,
    duration: '2-fasl (8 qism)',
    rating: 4.8,
    ratingCount: 1980,
    ageLimit: '18+',
    quality: '4K Ultra HD',
    director: 'Rayan Kondal',
    actors: 'Emma D’Arsi, Mett Smit, Oliviya Kuk',
    language: 'O‘zbekcha (Professional dublyaj)',
    isFeatured: 0,
    isApproved: 1,
    viewsCount: 42300
  }
];

function seed() {
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, username, name, avatar, role, password, googleId)
    VALUES (@id, @email, @username, @name, @avatar, @role, @password, @googleId)
  `);

  const insertMovie = db.prepare(`
    INSERT OR REPLACE INTO movies (
      id, title, originalTitle, description, poster, backdrop, videoUrl, trailerUrl,
      genre, category, year, duration, rating, ratingCount, ageLimit, quality,
      director, actors, language, isFeatured, isApproved, viewsCount
    ) VALUES (
      @id, @title, @originalTitle, @description, @poster, @backdrop, @videoUrl, @trailerUrl,
      @genre, @category, @year, @duration, @rating, @ratingCount, @ageLimit, @quality,
      @director, @actors, @language, @isFeatured, @isApproved, @viewsCount
    )
  `);

  const insertFriend = db.prepare(`
    INSERT OR IGNORE INTO friends (id, user1Id, user2Id) VALUES (?, ?, ?)
  `);

  const insertComment = db.prepare(`
    INSERT OR REPLACE INTO comments (id, movieId, userId, content, likesCount)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    for (const u of users) {
      insertUser.run(u);
    }
    for (const m of movies) {
      insertMovie.run(m);
    }

    // Seed some initial friendships
    insertFriend.run('fr_1', 'user_superadmin_01', 'user_admin_02');
    insertFriend.run('fr_2', 'user_superadmin_01', 'user_demo_04');
    insertFriend.run('fr_3', 'user_admin_02', 'user_mod_03');
    insertFriend.run('fr_4', 'user_demo_04', 'user_demo_05');

    // Seed initial comments
    insertComment.run('c_1', 'movie_01', 'user_demo_04', 'Nolan yana o‘zining daholigini ko‘rsatdi! Virtual xonada do‘stlar bilan ko‘rish boshqacha rohat!', 14);
    insertComment.run('c_2', 'movie_01', 'user_mod_03', 'Musiqasi va vizual effektlari hayratlanarli darajada mukammal!', 8);
    insertComment.run('c_3', 'movie_02', 'user_admin_02', 'Abdullajon — bolaligimizning eng yaxshi xotirasi. Har yili qayta-qayta ko‘raman!', 27);
  });

  tx();
  console.log('✅ Kinoverse ma’lumotlar bazasi muvaffaqiyatli to‘ldirildi!');
}

seed();
