import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataPanel } from '../components/DataPanel';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../lib/api';
import { formatWhen } from '../lib/format';
import { Group, Mother } from '../lib/types';

export function GroupDetailPage() {
  const params = useParams();
  const groupId = Number(params.groupId);
  const [group, setGroup] = useState<Group | null>(null);
  const [mothers, setMothers] = useState<Mother[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMotherId, setSelectedMotherId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    Promise.all([api.getGroup(groupId), api.listMothers()])
      .then(([groupResponse, mothersResponse]) => {
        setGroup(groupResponse);
        setMothers(mothersResponse);
        setSelectedMotherId(mothersResponse[0]?.id ? String(mothersResponse[0].id) : '');
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [groupId]);

  async function submitApplication(event: FormEvent) {
    event.preventDefault();
    if (!group || !selectedMotherId) {
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    try {
      await api.createApplication({
        motherId: Number(selectedMotherId),
        groupId: group.id,
        reviewerMotherId: group.leaderMotherId,
        name: `Application for ${group.name}`,
        status: 'pending',
        availabilityNotes: notes,
        description: 'Submitted from the Beta UI prototype.',
      });
      setFormMessage('Application created. Open the Applications dashboard to review it.');
      setNotes('');
    } catch (err) {
      setFormMessage((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <DataPanel title="Group detail"><p>Loading group detail from Alpha...</p></DataPanel>;
  }

  if (error || !group) {
    return (
      <DataPanel title="Group detail">
        <p className="error-text">{error || 'Group not found.'}</p>
      </DataPanel>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <p className="eyebrow">Mother UI</p>
        <h2>{group.name}</h2>
        <p>{group.description || 'No description yet.'}</p>
      </section>

      <div className="detail-grid">
        <DataPanel title="Group summary" subtitle="Directly mapped from Alpha GET /groups/:id">
          <dl className="info-grid">
            <div>
              <dt>Region</dt>
              <dd>{group.locationRegion}</dd>
            </div>
            <div>
              <dt>Capacity</dt>
              <dd>{group.capacity}</dd>
            </div>
            <div>
              <dt>Leader</dt>
              <dd>{group.leader?.name || `Mother #${group.leaderMotherId}`}</dd>
            </div>
            <div>
              <dt>Current applications</dt>
              <dd>{group.applications?.length ?? 0}</dd>
            </div>
          </dl>
          <Link className="button button--ghost" to="/applications">
            Review applications
          </Link>
        </DataPanel>

        <DataPanel title="Apply to this group" subtitle="This uses Alpha POST /applications as the first Beta mother-facing form.">
          <form className="stack-form" onSubmit={submitApplication}>
            <label>
              Applicant mother
              <select
                className="select"
                value={selectedMotherId}
                onChange={(event) => setSelectedMotherId(event.target.value)}
              >
                {mothers.map((mother) => (
                  <option key={mother.id} value={mother.id}>
                    {mother.name} ({mother.email})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Availability notes
              <textarea
                className="textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Share preferred meeting details or interview notes"
              />
            </label>

            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
          {formMessage ? <p className="success-text">{formMessage}</p> : null}
        </DataPanel>
      </div>

      <DataPanel title="Meeting schedule" subtitle="Alpha meetings are surfaced here as a reusable Beta detail block.">
        {group.meetings?.length ? (
          <div className="list-stack">
            {group.meetings.map((meeting) => (
              <article key={meeting.id} className="list-item">
                <div>
                  <h3>{meeting.name}</h3>
                  <p>
                    {meeting.meetingDay} · {meeting.startTime} - {meeting.endTime}
                  </p>
                  <p>{meeting.locationText || 'Location not specified'}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No meetings yet" body="The Alpha group currently has no meeting rows." />
        )}
      </DataPanel>

      <DataPanel title="Existing applications" subtitle="Useful for showing the linked data already coming from Alpha.">
        {group.applications?.length ? (
          <div className="list-stack">
            {group.applications.map((application) => (
              <article key={application.id} className="list-item">
                <div>
                  <h3>{application.name}</h3>
                  <p>{application.mother?.name || `Mother #${application.motherId}`}</p>
                  <p>{formatWhen(application.interviewScheduledAt)}</p>
                </div>
                <StatusBadge value={application.status} />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No applications yet" body="Submit an application from the form above to populate this section." />
        )}
      </DataPanel>
    </div>
  );
}
