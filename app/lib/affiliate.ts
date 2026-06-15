export function buildAffiliateLinks(destination: string, transport: string) {
  const encoded = encodeURIComponent(destination);
  const jalanId = process.env.AFFILIATE_JALAN_ID || '';
  const rakutenId = process.env.AFFILIATE_RAKUTEN_ID || '';

  const hotel = jalanId
    ? `https://www.jalan.net/jalan/affi/affiEntry.do?affiCode=${jalanId}&path=/yad/yadListSearch.do?keyword=${encoded}`
    : `https://www.jalan.net/yad/yadListSearch.do?keyword=${encoded}`;

  const rental =
    transport === 'car'
      ? rakutenId
        ? `https://af.moshimo.com/af/c/click?a_id=${rakutenId}&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(`https://travel.rakuten.co.jp/cars/?f_area_name=${encoded}`)}`
        : `https://travel.rakuten.co.jp/cars/?f_area_name=${encoded}`
      : null;

  return { hotel, rental };
}

export function buildKlookLink(spotName: string) {
  const klookId = process.env.AFFILIATE_KLOOK_ID || '';
  const query = encodeURIComponent(spotName);
  return klookId
    ? `https://www.klook.com/ja/affiliate/redirect/?aff_code=${klookId}&url=${encodeURIComponent(`https://www.klook.com/ja/search/?query=${query}`)}`
    : `https://www.klook.com/ja/search/?query=${query}`;
}
