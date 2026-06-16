'use client';

import { useState } from 'react';
import StepTransport from './components/StepTransport';
import StepCategory from './components/StepCategory';
import StepLocation from './components/StepLocation';
import StepResults from './components/StepResults';
import StepIndicator from './components/StepIndicator';
import { Transport, Category, Spot, AffiliateLinks } from './lib/types';

interface Results {
  spots: Spot[];
  affiliate: AffiliateLinks;
  waypoints: { lat: number; lng: number }[];
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [transport, setTransport] = useState<Transport | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);

  const handleSearch = async () => {
    if (!transport || !categories.length || !origin || !destination) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/route-spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, transport, categories }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'エラーが発生しました');
      }
      const data: Results = await res.json();
      setResults(data);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setTransport(null);
    setCategories([]);
    setOrigin('');
    setDestination('');
    setResults(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">🗺️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">道中観光ナビ</h1>
            <p className="text-xs text-gray-500">AIが旅の道中にある観光スポットを提案します</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col items-center gap-10">
        {step < 4 && <StepIndicator current={step} />}

        {step === 1 && (
          <StepTransport
            value={transport}
            onChange={setTransport}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepCategory
            values={categories}
            onChange={setCategories}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <>
            <StepLocation
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onNext={handleSearch}
              onBack={() => setStep(2)}
            />
            {loading && (
              <div className="flex flex-col items-center gap-3 text-emerald-600">
                <div className="w-10 h-10 border-4 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-medium">AIが道中の観光スポットを探しています…</p>
              </div>
            )}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
          </>
        )}
        {step === 4 && results && transport && (
          <StepResults
            spots={results.spots}
            affiliate={results.affiliate}
            waypoints={results.waypoints}
            origin={origin}
            destination={destination}
            transport={transport}
            onReset={reset}
          />
        )}
      </div>

      <footer className="text-center py-8 text-xs text-gray-400">
        © 2026 道中観光ナビ · 観光情報はAIが生成したものです。最新情報は各施設にご確認ください。
      </footer>
    </main>
  );
}
