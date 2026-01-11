// Serviço de API de Futebol (Compatível com API-Football / RapidAPI)
// Documentação: https://www.api-football.com/documentation-v3

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || "";
const API_HOST = "v3.football.api-sports.io";
const BASE_URL = "https://v3.football.api-sports.io";

// Se não houver chave de API, usa dados mockados
const USE_MOCK = !API_KEY;

export interface Match {
  fixture: {
    id: number;
    status: {
      short: string; // "1H", "2H", "FT", "NS"
      elapsed: number;
    };
    date: string;
    venue?: {
      name: string;
      city: string;
    };
    referee?: string;
  };
  league: {
    name: string;
    logo: string;
    round?: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  broadcast?: {
    name: string; // Nome do canal (ex: "Globo", "SporTV")
    logo?: string;
  }[];
  events?: MatchEvent[];
  statistics?: MatchStatistic[];
  lineups?: MatchLineup[];
}

export interface MatchEvent {
  time: {
    elapsed: number;
    extra?: number;
  };
  team: {
    name: string;
    logo: string;
  };
  player: {
    name: string;
  };
  assist: {
    name: string | null;
  };
  type: string; // "Goal", "Card", "subst", "Var"
  detail: string; // "Normal Goal", "Yellow Card", etc.
}

export interface MatchStatistic {
  team: {
    name: string;
    logo: string;
  };
  statistics: {
    type: string;
    value: string | number | null;
  }[];
}

export interface MatchLineup {
  team: {
    name: string;
    logo: string;
    colors?: any;
  };
  coach: {
    name: string;
    photo?: string;
  };
  formation: string;
  startXI: {
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string | null;
    };
  }[];
  substitutes: {
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string | null;
    };
  }[];
}

export interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
  form: string; // "WWLDW"
}

export interface HeadToHead {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    name: string;
    logo: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number;
    away: number;
  };
}

export interface Odd {
  league: {
    id: number;
    name: string;
  };
  fixture: {
    id: number;
  };
  bookmakers: {
    id: number;
    name: string;
    bets: {
      id: number;
      name: string;
      values: {
        value: string;
        odd: string;
      }[];
    }[];
  }[];
}

