// frontend/src/pages/projects/workspace/DocumentsTab.jsx
import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Button from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Download, Trash2, UploadCloud, File as FileIcon } from 'lucide-react';

export default function DocumentsTab({ projectId, isLeader }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/workspace/documents`);
      setDocuments(res.data.data.documents);
    } catch (err) {
      addToast('Failed to fetch documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    setUploading(true);
    try {
      await api.post(`/projects/${projectId}/workspace/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast('Document uploaded successfully', 'success');
      fetchDocuments();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/projects/${projectId}/workspace/documents/${docId}`);
      addToast('Document deleted', 'success');
      setDocuments(prev => prev.filter(d => d.document_id !== docId));
    } catch (err) {
      addToast('Failed to delete document', 'error');
    }
  };

  const handleDownload = (docId, fileName) => {
    // Authenticated download endpoint via API interceptor logic handles standard requests,
    // but for downloads we can do a blob fetch.
    api.get(`/projects/${projectId}/workspace/documents/${docId}/download`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => addToast('Failed to download document', 'error'));
  };

  if (loading) return <div>Loading documents...</div>;

  return (
    <div className="space-y-6">
      
      {/* Upload Area */}
      <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50">
        <CardBody className="text-center py-10">
          <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Upload a Document</h3>
          <p className="text-sm text-slate-500 mb-4">PDF, DOCX, TXT, or Image up to 20MB</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" 
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Select File'}
          </Button>
        </CardBody>
      </Card>

      {/* Document List */}
      <div className="space-y-3">
        {documents.map(doc => {
          const canDelete = isLeader || doc.uploaded_by === user.user_id || user.role === 'ADMIN';
          return (
            <Card key={doc.document_id}>
              <CardBody className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <FileIcon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      {doc.file_name} 
                      <Badge variant="neutral">v{doc.version}</Badge>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Uploaded by {doc.uploader_name} on {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => handleDownload(doc.document_id, doc.file_name)}>
                    <Download size={18} />
                  </Button>
                  {canDelete && (
                    <Button variant="ghost" className="text-red-600" onClick={() => handleDelete(doc.document_id)}>
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
        {documents.length === 0 && <p className="text-center text-slate-500 py-8">No documents uploaded yet.</p>}
      </div>

    </div>
  );
}
