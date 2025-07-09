import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Cloud, Wind, Thermometer, Radar, Satellite } from 'lucide-react';

interface ForecastControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  forecastTime: number;
  onForecastTimeChange: (time: number) => void;
  selectedLayer: string;
  onLayerChange: (layer: string) => void;
}

const ForecastControls: React.FC<ForecastControlsProps> = ({
  isPlaying,
  onPlayPause,
  forecastTime,
  onForecastTimeChange,
  selectedLayer,
  onLayerChange
}) => {
  const layers = [
    { id: '', label: '', icon: Cloud, description: 'INSAT-3DR IR' },
    { id: 'radar', label: '', icon: Radar, description: 'Reflectivity' },
    { id: 'wind', label: '', icon: Wind, description: 'Aurora Fields' },
    { id: 'temperature', label: '', icon: Thermometer, description: 'Cloud Top Temp' },
    { id: 'VIS', label: '', icon: Satellite, description: 'Visible Spectrum' }
  ];

  const timeMarkers = [
    { time: 0, label: 'Now' },
    { time: 30, label: '+30m' },
    { time: 60, label: '+1h' },
    { time: 90, label: '+1.5h' },
    { time: 120, label: '+2h' },
    { time: 150, label: '+2.5h' },
    { time: 180, label: '+3h' }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-2xl p-3 flex items-center space-x-4 w-full">
      
      {/* Playback Controls */}
      <div className="flex items-center space-x-1">
        <button 
          className="p-2 text-slate-300 hover:bg-slate-700/80 hover:text-white rounded-full transition-colors"
          onClick={() => onForecastTimeChange(Math.max(0, forecastTime - 15))}
          aria-label="Step Backward"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          onClick={onPlayPause}
          className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
            isPlaying 
              ? 'bg-red-600 hover:bg-red-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
          aria-label={isPlaying ? 'Pause forecast' : 'Play forecast'}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
        </button>
        <button 
          className="p-2 text-slate-300 hover:bg-slate-700/80 hover:text-white rounded-full transition-colors"
          onClick={() => onForecastTimeChange(Math.min(180, forecastTime + 15))}
          aria-label="Step Forward"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Time Range Slider */}
      <div className="flex-grow flex items-center space-x-4">
        <span className="text-lg font-bold text-white tabular-nums w-24 text-center">
          +{Math.floor(forecastTime / 60)}h {(forecastTime % 60).toString().padStart(2, '0')}m
        </span>
        <div className="w-full">
          <div className="relative h-2">
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={forecastTime}
              onChange={(e) => onForecastTimeChange(Number(e.target.value))}
              className="absolute w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer range-slider"
            />
             <div 
              className="absolute top-0 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 rounded-lg pointer-events-none"
              style={{ width: `${(forecastTime / 180) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
            {timeMarkers.map((marker) => (
              <span
                key={marker.time}
                className={`cursor-pointer hover:text-white transition-colors ${
                  Math.abs(forecastTime - marker.time) < 5 ? 'text-blue-300 font-bold' : ''
                }`}
                onClick={() => onForecastTimeChange(marker.time)}
              >
                {marker.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Selection */}
      <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1 flex-shrink-0">
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              title={layer.description}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                selectedLayer === layer.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-600/70 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastControls;