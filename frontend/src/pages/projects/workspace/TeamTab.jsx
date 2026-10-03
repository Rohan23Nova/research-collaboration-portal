// frontend/src/pages/projects/workspace/TeamTab.jsx
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

export default function TeamTab({ project }) {
  return (
    <div className="space-y-4">
      {project.members?.map(member => (
        <Card key={member.user_id}>
          <CardBody className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {member.profile_image ? (
                <img src={`/api/users/${member.user_id}/image`} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <Avatar fallback={member.name} size="lg" />
              )}
              <div>
                <Link to={`/profile/${member.user_id}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">
                  {member.name}
                </Link>
                <p className="text-sm text-slate-500">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Badge variant={member.role === 'Leader' ? 'primary' : 'neutral'}>{member.role}</Badge>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
