import { useState, useCallback, useEffect } from "react";
import { Scale, ScrollText, Building2, Coins, BookOpen, Package, Moon, Sun, ChevronRight, ArrowLeft, Flame, CheckCircle2, XCircle, Lightbulb, BarChart3, Calendar, Zap, FileText, Star, Target, Repeat, CreditCard, Clock, TrendingUp, Check, X, Brain, GraduationCap, Layers } from "lucide-react";

/* ═══ PERSISTENCE ═══ */
function getWeekId(){const d=new Date();const jan1=new Date(d.getFullYear(),0,1);const days=Math.floor((d-jan1)/86400000);return d.getFullYear()+"-W"+Math.ceil((days+jan1.getDay()+1)/7);}
const LS={
  get(k,d){try{const v=localStorage.getItem("td_"+k);return v?JSON.parse(v):d;}catch{return d;}},
  set(k,v){try{localStorage.setItem("td_"+k,JSON.stringify(v));}catch{}},
};
function loadStats(){
  const saved=LS.get("stats",null);const week=getWeekId();
  if(saved&&saved.week===week)return saved;
  // Archive previous week if exists
  if(saved&&saved.week){const archive=LS.get("statsArchive",[]);archive.push({...saved});LS.set("statsArchive",archive.slice(-12));}
  return {c:0,i:0,bc:{},week};
}

const CAT_ICONS={gyouhou:Scale,kenri:ScrollText,hourei:Building2,tax:Coins};

/* ═══ GLOSSARY ═══ */
const GLOSSARY={"宅地建物取引業":"土地や建物の売買・交換・貸借の代理や媒介を業として行うこと。","宅地建物取引士":"宅建試験に合格し都道府県知事の登録を受け取引士証の交付を受けた者。","取引士証":"宅地建物取引士の証明書。有効期間5年。更新には法定講習が必要。","免許権者":"宅建業の免許を与える者。1都道府県→知事、2以上→国土交通大臣。","欠格事由":"免許や登録を受けられない要件。禁錮以上の刑で5年未経過など。","必要的取消事由":"該当すれば必ず免許を取り消さなければならない事由。","営業保証金":"取引相手への弁済原資として供託所に預ける金銭等。本店1,000万円、支店500万円。","弁済業務保証金":"保証協会加入業者が営業保証金の代わりに納付する分担金。","供託":"金銭や有価証券を供託所（法務局）に預けること。","媒介契約":"不動産取引の仲介を依頼する契約。一般・専任・専属専任の3種類。","重要事項説明":"契約前に取引士が物件や取引条件の重要情報を書面で説明すること。35条書面。","35条書面":"宅建業法35条に基づく重要事項説明書。","37条書面":"宅建業法37条に基づく契約書面。交付義務あり、説明義務なし。","8種制限":"自ら売主で買主が業者でない場合の8つの制限。","クーリング・オフ":"事務所等以外で申込み・契約した場合に書面で無条件解除できる制度。","発信主義":"意思表示の効力が発信時点で生じる考え方。","意思表示":"法律効果を発生させる意思の表明。","詐欺":"他人を騙して意思表示をさせること。96条で取消し可能。","善意無過失":"ある事実を知らず、知らないことに過失もない状態。","善意":"ある事情を知らないこと。","悪意":"ある事情を知っていること。","無権代理":"代理権なく他人の代理人として行った行為。","表見代理":"無権代理だが相手方が代理権を正当に信じた場合に本人に責任を負わせる制度。","抵当権":"不動産を担保に使用を続けられる担保物権。","附従性":"被担保債権が消滅すれば担保権も消滅する性質。","被担保債権":"担保で保護されている債権。","一括競売":"抵当権設定後の建物も土地とまとめて競売できる制度。","債務不履行":"契約義務を果たさないこと。","連帯債務":"複数の債務者がそれぞれ全額の支払い義務を負う。","法定相続分":"民法で定められた相続人の取り分の割合。","遺留分":"一定の相続人に保障される最低限の相続割合。直系尊属のみ1/3、その他1/2。","代襲相続":"相続人が先に死亡した場合にその子が代わりに相続。","借地権":"建物所有目的の地上権or土地賃借権。","普通借地権":"更新ありの借地権。最低30年。","定期借地権":"更新なしの借地権。一般定期は50年以上。","一般定期借地権":"存続50年以上、更新なし。公正証書等の書面で設定。","区分所有法":"マンション等の共同所有ルールの法律。","都市計画法":"都市の発展と整備を図る法律。","市街化区域":"今後10年内に優先的に市街化する区域。用途地域必須。","市街化調整区域":"市街化を抑制する区域。原則用途地域なし。","用途地域":"13種類の地域区分。住居系・商業系・工業系。","開発許可":"一定規模以上の造成工事に必要な許可。","建ぺい率":"敷地面積に対する建築面積割合の上限。","容積率":"敷地面積に対する延べ面積割合の上限。","防火地域":"火災防止のため指定される地域。","耐火建築物":"主要構造部を耐火構造にした建物。","農地法":"農地の転用・権利移動を規制する法律。3条・4条・5条。","農業委員会":"農地法の許可・届出窓口の行政委員会。","不動産取得税":"不動産取得時に一度だけ課される都道府県税。相続は非課税。","固定資産税":"毎年1/1時点の所有者に課される市町村税。","小規模住宅用地":"200㎡以下の住宅敷地。固定資産税の課税標準1/6。","免税点":"この額未満なら非課税の基準額。","課税標準":"税額計算の基礎となる金額。","譲渡所得":"資産売却益に課される所得。長期と短期で税率が異なる。","印紙税":"契約書等に課される国税。","登録免許税":"登記の際に課される国税。","公正証書":"公証人が作成する高い証拠力を持つ文書。","法定講習":"取引士証更新時に受講義務がある講習。","記名":"書面に名前を記載すること。2022年改正で押印廃止。"};

