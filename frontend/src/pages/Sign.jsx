import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import SignatureCanvas from '../components/SignatureCanvas';
import { toast } from 'sonner';
import { FileText, User, Clock, CheckCircle } from 'lucide-react';
import PDFPreview from '../components/PDFPreview';

const Sign = () => {
  const { id: documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signatureCoords, setSignatureCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) return;

      try {
        const doc = await documentsAPI.getFileById(documentId);
        setDocument(doc);
      } catch (error) {
        toast.error('Failed to load document');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, navigate]);

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
    toast.success('Signature ready!');
  };

  const handleSign = async () => {
    if (!signature || !documentId) {
      toast.error('Please draw your signature first');
      return;
    }

    if (!signatureCoords) {
      toast.error('Please click on the document to place your signature');
      return;
    }

    setSigning(true);

    try {
      await documentsAPI.signDocument(documentId, signature);
      const { x, y, page } = signatureCoords;
      await documentsAPI.annotateSignature(documentId, x, y, page, signature);
      toast.success('Document signed and annotated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Sign error:", error);
      toast.error(error.response?.data?.message || 'Failed to sign document');
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = async () => {
    if (!document?.signedFileUrl) {
      toast.error("No signed document available");
      return;
    }

    try {
      const response = await fetch(document.signedFileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title || 'signed_document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download document");
      console.error("Download error:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'partially_signed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Document not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign Document</h1>
        <p className="text-gray-600 dark:text-gray-400">Review and sign the document below</p>
      </div>

      {/* Document Info */}
      <Card className="mb-6 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>{document.title}</span>
            </div>
            <Badge className={getStatusColor(document.status)}>
              {document.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Owner: {document.owner.email}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Created: {formatDate(document.createdAt)}
              </span>
            </div>
          </div>

          {document.signatures.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signatures:</h4>
              <div className="space-y-2">
                {document.signatures.map((sig, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Signed on {formatDate(sig.signedAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Preview */}
      <Card className="mb-6 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
            {document.fileUrl ? (
              <div className="space-y-4">
                <PDFPreview
                  url={`${document.signedFileUrl || document.fileUrl}?t=${Date.now()}`}
                  onClick={({ x, y, page }) => {
                    setSignatureCoords({ x, y, page });
                    toast.success(`Position selected at (x: ${x}, y: ${y}) on page ${page}`);
                  }}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Preview of {document.title || 'document.pdf'}
                </p>
              </div>
            ) : (
              <div className="py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Document preview not available</p>
                <p className="text-sm text-gray-500 mt-2">{document.filename}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signature Section */}
      {document.status !== 'completed' && (
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add Your Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <SignatureCanvas
                  onSave={handleSignatureSave}
                  width={600}
                  height={200}
                  className="mx-auto"
                />
              </div>

              {signature && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Signature captured successfully
                  </p>
                </div>
              )}

              <Button
                onClick={handleSign}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={signing || !signature}
              >
                {signing ? 'Signing Document...' : 'Sign Document'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed + Download */}
      {/* {(
        <Card className="shadow-xl border-0 bg-green-50 dark:bg-green-900/20 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
              Document Completed
            </h3>
            <p className="text-green-600 dark:text-green-300 mb-4">
              This document has been fully signed by all parties.
            </p>
            <Button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700"
            >
              Download Signed Document
            </Button>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
};

export default Sign;
