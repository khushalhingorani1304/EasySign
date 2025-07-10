import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import SignatureCanvas from '../components/SignatureCanvas';
import { toast } from 'sonner';
import { Upload as UploadIcon, FileText, File } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [signatureCanvas, setSignatureCanvas] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleSignatureSave = (signatureData) => {
    setSignatureCanvas(signatureData);
    toast.success('Signature saved!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !signatureCanvas) {
      toast.error('Please fill all fields and draw your signature');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('signatureCanvas', signatureCanvas);
      formData.append('isTemplate', isTemplate.toString());

      await documentsAPI.uploadDocument(formData);
      toast.success('Document uploaded successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Document</h1>
        <p className="text-gray-600 dark:text-gray-400">Upload a document and add your signature</p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UploadIcon className="w-6 h-6 text-blue-600" />
            <span>Document Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Document File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center space-x-2">
                      <File className="w-8 h-8 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Title
              </label>
              <Input
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Template Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="template"
                checked={isTemplate}
                onCheckedChange={(checked) => setIsTemplate(!!checked)}
              />
              <label htmlFor="template" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mark as reusable template
              </label>
            </div>

            {/* Signature Canvas */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Signature
              </label>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <SignatureCanvas 
                  onSave={handleSignatureSave}
                  width={600}
                  height={200}
                  className="mx-auto"
                />
              </div>
              {signatureCanvas && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Signature captured successfully
                  </p>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
              disabled={loading || !file || !title || !signatureCanvas}
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
