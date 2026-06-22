export interface AgentMessage {
  agent: string;
  text: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
}

export interface DnaScores {
  moat: number;       // 0-100
  risk: number;       // 0-100
  growth: number;     // 0-100
  innovation: number; // 0-100
  leadership: number; // 0-100
  stability: number;  // 0-100
}

export interface SimulationScenario {
  priceTarget: number;
  probability: number;
  description: string;
  drivers: string[];
}

export interface Simulations {
  bull: SimulationScenario;
  base: SimulationScenario;
  bear: SimulationScenario;
  blackSwan: SimulationScenario;
}

export interface VerifiedSource {
  claim: string;
  source: string;
  url: string;
  confidence: number;
  verified: boolean;
}

export interface CompetitorPeer {
  name: string;
  ticker: string;
  marketCap: string;
  peRatio: string;
  growth: string;
  score: number;
}

export interface AlphaSignal {
  category: 'Hiring' | 'Patents' | 'Product Launches' | 'Leadership Changes' | 'Market Momentum';
  signal: string;
  impact: 'High' | 'Medium' | 'Low';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  details: string;
}

export interface SentimentMetric {
  category: 'Financials' | 'ESG' | 'Leadership' | 'Innovation' | 'Macro' | 'Competitors';
  sentimentScore: number;
  sentimentLabel: 'Bullish' | 'Bearish' | 'Neutral';
  signalStrength: number;
}

export interface GraphState {
  ticker: string;
  companyName: string;
  currentStep: string;
  logs: string[];
  debate: AgentMessage[];
  dnaScores: DnaScores;
  simulations: Simulations;
  sources: VerifiedSource[];
  peers: CompetitorPeer[];
  alphaSignals: AlphaSignal[];
  dcfValuation: {
    intrinsicValue: number;
    currentPrice: number;
    upside: number;
  };
  sentimentGrid: SentimentMetric[];
  decision: 'INVEST' | 'HOLD' | 'PASS';
  confidence: number;
  memo: string;
}
