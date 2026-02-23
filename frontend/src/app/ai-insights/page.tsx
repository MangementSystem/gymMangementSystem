'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  ScanLine,
  Zap,
  Award,
  Calendar,
} from 'lucide-react';
import { useGetAiInsightsQuery } from '@/lib/api/aiApi';
import { useGetExerciseAnalysesQuery } from '@/lib/api/aiApi';

export default function AiInsightsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: insights, isLoading: insightsLoading } = useGetAiInsightsQuery({});
  const { data: analyses, isLoading: analysesLoading } = useGetExerciseAnalysesQuery({});

  const categories = [
    { value: 'all', label: 'All Insights', icon: Brain },
    { value: 'performance', label: 'Performance', icon: TrendingUp },
    { value: 'risk', label: 'Risk Alerts', icon: AlertTriangle },
    { value: 'goals', label: 'Goals', icon: Target },
  ];

  const aiStats = [
    {
      label: 'Total Insights',
      value: insights?.length || 0,
      gradient: 'from-yellow-400 to-orange-500',
      icon: Brain,
    },
    {
      label: 'Analyses Done',
      value: analyses?.length || 0,
      gradient: 'from-orange-500 to-red-500',
      icon: ScanLine,
    },
    {
      label: 'Risk Alerts',
      value: insights?.filter((i) => i.risk_alert)?.length || 0,
      gradient: 'from-red-500 to-orange-400',
      icon: AlertTriangle,
    },
    {
      label: 'Accuracy Rate',
      value: '94%',
      gradient: 'from-yellow-500 to-red-500',
      icon: Award,
    },
  ];

  const filteredInsights = insights?.filter(
    (insight) => selectedCategory === 'all' || insight.category === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
            <Brain className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            AI Insights
          </h1>
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black rounded-full animate-pulse">
            BETA
          </span>
        </div>
        <p className="text-gray-400 font-bold">AI-powered analytics and recommendations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {aiStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-black/70 text-sm font-black">{stat.label}</p>
                <Icon className="w-5 h-5 text-black/70" />
              </div>
              <p className="text-4xl font-black text-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.value;
          return (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-black transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-yellow-400 border border-yellow-500/20'
              }`}
            >
              <Icon className="w-5 h-5" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Recent Insights
          </h2>

          {insightsLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            filteredInsights?.map((insight) => (
              <div
                key={insight.id}
                className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-black text-white capitalize">{insight.category}</h3>
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(insight.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {insight.risk_alert && (
                    <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      ALERT
                    </span>
                  )}
                </div>

                <p className="text-gray-300 font-bold mb-4">{insight.ai_recommendation}</p>

                {insight.predicted_goal_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span>
                      Predicted completion:{' '}
                      {new Date(insight.predicted_goal_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {insight.risk_alert && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-red-400 font-bold bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <span>{insight.risk_alert}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Exercise Analysis Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-orange-400" />
            Exercise Analysis
          </h2>

          {analysesLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            analyses?.slice(0, 5).map((analysis) => (
              <div
                key={analysis.id}
                className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-orange-500/20 rounded-xl p-6 hover:border-orange-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-white">Form Analysis</h3>
                  <span
                    className={`px-3 py-1 text-xs font-black rounded-full ${
                      analysis.risk_level === 'low'
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : analysis.risk_level === 'medium'
                          ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                          : 'bg-red-500/20 border border-red-500/50 text-red-400'
                    }`}
                  >
                    {analysis.risk_level?.toUpperCase() || 'N/A'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-yellow-400">
                      {analysis.posture_score || 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Posture</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-orange-400">
                      {analysis.stability_score || 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Stability</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-red-400">
                      {analysis.movement_efficiency || 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Efficiency</p>
                  </div>
                </div>

                {analysis.recommended_fix && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-sm text-blue-400 font-bold flex items-start gap-2">
                      <Zap className="w-4 h-4 mt-0.5" />
                      {analysis.recommended_fix}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}

          {/* AI Recommendation Card */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-black text-white">AI Recommendation</h3>
            </div>
            <p className="text-gray-300 font-bold mb-4">
              Based on recent activity patterns, we recommend adding more cardio sessions on Tuesday
              and Thursday evenings when gym capacity is lower.
            </p>
            <button
              onClick={() => router.push('/ai/exercise-analysis')}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-3 rounded-lg hover:scale-105 transform transition-all"
            >
              View Full Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
