import React, { useState, useEffect } from 'react';
import { Wind, Activity, TrendingUp, Gauge, Navigation, Compass } from 'lucide-react';

interface AuroraIntegrationProps {
  forecastTime: number;
  stormIntensity: number;
}

interface WindField {
  level: string;
  speed: number;
  direction: number;
  pressure: number;
  temperature: number;
  humidity: number;
}

interface AtmosphericProfile {
  altitude: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
  pressure: number;
}

const AuroraIntegration: React.FC<AuroraIntegrationProps> = ({ 
  forecastTime, 
  stormIntensity 
}) => {
  const [windFields, setWindFields] = useState<WindField[]>([
    {
      level: '850 hPa',
      speed: 25 + Math.random() * 15,
      direction: 245,
      pressure: 850,
      temperature: 15,
      humidity: 75
    },
    {
      level: '700 hPa',
      speed: 35 + Math.random() * 20,
      direction: 250,
      pressure: 700,
      temperature: 5,
      humidity: 65
    },
    {
      level: '500 hPa',
      speed: 45 + Math.random() * 25,
      direction: 260,
      pressure: 500,
      temperature: -15,
      humidity: 45
    },
    {
      level: '300 hPa',
      speed: 65 + Math.random() * 30,
      direction: 270,
      pressure: 300,
      temperature: -45,
      humidity: 25
    }
  ]);

  const [atmosphericProfile, setAtmosphericProfile] = useState<AtmosphericProfile[]>([]);
  const [windShear, setWindShear] = useState(18);
  const [convergence, setConvergence] = useState(-2.1);
  const [vorticity, setVorticity] = useState(1.5);

  // Generate atmospheric profile
  useEffect(() => {
    const profile: AtmosphericProfile[] = [];
    for (let alt = 0; alt <= 15; alt += 1) {
      profile.push({
        altitude: alt,
        windSpeed: 10 + alt * 3 + Math.random() * 10,
        windDirection: 200 + alt * 5 + Math.random() * 20,
        temperature: 25 - alt * 6.5,
        pressure: 1013 * Math.exp(-alt / 8.4)
      });
    }
    setAtmosphericProfile(profile);
  }, []);

  // Simulate Aurora model updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWindFields(prev => prev.map(field => ({
        ...field,
        speed: Math.max(5, field.speed + (Math.random() - 0.5) * 5),
        direction: (field.direction + (Math.random() - 0.5) * 10) % 360,
        temperature: field.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, field.humidity + (Math.random() - 0.5) * 5))
      })));

      setWindShear(prev => Math.max(0, prev + (Math.random() - 0.5) * 2));
      setConvergence(prev => prev + (Math.random() - 0.5) * 0.5);
      setVorticity(prev => prev + (Math.random() - 0.5) * 0.3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getWindSpeedColor = (speed: number) => {
    if (speed > 60) return 'text-red-400';
    if (speed > 40) return 'text-yellow-400';
    if (speed > 20) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Wind className="h-5 w-5 text-blue-400" />
          <span>Aurora Physics Engine</span>
        </h3>
        <div className="flex items-center space-x-1">
          <Activity className="h-4 w-4 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Active</span>
        </div>
      </div>

      {/* Wind Field Levels */}
      <div className="space-y-3 mb-4">
        <div className="text-sm text-slate-400 mb-2">Atmospheric Levels</div>
        {windFields.map((field, index) => (
          <div key={index} className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">{field.level}</span>
              <div className="flex items-center space-x-2">
                <Compass className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-slate-400">
                  {getWindDirection(field.direction)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-400">Wind Speed</div>
                <div className={`font-medium ${getWindSpeedColor(field.speed)}`}>
                  {field.speed.toFixed(1)} km/h
                </div>
              </div>
              <div>
                <div className="text-slate-400">Direction</div>
                <div className="text-white font-medium">
                  {field.direction.toFixed(0)}°
                </div>
              </div>
              <div>
                <div className="text-slate-400">Temperature</div>
                <div className="text-cyan-400 font-medium">
                  {field.temperature.toFixed(1)}°C
                </div>
              </div>
              <div>
                <div className="text-slate-400">Humidity</div>
                <div className="text-green-400 font-medium">
                  {field.humidity.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Wind Speed Visualization */}
            <div className="mt-2">
              <div className="w-full bg-slate-600 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-1000 ${
                    field.speed > 60 ? 'bg-red-400' : 
                    field.speed > 40 ? 'bg-yellow-400' : 
                    field.speed > 20 ? 'bg-green-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(field.speed / 80 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Derived Parameters */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-3">Derived Parameters</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white">Wind Shear (0-6km)</span>
            </div>
            <span className="text-sm font-medium text-yellow-400">
              {windShear.toFixed(1)} m/s
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white">Convergence</span>
            </div>
            <span className="text-sm font-medium text-blue-400">
              {convergence.toFixed(1)}×10⁻⁴ s⁻¹
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-green-400" />
              <span className="text-sm text-white">Vorticity</span>
            </div>
            <span className="text-sm font-medium text-green-400">
              {vorticity.toFixed(1)}×10⁻⁵ s⁻¹
            </span>
          </div>
        </div>
      </div>

      {/* Atmospheric Profile Chart */}
      <div className="bg-slate-700 rounded-lg p-3 mb-4">
        <div className="text-sm text-slate-400 mb-3">Vertical Wind Profile</div>
        <div className="relative h-32 bg-slate-600 rounded overflow-hidden">
          {atmosphericProfile.slice(0, 10).map((level, index) => (
            <div
              key={index}
              className="absolute bg-blue-400/30 border-l-2 border-blue-400"
              style={{
                bottom: `${(level.altitude / 15) * 100}%`,
                left: '10px',
                width: `${(level.windSpeed / 80) * 80}%`,
                height: '2px'
              }}
            />
          ))}
          <div className="absolute bottom-0 left-0 text-xs text-slate-400 p-1">0km</div>
          <div className="absolute top-0 left-0 text-xs text-slate-400 p-1">15km</div>
          <div className="absolute bottom-0 right-0 text-xs text-slate-400 p-1">80 km/h</div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-lg p-3 border border-blue-700/30">
        <div className="text-sm text-slate-400 mb-2">Aurora Model Performance</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Forecast Skill</span>
            <span className="text-xs text-green-400">89.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Physics Consistency</span>
            <span className="text-xs text-green-400">96.7%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Computational Load</span>
            <span className="text-xs text-yellow-400">Medium</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Last Update</span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleTimeString().slice(0, 5)}
            </span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="text-xs text-slate-400 mb-1">Integration with HPIDM</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Wind field conditioning active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuroraIntegration;