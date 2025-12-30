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
    videoUrl: 'stream://76e77896e8275bab3be03684a5bb1586',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/76e77896e8275bab3be03684a5bb1586/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://83bc2dd0250b77ddf372c742afd0930f',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/83bc2dd0250b77ddf372c742afd0930f/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://22f0ce1ba4c43b2c641c5f1a7b8b2be8',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/22f0ce1ba4c43b2c641c5f1a7b8b2be8/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://bc9a0a6509c864bec69a6170a05b0e7e',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/bc9a0a6509c864bec69a6170a05b0e7e/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://d38b864f6b40426fae9c06c57313451e',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/d38b864f6b40426fae9c06c57313451e/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://1be8184c8f4058cf6ce84ee2022b2aa6',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/1be8184c8f4058cf6ce84ee2022b2aa6/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://9812043a4157e84636ef0e209e587519',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/9812043a4157e84636ef0e209e587519/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://4ab98c7798ee9d4f2a8b4074221e5003',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/4ab98c7798ee9d4f2a8b4074221e5003/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://c060a4294bce9e02539172d48ebf91aa',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/c060a4294bce9e02539172d48ebf91aa/thumbnails/thumbnail.jpg?time=1s&height=600',
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
    videoUrl: 'stream://6aaf0634294703e24c8d84658053c573',
    posterUrl: 'https://customer-edk1yimvl6deo1m0.cloudflarestream.com/6aaf0634294703e24c8d84658053c573/thumbnails/thumbnail.jpg?time=1s&height=600',
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