// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/stats/");
        setStats(res.data.stats);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
        setError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIconForClass = (className) => {
    const icons = {
      'Utilisateur': '👤',
      'RéseauTransport': '🚆',
      'Evenement': '📅',
      'Infrastructure': '🏗️',
      'Avis': '💬',
      'StationRecharge': '⚡',
      'Ticket': '🎫',
      'SmartCity': '🏙️',
      'Trajet': '🛣️',
      'Statistique': '📊'
    };
    
    const defaultIcon = '📈';
    return icons[className] || defaultIcon;
  };

  const getColorForClass = (className) => {
    const colors = {
      'Utilisateur': '#3b82f6',
      'RéseauTransport': '#ef4444',
      'Evenement': '#f59e0b',
      'Infrastructure': '#10b981',
      'Avis': '#8b5cf6',
      'StationRecharge': '#06b6d4',
      'Ticket': '#f97316',
      'SmartCity': '#ec4899',
      'Trajet': '#84cc16',
      'Statistique': '#6366f1'
    };
    
    return colors[className] || '#6b7280';
  };

  const formatClassName = (className) => {
    return className
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Erreur de chargement</h2>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* En-tête */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Tableau de Bord SmartCity</h1>
        <p style={styles.subtitle}>
          Vue d'ensemble des données et statistiques de la plateforme
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div 
            key={stat.class} 
            style={{
              ...styles.statCard,
              borderLeft: `4px solid ${getColorForClass(stat.class)}`
            }}
          >
            <div style={styles.statHeader}>
              <div style={styles.statIcon}>
                {getIconForClass(stat.class)}
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statName}>
                  {formatClassName(stat.class)}
                </h3>
                <p style={styles.statCount}>
                  {stat.count.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={styles.statFooter}>
              <div 
                style={{
                  ...styles.statBar,
                  backgroundColor: getColorForClass(stat.class)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Résumé global */}
      {stats.length > 0 && (
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>📈 Résumé Global</h3>
          <div style={styles.summaryContent}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total des entités:</span>
              <span style={styles.summaryValue}>
                {stats.reduce((total, stat) => total + stat.count, 0).toLocaleString()}
              </span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Catégories:</span>
              <span style={styles.summaryValue}>{stats.length}</span>
            </div>
          </div>
        </div>
      )}

      {stats.length === 0 && !loading && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h3 style={styles.emptyTitle}>Aucune donnée disponible</h3>
          <p style={styles.emptyText}>
            Les statistiques seront affichées ici une fois les données disponibles.
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #e5e7eb'
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  statIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem'
  },
  statInfo: {
    flex: 1
  },
  statName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.25rem 0'
  },
  statCount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  statFooter: {
    marginTop: '1rem'
  },
  statBar: {
    height: '4px',
    borderRadius: '2px',
    width: '100%'
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    maxWidth: '400px',
    margin: '0 auto'
  },
  summaryTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6'
  },
  summaryLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  summaryValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '1rem'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '3rem'
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#dc2626',
    margin: 0
  },
  errorText: {
    color: '#6b7280',
    fontSize: '1rem',
    margin: 0
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '4rem',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#6b7280',
    margin: 0
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: '1rem',
    maxWidth: '400px',
    margin: 0
  }
};

// Media queries et animations
const mediaQueries = `
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .stat-card {
      padding: 1rem;
    }
    .stat-count {
      font-size: 1.5rem;
    }
    .title {
      font-size: 1.5rem;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .retry-button:hover {
    background-color: #2563eb;
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mediaQueries;
  document.head.appendChild(styleSheet);
}