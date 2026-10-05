// frontend/src/pages/DesignSystemPage.jsx
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { useToast } from '../context/ToastContext';
import { LayoutDashboard } from 'lucide-react';

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { addToast } = useToast();

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Design System</h1>
        <p className="text-foreground-muted">All reusable UI components for Phase 4.</p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b border-border-muted pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Badges & Avatars */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b border-border-muted pb-2">Badges & Avatars</h2>
        <div className="flex items-center gap-4">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Avatar fallback="AB" size="sm" />
          <Avatar fallback="CD" size="md" />
          <Avatar fallback="EF" size="lg" />
        </div>
      </section>

      {/* Forms */}
      <section className="space-y-4 max-w-lg">
        <h2 className="text-lg font-semibold text-foreground border-b border-border-muted pb-2">Forms</h2>
        <div className="space-y-4">
          <Input placeholder="Standard input..." />
          <Input placeholder="Error input..." error="This field is required" />
          <Select>
            <option>Option 1</option>
            <option>Option 2</option>
          </Select>
          <Textarea placeholder="Type your message here..." />
        </div>
      </section>

      {/* Overlays / Toasts */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b border-border-muted pb-2">Overlays & Toasts</h2>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Open Confirm</Button>
        </div>
        <div className="flex gap-4 mt-4">
          <Button variant="secondary" onClick={() => addToast('Operation successful!', 'success')}>Toast Success</Button>
          <Button variant="secondary" onClick={() => addToast('Something went wrong!', 'error')}>Toast Error</Button>
          <Button variant="secondary" onClick={() => addToast('Here is some info.', 'info')}>Toast Info</Button>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
          <p className="text-foreground">This is the content of the modal. It has a backdrop blur and trap focus.</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>

        <ConfirmDialog 
          isOpen={confirmOpen} 
          onClose={() => setConfirmOpen(false)} 
          onConfirm={() => { addToast('Deleted!', 'success'); setConfirmOpen(false); }}
          title="Delete Project?"
          message="Are you sure you want to delete this project? This action cannot be undone."
          destructive
          confirmText="Delete"
        />
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b border-border-muted pb-2">Cards & States</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><h3 className="font-semibold text-foreground">Project Details</h3></CardHeader>
            <CardBody><p className="text-foreground-muted text-sm">A clean structured card with header, body, and footer.</p></CardBody>
            <CardFooter className="flex justify-end"><Button size="sm">Save</Button></CardFooter>
          </Card>
          
          <div className="space-y-4">
            <EmptyState icon={LayoutDashboard} title="No projects found" description="Get started by creating your first research project." />
            <ErrorState message="Failed to load projects from the database." onRetry={() => {}} />
          </div>
        </div>
      </section>

      {/* Tables & Pagination */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b border-border-muted pb-2">Tables & Pagination</h2>
        <Table>
          <Thead>
            <Tr><Th>Name</Th><Th>Role</Th><Th>Status</Th></Tr>
          </Thead>
          <Tbody>
            <Tr><Td>Alice Chen</Td><Td>Student</Td><Td><Badge variant="success">Active</Badge></Td></Tr>
            <Tr><Td>Bob Kumar</Td><Td>Student</Td><Td><Badge variant="neutral">Offline</Badge></Td></Tr>
          </Tbody>
        </Table>
        <Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />
        <Skeleton className="h-10 w-full mt-4" />
      </section>

    </div>
  );
}
