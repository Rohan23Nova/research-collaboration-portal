// frontend/src/pages/projects/workspace/OverviewTab.jsx
import { Card, CardBody, CardHeader } from '../../../components/ui/Card';

export default function OverviewTab({ project }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Project Description</h2>
        </CardHeader>
        <CardBody>
          <div className="prose prose-slate dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
            {project.description || 'No detailed description provided.'}
          </div>
        </CardBody>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm font-medium text-foreground-muted">Research Domain</p>
            <p className="mt-1 text-lg text-foreground">{project.research_domain}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm font-medium text-foreground-muted">Deadline</p>
            <p className="mt-1 text-lg text-foreground">
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None set'}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
