'use client';

interface Props {
  current: number;
}

const steps = ['移動手段', 'ジャンル', '出発・目的地', '観光スポット'];

export default function StepIndicator({ current }: Props) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex flex-col items-center gap-1`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${done ? 'bg-emerald-500 text-white' : active ? 'bg-emerald-500 text-white ring-4 ring-emerald-200' : 'bg-gray-200 text-gray-400'}`}
              >
                {done ? '✓' : num}
              </div>
              <span className={`text-xs hidden sm:block ${active ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 mb-5 ${done ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
