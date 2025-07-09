import React from 'react';
import { Satellite, RefreshCw, Download, Settings } from 'lucide-react';

interface HeaderProps {
  currentTime: Date;
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTime, isLoading, onRefresh, onExport }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Satellite className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">MeghDarshn</h1>
            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">HPIDM v2.1</span>
          </div>
          
          <div className="text-sm text-slate-300">
            Last Updated: {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Export</span>
          </button>
          
          <button className="p-2 hover:bg-slate-700 rounded transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;