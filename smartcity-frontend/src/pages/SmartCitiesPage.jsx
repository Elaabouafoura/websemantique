import { useEffect, useState } from "react";
import axios from "axios";

export default function SmartCitiesPage() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ id: "", gouvernance: "", description: "" });

  // ------------------- Récupérer toutes les SmartCities -------------------
  const fetchCities = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/smartcities/");
      setCities(res.data);
    } catch (err) {
      console.error(err);
      setCities([]);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // ------------------- Ajouter une SmartCity -------------------
  const addCity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/add_smartcity/", form);
      alert(res.data.message);
      setForm({ id: "", gouvernance: "", description: "" });
      fetchCities();
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const headers = ["ID", "Gouvernance", "Description"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏙️ Gestion des SmartCities</h1>
          <p style={styles.subtitle}>Gérez les villes intelligentes et leurs caractéristiques</p>
        </div>

        {/* Formulaire ajout SmartCity */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Ajouter une SmartCity</h3>
          <form onSubmit={addCity}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID SmartCity</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de la SmartCity"
                  value={form.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Gouvernance</label>
                <input
                  type="text"
                  placeholder="Entrez le gouvernorat"
                  value={form.gouvernance}
                  onChange={(e) => handleInputChange("gouvernance", e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
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
                    e.target.style.borderColor = '#7c3aed';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
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
              onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
            >
              🏙️ Ajouter SmartCity
            </button>
          </form>
        </div>

        {/* Liste des SmartCities */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Liste des SmartCities</h3>
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
                  {cities.map((city) => (
                    <tr 
                      key={city.id} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>
                        <span style={styles.cityIdBadge}>
                          {city.id}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.governanceBadge}>
                          {city.gouvernance}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.description}>
                          {city.description}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {cities.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune SmartCity enregistrée</div>
                <div style={styles.emptySubtext}>Ajoutez une SmartCity pour commencer</div>
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
    backgroundColor: '#7c3aed',
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
  cityIdBadge: {
    backgroundColor: '#faf5ff',
    color: '#7c3aed',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  governanceBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
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
  }
  
  @media (min-width: 1024px) {
    .form-grid {
      grid-templateColumns: repeat(3, 1fr);
    }
  }
`;

// Injection des media queries
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}