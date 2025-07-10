import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { downloadAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Download as DownloadIcon, FileText, Image, ArrowLeft } from 'lucide-react';

const Download = () => {
  const { fileId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDownload = async (type) => {
    if (!fileId) return;

    setLoading(true);
    try {
      const url = await downloadAPI.getFileUrl(fileId, type);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${fileId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${type} file downloaded successfully!`);
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to download ${type} file`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Download Files</h1>
        <p className="text-gray-600 dark:text-gray-400">Download your document and signature files</p>
      </div>

      <div className="space-y-6">
        {/* Original Document */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Original Document</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download the original document as uploaded
            </p>
            <Button 
              onClick={() => handleDownload('original')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Original
            </Button>
          </CardContent>
        </Card>

        {/* Signed Document */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-green-600" />
              <span>Signed Document</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download the document with all signatures applied
            </p>
            <Button 
              onClick={() => handleDownload('signed')}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Signed Version
            </Button>
          </CardContent>
        </Card>

        {/* Signature File */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="w-6 h-6 text-purple-600" />
              <span>Signature File</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download your signature as a separate image file
            </p>
            <Button 
              onClick={() => handleDownload('signature')}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Signature
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Download Information
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Files are securely stored and accessible anytime</li>
            <li>• Signed documents include all party signatures</li>
            <li>• Signature files can be reused for future documents</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Download;
