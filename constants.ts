import { EventData, User, Comment } from './types';

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE SCRIPT WEB APP URL
export const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzpsKCyyw4Q68Tl3SMRtTMDPh9htq-PWR3pDIq22rBtKXeEs8GkhCLss_OVEwPxlY-z/exec';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'PinoyMaster',
  avatar: 'https://i.pravatar.cc/150?u=pinoy',
  points: 500,
  loginStreak: 1
};

export const INITIAL_EVENTS: EventData[] = [
  {
    id: 'e1',
    title: 'Maaari bang ipagtanggol ng isang Philippine team ang titulo sa M7 na ito？',
    description: 'Will a Philippine team defend the title in this M7?',
    videoUrl: 'https://assert.flickai.io/M7%20World%20Championship%20Roster.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    brandName: 'MLBB M7',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 45000,
    poolB: 32000,
    deadline: new Date('2026-01-01').toISOString(),
    status: 'ongoing',
    tags: ['#M7', '#MLBB', '#Esports']
  },
  {
    id: 'e2',
    title: 'Classic “PH vs ID” rematch ba o bagong matchup ang M7 Finals?',
    description: 'Will the M7 Finals be a classic PH vs ID rematch or a new matchup?',
    videoUrl: 'https://assert.flickai.io/ONIC%20ID%20%20VS%20ONIC%20PH%20!!%20GAME%205%20!!%20FLASHBACK%20MOMENTS%20GRAND%20FINALS%20MSC%20at%20EWC25!!%20K1NGKONG%20MENTALITY%20%2C%20COACH%20YEB%20BAN%20LANCELOT%20%2C%20BAXIA%20KAIRI%20KUMAR%20TELEPORT%20ULTI%20LUOYI%2C.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511512578047-9236b382dcc6?auto=format&fit=crop&q=80&w=800',
    brandName: 'MLBB',
    optionA: 'PH vs ID',
    optionB: 'New Matchup',
    poolA: 55000,
    poolB: 48000,
    deadline: new Date('2026-01-01').toISOString(),
    status: 'ongoing',
    tags: ['#M7', '#Rivalry', '#MLBB']
  },
  {
    id: 'e3',
    title: 'Mababagak ba ng M7 Finals ang peak viewership record ng M5, o hindi?',
    description: 'Will the M7 Finals break the peak viewership record of M5?',
    videoUrl: 'https://assert.flickai.io/This%20Grand%20Finals%20crowd%20has%20some%20REAL%20MOVES.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518929458119-e5bf44b2f0f1?auto=format&fit=crop&q=80&w=800',
    brandName: 'Esports Charts',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 38000,
    poolB: 41000,
    deadline: new Date('2026-01-01').toISOString(),
    status: 'ongoing',
    tags: ['#Viewership', '#M7', '#Esports']
  },
  {
    id: 'e4',
    title: 'Sa linggong ito, alin ang mas mataas ang ranggo sa top-grossing chart: PUBG Mobile o Free Fire?',
    description: 'Which game will rank higher in the top-grossing chart this week: PUBG Mobile or Free Fire?',
    videoUrl: 'https://assert.flickai.io/which%20game%20is%20the%20best.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800',
    brandName: 'Mobile Games',
    optionA: 'PUBG',
    optionB: 'Free Fire',
    poolA: 62000,
    poolB: 59000,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'ongoing',
    tags: ['#PUBG', '#FreeFire', '#MobileGaming']
  },
  {
    id: 'e5',
    title: 'Makakakuha kaya ng higit sa 100 milyong PHP sa unang linggo ang pelikulang ito sa 2025 MMFF?',
    description: 'Will this movie gross more than 100 million PHP in the first week of the 2025 MMFF?',
    videoUrl: 'https://assert.flickai.io/Fear%20is%20the%20only%20prayer%20left.%20%20SHAKE%2C%20RATTLE%20%26%20ROLL-%20EVIL%20ORIGINS%20is%20coming%20to%20cinemas%20December%2025!%20_.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    brandName: 'MMFF',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 75000,
    poolB: 28000,
    deadline: new Date('2026-01-10').toISOString(),
    status: 'ongoing',
    tags: ['#MMFF', '#Movies', '#BoxOffice']
  },
  {
    id: 'e6',
    title: 'Makaka-5 milyong views kaya ang susunod na video ni Ivana Alawi sa loob ng isang araw?',
    description: 'Will Ivana Alawi\'s next video reach 5 million views within a day?',
    videoUrl: 'https://assert.flickai.io/Meet%20me%20in%20the%20middle.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    brandName: 'YouTube PH',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 85000,
    poolB: 34000,
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'ongoing',
    tags: ['#IvanaAlawi', '#Vlog', '#Trending']
  },
  {
    id: 'e7',
    title: 'Mananatili pa ba sa top 10 ng music charts ang kantang "Cup of Joe" bago mag-kalagitnaan ng Enero 2026?',
    description: 'Will the song "Cup of Joe" remain in the top 10 music charts until mid-January 2026?',
    videoUrl: 'https://assert.flickai.io/Multo%20(Live%20at%20The%20Cozy%20Cove)%20-%20Cup%20of%20Joe%20out%20now%20on%20Youtube!.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800',
    brandName: 'OPM Charts',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 42000,
    poolB: 39000,
    deadline: new Date('2026-01-15').toISOString(),
    status: 'ongoing',
    tags: ['#OPM', '#MusicCharts', '#CupOfJoe']
  },
  {
    id: 'e8',
    title: 'Papasok kaya sa top 3 ng box office ang “My Love Will Make You Disappear” bago mag-kalagitnaan ng Enero 2026?',
    description: 'Will “My Love Will Make You Disappear” enter the top 3 box office before mid-January 2026?',
    videoUrl: 'https://assert.flickai.io/%E2%80%98My%20Love%20Will%20Make%20You%20Disappear%E2%80%99%20Official%20Trailer%2C%20out%20now!%20%20There%E2%80%99s%20more%20to%20love%20in%20the%20Kim%20Chiu%20and%20Paulo%20Avelino%20starrer%20which%20will%20open%20exclusively%20in%20cinemas%20worldwide%20beginning%20March%2026%2C%202025.%20%E2%80%98My%20Love%20Will%20Make%20You%20Disappear.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
    brandName: 'Cinema',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 55000,
    poolB: 48000,
    deadline: new Date('2026-01-15').toISOString(),
    status: 'ongoing',
    tags: ['#KimPau', '#Movies', '#BoxOffice']
  },
  {
    id: 'e9',
    title: 'Sa susunod na Ultra Lotto draw, magkakaroon ba ng mas maraming odd o even na nanalong numero?',
    description: 'Will there be more odd or even winning numbers in the next Ultra Lotto draw?',
    videoUrl: 'https://assert.flickai.io/Lotto%20Result%20Today%205pm%20draw%20DECEMBER%2025%2C%202025%20-%20THURSDAY%20PCSO%20GOV%20Official.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518688248740-7c31f1a945c4?auto=format&fit=crop&q=80&w=800',
    brandName: 'PCSO Lotto',
    optionA: 'Odd',
    optionB: 'Even',
    poolA: 95000,
    poolB: 92000,
    deadline: new Date(Date.now() + 86400000).toISOString(),
    status: 'ongoing',
    tags: ['#Lotto', '#PCSO', '#Luck']
  },
  {
    id: 'e10',
    title: 'Maaari bang lumagpas sa $100,000 ang BTC sa Enero 2026?',
    description: 'Will BTC exceed $100,000 in January 2026?',
    videoUrl: 'https://assert.flickai.io/Bitcoin%20in%202026.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800',
    brandName: 'Crypto',
    optionA: 'Oo',
    optionB: 'Hindi',
    poolA: 150000,
    poolB: 120000,
    deadline: new Date('2026-02-01').toISOString(),
    status: 'ongoing',
    tags: ['#Bitcoin', '#Crypto', '#Finance']
  }
];

export const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', eventId: 'e1', userId: 'u2', userName: 'Maria_PH', side: 'A', text: 'Kathryn is the queen! 👸', timestamp: new Date().toISOString() },
  { id: 'c2', eventId: 'e1', userId: 'u3', userName: 'JuanDelaCruz', side: 'B', text: 'Andrea look so fresh though!', timestamp: new Date().toISOString() },
];