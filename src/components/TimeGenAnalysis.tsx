import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity, Clock, Target, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TimeGenAnalysisProps {
  forecastTime: number;
  uncertaintyLevel: number;
}

interface TrendData {
  time: string;
  cloudCoverage: number;
  temperature: number;
  humidity: number;
  pressure: number;
  predicted: number;
  confidence: number;
}

interface MeteorologicalTrend {
  parameter: string;
  current: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  forecast: number;
  confidence: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
}

const TimeGenAnalysis: React.FC<TimeGenAnalysisProps> = ({ 
  forecastTime, 
  uncertaintyLevel 
}) => {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [meteorologicalTrends, setMeteorologicalTrends] = useState<MeteorologicalTrend[]>([
    {
      parameter: 'Cloud Coverage',
      current: 65,
      trend: 'increasing',
      forecast: 78,
      confidence: 87,
      unit: '%',
      icon: Activity,
      color: 'text-gray-400'
    },
    {
      parameter: 'Cloud Top Temperature',
      current: -45,
      trend: 'decreasing',
      forecast: -52,
      confidence: 92,
      unit: '°C',
      icon: TrendingUp,
      color: 'text-blue-400'
    },
    {
      parameter: 'Precipitation Rate',
      current: 12,
      trend: 'increasing',
      forecast: 28,
      confidence: 84,
      unit: 'mm/h',
      icon: BarChart3,
      color: 'text-green-400'
    },
    {
      parameter: 'Storm Intensity',
      current: 68,
      trend: 'stable',
      forecast: 71,
      confidence: 89,
      unit: 'dBZ',
      icon: Target,
      color: 'text-red-400'
    }
  ]);

  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 91.5,
    mape: 8.2,
    rmse: 2.4,
    r2: 0.89
  });

  // Generate trend data
  useEffect(() => {
    const data: TrendData[] = [];
    const now = new Date();
    
    for (let i = -6; i <= 6; i++) {
      const time = new Date(now.getTime() + i * 30 * 60000);
      const baseTemp = -45 + Math.sin(i * 0.5) * 10;
      const baseCoverage = 65 + Math.cos(i * 0.3) * 15;
      
      data.push({
        time: time.toLocaleTimeString().slice(0, 5),
        cloudCoverage: Math.max(0, Math.min(100, baseCoverage + Math.random() * 10)),
        temperature: baseTemp + Math.random() * 5,
        humidity: 70 + Math.sin(i * 0.4) * 20 + Math.random() * 5,
        pressure: 1013 + Math.cos(i * 0.2) * 15 + Math.random() * 3,
        predicted: i > 0 ? baseCoverage + Math.random() * 8 : baseCoverage,
        confidence: i > 0 ? Math.max(60, 95 - Math.abs(i) * 5) : 100
      });
    }
    
    setTrendData(data);
  }, [forecastTime]);

  // Update trends based on forecast time
  useEffect(() => {
    setMeteorologicalTrends(prev => prev.map(trend => ({
      ...trend,
      confidence: Math.max(60, trend.confidence - forecastTime * 0.1),
      forecast: trend.current + (trend.forecast - trend.current) * (forecastTime / 180)
    })));
  }, [forecastTime]);

  // Simulate model performance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setModelMetrics(prev => ({
        accuracy: Math.max(85, Math.min(95, prev.accuracy + (Math.random() - 0.5) * 2)),
        mape: Math.max(5, Math.min(15, prev.mape + (Math.random() - 0.5) * 1)),
        rmse: Math.max(1, Math.min(5, prev.rmse + (Math.random() - 0.5) * 0.5)),
        r2: Math.max(0.8, Math.min(0.95, prev.r2 + (Math.random() - 0.5) * 0.02))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '↗️';
      case 'decreasing':
        return '↘️';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-400';
      case 'decreasing':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Brain className="h-5 w-5 text-green-400" />
          <span>TimeGEN-1 Analysis</span>
        </h3>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Forecasting</span>
        </div>
      </div>

      {/* Meteorological Trends */}
      <div className="space-y-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">High-Level Trends</div>
        {meteorologicalTrends.map((trend, index) => {
          const Icon = trend.icon;
          return (
            <div key={index} className="bg-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-4 w-4 ${trend.color}`} />
                  <span className="text-sm font-medium text-white">{trend.parameter}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs">{getTrendIcon(trend.trend)}</span>
                  <span className={`text-xs ${getTrendColor(trend.trend)}`}>
                    {trend.trend}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-slate-400">Current</div>
                  <div className="text-white font-medium">
                    {trend.current.toFixed(1)} {trend.unit}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Forecast</div>
                  <div className={`font-medium ${trend.color}`}>
                    {trend.forecast.toFixed(1)} {trend.unit}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Confidence</div>
                  <div className="text-green-400 font-medium">
                    {trend.confidence.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Trend Visualization */}
              <div className="mt-2">
                <div className="w-full bg-slate-600 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      trend.confidence > 85 ? 'bg-green-400' : 
                      trend.confidence > 70 ? 'bg-yellow-400' : 'bg-orange-400'
                    }`}
                    style={{ width: `${trend.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Chart */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-3">Cloud Coverage Trend</div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="cloudCoverage"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>Historical</span>
          <span>Current</span>
          <span>Forecast</span>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-3">Model Performance</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {modelMetrics.accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {modelMetrics.mape.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">MAPE</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {modelMetrics.rmse.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">RMSE</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {modelMetrics.r2.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400">R²</div>
          </div>
        </div>
      </div>

      {/* Forecast Horizon */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">Forecast Horizon</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">0-1 hour</span>
            <span className="text-xs text-green-400">High Confidence</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">1-2 hours</span>
            <span className="text-xs text-yellow-400">Medium Confidence</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">2-3 hours</span>
            <span className="text-xs text-orange-400">Lower Confidence</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-slate-400 mb-1">
            Current Horizon: +{Math.floor(forecastTime / 60)}h {forecastTime % 60}m
          </div>
          <div className="w-full bg-slate-600 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-1000 ${
                forecastTime <= 60 ? 'bg-green-400' : 
                forecastTime <= 120 ? 'bg-yellow-400' : 'bg-orange-400'
              }`}
              style={{ width: `${Math.min((forecastTime / 180) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-3 border border-green-700/30">
        <div className="text-sm text-slate-400 mb-2">HPIDM Integration</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Trend Conditioning</span>
            <span className="text-xs text-green-400">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Context Injection</span>
            <span className="text-xs text-green-400">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Uncertainty Propagation</span>
            <span className="text-xs text-blue-400">±{uncertaintyLevel.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Providing global context to diffusion model</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeGenAnalysis;