import { useEffect, useState } from "react";
import axios from "axios";

export default function RechargePage() {
  const [stations, setStations] = useState([]);
  const [reseauxRecharge, setReseauxRecharge] = useState([]);
  const [stationForm, setStationForm] = useState({ id: "" });
  const [linkForm, setLinkForm] = useState({ reseau: "", station: "" });

  // ------------------- Fetch stations -------------------
  const fetchStations = async () => {
    const res = await axios.get("http://127.0.0.1:8000/stations_recharge/");
    setStations(res.data);
  };

  // ------------------- Fetch relations reseau -> station -------------------
  const fetchReseauxRecharge = async () => {
    const res = await axios.get("http://127.0.0.1:8000/reseaux/seRecharge");
    setReseauxRecharge(res.data.data);
  };

  useEffect(() => {
    fetchStations();
    fetchReseauxRecharge();
  }, []);

  // ------------------- Add new station -------------------
  const addStation = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/add_station_recharge/", stationForm);
    setStationForm({ id: "" });
    fetchStations();
  };

  // ------------------- Add new relation reseau -> station -------------------
  const addReseauRecharge = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/reseaux/seRecharge", linkForm);
    setLinkForm({ reseau: "", station: "" });
    fetchReseauxRecharge();
  };

  const handleStationInputChange = (value) => {
    setStationForm({ id: value });
  };

  const handleLinkInputChange = (field, value) => {
    setLinkForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const headers = ["Réseau", "Station"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>⚡ Gestion Stations de Recharge</h1>
          <p style={styles.subtitle}>Gérez les stations de recharge et leurs relations avec les réseaux</p>
        </div>

        {/* Formulaire ajout station */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Ajouter une station</h3>
          <form onSubmit={addStation}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID de la station</label>
              <input
                type="text"
                placeholder="Entrez l'ID de la station"
                value={stationForm.id}
                onChange={(e) => handleStationInputChange(e.target.value)}
                style={styles.input}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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
              onMouseOver={(e) => e.target.style.backgroundColor = '#322487ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#33248bff'}
            >
              ➕ Ajouter une station
            </button>
          </form>
        </div>

        {/* Formulaire ajout relation reseau -> station */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>🔗 Ajouter une relation Réseau → Station</h3>
          <form onSubmit={addReseauRecharge}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID du réseau</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID du réseau"
                  value={linkForm.reseau}
                  onChange={(e) => handleLinkInputChange("reseau", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID de la station</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de la station"
                  value={linkForm.station}
                  onChange={(e) => handleLinkInputChange("station", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            <button 
              type="submit" 
              style={styles.secondaryButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              🔗 Ajouter la relation
            </button>
          </form>
        </div>

        {/* Liste des stations */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Stations de recharge</h3>
          <div style={styles.stationsCard}>
            {stations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune station de recharge</div>
                <div style={styles.emptySubtext}>Ajoutez une station pour commencer</div>
              </div>
            ) : (
              <div style={styles.stationsGrid}>
                {stations.map((station) => (
                  <div 
                    key={station.id} 
                    style={styles.stationItem}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={styles.stationIcon}>⚡</div>
                    <div style={styles.stationId}>{station.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liste des relations reseau -> station */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔗 Relations Réseau → Station</h3>
          <div style={styles.tableCard}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    {headers.map(header => (
                      <th key={header} style={styles.tableHead}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reseauxRecharge.map((relation, idx) => (
                    <tr 
                      key={idx} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>
                        <span style={styles.reseauBadge}>
                          {relation.reseau.split("#").pop()}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.stationBadge}>
                          {relation.station.split("#").pop()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {reseauxRecharge.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune relation réseau → station</div>
                <div style={styles.emptySubtext}>Ajoutez une relation pour commencer</div>
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
    marginBottom: '2rem'
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
    marginBottom: '1.5rem'
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
    backgroundColor: '#292c99ff',
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
    backgroundColor: '#3b82f6',
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
  stationsCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  },
  stationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem'
  },
  stationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    transition: 'background-color 0.15s',
    backgroundColor: 'white'
  },
  stationIcon: {
    fontSize: '1.25rem'
  },
  stationId: {
    fontWeight: '500',
    color: '#374151'
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
  reseauBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  stationBadge: {
    backgroundColor: '#f0fdf4',
    color: '#059669',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
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
    .primary-button, .secondary-button {
      width: auto;
    }
  }
`;

// Injection des media queries
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}