import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Upload, Share, Download, Eye, Clock } from 'lucide-react';

const Dashboard = () => {
  const [myDocuments, setMyDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const [myDocsRes, sharedDocsRes] = await Promise.all([
          documentsAPI.getMyDocuments(),
          documentsAPI.getSharedDocuments(),
        ]);

        // console.log('MyDocsRes:', myDocsRes);
        // console.log('SharedDocsRes:', sharedDocsRes);
        setMyDocuments(myDocsRes.files || []);
        setSharedDocuments(sharedDocsRes.documents || []);
      } catch (error) {
        toast.error('Failed to fetch documents');
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

const handleDownload = async (doc) => {
  const url = doc.signedFileUrl || doc.fileUrl;
  if (!url) {
    toast.error("File not available for download");
    return;
  }

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${doc.title || "document"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    toast.error("Download failed");
    console.error(err);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your documents and signatures</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Document</h3>
                <p className="text-blue-100">Add new documents to sign</p>
              </div>
              <Upload className="w-8 h-8 text-blue-100" />
            </div>
            <Link to="/upload">
              <Button variant="secondary" className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
                Upload Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Share Document</h3>
                <p className="text-purple-100">Invite others to sign</p>
              </div>
              <Share className="w-8 h-8 text-purple-100" />
            </div>
            <Link to="/share">
              <Button variant="secondary" className="mt-4 bg-white text-purple-600 hover:bg-gray-100">
                Share Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Documents</h3>
                <p className="text-green-100">{myDocuments.length + sharedDocuments.length} total</p>
              </div>
              <FileText className="w-8 h-8 text-green-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Tabs */}
      <Tabs defaultValue="my-documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-documents">My Documents ({myDocuments.length})</TabsTrigger>
          <TabsTrigger value="shared-documents">Shared with Me ({sharedDocuments.length})</TabsTrigger>
        </TabsList>

        {/* My Documents */}
        <TabsContent value="my-documents" className="space-y-4">
          {myDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Upload your first document to get started</p>
                <Link to="/upload">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myDocuments.map((doc) => (
                <Card key={doc._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{doc.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created {formatDate(doc.createdAt)}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status.replace('_', ' ')}
                            </Badge>
                            {doc.isTemplate && (
                              <Badge variant="outline">Template</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Link to={`/sign/${doc._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                                View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            >
                          <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Shared Documents */}
        <TabsContent value="shared-documents" className="space-y-4">
          {sharedDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Share className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No shared documents</h3>
                <p className="text-gray-600 dark:text-gray-400">Documents shared with you will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sharedDocuments.map((doc) => (
                <Card key={doc._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{doc.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Shared by {doc.owner?.email || "Unknown"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(doc.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Link to={`/sign/${doc._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                                Sign
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            >
                          <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
