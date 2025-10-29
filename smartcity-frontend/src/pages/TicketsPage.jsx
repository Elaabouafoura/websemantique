import { useEffect, useState } from "react";
import axios from "axios";

export default function TicketsPage() {
  const [voyageurId, setVoyageurId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [ticketsVoyageur, setTicketsVoyageur] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  // ------------------- Ajouter un ticket -------------------
  const addTicket = async (e) => {
    e.preventDefault();
    if (!voyageurId || !ticketId) return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/add_ticket_voyageur/", {
        voyageur_id: voyageurId,
        ticket_id: ticketId
      });
      alert(res.data.message);
      setTicketId("");
      fetchTicketsByVoyageur(voyageurId);
      fetchAllTickets();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // ------------------- Récupérer tickets d'un voyageur -------------------
  const fetchTicketsByVoyageur = async (vid) => {
    if (!vid) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/tickets/${vid}`);
      setTicketsVoyageur(res.data.tickets || []);
    } catch (err) {
      setTicketsVoyageur([]);
    }
  };

  // ------------------- Récupérer tous les tickets -------------------
  const fetchAllTickets = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/tickets/");
      setAllTickets(res.data.tickets || []);
    } catch (err) {
      setAllTickets([]);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleVoyageurIdChange = (value) => {
    setVoyageurId(value);
  };

  const handleTicketIdChange = (value) => {
    setTicketId(value);
  };

  const handleSearchTickets = () => {
    fetchTicketsByVoyageur(voyageurId);
  };

  const headers = ["Ticket", "Voyageur"];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎟️ Gestion des Tickets</h1>
          <p style={styles.subtitle}>Attribuez et consultez les tickets des voyageurs</p>
        </div>

        {/* Formulaire ajout ticket */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Ajouter un ticket à un voyageur</h3>
          <form onSubmit={addTicket}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Voyageur</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID du voyageur"
                  value={voyageurId}
                  onChange={(e) => handleVoyageurIdChange(e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Ticket</label>
                <input
                  type="text"
                  placeholder="Entrez l'ID du ticket"
                  value={ticketId}
                  onChange={(e) => handleTicketIdChange(e.target.value)}
                  style={styles.input}
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
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
              onMouseOver={(e) => e.target.style.backgroundColor = '#303595ff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3a2cabff'}
            >
              🎟️ Attribuer le ticket
            </button>
          </form>
        </div>

        {/* Tickets par voyageur */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>🔍 Voir les tickets d'un voyageur</h3>
          <div style={styles.searchSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Voyageur</label>
              <input
                type="text"
                placeholder="Entrez l'ID du voyageur"
                value={voyageurId}
                onChange={(e) => handleVoyageurIdChange(e.target.value)}
                style={styles.input}
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
            <button
              onClick={handleSearchTickets}
              style={styles.secondaryButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              🔍 Rechercher les tickets
            </button>
          </div>
          
          {ticketsVoyageur.length > 0 ? (
            <div style={styles.ticketsList}>
              <h4 style={styles.listTitle}>Tickets du voyageur {voyageurId}</h4>
              <div style={styles.ticketsGrid}>
                {ticketsVoyageur.map((ticket, index) => (
                  <div 
                    key={index} 
                    style={styles.ticketItem}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fefce8'}
                  >
                    <div style={styles.ticketIcon}>🎫</div>
                    <div style={styles.ticketId}>{ticket}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyText}>Aucun ticket trouvé pour ce voyageur</div>
              <div style={styles.emptySubtext}>
                {voyageurId ? `Le voyageur "${voyageurId}" n'a pas de tickets` : 'Entrez un ID voyageur pour rechercher'}
              </div>
            </div>
          )}
        </div>

        {/* Tous les tickets */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Tous les tickets</h3>
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
                  {allTickets.map((ticket, idx) => (
                    <tr 
                      key={idx} 
                      style={styles.tableRow}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={styles.tableCell}>
                        <span style={styles.ticketBadge}>
                          {ticket.ticket}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        {ticket.voyageur ? (
                          <span style={styles.voyageurBadge}>
                            {ticket.voyageur}
                          </span>
                        ) : (
                          <span style={styles.noVoyageur}>N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {allTickets.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyText}>Aucun ticket enregistré</div>
                <div style={styles.emptySubtext}>Attribuez des tickets aux voyageurs pour commencer</div>
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
    marginBottom: '1.5rem'
  },
  searchSection: {
    marginBottom: '1.5rem'
  },
  inputGroup: {
    width: '100%',
    marginBottom: '1rem'
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
    backgroundColor: '#2a2296ff',
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
  ticketsList: {
    marginTop: '1rem'
  },
  listTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem'
  },
  ticketsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem'
  },
  ticketItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    border: '1px solid #fef3c7',
    borderRadius: '0.5rem',
    transition: 'background-color 0.15s',
    backgroundColor: '#fefce8'
  },
  ticketIcon: {
    fontSize: '1.25rem'
  },
  ticketId: {
    fontWeight: '500',
    color: '#92400e'
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
  ticketBadge: {
    backgroundColor: '#fffbeb',
    color: '#92400e',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  voyageurBadge: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  noVoyageur: {
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem'
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
    .search-section {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }
    .search-section .input-group {
      margin-bottom: 0;
      flex: 1;
    }
    .search-section .secondary-button {
      width: auto;
      white-space: nowrap;
    }
  }
`;

// Injection des media queries
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}