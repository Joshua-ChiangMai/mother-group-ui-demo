import { Link } from 'react-router-dom';
import { DataPanel } from '../components/DataPanel';

const cards = [
  {
    title: 'Mother flow',
    body: 'Discover groups, open one group detail page, and submit an application against the Alpha API.',
    to: '/groups',
  },
  {
    title: 'Leader review',
    body: 'Use the applications dashboard and detail view to inspect records and patch status changes.',
    to: '/applications',
  },
  {
    title: 'Roster view',
    body: 'Confirm accepted applicants become active members in the roster screen.',
    to: '/memberships',
  },
];

export function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero hero--beta">
        <p className="eyebrow">Project Beta MVP</p>
        <h2>UI scaffolding generated to continue from the Alpha NestJS backend</h2>
        <p>
          This prototype demonstrates the most natural Alpha-to-Beta continuation: using the existing API contract to
          drive frontend views, forms, and role-specific workflows.
        </p>
      </section>

      <div className="stats-grid">
        <div className="metric-card">
          <span>Source contract</span>
          <strong>Alpha Swagger</strong>
          <p>Existing NestJS CRUD endpoints remain the backing API.</p>
        </div>
        <div className="metric-card">
          <span>Primary roles</span>
          <strong>Mother + Leader</strong>
          <p>The first pass focuses on discovery, applications, review, and roster management.</p>
        </div>
        <div className="metric-card">
          <span>Current bridge</span>
          <strong>Mothers as Users</strong>
          <p>The UI is Alpha-compatible now, with a clear path toward the broader Users and Locations model.</p>
        </div>
      </div>

      <DataPanel
        title="Recommended walkthrough"
        subtitle="Follow this order to demonstrate the handoff from backend APIs into UI scaffolding."
      >
        <ol className="sequence-list">
          <li>Open Groups and filter the discovery list.</li>
          <li>Open one group detail page and submit an application.</li>
          <li>Switch to Applications and patch the review status.</li>
          <li>Create a membership from an accepted application.</li>
          <li>Verify the roster from the Memberships page.</li>
        </ol>
      </DataPanel>

      <section className="card-grid">
        {cards.map((card) => (
          <article key={card.title} className="feature-card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <Link className="button button--ghost" to={card.to}>
              Open
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
