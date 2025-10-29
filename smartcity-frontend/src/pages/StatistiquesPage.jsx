import { useState, useEffect } from "react";
import axios from "axios";

export default function StatistiquesPage() {
  const [pollutionForm, setPollutionForm] = useState({ id: "", tauxPollution: "" });
  const [accidentForm, setAccidentForm] = useState({ id: "", nbreDaccident: "" });
  const [observationForm, setObservationForm] = useState({ utilisateur_id: "", statistique_id: "" });
  const [statistiques, setStatistiques] = useState([]);
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    fetchStatistiques();
    fetchObservations();
  }, []);

  // --- Fetch toutes les statistiques ---
  const fetchStatistiques = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/statistiques/");
      setStatistiques(res.data);
    } catch (err) {
      console.error("Erreur fetch statistiques:", err);
    }
  };

  // --- Fetch toutes les observations ---
  const fetchObservations = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/observations/");
      setObservations(res.data);
    } catch (err) {
      console.error("Erreur fetch observations:", err);
    }
  };

  // --- Ajouter statistique pollution ---
  const addPollution = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/add_statistique_pollution/", pollutionForm);
    setPollutionForm({ id: "", tauxPollution: "" });
    fetchStatistiques();
  };

  // --- Ajouter statistique accident ---
  const addAccident = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/add_statistique_accident/", accidentForm);
    setAccidentForm({ id: "", nbreDaccident: "" });
    fetchStatistiques();
  };

  // --- Ajouter observation ---
  const addObservation = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/add_observation/", observationForm);
    setObservationForm({ utilisateur_id: "", statistique_id: "" });
    fetchObservations();
  };

  const handlePollutionInputChange = (field, value) => {
    setPollutionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccidentInputChange = (field, value) => {
    setAccidentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObservationInputChange = (field, value) => {
    setObservationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const statsHeaders = ["ID", "Taux Pollution", "Nb accidents"];
  const obsHeaders = ["Utilisateur", "Statistique", "Taux Pollution", "Nb accidents"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Gestion des Statistiques et Observations</h1>
          <p style={styles.subtitle}>Surveillez les données de pollution, accidents et observations</p>
        </div>

        {/* Formulaire Statistique Pollution */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>🌫️ Ajouter Statistique Pollution</h3>
          <form onSubmit={addPollution}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Statistique</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de la statistique"
                  value={pollutionForm.id}
                  onChange={(e) => handlePollutionInputChange("id", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Taux Pollution</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 25.5"
                  value={pollutionForm.tauxPollution}
                  onChange={(e) => handlePollutionInputChange("tauxPollution", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={styles.primaryButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                🌫️ Ajouter Statistique Pollution
              </button>
            </div>
          </form>
        </div>

        {/* Formulaire Statistique Accident */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>🚨 Ajouter Statistique Accident</h3>
          <form onSubmit={addAccident}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Statistique</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de la statistique"
                  value={accidentForm.id}
                  onChange={(e) => handleAccidentInputChange("id", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre d'accidents</label>
                <input
                  type="number"
                  placeholder="Ex: 15"
                  value={accidentForm.nbreDaccident}
                  onChange={(e) => handleAccidentInputChange("nbreDaccident", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={styles.secondaryButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                🚨 Ajouter Statistique Accident
              </button>
            </div>
          </form>
        </div>

        {/* Formulaire Observation */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>👁️ Ajouter Observation</h3>
          <form onSubmit={addObservation}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Utilisateur</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID utilisateur"
                  value={observationForm.utilisateur_id}
                  onChange={(e) => handleObservationInputChange("utilisateur_id", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Statistique</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID statistique"
                  value={observationForm.statistique_id}
                  onChange={(e) => handleObservationInputChange("statistique_id", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={styles.tertiaryButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
              >
                👁️ Ajouter Observation
              </button>
            </div>
          </form>
        </div>

        {/* Liste des Statistiques */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Statistiques</h3>
          <div style={styles.tableCard}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    {statsHeaders.map(header => (
                      <th key={header} style={styles.tableHead}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {statistiques.map((stat) => (
                    <tr 
                      key={stat.id} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>
                        <span style={styles.idBadge}>
                          {stat.id}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {stat.tauxPollution ? (
                          <span style={styles.pollutionBadge}>
                            🌫️ {stat.tauxPollution}
                          </span>
                        ) : (
                          <span style={styles.naText}>-</span>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        {stat.nbreDaccident ? (
                          <span style={styles.accidentBadge}>
                            🚨 {stat.nbreDaccident}
                          </span>
                        ) : (
                          <span style={styles.naText}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {statistiques.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune statistique enregistrée</div>
                <div style={styles.emptySubtext}>Ajoutez des statistiques pour commencer</div>
              </div>
            )}
          </div>
        </div>

        {/* Liste des Observations */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👁️ Observations</h3>
          <div style={styles.tableCard}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    {obsHeaders.map(header => (
                      <th key={header} style={styles.tableHead}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, idx) => (
                    <tr 
                      key={idx} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>
                        <span style={styles.userBadge}>
                          👤 {obs.utilisateur}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.statsBadge}>
                          📊 {obs.statistique}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {obs.tauxPollution ? (
                          <span style={styles.pollutionValue}>
                            {obs.tauxPollution}
                          </span>
                        ) : (
                          <span style={styles.naText}>-</span>
                        )}
                      </td>
                      <td style={styles.tableCell}>
                        {obs.nbreDaccident ? (
                          <span style={styles.accidentValue}>
                            {obs.nbreDaccident}
                          </span>
                        ) : (
                          <span style={styles.naText}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {observations.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune observation enregistrée</div>
                <div style={styles.emptySubtext}>Ajoutez des observations pour commencer</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  formTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  inputGroup: {
    width: '100%'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: 'white'
  },
  primaryButton: {
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    width: '100%'
  },
  secondaryButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    width: '100%'
  },
  tertiaryButton: {
    backgroundColor: '#8b5cf6',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    width: '100%'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem'
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  tableHead: {
    padding: '1rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tableRow: {
    transition: 'background-color 0.15s',
    borderBottom: '1px solid #e5e7eb'
  },
  tableCell: {
    padding: '1rem 1.5rem',
    fontSize: '0.875rem',
    color: '#374151',
    whiteSpace: 'nowrap'
  },
  idBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  pollutionBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  accidentBadge: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  userBadge: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  statsBadge: {
    backgroundColor: '#faf5ff',
    color: '#7c3aed',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  pollutionValue: {
    color: '#059669',
    fontWeight: '600'
  },
  accidentValue: {
    color: '#dc2626',
    fontWeight: '600'
  },
  naText: {
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem'
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '1.125rem',
    marginBottom: '0.5rem'
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: '0.875rem'
  }
};

// Media queries pour le responsive
const mediaQueries = `
  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .primary-button, .secondary-button, .tertiary-button {
      width: auto;
    }
  }
  
  @media (min-width: 1024px) {
    .form-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

// Injection des media queries
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}