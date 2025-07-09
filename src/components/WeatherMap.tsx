import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet';
import { MapPin, Eye, EyeOff, Layers, Target, Zap, Wind, Satellite, Camera, Download } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ForecastControls from './ForecastControls'; // Import the new component

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// UPDATED PROPS INTERFACE
interface WeatherMapProps {
  isPlaying: boolean;
  selectedLayer: string;
  forecastTime: number;
  isLoading: boolean;
  stormIntensity: number;
  uncertaintyLevel: number;
  onPlayPause: () => void;
  onForecastTimeChange: (time: number) => void;
  onLayerChange: (layer: string) => void;
}

// ... (AnimatedStorms, CloudLayer, WindVectorLayer, etc. components remain the same) ...
interface StormSystem {
  id: string;
  position: [number, number];
  intensity: number;
  type: 'thunderstorm' | 'cyclone' | 'heavy_rain';
  direction: number;
  speed: number;
  predictedPath: [number, number][];
}

interface CloudCluster {
  id: string;
  position: [number, number];
  radius: number;
  opacity: number;
  temperature: number;
  velocity: [number, number];
  type: 'cumulonimbus' | 'cumulus' | 'stratus' | 'cirrus';
}

interface WindVector {
  position: [number, number];
  direction: number;
  speed: number;
  pressure: number;
}

interface SatelliteData {
  timestamp: Date;
  channel: 'VIS' | 'IR' | 'WV' | 'SWIR';
  imageUrl: string;
  bounds: [[number, number], [number, number]];
  temperature: number;
  cloudCoverage: number;
}

const AnimatedStorms: React.FC<{ storms: StormSystem[]; isPlaying: boolean; forecastTime: number }> = ({ 
  storms, 
  isPlaying, 
  forecastTime 
}) => {
  return (
    <>
      {storms.map((storm) => {
        // Calculate predicted position based on forecast time
        const timeHours = forecastTime / 60;
        const predictedLat = storm.position[0] + (Math.sin(storm.direction * Math.PI / 180) * storm.speed * timeHours * 0.01);
        const predictedLng = storm.position[1] + (Math.cos(storm.direction * Math.PI / 180) * storm.speed * timeHours * 0.01);
        
        return (
          <div key={storm.id}>
            {/* Current storm position */}
            <Circle
              center={storm.position}
              radius={storm.intensity * 1000}
              pathOptions={{
                color: storm.type === 'thunderstorm' ? '#ef4444' : storm.type === 'cyclone' ? '#8b5cf6' : '#3b82f6',
                fillColor: storm.type === 'thunderstorm' ? '#ef4444' : storm.type === 'cyclone' ? '#8b5cf6' : '#3b82f6',
                fillOpacity: 0.4,
                weight: 3,
              }}
            />
            
            {/* Predicted storm position */}
            {forecastTime > 0 && (
              <Circle
                center={[predictedLat, predictedLng]}
                radius={storm.intensity * 800}
                pathOptions={{
                  color: storm.type === 'thunderstorm' ? '#ef4444' : storm.type === 'cyclone' ? '#8b5cf6' : '#3b82f6',
                  fillColor: storm.type === 'thunderstorm' ? '#ef4444' : storm.type === 'cyclone' ? '#8b5cf6' : '#3b82f6',
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: '10, 10',
                }}
              />
            )}
            
            {/* Storm path prediction */}
            {storm.predictedPath.map((point, index) => (
              <Circle
                key={`path-${index}`}
                center={point}
                radius={5000}
                pathOptions={{
                  color: '#fbbf24',
                  fillColor: '#fbbf24',
                  fillOpacity: 0.1 * (1 - index / storm.predictedPath.length),
                  weight: 1,
                }}
              />
            ))}
            
            <Marker position={storm.position}>
              <Popup>
                <div className="text-slate-800 min-w-48">
                  <h3 className="font-bold text-lg mb-2">{storm.type.replace('_', ' ').toUpperCase()}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Intensity:</strong> {storm.intensity.toFixed(1)} dBZ</p>
                    <p><strong>Speed:</strong> {storm.speed} km/h</p>
                    <p><strong>Direction:</strong> {storm.direction}° ({getWindDirection(storm.direction)})</p>
                    <p><strong>Predicted Movement:</strong> {(storm.speed * forecastTime / 60).toFixed(1)} km</p>
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-xs"><strong>HPIDM Confidence:</strong> 87%</p>
                    <p className="text-xs"><strong>Aurora Physics:</strong> Active</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        );
      })}
    </>
  );
};

