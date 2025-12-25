import { EventData, User, Comment } from './types';

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE SCRIPT WEB APP URL
export const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzpsKCyyw4Q68Tl3SMRtTMDPh9htq-PWR3pDIq22rBtKXeEs8GkhCLss_OVEwPxlY-z/exec'; 

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'PinoyMaster',
  avatar: 'https://i.pravatar.cc/150?u=pinoy',
  points: 1000,
  loginStreak: 1
};

export const INITIAL_EVENTS: EventData[] = [
  {
    id: 'e1',
    title: 'Showbiz: Kathryn vs Andrea Fashion Face-off!',
    description: 'Who slayed the red carpet last night? Vote for your favorite look! #KathNiel #ShowbizNews',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    brandName: 'Jollibee',
    optionA: 'Kathryn',
    optionB: 'Andrea',
    poolA: 85000,
    poolB: 24000,
    deadline: new Date(Date.now() + 86400000).toISOString(),
    status: 'ongoing',
    tags: ['#Showbiz', '#KathNiel', '#OOTD']
  },
  {
    id: 'e2',
    title: 'Jollibee Chickenjoy vs McDo McChicken',
    description: 'The ultimate Philippines fast food battle. Which one is the true king of crispy chicken? #FoodiePH',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    optionA: 'Chickenjoy',
    optionB: 'McChicken',
    poolA: 120000,
    poolB: 115000,
    deadline: new Date(Date.now() + 43200000).toISOString(),
    status: 'ongoing',
    tags: ['#FoodiePH', '#Jollibee', '#Battle']
  }
];

export const MOCK_COMMENTS: Comment[] = [
  { id: 'c1', eventId: 'e1', userId: 'u2', userName: 'Maria_PH', side: 'A', text: 'Kathryn is the queen! 👸', timestamp: new Date().toISOString() },
  { id: 'c2', eventId: 'e1', userId: 'u3', userName: 'JuanDelaCruz', side: 'B', text: 'Andrea look so fresh though!', timestamp: new Date().toISOString() },
];