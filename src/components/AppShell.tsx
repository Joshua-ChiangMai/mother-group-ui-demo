import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { apiConfig } from '../lib/config';

interface AppShellProps {
  children: ReactNode;
}

const links = [
  { to: '/', label: 'Overview' },
  { to: '/groups', label: 'Groups' },
  { to: '/applications', label: 'Applications' },
  { to: '/memberships', label: 'Memberships' },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <p className="eyebrow">Project Beta</p>
          <h1>Alpha-to-UI Handoff</h1>
          <p className="sidebar__intro">
            A frontend prototype that mirrors the Project Alpha NestJS backend and turns it into role-oriented UI.
          </p>
        </div>

        <nav className="sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__meta">
          <a href={apiConfig.docsUrl} target="_blank" rel="noreferrer">
            API Swagger
          </a>
          <a href={apiConfig.dashboardUrl} target="_blank" rel="noreferrer">
            API Dashboard
          </a>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
