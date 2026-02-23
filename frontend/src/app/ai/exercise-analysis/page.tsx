'use client';
import { useState } from 'react';
import { ScanLine, Upload, Play, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useAnalyzeExerciseFormMutation, useGetExerciseAnalysesQuery } from '@/lib/api/aiApi';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useGetExercisesQuery } from '@/lib/api/exercisesApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNotification, selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function ExerciseAnalysisPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: analyses, isLoading } = useGetExerciseAnalysesQuery({});
  const { data: members } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });
  const { data: exercises } = useGetExercisesQuery({});
  const [analyzeForm, { isLoading: isAnalyzing }] = useAnalyzeExerciseFormMutation();

  const [memberId, setMemberId] = useState('');
  const [exerciseId, setExerciseId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleAnalyze = async () => {
    if (!memberId || !exerciseId) {
      dispatch(
        addNotification({ type: 'error', message: 'Please select member and exercise first' }),
      );
      return;
    }

    try {
      await analyzeForm({
        memberId: Number(memberId),
        exerciseId: Number(exerciseId),
        videoUrl: videoUrl || undefined,
      }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Form analysis completed' }));
    } catch (error: any) {
      dispatch(
        addNotification({
          type: 'error',
          message: error?.data?.message || 'Failed to analyze exercise form',
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
            <ScanLine className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Exercise Form Analysis
          </h1>
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black rounded-full animate-pulse">
            AI-POWERED
          </span>
        </div>
        <p className="text-gray-400 font-bold">AI-powered exercise form analysis and correction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-black text-white mb-6">Upload Exercise Video</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
            >
              <option value="">Select member</option>
              {members?.map((member: any) => (
                <option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </option>
              ))}
            </select>

            <select
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
              className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
            >
              <option value="">Select exercise</option>
              {exercises?.map((exercise: any) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => {
              const promptedUrl = window.prompt(
                'Paste exercise video URL (optional):',
                videoUrl || '',
              );
              if (promptedUrl !== null) setVideoUrl(promptedUrl.trim());
            }}
            className="border-2 border-dashed border-yellow-500/30 rounded-xl p-12 text-center hover:border-yellow-500/50 transition-all cursor-pointer"
          >
            <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-bold mb-2">
              {videoUrl ? 'Video URL added. Click to change.' : 'Click to add video URL (optional)'}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {videoUrl || 'Supports MP4, MOV, AVI links or hosted URLs'}
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-4 rounded-lg hover:scale-105 transform transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Play className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Form'}
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-xl font-black text-white mb-6">Analysis Stats</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-xs font-black text-green-400">EXCELLENT</span>
              </div>
              <p className="text-3xl font-black text-white">127</p>
              <p className="text-sm text-gray-400 font-medium">Perfect form</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-black text-yellow-400">GOOD</span>
              </div>
              <p className="text-3xl font-black text-white">89</p>
              <p className="text-sm text-gray-400 font-medium">Minor adjustments</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-xs font-black text-red-400">NEEDS WORK</span>
              </div>
              <p className="text-3xl font-black text-white">34</p>
              <p className="text-sm text-gray-400 font-medium">Correction needed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-black text-white mb-6">Recent Analyses</h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            analyses?.slice(0, 5).map((analysis) => (
              <div
                key={analysis.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-black text-white">Exercise Analysis #{analysis.id}</p>
                    <p className="text-sm text-gray-400 font-medium">
                      {new Date(analysis.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-black rounded-full border ${
                      analysis.risk_level === 'low'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : analysis.risk_level === 'medium'
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                          : 'bg-red-500/20 border-red-500/50 text-red-400'
                    }`}
                  >
                    {analysis.risk_level?.toUpperCase() || 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-black text-yellow-400">
                      {analysis.posture_score || 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Posture</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-orange-400">
                      {analysis.stability_score || 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Stability</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-red-400">
                      {analysis.movement_efficiency || 0}%
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Efficiency</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