/* ═══ PRESET QUESTIONS ═══ */
const PQ={
gyouhou:[
{q:"免許の有効期間は何年か。",c:["3年","5年","7年","10年"],a:1,e:"免許の有効期間は5年。",t:"免許制度",p:"有効期間5年。更新は期間満了90日前〜30日前。",f:5},
{q:"1年以上事業を休止した場合、免許権者はどうするか。",c:["指示処分をする","業務停止処分をする","免許を取り消さなければならない","勧告する"],a:2,e:"必要的取消事由。裁量なし。",t:"免許制度",p:"1年以上の休止は必要的取消事由。",f:5},
{q:"非常勤役員に欠格事由がある法人は免許を受けられるか。",c:["受けられる","受けられない","条件付きで受けられる","常勤に変更すれば受けられる"],a:1,e:"非常勤でも役員は欠格事由の判定対象。",t:"免許制度",p:"非常勤役員も欠格事由の対象。",f:4},
{q:"取引士証の更新に必要なものは何か。",c:["申請のみ","法定講習の受講","実務経験の証明","再試験の合格"],a:1,e:"法定講習の受講が必須。単なる申請では更新不可。",t:"宅地建物取引士",p:"取引士証の更新=法定講習の受講が必須。",f:5},
{q:"重要事項説明時の取引士証の提示は、請求がなくても必要か。",c:["必要","不要","書面提示のみ必要","相手方が業者なら不要"],a:0,e:"35条4項により請求の有無にかかわらず提示必須。",t:"宅地建物取引士",p:"重説時の提示は請求不要で必須。",f:5},
{q:"営業保証金の額は主たる事務所いくらか。",c:["500万円","1,000万円","1,500万円","2,000万円"],a:1,e:"主たる事務所1,000万円、従たる事務所500万円。",t:"営業保証金",p:"本店1,000万円、支店500万円。",f:4},
{q:"営業保証金の還付対象から除かれるのは誰か。",c:["個人の買主","法人の買主","宅建業者","すべて還付可能"],a:2,e:"宅建業者は還付対象から除外（27条1項）。",t:"営業保証金",p:"宅建業者は営業保証金の還付対象外。",f:4},
{q:"クーリング・オフの効力はいつ生じるか。",c:["相手方に届いた時","書面を発した時","口頭で伝えた時","7日経過後"],a:1,e:"発信主義。書面を発した時点で効力発生。",t:"8種制限",p:"クーリング・オフは発信主義。",f:5},
{q:"事務所で買受けの申込みをした場合、クーリング・オフはできるか。",c:["できる","できない","8日以内ならできる","書面があればできる"],a:1,e:"事務所等での申込みはクーリング・オフの対象外。",t:"8種制限",p:"事務所での申込み=クーリング・オフ不可。",f:5},
{q:"買主が宅建業者の場合、8種制限は適用されるか。",c:["適用される","適用されない","一部適用される","契約内容による"],a:1,e:"8種制限は買主が業者でない場合にのみ適用。",t:"8種制限",p:"業者間取引は8種制限の適用なし。",f:5},
{q:"重要事項説明で、貸借の場合にローンのあっせんの説明は必要か。",c:["必要","不要","賃料による","物件による"],a:1,e:"ローンのあっせんは売買・交換のみの説明事項。",t:"重要事項説明",p:"ローンのあっせん説明=売買・交換のみ。",f:5},
{q:"37条書面に押印は必要か。",c:["必要","不要（記名のみ）","売主のみ必要","両当事者必要"],a:1,e:"2022年改正で押印義務廃止。記名のみ。",t:"37条書面",p:"37条書面=記名のみ。押印不要。",f:5},
{q:"37条書面は誰に交付するか。",c:["買主のみ","売主のみ","契約の各当事者","媒介業者"],a:2,e:"各当事者に交付が必要。",t:"37条書面",p:"37条書面は各当事者に交付。",f:4},
{q:"移転登記の申請時期は貸借の37条書面に記載が必要か。",c:["必要","不要","任意的記載事項","特約で定めた場合のみ"],a:1,e:"移転登記は売買・交換のみの記載事項。",t:"37条書面",p:"移転登記の申請時期=売買・交換の必要的記載事項。",f:4},
{q:"専任媒介契約の有効期間の上限は何か月か。",c:["1か月","3か月","6か月","制限なし"],a:1,e:"専任・専属専任は3か月が上限。",t:"媒介契約",p:"専任・専属専任の有効期間上限=3か月。",f:4},
{q:"宅建業者の報酬額は誰が定めるか。",c:["都道府県知事","国土交通大臣","市町村長","業者が自由に決定"],a:1,e:"国土交通大臣が報酬額の上限を定める。",t:"報酬",p:"報酬の上限=国土交通大臣が定める。",f:3},
],
kenri:[
{q:"詐欺取消しは善意無過失の第三者に対抗できるか。",c:["できる","できない","善意であれば対抗不可","登記があれば対抗可"],a:1,e:"96条3項。善意無過失の第三者に対抗不可。",t:"意思表示",p:"詐欺取消し→善意無過失の第三者に対抗不可。",f:5},
{q:"強迫取消しは善意の第三者に対抗できるか。",c:["できる","できない","善意無過失なら不可","登記による"],a:0,e:"強迫は詐欺と異なり、善意の第三者にも対抗可能。",t:"意思表示",p:"強迫取消し→善意の第三者にも対抗可能。",f:5},
{q:"被担保債権が時効消滅した場合、抵当権はどうなるか。",c:["存続する","消滅する","一部消滅","裁判所の判断による"],a:1,e:"附従性により被担保債権が消滅すれば抵当権も消滅。",t:"抵当権",p:"附従性→被担保債権消滅=抵当権も消滅。",f:4},
{q:"抵当権の利息の優先弁済は最後の何年分か。",c:["1年分","2年分","3年分","制限なし"],a:1,e:"民法375条。最後の2年分のみ。",t:"抵当権",p:"利息の優先弁済=最後の2年分。",f:4},
{q:"普通借地権の最低存続期間は何年か。",c:["10年","20年","30年","50年"],a:2,e:"借地借家法3条。30年。",t:"借地借家法",p:"普通借地権=最低30年。",f:5},
{q:"一般定期借地権の設定に必要な書面は何か。",c:["公正証書のみ","公正証書等の書面","口頭でも可","登記のみ"],a:1,e:"公正証書「等の書面」。公正証書に限定されない。",t:"借地借家法",p:"一般定期借地権=公正証書等の書面。",f:5},
{q:"借地上の建物を譲渡する際、地主の承諾が得られない場合どうするか。",c:["譲渡できない","裁判所に許可を申し立てる","自動的に承諾とみなす","供託する"],a:1,e:"借地借家法19条。裁判所に承諾に代わる許可の申立て可能。",t:"借地借家法",p:"承諾なし→裁判所に許可申立て可能。",f:4},
{q:"遺留分の割合は直系尊属のみが相続人の場合いくらか。",c:["1/2","1/3","1/4","なし"],a:1,e:"民法1042条。直系尊属のみ=1/3。",t:"相続",p:"遺留分：直系尊属のみ1/3、その他1/2。",f:4},
{q:"相続放棄をした場合、その子は代襲相続できるか。",c:["できる","できない","家庭裁判所の許可があれば可","遺言があれば可"],a:1,e:"放棄は初めから相続人でなかったとみなす。代襲相続なし。",t:"相続",p:"相続放棄→代襲相続なし。",f:4},
{q:"配偶者と子が相続人の場合の法定相続分は。",c:["配偶者2/3、子1/3","配偶者1/2、子1/2","配偶者3/4、子1/4","すべて均等"],a:1,e:"配偶者と子の場合、各1/2。",t:"相続",p:"配偶者+子=各1/2。",f:5},
{q:"取消しの効果は遡及するか。",c:["遡及する","遡及しない","将来に向かってのみ","当事者の合意による"],a:0,e:"民法121条。取消しは遡及的に無効となる。",t:"意思表示",p:"取消し=遡及的無効。",f:3},
{q:"不動産の物権変動の対抗要件は何か。",c:["引渡し","登記","占有","公正証書"],a:1,e:"不動産は登記、動産は引渡し。",t:"物権変動",p:"不動産の対抗要件=登記。",f:5},
{q:"取得時効の期間は善意無過失の場合何年か。",c:["5年","10年","15年","20年"],a:1,e:"善意無過失=10年、その他=20年。",t:"時効",p:"取得時効：善意無過失10年、その他20年。",f:4},
{q:"3条許可を受けずに行った農地の売買契約の効力は。",c:["有効","無効","取り消しうる","条件付き有効"],a:1,e:"3条許可なしの契約は効力を生じない（無効）。",t:"農地法",p:"3条許可なし=無効。",f:4},
{q:"連帯債務者の一人に対する履行の請求は他の債務者に効力が及ぶか。",c:["及ぶ","及ばない","合意がある場合のみ及ぶ","債権者の選択による"],a:2,e:"2020年改正民法で原則不可。別段の合意があれば可。",t:"連帯債務",p:"連帯債務の請求→原則相対効。合意あれば絶対効。",f:3},
],
hourei:[
{q:"市街化区域に用途地域の指定は必須か。",c:["必須","任意","条件による","不要"],a:0,e:"都市計画法13条。市街化区域は少なくとも用途地域を定める。",t:"都市計画法",p:"市街化区域=用途地域必須。",f:5},
{q:"市街化調整区域に用途地域を定められるか。",c:["定められない","原則定めない","必ず定める","知事の許可で可"],a:1,e:"原則として定めないが、例外的に定めることは可能。",t:"都市計画法",p:"市街化調整区域=原則用途地域なし。",f:5},
{q:"準都市計画区域に用途地域を定められるか。",c:["定められる","定められない","都市計画区域のみ可","条例による"],a:0,e:"準都市計画区域でも用途地域等を定められる。",t:"都市計画法",p:"準都市計画区域でも用途地域は設定可能。",f:3},
{q:"建ぺい率80%地域＋防火地域＋耐火建築物の場合、建ぺい率は。",c:["80%","90%","100%（制限なし）","85%"],a:2,e:"この組合せで建ぺい率の制限なし（100%）。",t:"建築基準法",p:"80%地域+防火地域+耐火建築物=制限なし。",f:5},
{q:"建ぺい率70%地域＋防火地域＋耐火建築物の場合は。",c:["制限なし","70%","80%","75%"],a:2,e:"制限なしは80%地域限定。70%地域は+10%で80%。",t:"建築基準法",p:"70%地域では+10%で80%になるだけ。",f:5},
{q:"角地の建ぺい率の緩和は何分の何か。",c:["10分の1","10分の2","5分の1","緩和なし"],a:0,e:"特定行政庁指定の角地は10分の1加算。",t:"建築基準法",p:"角地の建ぺい率緩和=10分の1加算。",f:4},
{q:"異なる建ぺい率の地域にまたがる場合の計算方法は。",c:["厳しい方を適用","緩い方を適用","加重平均","平均値"],a:2,e:"各地域の面積割合で按分して合計（加重平均）。",t:"建築基準法",p:"複数地域にまたがる=加重平均。",f:4},
{q:"市街化区域内の農地転用は4条許可が必要か。",c:["必要","農業委員会届出で不要","不要","知事の許可が必要"],a:1,e:"市街化区域内はあらかじめ農業委員会に届出すれば4条・5条許可不要。",t:"農地法",p:"市街化区域内=届出で4条・5条許可不要。",f:4},
{q:"相続による農地取得に3条許可は必要か。",c:["必要","不要（届出は必要）","不要（届出も不要）","家裁の許可が必要"],a:1,e:"相続は許可不要だが農業委員会への届出は必要。",t:"農地法",p:"相続=3条許可不要、届出は必要。",f:4},
{q:"開発許可が必要な市街化区域内の開発行為の規模は。",c:["500㎡以上","1,000㎡以上","2,000㎡以上","3,000㎡以上"],a:1,e:"市街化区域では1,000㎡以上。",t:"都市計画法",p:"開発許可：市街化区域1,000㎡以上。",f:4},
{q:"国土利用計画法の事後届出の期限は契約後何週間以内か。",c:["1週間","2週間","3週間","4週間"],a:1,e:"契約締結後2週間以内に届出。",t:"国土利用計画法",p:"事後届出=契約後2週間以内。",f:3},
{q:"都市計画区域内で建築物を建てる場合、原則何が必要か。",c:["開発許可","建築確認","用途変更許可","環境アセスメント"],a:1,e:"建築基準法6条。建築確認が必要。",t:"建築基準法",p:"建築確認=建築前に必要。",f:4},
{q:"用途地域は全部で何種類か。",c:["8種類","10種類","12種類","13種類"],a:3,e:"2018年に田園住居地域が追加され13種類に。",t:"都市計画法",p:"用途地域=13種類。",f:3},
{q:"第一種低層住居専用地域の建物の高さ制限は。",c:["10mまたは12m","15mまたは20m","20mまたは25m","制限なし"],a:0,e:"絶対高さ制限として10mまたは12m。",t:"建築基準法",p:"低層住居専用地域=高さ10mまたは12m。",f:3},
{q:"防火地域内で3階建て以上の建築物に求められるのは。",c:["準耐火建築物","耐火建築物","木造禁止","不燃材料のみ"],a:1,e:"防火地域で3階以上or延べ面積100㎡超は耐火建築物。",t:"建築基準法",p:"防火地域の3階以上=耐火建築物。",f:4},
],
tax:[
{q:"不動産取得税は国税か地方税か。",c:["国税","都道府県税","市町村税","特別区税"],a:1,e:"都道府県が課税する地方税。",t:"不動産取得税",p:"不動産取得税=都道府県税。",f:4},
{q:"相続による不動産取得に不動産取得税は課されるか。",c:["課される","課されない","評価額による","相続人による"],a:1,e:"相続は形式的な所有権移転であり非課税。",t:"不動産取得税",p:"相続=不動産取得税は非課税。",f:4},
{q:"不動産取得税の標準税率は原則何%か。",c:["3%","4%","5%","2%"],a:1,e:"原則4%。住宅と土地は特例で3%。",t:"不動産取得税",p:"原則4%、住宅・土地は特例3%。",f:3},
{q:"固定資産税の課税主体はどこか。",c:["国","都道府県","市町村","財務省"],a:2,e:"市町村が課税主体（東京23区は都）。",t:"固定資産税",p:"固定資産税=市町村税。",f:4},
{q:"固定資産税の賦課期日はいつか。",c:["4月1日","1月1日","3月31日","年度末"],a:1,e:"毎年1月1日現在の所有者に課税。",t:"固定資産税",p:"賦課期日=1月1日。",f:5},
{q:"小規模住宅用地の固定資産税の課税標準は評価額の何分の一か。",c:["1/3","1/4","1/6","1/2"],a:2,e:"200㎡以下の部分は課税標準が1/6。",t:"固定資産税",p:"小規模住宅用地=課税標準1/6。",f:4},
{q:"固定資産税の免税点で、土地はいくらか。",c:["10万円","20万円","30万円","50万円"],a:2,e:"土地30万円、家屋20万円、償却資産150万円。",t:"固定資産税",p:"免税点：土地30万、家屋20万、償却150万。",f:4},
{q:"居住用財産の3,000万円特別控除で、親族への譲渡は適用されるか。",c:["適用される","適用されない","配偶者以外なら可","直系血族以外なら可"],a:1,e:"特別の関係にある者への譲渡は不可。",t:"所得税",p:"3,000万円控除=親族への譲渡は適用不可。",f:4},
{q:"印紙税を貼り忘れた場合、契約書の効力はどうなるか。",c:["無効","有効","取り消しうる","条件付き有効"],a:1,e:"印紙税は文書に対する課税。契約の効力には影響なし。",t:"印紙税",p:"印紙貼り忘れ=過怠税のみ。契約は有効。",f:3},
{q:"登録免許税の課税標準は原則何か。",c:["取引価格","固定資産税評価額","路線価","公示価格"],a:1,e:"登録免許税の課税標準は原則として固定資産税評価額。",t:"登録免許税",p:"登録免許税の課税標準=固定資産税評価額。",f:3},
{q:"不動産鑑定評価の3手法に含まれないものはどれか。",c:["原価法","取引事例比較法","収益還元法","路線価法"],a:3,e:"3手法は原価法・取引事例比較法・収益還元法。",t:"鑑定評価",p:"鑑定評価3手法=原価法・取引事例比較法・収益還元法。",f:3},
{q:"地価公示の標準地の価格の基準日はいつか。",c:["1月1日","4月1日","7月1日","10月1日"],a:0,e:"毎年1月1日時点の正常な価格を公示。",t:"地価公示法",p:"地価公示=1月1日基準。",f:3},
{q:"住宅金融支援機構が提供する住宅ローンの名称は。",c:["フラット35","住宅ローン減税","すまい給付金","グリーンローン"],a:0,e:"フラット35は長期固定金利の住宅ローン。",t:"住宅金融支援機構",p:"住宅金融支援機構=フラット35を提供。",f:3},
{q:"景品表示法の不動産広告で、徒歩1分は何mか。",c:["60m","80m","100m","120m"],a:1,e:"道路距離80mを1分として計算。端数は切り上げ。",t:"景品表示法",p:"徒歩表示=80m/分。端数切り上げ。",f:3},
{q:"不動産広告で「新築」と表示できるのは建築後何年以内か。",c:["半年以内","1年以内","2年以内","3年以内"],a:1,e:"建築後1年以内かつ未入居のもの。",t:"景品表示法",p:"新築=建築後1年以内+未入居。",f:2},
]};

