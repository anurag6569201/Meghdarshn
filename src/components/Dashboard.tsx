import React from 'react';
import { BarChart3, TrendingUp, Clock, Zap, Brain, Target, Activity } from 'lucide-react';

interface DashboardProps {
  currentTime: Date;
  forecastTime: number;
  selectedLayer: string;
  modelStatus: {
    hpidm: { status: string; lastRun: string; accuracy: number };
    aurora: { status: string; lastRun: string; accuracy: number };
    timegen: { status: string; lastRun: string; accuracy: number };
  };
  stormIntensity: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  currentTime, 
  forecastTime, 
  selectedLayer, 
  modelStatus,
  stormIntensity 
}) => {
  // Enhanced performance metrics
  const performanceMetrics = [
    { 
      label: 'SSIM Score', 
      value: (modelStatus.hpidm.accuracy / 100).toFixed(3), 
      change: '+0.024', 
      color: 'text-green-400',
      description: 'Structural similarity index'
    },
    { 
      label: 'MAE (dBZ)', 
      value: (2.1 - modelStatus.hpidm.accuracy * 0.02).toFixed(2), 
      change: '-0.15', 
      color: 'text-green-400',
      description: 'Mean absolute error'
    },
    { 
      label: 'Latency', 
      value: '0.8s', 
      change: '-0.2s', 
      color: 'text-green-400',
      description: 'Model inference time'
    },
    { 
      label: 'Physics Score', 
      value: `${((modelStatus.aurora.accuracy + modelStatus.timegen.accuracy) / 2).toFixed(1)}%`, 
      change: '+3.2%', 
      color: 'text-green-400',
      description: 'Physics constraint satisfaction'
    }
  ];

  const recentForecasts = [
    { 
      time: currentTime.toLocaleTimeString().slice(0, 5), 
      location: 'Delhi NCR', 
      accuracy: modelStatus.hpidm.accuracy, 
      status: 'Verified',
      intensity: stormIntensity,
      type: 'Thunderstorm'
    },
    { 
      time: new Date(currentTime.getTime() - 30 * 60000).toLocaleTimeString().slice(0, 5), 
      location: 'Mumbai', 
      accuracy: modelStatus.aurora.accuracy, 
      status: 'Verified',
      intensity: 45,
      type: 'Heavy Rain'
    },
    { 
      time: new Date(currentTime.getTime() - 60 * 60000).toLocaleTimeString().slice(0, 5), 
      location: 'Bangalore', 
      accuracy: modelStatus.timegen.accuracy, 
      status: 'Verified',
      intensity: 38,
      type: 'Moderate Rain'
    },
    { 
      time: new Date(currentTime.getTime() - 90 * 60000).toLocaleTimeString().slice(0, 5), 
      location: 'Kolkata', 
      accuracy: 89, 
      status: 'Processing',
      intensity: 52,
      type: 'Thunderstorm'
    }
  ];

  const getIntensityColor = (intensity: number) => {
    if (intensity > 60) return 'text-red-400';
    if (intensity > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-slate-800 border-t border-slate-700 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span>HPIDM Performance</span>
            </h3>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-3 hover:bg-slate-600 transition-colors">
                <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
                <div className="text-lg font-bold text-white">{metric.value}</div>
                <div className={`text-xs ${metric.color} flex items-center space-x-1`}>
                  <TrendingUp className="h-3 w-3" />
                  <span>{metric.change}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{metric.description}</div>
              </div>
            ))}
          </div>

          {/* Model Integration Timeline */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span>Multi-Model Fusion Timeline</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs text-white">HPIDM Diffusion Process</div>
                  <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                    <div className="bg-purple-400 h-1.5 rounded-full w-3/4 transition-all duration-1000"></div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">75%</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs text-white">Aurora Wind Integration</div>
                  <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-400 h-1.5 rounded-full w-full transition-all duration-1000"></div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">100%</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-xs text-white">TimeGEN-1 Conditioning</div>
                  <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                    <div className="bg-green-400 h-1.5 rounded-full w-5/6 transition-all duration-1000"></div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">85%</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Forecast Generation</span>
                <span className="text-xs text-green-400">
                  +{Math.floor(forecastTime / 60)}h {forecastTime % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Forecasts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-400" />
              <span>Recent Forecasts</span>
            </h3>
            <Clock className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-3">
            {recentForecasts.map((forecast, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-3 hover:bg-slate-600 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{forecast.location}</span>
                  <span className="text-xs text-slate-400">{forecast.time}</span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{forecast.type}</span>
                  <span className={`text-xs font-medium ${getIntensityColor(forecast.intensity)}`}>
                    {forecast.intensity.toFixed(1)} dBZ
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Accuracy: <span className="text-green-400">{forecast.accuracy.toFixed(1)}%</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    forecast.status === 'Verified' 
                      ? 'bg-green-900 text-green-300' 
                      : forecast.status === 'Processing'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {forecast.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* System Health */}
          <div className="mt-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-3 border border-green-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">System Health</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">GPU Utilization</span>
                <span className="text-xs text-green-400">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Memory Usage</span>
                <span className="text-xs text-yellow-400">12.4 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Data Throughput</span>
                <span className="text-xs text-green-400">2.1 GB/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;