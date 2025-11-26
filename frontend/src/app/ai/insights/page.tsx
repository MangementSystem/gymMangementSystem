"use client";
import { useState } from 'react';
import { Sparkles, Target, TrendingUp, AlertTriangle, Calendar, User, Zap, Brain } from 'lucide-react';
import { useGetAiInsightsQuery, useGenerateInsightMutation } from '@/lib/api/aiApi';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';

export default function MemberInsightsPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: members } = useGetMembersQuery({ organizationId: currentOrganization || undefined });
  const { data: insights, isLoading } = useGetAiInsightsQuery(
    { memberId: selectedMemberId || undefined },
    { skip: !selectedMemberId }
  );
  const [generateInsight, { isLoading: isGenerating }] = useGenerateInsightMutation();

  const categories = ['all', 'performance', 'nutrition', 'recovery', 'goals'];

  const filteredInsights = insights?.filter(insight => 
    selectedCategory === 'all' || insight.category === selectedCategory
  );

  const handleGenerateInsight = async () => {
    if (!selectedMemberId) {
      dispatch(addNotification({ type: 'error', message: 'Please select a member first' }));
      return;
    }
    try {
      await generateInsight({
        memberId: selectedMemberId,
        category: 'performance',
        inputData: {}
      }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Insight generated successfully' }));
    } catch {
      dispatch(addNotification({ type: 'error', message: 'Failed to generate insight' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
            <Sparkles className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Member Insights
          </h1>
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black rounded-full animate-pulse">
            AI-POWERED
          </span>
        </div>
        <p className="text-gray-400 font-bold">Personalized AI recommendations for members</p>
      </div>

      {/* Member Selection & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-black text-white">Select Member</h2>
          </div>
          <select 
            value={selectedMemberId || ''}
            onChange={(e) => setSelectedMemberId(Number(e.target.value))}
            className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold mb-4"
          >
            <option value="">Choose a member...</option>
            {members?.map((member) => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>

          <button 
            onClick={handleGenerateInsight}
            disabled={!selectedMemberId || isGenerating}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Zap className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate New Insight'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-6 h-6 text-black/70" />
            <Sparkles className="w-5 h-5 text-black/70" />
          </div>
          <p className="text-black/70 text-sm font-black mb-1">TOTAL INSIGHTS</p>
          <p className="text-5xl font-black text-black">{insights?.length || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-black/70" />
            <Target className="w-5 h-5 text-black/70" />
          </div>
          <p className="text-black/70 text-sm font-black mb-1">ACTIVE ALERTS</p>
          <p className="text-5xl font-black text-black">{insights?.filter(i => i.risk_alert)?.length || 0}</p>
        </div>
      </div>

      {selectedMemberId ? (
        <>
          {/* Category Filter */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-black transition-all whitespace-nowrap capitalize ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:text-yellow-400 border border-yellow-500/20'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Insights Grid */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                <p className="text-gray-400 mt-4 font-bold">Loading insights...</p>
              </div>
            ) : filteredInsights && filteredInsights.length > 0 ? (
              filteredInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white capitalize">{insight.category}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                          <Calendar className="w-4 h-4" />
                          {new Date(insight.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {insight.risk_alert && (
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        ALERT
                      </span>
                    )}
                  </div>

                  {/* AI Recommendation */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-black text-yellow-400">AI RECOMMENDATION</span>
                    </div>
                    <p className="text-gray-300 font-bold leading-relaxed">
                      {insight.ai_recommendation}
                    </p>
                  </div>

                  {/* Goal Prediction */}
                  {insight.predicted_goal_date && (
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-black text-yellow-400">GOAL PREDICTION</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300 font-bold">Estimated completion date</p>
                        <p className="text-xl font-black text-white">
                          {new Date(insight.predicted_goal_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Risk Alert */}
                  {insight.risk_alert && (
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-black text-red-400 mb-1">RISK ALERT</p>
                          <p className="text-red-400 font-bold">{insight.risk_alert}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Data Preview */}
                  {insight.input_data && (
                    <div className="mt-4 pt-4 border-t border-yellow-500/20">
                      <p className="text-xs text-gray-500 font-bold">
                        Based on recent activity, progress data, and workout patterns
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-lg">No insights available yet</p>
                <p className="text-gray-500 font-medium mt-2">Generate insights to see AI-powered recommendations</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-black text-white">Progress Score</h3>
              </div>
              <p className="text-4xl font-black text-green-400 mb-2">87%</p>
              <p className="text-sm text-gray-400 font-medium">Above average performance</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-black text-white">Goal Progress</h3>
              </div>
              <p className="text-4xl font-black text-yellow-400 mb-2">73%</p>
              <p className="text-sm text-gray-400 font-medium">On track to reach goals</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-black text-white">Consistency</h3>
              </div>
              <p className="text-4xl font-black text-orange-400 mb-2">92%</p>
              <p className="text-sm text-gray-400 font-medium">Excellent attendance rate</p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-12 text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-bold text-lg">Select a member to view their AI insights</p>
        </div>
      )}
    </div>
  );
}