import React from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProbabilisticForecastProps {
  forecastTime: number;
  uncertaintyLevel: number;
}

const ProbabilisticForecast: React.FC<ProbabilisticForecastProps> = ({ 
  forecastTime, 
  uncertaintyLevel 
}) => {
  const getConfidenceLevel = (time: number) => {
    if (time <= 60) return { level: 'High', color: 'text-green-400', percentage: 95 - time * 0.3 };
    if (time <= 120) return { level: 'Medium', color: 'text-yellow-400', percentage: 85 - (time - 60) * 0.4 };
    return { level: 'Low', color: 'text-orange-400', percentage: 70 - (time - 120) * 0.3 };
  };

  const confidence = getConfidenceLevel(forecastTime);

  const probabilityScenarios = [
    {
      scenario: 'Most Likely',
      probability: 65,
      description: 'Thunderstorm develops over Delhi NCR',
      color: 'bg-blue-600'
    },
    {
      scenario: 'Alternative',
      probability: 25,
      description: 'Storm weakens, light rain only',
      color: 'bg-green-600'
    },
    {
      scenario: 'Severe',
      probability: 10,
      description: 'Intensifies to severe thunderstorm',
      color: 'bg-red-600'
    }
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Target className="h-5 w-5 text-purple-400" />
        <span>Probabilistic Forecast</span>
      </h3>

      {/* Confidence Indicator */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Forecast Confidence</span>
          <span className={`text-sm font-medium ${confidence.color}`}>
            {confidence.level}
          </span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              confidence.level === 'High' ? 'bg-green-400' : 
              confidence.level === 'Medium' ? 'bg-yellow-400' : 'bg-orange-400'
            }`}
            style={{ width: `${confidence.percentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-400">
          {confidence.percentage.toFixed(1)}% • Uncertainty: ±{uncertaintyLevel.toFixed(1)}%
        </div>
      </div>

      {/* Probability Scenarios */}
      <div className="space-y-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">Scenario Probabilities</div>
        {probabilityScenarios.map((scenario, index) => (
          <div key={index} className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{scenario.scenario}</span>
              <span className="text-sm text-slate-300">{scenario.probability}%</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-1.5 mb-2">
              <div 
                className={`h-1.5 rounded-full ${scenario.color}`}
                style={{ width: `${scenario.probability}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-400">{scenario.description}</div>
          </div>
        ))}
      </div>

      {/* Uncertainty Cone Visualization */}
      <div className="bg-slate-700 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">Uncertainty Cone</span>
        </div>
        <div className="text-xs text-slate-400 mb-2">
          Storm path prediction envelope
        </div>
        <div className="relative h-8 bg-slate-600 rounded overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400/30 to-red-400/30 transition-all duration-1000"
            style={{ width: `${Math.min(uncertaintyLevel * 2, 100)}%` }}
          ></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-x-1/2"></div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Current</span>
          <span>+{Math.floor(forecastTime / 60)}h</span>
        </div>
      </div>
    </div>
  );
};

export default ProbabilisticForecast;