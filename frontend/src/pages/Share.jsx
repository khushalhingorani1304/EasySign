import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { documentsAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { toast } from 'sonner';
import { Share as ShareIcon, Mail, FileText, Send } from 'lucide-react';

const Share = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await documentsAPI.getMyDocuments();
        const fetchedDocs = response.files || [];
        setDocuments(fetchedDocs);

        const docId = searchParams.get('documentId');
        if (docId && fetchedDocs.find(doc => doc._id === docId)) {
          setSelectedDocumentId(docId);
        }
      } catch (error) {
        toast.error('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [searchParams]);

  const handleShare = async (e) => {
    e.preventDefault();

    if (!selectedDocumentId || !email) {
      toast.error('Please select a document and enter an email address');
      return;
    }

    setSharing(true);

    try {
      await documentsAPI.shareDocument({
        documentId: selectedDocumentId,
        recieverEmail: email,
      });
      toast.success('Document shared successfully! An email invitation has been sent.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to share document');
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Share Document</h1>
        <p className="text-gray-600 dark:text-gray-400">Invite others to sign your documents</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShareIcon className="w-6 h-6 text-blue-600" />
            <span>Document Sharing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!Array.isArray(documents) || documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents to share</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Upload a document first to share it with others</p>
              <Button onClick={() => navigate('/upload')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Upload Document
              </Button>
            </div>
          ) : (
            <form onSubmit={handleShare} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Document
                </label>
                <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a document to share" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc._id} value={doc._id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{doc.title}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {doc.status}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recipient Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  The recipient will receive an email invitation to sign the document
                </p>
              </div>

              {selectedDocumentId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Document to Share:
                  </h4>
                  {documents
                    .filter((doc) => doc._id === selectedDocumentId)
                    .map((doc) => (
                      <div key={doc._id} className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            {doc.title}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {doc.filename} • Status: {doc.status}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={sharing || !selectedDocumentId || !email}
              >
                {sharing ? (
                  'Sending Invitation...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
            How Document Sharing Works
          </h3>
          <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-2">
            <li>• The recipient will receive an email with a signing link</li>
            <li>• They must create an account or log in to access the document</li>
            <li>• Once they sign, you'll be notified of the document status</li>
            <li>• You can track all signatures in your dashboard</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;
