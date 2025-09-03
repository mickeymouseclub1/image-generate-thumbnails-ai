import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Slider } from './components/ui/slider';
import { Badge } from './components/ui/badge';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { 
  Sparkles, 
  Download, 
  Upload, 
  Palette, 
  Type, 
  Crop, 
  RotateCw, 
  Contrast, 
  Sun,
  Scissors,
  Move,
  Zap,
  Image as ImageIcon,
  Wand2,
  Layers,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Copy
} from 'lucide-react';

const ImageEditor = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [textOverlays, setTextOverlays] = useState([]);
  const [newTextOverlay, setNewTextOverlay] = useState({ text: '', x: 50, y: 50, size: 24, color: '#ffffff' });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [downloadFormat, setDownloadFormat] = useState('original');
  const [showPromptGenerator, setShowPromptGenerator] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const templates = [
    { id: 1, name: 'Social Media Post', category: 'Social Media', image: 'https://images.unsplash.com/photo-1676276375742-9e3d10e39d45?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHRlbXBsYXRlc3xlbnwwfHx8fDE3NTY5MTk4Njl8MA&ixlib=rb-4.1.0&q=85', width: 1080, height: 1080 },
    { id: 2, name: 'Instagram Story', category: 'Social Media', image: 'https://images.unsplash.com/photo-1689004624325-6edf074228dd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzb2NpYWwlMjBtZWRpYSUyMHRlbXBsYXRlc3xlbnwwfHx8fDE3NTY5MTk4Njl8MA&ixlib=rb-4.1.0&q=85', width: 1080, height: 1920 },
    { id: 3, name: 'Presentation Slide', category: 'Presentation', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxncmFwaGljJTIwZGVzaWdufGVufDB8fHx8MTc1NjkxOTg2MHww&ixlib=rb-4.1.0&q=85', width: 1920, height: 1080 },
    { id: 4, name: 'Mobile App Screen', category: 'App Design', image: 'https://images.unsplash.com/photo-1697292866722-13f228a35326?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB0ZW1wbGF0ZXN8ZW58MHx8fHwxNzU2OTE5ODMxfDA&ixlib=rb-4.1.0&q=85', width: 375, height: 812 },
    { id: 5, name: 'Poster Design', category: 'Print', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWdufGVufDB8fHx8MTc1NjkxOTg2MHww&ixlib=rb-4.1.0&q=85', width: 2480, height: 3508 },
    { id: 6, name: 'Web Banner', category: 'Web', image: 'https://images.pexels.com/photos/5081930/pexels-photo-5081930.jpeg', width: 1200, height: 400 }
  ];

  const generateAppPrompt = () => {
    return `build something like which can generate images i dont know i dont have any api so you do it from somewhere just be care inlike inspect element we should not caught so what this will do is generate thubnail col images like canva and fully functional with a super strong editing tool which are equal to canva and at the end wreite created by lakshya sharma and also help user to upload edit there images with ai and stuff i am remainding i dont have api and use stable eye catcher themes colour and stuff that look proffesional business and standard type also please build in fronted so that i can host it on vercel no backend but keep in mind i will host it on vercel you can go

Key features implemented:
- Unlimited AI image generation using Pollinations API (free, no API key needed)
- Professional templates (Social Media, Presentations, App Design, Print, Web)
- Advanced image editing with brightness, contrast, saturation controls
- Text overlay system with position, size, and color customization
- Multiple download formats (Square, Horizontal, Vertical, Round, Round Rectangle)
- Upload and edit existing images
- Professional business theme with modern gradients
- Responsive design for all devices
- Built with React, Tailwind CSS, Shadcn UI components
- Frontend-only architecture perfect for Vercel deployment`;
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for image generation');
      return;
    }

    setIsGenerating(true);
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true`;
      
      // Test if image loads
      const img = new Image();
      img.onload = () => {
        setGeneratedImage(imageUrl);
        setEditingImage(imageUrl);
        toast.success('Image generated successfully!');
        setActiveTab('edit');
      };
      img.onerror = () => {
        toast.error('Failed to generate image. Please try again.');
      };
      img.src = imageUrl;
      
    } catch (error) {
      toast.error('Error generating image: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setEditingImage(e.target.result);
        setActiveTab('edit');
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas || !editingImage) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      
      // Apply text overlays
      textOverlays.forEach(overlay => {
        ctx.font = `${overlay.size}px 'Montserrat', sans-serif`;
        ctx.fillStyle = overlay.color;
        ctx.fillText(overlay.text, overlay.x, overlay.y);
      });
    };
    img.src = editingImage;
  };

  const addTextOverlay = () => {
    if (!newTextOverlay.text.trim()) {
      toast.error('Please enter text for overlay');
      return;
    }
    
    setTextOverlays([...textOverlays, { ...newTextOverlay, id: Date.now() }]);
    setNewTextOverlay({ text: '', x: 50, y: 50, size: 24, color: '#ffffff' });
    toast.success('Text overlay added!');
  };

  const downloadImage = (format = 'original') => {
    const canvas = canvasRef.current;
    if (!canvas || !editingImage) {
      toast.error('No image to download');
      return;
    }

    // Create a new canvas for custom format
    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    
    // Set dimensions based on format
    let width, height;
    switch (format) {
      case 'square':
        width = height = 1080;
        break;
      case 'horizontal':
        width = 1920;
        height = 1080;
        break;
      case 'vertical':
        width = 1080;
        height = 1920;
        break;
      case 'round':
        width = height = 1080;
        break;
      case 'round-rectangle':
        width = 1200;
        height = 800;
        break;
      default:
        // Original dimensions
        width = canvas.width;
        height = canvas.height;
    }

    downloadCanvas.width = width;
    downloadCanvas.height = height;

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Apply format-specific styling
    if (format === 'round') {
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(width/2, height/2, Math.min(width, height)/2, 0, 2 * Math.PI);
      ctx.clip();
    } else if (format === 'round-rectangle') {
      // Create rounded rectangle clipping path
      const radius = 50;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Draw the original canvas content, scaled to fit
    const img = new Image();
    img.onload = () => {
      // Calculate scaling to fit while maintaining aspect ratio
      const scale = Math.min(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // Apply text overlays
      textOverlays.forEach(overlay => {
        ctx.font = `${overlay.size * scale}px 'Montserrat', sans-serif`;
        ctx.fillStyle = overlay.color;
        ctx.fillText(overlay.text, overlay.x * scale + offsetX, overlay.y * scale + offsetY);
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `pixelcraft-${format}-design.png`;
      link.href = downloadCanvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success(`Image downloaded in ${format} format!`);
    };
    img.src = editingImage;
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setEditingImage(template.image);
    setActiveTab('edit');
    toast.success(`Template "${template.name}" selected!`);
  };

  useEffect(() => {
    if (editingImage) {
      applyFilters();
    }
  }, [editingImage, brightness, contrast, saturation, textOverlays]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3NTY5MTk4MDB8MA&ixlib=rb-4.1.0&q=85"
            alt="Creative workspace"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-blue-900/60 to-purple-900/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                PixelCraft
              </span>
              <br />
              Design Studio
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create stunning visuals with AI-powered image generation and professional editing tools. 
              Unlimited creativity, zero API costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTab('generate')}
              >
                <Sparkles className="mr-2 h-6 w-6" />
                Start Creating
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-900 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
                onClick={() => setActiveTab('templates')}
              >
                <Layers className="mr-2 h-6 w-6" />
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-2">
            <TabsTrigger value="generate" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300">
              <Sparkles className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300">
              <Layers className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300">
              <Wand2 className="h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-8">
                <CardTitle className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3">
                  <Sparkles className="h-8 w-8 text-indigo-600" />
                  AI Image Generation
                </CardTitle>
                <p className="text-center text-gray-600 text-lg mt-2">Describe your vision and watch it come to life</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe the image you want to create... (e.g., 'A futuristic cityscape at sunset with flying cars')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                  />
                  <Button 
                    onClick={generateImage} 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-xl font-semibold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin mr-3 h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-6 w-6" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
                
                {generatedImage && (
                  <div className="text-center space-y-4">
                    <div className="relative inline-block rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={generatedImage} 
                        alt="Generated artwork" 
                        className="max-w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                    <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-medium">
                      ✨ Generated with AI
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-8">
                <CardTitle className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3">
                  <Layers className="h-8 w-8 text-purple-600" />
                  Design Templates
                </CardTitle>
                <p className="text-center text-gray-600 text-lg mt-2">Choose from professionally designed templates</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {templates.map((template) => (
                    <Card 
                      key={template.id} 
                      className="group cursor-pointer border-2 border-gray-200 hover:border-purple-400 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => selectTemplate(template)}
                    >
                      <div className="relative overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Badge className="absolute top-3 right-3 bg-purple-600 text-white">
                          {template.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{template.name}</h3>
                        <p className="text-gray-600 text-sm">{template.width} × {template.height}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-8">
                <CardTitle className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-3">
                  <Upload className="h-8 w-8 text-green-600" />
                  Upload & Edit
                </CardTitle>
                <p className="text-center text-gray-600 text-lg mt-2">Upload your images to enhance with AI</p>
              </CardHeader>
              <CardContent className="p-8">
                <div 
                  className="border-3 border-dashed border-gray-300 rounded-3xl p-16 text-center hover:border-green-500 transition-colors duration-300 cursor-pointer bg-gradient-to-br from-green-50/50 to-emerald-50/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-gray-500">
                    Supports JPG, PNG, WebP formats
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {uploadedImage && (
                  <div className="mt-8 text-center">
                    <div className="relative inline-block rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded image" 
                        className="max-w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                    <Badge className="bg-blue-500 text-white px-4 py-2 text-sm font-medium mt-4">
                      📁 Uploaded Successfully
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-8">
            {editingImage ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Canvas Area */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-6">
                      <CardTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-3">
                        <Wand2 className="h-6 w-6 text-orange-600" />
                        Design Canvas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <canvas 
                          ref={canvasRef}
                          className="max-w-full h-auto border border-gray-200 rounded-2xl shadow-lg"
                          style={{ maxHeight: '500px' }}
                        />
                      </div>
                      
                      {/* Download Options */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Download Format
                          </label>
                          <select 
                            value={downloadFormat}
                            onChange={(e) => setDownloadFormat(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                          >
                            <option value="original">Original Size</option>
                            <option value="square">Square (1080x1080)</option>
                            <option value="horizontal">Horizontal (1920x1080)</option>
                            <option value="vertical">Vertical (1080x1920)</option>
                            <option value="round">Round Profile (1080x1080)</option>
                            <option value="round-rectangle">Round Rectangle (1200x800)</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button 
                            onClick={() => downloadImage(downloadFormat)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold rounded-2xl shadow-xl transition-all duration-300"
                          >
                            <Download className="mr-2 h-5 w-5" />
                            Download Design
                          </Button>
                          
                          <Dialog open={showPromptGenerator} onOpenChange={setShowPromptGenerator}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50 py-4 text-lg font-semibold rounded-2xl transition-all duration-300"
                              >
                                <Copy className="mr-2 h-5 w-5" />
                                Get Prompt
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                                  🚀 Recreate This App
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-gray-600">
                                  Copy this prompt to recreate PixelCraft Design Studio:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 max-h-96 overflow-y-auto">
                                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                    {generateAppPrompt()}
                                  </pre>
                                </div>
                                <Button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(generateAppPrompt());
                                    toast.success('Prompt copied to clipboard!');
                                  }}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy to Clipboard
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Editing Controls */}
                <div className="space-y-6">
                  {/* Filters */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-indigo-600" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Sun className="inline h-4 w-4 mr-1" />
                          Brightness: {brightness}%
                        </label>
                        <Slider
                          value={[brightness]}
                          onValueChange={(value) => setBrightness(value[0])}
                          min={0}
                          max={200}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Contrast className="inline h-4 w-4 mr-1" />
                          Contrast: {contrast}%
                        </label>
                        <Slider
                          value={[contrast]}
                          onValueChange={(value) => setContrast(value[0])}
                          min={0}
                          max={200}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Palette className="inline h-4 w-4 mr-1" />
                          Saturation: {saturation}%
                        </label>
                        <Slider
                          value={[saturation]}
                          onValueChange={(value) => setSaturation(value[0])}
                          min={0}
                          max={200}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text Overlay */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Type className="h-5 w-5 text-purple-600" />
                        Text Overlay
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="Enter text"
                        value={newTextOverlay.text}
                        onChange={(e) => setNewTextOverlay({ ...newTextOverlay, text: e.target.value })}
                        className="border-2 border-gray-200 rounded-xl"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">X Position</label>
                          <Input
                            type="number"
                            value={newTextOverlay.x}
                            onChange={(e) => setNewTextOverlay({ ...newTextOverlay, x: parseInt(e.target.value) })}
                            className="text-sm border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Y Position</label>
                          <Input
                            type="number"
                            value={newTextOverlay.y}
                            onChange={(e) => setNewTextOverlay({ ...newTextOverlay, y: parseInt(e.target.value) })}
                            className="text-sm border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                          <Input
                            type="number"
                            value={newTextOverlay.size}
                            onChange={(e) => setNewTextOverlay({ ...newTextOverlay, size: parseInt(e.target.value) })}
                            className="text-sm border border-gray-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                          <Input
                            type="color"
                            value={newTextOverlay.color}
                            onChange={(e) => setNewTextOverlay({ ...newTextOverlay, color: e.target.value })}
                            className="h-10 border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={addTextOverlay}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                      >
                        <Type className="mr-2 h-4 w-4" />
                        Add Text
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
                <CardContent className="p-16 text-center">
                  <ImageIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">No Image Selected</h3>
                  <p className="text-gray-500 mb-8">
                    Generate an image, select a template, or upload your own to start editing
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => setActiveTab('generate')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('upload')}
                      variant="outline"
                      className="border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl px-6 py-3"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              PixelCraft Design Studio
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Professional design tools powered by AI. Create stunning visuals without limits.
            </p>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-lg font-medium">
              ✨ Created by <span className="text-white font-bold">Lakshya Sharma</span> ✨
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Empowering creators with unlimited AI-powered design tools
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default ImageEditor;