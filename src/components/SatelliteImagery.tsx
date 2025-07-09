import React, { useState, useEffect } from 'react';
import { Satellite, Camera, Download, Eye, EyeOff, Thermometer, Cloud, Wind } from 'lucide-react';

interface SatelliteImageryProps {
  selectedLayer: string;
  currentTime: Date;
  forecastTime: number;
}

interface INSATChannel {
  id: string;
  name: string;
  wavelength: string;
  description: string;
  imageUrl: string;
  temperature: number;
  cloudCoverage: number;
  isActive: boolean;
  lastUpdate: Date;
}

const SatelliteImagery: React.FC<SatelliteImageryProps> = ({ 
  selectedLayer, 
  currentTime, 
  forecastTime 
}) => {
  const [channels, setChannels] = useState<INSATChannel[]>([
    {
      id: 'vis',
      name: 'Visible',
      wavelength: '0.65 μm',
      description: 'Daytime cloud and surface features',
      imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      temperature: 25,
      cloudCoverage: 65,
      isActive: true,
      lastUpdate: new Date()
    },
    {
      id: 'ir',
      name: 'Infrared',
      wavelength: '10.8 μm',
      description: 'Cloud top temperature and height',
      imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      temperature: -45,
      cloudCoverage: 70,
      isActive: true,
      lastUpdate: new Date()
    },
    {
      id: 'wv',
      name: 'Water Vapor',
      wavelength: '6.7 μm',
      description: 'Upper tropospheric moisture',
      imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      temperature: -20,
      cloudCoverage: 55,
      isActive: true,
      lastUpdate: new Date()
    },
    {
      id: 'swir',
      name: 'SWIR',
      wavelength: '1.6 μm',
      description: 'Cloud particle size discrimination',
      imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      temperature: 15,
      cloudCoverage: 45,
      isActive: true,
      lastUpdate: new Date()
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState('vis');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChannels(prev => prev.map(channel => ({
        ...channel,
        temperature: channel.temperature + (Math.random() - 0.5) * 2,
        cloudCoverage: Math.max(0, Math.min(100, channel.cloudCoverage + (Math.random() - 0.5) * 5)),
        lastUpdate: new Date()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const currentChannel = channels.find(ch => ch.id === selectedChannel) || channels[0];

  const getChannelIcon = (channelId: string) => {
    switch (channelId) {
      case 'vis':
        return <Eye className="h-4 w-4" />;
      case 'ir':
        return <Thermometer className="h-4 w-4" />;
      case 'wv':
        return <Cloud className="h-4 w-4" />;
      case 'swir':
        return <Wind className="h-4 w-4" />;
      default:
        return <Camera className="h-4 w-4" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < -40) return 'text-blue-400';
    if (temp < 0) return 'text-cyan-400';
    if (temp < 20) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Satellite className="h-5 w-5 text-blue-400" />
          <span>INSAT-3DR Imagery</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            {isFullscreen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button className="p-1 hover:bg-slate-700 rounded transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Channel Selection */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setSelectedChannel(channel.id)}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedChannel === channel.id
                ? 'bg-blue-600 text-white border border-blue-500'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              {getChannelIcon(channel.id)}
              <span className="text-sm font-medium">{channel.name}</span>
              {channel.isActive && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="text-xs opacity-75">{channel.wavelength}</div>
          </button>
        ))}
      </div>

      {/* Current Channel Display */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">{currentChannel.name} Channel</span>
          <span className="text-xs text-slate-400">
            {currentChannel.lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        {/* Satellite Image Preview */}
        <div className="relative mb-3">
          <img
            src={currentChannel.imageUrl}
            alt={`INSAT-3DR ${currentChannel.name} Channel`}
            className="w-full h-32 object-cover rounded border border-slate-600"
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {currentChannel.wavelength}
          </div>
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Live
          </div>
        </div>

        <div className="text-xs text-slate-400 mb-2">{currentChannel.description}</div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400">Temperature</div>
            <div className={`text-sm font-medium ${getTemperatureColor(currentChannel.temperature)}`}>
              {currentChannel.temperature.toFixed(1)}°C
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Cloud Coverage</div>
            <div className="text-sm font-medium text-white">
              {currentChannel.cloudCoverage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Satellite Status */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">Satellite Status</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">INSAT-3DR</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Operational</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Data Link</span>
            <span className="text-xs text-green-400">Strong</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Next Pass</span>
            <span className="text-xs text-slate-400">
              {new Date(Date.now() + 30 * 60000).toLocaleTimeString().slice(0, 5)}
            </span>
          </div>
        </div>
      </div>

      {/* Image Processing Pipeline */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 border border-blue-700/30">
        <div className="text-sm text-slate-400 mb-2">Processing Pipeline</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Calibration</span>
            <span className="text-xs text-green-400">Complete</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Geo-referencing</span>
            <span className="text-xs text-green-400">Applied</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Cloud Detection</span>
            <span className="text-xs text-blue-400">Processing</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">HPIDM Input</span>
            <span className="text-xs text-purple-400">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteImagery;