import { useEffect, useMemo, useState } from 'react';
import { DataPanel } from '../components/DataPanel';
import { EmptyState } from '../components/EmptyState';
import { GroupCard } from '../components/GroupCard';
import { api } from '../lib/api';
import { Group } from '../lib/types';

export function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listGroups()
      .then((data) => {
        setGroups(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return groups.filter((group) => {
      const matchesQuery =
        group.name.toLowerCase().includes(query.toLowerCase()) ||
        (group.description || '').toLowerCase().includes(query.toLowerCase());
      const matchesRegion = region === 'all' || group.locationRegion === region;
      return matchesQuery && matchesRegion;
    });
  }, [groups, query, region]);

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Mother UI</p>
        <h2>Groups Discovery</h2>
        <p>
          This page mirrors the Alpha `GET /groups` contract and turns it into a mother-facing discovery surface with
          search and region filters.
        </p>
      </section>

      <DataPanel
        title="Filter groups"
        subtitle="A lightweight Beta discovery experience driven directly from the Alpha API."
      >
        <div className="toolbar">
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search group name or description"
          />
          <select className="select" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="all">All regions</option>
            <option value="N">North</option>
            <option value="S">South</option>
            <option value="E">East</option>
            <option value="W">West</option>
          </select>
        </div>
      </DataPanel>

      {loading ? <DataPanel title="Groups"><p>Loading groups from the API...</p></DataPanel> : null}
      {error ? <DataPanel title="Groups"><p className="error-text">{error}</p></DataPanel> : null}

      {!loading && !error ? (
        filtered.length ? (
          <section className="card-grid">
            {filtered.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </section>
        ) : (
          <EmptyState
            title="No groups match the current filters"
            body="Try a broader search or switch the region filter back to All."
          />
        )
      ) : null}
    </div>
  );
}