// Dados Mockados para demonstração
const MOCK_LIVE_MATCHES: Match[] = [
  {
    fixture: { id: 1, status: { short: "2H", elapsed: 75 }, date: new Date().toISOString() },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png" },
    teams: {
      home: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: null },
      away: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: null }
    },
    goals: { home: 1, away: 1 }
  },
  {
    fixture: { id: 2, status: { short: "1H", elapsed: 32 }, date: new Date().toISOString() },
    league: { name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    teams: {
      home: { id: 50, name: "Man City", logo: "https://media.api-sports.io/football/teams/50.png", winner: null },
      away: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png", winner: null }
    },
    goals: { home: 2, away: 0 }
  },
  {
    fixture: { id: 3, status: { short: "FT", elapsed: 90 }, date: new Date().toISOString() },
    league: { name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
    teams: {
      home: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png", winner: true },
      away: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png", winner: false }
    },
    goals: { home: 3, away: 1 }
  }
];

const MOCK_MATCH_DETAIL: Match = {
  fixture: { 
    id: 1, 
    status: { short: "2H", elapsed: 75 }, 
    date: new Date().toISOString(),
    venue: { name: "Maracanã", city: "Rio de Janeiro" },
    referee: "Wilton Pereira Sampaio"
  },
  league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png", round: "Rodada 28" },
  teams: {
    home: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: null },
    away: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: null }
  },
  goals: { home: 1, away: 1 },
  events: [
    { time: { elapsed: 12 }, team: { name: "Flamengo", logo: "" }, player: { name: "G. Barbosa" }, assist: { name: "Arrascaeta" }, type: "Goal", detail: "Normal Goal" },
    { time: { elapsed: 34 }, team: { name: "Palmeiras", logo: "" }, player: { name: "G. Gómez" }, assist: { name: null }, type: "Card", detail: "Yellow Card" },
    { time: { elapsed: 45, extra: 2 }, team: { name: "Palmeiras", logo: "" }, player: { name: "R. Veiga" }, assist: { name: "Dudu" }, type: "Goal", detail: "Normal Goal" },
    { time: { elapsed: 60 }, team: { name: "Flamengo", logo: "" }, player: { name: "E. Cebolinha" }, assist: { name: "Bruno Henrique" }, type: "subst", detail: "Substitution 1" },
  ],
  statistics: [
    {
      team: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png" },
      statistics: [
        { type: "Shots on Goal", value: 5 },
        { type: "Shots off Goal", value: 3 },
        { type: "Total Shots", value: 12 },
        { type: "Ball Possession", value: "55%" },
        { type: "Corner Kicks", value: 6 },
        { type: "Fouls", value: 14 },
        { type: "Yellow Cards", value: 2 },
      ]
    },
    {
      team: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png" },
      statistics: [
        { type: "Shots on Goal", value: 4 },
        { type: "Shots off Goal", value: 2 },
        { type: "Total Shots", value: 8 },
        { type: "Ball Possession", value: "45%" },
        { type: "Corner Kicks", value: 4 },
        { type: "Fouls", value: 18 },
        { type: "Yellow Cards", value: 3 },
      ]
    }
  ],
  lineups: [
    {
      team: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png" },
      coach: { name: "Tite" },
      formation: "4-2-3-1",
      startXI: [
        { player: { id: 1, name: "Rossi", number: 1, pos: "G", grid: "1:1" } },
        { player: { id: 2, name: "Wesley", number: 43, pos: "D", grid: "2:4" } },
        { player: { id: 3, name: "Fabrício Bruno", number: 15, pos: "D", grid: "2:3" } },
        { player: { id: 4, name: "Léo Pereira", number: 4, pos: "D", grid: "2:2" } },
        { player: { id: 5, name: "Ayrton Lucas", number: 6, pos: "D", grid: "2:1" } },
        { player: { id: 6, name: "Erick Pulgar", number: 5, pos: "M", grid: "3:2" } },
        { player: { id: 7, name: "Gerson", number: 20, pos: "M", grid: "3:1" } },
        { player: { id: 8, name: "Luiz Araújo", number: 31, pos: "F", grid: "4:3" } },
        { player: { id: 9, name: "Arrascaeta", number: 14, pos: "M", grid: "4:2" } },
        { player: { id: 10, name: "Bruno Henrique", number: 27, pos: "F", grid: "4:1" } },
        { player: { id: 11, name: "Pedro", number: 9, pos: "F", grid: "5:1" } },
      ],
      substitutes: []
    },
    {
      team: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png" },
      coach: { name: "Abel Ferreira" },
      formation: "4-3-3",
      startXI: [
        { player: { id: 1, name: "Weverton", number: 21, pos: "G", grid: "1:1" } },
        { player: { id: 2, name: "Mayke", number: 12, pos: "D", grid: "2:4" } },
        { player: { id: 3, name: "G. Gómez", number: 15, pos: "D", grid: "2:3" } },
        { player: { id: 4, name: "Murilo", number: 26, pos: "D", grid: "2:2" } },
        { player: { id: 5, name: "Piquerez", number: 22, pos: "D", grid: "2:1" } },
        { player: { id: 6, name: "Zé Rafael", number: 8, pos: "M", grid: "3:3" } },
        { player: { id: 7, name: "Aníbal Moreno", number: 5, pos: "M", grid: "3:2" } },
        { player: { id: 8, name: "Raphael Veiga", number: 23, pos: "M", grid: "3:1" } },
        { player: { id: 9, name: "Estêvão", number: 41, pos: "F", grid: "4:3" } },
        { player: { id: 10, name: "Flaco López", number: 42, pos: "F", grid: "4:2" } },
        { player: { id: 11, name: "Rony", number: 10, pos: "F", grid: "4:1" } },
      ],
      substitutes: []
    }
  ]
};