const CloudLayer: React.FC<{ 
  clouds: CloudCluster[]; 
  selectedLayer: string; 
  forecastTime: number;
  isPlaying: boolean;
}> = ({ clouds, selectedLayer, forecastTime, isPlaying }) => {
  if (selectedLayer !== 'clouds') return null;
  
  return (
    <>
      {clouds.map((cloud) => {
        // Calculate cloud evolution based on forecast time and velocity
        const timeHours = forecastTime / 60;
        const evolvedLat = cloud.position[0] + cloud.velocity[0] * timeHours;
        const evolvedLng = cloud.position[1] + cloud.velocity[1] * timeHours;
        const evolvedRadius = cloud.radius * (1 + timeHours * 0.1); // Clouds grow over time
        const evolvedOpacity = Math.max(0.1, cloud.opacity - timeHours * 0.05); // Clouds dissipate
        
        const getCloudColor = (type: string, temp: number) => {
          switch (type) {
            case 'cumulonimbus':
              return temp < -40 ? '#1f2937' : '#374151';
            case 'cumulus':
              return '#e5e7eb';
            case 'stratus':
              return '#9ca3af';
            case 'cirrus':
              return '#f3f4f6';
            default:
              return '#d1d5db';
          }
        };
        
        return (
          <Circle
            key={cloud.id}
            center={[evolvedLat, evolvedLng]}
            radius={evolvedRadius * 1000}
            pathOptions={{
              color: getCloudColor(cloud.type, cloud.temperature),
              fillColor: getCloudColor(cloud.type, cloud.temperature),
              fillOpacity: evolvedOpacity,
              weight: 1,
            }}
          />
        );
      })}
    </>
  );
};

