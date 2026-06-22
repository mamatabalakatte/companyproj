'use client';

import React, { useState, useEffect } from 'react';
import Boardroom from '@/components/Boardroom';
import DnaRadar from '@/components/DnaRadar';
import DcfSandbox from '@/components/DcfSandbox';
import MonteCarlo from '@/components/MonteCarlo';
import SentimentGrid from '@/components/SentimentGrid';
import SimulationsComponent from '@/components/Simulations';
import Memo from '@/components/Memo';
import { GraphState } from '@/lib/agents/types';
import { Search, Terminal, Database, Clock, RefreshCw, HeartCrack } from 'lucide-react';

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  
  // Dashboard Data State
  const [state, setState] = useState<GraphState | null>(null);
  const [activeTab, setActiveTab] = useState<'boardroom' | 'dna' | 'scenarios' | 'sentiment' | 'memo'>('boardroom');
  
  // Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    setSystemTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    setCurrentStep('research');
    setTerminalLogs([`Initializing 8-agent research scope for core ticker [${ticker.toUpperCase()}]...`]);
    setState(null);

    // Connect to Server Sent Events
    const eventSource = new EventSource(`/api/research?ticker=${ticker}`);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'start') {
          setTerminalLogs(prev => [...prev, payload.message]);
        } else if (payload.type === 'step') {
          const stepData = payload.data;
          setCurrentStep(payload.step);
          
          setTerminalLogs(prev => [
            ...prev,
            ...stepData.logs.map((log: string) => `[${payload.step.toUpperCase()}] ${log}`)
          ]);

          setState(prev => {
            if (!prev) {
              return {
                ticker: ticker.toUpperCase(),
                companyName: stepData.companyName,
                currentStep: payload.step,
                logs: stepData.logs,
                debate: stepData.latestMessage ? [stepData.latestMessage] : [],
                dnaScores: stepData.dnaScores,
                simulations: stepData.simulations,
                sources: stepData.sources || [],
                peers: stepData.peers || [],
                alphaSignals: stepData.alphaSignals || [],
                dcfValuation: stepData.dcfValuation,
                sentimentGrid: stepData.sentimentGrid || [],
                decision: stepData.decision,
                confidence: stepData.confidence,
                memo: stepData.memo,
              };
            }

            const updatedDebate = [...prev.debate];
            if (stepData.latestMessage && !updatedDebate.some(m => m.timestamp === stepData.latestMessage.timestamp)) {
              updatedDebate.push(stepData.latestMessage);
            }

            return {
              ...prev,
              currentStep: payload.step,
              logs: [...prev.logs, ...stepData.logs],
              debate: updatedDebate,
              dnaScores: stepData.dnaScores,
              simulations: stepData.simulations,
              sources: stepData.sources || prev.sources,
              peers: stepData.peers || prev.peers,
              alphaSignals: stepData.alphaSignals || prev.alphaSignals,
              dcfValuation: stepData.dcfValuation,
              sentimentGrid: stepData.sentimentGrid || prev.sentimentGrid,
              decision: stepData.decision,
              confidence: stepData.confidence,
              memo: stepData.memo || prev.memo,
            };
          });
        } else if (payload.type === 'complete') {
          setIsSearching(false);
          setCurrentStep('committee');
          setTerminalLogs(prev => [...prev, `[SYSTEM] Boardroom debate concluded. Dynamic research compiled.`]);
          eventSource.close();
        } else if (payload.type === 'error') {
          setErrorMessage(payload.message);
          setIsSearching(false);
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = (err) => {
      setErrorMessage('Communication block with the intelligence core.');
      setIsSearching(false);
      eventSource.close();
    };
  };

  return (
    <div style={styles.appContainer} className="bg-obsidian min-h-screen text-slate-100 flex flex-col font-sans">
      <div className="grid-overlay" />
      
      {/* Bloomberg Status Header */}
      <header style={styles.header} className="no-print">
        <div style={styles.headerLeft}>
          <div style={styles.glowIndicator} />
          <h1 style={styles.logo}>AI-IROS <span style={styles.logoVersion}>v2.0.0</span></h1>
          <span style={styles.logoDivider}>|</span>
          <span style={styles.logoSubtitle}>QUANT MULTI-AGENT DEBATE ENGINE</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.metaItem}>
            <Database size={12} style={{ marginRight: '4px' }} />
            <span>TAVILY-SEC: ACTIVE</span>
          </div>
          <div style={styles.metaItem}>
            <Clock size={12} style={{ marginRight: '4px' }} />
            <span>SYS_TIME: {systemTime}</span>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main style={styles.mainContent}>
        {/* Ticker Search Panel */}
        <section style={styles.searchPanel} className="glass-panel no-print">
          <form onSubmit={handleSearch} style={styles.form}>
            <div style={styles.inputContainer} className="search-input-container">
              <Search size={16} color="var(--text-secondary)" style={{ marginLeft: '12px' }} />
              <input
                type="text"
                placeholder="ENTER ENTITY TICKER (e.g. AAPL, TSLA, NVDA, RELIANCE, INFY)..."
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                disabled={isSearching}
                style={styles.searchInput}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !ticker.trim()}
              style={{
                ...styles.searchBtn,
                backgroundColor: isSearching ? 'rgba(0, 229, 255, 0.05)' : 'var(--cyberspace-blue)',
                color: isSearching ? 'var(--cyberspace-blue)' : 'var(--bg-obsidian)',
                borderColor: isSearching ? 'var(--cyberspace-blue)' : 'transparent'
              }}
            >
              {isSearching ? (
                <>
                  <RefreshCw size={13} className="spin-animate" style={{ marginRight: '8px' }} />
                  DEBATING
                </>
              ) : (
                'INITIATE RESEARCH'
              )}
            </button>
          </form>

          {/* Quick recommendations helper for recruiters */}
          <div style={styles.quickPrompts}>
            <span style={styles.quickLabel}>CORES:</span>
            {['AAPL', 'TSLA', 'NVDA', 'RELIANCE', 'INFY'].map((t) => (
              <button
                key={t}
                onClick={() => setTicker(t)}
                disabled={isSearching}
                style={{
                  ...styles.quickBtn,
                  color: ticker === t ? 'var(--cyberspace-blue)' : 'var(--text-secondary)',
                  borderColor: ticker === t ? 'var(--cyberspace-blue)' : 'var(--border-solid)'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {errorMessage && (
          <div style={styles.errorAlert} className="glass-panel glow-red no-print">
            <HeartCrack size={18} style={{ marginRight: '10px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dashboard Grid output */}
        {state ? (
          <div style={styles.dashboardLayout}>
            {/* Header Data Strip */}
            <div style={styles.dataStrip} className="glass-panel no-print">
              <div>
                <span style={styles.stripLabel}>COMPANY ENTITY</span>
                <h2 style={styles.stripValue}>{state.companyName || state.ticker}</h2>
              </div>
              <div>
                <span style={styles.stripLabel}>INTRINSIC VALUE</span>
                <h2 style={{ ...styles.stripValue, color: 'var(--cyberspace-blue)' }}>
                  {state.dcfValuation ? `$${state.dcfValuation.intrinsicValue.toFixed(2)}` : 'COMPILING...'}
                </h2>
              </div>
              <div>
                <span style={styles.stripLabel}>VALUATION SPREAD</span>
                <h2 style={{
                  ...styles.stripValue,
                  color: state.dcfValuation ? (state.dcfValuation.upside >= 0 ? 'var(--terminal-green)' : 'var(--alert-red)') : 'var(--text-muted)'
                }}>
                  {state.dcfValuation ? (state.dcfValuation.upside >= 0 ? `+${state.dcfValuation.upside.toFixed(1)}%` : `${state.dcfValuation.upside.toFixed(1)}%`) : 'COMPILING...'}
                </h2>
              </div>
              <div>
                <span style={styles.stripLabel}>Consensus decision</span>
                <h2 style={{
                  ...styles.stripValue,
                  color: state.decision === 'INVEST' ? 'var(--terminal-green)' : state.decision === 'PASS' ? 'var(--alert-red)' : 'var(--gold)'
                }}>
                  {state.decision}
                </h2>
              </div>
            </div>

            {/* Dashboard Tabs menu */}
            <div style={styles.tabsContainer} className="no-print">
              <button
                onClick={() => setActiveTab('boardroom')}
                style={{ ...styles.tabLink, color: activeTab === 'boardroom' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'boardroom' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Boardroom Debate
              </button>
              <button
                onClick={() => setActiveTab('dna')}
                style={{ ...styles.tabLink, color: activeTab === 'dna' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'dna' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                DNA & Valuation
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                style={{ ...styles.tabLink, color: activeTab === 'scenarios' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'scenarios' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Simulations & Monte Carlo
              </button>
              <button
                onClick={() => setActiveTab('sentiment')}
                style={{ ...styles.tabLink, color: activeTab === 'sentiment' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'sentiment' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Sentiment Metrics
              </button>
              <button
                onClick={() => setActiveTab('memo')}
                style={{ ...styles.tabLink, color: activeTab === 'memo' ? 'var(--cyberspace-blue)' : 'var(--text-secondary)', borderBottomColor: activeTab === 'memo' ? 'var(--cyberspace-blue)' : 'transparent' }}
              >
                Institutional Memo
              </button>
            </div>

            {/* Active Tab View */}
            <div style={styles.viewPort}>
              {activeTab === 'boardroom' && (
                <div style={styles.singleView}>
                  <Boardroom
                    debate={state.debate}
                    currentStep={isSearching ? currentStep : ''}
                    decision={state.decision}
                    confidence={state.confidence}
                  />
                </div>
              )}

              {activeTab === 'dna' && (
                !state.dcfValuation || state.dcfValuation.currentPrice === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[FINANCIAL ANALYST] is compiling corporate valuation models...</span>
                  </div>
                ) : (
                  <div style={styles.dualView}>
                    <div style={styles.colHalf} className="glass-panel flex flex-col justify-between">
                      <div style={{ padding: '24px' }}>
                        <h3 style={styles.colTitle}>INVESTMENT DNA VECTOR</h3>
                        <DnaRadar scores={state.dnaScores} />
                      </div>
                    </div>
                    <div style={styles.colHalf} className="flex flex-col gap-4">
                      <DcfSandbox
                        currentPrice={state.dcfValuation.currentPrice}
                        upside={state.dcfValuation.upside}
                      />
                    </div>
                  </div>
                )
              )}

              {activeTab === 'scenarios' && (
                !state.simulations || state.simulations.bull.priceTarget === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[FUTURE SIMULATION AGENT] is executing price paths...</span>
                  </div>
                ) : (
                  <div style={styles.dualView}>
                    <div style={styles.colHalf}>
                      <SimulationsComponent simulations={state.simulations} />
                    </div>
                    <div style={styles.colHalf}>
                      <MonteCarlo
                        simulations={state.simulations}
                        currentPrice={state.dcfValuation.currentPrice}
                      />
                    </div>
                  </div>
                )
              )}

              {activeTab === 'sentiment' && (
                !state.sentimentGrid || state.sentimentGrid.length === 0 ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[NEWS & SENTIMENT ANALYST] is calculating headline vectors...</span>
                  </div>
                ) : (
                  <div style={styles.singleView}>
                    <SentimentGrid grid={state.sentimentGrid} />
                  </div>
                )
              )}

              {activeTab === 'memo' && (
                !state.memo ? (
                  <div style={styles.loadingTab} className="glass-panel">
                    <RefreshCw size={24} className="spin-animate" style={{ color: 'var(--cyberspace-blue)', marginBottom: '12px' }} />
                    <span style={styles.loadingTabText}>[INVESTMENT COMMITTEE] is compiling the institutional memo...</span>
                  </div>
                ) : (
                  <div style={styles.singleView}>
                    <Memo memoText={state.memo} ticker={state.ticker} />
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          /* Empty/Initial State Display */
          <div style={styles.emptyWelcome} className="glass-panel no-print">
            <Terminal size={40} color="var(--cyberspace-blue)" style={{ marginBottom: '16px' }} />
            <h2 style={styles.welcomeTitle}>ENTERPRISES AGENT MATRIX</h2>
            <p style={styles.welcomeDesc}>
              Initialize the AI Investment Research Operating System by providing a stock ticker. The 8-agent boardroom will execute a LangGraph analysis state-cycle and compile an institutional investment memo.
            </p>
          </div>
        )}

        {/* Real-time Streaming Logs Marquee console */}
        <section style={styles.consolePanel} className="glass-panel no-print">
          <div style={styles.consoleHeader}>
            <div style={styles.consoleTitle}>
              <Terminal size={14} style={{ marginRight: '6px' }} />
              <span>DECRYPTION STREAMING LOGS</span>
            </div>
            <div style={styles.pulseContainer}>
              <span className="pulse-dot" />
              <span style={styles.pulseText}>DECRYPTION_CORE_ACTIVE</span>
            </div>
          </div>
          <div style={styles.consoleLogs} id="console-logs-container">
            {terminalLogs.map((log, idx) => (
              <div key={idx} style={styles.logLine}>
                <span style={styles.logTimestamp}>[{new Date().toLocaleTimeString()}]</span>
                <span style={styles.logText}>{log}</span>
              </div>
            ))}
            {isSearching && (
              <div style={styles.logLine}>
                <span style={styles.logTimestamp}>[{new Date().toLocaleTimeString()}]</span>
                <span style={{ ...styles.logText, color: 'var(--cyberspace-blue)' }}>
                  <RefreshCw size={10} className="spin-animate" style={{ display: 'inline-block', marginRight: '6px' }} />
                  Node [{currentStep.toUpperCase()}] executing analytical sweeps...
                </span>
              </div>
            )}
            {terminalLogs.length === 0 && !isSearching && (
              <div style={styles.logLineEmpty}>
                &gt; SYSTEM STANDBY. AWAITING TICKER INITIATION PROTOCOL...
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// Obsidian Bloomberg stylesheet
const styles = {
  appContainer: {
    position: 'relative' as const,
    backgroundColor: 'var(--bg-obsidian)',
    color: 'var(--text-primary)',
    fontFamily: "'Inter', 'Outfit', sans-serif"
  },
  header: {
    height: '52px',
    backgroundColor: 'var(--bg-dark-gray)',
    borderBottom: '1px solid var(--border-solid)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    zIndex: 10
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  glowIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--cyberspace-blue)',
    marginRight: '12px',
    boxShadow: '0 0 10px var(--cyberspace-blue)'
  },
  logo: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: 'var(--text-primary)'
  },
  logoVersion: {
    fontSize: '9px',
    color: 'var(--cyberspace-blue)',
    verticalAlign: 'super',
    marginLeft: '2px'
  },
  logoDivider: {
    color: 'var(--border-solid)',
    margin: '0 12px',
    fontSize: '14px'
  },
  logoSubtitle: {
    fontSize: '10px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '11px',
    color: 'var(--text-secondary)'
  },
  mainContent: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    maxWidth: '1440px',
    margin: '0 auto',
    width: '100%'
  },
  searchPanel: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '16px'
  },
  form: {
    display: 'flex',
    flex: 1,
    gap: '12px',
    minWidth: '300px'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid var(--border-solid)',
    borderRadius: '4px',
    transition: 'border-color 0.2s'
  },
  searchInput: {
    flex: 1,
    height: '38px',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '12px',
    color: 'var(--text-primary)',
    padding: '0 12px',
    letterSpacing: '0.5px'
  },
  searchBtn: {
    padding: '0 24px',
    height: '40px',
    border: '1px solid transparent',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  quickPrompts: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quickLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
    marginRight: '4px'
  },
  quickBtn: {
    height: '28px',
    padding: '0 12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-solid)',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  errorAlert: {
    padding: '12px 18px',
    color: 'var(--alert-red)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px'
  },
  emptyWelcome: {
    padding: '64px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    minHeight: '320px'
  },
  welcomeTitle: {
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: 'var(--text-primary)',
    marginBottom: '12px'
  },
  welcomeDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    maxWidth: '520px',
    lineHeight: '1.8'
  },
  dashboardLayout: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  dataStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '24px',
    padding: '16px 24px'
  },
  stripLabel: {
    fontSize: '9px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '4px'
  },
  stripValue: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    color: 'var(--text-primary)'
  },
  tabsContainer: {
    display: 'flex',
    borderBottom: '1px solid var(--border-solid)',
    gap: '28px',
    padding: '0 4px'
  },
  tabLink: {
    padding: '12px 0 10px 0',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  viewPort: {
    minHeight: '420px'
  },
  singleView: {
    width: '100%'
  },
  dualView: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '24px'
  },
  colHalf: {
    flex: 1,
    minWidth: '320px'
  },
  colTitle: {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: 'var(--text-primary)',
    marginBottom: '16px'
  },
  loadingTab: {
    height: '320px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const
  },
  loadingTabText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px'
  },
  consolePanel: {
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  consoleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-solid)',
    paddingBottom: '8px'
  },
  consoleTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '1px'
  },
  pulseContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  pulseText: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  consoleLogs: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: 'var(--terminal-green)',
    lineHeight: '1.7',
    maxHeight: '150px',
    overflowY: 'auto' as const,
    padding: '4px 0'
  },
  logLine: {
    marginBottom: '4px',
    wordBreak: 'break-all' as const
  },
  logTimestamp: {
    color: 'var(--text-secondary)',
    marginRight: '8px'
  },
  logText: {
    color: 'var(--terminal-green)'
  },
  logLineEmpty: {
    color: 'var(--text-muted)',
    fontStyle: 'italic'
  }
};
