// src/pages/AIQuery.jsx
import { useState } from "react";
import axios from "axios";

export default function AIQuery() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const ask = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post("http://localhost:8000/ask_ia/", { question });
      setResult(res.data);
      
      // Ajouter à l'historique
      setHistory(prev => [{
        question,
        result: res.data,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]); // Garder les 5 dernières requêtes
      
    } catch (err) {
      console.error("Erreur lors de la requête IA:", err);
      setError("Erreur lors de la communication avec l'IA. Vérifiez que le serveur est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  const exampleQueries = [
    "Montre-moi tous les métros reliés à une station",
    "Quels sont les utilisateurs ayant donné des avis",
    "Liste toutes les infrastructures de type route",
    "Affiche les statistiques de pollution",
    "Quels trajets ont été effectués par les utilisateurs"
  ];

  const handleExampleClick = (example) => {
    setQuestion(example);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      ask();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>🧠 Assistant IA SmartCity</h1>
            <p style={styles.subtitle}>
              Interrogez vos données avec des questions en langage naturel
            </p>
          </div>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{history.length}</span>
              <span style={styles.statLabel}>Requêtes</span>
            </div>
          </div>
        </div>

        {/* Zone principale */}
        <div style={styles.mainContent}>
          {/* Section de requête */}
          <div style={styles.querySection}>
            <div style={styles.queryCard}>
              <div style={styles.queryHeader}>
                <h3 style={styles.queryTitle}>💬 Posez votre question</h3>
                <div style={styles.queryTips}>
                  <span style={styles.tip}>💡 Ctrl + Enter pour envoyer</span>
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyPress}
                  style={styles.textarea}
                  placeholder="Ex: Montre-moi tous les métros reliés à une station de recharge..."
                  rows="4"
                />
                <div style={styles.charCount}>
                  {question.length} caractères
                </div>
              </div>

              {/* Exemples de requêtes */}
              <div style={styles.examplesSection}>
                <h4 style={styles.examplesTitle}>Exemples de questions :</h4>
                <div style={styles.examplesGrid}>
                  {exampleQueries.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      style={styles.exampleButton}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.actions}>
                <button 
                  onClick={ask}
                  disabled={loading || !question.trim()}
                  style={{
                    ...styles.primaryButton,
                    ...((loading || !question.trim()) && styles.buttonDisabled)
                  }}
                >
                  {loading ? (
                    <div style={styles.buttonContent}>
                      <div style={styles.spinner}></div>
                      <span>Analyse en cours...</span>
                    </div>
                  ) : (
                    <div style={styles.buttonContent}>
                      <span style={styles.buttonIcon}>🚀</span>
                      <span>Analyser avec l'IA</span>
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={() => setQuestion("")}
                  style={styles.secondaryButton}
                  disabled={loading}
                >
                  🗑️ Effacer
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          {error && (
            <div style={styles.errorCard}>
              <div style={styles.errorHeader}>
                <span style={styles.errorIcon}>⚠️</span>
                <h3 style={styles.errorTitle}>Erreur</h3>
              </div>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {result && (
            <div style={styles.resultsSection}>
              <div style={styles.resultsCard}>
                <div style={styles.resultsHeader}>
                  <h3 style={styles.resultsTitle}>📊 Résultats de l'analyse</h3>
                  <div style={styles.resultsMeta}>
                    <span style={styles.metaItem}>✅ Requête traitée</span>
                  </div>
                </div>

                <div style={styles.resultContent}>
                  <div style={styles.sparqlSection}>
                    <h4 style={styles.sectionTitle}>
                      🔍 Requête SPARQL générée
                    </h4>
                    <div style={styles.codeBlock}>
                      <pre style={styles.code}>{result.sparql_query}</pre>
                    </div>
                  </div>

                  <div style={styles.dataSection}>
                    <h4 style={styles.sectionTitle}>
                      📄 Données récupérées
                    </h4>
                    <div style={styles.jsonBlock}>
                      <pre style={styles.json}>
                        {JSON.stringify(result.results, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historique */}
          {history.length > 0 && (
            <div style={styles.historySection}>
              <div style={styles.historyHeader}>
                <h3 style={styles.historyTitle}>📝 Historique des requêtes</h3>
                <button 
                  onClick={clearHistory}
                  style={styles.clearButton}
                >
                  🗑️ Effacer l'historique
                </button>
              </div>
              
              <div style={styles.historyGrid}>
                {history.map((item, index) => (
                  <div key={index} style={styles.historyItem}>
                    <div style={styles.historyQuestion}>
                      <strong>Q: </strong>{item.question}
                    </div>
                    <div style={styles.historyMeta}>
                      <span style={styles.timestamp}>{item.timestamp}</span>
                      <span style={styles.resultCount}>
                        {item.result.results?.length || 0} résultats
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setQuestion(item.question);
                        setResult(item.result);
                      }}
                      style={styles.reuseButton}
                    >
                      🔄 Réutiliser
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* État vide */}
          {!result && !loading && history.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🤖</div>
              <h3 style={styles.emptyTitle}>Commencez à interroger vos données</h3>
              <p style={styles.emptyText}>
                Utilisez le champ ci-dessus pour poser des questions en langage naturel sur vos données SmartCity.
                L'IA générera automatiquement les requêtes SPARQL correspondantes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    gap: '2rem'
  },
  titleSection: {
    flex: 1
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1.125rem',
    maxWidth: '500px'
  },
  stats: {
    display: 'flex',
    gap: '1rem'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    minWidth: '120px'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#7c3aed'
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'center'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  querySection: {
    width: '100%'
  },
  queryCard: {
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    padding: '2rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)'
  },
  queryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  queryTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  queryTips: {
    display: 'flex',
    gap: '1rem'
  },
  tip: {
    fontSize: '0.75rem',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem'
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  textarea: {
    width: '100%',
    padding: '1rem 1.25rem',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fafafa'
  },
  charCount: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textAlign: 'right',
    marginTop: '0.5rem'
  },
  examplesSection: {
    marginBottom: '1.5rem'
  },
  examplesTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.75rem'
  },
  examplesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '0.5rem'
  },
  exampleButton: {
    backgroundColor: '#f8fafc',
    color: '#374151',
    border: '1px solid #e5e7eb',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    color: 'white',
    fontWeight: '600',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)',
    minWidth: '200px'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontWeight: '600',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    border: '2px solid #e5e7eb',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  buttonIcon: {
    fontSize: '1.125rem'
  },
  spinner: {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '1rem',
    padding: '1.5rem',
    color: '#dc2626'
  },
  errorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  errorIcon: {
    fontSize: '1.25rem'
  },
  errorTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: 0
  },
  errorText: {
    margin: 0,
    fontSize: '0.875rem'
  },
  resultsSection: {
    width: '100%'
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    padding: '2rem',
    overflow: 'hidden'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  resultsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  resultsMeta: {
    display: 'flex',
    gap: '1rem'
  },
  metaItem: {
    fontSize: '0.875rem',
    color: '#059669',
    backgroundColor: '#f0fdf4',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontWeight: '500'
  },
  resultContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  sparqlSection: {
    width: '100%'
  },
  dataSection: {
    width: '100%'
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem'
  },
  codeBlock: {
    backgroundColor: '#1f2937',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    overflow: 'auto'
  },
  code: {
    color: '#e5e7eb',
    fontSize: '0.875rem',
    fontFamily: 'Monaco, Consolas, monospace',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  },
  jsonBlock: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    overflow: 'auto',
    maxHeight: '400px'
  },
  json: {
    color: '#374151',
    fontSize: '0.875rem',
    fontFamily: 'Monaco, Consolas, monospace',
    margin: 0,
    whiteSpace: 'pre-wrap'
  },
  historySection: {
    width: '100%'
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  historyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  clearButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  historyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem'
  },
  historyItem: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    transition: 'all 0.2s ease'
  },
  historyQuestion: {
    fontSize: '0.875rem',
    color: '#374151',
    marginBottom: '1rem',
    lineHeight: '1.4'
  },
  historyMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  resultCount: {
    fontSize: '0.75rem',
    color: '#059669',
    backgroundColor: '#f0fdf4',
    padding: '0.25rem 0.5rem',
    borderRadius: '1rem'
  },
  reuseButton: {
    backgroundColor: '#f8fafc',
    color: '#374151',
    border: '1px solid #e5e7eb',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
    gap: '1rem'
  },
  emptyIcon: {
    fontSize: '4rem',
    opacity: 0.5
  },
  emptyTitle: {
    color: '#374151',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '1rem',
    maxWidth: '500px',
    lineHeight: '1.6'
  }
};

// Media queries et animations
const mediaQueries = `
  @media (max-width: 768px) {
    .wrapper {
      padding: 1.5rem 1rem;
    }
    
    .header {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .title {
      font-size: 1.75rem;
    }
    
    .query-card, .results-card {
      border-radius: 1rem;
      padding: 1.5rem;
    }
    
    .examples-grid {
      grid-template-columns: 1fr;
    }
    
    .actions {
      flex-direction: column;
    }
    
    .primary-button, .secondary-button {
      width: 100%;
      justify-content: center;
    }
    
    .results-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .history-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .clear-button {
      align-self: flex-start;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  textarea:focus {
    border-color: #7c3aed;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    transform: translateY(-1px);
  }

  .primary-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -1px rgba(124, 58, 237, 0.4);
  }

  .secondary-button:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }

  .example-button:hover {
    background-color: #e5e7eb;
    transform: translateY(-1px);
  }

  .history-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .reuse-button:hover {
    background-color: #e5e7eb;
  }

  .clear-button:hover {
    background-color: #f3f4f6;
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}