const WindVectorLayer: React.FC<{ 
  vectors: WindVector[]; 
  selectedLayer: string; 
  isVisible: boolean;
}> = ({ vectors, selectedLayer, isVisible }) => {
  if (selectedLayer !== 'wind' || !isVisible) return null;
  
  return (
    <>
      {vectors.map((vector, index) => {
        const intensity = Math.min(vector.speed / 50, 1);
        const color = intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#3b82f6';
        
        return (
          <Marker
            key={index}
            position={vector.position}
            icon={L.divIcon({
              html: `
                <div style="
                  transform: rotate(${vector.direction}deg); 
                  color: ${color}; 
                  font-size: ${12 + intensity * 8}px;
                  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                ">→</div>
              `,
              className: 'wind-vector',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          />
        );
      })}
    </>
  );
};

const SatelliteImageOverlay: React.FC<{ 
  satelliteData: SatelliteData[]; 
  selectedLayer: string; 
  currentTime: number;
}> = ({ satelliteData, selectedLayer, currentTime }) => {
  const currentData = satelliteData.find(data => data.channel === selectedLayer.toUpperCase());
  
  if (!currentData) return null;
  
  return (
    <ImageOverlay
      url={currentData.imageUrl}
      bounds={currentData.bounds}
      opacity={0.7}
    />
  );
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
};


// UPDATED COMPONENT SIGNATURE
const WeatherMap: React.FC<WeatherMapProps> = ({ 
  isPlaying, 
  selectedLayer, 
  forecastTime, 
  isLoading, 
  stormIntensity,
  uncertaintyLevel,
  onPlayPause,
  onForecastTimeChange,
  onLayerChange
}) => {
  const [storms, setStorms] = useState<StormSystem[]>([
    {
      id: 'storm1',
      position: [28.6139, 77.2090], // Delhi
      intensity: 65,
      type: 'thunderstorm',
      direction: 45,
      speed: 25,
      predictedPath: [
        [28.7, 77.3],
        [28.8, 77.4],
        [28.9, 77.5]
      ]
    },
    {
      id: 'storm2',
      position: [19.0760, 72.8777], // Mumbai
      intensity: 45,
      type: 'heavy_rain',
      direction: 180,
      speed: 15,
      predictedPath: [
        [18.9, 72.9],
        [18.8, 73.0],
        [18.7, 73.1]
      ]
    },
    {
      id: 'storm3',
      position: [22.5726, 88.3639], // Kolkata
      intensity: 55,
      type: 'thunderstorm',
      direction: 90,
      speed: 30,
      predictedPath: [
        [22.6, 88.5],
        [22.7, 88.7],
        [22.8, 88.9]
      ]
    }
  ]);

  const [clouds, setClouds] = useState<CloudCluster[]>([
    { 
      id: 'cloud1', 
      position: [26.8467, 80.9462], 
      radius: 50, 
      opacity: 0.6, 
      temperature: -15,
      velocity: [0.02, 0.01],
      type: 'cumulonimbus'
    },
    { 
      id: 'cloud2', 
      position: [23.2599, 77.4126], 
      radius: 75, 
      opacity: 0.4, 
      temperature: -5,
      velocity: [-0.01, 0.02],
      type: 'cumulus'
    },
    { 
      id: 'cloud3', 
      position: [20.5937, 78.9629], 
      radius: 60, 
      opacity: 0.5, 
      temperature: -25,
      velocity: [0.015, -0.01],
      type: 'stratus'
    },
    { 
      id: 'cloud4', 
      position: [25.3176, 82.9739], 
      radius: 40, 
      opacity: 0.7, 
      temperature: -10,
      velocity: [0.01, 0.015],
      type: 'cirrus'
    }
  ]);

  const [windVectors, setWindVectors] = useState<WindVector[]>([]);
  const [showWindVectors, setShowWindVectors] = useState(true);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);

  // Generate Aurora wind field data
  useEffect(() => {
    const vectors: WindVector[] = [];
    for (let lat = 18; lat <= 32; lat += 1.5) {
      for (let lng = 68; lng <= 88; lng += 1.5) {
        const baseSpeed = 15 + Math.random() * 25;
        const baseDirection = Math.random() * 360;
        const pressure = 1000 + Math.random() * 50;
        
        vectors.push({
          position: [lat, lng] as [number, number],
          direction: baseDirection,
          speed: baseSpeed,
          pressure: pressure
        });
      }
    }
    setWindVectors(vectors);
  }, []);

  // Generate INSAT satellite imagery data
  useEffect(() => {
    const mockSatelliteData: SatelliteData[] = [
      {
        timestamp: new Date(),
        channel: 'VIS',
        imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
        bounds: [[15, 65], [35, 90]],
        temperature: 25,
        cloudCoverage: 65
      },
      {
        timestamp: new Date(),
        channel: 'IR',
        imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
        bounds: [[15, 65], [35, 90]],
        temperature: -45,
        cloudCoverage: 70
      },
      {
        timestamp: new Date(),
        channel: 'WV',
        imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
        bounds: [[15, 65], [35, 90]],
        temperature: -20,
        cloudCoverage: 55
      }
    ];
    setSatelliteData(mockSatelliteData);
  }, []);

  // Animate storms and clouds with physics
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setStorms(prev => prev.map(storm => {
          // Aurora physics influence on storm movement
          const nearbyWind = windVectors.find(v => 
            Math.abs(v.position[0] - storm.position[0]) < 1 && 
            Math.abs(v.position[1] - storm.position[1]) < 1
          );
          
          const windInfluence = nearbyWind ? nearbyWind.direction : storm.direction;
          const newDirection = storm.direction + (windInfluence - storm.direction) * 0.1;
          
          return {
            ...storm,
            position: [
              storm.position[0] + (Math.sin(newDirection * Math.PI / 180) * 0.005),
              storm.position[1] + (Math.cos(newDirection * Math.PI / 180) * 0.005)
            ] as [number, number],
            intensity: Math.max(20, storm.intensity + (Math.random() - 0.5) * 3),
            direction: newDirection,
            speed: Math.max(5, storm.speed + (Math.random() - 0.5) * 2)
          };
        }));

        setClouds(prev => prev.map(cloud => ({
          ...cloud,
          position: [
            cloud.position[0] + cloud.velocity[0],
            cloud.position[1] + cloud.velocity[1]
          ] as [number, number],
          opacity: Math.max(0.2, Math.min(0.8, cloud.opacity + (Math.random() - 0.5) * 0.05)),
          temperature: cloud.temperature + (Math.random() - 0.5) * 1,
          radius: Math.max(20, cloud.radius + (Math.random() - 0.5) * 2)
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, windVectors]);


  return (
    <div className="flex-1 relative bg-slate-900 overflow-hidden" style={{maxHeight:'90vh'}}>
      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <Satellite className="absolute inset-0 m-auto h-6 w-6 text-blue-400 animate-pulse" />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">Processing INSAT-3DR Data</div>
              <div className="text-sm text-slate-300 mb-1">Integrating multi-spectral channels...</div>
              <div className="text-xs text-slate-400">Aurora wind fields • TimeGEN-1 trends • HPIDM diffusion</div>
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={[23.5937, 78.9629]} // Center of India
        zoom={5}
        style={{ height: '100vh', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* INSAT Satellite Imagery Overlay */}
        <SatelliteImageOverlay 
          satelliteData={satelliteData}
          selectedLayer={selectedLayer}
          currentTime={forecastTime}
        />

        {/* Storm Systems with HPIDM Predictions */}
        <AnimatedStorms storms={storms} isPlaying={isPlaying} forecastTime={forecastTime} />
        
        {/* Enhanced Cloud Layer with Physics */}
        <CloudLayer 
          clouds={clouds} 
          selectedLayer={selectedLayer} 
          forecastTime={forecastTime}
          isPlaying={isPlaying}
        />

        {/* Aurora Wind Field Vectors */}
        <WindVectorLayer 
          vectors={windVectors}
          selectedLayer={selectedLayer}
          isVisible={showWindVectors}
        />

        {/* Enhanced City Markers */}
        <Marker position={[28.6139, 77.2090]}>
          <Popup>
            <div className="text-slate-800 min-w-64">
              <h3 className="font-bold text-lg mb-2">New Delhi</h3>
              <div className="space-y-2">
                <div className="bg-transparent" style={{display:'flex',justifyContent:'center'}}>
                  <img style={{width:'250px',borderRadius:'20px'}} src="https://www.ihrc.fiu.edu/wp-content/uploads/2022/10/IAN_6_600x400-120x120.png" alt="" />
                </div>
                <div className="text-sm space-y-1">
                  <p className='p-0 m-0'><strong>Current:</strong> 68 dBZ reflectivity</p>
                  <p><strong>Forecast (+2h):</strong> Heavy rain, 45mm/hr</p>
                  <p><strong>Wind:</strong> 35 km/h SW (Aurora)</p>
                  <p><strong>Temperature:</strong> -52°C cloud top</p>
                                    <p><strong>INSAT-3DR:</strong> IR channel active</p>
                  <p><strong>TimeGEN-1:</strong> Cooling trend detected</p>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
        
        <Marker position={[19.0760, 72.8777]}>
          <Popup>
            <div className="text-slate-800 min-w-64">
              <h3 className="font-bold text-lg mb-2">Mumbai</h3>
              <div className="space-y-2">
                <div className="bg-yellow-100 p-2 rounded">
                  <p className="text-sm font-semibold text-yellow-800">🌧️ Moderate Rain Expected</p>
                  <p className="text-xs text-yellow-600">HPIDM Confidence: 87%</p>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Current:</strong> 45 dBZ reflectivity</p>
                  <p><strong>Forecast (+1h):</strong> Light rain clearing</p>
                  <p><strong>Wind:</strong> 15 km/h W (Aurora)</p>
                  <p><strong>Temperature:</strong> -28°C cloud top</p>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
        
        <Marker position={[22.5726, 88.3639]}>
          <Popup>
            <div className="text-slate-800 min-w-64">
              <h3 className="font-bold text-lg mb-2">Kolkata</h3>
              <div className="space-y-2">
                <div className="bg-red-100 p-2 rounded">
                  <p className="text-sm font-semibold text-red-800">⚡ Severe Thunderstorm</p>
                  <p className="text-xs text-red-600">HPIDM Confidence: 91%</p>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Current:</strong> 72 dBZ reflectivity</p>
                  <p><strong>Forecast (+3h):</strong> Storm intensifying</p>
                  <p><strong>Wind:</strong> 42 km/h E (Aurora)</p>
                  <p><strong>Temperature:</strong> -58°C cloud top</p>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>


      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <button 
          onClick={() => setShowWindVectors(!showWindVectors)}
          className={`p-2 rounded shadow-lg transition-colors backdrop-blur-sm ${
            showWindVectors ? 'bg-blue-600 text-white' : 'bg-slate-800/90 hover:bg-slate-700 text-white'
          }`}
        >
          <Wind className="h-4 w-4" />
        </button>
        <button className="p-2 bg-slate-800/90 hover:bg-slate-700 rounded shadow-lg transition-colors backdrop-blur-sm">
          <Layers className="h-4 w-4 text-white" />
        </button>
        <button className="p-2 bg-slate-800/90 hover:bg-slate-700 rounded shadow-lg transition-colors backdrop-blur-sm">
          <Target className="h-4 w-4 text-white" />
        </button>
        <button className="p-2 bg-slate-800/90 hover:bg-slate-700 rounded shadow-lg transition-colors backdrop-blur-sm">
          <Download className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* INSAT Satellite Status */}
      <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 z-20 min-w-72">
        <div className="flex items-center space-x-2 mb-3">
          <Satellite className="h-5 w-5 text-blue-400" />
          <span className="text-white font-semibold">INSAT-3DR Live Feed</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">VIS Channel (0.65 μm)</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">IR Channel (10.8 μm)</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">WV Channel (6.7 μm)</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Active</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="text-xs text-slate-400 mb-1">Last Update: {new Date().toLocaleTimeString()}</div>
          <div className="text-xs text-slate-400">Resolution: 4km • Temporal: 30min</div>
        </div>
      </div>

      {/* HPIDM Diffusion Process Indicator */}
      <div className="absolute bottom-40 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 z-20">
        <div className="text-sm text-slate-400 mb-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span>HPIDM Diffusion Process</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white">Denoising Step</span>
            <span className="text-xs text-purple-400">{Math.floor((forecastTime / 180) * 1000)}/1000</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${(forecastTime / 180) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-400">
            Forecast Time: +{Math.floor(forecastTime / 60)}h {forecastTime % 60}m
          </div>
        </div>
      </div>

      {/* Multi-Model Integration Status */}
      <div className="absolute bottom-40 right-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 z-20">
        <div className="text-xs text-slate-400 mb-2">AI Model Fusion</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white">HPIDM Core</span>
            <span className="text-xs text-green-400 ml-auto">94%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white">Aurora Physics</span>
            <span className="text-xs text-green-400 ml-auto">89%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white">TimeGEN-1</span>
            <span className="text-xs text-green-400 ml-auto">92%</span>
          </div>
        </div>
      </div>

      {/* Storm Intensity with Uncertainty Cone */}
      <div className="absolute top-60 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 z-20">
        <div className="text-xs text-slate-400 mb-1">Peak Storm Intensity</div>
        <div className="flex items-center space-x-2 mb-2">
          <Zap className={`h-4 w-4 ${stormIntensity > 60 ? 'text-red-400' : stormIntensity > 40 ? 'text-yellow-400' : 'text-green-400'}`} />
          <span className="text-lg font-bold text-white">{stormIntensity.toFixed(1)} dBZ</span>
        </div>
        <div className="text-xs text-slate-400 mb-2">Uncertainty: ±{uncertaintyLevel.toFixed(1)}%</div>
        <div className="w-full bg-slate-600 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-red-400 h-1 rounded-full"
            style={{ width: `${Math.min(uncertaintyLevel * 2, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Scale Bar */}
      <div className="absolute bottom-20 mb-3 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 z-20">
        <div className="flex items-center space-x-2 text-white text-xs">
          <div className="w-16 h-1 bg-white"></div>
          <span>200 km</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Projection: Geographic (WGS84)
        </div>
      </div>
      
      {/* ADD FORECAST CONTROLS AS A FLOATING ELEMENT */}
      <div className="absolute bottom-4 right-0 z-20 w-full px-4">
        <ForecastControls
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          forecastTime={forecastTime}
          onForecastTimeChange={onForecastTimeChange}
          selectedLayer={selectedLayer}
          onLayerChange={onLayerChange}
        />
      </div>
    </div>
  );
};

export default WeatherMap;