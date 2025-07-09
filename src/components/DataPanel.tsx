import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Thermometer, Wind, Cloud, Radar } from 'lucide-react';

interface DataPanelProps {
  selectedLayer: string;
  stormIntensity: number;
  uncertaintyLevel: number;
}

const DataPanel: React.FC<DataPanelProps> = ({ selectedLayer, stormIntensity, uncertaintyLevel }) => {
  const getLayerData = (layer: string) => {
    switch (layer) {
      case 'radar':
        return {
          title: 'Radar Reflectivity',
          unit: 'dBZ',
          current: stormIntensity,
          trend: stormIntensity > 60 ? 'up' : stormIntensity < 40 ? 'down' : 'stable',
          icon: Radar,
          values: [
            { label: 'Max Reflectivity', value: `${Math.max(stormIntensity, 68).toFixed(1)} dBZ`, color: 'text-red-400' },
            { label: 'Storm Top Height', value: '12.5 km', color: 'text-yellow-400' },
            { label: 'VIL Density', value: '4.2 kg/m²', color: 'text-blue-400' },
            { label: 'Coverage Area', value: '2,340 km²', color: 'text-green-400' }
          ]
        };
      case 'temperature':
        return {
          title: 'Cloud Top Temperature',
          unit: '°C',
          current: -45 + (stormIntensity - 50) * 0.5,
          trend: stormIntensity > 60 ? 'down' : 'up',
          icon: Thermometer,
          values: [
            { label: 'Coldest Point', value: '-62°C', color: 'text-blue-400' },
            { label: 'Warmest Edge', value: '-18°C', color: 'text-red-400' },
            { label: 'Gradient', value: '8°C/km', color: 'text-yellow-400' },
            { label: 'Freezing Level', value: '4.2 km', color: 'text-green-400' }
          ]
        };
      case 'wind':
        return {
          title: 'Wind Velocity (Aurora)',
          unit: 'km/h',
          current: 25 + stormIntensity * 0.3,
          trend: 'up',
          icon: Wind,
          values: [
            { label: 'Max Wind Speed', value: `${(35 + stormIntensity * 0.4).toFixed(1)} km/h`, color: 'text-red-400' },
            { label: 'Direction', value: '245° (WSW)', color: 'text-blue-400' },
            { label: 'Shear (0-6km)', value: '18 m/s', color: 'text-yellow-400' },
            { label: 'Convergence', value: '-2.1×10⁻⁴ s⁻¹', color: 'text-green-400' }
          ]
        };
      case 'clouds':
        return {
          title: 'Cloud Properties',
          unit: '%',
          current: 75 + uncertaintyLevel,
          trend: 'up',
          icon: Cloud,
          values: [
            { label: 'Coverage', value: `${(75 + uncertaintyLevel).toFixed(1)}%`, color: 'text-gray-400' },
            { label: 'Optical Depth', value: '28.5', color: 'text-blue-400' },
            { label: 'Liquid Water', value: '0.85 g/m³', color: 'text-green-400' },
            { label: 'Ice Content', value: '1.2 g/m³', color: 'text-cyan-400' }
          ]
        };
      default:
        return {
          title: 'Multi-Spectral Data',
          unit: '',
          current: 0,
          trend: 'stable',
          icon: Activity,
          values: []
        };
    }
  };

  const data = getLayerData(selectedLayer);
  const Icon = data.icon;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Icon className="h-5 w-5 text-blue-400" />
        <span>INSAT-3DR Analysis</span>
      </h3>
      
      {/* Current Value */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">{data.title}</span>
          {getTrendIcon(data.trend)}
        </div>
        <div className="text-2xl font-bold text-white">
          {typeof data.current === 'number' ? data.current.toFixed(1) : data.current} {data.unit}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Real-time satellite measurement
        </div>
      </div>

      {/* Detailed Values */}
      <div className="space-y-3 mb-6">
        {data.values.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{item.label}</span>
            <span className={`text-sm font-medium ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Satellite Channels */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">Active Channels</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">VIS (0.65 μm)</span>
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">IR (10.8 μm)</span>
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">WV (6.7 μm)</span>
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Integration */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 border border-blue-700/30">
        <div className="text-sm text-slate-400 mb-2">Physics Constraints</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Hydrostatic Balance</span>
            <span className="text-xs text-green-400">Satisfied</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Mass Conservation</span>
            <span className="text-xs text-green-400">Enforced</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Thermal Wind</span>
            <span className="text-xs text-yellow-400">Approximated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;