import { GraphState, AgentMessage, DnaScores, Simulations, VerifiedSource, CompetitorPeer, AlphaSignal, SentimentMetric } from './types';

export const AGENT_SYSTEM_PROMPTS = {
  ResearchAgent: "Review general profile, core business model, and sector growth factors.",
  FinancialAnalyst: "Benchmark liquidity, margins, multiples, and intrinsic value.",
  NewsSentimentAnalyst: "Synthesize headlines, PR announcements, and net public sentiment.",
  CompetitorAnalyst: "Benchmark operating metrics directly against core industry peers.",
  RiskAssessment: "Identify legal, regulatory, supply chain, and macro downside exposures.",
  FutureSimulation: "Calculate probability targets for Bull, Bear, Base, and Black Swan projections.",
  DevilsAdvocate: "Systematically dispute the prevailing consensus. Spot structural flaws and hidden risks.",
  InvestmentCommittee: "Moderate boardroom vote count, consensus decision, and confidence rating."
};

export function getCompanyMockData(ticker: string): Partial<GraphState> {
  const t = ticker.toUpperCase().trim();
  
  // Base Defaults
  let name = 'Alpha Innovations Corp';
  let sector = 'Technology';
  let price = 100.00;
  let summary = 'A next-generation enterprise technology provider specializing in AI automation, cloud orchestration, and cyber-security software.';
  let dna: DnaScores = { moat: 75, risk: 40, growth: 80, innovation: 85, leadership: 78, stability: 70 };

  // Profile overrides for specific tickers
  if (t === 'AAPL' || t === 'APPLE') {
    name = 'Apple Inc.';
    sector = 'Consumer Technology';
    price = 185.30;
    summary = 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide, while expanding its services ecosystem.';
    dna = { moat: 92, risk: 22, growth: 68, innovation: 84, leadership: 90, stability: 92 };
  } else if (t === 'TSLA' || t === 'TESLA') {
    name = 'Tesla, Inc.';
    sector = 'Automotive & Clean Energy';
    price = 178.20;
    summary = 'Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation and storage systems, and offers services related to its products.';
    dna = { moat: 78, risk: 65, growth: 88, innovation: 95, leadership: 85, stability: 52 };
  } else if (t === 'NVDA' || t === 'NVIDIA') {
    name = 'NVIDIA Corporation';
    sector = 'Semiconductors & AI Hardware';
    price = 127.40;
    summary = 'NVIDIA Corporation focuses on graphics processing units (GPUs) and AI computing solutions, cloud supercomputing, and autonomous vehicle chips.';
    dna = { moat: 95, risk: 45, growth: 96, innovation: 98, leadership: 92, stability: 74 };
  } else if (t === 'RELIANCE' || t === 'RELI') {
    name = 'Reliance Industries Limited';
    sector = 'Energy, Retail & Telecom';
    price = 2850.00;
    summary = 'Reliance Industries is an Indian multinational conglomerate headquartered in Mumbai, with businesses spanning energy, petrochemicals, natural gas, retail, telecommunications, and media.';
    dna = { moat: 88, risk: 28, growth: 74, innovation: 80, leadership: 92, stability: 88 };
  } else if (t === 'INFY' || t === 'INFOSYS') {
    name = 'Infosys Limited';
    sector = 'IT Services & Consulting';
    price = 1480.00;
    summary = 'Infosys is a global leader in next-generation digital services and consulting, helping enterprises navigate their digital transformation journeys across 50+ countries.';
    dna = { moat: 82, risk: 24, growth: 65, innovation: 74, leadership: 86, stability: 90 };
  }

  // Simulations
  const basePrice = price;
  const simulations: Simulations = {
    bull: {
      priceTarget: Math.round(basePrice * 1.35 * 100) / 100,
      probability: 30,
      description: 'Ecosystem expansion beats forecast, driving high operating margins and margin expansions.',
      drivers: ['Strong product adoption', '200bps gross margin increase', 'Share buybacks accelerated']
    },
    base: {
      priceTarget: Math.round(basePrice * 1.08 * 100) / 100,
      probability: 50,
      description: 'Alings with historical metrics and executive guidance.',
      drivers: ['Standard organic revenue CAGR', 'Stable leverage', 'Sector trends align with guidance']
    },
    bear: {
      priceTarget: Math.round(basePrice * 0.78 * 100) / 100,
      probability: 15,
      description: 'Regulatory challenges delay launches; macro spend contracts in core sectors.',
      drivers: ['GDP growth deceleration', 'Antitrust fine structures', 'Valuation multiple contraction']
    },
    blackSwan: {
      priceTarget: Math.round(basePrice * 0.45 * 100) / 100,
      probability: 5,
      description: 'Severe supply chain interruption or cyber zero-day security failure.',
      drivers: ['Geopolitical trade blocks', 'Zero-day security breaches', 'Key asset write-downs']
    }
  };

  // Verified Sources
  const sources: VerifiedSource[] = [
    { claim: `${name} reported Q1 revenue growth of ${dna.growth - 10}% YoY.`, source: 'SEC Form 10-Q / BSE Filings', url: 'https://sec.gov/edgar', confidence: 99, verified: true },
    { claim: `Research and Development budget expanded to support next-gen architecture optimization.`, source: 'Investor Day Presentation', url: 'https://investorrelations.com', confidence: 95, verified: true },
    { claim: `Market share vs primary competitors remained stable.`, source: 'Gartner Market Share Report', url: 'https://gartner.com', confidence: 90, verified: true }
  ];

  // Competitor Peers
  const peers: CompetitorPeer[] = [
    { name: t === 'AAPL' ? 'Alphabet Inc.' : t === 'TSLA' ? 'BYD Company' : t === 'NVDA' ? 'AMD Inc.' : t === 'RELI' ? 'Adani Green' : 'TCS Ltd.', ticker: t === 'AAPL' ? 'GOOGL' : t === 'TSLA' ? 'BYDDY' : t === 'NVDA' ? 'AMD' : t === 'RELI' ? 'ADANIGR' : 'TCS', marketCap: t === 'RELI' ? '₹1.5T' : '$1.8T', peRatio: '24.2', growth: '12%', score: 85 },
    { name: t === 'AAPL' ? 'Samsung Electronics' : t === 'TSLA' ? 'Toyota Motor' : t === 'NVDA' ? 'Intel Corp.' : t === 'RELI' ? 'ONGC' : 'Wipro Ltd.', ticker: t === 'AAPL' ? 'SSNLF' : t === 'TSLA' ? 'TM' : t === 'NVDA' ? 'INTC' : t === 'RELI' ? 'ONGC' : 'WIT', marketCap: t === 'RELI' ? '₹850B' : '$380B', peRatio: '14.5', growth: '6%', score: 72 }
  ];

  // Alpha Signals
  const alphaSignals: AlphaSignal[] = [
    { category: 'Patents', signal: 'Granted patent on neural compression pipeline.', impact: 'High', sentiment: 'Bullish', details: 'Core weight compression enables edge inference.' },
    { category: 'Hiring', signal: 'Increased recruiting listings for systems architects.', impact: 'Medium', sentiment: 'Bullish', details: 'Indicates software stack expansions.' }
  ];

  // DCF intrinsic valuation
  const wacc = 0.08;
  const intrinsicValue = basePrice * (1 + (dna.growth - dna.risk) / 300);
  const dcfValuation = {
    intrinsicValue: Math.round(intrinsicValue * 100) / 100,
    currentPrice: basePrice,
    upside: Math.round(((intrinsicValue - basePrice) / basePrice) * 100 * 10) / 10
  };

  // Sentiment metrics grid
  const sentimentGrid: SentimentMetric[] = [
    { category: 'Financials', sentimentScore: dna.stability, sentimentLabel: dna.stability > 70 ? 'Bullish' : 'Neutral', signalStrength: 80 },
    { category: 'ESG', sentimentScore: 68, sentimentLabel: 'Neutral', signalStrength: 60 },
    { category: 'Leadership', sentimentScore: dna.leadership, sentimentLabel: dna.leadership > 75 ? 'Bullish' : 'Neutral', signalStrength: 85 },
    { category: 'Innovation', sentimentScore: dna.innovation, sentimentLabel: dna.innovation > 80 ? 'Bullish' : 'Neutral', signalStrength: 90 },
    { category: 'Macro', sentimentScore: 100 - dna.risk, sentimentLabel: dna.risk < 40 ? 'Bullish' : 'Neutral', signalStrength: 70 },
    { category: 'Competitors', sentimentScore: dna.moat, sentimentLabel: dna.moat > 80 ? 'Bullish' : 'Neutral', signalStrength: 75 }
  ];

  // Decision Consensus
  let decision: 'INVEST' | 'HOLD' | 'PASS' = 'HOLD';
  let confidence = 70;
  if (dcfValuation.upside > 12 && dna.moat > 80 && dna.risk < 40) {
    decision = 'INVEST';
    confidence = Math.min(95, 60 + Math.round(dcfValuation.upside));
  } else if (dcfValuation.upside < -5 || dna.risk > 60) {
    decision = 'PASS';
    confidence = Math.min(90, 50 + Math.round(Math.abs(dcfValuation.upside)));
  }

  // Debate transcript
  const debate: AgentMessage[] = [
    {
      agent: 'Research Agent',
      text: `Beginning sweep on ticker ${t}. Industry sector classified as ${sector}. Profile summary: ${summary}`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 1000000).toISOString()
    },
    {
      agent: 'Financial Analyst',
      text: `DCF model calculations completed. Intrinsic value is estimated at $${intrinsicValue.toFixed(2)} vs trading price of $${basePrice.toFixed(2)}. Valuation spread yields ${dcfValuation.upside}%. Net debt is stable.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 900000).toISOString()
    },
    {
      agent: 'News & Sentiment Analyst',
      text: `NLP evaluation of media channels completed. Sentiment indexes register net positive. ESG metrics are stable.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 800000).toISOString()
    },
    {
      agent: 'Competitor Analyst',
      text: `Primary benchmarking competitor defined as ${peers[0].name} (${peers[0].ticker}). Peer scorecard ranks ${name} above peer average in gross margin efficiency. Moat score registered at ${dna.moat}/100.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 700000).toISOString()
    },
    {
      agent: 'Risk Assessment Agent',
      text: `Attention: legal and supply chain tail-risks are active. Geopolitical friction points to semiconductor assembly dependencies. If hardware blocks occur, EBIT margins compress by 350bps. Regulatory risk stands at ${dna.risk}/100.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 600000).toISOString()
    },
    {
      agent: "Devil's Advocate Agent",
      text: `I challenge this core hypothesis. If demand contracts even slightly, intrinsic value targets collapse to bear ranges ($${simulations.bear.priceTarget}). Growth margins assume ideal pricing elasticity.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 500000).toISOString()
    },
    {
      agent: 'Future Simulation Agent',
      text: `Projections are modeled. Base case price target is $${simulations.base.priceTarget} (50% probability). Bull case targets $${simulations.bull.priceTarget} (30% probability). Bear case stands at $${simulations.bear.priceTarget} (15% probability), and Black Swan target is modeled at $${simulations.blackSwan.priceTarget} (5% probability).`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 400000).toISOString()
    },
    {
      agent: 'Investment Committee Agent',
      text: `Boardroom debate synthesis completed. The vote tally among agents stands at: 6 approve, 1 warn, 1 objects. Final consensus recommendation: [${decision}] with a confidence level of ${confidence}%.`,
      role: 'assistant',
      timestamp: new Date(Date.now() - 300000).toISOString()
    }
  ];

  // Logs
  const logs = [
    `Research Agent: overview fetched; profile compiled.`,
    `Financial Analyst: DCF schedules built; valuation multiples verified.`,
    `News & Sentiment Analyst: public headlines and PR sentiment calculated.`,
    `Competitor Analyst: benchmarked key operating ratios vs peers.`,
    `Risk Assessment Agent: regulatory, supply chain, and macro stress tests complete.`,
    `Devil's Advocate Agent: pushed back on consensus; tested bear cases.`,
    `Future Simulation Agent: mapped Bull, Bear, and Black Swan probability targets.`,
    `Investment Committee Agent: boardroom vote tally finalized.`
  ];

  // Memo
  const memo = `# INSTITUTIONAL INVESTMENT MEMORANDUM

**TO:** Investment Committee
**FROM:** AI-IROS Autonomous Intelligence Suite
**DATE:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**SUBJECT:** Investment Recommendation: ${name} (${t})

---

### EXECUTIVE SUMMARY
Following a comprehensive multi-agent debate and quantitative simulation, the AI-IROS system has issued an institutional-grade recommendation of **${decision}** for **${name}** (${t}) at its trading price of **$${price.toFixed(2)}**. The core thesis indicates an intrinsic valuation of **$${intrinsicValue.toFixed(2)}** (representing **${dcfValuation.upside}%** upside/downside) and a strong competitive moat.

*   **Final Decision:** **${decision}**
*   **Confidence Score:** **${confidence}%**
*   **Target Price (Base Case):** **$${simulations.base.priceTarget}**

---

### INVESTMENT THESIS & DNA ASSESSMENT
${name} exhibits a solid competitive profile, scoring **${dna.moat}/100** on Moat and **${dna.innovation}/100** on Innovation.
1.  **Moat Advantage (${dna.moat}/100):** High switching costs, proprietary software libraries, and direct hardware partner locks.
2.  **Financial Stability (${dna.stability}/100):** Low leverage ratio, healthy interest coverage, and predictable cash flows.
3.  **Innovation Index (${dna.innovation}/100):** High-speed patent registration (distributed neural architectures) and specialist hiring trends.

---

### VALUATION & FUTURE SIMULATION
Our valuation framework integrates WACC calculations, terminal multiple forecasts, and Monte Carlo envelopes:
*   **DCF Valuation:** Intrinsic price target is calculated at **$${intrinsicValue.toFixed(2)}**, assuming a cost of capital of 8.0% and operating margins stabilizing at 22%.
*   **Scenario Probability Distribution:**
    *   **Bull Case ($${simulations.bull.priceTarget} - 30% Prob.):** Soft landing macro environment, rapid software monetization.
    *   **Base Case ($${simulations.base.priceTarget} - 50% Prob.):** Business expansion aligns with corporate guidance.
    *   **Bear Case ($${simulations.bear.priceTarget} - 15% Prob.):** Macro spending delays, multiple contractions.
    *   **Black Swan Case ($${simulations.blackSwan.priceTarget} - 5% Prob.):** Zero-day cybersecurity breaches or supply chain shutdowns.

---

### RISK & RED TEAM ASSESSMENT
The **Devil's Advocate Agent** highlighted critical downside parameters:
*   **Multiple Risk:** High valuation multiples reduce safety threshold.
*   **Supply Dependency:** Heavy hardware dependencies pose a single point of failure risk.
*   **Antitrust Bottleneck:** Increasing regulatory oversight limits acquisition velocities.

---

### COMMITTEE VOTING REPORT
*   **Approvals:** Research Agent, Financial Analyst, News & Sentiment Analyst, Competitor Analyst, Future Simulation Agent, Investment Committee.
*   **Warnings:** Risk Assessment Agent.
*   **Objects:** Devil's Advocate Agent.
*   **Consensus:** Reached majority threshold (**${decision}**)

---
*Authorized Signature:* **Investment Committee AI-IROS Boardroom**
`;

  return {
    ticker: t,
    companyName: name,
    dnaScores: dna,
    simulations,
    sources,
    peers,
    alphaSignals,
    dcfValuation,
    sentimentGrid,
    decision,
    confidence,
    debate,
    logs,
    memo,
  };
}
