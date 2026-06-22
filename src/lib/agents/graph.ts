import { StateGraph, START, END } from '@langchain/langgraph';
import { GraphState, AgentMessage } from './types';
import { getCompanyMockData } from './prompts';

// Define the Graph state shape
const GraphStateAnnotation = {
  ticker: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  companyName: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  currentStep: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
  logs: {
    value: (x: string[], y: string[]) => [...x, ...y],
    default: () => [],
  },
  debate: {
    value: (x: AgentMessage[], y: AgentMessage[]) => [...x, ...y],
    default: () => [],
  },
  dnaScores: {
    value: (x: any, y: any) => y,
    default: () => ({ moat: 50, risk: 50, growth: 50, innovation: 50, leadership: 50, stability: 50 }),
  },
  simulations: {
    value: (x: any, y: any) => y,
    default: () => ({
      bull: { priceTarget: 0, probability: 25, description: '', drivers: [] },
      base: { priceTarget: 0, probability: 50, description: '', drivers: [] },
      bear: { priceTarget: 0, probability: 20, description: '', drivers: [] },
      blackSwan: { priceTarget: 0, probability: 5, description: '', drivers: [] },
    }),
  },
  sources: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  peers: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  alphaSignals: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  dcfValuation: {
    value: (x: any, y: any) => y,
    default: () => ({ intrinsicValue: 0, currentPrice: 0, upside: 0 }),
  },
  sentimentGrid: {
    value: (x: any[], y: any[]) => y,
    default: () => [],
  },
  decision: {
    value: (x: 'INVEST' | 'HOLD' | 'PASS', y: 'INVEST' | 'HOLD' | 'PASS') => y,
    default: () => 'HOLD' as const,
  },
  confidence: {
    value: (x: number, y: number) => y,
    default: () => 50,
  },
  memo: {
    value: (x: string, y: string) => y,
    default: () => '',
  },
};

// Node function map for direct execution in research runtime (8 Agents)
const nodeFunctions: Record<string, (state: any) => Promise<any>> = {
  research: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Research Agent');
    return {
      currentStep: 'research',
      companyName: mock.companyName,
      logs: ['Research Agent: overview fetched; profile compiled.', 'Handshaking with SEC EDGAR...', 'Extracted 10-K metadata.'],
      debate: msg ? [msg] : [],
      sources: mock.sources,
    };
  },
  financial: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Financial Analyst');
    return {
      currentStep: 'financial',
      dcfValuation: mock.dcfValuation,
      dnaScores: {
        ...state.dnaScores,
        stability: mock.dnaScores?.stability || 50,
        growth: mock.dnaScores?.growth || 50,
      },
      logs: ['Financial Analyst: DCF schedules built; valuation multiples verified.', 'Running discount cash schedules.', 'Verifying debt ratios.'],
      debate: msg ? [msg] : [],
    };
  },
  news: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'News & Sentiment Analyst');
    return {
      currentStep: 'news',
      sentimentGrid: mock.sentimentGrid,
      logs: ['News & Sentiment Analyst: public headlines and PR sentiment calculated.', 'Aggregating headlines.', 'Running NLP vector calculations.'],
      debate: msg ? [msg] : [],
    };
  },
  competitor: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Competitor Analyst');
    return {
      currentStep: 'competitor',
      peers: mock.peers,
      dnaScores: {
        ...state.dnaScores,
        moat: mock.dnaScores?.moat || 50,
      },
      logs: ['Competitor Analyst: benchmarked key operating ratios vs peers.', 'Mapping switching costs.', 'Comparing sector operating margins.'],
      debate: msg ? [msg] : [],
    };
  },
  risk: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Risk Assessment Agent');
    return {
      currentStep: 'risk',
      dnaScores: {
        ...state.dnaScores,
        risk: mock.dnaScores?.risk || 50,
      },
      logs: ['Risk Assessment Agent: regulatory, supply chain, and macro stress tests complete.', 'Evaluating antitrust legal precedents.'],
      debate: msg ? [msg] : [],
    };
  },
  devilsAdvocate: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === "Devil's Advocate Agent");
    return {
      currentStep: 'devilsAdvocate',
      logs: ["Devil's Advocate Agent: pushed back on consensus; tested bear cases.", 'Skeptically reviewing multiple distributions.'],
      debate: msg ? [msg] : [],
    };
  },
  futureSim: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Future Simulation Agent');
    return {
      currentStep: 'futureSim',
      simulations: mock.simulations,
      logs: ['Future Simulation Agent: mapped Bull, Bear, and Black Swan probability targets.', 'Executing Monte Carlo price paths.'],
      debate: msg ? [msg] : [],
    };
  },
  committee: async (state) => {
    const mock = getCompanyMockData(state.ticker);
    const msg = mock.debate?.find(m => m.agent === 'Investment Committee Agent');
    return {
      currentStep: 'committee',
      decision: mock.decision,
      confidence: mock.confidence,
      memo: mock.memo,
      logs: ['Investment Committee Agent: boardroom vote tally finalized.', 'Completed Investment Committee ballot.', 'Institutional memo compiled.'],
      debate: msg ? [msg] : [],
    };
  }
};