/* ═══ MNEMONICS ═══ */
const MNEMONICS=[
{title:"営業保証金の額",content:"「千と五百の供託物語」\n本店1,000万円・支店500万円",cat:"gyouhou"},
{title:"免許の有効期間",content:"「GO（5）年で免許更新」\n有効期間5年。90日前〜30日前に更新申請",cat:"gyouhou"},
{title:"専任媒介の期間",content:"「3か月でサヨナラ」\n専任・専属専任の上限=3か月",cat:"gyouhou"},
{title:"8種制限の適用条件",content:"「自ら売主・買主シロウト」\n業者が自ら売主+買主が非業者で適用",cat:"gyouhou"},
{title:"普通借地権の期間",content:"「30・20・10のステップダウン」\n最初30年→1回目更新20年→2回目以降10年",cat:"kenri"},
{title:"法定相続分",content:"「配偶者と子は半々」\n配偶者+子=1/2ずつ\n配偶者+直系尊属=2/3:1/3\n配偶者+兄弟姉妹=3/4:1/4",cat:"kenri"},
{title:"遺留分",content:"「直尊だけ3分の1、あとは2分の1」\n直系尊属のみ=1/3、その他=1/2",cat:"kenri"},
{title:"詐欺vs強迫",content:"「詐欺は善無過に負ける、強迫は誰にも勝つ」\n詐欺取消し→善意無過失の第三者に対抗不可\n強迫取消し→誰にでも対抗可",cat:"kenri"},
{title:"建ぺい率の制限なし",content:"「80+防+耐=無制限」\n建ぺい率80%地域+防火地域+耐火建築物\n→建ぺい率の制限なし",cat:"hourei"},
{title:"農地法の条文番号",content:"「3権利・4転用・5転用権利」\n3条=権利移動（許可なし→無効）\n4条=転用\n5条=転用目的の権利移動",cat:"hourei"},
{title:"開発許可の面積",content:"「市街化は1,000、調整は全部」\n市街化区域=1,000㎡以上\n市街化調整区域=原則すべて",cat:"hourei"},
{title:"固定資産税の免税点",content:"「土地サンマン、家屋ニマン」\n土地30万円・家屋20万円・償却資産150万円",cat:"tax"},
{title:"徒歩の換算",content:"「ハチマル（80m）で1分」\n80m=1分。端数は切り上げ。",cat:"tax"},
{title:"地価の基準日",content:"「公示は1月、調査は7月」\n地価公示=1/1基準\n都道府県地価調査=7/1基準",cat:"tax"},
];

