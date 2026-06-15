'use client';

import { Transport } from '@/app/lib/types';

interface Props {
  value: Transport | null;
  onChange: (v: Transport) => void;
  onNext: () => void;
}

export default function StepTransport({ value, onChange, onNext }: Props) {
  const options: { id: Transport; label: string; icon: string; desc: string }[] = [
    { id: 'car', label: '車', icon: '🚗', desc: '自由なルートで立ち寄りやすい' },
    { id: 'train', label: '電車', icon: '🚃', desc: '駅周辺の観光地を案内' },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">移動手段を選択</h2>
        <p className="text-gray-500 text-center mt-2">どちらで移動しますか？</p>
      </div>
      <div className="flex gap-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center gap-3 w-44 p-6 rounded-2xl border-2 transition-all
              ${value === opt.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
          >
            <span className="text-5xl">{opt.icon}</span>
            <span className="text-xl font-bold text-gray-800">{opt.label}</span>
            <span className="text-sm text-gray-500 text-center">{opt.desc}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="px-10 py-3 bg-emerald-500 text-white rounded-full font-semibold text-lg disabled:opacity-40 hover:bg-emerald-600 transition-colors"
      >
        次へ →
      </button>
    </div>
  );
}
