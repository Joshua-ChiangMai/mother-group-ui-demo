import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataPanel } from '../components/DataPanel';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { formatWhen } from '../lib/format';
import { Application } from '../lib/types';

export function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = Number(params.applicationId);
  const [application, setApplication] = useState<Application | null>(null);
  const [status, setStatus] = useState('pending');
  const [interviewDate, setInterviewDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getApplication(applicationId)
      .then((data) => {
        setApplication(data);
        setStatus(data.status);
        setInterviewDate(data.interviewScheduledAt ? data.interviewScheduledAt.slice(0, 16) : '');
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const canCreateMembership = useMemo(() => {
    return application?.status === 'accepted';
  }, [application]);

  async function updateStatus(event: FormEvent) {
    event.preventDefault();
    if (!application) {
      return;
    }

    try {
      const updated = await api.updateApplication(application.id, {
        status,
        interviewScheduledAt: interviewDate ? new Date(interviewDate).toISOString() : null,
      });
      setApplication(updated);
      setMessage('Application updated successfully.');
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  async function createMembership() {
    if (!application) {
      return;
    }

    try {
      await api.createMembership({
        motherId: application.motherId,
        groupId: application.groupId,
        name: `${application.group?.name || 'Group'} Membership`,
        status: 'active',
        description: 'Created from the Beta application review screen.',
      });
      setMessage('Membership created. Open the Memberships page to confirm the roster.');
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  if (loading) {
    return <DataPanel title="Application detail"><p>Loading application from Alpha...</p></DataPanel>;
  }

  if (error || !application) {
    return (
      <DataPanel title="Application detail">
        <p className="error-text">{error || 'Application not found.'}</p>
      </DataPanel>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Leader UI</p>
        <h2>{application.name}</h2>
        <p>This review page turns Alpha GET and PATCH application endpoints into a role-specific workflow surface.</p>
      </section>

      <div className="detail-grid">
        <DataPanel title="Application summary" subtitle="Linked data pulled directly from Alpha relations.">
          <dl className="info-grid">
            <div>
              <dt>Applicant</dt>
              <dd>{application.mother?.name || `Mother #${application.motherId}`}</dd>
            </div>
            <div>
              <dt>Group</dt>
              <dd>{application.group?.name || `Group #${application.groupId}`}</dd>
            </div>
            <div>
              <dt>Reviewer</dt>
              <dd>{application.reviewer?.name || `Mother #${application.reviewerMotherId}`}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd><StatusBadge value={application.status} /></dd>
            </div>
            <div>
              <dt>Interview</dt>
              <dd>{formatWhen(application.interviewScheduledAt)}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{application.availabilityNotes || 'No availability notes'}</dd>
            </div>
          </dl>
          <Link className="button button--ghost" to="/applications">
            Back to applications
          </Link>
        </DataPanel>

        <DataPanel title="Leader review actions" subtitle="Beta's first role-specific action form backed by Alpha PATCH /applications/:id.">
          <form className="stack-form" onSubmit={updateStatus}>
            <label>
              Status
              <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="pending">Pending</option>
                <option value="interview_scheduled">Interview scheduled</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <label>
              Interview date and time
              <input
                className="input"
                type="datetime-local"
                value={interviewDate}
                onChange={(event) => setInterviewDate(event.target.value)}
              />
            </label>

            <button className="button" type="submit">
              Save Review Update
            </button>
          </form>

          <div className="button-row">
            <button className="button button--ghost" type="button" disabled={!canCreateMembership} onClick={createMembership}>
              Create Membership From Accepted Application
            </button>
          </div>

          {message ? <p className="success-text">{message}</p> : null}
        </DataPanel>
      </div>
    </div>
  );
}
