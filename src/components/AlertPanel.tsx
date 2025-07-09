import React from 'react';
import { AlertTriangle, Zap, Cloud, Wind, Eye, Bell, BellOff } from 'lucide-react';

interface AlertPanelProps {
  activeAlerts: number;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ activeAlerts }) => {
  const alerts = [
    {
      id: 1,
      type: 'severe',
      title: 'Severe Thunderstorm Warning',
      location: 'Delhi NCR',
      time: new Date(Date.now() + 15 * 60000).toLocaleTimeString().slice(0, 5),
      confidence: 94,
      intensity: 68,
      icon: Zap,
      color: 'text-red-400',
      bgColor: 'bg-red-900/30',
      borderColor: 'border-red-500'
    },
    {
      id: 2,
      type: 'moderate',
      title: 'Heavy Rainfall Expected',
      location: 'Mumbai Metropolitan',
      time: new Date(Date.now() + 45 * 60000).toLocaleTimeString().slice(0, 5),
      confidence: 87,
      intensity: 52,
      icon: Cloud,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30',
      borderColor: 'border-yellow-500'
    },
    {
      id: 3,
      type: 'watch',
      title: 'Wind Shear Advisory',
      location: 'Kolkata Region',
      time: new Date(Date.now() + 75 * 60000).toLocaleTimeString().slice(0, 5),
      confidence: 76,
      intensity: 35,
      icon: Wind,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-500'
    },
    {
      id: 4,
      type: 'watch',
      title: 'Convective Development',
      location: 'Bangalore Urban',
      time: new Date(Date.now() + 105 * 60000).toLocaleTimeString().slice(0, 5),
      confidence: 82,
      intensity: 41,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/30',
      borderColor: 'border-orange-500'
    }
  ];

  const getSeverityBadge = (type: string) => {
    switch (type) {
      case 'severe':
        return 'bg-red-600 text-white';
      case 'moderate':
        return 'bg-yellow-600 text-white';
      case 'watch':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Bell className="h-5 w-5 text-red-400" />
          <span>Active Alerts</span>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {activeAlerts}
          </span>
          <button className="p-1 hover:bg-slate-700 rounded transition-colors">
            <BellOff className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.slice(0, activeAlerts).map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`${alert.bgColor} rounded-lg p-3 border-l-4 ${alert.borderColor} hover:bg-opacity-50 transition-all cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`h-4 w-4 ${alert.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-white truncate">
                      {alert.title}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadge(alert.type)}`}>
                      {alert.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-2">
                    {alert.location} • ETA: {alert.time}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-300">
                      Confidence: <span className="text-green-400">{alert.confidence}%</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Intensity: <span className={alert.color}>{alert.intensity} dBZ</span>
                    </div>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="mt-2">
                    <div className="w-full bg-slate-600 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-500 ${
                          alert.confidence > 90 ? 'bg-green-400' : 
                          alert.confidence > 80 ? 'bg-yellow-400' : 'bg-orange-400'
                        }`}
                        style={{ width: `${alert.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <button className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors flex items-center justify-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>View All Alerts</span>
        </button>
        
        <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
          Configure Alert Thresholds
        </button>
      </div>

      {/* Alert Statistics */}
      <div className="mt-4 bg-slate-700 rounded-lg p-3">
        <div className="text-sm text-slate-400 mb-2">24h Alert Summary</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-red-400">12</div>
            <div className="text-xs text-slate-400">Severe</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">28</div>
            <div className="text-xs text-slate-400">Moderate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">45</div>
            <div className="text-xs text-slate-400">Watch</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;