/* ═══ OX QUESTIONS ═══ */
const OX={
gyouhou:[
{s:"免許の有効期間は5年である。",a:true,e:"正しい。宅建業法3条2項。",t:"免許制度",f:5},
{s:"非常勤役員は欠格事由の判定対象に含まれない。",a:false,e:"含まれる。非常勤でも「役員」。",t:"免許制度",f:4},
{s:"重要事項説明は契約成立後に行えばよい。",a:false,e:"契約成立「前」に行う。",t:"重要事項説明",f:5},
{s:"37条書面には取引士の記名と押印が必要である。",a:false,e:"2022年改正で押印廃止。記名のみ。",t:"37条書面",f:5},
{s:"クーリング・オフは到達主義で効力が生じる。",a:false,e:"発信主義。書面を発した時に効力発生。",t:"8種制限",f:5},
{s:"営業保証金は有価証券でも供託できる。",a:true,e:"正しい。金銭のほか有価証券でも可。",t:"営業保証金",f:4},
{s:"宅建業者も営業保証金から弁済を受けられる。",a:false,e:"宅建業者は還付対象から除外。",t:"営業保証金",f:4},
{s:"専任媒介契約の有効期間は最長6か月である。",a:false,e:"最長3か月。",t:"媒介契約",f:4},
],
kenri:[
{s:"強迫による取消しは善意の第三者にも対抗できる。",a:true,e:"正しい。詐欺と異なり善意の第三者にも対抗可能。",t:"意思表示",f:5},
{s:"被担保債権が時効消滅しても抵当権は存続する。",a:false,e:"附従性により消滅する。",t:"抵当権",f:4},
{s:"普通借地権の最低存続期間は20年である。",a:false,e:"30年。",t:"借地借家法",f:5},
{s:"一般定期借地権は公正証書でなければ設定できない。",a:false,e:"公正証書「等の書面」。限定されない。",t:"借地借家法",f:5},
{s:"相続放棄をした者の子は代襲相続できる。",a:false,e:"放棄は代襲相続の原因にならない。",t:"相続",f:4},
{s:"配偶者と子が相続人の場合、法定相続分は各1/2である。",a:true,e:"正しい。民法900条1号。",t:"相続",f:5},
{s:"不動産の物権変動の対抗要件は引渡しである。",a:false,e:"不動産は登記。動産が引渡し。",t:"物権変動",f:5},
{s:"取得時効は善意無過失で10年、その他は20年である。",a:true,e:"正しい。民法162条。",t:"時効",f:4},
],
hourei:[
{s:"市街化区域には必ず用途地域を定める。",a:true,e:"正しい。都市計画法13条。",t:"都市計画法",f:5},
{s:"準都市計画区域では用途地域を定められない。",a:false,e:"定められる。",t:"都市計画法",f:3},
{s:"建ぺい率70%の地域で防火地域内の耐火建築物は建ぺい率制限なしである。",a:false,e:"制限なしは80%地域のみ。70%は+10%で80%。",t:"建築基準法",f:5},
{s:"3条許可を受けない農地売買契約は無効である。",a:true,e:"正しい。効力を生じない。",t:"農地法",f:4},
{s:"市街化区域内の農地転用は農業委員会届出で4条許可不要。",a:true,e:"正しい。",t:"農地法",f:4},
{s:"相続による農地取得は届出も不要である。",a:false,e:"許可不要だが届出は必要。",t:"農地法",f:4},
],
tax:[
{s:"不動産取得税は国税である。",a:false,e:"都道府県税（地方税）。",t:"不動産取得税",f:4},
{s:"相続による不動産取得には不動産取得税が課される。",a:false,e:"相続は非課税。",t:"不動産取得税",f:4},
{s:"固定資産税の納税義務者は1月1日現在の所有者である。",a:true,e:"正しい。",t:"固定資産税",f:5},
{s:"固定資産税の免税点は土地20万円である。",a:false,e:"土地30万円。家屋が20万円。",t:"固定資産税",f:4},
{s:"印紙を貼り忘れた契約書は無効になる。",a:false,e:"契約は有効。過怠税が課されるのみ。",t:"印紙税",f:3},
{s:"地価公示の基準日は7月1日である。",a:false,e:"1月1日。7月1日は都道府県地価調査。",t:"地価公示法",f:3},
]};

/* ═══ THEMES ═══ */
const themes={
dark:{bg:"#09090B",bgCard:"rgba(255,255,255,0.04)",bgCardHover:"rgba(255,255,255,0.07)",bgInput:"rgba(255,255,255,0.06)",text:"#FAFAFA",textSec:"#A1A1AA",textTer:"#71717A",border:"rgba(255,255,255,0.07)",borderActive:"rgba(255,255,255,0.16)",accent:"#EF4444",accentSoft:"rgba(239,68,68,0.12)",green:"#22C55E",greenSoft:"rgba(34,197,94,0.12)",blue:"#3B82F6",blueSoft:"rgba(59,130,246,0.10)",amber:"#F59E0B",amberSoft:"rgba(245,158,11,0.12)",teal:"#14B8A6",tealSoft:"rgba(20,184,166,0.10)",shadow:"0 1px 3px rgba(0,0,0,0.5)",glossaryBg:"#1E1E24",glossaryBorder:"rgba(255,255,255,0.1)",termHighlight:"rgba(59,130,246,0.18)",termDot:"#3B82F6",starOn:"#FBBF24",starOff:"rgba(255,255,255,0.1)"},
light:{bg:"#F8F8FA",bgCard:"#FFFFFF",bgCardHover:"#F3F3F6",bgInput:"#F0F0F4",text:"#18181B",textSec:"#52525B",textTer:"#A1A1AA",border:"rgba(0,0,0,0.06)",borderActive:"rgba(0,0,0,0.14)",accent:"#DC2626",accentSoft:"rgba(220,38,38,0.08)",green:"#16A34A",greenSoft:"rgba(22,163,74,0.08)",blue:"#2563EB",blueSoft:"rgba(37,99,235,0.07)",amber:"#D97706",amberSoft:"rgba(217,119,6,0.08)",teal:"#0D9488",tealSoft:"rgba(13,148,136,0.07)",shadow:"0 1px 3px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.03)",glossaryBg:"#FFFFFF",glossaryBorder:"rgba(0,0,0,0.08)",termHighlight:"rgba(37,99,235,0.10)",termDot:"#2563EB",starOn:"#D97706",starOff:"rgba(0,0,0,0.08)"},
};
const CC={gyouhou:t=>({m:t.accent,s:t.accentSoft}),kenri:t=>({m:t.blue,s:t.blueSoft}),hourei:t=>({m:t.teal,s:t.tealSoft}),tax:t=>({m:t.amber,s:t.amberSoft})};
const CATS=[{id:"gyouhou",name:"宅建業法",n:20,desc:"免許・取引士・保証金・重説・37条・8種制限",topics:["免許制度","宅地建物取引士","営業保証金","媒介契約","重要事項説明","37条書面","8種制限","報酬","監督処分","住宅瑕疵担保履行法"]},{id:"kenri",name:"権利関係",n:14,desc:"民法・借地借家法・区分所有法・登記法",topics:["意思表示","代理","時効","物権変動","抵当権","債務不履行","売買","賃貸借","連帯債務","相続","借地借家法","区分所有法","不動産登記法"]},{id:"hourei",name:"法令上の制限",n:8,desc:"都市計画法・建築基準法・農地法",topics:["都市計画法","建築基準法","国土利用計画法","農地法","土地区画整理法","宅地造成等規制法"]},{id:"tax",name:"税・その他",n:8,desc:"取得税・固定資産税・所得税・鑑定評価",topics:["不動産取得税","固定資産税","所得税","印紙税","登録免許税","鑑定評価","地価公示法","住宅金融支援機構","景品表示法"]}];
const DIFF=[{id:"basic",label:"基礎"},{id:"standard",label:"標準"},{id:"advanced",label:"応用"}];
const FL=["","まれ","過去数回","3年に1回","2年に1-2回","ほぼ毎年"];

function buildPrompt(c,d,topics){const dd=d==="basic"?"初学者向け。":d==="standard"?"本試験レベル。":"難問。ひっかけ含む。";return `宅建試験の問題作成専門家として1問作成。\n【科目】${c.name}【範囲】${topics.join("、")}【難易度】${dd}\nJSON形式のみ:\n{"q":"問題文","c":["1","2","3","4"],"a":0,"e":"解説","t":"テーマ","p":"ポイント","f":5}\naは0始まり。fは頻出度1-5。`;}

function getWeightedPreset(catId,history,aiMode){
  const qs=PQ[catId];if(!qs||!qs.length)return null;
  const errTopics={};
  history.filter(h=>h.category===catId&&!h.correct).forEach(h=>{errTopics[h.topic]=(errTopics[h.topic]||0)+1;});
  // BUG-002 FIX: 弱点優先モードで弱点データがない場合はセンチネルオブジェクトを返す
  if(!aiMode&&Object.keys(errTopics).length===0)return {__noWeakness:true};
  if(Object.keys(errTopics).length===0)return qs[Math.floor(Math.random()*qs.length)];
  const weighted=qs.map(q=>{const w=1+(errTopics[q.t]||0)*3;return{q,w};});
  const total=weighted.reduce((s,x)=>s+x.w,0);
  let r=Math.random()*total;for(const x of weighted){r-=x.w;if(r<=0)return x.q;}return qs[0];
}

