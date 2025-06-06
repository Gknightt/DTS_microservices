import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AgentDashboard from '../pages/agent/dashboard-page/AgentDashboard';
import Ticket from '../pages/agent/ticket-page/Ticket';
import Track from '../pages/agent/track-page/Track';
import AgentArchive from '../pages/agent/archive-page/AgentArchive';
import AgentLogin from '../pages/auth/agent/AgentLogin';
import AgentProfile from '../pages/agent/profile-page/AgentProfile';
import TicketDetail from '../pages/agent/ticket-details-page/TicketDetail';
import Profile from '../pages/auth/profile/Profile';

import AdminDashboard from '../pages/admin/dashboard-page/AdminDashboard';
import Workflow from '../pages/admin/workflow-page/Workflow';
import Agent from '../pages/admin/agent-page/Agent';
import AdminArchive from '../pages/admin/archive-page/AdminArchive';
import AgentInvite from '../pages/admin/agent-page/AgentInvite';
import WorkflowEditor from '../pages/admin/workflow-page/WorkflowCreator';

import ProtectedRoute from './ProtectedRoute'; // 👈 import this
import Unauthorized from '../pages/error/Unauthorized';

function MainRoutes() {
  return (
    <Routes>
      {/* Public/Login */}
      <Route path="/" element={<AgentLogin />} />

      {/* Agent Protected Routes */}
      <Route element={<ProtectedRoute requiredRole="agent" />}>
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/agent/ticket" element={<Ticket />} />
        <Route path="/agent/track" element={<Track />} />
        <Route path="/agent/archive" element={<AgentArchive />} />
        <Route path="/agent/ticket/:id" element={<TicketDetail />} />
        <Route path="/agent/profile" element={<AgentProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/agent/invite" element={<AgentInvite />} />
        <Route path="/admin/agent" element={<Agent />} />
        <Route path="/admin/workflow" element={<Workflow />} />
        <Route path="/admin/workflow/create" element={<WorkflowEditor />} />
        <Route path="/admin/archive" element={<AdminArchive />} />
      </Route>

      {/* Optional Unauthorized Page */}
      <Route path="/unauthorized" element={<Unauthorized/>} />
    </Routes>
  );
}

export default MainRoutes;
