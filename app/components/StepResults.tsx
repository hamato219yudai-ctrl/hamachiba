'use client';

import { Spot, AffiliateLinks, Transport } from '@/app/lib/types';
import MapView from './MapView';

interface Props {
  spots: Spot[];
  affiliate: AffiliateLinks;
  waypoints: { lat: number; lng: number }[];
  origin: string;
  destination: string;
  transport: Transport;
  onReset: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500 text-sm">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))} {rating.toFixed(1)}
    </span>
  );
}

export default function StepResults({ spots, affiliate, waypoints, origin, destination, transport, onReset }: Props) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = () => {
    const text = `${origin}→${destination}の道中観光スポット\n` + spots.map((s) => `・${s.name}`).join('\n');
    if (navigator.share) {
      navigator.share({ title: '道中観光プラン', text, url: shareUrl });
    } else {
      navigator.clipboard.writeText(text + '\n' + shareUrl);
      alert('クリップボードにコピーしました');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">おすすめ道中スポット</h2>
        <p className="text-gray-500 mt-1">{origin} → {destination}</p>
      </div>

      {/* Map */}
      <MapView spots={spots} waypoints={waypoints} />

      {/* Spot cards */}
      <div className="flex flex-col gap-6">
        {spots.map((spot, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            {spot.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={spot.photoUrl} alt={spot.name} className="w-full h-48 object-cover" />
            )}
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">SPOT {i + 1}</span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">{spot.name}</h3>
                </div>
                {spot.rating && <StarRating rating={spot.rating} />}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{spot.description}</p>
              {spot.address && <p className="text-xs text-gray-400">📍 {spot.address}</p>}
              <div className="flex gap-2 flex-wrap">
                {spot.website && (
                  <a
                    href={spot.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                  >
                    公式サイト →
                  </a>
                )}
                <a
                  href={`https://www.klook.com/ja/search/?query=${encodeURIComponent(spot.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  チケットを探す 🎫
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Affiliate block */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800">旅の予約もここから</h3>
        <div className="flex flex-wrap gap-3">
          <a
            href={affiliate.hotel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            🏨 {destination}のホテルを探す
          </a>
          {affiliate.rental && (
            <a
              href={affiliate.rental}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              🚗 レンタカーを探す
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleShare}
          className="px-6 py-3 border-2 border-emerald-400 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
        >
          📤 プランをシェア
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
        >
          もう一度検索
        </button>
      </div>
    </div>
  );
}
