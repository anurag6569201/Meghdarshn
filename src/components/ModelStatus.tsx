import React from 'react';
import { Brain, Wind, TrendingUp, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface ModelStatusProps {
  modelStatus: {
    hpidm: { status: string; lastRun: string; accuracy: number };
    aurora: { status: string; lastRun: string; accuracy: number };
    timegen: { status: string; lastRun: string; accuracy: number };
  };
}

const ModelStatus: React.FC<ModelStatusProps> = ({ modelStatus }) => {
  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle className="h-3 w-3 text-green-400" />
    ) : (
      <AlertCircle className="h-3 w-3 text-red-400" />
    );
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Brain className="h-5 w-5 text-blue-400" />
        <span>AI Model Fusion</span>
      </h3>

      <div className="space-y-3">
        {/* HPIDM Core Model */}
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-white">HPIDM Core</span>
            </div>
            {getStatusIcon(modelStatus.hpidm.status)}
          </div>
          <div className="text-xs text-slate-400 mb-1">
            Diffusion Model • Physics-Informed
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Last run: {modelStatus.hpidm.lastRun}
            </span>
            <span className={`text-xs font-medium ${getAccuracyColor(modelStatus.hpidm.accuracy)}`}>
              {modelStatus.hpidm.accuracy.toFixed(1)}% SSIM
            </span>
          </div>
        </div>

        {/* Aurora Wind Model */}
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Aurora Physics</span>
            </div>
            {getStatusIcon(modelStatus.aurora.status)}
          </div>
          <div className="text-xs text-slate-400 mb-1">
            Microsoft Foundation Model • Wind Fields
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Last run: {modelStatus.aurora.lastRun}
            </span>
            <span className={`text-xs font-medium ${getAccuracyColor(modelStatus.aurora.accuracy)}`}>
              {modelStatus.aurora.accuracy.toFixed(1)}% MAE
            </span>
          </div>
        </div>

        {/* TimeGEN-1 Trends */}
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">TimeGEN-1</span>
            </div>
            {getStatusIcon(modelStatus.timegen.status)}
          </div>
          <div className="text-xs text-slate-400 mb-1">
            Nixtla Foundation Model • Trend Analysis
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Last run: {modelStatus.timegen.lastRun}
            </span>
            <span className={`text-xs font-medium ${getAccuracyColor(modelStatus.timegen.accuracy)}`}>
              {modelStatus.timegen.accuracy.toFixed(1)}% R²
            </span>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 border border-blue-700/30">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Model Fusion Status</span>
        </div>
        <div className="text-xs text-slate-300 mb-2">
          Cross-attention conditioning active
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Ensemble Confidence</span>
          <span className="text-xs font-medium text-green-400">
            {((modelStatus.hpidm.accuracy + modelStatus.aurora.accuracy + modelStatus.timegen.accuracy) / 3).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModelStatus;