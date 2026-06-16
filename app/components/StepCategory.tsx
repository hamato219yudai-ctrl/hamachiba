'use client';

import { Category } from '@/app/lib/types';

interface Props {
  values: Category[];
  onChange: (v: Category[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'nature', label: '自然・絶景', icon: '🌲' },
  { id: 'onsen', label: '温泉', icon: '♨️' },
  { id: 'history', label: '歴史・神社仏閣', icon: '⛩️' },
  { id: 'gourmet', label: 'グルメ・名物', icon: '🍜' },
  { id: 'famous', label: '有名観光地', icon: '🗾' },
];

export default function StepCategory({ values, onChange, onNext, onBack }: Props) {
  const toggle = (id: Category) => {
    onChange(values.includes(id) ? values.filter((v) => v !== id) : [...values, id]);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">観光のジャンルを選択</h2>
        <p className="text-gray-500 text-center mt-2">複数選択できます</p>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
              ${values.includes(cat.id)
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
          >
            <span className="text-4xl">{cat.icon}</span>
            <span className="text-sm font-semibold text-gray-700 text-center">{cat.label}</span>
          </button>
        ))}
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
          disabled={values.length === 0}
          className="px-10 py-3 bg-emerald-500 text-white rounded-full font-semibold text-lg disabled:opacity-40 hover:bg-emerald-600 transition-colors"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
