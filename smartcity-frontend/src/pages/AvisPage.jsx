import { useEffect, useState } from "react";
import axios from "axios";

export default function AvisPage() {
  const [avisList, setAvisList] = useState([]);
  const [form, setForm] = useState({ id: "", description: "", utilisateur_id: "" });
  const [message, setMessage] = useState(null);
  const [filterUser, setFilterUser] = useState("");

  const BASE_URL = "http://127.0.0.1:8000";

  // Charger les avis au démarrage
  useEffect(() => {
    fetchAvis();
  }, []);

  // Récupère tous les avis
  const fetchAvis = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/avis/`);
      setAvisList(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de charger les avis.");
    }
  };

  // Ajouter un avis
  const addAvis = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post(`${BASE_URL}/add_avis/`, form);
      setMessage(res.data.message || "✅ Avis ajouté avec succès !");
      setForm({ id: "", description: "", utilisateur_id: "" });
      fetchAvis();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l'ajout de l'avis.");
    }
  };

  // Filtrer les avis par utilisateur
  const fetchAvisByUser = async (e) => {
    e.preventDefault();
    if (!filterUser.trim()) {
      fetchAvis();
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/avis/${filterUser}`);
      setAvisList(res.data);
      setMessage(`📋 Avis de l'utilisateur '${filterUser}'`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Impossible de charger les avis de cet utilisateur.");
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilter = () => {
    setFilterUser("");
    fetchAvis();
    setMessage("🔄 Liste complète des avis");
  };

  const headers = ["ID", "Utilisateur", "Description"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>💬 Gestion des avis</h1>
          <p style={styles.subtitle}>Consultez et gérez les retours des utilisateurs</p>
        </div>

        {/* Message */}
        {message && (
          <div 
            style={{
              ...styles.message,
              ...(message.startsWith("✅") ? styles.successMessage : 
                   message.startsWith("❌") ? styles.errorMessage : styles.infoMessage)
            }}
          >
            {message}
          </div>
        )}

        {/* Formulaire d'ajout */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Ajouter un avis</h3>
          <form onSubmit={addAvis}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID de l'avis</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de l'avis"
                  value={form.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
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
                <label style={styles.label}>ID utilisateur</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID utilisateur"
                  value={form.utilisateur_id}
                  onChange={(e) => handleInputChange("utilisateur_id", e.target.value)}
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
                <label style={styles.label}>Description</label>
                <input
                  type="text"
                  placeholder="Entrez la description"
                  value={form.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
            </div>

            <button 
              type="submit" 
              style={styles.primaryButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
            >
              💬 Ajouter l'avis
            </button>
          </form>
        </div>

        {/* Filtre par utilisateur */}
        <div style={styles.filterCard}>
          <h3 style={styles.formTitle}>🔍 Filtrer par utilisateur</h3>
          <form onSubmit={fetchAvisByUser} style={styles.filterForm}>
            <div style={styles.filterInputGroup}>
              <input
                type="text"
                placeholder="Entrez l'ID utilisateur à filtrer"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                style={styles.filterInput}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={styles.filterButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                🔍 Rechercher
              </button>
              <button
                type="button"
                onClick={handleResetFilter}
                style={styles.resetButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#6b7280'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#9ca3af'}
              >
                ↻ Réinitialiser
              </button>
            </div>
          </form>
        </div>

        {/* Tableau des avis */}
        <div style={styles.tableSection}>
          <h3 style={styles.tableTitle}>📋 Liste des avis</h3>
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
                  {avisList.map((avis) => (
                    <tr 
                      key={avis.avis} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>{avis.avis}</td>
                      <td style={styles.tableCell}>
                        <span style={styles.userBadge}>
                          {avis.utilisateur}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.description}>
                          {avis.description}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {avisList.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucun avis trouvé</div>
                <div style={styles.emptySubtext}>
                  {filterUser ? `Aucun avis pour l'utilisateur "${filterUser}"` : 'Ajoutez un avis pour commencer'}
                </div>
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
  message: {
    marginBottom: '1.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500'
  },
  successMessage: {
    backgroundColor: '#f0fdf4',
    color: '#059669',
    border: '1px solid #bbf7d0'
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  },
  infoMessage: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #dbeafe'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  filterCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    marginBottom: '2rem'
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
  filterForm: {
    width: '100%'
  },
  filterInputGroup: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  filterInput: {
    flex: '1',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: 'white'
  },
  filterButton: {
    backgroundColor: '#10b981',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap'
  },
  resetButton: {
    backgroundColor: '#9ca3af',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap'
  },
  tableSection: {
    marginBottom: '2rem'
  },
  tableTitle: {
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
    backgroundColor: '#faf5ff',
    color: '#7c3aed',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  description: {
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
    .primary-button {
      width: auto;
    }
    .filter-input-group {
      flex-direction: row;
    }
  }
  
  @media (min-width: 1024px) {
    .form-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 767px) {
    .filter-input-group {
      flex-direction: column;
    }
    .filter-input, .filter-button, .reset-button {
      width: 100%;
    }
  }
`;

// Injection des media queries
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}