'use client';

import { useEffect, useRef } from 'react';

interface Props {
  origin: string;
  destination: string;
  onOriginChange: (v: string) => void;
  onDestinationChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initAutocomplete?: () => void;
  }
}

export default function StepLocation({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onNext,
  onBack,
}: Props) {
  const originRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || typeof window === 'undefined') return;

    const init = () => {
      if (!window.google?.maps?.places) return;
      if (originRef.current) {
        const ac1 = new window.google.maps.places.Autocomplete(originRef.current, { componentRestrictions: { country: 'jp' } });
        ac1.addListener('place_changed', () => {
          onOriginChange(originRef.current?.value ?? '');
        });
      }
      if (destRef.current) {
        const ac2 = new window.google.maps.places.Autocomplete(destRef.current, { componentRestrictions: { country: 'jp' } });
        ac2.addListener('place_changed', () => {
          onDestinationChange(destRef.current?.value ?? '');
        });
      }
    };

    if (window.google?.maps?.places) {
      init();
    } else {
      window.initAutocomplete = init;
      if (!document.getElementById('gmaps-script')) {
        const script = document.createElement('script');
        script.id = 'gmaps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete&language=ja`;
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [onOriginChange, onDestinationChange]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">出発地と目的地を入力</h2>
        <p className="text-gray-500 text-center mt-2">都市名・駅名・住所で検索できます</p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">出発地</label>
          <input
            ref={originRef}
            type="text"
            defaultValue={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            placeholder="例：東京駅"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
        <div className="flex items-center justify-center text-2xl text-gray-400">↓</div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">目的地</label>
          <input
            ref={destRef}
            type="text"
            defaultValue={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            placeholder="例：大阪駅"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-colors"
        >
          ← 戻る
        </button>
        <button
          onClick={onNext}
          disabled={!origin || !destination}
          className="px-10 py-3 bg-emerald-500 text-white rounded-full font-semibold text-lg disabled:opacity-40 hover:bg-emerald-600 transition-colors"
        >
          観光地を探す 🔍
        </button>
      </div>
    </div>
  );
}