const MOCK_H2H: HeadToHead[] = [
  {
    fixture: { id: 101, date: "2024-04-21T19:00:00", status: { short: "FT" } },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png" },
    teams: {
      home: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: false },
      away: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: false }
    },
    goals: { home: 0, away: 0 }
  },
  {
    fixture: { id: 102, date: "2023-11-08T21:30:00", status: { short: "FT" } },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png" },
    teams: {
      home: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: true },
      away: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: false }
    },
    goals: { home: 3, away: 0 }
  },
  {
    fixture: { id: 103, date: "2023-07-08T21:00:00", status: { short: "FT" } },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png" },
    teams: {
      home: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: false },
      away: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: false }
    },
    goals: { home: 1, away: 1 }
  },
  {
    fixture: { id: 104, date: "2023-01-28T16:30:00", status: { short: "FT" } },
    league: { name: "Supercopa do Brasil", logo: "https://media.api-sports.io/football/leagues/73.png" },
    teams: {
      home: { name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: true },
      away: { name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: false }
    },
    goals: { home: 4, away: 3 }
  }
];

const MOCK_ODDS: Odd = {
  league: { id: 71, name: "Brasileirão Série A" },
  fixture: { id: 1 },
  bookmakers: [
    {
      id: 1,
      name: "Bet365",
      bets: [
        {
          id: 1,
          name: "Match Winner",
          values: [
            { value: "Home", odd: "2.10" },
            { value: "Draw", odd: "3.40" },
            { value: "Away", odd: "3.50" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Betano",
      bets: [
        {
          id: 1,
          name: "Match Winner",
          values: [
            { value: "Home", odd: "2.15" },
            { value: "Draw", odd: "3.35" },
            { value: "Away", odd: "3.45" }
          ]
        }
      ]
    }
  ]
};

// Jogos de Hoje (com horários e canais)
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const MOCK_TODAY_MATCHES: Match[] = [
  {
    fixture: { id: 101, status: { short: "NS", elapsed: 0 }, date: `${getTodayDate()}T16:00:00Z` },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png", round: "Rodada 30" },
    teams: {
      home: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png", winner: null },
      away: { id: 130, name: "Grêmio", logo: "https://media.api-sports.io/football/teams/130.png", winner: null }
    },
    goals: { home: null, away: null },
    broadcast: [{ name: "Premiere" }, { name: "Globo" }]
  },
  {
    fixture: { id: 102, status: { short: "NS", elapsed: 0 }, date: `${getTodayDate()}T18:30:00Z` },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png", round: "Rodada 30" },
    teams: {
      home: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png", winner: null },
      away: { id: 120, name: "Botafogo", logo: "https://media.api-sports.io/football/teams/120.png", winner: null }
    },
    goals: { home: null, away: null },
    broadcast: [{ name: "SporTV" }, { name: "Premiere" }]
  },
  {
    fixture: { id: 103, status: { short: "NS", elapsed: 0 }, date: `${getTodayDate()}T21:00:00Z` },
    league: { name: "Brasileirão Série A", logo: "https://media.api-sports.io/football/leagues/71.png", round: "Rodada 30" },
    teams: {
      home: { id: 131, name: "Corinthians", logo: "https://media.api-sports.io/football/teams/131.png", winner: null },
      away: { id: 126, name: "São Paulo", logo: "https://media.api-sports.io/football/teams/126.png", winner: null }
    },
    goals: { home: null, away: null },
    broadcast: [{ name: "Globo" }]
  },
  {
    fixture: { id: 104, status: { short: "NS", elapsed: 0 }, date: `${getTodayDate()}T19:00:00Z` },
    league: { name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png", round: "Rodada 15" },
    teams: {
      home: { id: 50, name: "Man City", logo: "https://media.api-sports.io/football/teams/50.png", winner: null },
      away: { id: 33, name: "Man United", logo: "https://media.api-sports.io/football/teams/33.png", winner: null }
    },
    goals: { home: null, away: null },
    broadcast: [{ name: "ESPN" }, { name: "Star+" }]
  },
  {
    fixture: { id: 105, status: { short: "NS", elapsed: 0 }, date: `${getTodayDate()}T22:00:00Z` },
    league: { name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png", round: "Rodada 18" },
    teams: {
      home: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png", winner: null },
      away: { id: 532, name: "Valencia", logo: "https://media.api-sports.io/football/teams/532.png", winner: null }
    },
    goals: { home: null, away: null },
    broadcast: [{ name: "ESPN" }]
  }
];

const MOCK_STANDINGS: Standing[] = [
  { rank: 1, team: { id: 120, name: "Botafogo", logo: "https://media.api-sports.io/football/teams/120.png" }, points: 55, goalsDiff: 22, all: { played: 25, win: 17, draw: 4, lose: 4 }, form: "WDWWW" },
  { rank: 2, team: { id: 121, name: "Palmeiras", logo: "https://media.api-sports.io/football/teams/121.png" }, points: 51, goalsDiff: 18, all: { played: 25, win: 15, draw: 6, lose: 4 }, form: "WWLDW" },
  { rank: 3, team: { id: 127, name: "Flamengo", logo: "https://media.api-sports.io/football/teams/127.png" }, points: 48, goalsDiff: 15, all: { played: 25, win: 14, draw: 6, lose: 5 }, form: "LWWWD" },
  { rank: 4, team: { id: 130, name: "Grêmio", logo: "https://media.api-sports.io/football/teams/130.png" }, points: 44, goalsDiff: 8, all: { played: 25, win: 13, draw: 5, lose: 7 }, form: "DWLWL" },
  { rank: 5, team: { id: 124, name: "Fluminense", logo: "https://media.api-sports.io/football/teams/124.png" }, points: 41, goalsDiff: 5, all: { played: 25, win: 12, draw: 5, lose: 8 }, form: "WLLDW" },
];

export const footballApi = {
  getLiveMatches: async (): Promise<Match[]> => {
    if (USE_MOCK) {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_LIVE_MATCHES;
    }

    try {
      const response = await fetch(`${BASE_URL}/fixtures?live=all`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY
        }
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Erro ao buscar jogos ao vivo:", error);
      return MOCK_LIVE_MATCHES; // Fallback
    }
  },

  getMatchById: async (id: number): Promise<Match> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Retorna o mock detalhado independentemente do ID para teste
      return { ...MOCK_MATCH_DETAIL, fixture: { ...MOCK_MATCH_DETAIL.fixture, id } };
    }

    try {
      const response = await fetch(`${BASE_URL}/fixtures?id=${id}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY
        }
      });
      const data = await response.json();
      return data.response[0] || MOCK_MATCH_DETAIL;
    } catch (error) {
      console.error("Erro ao buscar detalhes da partida:", error);
      return MOCK_MATCH_DETAIL;
    }
  },

  getHeadToHead: async (team1Id: number, team2Id: number): Promise<HeadToHead[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_H2H;
    }

    try {
      const response = await fetch(`${BASE_URL}/fixtures/headtohead?h2h=${team1Id}-${team2Id}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY
        }
      });
      const data = await response.json();
      return data.response || MOCK_H2H;
    } catch (error) {
      console.error("Erro ao buscar histórico H2H:", error);
      return MOCK_H2H;
    }
  },

  getOdds: async (fixtureId: number): Promise<Odd | null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_ODDS;
    }

    try {
      const response = await fetch(`${BASE_URL}/odds?fixture=${fixtureId}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY
        }
      });
      const data = await response.json();
      return data.response[0] || MOCK_ODDS;
    } catch (error) {
      console.error("Erro ao buscar odds:", error);
      return MOCK_ODDS;
    }
  },

  getStandings: async (leagueId: number = 71, season: number = 2024): Promise<Standing[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_STANDINGS;
    }

    try {
      const response = await fetch(`${BASE_URL}/standings?league=${leagueId}&season=${season}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY
        }
      });
      const data = await response.json();
      return data.response[0]?.league?.standings[0] || MOCK_STANDINGS;
    } catch (error) {
      console.error("Erro ao buscar classificação:", error);
      return MOCK_STANDINGS;
    }
  },

  getTodayMatches: async (): Promise<Match[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_TODAY_MATCHES;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${BASE_URL}/fixtures?date=${today}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY
        }
      });
      const data = await response.json();
      return data.response || MOCK_TODAY_MATCHES;
    } catch (error) {
      console.error("Erro ao buscar jogos de hoje:", error);
      return MOCK_TODAY_MATCHES;
    }
  }
};