/* ═══ Components ═══ */
const sortedTerms=Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length);
function AT({text,t:th}){
  if(!text)return null;
  const segs=[];let rem=text;const seen=new Set();
  while(rem.length>0){let ear=null,ei=rem.length;for(const term of sortedTerms){const idx=rem.indexOf(term);if(idx!==-1&&idx<ei){ei=idx;ear=term;}}if(ear){if(ei>0)segs.push({k:"x",v:rem.slice(0,ei)});const first=!seen.has(ear);seen.add(ear);segs.push({k:"w",v:ear,first});rem=rem.slice(ei+ear.length);}else{segs.push({k:"x",v:rem});rem="";}}
  return <span>{segs.map((s,i)=>{if(s.k==="x")return <span key={i}>{s.v}</span>;return <span key={i}><span style={{borderBottom:`1.5px solid ${th.termDot}30`,paddingBottom:"0.5px"}}>{s.v}</span>{s.first&&<span style={{fontSize:"0.75em",color:th.blue,opacity:0.8,fontWeight:500,letterSpacing:"-0.01em"}}>{" = "}{GLOSSARY[s.v]?.replace(/。$/,"")}</span>}</span>;})}</span>;
}
function Stars({count=0,t:th,size=12}){return <span style={{display:"inline-flex",gap:"1px",verticalAlign:"middle"}}>{[1,2,3,4,5].map(i=><Star key={i} size={size} fill={i<=count?th.starOn:"none"} stroke={i<=count?th.starOn:th.starOff} strokeWidth={2}/>)}</span>;}
function Pill({children,active,onClick,t:th}){return <button onClick={onClick} style={{padding:"8px 12px",borderRadius:"10px",border:`1.5px solid ${active?th.borderActive:th.border}`,background:active?th.bgCardHover:"transparent",color:active?th.text:th.textTer,cursor:"pointer",fontSize:"12px",fontWeight:active?650:500,transition:"all 0.2s",flex:1,textAlign:"center"}}>{children}</button>;}

