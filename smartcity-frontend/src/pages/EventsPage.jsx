import { useEffect, useState } from "react";
import axios from "axios";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [infras, setInfras] = useState([]);
  const [form, setForm] = useState({ id: "", type: "accident", infrastructure_id: "" });

  useEffect(() => {
    fetchEvents();
    fetchInfras();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("http://127.0.0.1:8000/events/");
    setEvents(res.data);
  };

  const fetchInfras = async () => {
    const res = await axios.get("http://127.0.0.1:8000/get_infrastructures/");
    setInfras(res.data);
  };

  const addEvent = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/add_event/", form);
    setForm({ id: "", type: "accident", infrastructure_id: "" });
    fetchEvents();
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const eventTypes = [
    { value: "accident", label: "Accident" },
    { value: "embouteillage", label: "Embouteillage" },
    { value: "radar", label: "Radar" }
  ];

  const headers = ["ID", "Type", "Infrastructure"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>🚨 Gérer les événements</h1>
          <p style={styles.subtitle}>Ajoutez et surveillez les événements du réseau</p>
        </div>

        {/* Formulaire */}
        <div style={styles.formCard}>
          <form onSubmit={addEvent}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID de l'événement</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID de l'événement"
                  value={form.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
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
                <label style={styles.label}>Type d'événement</label>
                <select
                  value={form.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  style={styles.select}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Infrastructure</label>
                <select
                  value={form.infrastructure_id}
                  onChange={(e) => handleInputChange("infrastructure_id", e.target.value)}
                  style={styles.select}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Choisir une infrastructure</option>
                  {infras.map((infra) => (
                    <option key={infra.id} value={infra.id}>
                      {infra.nom} ({infra.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#6b4cdcff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#473bafff'}
            >
              ➕ Ajouter un événement
            </button>
          </form>
        </div>

        {/* Tableau */}
        <div style={styles.tableSection}>
          <h3 style={styles.tableTitle}>Liste des événements</h3>
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
                  {events.map((event) => (
                    <tr 
                      key={event.event} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>{event.event}</td>
                      <td style={styles.tableCell}>
                        <span style={getEventTypeStyle(event.type)}>
                          {event.type}
                        </span>
                      </td>
                      <td style={styles.tableCell}>{event.nom_infra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {events.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucun événement enregistré</div>
                <div style={styles.emptySubtext}>Ajoutez un événement pour commencer</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getEventTypeStyle = (type) => {
  const baseStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  };

  switch (type) {
    case 'accident':
      return {
        ...baseStyle,
        backgroundColor: '#fef2f2',
        color: '#2c26dcff'
      };
    case 'embouteillage':
      return {
        ...baseStyle,
        backgroundColor: '#fffbeb',
        color: '#d97706'
      };
    case 'radar':
      return {
        ...baseStyle,
        backgroundColor: '#eff6ff',
        color: '#2563eb'
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
    backgroundColor: '#3b78dbff',
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