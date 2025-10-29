import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Transports from "./pages/Transports";
import AIQuery from "./pages/AIQuery";
import EventsPage from "./pages/EventsPage";
import InfrastructuresPage from "./pages/InfrastructuresPage";
import AvisPage from "./pages/AvisPage";
import RechargePage from "./pages/RechargePage";
import TicketsPage from "./pages/TicketsPage";
import SmartCitiesPage from "./pages/SmartCitiesPage";
import TrajetsPage from "./pages/TrajetsPage";
import Statistiques from "./pages/StatistiquesPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="transports" element={<Transports />} />
          <Route path="infrastructures" element={<InfrastructuresPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="avis" element={<AvisPage />} />
          <Route path="recharge" element={<RechargePage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="smartcitiespage" element={<SmartCitiesPage />} />
          <Route path="trajetspage" element={<TrajetsPage />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="ai" element={<AIQuery />} />
        </Route>
      </Routes>
    </Router>
  );
}
