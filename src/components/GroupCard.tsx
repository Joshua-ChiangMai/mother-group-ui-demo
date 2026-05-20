import { Link } from 'react-router-dom';
import { Group } from '../lib/types';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <article className="group-card">
      <div className="group-card__topline">
        <span className="chip">{group.locationRegion}</span>
        <span className="soft-label">Capacity {group.capacity}</span>
      </div>
      <h3>{group.name}</h3>
      <p>{group.description || 'No description yet.'}</p>
      <dl className="group-card__meta">
        <div>
          <dt>Leader</dt>
          <dd>{group.leader?.name || `Mother #${group.leaderMotherId}`}</dd>
        </div>
        <div>
          <dt>Meetings</dt>
          <dd>{group.meetings?.length ?? 0}</dd>
        </div>
      </dl>
      <Link className="button button--ghost" to={`/groups/${group.id}`}>
        Open Group
      </Link>
    </article>
  );
}