/* ═══ MAIN APP ═══ */
export default function App(){
  const[mode,setMode]=useState(()=>LS.get("mode","light"));

  // テーマ切り替え時に meta theme-color を更新
  useEffect(() => {
    const themeColor = mode === "dark" ? "#09090B" : "#F8F8FA";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColor);
    }
    // iOS Safari 用のステータスバー設定（ダーク時は black-translucent、ライト時は default）
    const metaStatus = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaStatus) {
      metaStatus.setAttribute("content", mode === "dark" ? "black-translucent" : "default");
    }
  }, [mode]);

  const[screen,setScreen]=useState("home");
  const[cat,setCat]=useState(null);
  const[diff,setDiff]=useState(()=>LS.get("diff","standard"));
  const[quiz,setQuiz]=useState(null);
  const[sel,setSel]=useState(null);
  const[revealed,setRevealed]=useState(false);
  const[loading,setLoading]=useState(false);
  const[stats,setStats]=useState(()=>loadStats());
  const[history,setHistory]=useState(()=>LS.get("history",[]));
  const[streak,setStreak]=useState(0);
  const[aiMode,setAiMode]=useState(false);
  const[oxQ,setOxQ]=useState(null);
  const[oxAns,setOxAns]=useState(null);
  const[cardIdx,setCardIdx]=useState(0);
  const[cardFlip,setCardFlip]=useState(false);

  // Persist
  useEffect(()=>{LS.set("mode",mode);},[mode]);
  useEffect(()=>{LS.set("diff",diff);},[diff]);
  useEffect(()=>{LS.set("stats",stats);},[stats]);
  useEffect(()=>{LS.set("history",history);},[history]);

  const t=themes[mode];
  const daysLeft=Math.max(0,Math.ceil((new Date("2026-10-18")-new Date())/86400000));
  const total=stats.c+stats.i;
  const rate=total>0?Math.round(stats.c/total*100):0;

  const go=useCallback(async(catId,difficulty)=>{
    setLoading(true);setQuiz(null);setSel(null);setRevealed(false);
    // BUG-001 FIX: AI生成はCORSエラーのため無効化。常にプリセット問題を使用する。
    // BUG-002 FIX: aiMode=false(弱点優先)の場合に弱点データなしフラグを確認する。
    const p=getWeightedPreset(catId,history,aiMode);
    if(p&&p.__noWeakness){
      setQuiz({__noWeakness:true});
      setLoading(false);return;
    }
    if(p){setQuiz(p);setLoading(false);return;}
    setQuiz({q:"問題の取得に失敗しました。",c:["--","--","--","--"],a:0,e:"",t:"エラー",p:"",f:1});
    setLoading(false);
  },[aiMode,history]);

  const updateStats=(ok)=>{setStats(p=>{const cs=p.bc[cat]||{c:0,i:0};return{...p,c:p.c+(ok?1:0),i:p.i+(ok?0:1),bc:{...p.bc,[cat]:{c:cs.c+(ok?1:0),i:cs.i+(ok?0:1)}}};});};

  const answer=(idx)=>{
    if(revealed)return;setSel(idx);setRevealed(true);const ok=idx===quiz.a;
    updateStats(ok);
    setStreak(p=>ok?p+1:0);
    setHistory(p=>[{category:cat,topic:quiz.t,correct:ok,point:quiz.p,freq:quiz.f||3,ts:Date.now()},...p].slice(0,200));
  };
  const startOx=(catId)=>{const qs=OX[catId];if(!qs||!qs.length)return;setOxQ(qs[Math.floor(Math.random()*qs.length)]);setOxAns(null);};
  const answerOx=(val)=>{
    if(oxAns!==null)return;setOxAns(val);const ok=val===oxQ.a;
    updateStats(ok);
    setHistory(p=>[{category:cat,topic:oxQ.t,correct:ok,point:oxQ.e,freq:oxQ.f||3,ts:Date.now()},...p].slice(0,200));
  };

  const css=`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}@keyframes slideIn{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:translateX(0)}}button{font-family:inherit;}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.2);border-radius:3px}@media(max-width:480px){.quiz-choices{flex:1 1 auto;}}html,body,#root{height:100%;}`;
  const font="'Zen Kaku Gothic New','Outfit',sans-serif";
  const wrap={minHeight:"100dvh",background:t.bg,color:t.text,fontFamily:font,transition:"background 0.35s,color 0.35s",paddingBottom:"env(safe-area-inset-bottom, 24px)",display:"flex",flexDirection:"column"};
  const Header=({left,title})=><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",position:"sticky",top:0,zIndex:10,background:t.bg+"EE",backdropFilter:"blur(12px)",borderBottom:`1px solid ${t.border}`}}><div style={{display:"flex",alignItems:"center",gap:"8px"}}>{left}</div>{title&&<div style={{fontSize:"13px",fontWeight:700,display:"flex",alignItems:"center",gap:"5px"}}>{title}</div>}<button onClick={()=>setMode(m=>m==="dark"?"light":"dark")} style={{width:"34px",height:"34px",borderRadius:"9px",background:t.bgCardHover,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.textSec}}>{mode==="dark"?<Moon size={15}/>:<Sun size={15}/>}</button></div>;
  const Bk=({onClick})=><button onClick={onClick} style={{background:"none",border:"none",color:t.textSec,cursor:"pointer",display:"flex",padding:"4px"}}><ArrowLeft size={18}/></button>;
  const mx={maxWidth:"600px",margin:"0 auto",padding:"16px"};

  /* ── QUIZ SCREEN ── */
  if(screen==="quiz"&&cat){const c=CATS.find(x=>x.id===cat);const cc=CC[cat](t);const Icon=CAT_ICONS[cat];return <div style={wrap}><style>{css}</style><Header left={<Bk onClick={()=>setScreen("home")}/>} title={<><Icon size={14} style={{color:cc.m}}/>{c.name}</>}/><div style={{display:"flex",justifyContent:"center",gap:"12px",padding:"7px 16px",borderBottom:`1px solid ${t.border}`,fontSize:"10px",color:t.textTer}}><span>{DIFF.find(d=>d.id===diff).label}</span><span style={{opacity:.3}}>|</span><span style={{color:t.green}}>{stats.c} 正解</span><span style={{color:t.accent}}>{stats.i} 不正解</span>{streak>=3&&<span style={{color:t.amber,display:"flex",alignItems:"center",gap:"2px"}}><Flame size={11}/>{streak}</span>}</div><div style={{...mx,display:"flex",flexDirection:"column"}}>{loading&&<div style={{textAlign:"center",padding:"70px 0"}}><div style={{width:"30px",height:"30px",border:`3px solid ${t.border}`,borderTopColor:cc.m,borderRadius:"50%",margin:"0 auto 12px",animation:"spin 0.7s linear infinite"}}/><div style={{fontSize:"11px",color:t.textTer,animation:"pulse 1.5s infinite"}}>読み込み中...</div></div>}{quiz&&quiz.__noWeakness&&<div style={{animation:"fadeUp 0.3s",textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:"40px",marginBottom:"12px"}}>🎯</div><div style={{fontSize:"15px",fontWeight:700,color:t.text,marginBottom:"8px"}}>弱点データがありません</div><div style={{fontSize:"12px",color:t.textSec,lineHeight:1.8,marginBottom:"20px"}}>まだ弱点データがありません。問題を解いて弱点を見つけましょう！</div><button onClick={()=>setScreen("home")} style={{padding:"12px 24px",borderRadius:"12px",background:cc.m,color:"#fff",border:"none",cursor:"pointer",fontSize:"13px",fontWeight:700}}>ホームに戻る</button></div>}{quiz&&!quiz.__noWeakness&&<div style={{animation:"fadeUp 0.3s"}}><div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}><span style={{padding:"3px 9px",borderRadius:"7px",background:cc.s,fontSize:"10px",color:cc.m,fontWeight:600,display:"inline-flex",alignItems:"center",gap:"4px"}}><span style={{width:"5px",height:"5px",borderRadius:"50%",background:cc.m}}/>{quiz.t}</span><span style={{padding:"3px 8px",borderRadius:"7px",background:t.amberSoft,display:"inline-flex",alignItems:"center",gap:"4px"}}><Stars count={quiz.f||3} t={t} size={10}/><span style={{color:t.amber,fontWeight:600,fontSize:"9px"}}>{FL[quiz.f||3]}</span></span></div><div style={{padding:"16px",borderRadius:"14px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow,marginBottom:"12px",fontSize:"13.5px",lineHeight:1.85,fontWeight:500}}><AT text={quiz.q} t={t}/></div><div style={{display:"flex",flexDirection:"column",gap:"7px",marginBottom:"12px"}}>{quiz.c.map((ch,idx)=>{const isC=idx===quiz.a,isS=idx===sel;let bg=t.bgCard,bd=`1.5px solid ${t.border}`,nBg=t.bgInput,nCol=t.textTer;if(revealed){if(isC){bg=t.greenSoft;bd=`1.5px solid ${t.green}40`;nBg=t.green;nCol="#fff";}else if(isS){bg=t.accentSoft;bd=`1.5px solid ${t.accent}40`;nBg=t.accent;nCol="#fff";}}return <button key={idx} onClick={()=>answer(idx)} disabled={revealed} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"12px 14px",borderRadius:"12px",background:bg,border:bd,cursor:revealed?"default":"pointer",textAlign:"left",color:t.text,fontSize:"13px",lineHeight:1.75,boxShadow:t.shadow,animation:revealed?`slideIn 0.2s ease ${idx*0.04}s both`:"none"}}><span style={{minWidth:"25px",height:"25px",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",background:nBg,color:nCol,fontSize:"11px",fontWeight:700,flexShrink:0,marginTop:"1px"}}>{revealed&&isC?<Check size={13}/>:revealed&&isS?<X size={13}/>:idx+1}</span><span style={{fontWeight:500}}><AT text={ch} t={t}/></span></button>;})}</div>{revealed&&<div style={{animation:"fadeUp 0.3s"}}><div style={{textAlign:"center",padding:"12px",borderRadius:"12px",marginBottom:"8px",background:sel===quiz.a?t.greenSoft:t.accentSoft,border:`1.5px solid ${sel===quiz.a?t.green+"30":t.accent+"30"}`}}>{sel===quiz.a?<CheckCircle2 size={24} style={{color:t.green}}/>:<XCircle size={24} style={{color:t.accent}}/>}<div style={{fontSize:"14px",fontWeight:700,marginTop:"3px",color:sel===quiz.a?t.green:t.accent}}>{sel===quiz.a?"正解":"不正解"}</div></div><div style={{padding:"14px",borderRadius:"12px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow,marginBottom:"8px"}}><div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",fontWeight:700,color:t.amber,marginBottom:"5px"}}><BookOpen size={12}/>解説</div><div style={{fontSize:"12px",lineHeight:1.9,color:t.textSec}}><AT text={quiz.e} t={t}/></div></div>{quiz.p&&<div style={{padding:"11px 13px",borderRadius:"10px",background:t.blueSoft,border:`1px solid ${t.blue}20`,marginBottom:"8px"}}><div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",fontWeight:700,color:t.blue,marginBottom:"2px"}}><Lightbulb size={12}/>ポイント</div><div style={{fontSize:"11px",lineHeight:1.7,color:t.textSec}}><AT text={quiz.p} t={t}/></div></div>}<div style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 12px",borderRadius:"8px",background:t.amberSoft,marginBottom:"12px"}}><Stars count={quiz.f||3} t={t} size={12}/><span style={{fontSize:"10px",color:t.amber,fontWeight:600}}>頻出度 {quiz.f||3}/5</span></div><button onClick={()=>go(cat,diff)} style={{width:"100%",padding:"13px",borderRadius:"12px",background:cc.m,color:"#fff",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>次の問題 <ChevronRight size={16}/></button></div>}</div>}</div></div>;}

  /* ── OX CATEGORY SELECT SCREEN (BUG-003 FIX) ── */
  if(screen==="ox-select"){return <div style={wrap}><style>{css}</style><Header left={<Bk onClick={()=>setScreen("home")}/>} title={<><Layers size={14}/>OX 一問一答</>}/><div style={mx}><div style={{fontSize:"14px",fontWeight:700,color:t.text,marginBottom:"16px",textAlign:"center"}}>科目を選んでください</div>{CATS.map((c,ci)=>{const cc=CC[c.id](t);const Icon=CAT_ICONS[c.id];return <button key={c.id} onClick={()=>{setCat(c.id);setScreen("ox");startOx(c.id);}} style={{display:"flex",alignItems:"center",gap:"11px",padding:"14px",borderRadius:"14px",background:t.bgCard,border:`1.5px solid ${t.border}`,boxShadow:t.shadow,cursor:"pointer",textAlign:"left",color:t.text,width:"100%",marginBottom:"8px",animation:`fadeUp 0.3s ease ${ci*0.04}s both`}}><div style={{width:"38px",height:"38px",borderRadius:"10px",background:cc.s,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:cc.m}}><Icon size={18}/></div><div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:700}}>{c.name}</div><div style={{fontSize:"10px",color:t.textTer}}>{OX[c.id]?.length||0}問収録</div></div><ChevronRight size={16} style={{color:t.textTer}}/></button>;})}</div></div>;}

  /* ── OX SCREEN ── */
  if(screen==="ox"&&cat){const c=CATS.find(x=>x.id===cat);const cc=CC[cat](t);const Icon=CAT_ICONS[cat];return <div style={wrap}><style>{css}</style><Header left={<Bk onClick={()=>setScreen("home")}/>} title={<><Icon size={14} style={{color:cc.m}}/>OX {c.name}</>}/><div style={mx}>{oxQ?<div style={{animation:"fadeUp 0.3s"}}><div style={{padding:"3px 9px",borderRadius:"7px",background:cc.s,fontSize:"10px",color:cc.m,fontWeight:600,display:"inline-flex",alignItems:"center",gap:"4px",marginBottom:"10px"}}><span style={{width:"5px",height:"5px",borderRadius:"50%",background:cc.m}}/>{oxQ.t}</div><div style={{padding:"20px",borderRadius:"14px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow,marginBottom:"16px",fontSize:"15px",lineHeight:1.85,fontWeight:500,textAlign:"center",minHeight:"100px",display:"flex",alignItems:"center",justifyContent:"center"}}><AT text={oxQ.s} t={t}/></div>{oxAns===null?<div style={{display:"flex",gap:"10px"}}><button onClick={()=>answerOx(true)} style={{flex:1,padding:"18px",borderRadius:"14px",background:t.greenSoft,border:`2px solid ${t.green}30`,cursor:"pointer",fontSize:"18px",fontWeight:800,color:t.green,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}><Check size={28}/>正しい</button><button onClick={()=>answerOx(false)} style={{flex:1,padding:"18px",borderRadius:"14px",background:t.accentSoft,border:`2px solid ${t.accent}30`,cursor:"pointer",fontSize:"18px",fontWeight:800,color:t.accent,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}><X size={28}/>誤り</button></div>:<div style={{animation:"fadeUp 0.3s"}}><div style={{textAlign:"center",padding:"14px",borderRadius:"12px",marginBottom:"10px",background:oxAns===oxQ.a?t.greenSoft:t.accentSoft}}><div style={{fontSize:"15px",fontWeight:700,color:oxAns===oxQ.a?t.green:t.accent}}>{oxAns===oxQ.a?"正解":"不正解"}</div><div style={{fontSize:"12px",color:t.textSec,marginTop:"4px"}}>正解は「{oxQ.a?"正しい":"誤り"}」</div></div><div style={{padding:"12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,marginBottom:"12px",fontSize:"12px",lineHeight:1.8,color:t.textSec}}><AT text={oxQ.e} t={t}/></div><button onClick={()=>startOx(cat)} style={{width:"100%",padding:"13px",borderRadius:"12px",background:cc.m,color:"#fff",border:"none",cursor:"pointer",fontSize:"14px",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>次の問題 <ChevronRight size={16}/></button></div>}</div>:<div style={{textAlign:"center",padding:"40px",color:t.textTer}}>問題がありません</div>}</div></div>;}

  /* ── FLASHCARDS ── */
  if(screen==="cards"){const filtered=cat?MNEMONICS.filter(m=>m.cat===cat):MNEMONICS;const card=filtered[cardIdx%filtered.length];const cc=CC[card?.cat||"gyouhou"](t);return <div style={wrap}><style>{css}</style><Header left={<Bk onClick={()=>{setScreen("home");setCardIdx(0);setCardFlip(false);}}/>} title={<><CreditCard size={14}/>暗記カード</>}/><div style={mx}><div style={{textAlign:"center",fontSize:"11px",color:t.textTer,marginBottom:"12px"}}>{(cardIdx%filtered.length)+1} / {filtered.length}</div><div onClick={()=>setCardFlip(!cardFlip)} style={{padding:"28px 20px",borderRadius:"16px",background:cardFlip?t.blueSoft:t.bgCard,border:`1.5px solid ${cardFlip?t.blue+"30":t.border}`,boxShadow:t.shadow,cursor:"pointer",minHeight:"200px",display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center",transition:"all 0.3s",marginBottom:"14px"}}>{!cardFlip?<><div style={{fontSize:"10px",color:cc.m,fontWeight:600,marginBottom:"8px"}}>{CATS.find(c=>c.id===card.cat)?.name}</div><div style={{fontSize:"17px",fontWeight:700,lineHeight:1.5}}>{card.title}</div><div style={{fontSize:"10px",color:t.textTer,marginTop:"12px"}}>タップでめくる</div></>:<><div style={{fontSize:"14px",lineHeight:1.9,whiteSpace:"pre-line",color:t.textSec}}><AT text={card.content} t={t}/></div></>}</div><div style={{display:"flex",gap:"8px"}}><button onClick={()=>{setCardIdx(i=>Math.max(0,i-1));setCardFlip(false);}} style={{flex:1,padding:"12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,cursor:"pointer",color:t.textSec,fontSize:"13px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}><ArrowLeft size={14}/>前</button><button onClick={()=>{setCardIdx(i=>i+1);setCardFlip(false);}} style={{flex:1,padding:"12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,cursor:"pointer",color:t.textSec,fontSize:"13px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}>次<ChevronRight size={14}/></button></div></div></div>;}

  /* ── PLANNER ── */
  if(screen==="planner"){const totalHours=400;const hoursPerDay=Math.ceil(totalHours/Math.max(daysLeft,1)*10)/10;const phases=[{name:"基礎固め",pct:30,desc:"テキスト通読 + 一問一答",months:"3-5月"},{name:"問題演習",pct:40,desc:"過去問 + AI問題演習",months:"5-8月"},{name:"直前対策",pct:30,desc:"模試 + 弱点集中",months:"8-10月"}];const catAlloc=[{id:"gyouhou",name:"宅建業法",pct:35,reason:"20問/50問。最も配点が高く得点源にしやすい"},{id:"kenri",name:"権利関係",pct:30,reason:"14問/50問。民法は範囲広いが頻出テーマ集中攻略"},{id:"hourei",name:"法令上の制限",pct:20,reason:"8問/50問。暗記中心で直前期に伸びやすい"},{id:"tax",name:"税・その他",pct:15,reason:"8問/50問。統計・金融は直前暗記で対応"}];return <div style={wrap}><style>{css}</style><Header left={<Bk onClick={()=>setScreen("home")}/>} title={<><GraduationCap size={14}/>学習プラン</>}/><div style={mx}><div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:"11px",color:t.textTer,marginBottom:"4px"}}>試験日 2026年10月18日</div><div style={{fontFamily:"'Outfit'",fontSize:"36px",fontWeight:800,color:t.accent}}>{daysLeft}</div><div style={{fontSize:"11px",color:t.textTer}}>日</div></div><div style={{padding:"14px",borderRadius:"12px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow,marginBottom:"14px"}}><div style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"12px",fontWeight:700,color:t.text,marginBottom:"8px"}}><Clock size={13}/>必要学習ペース</div><div style={{fontSize:"11px",color:t.textSec,lineHeight:1.8}}>合格に必要な学習時間の目安は約{totalHours}時間。残り{daysLeft}日で割ると、1日あたり約<span style={{fontWeight:700,color:t.accent}}>{hoursPerDay}時間</span>。通勤や隙間時間を活用すれば十分到達可能です。</div></div><div style={{fontSize:"12px",fontWeight:700,marginBottom:"8px",display:"flex",alignItems:"center",gap:"4px",color:t.text}}><TrendingUp size={13}/>学習フェーズ</div>{phases.map((ph,i)=><div key={i} style={{padding:"12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,marginBottom:"6px",boxShadow:t.shadow}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}><span style={{fontSize:"12px",fontWeight:700}}>{ph.name}</span><span style={{fontSize:"10px",color:t.textTer}}>{ph.months} / {Math.round(totalHours*ph.pct/100)}h</span></div><div style={{fontSize:"10px",color:t.textSec}}>{ph.desc}</div><div style={{height:"3px",borderRadius:"2px",background:t.bgInput,marginTop:"6px"}}><div style={{height:"100%",width:`${ph.pct}%`,borderRadius:"2px",background:t.teal}}/></div></div>)}<div style={{fontSize:"12px",fontWeight:700,marginTop:"14px",marginBottom:"8px",display:"flex",alignItems:"center",gap:"4px",color:t.text}}><Target size={13}/>科目別 時間配分</div>{catAlloc.map(ca=>{const cc2=CC[ca.id](t);const Icon=CAT_ICONS[ca.id];return <div key={ca.id} style={{padding:"12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,marginBottom:"6px",boxShadow:t.shadow}}><div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px"}}><Icon size={12} style={{color:cc2.m}}/><span style={{fontSize:"12px",fontWeight:700}}>{ca.name}</span><span style={{fontSize:"10px",color:cc2.m,fontWeight:600,marginLeft:"auto"}}>{ca.pct}% / {Math.round(totalHours*ca.pct/100)}h</span></div><div style={{fontSize:"10px",color:t.textSec,lineHeight:1.6}}>{ca.reason}</div><div style={{height:"3px",borderRadius:"2px",background:t.bgInput,marginTop:"5px"}}><div style={{height:"100%",width:`${ca.pct}%`,borderRadius:"2px",background:cc2.m}}/></div></div>;})}</div></div>;}

  /* ── HISTORY/REPORT ── */
  if(screen==="history"){const mistakes=history.filter(h=>!h.correct);const sortedM=[...mistakes].sort((a,b)=>(b.freq||3)-(a.freq||3));const dueForReview=mistakes.filter(h=>Date.now()-h.ts>86400000);return <div style={wrap}><style>{css}</style><Header left={<Bk onClick={()=>setScreen("home")}/>} title={<><BarChart3 size={14}/>学習レポート</>}/><div style={mx}><div style={{textAlign:"center",padding:"16px 0 12px"}}><div style={{position:"relative",width:"90px",height:"90px",margin:"0 auto"}}><svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="38" fill="none" stroke={t.border} strokeWidth="6"/><circle cx="45" cy="45" r="38" fill="none" stroke={rate>=70?t.green:rate>=40?t.amber:t.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${rate*2.39} ${239-rate*2.39}`} transform="rotate(-90 45 45)" style={{transition:"stroke-dasharray 0.8s"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:"22px",fontWeight:800,fontFamily:"'Outfit'"}}>{rate}</span><span style={{fontSize:"9px",color:t.textTer}}>%</span></div></div><div style={{fontSize:"10px",color:t.textTer,marginTop:"4px"}}>{stats.c} 正解 / {total} 問（今週）</div></div>{(()=>{const archive=LS.get("statsArchive",[]);return archive.length>0?<div style={{padding:"10px 12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"10px",fontWeight:700,color:t.text,marginBottom:"6px"}}><TrendingUp size={12}/>過去の週間成績</div>{archive.slice(-4).reverse().map((w,i)=>{const wt=w.c+w.i;const wr=wt>0?Math.round(w.c/wt*100):0;return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<Math.min(archive.length,4)-1?`1px solid ${t.border}`:"none"}}><span style={{fontSize:"10px",color:t.textTer}}>{w.week||"--"}</span><span style={{fontSize:"10px"}}><span style={{color:t.green,fontWeight:600}}>{w.c}</span><span style={{color:t.textTer}}> / {wt} 問</span><span style={{marginLeft:"6px",fontWeight:700,color:wr>=70?t.green:wr>=40?t.amber:t.accent}}>{wr}%</span></span></div>})}</div>:null;})()}{dueForReview.length>0&&<div style={{padding:"10px 12px",borderRadius:"10px",background:t.amberSoft,border:`1px solid ${t.amber}20`,marginBottom:"12px",display:"flex",alignItems:"center",gap:"6px"}}><Repeat size={14} style={{color:t.amber,flexShrink:0}}/><div style={{fontSize:"11px",color:t.amber,fontWeight:600}}>{dueForReview.length}件の復習が必要</div></div>}{total>=5&&<div style={{padding:"12px",borderRadius:"12px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"11px",fontWeight:700,color:t.text,marginBottom:"6px"}}><Brain size={13}/>弱点分析</div>{(()=>{const topicErr={};history.filter(h=>!h.correct).forEach(h=>{topicErr[h.topic]=(topicErr[h.topic]||0)+1;});const sorted=Object.entries(topicErr).sort((a,b)=>b[1]-a[1]).slice(0,3);return sorted.length>0?<div style={{fontSize:"11px",color:t.textSec,lineHeight:1.8}}>間違いが多いテーマ：{sorted.map(([topic,count],i)=><span key={i}><span style={{fontWeight:700,color:t.accent}}>{topic}</span>({count}回){i<sorted.length-1?"、":""}</span>)}<div style={{marginTop:"4px",fontSize:"10px",color:t.textTer}}>次の出題でこれらのテーマが優先されます</div></div>:<div style={{fontSize:"11px",color:t.textTer}}>データ不足</div>;})()}</div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"16px"}}>{CATS.map(c=>{const cs=stats.bc[c.id]||{c:0,i:0};const ct=cs.c+cs.i,cr=ct>0?Math.round(cs.c/ct*100):0;const cc=CC[c.id](t);const Icon=CAT_ICONS[c.id];return <div key={c.id} style={{padding:"12px",borderRadius:"12px",background:t.bgCard,border:`1px solid ${t.border}`,boxShadow:t.shadow}}><div style={{fontSize:"10px",color:cc.m,fontWeight:600,marginBottom:"4px",display:"flex",alignItems:"center",gap:"3px"}}><Icon size={11}/>{c.name}</div><div style={{fontFamily:"'Outfit'",fontSize:"24px",fontWeight:800}}>{cr}<span style={{fontSize:"11px",fontWeight:500,color:t.textTer}}>%</span></div><div style={{fontSize:"9px",color:t.textTer}}>{cs.c}/{ct} 問</div>{ct>0&&<div style={{height:"3px",borderRadius:"2px",background:t.bgInput,marginTop:"6px"}}><div style={{height:"100%",width:`${cr}%`,borderRadius:"2px",background:cr>=70?t.green:cr>=40?t.amber:t.accent}}/></div>}</div>;})}</div><div style={{fontSize:"12px",fontWeight:700,marginBottom:"6px",display:"flex",alignItems:"center",gap:"4px",color:t.textSec}}><FileText size={13}/>復習ポイント（頻出度順）</div>{sortedM.length>0?sortedM.slice(0,8).map((h,i)=>{const cc2=CC[h.category](t);const I2=CAT_ICONS[h.category];return <div key={i} style={{padding:"10px 12px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,marginBottom:"6px",boxShadow:t.shadow}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"3px"}}><div style={{fontSize:"9px",fontWeight:600,color:cc2.m,display:"flex",alignItems:"center",gap:"3px"}}><I2 size={9}/>{CATS.find(c=>c.id===h.category)?.name} / {h.topic}</div><Stars count={h.freq||3} t={t} size={9}/></div><div style={{fontSize:"11px",lineHeight:1.7,color:t.textSec}}><AT text={h.point} t={t}/></div></div>;}):<div style={{textAlign:"center",padding:"16px",color:t.textTer,fontSize:"11px"}}>{total===0?"問題を解いてみましょう":"全問正解です"}</div>}<button onClick={()=>{setStats({c:0,i:0,bc:{},week:getWeekId()});setHistory([]);}} style={{marginTop:"12px",width:"100%",padding:"10px",borderRadius:"10px",background:"transparent",border:`1px solid ${t.border}`,color:t.textTer,cursor:"pointer",fontSize:"11px"}}>学習データをリセット</button></div></div>;}

  /* ── HOME ── */
  return <div style={wrap}><style>{css}</style><Header left={<div style={{fontSize:"17px",fontWeight:800,fontFamily:"'Outfit'"}}>宅建<span style={{color:t.accent}}>ドリル</span></div>}/><div style={{maxWidth:"600px",margin:"0 auto",padding:"0 16px"}}><div style={{padding:"20px 0 14px",textAlign:"center"}}><div style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 12px",borderRadius:"18px",background:t.accentSoft,fontSize:"10px",fontWeight:600,color:t.accent,marginBottom:"8px"}}><Calendar size={11}/>試験まであと {daysLeft} 日</div><h1 style={{fontSize:"19px",fontWeight:800,lineHeight:1.3}}>AIで宅建合格を<br/>つかみ取ろう</h1></div>{total>0&&<div style={{marginBottom:"14px"}}><div style={{fontSize:"9px",color:t.textTer,textAlign:"center",marginBottom:"4px"}}>-- 今週の成績（毎週月曜リセット） --</div><div style={{display:"flex",borderRadius:"12px",overflow:"hidden",border:`1px solid ${t.border}`,boxShadow:t.shadow}}>{[{l:"正解",v:stats.c,c:t.green},{l:"不正解",v:stats.i,c:t.accent},{l:"正答率",v:rate+"%",c:rate>=70?t.green:rate>=40?t.amber:t.accent}].map((s,i)=><div key={i} style={{flex:1,padding:"11px 0",textAlign:"center",background:t.bgCard,borderRight:i<2?`1px solid ${t.border}`:"none"}}><div style={{fontFamily:"'Outfit'",fontSize:"18px",fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:"8px",color:t.textTer,marginTop:"1px"}}>{s.l}</div></div>)}</div></div>}<div style={{display:"flex",gap:"6px",marginBottom:"10px"}}><Pill t={t} active={aiMode} onClick={()=>setAiMode(true)}><span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}><Zap size={12}/>AI生成<span style={{fontSize:"8px",opacity:0.6}}>(準備中)</span></span></Pill><Pill t={t} active={!aiMode} onClick={()=>setAiMode(false)}><span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}}><Target size={12}/>弱点優先</span></Pill></div><div style={{display:"flex",gap:"6px",marginBottom:"14px"}}>{DIFF.map(d=><Pill key={d.id} t={t} active={diff===d.id} onClick={()=>setDiff(d.id)}>{d.label}</Pill>)}</div><div style={{fontSize:"10px",fontWeight:600,color:t.textTer,marginBottom:"6px"}}>科目を選んで開始</div>{CATS.map((c,ci)=>{const cs=stats.bc[c.id]||{c:0,i:0};const ct=cs.c+cs.i,cr=ct>0?Math.round(cs.c/ct*100):0;const cc=CC[c.id](t);const Icon=CAT_ICONS[c.id];return <button key={c.id} onClick={()=>{setCat(c.id);setScreen("quiz");go(c.id,diff);}} style={{display:"flex",alignItems:"center",gap:"11px",padding:"13px",borderRadius:"14px",background:t.bgCard,border:`1.5px solid ${t.border}`,boxShadow:t.shadow,cursor:"pointer",textAlign:"left",color:t.text,width:"100%",marginBottom:"7px",animation:`fadeUp 0.3s ease ${ci*0.04}s both`}}><div style={{width:"40px",height:"40px",borderRadius:"11px",background:cc.s,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:cc.m}}><Icon size={20}/></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"1px"}}><span style={{fontSize:"13px",fontWeight:700}}>{c.name}</span><span style={{fontSize:"9px",color:cc.m,background:cc.s,padding:"1px 6px",borderRadius:"5px",fontWeight:600}}>{c.n}問</span></div><div style={{fontSize:"10px",color:t.textTer,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.desc}</div></div>{ct>0&&<div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:"'Outfit'",fontSize:"16px",fontWeight:800,color:cr>=70?t.green:cr>=40?t.amber:t.accent}}>{cr}%</div><div style={{fontSize:"9px",color:t.textTer}}>{ct}問</div></div>}<ChevronRight size={16} style={{color:t.textTer,flexShrink:0}}/></button>;})}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginTop:"7px",marginBottom:"7px"}}><button onClick={()=>setScreen("ox-select")} style={{padding:"14px 12px",borderRadius:"12px",background:t.bgCard,border:`1.5px solid ${t.border}`,boxShadow:t.shadow,cursor:"pointer",color:t.textSec,fontSize:"12px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><Layers size={14}/>OX 一問一答</button><button onClick={()=>{setScreen("cards");setCardIdx(0);setCardFlip(false);}} style={{padding:"14px 12px",borderRadius:"12px",background:t.bgCard,border:`1.5px solid ${t.border}`,boxShadow:t.shadow,cursor:"pointer",color:t.textSec,fontSize:"12px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><CreditCard size={14}/>暗記カード</button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px",marginBottom:"14px"}}><button onClick={()=>setScreen("planner")} style={{padding:"14px 12px",borderRadius:"12px",background:t.bgCard,border:`1.5px solid ${t.border}`,boxShadow:t.shadow,cursor:"pointer",color:t.textSec,fontSize:"12px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><GraduationCap size={14}/>学習プラン</button><button onClick={()=>setScreen("history")} style={{padding:"14px 12px",borderRadius:"12px",background:t.bgCard,border:`1.5px solid ${t.border}`,boxShadow:t.shadow,cursor:"pointer",color:t.textSec,fontSize:"12px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><BarChart3 size={14}/>レポート</button></div><div style={{padding:"10px",borderRadius:"10px",background:t.bgCard,border:`1px solid ${t.border}`,fontSize:"9px",color:t.textTer,lineHeight:1.8}}><strong style={{color:t.textSec}}>試験情報</strong> 50問 / 四肢択一 / 合格ライン約35点 / 合格率15-18%</div><div style={{height:"20px"}}/></div></div>;
}
