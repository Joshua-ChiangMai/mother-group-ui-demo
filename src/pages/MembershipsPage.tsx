import { useEffect, useMemo, useState } from 'react';
import { DataPanel } from '../components/DataPanel';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { GroupMembership } from '../lib/types';

export function MembershipsPage() {
  const [memberships, setMemberships] = useState<GroupMembership[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listMemberships()
      .then((data) => {
        setMemberships(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return memberships.filter((membership) => {
      const haystack = [membership.name, membership.group?.name, membership.mother?.name].join(' ').toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [memberships, query]);

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Leader + Admin UI</p>
        <h2>Memberships Roster</h2>
        <p>This page turns Alpha memberships into a simple roster experience for leaders and admins.</p>
      </section>

      <DataPanel title="Search roster" subtitle="Useful after accepting an application and creating a membership.">
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by membership, mother, or group name"
        />
      </DataPanel>

      {loading ? <DataPanel title="Roster"><p>Loading memberships from Alpha...</p></DataPanel> : null}
      {error ? <DataPanel title="Roster"><p className="error-text">{error}</p></DataPanel> : null}

      {!loading && !error ? (
        filtered.length ? (
          <section className="card-grid">
            {filtered.map((membership) => (
              <article key={membership.id} className="feature-card">
                <div className="feature-card__topline">
                  <StatusBadge value={membership.status} />
                </div>
                <h3>{membership.group?.name || `Group #${membership.groupId}`}</h3>
                <p>{membership.mother?.name || `Mother #${membership.motherId}`}</p>
                <p>{membership.description || 'No extra membership notes.'}</p>
              </article>
            ))}
          </section>
        ) : (
          <EmptyState
            title="No memberships found"
            body="Accept an application and create a membership from the application detail page."
          />
        )
      ) : null}
    </div>
  );
}
