import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataPanel } from '../components/DataPanel';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { formatWhen } from '../lib/format';
import { Application } from '../lib/types';

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listApplications()
      .then((data) => {
        setApplications(data);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus = status === 'all' || application.status === status;
      const haystack = [application.name, application.mother?.name, application.group?.name].join(' ').toLowerCase();
      return matchesStatus && haystack.includes(query.toLowerCase());
    });
  }, [applications, query, status]);

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Leader UI</p>
        <h2>Applications Dashboard</h2>
        <p>This screen turns Alpha GET /applications into a status-driven leader review board.</p>
      </section>

      <DataPanel title="Filters" subtitle="Use search and status chips to review the prototype workflow.">
        <div className="toolbar">
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search applicant or group"
          />
          <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="interview_scheduled">Interview scheduled</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </DataPanel>

      {loading ? <DataPanel title="Applications"><p>Loading applications from Alpha...</p></DataPanel> : null}
      {error ? <DataPanel title="Applications"><p className="error-text">{error}</p></DataPanel> : null}

      {!loading && !error ? (
        filtered.length ? (
          <DataPanel title="Application queue" subtitle="Each row links to a detail page with review actions.">
            <div className="table">
              <div className="table__row table__row--head">
                <span>Applicant</span>
                <span>Group</span>
                <span>Status</span>
                <span>Interview</span>
                <span>Action</span>
              </div>
              {filtered.map((application) => (
                <div key={application.id} className="table__row">
                  <span>{application.mother?.name || `Mother #${application.motherId}`}</span>
                  <span>{application.group?.name || `Group #${application.groupId}`}</span>
                  <span><StatusBadge value={application.status} /></span>
                  <span>{formatWhen(application.interviewScheduledAt)}</span>
                  <span>
                    <Link className="table-link" to={`/applications/${application.id}`}>
                      Review
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          </DataPanel>
        ) : (
          <EmptyState
            title="No applications match the current filters"
            body="Try a different status filter or create a new application from the Group Detail page."
          />
        )
      ) : null}
    </div>
  );
}
