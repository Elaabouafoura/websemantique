import { useEffect, useState } from "react";
import axios from "axios";

export default function InfrastructuresPage() {
  const [infras, setInfras] = useState([]);
  const [form, setForm] = useState({ id: "", nom: "", type: "route" });
  const [message, setMessage] = useState(null);

  // --- Charger les infrastructures ---
  useEffect(() => {
    fetchInfras();
  }, []);

  const fetchInfras = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/get_infrastructures/");
      setInfras(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      setMessage("❌ Impossible de charger les infrastructures.");
    }
  };

  // --- Ajouter une infrastructure ---
  const addInfra = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/add_infrastructure/", {
        id: form.id.trim(),
        nom: form.nom.trim(),
        type: form.type.trim(),
      });

      setMessage(res.data.message || "✅ Infrastructure ajoutée avec succès !");
      setForm({ id: "", nom: "", type: "Route" });
      fetchInfras();
    } catch (err) {
      console.error("Erreur d'ajout :", err);
      setMessage(
        err.response?.data?.detail ||
          "❌ Erreur lors de l'ajout. Vérifie le backend FastAPI."
      );
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const infrastructureTypes = [
    { value: "route", label: "Route" },
    { value: "stationsMetro", label: "Station metro" },
    { value: "parking", label: "Parking" },
    { value: "stationsBus", label: "Station Bus" }
  ];

  const headers = ["ID", "Nom", "Type"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏗️ Gérer les infrastructures</h1>
          <p style={styles.subtitle}>Ajoutez et gérez les infrastructures de transport</p>
        </div>

        {/* Message d'état */}
        {message && (
          <div 
            style={{
              ...styles.message,
              ...(message.startsWith("✅") ? styles.successMessage : styles.errorMessage)
            }}
          >
            {message}
          </div>
        )}

        {/* Formulaire */}
        <div style={styles.formCard}>
          <form onSubmit={addInfra}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID de l'infrastructure</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de l'infrastructure"
                  value={form.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
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
                <label style={styles.label}>Nom de l'infrastructure</label>
                <input
                  type="text"
                  placeholder="Entrez le nom de l'infrastructure"
                  value={form.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
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
                <label style={styles.label}>Type d'infrastructure</label>
                <select
                  value={form.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  style={styles.select}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {infrastructureTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3a1a7dff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1f59beff'}
            >
              ➕ Ajouter une infrastructure
            </button>
          </form>
        </div>

        {/* Tableau */}
        <div style={styles.tableSection}>
          <h3 style={styles.tableTitle}>Liste des infrastructures</h3>
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
                  {infras.map((infra) => (
                    <tr 
                      key={infra.id} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>{infra.id}</td>
                      <td style={styles.tableCell}>{infra.nom}</td>
                      <td style={styles.tableCell}>
                        <span style={getInfrastructureTypeStyle(infra.type)}>
                          {infra.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {infras.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucune infrastructure enregistrée</div>
                <div style={styles.emptySubtext}>Ajoutez une infrastructure pour commencer</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getInfrastructureTypeStyle = (type) => {
  const baseStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  };

  switch (type) {
    case 'route':
      return {
        ...baseStyle,
        backgroundColor: '#f0fdf4',
        color: '#059669'
      };
    case 'stationsMetro':
      return {
        ...baseStyle,
        backgroundColor: '#eff6ff',
        color: '#2563eb'
      };
    case 'parking':
      return {
        ...baseStyle,
        backgroundColor: '#fefce8',
        color: '#d97706'
      };
    case 'stationsBus':
      return {
        ...baseStyle,
        backgroundColor: '#faf5ff',
        color: '#7c3aed'
      };
    default:
      return baseStyle;
  }
};

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
  formCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    marginBottom: '2rem'
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
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  button: {
    backgroundColor: '#353dacff',
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
    .button {
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