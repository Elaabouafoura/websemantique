import { useEffect, useState } from "react";
import axios from "axios";

export default function TrajetsPage() {
  const [trajets, setTrajets] = useState([]);
  const [relations, setRelations] = useState([]);
  const [trajetForm, setTrajetForm] = useState({ id: "", duree: "", distance: "" });
  const [linkForm, setLinkForm] = useState({ utilisateur: "", trajet: "" });

  // ------------------- Récupérer tous les trajets et relations -------------------
  const fetchTrajets = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/utilisateurs/trajets/");
      setRelations(res.data.relations || []);
    } catch (err) {
      console.error(err);
      setRelations([]);
    }
  };

  useEffect(() => {
    fetchTrajets();
  }, []);

  // ------------------- Ajouter un trajet -------------------
  const addTrajet = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/add_trajet/", trajetForm);
      alert(res.data.message);
      setTrajetForm({ id: "", duree: "", distance: "" });
      fetchTrajets();
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  // ------------------- Ajouter relation utilisateur → trajet -------------------
  const addRelation = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/utilisateur/effectue_trajet/", linkForm);
      alert(res.data.message);
      setLinkForm({ utilisateur: "", trajet: "" });
      fetchTrajets();
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  const handleTrajetInputChange = (field, value) => {
    setTrajetForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinkInputChange = (field, value) => {
    setLinkForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const headers = ["Utilisateur", "Trajet", "Durée", "Distance"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>🛣️ Gestion des Trajets</h1>
          <p style={styles.subtitle}>Gérez les trajets et leurs relations avec les utilisateurs</p>
        </div>

        {/* Formulaire ajout trajet */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Ajouter un Trajet</h3>
          <form onSubmit={addTrajet}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Trajet</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID du trajet"
                  value={trajetForm.id}
                  onChange={(e) => handleTrajetInputChange("id", e.target.value)}
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
                <label style={styles.label}>Durée</label>
                <input
                  type="text"
                  placeholder="Ex: 25 min"
                  value={trajetForm.duree}
                  onChange={(e) => handleTrajetInputChange("duree", e.target.value)}
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
                <label style={styles.label}>Distance</label>
                <input
                  type="text"
                  placeholder="Ex: 10 km"
                  value={trajetForm.distance}
                  onChange={(e) => handleTrajetInputChange("distance", e.target.value)}
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
              style={styles.primaryButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              🛣️ Ajouter Trajet
            </button>
          </form>
        </div>

        {/* Formulaire lien utilisateur → trajet */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>🔗 Ajouter relation Utilisateur → Trajet</h3>
          <form onSubmit={addRelation}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Utilisateur</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID utilisateur"
                  value={linkForm.utilisateur}
                  onChange={(e) => handleLinkInputChange("utilisateur", e.target.value)}
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
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Trajet</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID trajet"
                  value={linkForm.trajet}
                  onChange={(e) => handleLinkInputChange("trajet", e.target.value)}
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
            </div>
            <button 
              type="submit" 
              style={styles.secondaryButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              🔗 Ajouter Relation
            </button>
          </form>
        </div>

        {/* Liste des relations */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Relations Utilisateur → Trajet</h3>
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
                  {relations.map((relation, idx) => (
                    <tr 
                      key={idx} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdf9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>
                        <span style={styles.userBadge}>
                          👤 {relation.utilisateur}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.trajetBadge}>
                          🛣️ {relation.trajet}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.dureeBadge}>
                          ⏱️ {relation.duree}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.distanceBadge}>
                          📏 {relation.distance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {relations.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune relation enregistrée</div>
                <div style={styles.emptySubtext}>Ajoutez des relations utilisateur → trajet pour commencer</div>
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
  secondaryButton: {
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
  trajetBadge: {
    backgroundColor: '#f0fdf4',
    color: '#059669',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  dureeBadge: {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  distanceBadge: {
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