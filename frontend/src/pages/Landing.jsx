
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Upload, 
  PenTool, 
  Share2, 
  Download, 
  Shield, 
  Zap, 
  Users,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">


      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Digital Signing
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Upload, sign, and share documents securely with our intuitive digital signature platform. 
              No more printing, scanning, or mailing documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-40 right-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}>
          <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed to streamline your document signing process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Easy Upload",
                description: "Drag and drop your PDFs or images. Support for multiple file formats."
              },
              {
                icon: PenTool,
                title: "Digital Signatures",
                description: "Draw your signature with our intuitive canvas tool. Create reusable templates."
              },
              {
                icon: Share2,
                title: "Share & Collaborate",
                description: "Send documents to multiple signers via email. Track signing progress in real-time."
              },
              {
                icon: Shield,
                title: "Secure & Compliant",
                description: "Bank-level security with encrypted storage. Legally binding digital signatures."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Complete document signing in minutes, not days. Streamlined workflow."
              },
              {
                icon: Download,
                title: "Download Anywhere",
                description: "Access signed documents anytime. Download original and signed versions."
              }
            ].map((feature, index) => (
              <Card key={index} className="hover-scale bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get your documents signed in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Upload Document",
                description: "Upload your PDF or image document to our secure platform",
                icon: Upload
              },
              {
                step: "2",
                title: "Add Signatures",
                description: "Draw your signature and invite others to sign the document",
                icon: PenTool
              },
              {
                step: "3",
                title: "Download & Share",
                description: "Download the signed document and share it with all parties",
                icon: Download
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {step.description}
                </p>
                <step.icon className="w-12 h-12 text-blue-500 mx-auto" />
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Documents Signed" },
              { number: "5K+", label: "Happy Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Business Owner",
                content: "EasySign has revolutionized how we handle contracts. What used to take weeks now takes minutes!",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Real Estate Agent",
                content: "The interface is so intuitive. My clients love how easy it is to sign documents on their phones.",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "HR Manager",
                content: "Secure, fast, and reliable. EasySign has streamlined our entire onboarding process.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Ready to Go Digital?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Join thousands of users who have already made the switch to digital signatures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-12 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EasySign</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The most intuitive digital signature platform for modern businesses. 
                Sign documents securely, anywhere, anytime.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 EasySign. All rights reserved. Built with ❤️ for digital transformation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;