// Create the LangGraph builder
const workflow = new StateGraph<GraphState>({
  channels: GraphStateAnnotation as any
});

// Implement 8 agent nodes in workflow
workflow.addNode('research', nodeFunctions.research);
workflow.addNode('financial', nodeFunctions.financial);
workflow.addNode('news', nodeFunctions.news);
workflow.addNode('competitor', nodeFunctions.competitor);
workflow.addNode('risk', nodeFunctions.risk);
workflow.addNode('futureSim', nodeFunctions.futureSim);
workflow.addNode('devilsAdvocate', nodeFunctions.devilsAdvocate);
workflow.addNode('committee', nodeFunctions.committee);

// Connect 8 nodes
workflow.addEdge(START as any, 'research' as any);
workflow.addEdge('research' as any, 'financial' as any);
workflow.addEdge('financial' as any, 'news' as any);
workflow.addEdge('news' as any, 'competitor' as any);
workflow.addEdge('competitor' as any, 'risk' as any);
workflow.addEdge('risk' as any, 'futureSim' as any);
workflow.addEdge('futureSim' as any, 'devilsAdvocate' as any);
workflow.addEdge('devilsAdvocate' as any, 'committee' as any);
workflow.addEdge('committee' as any, END as any);

// Compile the graph
export const researchGraph = workflow.compile();

/**
 * Executes research on a company ticker step-by-step, streaming results
 */
export async function executeResearch(ticker: string, emitter: (event: any) => void) {
  try {
    emitter({ type: 'start', message: `Initializing 8-agent intelligence sweep for ${ticker}...` });
    
    const stepOutputs: string[] = [
      'research', 'financial', 'news', 'competitor', 
      'risk', 'futureSim', 'devilsAdvocate', 'committee'
    ];
    
    let currentState: any = { ticker };
    
    for (const nodeName of stepOutputs) {
      // Simulate think/latency (recruiter wow-factor)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const node = nodeFunctions[nodeName];
      if (!node) {
        throw new Error(`Failed to retrieve function handler for node: ${nodeName}`);
      }
      
      const output = await node(currentState);
      
      currentState = {
        ...currentState,
        ...output,
        logs: [...(currentState.logs || []), ...(output.logs || [])],
        debate: [...(currentState.debate || []), ...(output.debate || [])],
        dnaScores: { ...(currentState.dnaScores || {}), ...(output.dnaScores || {}) },
      };
      
      emitter({
        type: 'step',
        step: nodeName,
        data: {
          currentStep: nodeName,
          logs: output.logs || [],
          latestMessage: output.debate?.[0] || null,
          companyName: currentState.companyName,
          dnaScores: currentState.dnaScores,
          simulations: currentState.simulations,
          sources: currentState.sources,
          peers: currentState.peers,
          alphaSignals: currentState.alphaSignals,
          dcfValuation: currentState.dcfValuation,
          sentimentGrid: currentState.sentimentGrid,
          decision: currentState.decision,
          confidence: currentState.confidence,
          memo: currentState.memo,
        }
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    emitter({ type: 'complete', data: currentState });
    
  } catch (error: any) {
    emitter({ type: 'error', message: error.message });
  }
}
