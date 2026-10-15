// Dates identify the news shown in each illustration, not the area or puzzle order.
export const HUB_ORDER=[4,1,8,5,2,7,3,6];
export const NEWS_DATES={
 1:{month:'2月',dateCaption:'総選挙',timelineTitle:'衆議院議員総選挙',date:'2026-02-08',dateSource:'https://www.kantei.go.jp/jp/tyokan/104/20260127danwa.html'},
 2:{month:'2月',dateCaption:'金メダル',timelineTitle:'りくりゅう 金メダル',date:'2026-02-16',dateSource:'https://joc.or.jp/news/20260217038149.html'},
 3:{month:'2月',dateCaption:'攻撃開始',timelineTitle:'イランへの攻撃',date:'2026-02-28',dateSource:'https://www.un.org/sg/en/content/sg/statements/2026-02-28/secretary-generals-remarks-the-security-council-meeting-the-situation-the-middle-east-delivered'},
 4:{month:'6月',dateCaption:'日本代表の試合',timelineTitle:'サッカーW杯 日本代表',date:'2026-06-15',dateSource:'https://www.jfa.jp/samuraiblue/worldcup_2026/canadamexicousa2026/'},
 5:{month:'7月',dateCaption:'熊本地震',timelineTitle:'熊本の大地震',date:'2026-07-28',dateSource:'https://www.jma.go.jp/jma/press/2607/28d/202607282030.html'},
 6:{month:'8月',dateCaption:'千葉豪雨',timelineTitle:'千葉の記録的な大雨',date:'2026-08-13',dateSource:'https://www.data.jma.go.jp/stats/data/bosai/report/2026/20260916/20260916.html'},
 7:{month:'9月',dateCaption:'開幕',timelineTitle:'愛知・名古屋アジア大会 開幕',date:'2026-09-19',dateSource:'https://www.aichi-nagoya2026.org/ja/'},
 8:{month:'10月',dateCaption:'受賞決定',timelineTitle:'ノーベル化学賞 受賞決定',date:'2026-10-07',dateSource:'https://www.tus.ac.jp/about/nobelprize2026/'}
};
export function newsDateBadge(area){return `<span class="news-date"><strong>${area.month}</strong><small>${area.dateCaption}</small></span>`;}
