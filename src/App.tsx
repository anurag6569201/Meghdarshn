import React, { useState, useEffect } from 'react';
import { Satellite, Cloud, Zap, AlertTriangle, Map, Settings, Download, Play, Pause, RefreshCw, CheckSquare, Layers, PlayCircle, Square } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WeatherMap from './components/WeatherMap';
// ForecastControls is no longer imported here
import AlertPanel from './components/AlertPanel';
import DataPanel from './components/DataPanel';
import Header from './components/Header';
import ModelStatus from './components/ModelStatus';
import ProbabilisticForecast from './components/ProbabilisticForecast';
import SatelliteImagery from './components/SatelliteImagery';
import AuroraIntegration from './components/AuroraIntegration';
import TimeGenAnalysis from './components/TimeGenAnalysis';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [forecastTime, setForecastTime] = useState(60); // 1 hour in minutes
  const [selectedLayer, setSelectedLayer] = useState('clouds');
  const [activeAlerts, setActiveAlerts] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('models'); // 'models', 'satellite', 'aurora', 'timegen'
  const [modelStatus, setModelStatus] = useState({
    hpidm: { status: 'active', lastRun: '2 min ago', accuracy: 94 },
    aurora: { status: 'active', lastRun: '5 min ago', accuracy: 89 },
    timegen: { status: 'active', lastRun: '1 min ago', accuracy: 92 }
  });
  const [uncertaintyLevel, setUncertaintyLevel] = useState(15);
  const [stormIntensity, setStormIntensity] = useState(68);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate model performance fluctuations
      setModelStatus(prev => ({
        ...prev,
        hpidm: { ...prev.hpidm, accuracy: 90 + Math.random() * 8 },
        aurora: { ...prev.aurora, accuracy: 85 + Math.random() * 10 },
        timegen: { ...prev.timegen, accuracy: 88 + Math.random() * 8 }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Simulate forecast animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setForecastTime(prev => {
          const newTime = prev + 5;
          return newTime > 180 ? 0 : newTime;
        });
        setUncertaintyLevel(prev => Math.min(prev + 0.5, 35));
        setStormIntensity(prev => 60 + Math.sin(Date.now() / 10000) * 15);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setForecastTime(0);
    setTimeout(() => {
      setIsLoading(false);
      setActiveAlerts(Math.floor(Math.random() * 6) + 1);
    }, 2000);
  };

  const handleExport = () => {
    // Simulate export functionality
    const exportData = {
      timestamp: currentTime.toISOString(),
      forecastTime,
      selectedLayer,
      modelPerformance: modelStatus,
      stormData: { intensity: stormIntensity, uncertainty: uncertaintyLevel }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chase-cloud-forecast-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderLeftPanelContent = () => {
    switch (activeTab) {
      case 'satellite':
        return (
          <SatelliteImagery 
            selectedLayer={selectedLayer}
            currentTime={currentTime}
            forecastTime={forecastTime}
          />
        );
      case 'aurora':
        return (
          <AuroraIntegration 
            forecastTime={forecastTime}
            stormIntensity={stormIntensity}
          />
        );
      case 'timegen':
        return (
          <TimeGenAnalysis 
            forecastTime={forecastTime}
            uncertaintyLevel={uncertaintyLevel}
          />
        );
      default:
        return (
          <>
                  <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 z-20 w-80 shadow-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <Settings className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-semibold text-lg">Forecast Configuration</span>
                    </div>
                    <div className="space-y-3 mb-4 text-sm">
                      <div>
                        <label className="text-xs text-slate-400">Region of Interest</label>
                        <div className="p-2 bg-slate-700 rounded mt-1 text-white">New Delhi</div>
                      </div>
                       <div>
                        <label className="text-xs text-slate-400">Model Version</label>
                        <div className="p-2 bg-slate-700 rounded mt-1 text-white">Megh-D v1.2 (Stable)</div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 flex items-center text-slate-300">
                        <Layers className="w-4 h-4 mr-2" /> Input Data Channels
                      </h4>
                      <div className="space-y-1 text-xs font-medium text-slate-300 bg-slate-700/50 p-2 rounded">
                        <div className="flex items-center text-green-400"><CheckSquare className="w-3.5 h-3.5 mr-2" /> Visible (VIS)</div>
                        <div className="flex items-center text-green-400"><CheckSquare className="w-3.5 h-3.5 mr-2" /> Infrared (IR)</div>
                        <div className="flex items-center text-slate-500"><Square className="w-3.5 h-3.5 mr-2" /> Water Vapor (WV)</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-slate-300">Model Input Sequence</h4>
                      <div className="flex justify-around space-x-2">
                        {[ 'T-90m', 'T-60m', 'T-30m', 'T-0' ].map((label, i) => (
                          <div key={label} className="text-center">
                            <img 
                              src={`https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=focalpoint&fp-x=${0.7-i*0.1}`} 
                              alt={label} 
                              className="w-14 h-14 rounded-md border-2 border-slate-600 object-cover" 
                            />
                            <p className="text-xs mt-1 text-slate-400 font-medium">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5">
                        <button className="w-full flex items-center justify-center p-1 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-colors">
                            <PlayCircle className="w-5 h-5 mr-2"/>
                            <span>Forecast is Live</span>
                        </button>
                    </div>
                  </div>
            <ModelStatus modelStatus={modelStatus} />
            
            <DataPanel 
              selectedLayer={selectedLayer} 
              stormIntensity={stormIntensity}
              uncertaintyLevel={uncertaintyLevel}
            />
            <ProbabilisticForecast 
              forecastTime={forecastTime}
              uncertaintyLevel={uncertaintyLevel}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header 
        currentTime={currentTime}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />
      
      <main className="flex">
        {/* Left Panel - Enhanced with Tabs */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col" style={{position:'sticky',top:'0px',height:'100vh'}}>
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('models')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'models' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Models
            </button>
            <button
              onClick={() => setActiveTab('satellite')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'satellite' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              INSAT
            </button>
            <button
              onClick={() => setActiveTab('aurora')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'aurora' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Aurora
            </button>
            <button
              onClick={() => setActiveTab('timegen')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'timegen' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              TimeGEN
            </button>
          </div>

          {/* FORECAST CONTROLS REMOVED FROM HERE */}
          
          {/* Dynamic content based on active tab */}
          <div className="flex-1 overflow-y-auto space-y-4 sidepannel">
            {renderLeftPanelContent()}
          </div>
        </div>

        {/* Main Content - Map & Dashboard */}
        <div className="flex-1 flex flex-col">
          {/* UPDATED WEATHERMAP WITH NEW PROPS */}
          <WeatherMap 
            isPlaying={isPlaying}
            selectedLayer={selectedLayer}
            forecastTime={forecastTime}
            isLoading={isLoading}
            stormIntensity={stormIntensity}
            uncertaintyLevel={uncertaintyLevel}
            onPlayPause={handlePlayPause}
            onForecastTimeChange={setForecastTime}
            onLayerChange={setSelectedLayer}
          />
          
          <Dashboard 
            currentTime={currentTime}
            forecastTime={forecastTime}
            selectedLayer={selectedLayer}
            modelStatus={modelStatus}
            stormIntensity={stormIntensity}
          />
        </div>
      </main>
    </div>
  );
}

export default App;