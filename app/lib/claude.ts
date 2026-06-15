import Anthropic from '@anthropic-ai/sdk';
import { Category, Transport } from './types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const categoryLabels: Record<Category, string> = {
  nature: '自然・絶景',
  onsen: '温泉',
  history: '歴史的遺産・神社仏閣',
  gourmet: 'グルメ・名物料理',
  famous: '有名観光地',
};

export async function recommendSpots(
  origin: string,
  destination: string,
  transport: Transport,
  categories: Category[],
  waypoints: { lat: number; lng: number }[]
): Promise<{ name: string; description: string }[]> {
  const categoryText = categories.map((c) => categoryLabels[c]).join('・');
  const transportText = transport === 'car' ? '車' : '電車';
  const waypointText = waypoints
    .slice(0, 5)
    .map((p) => `(${p.lat.toFixed(3)},${p.lng.toFixed(3)})`)
    .join(' → ');

  const prompt = `あなたは日本の旅行ガイドの専門家です。
移動手段: ${transportText}
カテゴリ: ${categoryText}
出発地: ${origin}
目的地: ${destination}
ルート上の代表ポイント(緯度,経度): ${waypointText}

上記のルートから大きく外れない（${transport === 'car' ? '車で約15分以内' : '最寄り駅から徒歩15分以内'}の寄り道）場所にある、
${categoryText}に該当する観光地を3件推薦してください。

以下のJSON形式で返答してください（他のテキストは不要）:
[
  {"name": "観光地名（日本語）", "description": "魅力を1〜2文で説明"},
  {"name": "観光地名（日本語）", "description": "魅力を1〜2文で説明"},
  {"name": "観光地名（日本語）", "description": "魅力を1〜2文で説明"}
]`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  return JSON.parse(jsonMatch[0]);
}
