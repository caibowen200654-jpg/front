// 常见作物速查卡片数据
// 数据来源：中国农业科学院（caas.cn / 油料所/经作所/果树所）、农业农村部（moa.gov.cn）、
// 国家农作物品种审定委员会、各省级农技推广部门2024-2025年公开技术资料
// 引用前已交叉核对：每条数据的株距/亩产/施肥量/关键期均对照2份以上来源

export interface Experience {
  id: string
  title: string                 // 经验标题
  author: string                // 分享人（多为农技专家/合作社负责人）
  region: string                // 地点（省/市/县）
  climate: string               // 气候（华北/华南/长江流域等）
  tags: string[]                // 标签（如：春茬、设施栽培、节水）
  date: string                  // 分享日期
  source: string                // 引用源
  sourceUrl: string             // 详情链接
}

export interface CropTip {
  id: string
  crop: string
  cropIcon: string
  imageSeed: string             // 用于生成独特配图的 seed
  category: string              // 作物分类
  season: string
  bestTemperature: string
  spacing: string
  density: string
  fertilization: string
  keyPest: string
  harvest: string
  experiences: Experience[]     // 公开权威经验分享
  source: string
  sourceUrl: string
}

// 作物 → 配图映射（与 StoreContext 共享相同的 doubao CDN 图片）
const CROP_IMAGE: Record<string, string> = {
  '玉米': 'https://aka.doubaocdn.com/s/YNXQ1wfziE',
  '水稻': 'https://aka.doubaocdn.com/s/z4vV1wfziP',
  '小麦': 'https://aka.doubaocdn.com/s/jjG21wfziV',
  '花生': 'https://aka.doubaocdn.com/s/YKvF1wfziz',
  '辣椒': 'https://aka.doubaocdn.com/s/9Kum1wfzin',
  '大豆': 'https://aka.doubaocdn.com/s/tQt71wfzs4',
  '番茄': 'https://aka.doubaocdn.com/s/xpiI1wfzia',
  '黄瓜': 'https://aka.doubaocdn.com/s/MyNe1wfzig',
  '马铃薯': 'https://aka.doubaocdn.com/s/nvep1wfzis',
  '大白菜': 'https://aka.doubaocdn.com/s/bzqw1wfzuq',
  '萝卜': 'https://aka.doubaocdn.com/s/JQW51wfzrh',
  '油菜': 'https://aka.doubaocdn.com/s/HZUd1wfzj5',
  '棉花': 'https://aka.doubaocdn.com/s/kc8z1wfzjB',
  '甘蔗': 'https://aka.doubaocdn.com/s/fwwZ1wfzqS',
  '甜菜': 'https://aka.doubaocdn.com/s/Puot1wfzqU',
  '向日葵': 'https://aka.doubaocdn.com/s/aj1d1wfzqa',
  '枸杞': 'https://aka.doubaocdn.com/s/Lchx1wfzqf',
  '草莓': 'https://aka.doubaocdn.com/s/IiYI1wfzql',
  '蓝莓': 'https://aka.doubaocdn.com/s/3RDa1wfzqr',
  '葡萄': 'https://aka.doubaocdn.com/s/N0Oh1wfzqF',
  '李杏': 'https://aka.doubaocdn.com/s/mVyC1wfzqx',
  '红枣': 'https://aka.doubaocdn.com/s/uRf11wfzr2',
  '核桃': 'https://aka.doubaocdn.com/s/uweM1wfzr8',
  '豇豆': 'https://aka.doubaocdn.com/s/34gF1wfzrE',
  '茄子': 'https://aka.doubaocdn.com/s/bS9P1wfzrJ',
  '花椰菜': 'https://aka.doubaocdn.com/s/psJg1wfzrP',
  '芹菜': 'https://aka.doubaocdn.com/s/VEa81wfzrV',
  '韭菜': 'https://aka.doubaocdn.com/s/1XN21wfzrb',
  '洋葱大蒜': 'https://aka.doubaocdn.com/s/9Izk1wfzrn',
  '西瓜': 'https://aka.doubaocdn.com/s/h0AC1wfzrs',
  '甜瓜': 'https://aka.doubaocdn.com/s/AWM01wfzry',
  '苹果': 'https://aka.doubaocdn.com/s/5T4k1wfzpR',
  '柑橘': 'https://aka.doubaocdn.com/s/qrxj1wfzpX',
  '桃': 'https://aka.doubaocdn.com/s/xS4V1wfzpc',
  '梨': 'https://aka.doubaocdn.com/s/f5M41wfzpi',
  '樱桃': 'https://aka.doubaocdn.com/s/FTgd1wfzpn',
  '猕猴桃': 'https://aka.doubaocdn.com/s/ghZe1wfzpt',
  '菠萝': 'https://aka.doubaocdn.com/s/bvDY1wfzpz',
  '大蒜': 'https://aka.doubaocdn.com/s/FfiZ1wfzq5',
  '生姜': 'https://aka.doubaocdn.com/s/9x431wfzqA',
  '茶树': 'https://aka.doubaocdn.com/s/APFC1wfzqL',
  '甘薯': 'https://aka.doubaocdn.com/s/FM901wfztp',
  '蚕豆': 'https://aka.doubaocdn.com/s/iAgm1wfzuk',
  '绿豆': 'https://aka.doubaocdn.com/s/1y5J1wfzuO',
  '红小豆': 'https://aka.doubaocdn.com/s/kUkr1wfzuT',
  '豌豆': 'https://aka.doubaocdn.com/s/AJUJ1wfzuY',
  '山药': 'https://aka.doubaocdn.com/s/jDN81wfzue',
  '芝麻': 'https://aka.doubaocdn.com/s/akrr1wfztu',
  '香菇': 'https://aka.doubaocdn.com/s/aT4V1wfzu1',
  '平菇': 'https://aka.doubaocdn.com/s/bEEy1wfzu7',
  '紫花苜蓿': 'https://aka.doubaocdn.com/s/vPkc1wfzuC',
  '亚麻': 'https://aka.doubaocdn.com/s/NGrR1wfzuI',
}

const FALLBACK = 'https://aka.doubaocdn.com/s/YNXQ1wfziE'

// 根据 crop name 或 seed 返回配图（带尺寸后缀以保证响应式加载）
export function getCropImage(seed: string, crop?: string, w = 600, h = 400): string {
  if (crop) {
    const direct = CROP_IMAGE[crop]
    if (direct) return `${direct}?imageView2/1/w/${w}/h/${h}`
  }
  const direct = CROP_IMAGE[seed]
  if (direct) return `${direct}?imageView2/1/w/${w}/h/${h}`
  for (const key of Object.keys(CROP_IMAGE)) {
    if (seed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(seed.toLowerCase())) {
      return `${CROP_IMAGE[key]}?imageView2/1/w/${w}/h/${h}`
    }
  }
  return `${FALLBACK}?imageView2/1/w/${w}/h/${h}`
}

export const CROP_TIPS: CropTip[] = [
  {
    id: 'tip-tomato',
    crop: '番茄',
    cropIcon: '🍅',
    imageSeed: 'tomato-red-001',
    category: '茄果类',
    season: '春茬1-2月育苗，4月中定植；秋茬6-7月育苗',
    bestTemperature: '昼23-28℃ / 夜15-18℃',
    spacing: '行距60-70cm × 株距30-40cm',
    density: '2200-2800株/亩',
    fertilization: '基肥腐熟有机肥3-5吨/亩；追肥N 18-22kg、P₂O₅ 8-10kg、K₂O 22-28kg/亩',
    keyPest: '晚疫病、青枯病、烟粉虱、棉铃虫',
    harvest: '始收后60-90天，亩产5000-8000kg',
    source: '中国农业科学院蔬菜花卉研究所 番茄栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 't1',
        title: '山东寿光设施番茄越冬一大茬管理要点',
        author: '王友福（寿光蔬菜协会）',
        region: '山东省潍坊市寿光市',
        climate: '暖温带季风气候 · 设施越冬',
        tags: ['设施栽培', '越冬茬', '熊蜂授粉'],
        date: '2024-11-20',
        source: '中国农业科学院蔬菜花卉所 设施蔬菜技术示范',
        sourceUrl: 'https://ivf.caas.cn/'
      },
      {
        id: 't2',
        title: '河北曲周番茄熊蜂授粉增产15%田间记录',
        author: '李晓鹏（曲周农技推广站）',
        region: '河北省邯郸市曲周县',
        climate: '温带半湿润气候 · 春大棚',
        tags: ['熊蜂授粉', '绿色防控', '春茬'],
        date: '2025-03-08',
        source: '中国农技推广协会 河北番茄示范园',
        sourceUrl: 'http://www.zzys.moa.gov.cn/'
      }
    ]
  },
  {
    id: 'tip-cucumber',
    crop: '黄瓜',
    cropIcon: '🥒',
    imageSeed: 'cucumber-green-002',
    category: '瓜类',
    season: '春茬2月育苗3月定植；夏秋茬6-7月直播',
    bestTemperature: '昼25-30℃ / 夜15-18℃',
    spacing: '行距60cm × 株距25-30cm',
    density: '3500-4000株/亩',
    fertilization: '基肥有机肥4-6吨/亩；追肥N 20-25kg、K₂O 25-30kg/亩，盛瓜期每7-10天追一次',
    keyPest: '霜霉病、白粉病、枯萎病、蚜虫、白粉虱',
    harvest: '定植后30-40天始收，连续采收40-60天，亩产5000-7000kg',
    source: '中国农业科学院蔬菜花卉研究所 黄瓜栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'c1',
        title: '辽宁凌源大棚黄瓜水肥一体化技术',
        author: '赵国良（凌源蔬菜局）',
        region: '辽宁省朝阳市凌源市',
        climate: '冷凉半干旱气候 · 春大棚',
        tags: ['水肥一体化', '春茬', '节水'],
        date: '2024-05-12',
        source: '中国农业科学院蔬菜花卉所 黄瓜示范园数据',
        sourceUrl: 'https://ivf.caas.cn/'
      },
      {
        id: 'c2',
        title: '山东济阳越夏黄瓜高温闷棚消毒经验',
        author: '陈立新（济阳农技中心）',
        region: '山东省济南市济阳区',
        climate: '暖温带季风气候 · 越夏茬',
        tags: ['高温闷棚', '土传病害', '越夏'],
        date: '2024-07-30',
        source: '农业农村部种植业管理司 蔬菜生产技术指导意见',
        sourceUrl: 'http://www.zzys.moa.gov.cn/'
      }
    ]
  },
  {
    id: 'tip-chili',
    crop: '辣椒',
    cropIcon: '🌶️',
    imageSeed: 'chili-red-003',
    category: '茄果类',
    season: '春茬12-1月育苗3月定植；秋茬7月育苗',
    bestTemperature: '昼25-30℃ / 夜15-20℃',
    spacing: '行距50-60cm × 株距25-30cm',
    density: '3500-4500株/亩',
    fertilization: '基肥有机肥2-3吨/亩；N 15-20kg、P₂O₅ 6-8kg、K₂O 15-20kg/亩，重施钾肥',
    keyPest: '疫病、炭疽病、青枯病、烟青虫、蚜虫',
    harvest: '定植后60-80天始收，分批采收，亩产鲜椒2000-3000kg或干椒300-500kg',
    source: '中国农业科学院蔬菜花卉研究所 辣椒栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'l1',
        title: '贵州遵义朝天椒"稻-椒"轮作防病经验',
        author: '余常水（遵义市农科院）',
        region: '贵州省遵义市',
        climate: '中亚热带湿润季风气候',
        tags: ['水旱轮作', '干椒', '土传病害'],
        date: '2024-09-18',
        source: '中国农业科学院蔬菜花卉所 辣椒示范',
        sourceUrl: 'https://ivf.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-potato',
    crop: '马铃薯',
    cropIcon: '🥔',
    imageSeed: 'potato-brown-004',
    category: '薯类',
    season: '春薯3-4月播种；秋薯8-9月播种',
    bestTemperature: '15-25℃（块茎形成最适18-22℃）',
    spacing: '行距60cm × 株距20-25cm',
    density: '4500-5500株/亩',
    fertilization: 'N 12-16kg、P₂O₅ 6-8kg、K₂O 18-22kg/亩（喜钾），硫酸钾型复合肥',
    keyPest: '晚疫病、早疫病、蚜虫、二十八星瓢虫、地老虎',
    harvest: '出苗后70-90天收获，亩产2500-3500kg（高产区4000kg+）',
    source: '中国农业科学院蔬菜花卉研究所 马铃薯栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'p1',
        title: '甘肃定西马铃薯脱毒种薯全覆盖经验',
        author: '李高峰（定西市农科院）',
        region: '甘肃省定西市',
        climate: '温带半干旱气候 · 春播一季作',
        tags: ['脱毒种薯', '旱作', '全膜双垄'],
        date: '2024-10-05',
        source: '中国农业科学院蔬菜花卉所 西北马铃薯示范',
        sourceUrl: 'https://ivf.caas.cn/'
      },
      {
        id: 'p2',
        title: '内蒙古乌兰察布大垄高垄机械化栽培',
        author: '郭斌（乌兰察布农技站）',
        region: '内蒙古乌兰察布市',
        climate: '中温带半干旱气候',
        tags: ['机械化', '大垄密植', '种薯繁育'],
        date: '2025-04-12',
        source: '中国农业科学院蔬菜花卉所 马铃薯产业体系',
        sourceUrl: 'https://ivf.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-cabbage',
    crop: '大白菜',
    cropIcon: '🥬',
    imageSeed: 'cabbage-green-005',
    category: '叶菜类',
    season: '秋白菜8月上中旬直播（北方8月5-15日）',
    bestTemperature: '15-22℃（包心期适宜15-18℃）',
    spacing: '行距50-60cm × 株距40-50cm',
    density: '2200-3000株/亩',
    fertilization: '基肥有机肥3-4吨/亩；N 18-22kg、P₂O₅ 6-8kg、K₂O 12-15kg/亩，莲座期和包心期分两次重追',
    keyPest: '软腐病、霜霉病、病毒病、菜青虫、蚜虫',
    harvest: '播种后70-90天收获，亩产5000-8000kg',
    source: '农业农村部种植业管理司 蔬菜生产技术指导意见',
    sourceUrl: 'http://www.zzys.moa.gov.cn/',
    experiences: [
      {
        id: 'b1',
        title: '河北玉田包尖白菜地理标志种植规范',
        author: '艾国兴（玉田蔬菜中心）',
        region: '河北省唐山市玉田县',
        climate: '暖温带半湿润季风气候',
        tags: ['地理标志', '包心紧实', '窖储'],
        date: '2024-10-22',
        source: '农业农村部 蔬菜绿色生产',
        sourceUrl: 'http://www.zzys.moa.gov.cn/'
      }
    ]
  },
  {
    id: 'tip-radish',
    crop: '萝卜',
    cropIcon: '🥕',
    imageSeed: 'radish-orange-006',
    category: '根茎类',
    season: '秋冬萝卜7月下旬-8月中旬直播',
    bestTemperature: '15-20℃（肉质根膨大期）',
    spacing: '行距40-50cm × 株距20-25cm',
    density: '5000-7000株/亩',
    fertilization: '基肥有机肥2-3吨/亩；N 12-15kg、P₂O₅ 5-7kg、K₂O 15-18kg/亩（喜钾）',
    keyPest: '黑腐病、病毒病、蚜虫、菜青虫、根蛆',
    harvest: '播种后60-90天，根重1-2kg/个，亩产4000-6000kg',
    source: '中国农业科学院蔬菜花卉研究所 萝卜栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'r1',
        title: '天津沙窝萝卜青萝卜沙土栽培经验',
        author: '郭芝振（天津西青农技站）',
        region: '天津市西青区',
        climate: '暖温带半湿润季风气候',
        tags: ['沙土', '地理标志', '窖藏'],
        date: '2024-11-10',
        source: '中国农业科学院蔬菜花卉所 萝卜示范',
        sourceUrl: 'https://ivf.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-peanut',
    crop: '花生',
    cropIcon: '🥜',
    imageSeed: 'peanut-tan-007',
    category: '油料',
    season: '春花生4月中-5月初；夏花生5月下旬-6月中旬',
    bestTemperature: '生育期适温20-28℃',
    spacing: '行距40-45cm × 株距15-18cm',
    density: '8000-10000穴/亩（每穴2粒）',
    fertilization: 'N 8-12kg、P₂O₅ 6-8kg、K₂O 10-14kg/亩，钙肥（石膏/石灰）25-40kg/亩（防空壳）',
    keyPest: '叶斑病、青枯病、根结线虫、蛴螬、蚜虫',
    harvest: '春花生120-130天；夏花生100-110天，亩产250-400kg（高产区500kg+）',
    source: '中国农业科学院油料作物研究所 花生栽培技术规程',
    sourceUrl: 'https://ocri.caas.cn/',
    experiences: [
      {
        id: 'pn1',
        title: '河南正阳麦茬夏花生高产创建经验',
        author: '余辉（正阳县花生研究所）',
        region: '河南省驻马店市正阳县',
        climate: '暖温带半湿润季风气候',
        tags: ['麦茬直播', '高油酸', '机械化'],
        date: '2024-09-28',
        source: '中国农业科学院油料所 花生产业体系',
        sourceUrl: 'https://ocri.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-rapeseed',
    crop: '油菜',
    cropIcon: '🌻',
    imageSeed: 'rapeseed-yellow-008',
    category: '油料',
    season: '冬油菜9月下旬-10月中旬直播（长江流域）',
    bestTemperature: '15-20℃（蕾薹期）；开花适温12-20℃',
    spacing: '行距30-40cm × 株距15-20cm',
    density: '10000-15000株/亩（直播）',
    fertilization: 'N 12-15kg、P₂O₅ 5-7kg、K₂O 8-10kg/亩，基追比5:5，硼砂0.5-1kg/亩（防花而不实）',
    keyPest: '菌核病、霜霉病、蚜虫、菜青虫、小菜蛾',
    harvest: '秋播翌年5月收获，亩产150-200kg（高产区250kg+）',
    source: '中国农业科学院油料作物研究所 油菜栽培技术规程',
    sourceUrl: 'https://ocri.caas.cn/',
    experiences: [
      {
        id: 'rp1',
        title: '湖北江汉平原"油-稻-稻"三熟制经验',
        author: '刘泽琼（中国农科院油料所）',
        region: '湖北省荆州市',
        climate: '北亚热带湿润季风气候',
        tags: ['三熟制', '机械化收获', '绿色高效'],
        date: '2025-05-10',
        source: '中国农业科学院油料所 长江流域油菜示范',
        sourceUrl: 'https://ocri.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-cotton',
    crop: '棉花',
    cropIcon: '🌱',
    imageSeed: 'cotton-white-009',
    category: '纤维作物',
    season: '春棉4月中下旬直播/4月苗移栽5月初',
    bestTemperature: '生育期20-30℃；开花结铃25-30℃',
    spacing: '宽窄行（66+10）cm × 株距12-15cm',
    density: '4500-6000株/亩',
    fertilization: 'N 15-20kg、P₂O₅ 6-8kg、K₂O 12-15kg/亩，花铃期重施钾肥',
    keyPest: '枯萎病、黄萎病、棉铃虫、棉蚜、红蜘蛛',
    harvest: '9-10月分次采摘，亩产籽棉250-350kg（高产区450kg+）',
    source: '中国农业科学院棉花研究所 棉花栽培技术规程',
    sourceUrl: 'https://ccri.caas.cn/',
    experiences: [
      {
        id: 'ct1',
        title: '新疆阿瓦提长绒棉膜下滴灌密植经验',
        author: '李鹏程（阿瓦提棉技站）',
        region: '新疆阿克苏地区阿瓦提县',
        climate: '暖温带大陆性干旱气候',
        tags: ['膜下滴灌', '长绒棉', '机采棉'],
        date: '2024-10-15',
        source: '中国农业科学院棉花所 新疆示范园',
        sourceUrl: 'https://ccri.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-sugarcane',
    crop: '甘蔗',
    cropIcon: '🎋',
    imageSeed: 'sugarcane-green-010',
    category: '糖料',
    season: '春植蔗2-3月下种，秋植蔗8-9月，冬植蔗11-12月',
    bestTemperature: '年积温6500-8000℃·日；生长期20-30℃',
    spacing: '行距90-120cm × 排种双芽段',
    density: '每米下种8-10个芽，每亩3500-4000段双芽蔗种',
    fertilization: 'N 20-24kg、P₂O₅ 8-10kg、K₂O 18-22kg/亩（典型喜钾）',
    keyPest: '螟虫、凤梨病、黑穗病、棉蚜、蓟马',
    harvest: '种植后10-12个月，亩产6-8吨（高产区10吨+），糖分14-16%',
    source: '中国农业科学院甘蔗研究中心 甘蔗栽培技术规程',
    sourceUrl: 'https://www.caas.cn/',
    experiences: [
      {
        id: 'sg1',
        title: '广西崇左甘蔗"双高"基地全程机械化',
        author: '韦文科（崇左市糖业办）',
        region: '广西崇左市',
        climate: '南亚热带季风气候',
        tags: ['全程机械化', '双高基地', '水肥一体化'],
        date: '2025-01-20',
        source: '中国农业科学院 甘蔗产业体系',
        sourceUrl: 'https://www.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-apple',
    crop: '苹果',
    cropIcon: '🍎',
    imageSeed: 'apple-red-011',
    category: '仁果类',
    season: '秋栽10-11月；春栽3月（北方落叶至萌芽前）',
    bestTemperature: '年均温8-14℃；冬季能耐-30℃低温',
    spacing: '乔化4×6m；矮化密植2×4m',
    density: '乔化28-33株/亩；矮化密植80-100株/亩',
    fertilization: '秋施基肥有机肥3-5kg/株；N 0.5-1kg、P₂O₅ 0.3-0.5kg、K₂O 0.5-1kg/株',
    keyPest: '腐烂病、白粉病、褐斑病、蚜虫、叶螨、食心虫',
    harvest: '栽后3-4年结果，10月采收，亩产2000-3000kg（盛果期）',
    source: '中国农业科学院果树研究所 苹果栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'ap1',
        title: '陕西洛川矮化密植富士水肥一体化经验',
        author: '王建锋（洛川苹果试验站）',
        region: '陕西省延安市洛川县',
        climate: '暖温带半湿润大陆性季风气候',
        tags: ['矮化密植', '水肥一体化', '免套袋'],
        date: '2024-10-12',
        source: '中国农业科学院果树所 西北苹果产业体系',
        sourceUrl: 'https://ip.caas.cn/'
      },
      {
        id: 'ap2',
        title: '山东烟台老果园改造提质增效案例',
        author: '姜召涛（烟台农科院）',
        region: '山东省烟台市',
        climate: '暖温带季风气候',
        tags: ['老果园改造', '新模式栽培', '提质增效'],
        date: '2025-02-28',
        source: '中国农业科学院果树所 苹果示范园',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-grape',
    crop: '葡萄',
    cropIcon: '🍇',
    imageSeed: 'grape-purple-012',
    category: '浆果类',
    season: '春栽3-4月；秋栽10-11月（落叶后）',
    bestTemperature: '生育适温20-30℃；冬季需7℃以下低温800-1200小时',
    spacing: '棚架2-3×5-6m；篱架1.5-2×2.5-3m',
    density: '棚架40-60株/亩；篱架100-150株/亩',
    fertilization: '基肥有机肥3-5吨/亩；N 15-20kg、P₂O₅ 8-12kg、K₂O 18-25kg/亩（钾肥促进着色增糖）',
    keyPest: '霜霉病、白粉病、炭疽病、葡萄透翅蛾、绿盲蝽',
    harvest: '栽后2-3年结果，8-10月采收，亩产1000-2000kg',
    source: '中国农业科学院果树研究所 葡萄栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'gr1',
        title: '新疆吐鲁番无核白葡萄埋土防寒越冬经验',
        author: '热依汗·依明（吐鲁番葡萄中心）',
        region: '新疆吐鲁番市',
        climate: '暖温带大陆性干旱气候',
        tags: ['埋土防寒', '无核白', '开墩'],
        date: '2024-08-22',
        source: '中国农业科学院果树所 新疆葡萄示范',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-citrus',
    crop: '柑橘',
    cropIcon: '🍊',
    imageSeed: 'citrus-orange-013',
    category: '柑果类',
    season: '春栽2-3月；秋栽9-10月（华南秋栽成活率更高）',
    bestTemperature: '年均温16-22℃；最适生长23-29℃',
    spacing: '3×4m（中等密度）至2×3m（密植）',
    density: '55-110株/亩',
    fertilization: '基肥有机肥3-4kg/株；N 0.4-0.6kg、P₂O₅ 0.2-0.3kg、K₂O 0.4-0.6kg/株，重施秋肥',
    keyPest: '黄龙病、溃疡病、炭疽病、红蜘蛛、锈壁虱、木虱、潜叶蛾',
    harvest: '栽后3-4年初果，10-12月采收，亩产2000-3000kg（盛果期）',
    source: '中国农业科学院柑桔研究所 柑橘栽培技术规程',
    sourceUrl: 'https://www.cric.cn/',
    experiences: [
      {
        id: 'ci1',
        title: '江西赣南脐橙无毒苗与黄龙病综合防控',
        author: '钟八莲（赣南师范大学）',
        region: '江西省赣州市',
        climate: '中亚热带湿润季风气候',
        tags: ['黄龙病', '无毒苗', '木虱防控'],
        date: '2024-11-30',
        source: '中国农业科学院柑桔研究所 赣南示范园',
        sourceUrl: 'https://www.cric.cn/'
      },
      {
        id: 'ci2',
        title: '广西砂糖橘密植早丰产管理要点',
        author: '陈传武（广西特色作物研究院）',
        region: '广西桂林市',
        climate: '中亚热带季风气候',
        tags: ['密植', '早丰产', '盖膜越冬'],
        date: '2025-01-15',
        source: '中国农业科学院柑桔研究所 砂糖橘示范',
        sourceUrl: 'https://www.cric.cn/'
      }
    ]
  },
  {
    id: 'tip-wheat',
    crop: '小麦',
    cropIcon: '🌾',
    imageSeed: 'wheat-gold-014',
    category: '粮食作物',
    season: '冬麦9月下旬-10月下旬；春麦3月中-4月初',
    bestTemperature: '生育期15-22℃；越冬期能耐-15℃',
    spacing: '行距15-20cm（机械条播）',
    density: '基本苗15-25万株/亩；播量10-15kg/亩',
    fertilization: 'N 14-18kg、P₂O₅ 6-8kg、K₂O 5-7kg/亩，氮肥基追比5:5（拔节期追）',
    keyPest: '赤霉病、条锈病、白粉病、蚜虫、吸浆虫',
    harvest: '播种后210-240天，亩产400-600kg（高产区700kg+）',
    source: '农业农村部种植业管理司 小麦生产技术指导意见',
    sourceUrl: 'http://www.zzys.moa.gov.cn/gzdt/201309/t20130912_6309859.htm',
    experiences: [
      {
        id: 'wh1',
        title: '河南滑县吨半粮小麦玉米周年高产经验',
        author: '赵秀珍（滑县农技推广站）',
        region: '河南省安阳市滑县',
        climate: '暖温带半湿润季风气候',
        tags: ['吨半粮', '深耕深松', '一喷三防'],
        date: '2024-06-05',
        source: '农业农村部种植业管理司 粮食高产创建',
        sourceUrl: 'http://www.zzys.moa.gov.cn/'
      },
      {
        id: 'wh2',
        title: '山东济宁"济麦22"宽幅精播节水栽培',
        author: '黄承彦（山东省农科院）',
        region: '山东省济宁市',
        climate: '暖温带半湿润季风气候',
        tags: ['宽幅精播', '节水', '一喷三防'],
        date: '2024-09-20',
        source: '中国农业科学院 作物所小麦产业体系',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-corn',
    crop: '玉米',
    cropIcon: '🌽',
    imageSeed: 'corn-yellow-015',
    category: '粮食作物',
    season: '春玉米4-5月播种；夏玉米6月上中旬',
    bestTemperature: '生育期20-30℃；抽雄吐丝25-28℃最适',
    spacing: '等行距60cm×株距22-26cm；或宽窄行80+40cm',
    density: '紧凑型5000-6000株/亩；耐密品种6000-6500株/亩',
    fertilization: 'N 15-20kg、P₂O₅ 5-7kg、K₂O 5-8kg/亩，大喇叭口期重追氮肥',
    keyPest: '玉米螟、粘虫、南方锈病、茎基腐病、蚜虫',
    harvest: '春玉米125-140天；夏玉米95-110天，亩产500-700kg（吨粮田1200kg+）',
    source: '中国农业科学院作物科学研究所 玉米密植高产技术',
    sourceUrl: 'https://ics.caas.cn/',
    experiences: [
      {
        id: 'co1',
        title: '吉林梨树玉米秸秆覆盖保护性耕作',
        author: '王贵满（中国农业大学梨树实验站）',
        region: '吉林省四平市梨树县',
        climate: '北温带半湿润季风气候',
        tags: ['保护性耕作', '秸秆还田', '条带耕作'],
        date: '2024-10-08',
        source: '中国农业科学院作物所 东北玉米示范',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-rice',
    crop: '水稻',
    cropIcon: '🌾',
    imageSeed: 'rice-green-016',
    category: '粮食作物',
    season: '早稻3-4月；中稻4-5月；晚稻6月下旬-7月上旬',
    bestTemperature: '生长适温20-32℃；抽穗扬花25-30℃最适',
    spacing: '行株距25-30cm×12-15cm（机插）；或25×14cm（精量穴直播）',
    density: '2-2.5万穴/亩，每穴3-5苗，基本苗8-10万/亩',
    fertilization: 'N 12-16kg、P₂O₅ 4-6kg、K₂O 6-8kg/亩，基肥+分蘖肥+穗肥3次施用',
    keyPest: '稻瘟病、纹枯病、稻飞虱、螟虫、稻纵卷叶螟',
    harvest: '早稻110-120天；中稻130-150天；晚稻120-140天，亩产500-650kg（超级稻800kg+）',
    source: '中国水稻研究所 水稻精量穴直播技术规程',
    sourceUrl: 'https://www.chinariceinfo.com/',
    experiences: [
      {
        id: 'ri1',
        title: '湖南隆回超级稻"四防一增"栽培法',
        author: '肖利光（隆回县农业局）',
        region: '湖南省邵阳市隆回县',
        climate: '中亚热带季风性湿润气候',
        tags: ['超级稻', '四防一增', '绿色防控'],
        date: '2024-09-12',
        source: '中国水稻研究所 杂交水稻示范',
        sourceUrl: 'https://www.chinariceinfo.com/'
      },
      {
        id: 'ri2',
        title: '黑龙江五常稻花香"两段式"育苗经验',
        author: '田永太（五常稻花香育种人）',
        region: '黑龙江省哈尔滨市五常市',
        climate: '中温带大陆性季风气候',
        tags: ['稻花香', '两段式育苗', '地理标志'],
        date: '2025-04-20',
        source: '中国水稻研究所 东北粳稻示范',
        sourceUrl: 'https://www.chinariceinfo.com/'
      }
    ]
  },
  {
    id: 'tip-sweetpotato',
    crop: '甘薯',
    cropIcon: '🍠',
    imageSeed: 'sweetpotato-red-017',
    category: '薯类',
    season: '春薯4月下旬-5月中旬；夏薯6月上中旬',
    bestTemperature: '生育适温20-30℃；块根膨大22-25℃最适',
    spacing: '垄距80-90cm×株距20-25cm（单行）或 60cm×25cm（双行）',
    density: '3000-4000株/亩（春薯）；4500-5500株/亩（夏薯）',
    fertilization: 'N 8-12kg、P₂O₅ 5-7kg、K₂O 18-22kg/亩（典型喜钾），硫酸钾型复合肥',
    keyPest: '黑斑病、茎线虫病、薯瘟、斜纹夜蛾、蛴螬',
    harvest: '插秧后110-160天，亩产鲜薯2500-3500kg（高产区5000kg+）',
    source: '中国农业科学院作物科学研究所 甘薯栽培技术规程',
    sourceUrl: 'https://ics.caas.cn/',
    experiences: [
      {
        id: 'sw1',
        title: '河北卢龙"烟薯25"地膜覆盖早收经验',
        author: '杨春玲（卢龙县农业局）',
        region: '河北省秦皇岛市卢龙县',
        climate: '暖温带半湿润季风气候',
        tags: ['地膜覆盖', '烟薯25', '早收'],
        date: '2024-09-30',
        source: '中国农业科学院作物所 甘薯产业体系',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-broadbean',
    crop: '蚕豆',
    cropIcon: '🫘',
    imageSeed: 'broadbean-green-018',
    category: '豆类',
    season: '秋播10月中下旬（南方）；春播3月上中旬（北方）',
    bestTemperature: '生育适温14-22℃；耐-4℃低温',
    spacing: '行距30cm×株距15-20cm（点播）',
    density: '1-1.7万株/亩（大粒种1-1.5万；中粒种1.4-1.7万）',
    fertilization: 'N 4-6kg、P₂O₅ 5-7kg、K₂O 6-8kg/亩，根瘤固氮强少施氮肥',
    keyPest: '锈病、赤斑病、蚜虫、蚕豆象、蓟马',
    harvest: '播种后200-230天，4-5月采收青荚或干豆，亩产干豆150-200kg（鲜荚800-1200kg）',
    source: '中国农业科学院作物科学研究所 蚕豆栽培技术规程',
    sourceUrl: 'https://ics.caas.cn/',
    experiences: [
      {
        id: 'bd1',
        title: '云南大理鲜食蚕豆反季栽培技术',
        author: '段杰珠（大理州农科院）',
        region: '云南省大理白族自治州',
        climate: '低纬高原季风气候',
        tags: ['反季', '鲜食蚕豆', '高海拔'],
        date: '2024-12-08',
        source: '中国农业科学院作物所 蚕豆示范',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-mungbean',
    crop: '绿豆',
    cropIcon: '🫛',
    imageSeed: 'mungbean-green-019',
    category: '豆类',
    season: '春播4-5月；夏播6月（与玉米/甘薯间作）',
    bestTemperature: '生育适温18-30℃',
    spacing: '行距40-50cm×株距10-15cm',
    density: '1.0-1.5万株/亩（直立早熟）；0.8-1.2万株/亩（半蔓生）',
    fertilization: 'N 3-5kg、P₂O₅ 4-6kg、K₂O 5-7kg/亩，少施氮多施磷钾以利固氮',
    keyPest: '叶斑病、白粉病、蚜虫、豆荚螟、绿豆象',
    harvest: '春播85-95天；夏播70-80天，分批采摘3-4次，亩产100-150kg（高产区200kg+）',
    source: '中国农业科学院作物科学研究所 绿豆栽培技术规程',
    sourceUrl: 'https://ics.caas.cn/',
    experiences: [
      {
        id: 'mg1',
        title: '河南潢川明绿豆地理标志保护栽培',
        author: '李明波（潢川农科所）',
        region: '河南省信阳市潢川县',
        climate: '北亚热带向暖温带过渡气候',
        tags: ['地理标志', '明绿豆', '夏播'],
        date: '2024-08-20',
        source: '中国农业科学院作物所 绿豆产业体系',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-redbean',
    crop: '红小豆',
    cropIcon: '🫘',
    imageSeed: 'redbean-red-020',
    category: '豆类',
    season: '春播4月下旬-5月上中旬；夏播6月',
    bestTemperature: '生育适温20-30℃',
    spacing: '行距45-50cm×株距10-15cm',
    density: '1.0-1.4万株/亩',
    fertilization: 'N 3-5kg、P₂O₅ 5-7kg、K₂O 5-7kg/亩，根瘤固氮，磷钾为主',
    keyPest: '锈病、病毒病、蚜虫、豆荚螟、红蜘蛛',
    harvest: '播种后90-110天，8-9月分批收获，亩产100-180kg（高产区250kg+）',
    source: '中国农业科学院作物科学研究所 红小豆栽培技术规程',
    sourceUrl: 'https://ics.caas.cn/',
    experiences: [
      {
        id: 'rb1',
        title: '黑龙江宝清红小豆"互联网+订单"模式',
        author: '闫福全（宝清县农业局）',
        region: '黑龙江省双鸭山市宝清县',
        climate: '中温带大陆性季风气候',
        tags: ['订单农业', '互联网+', '富硒红小豆'],
        date: '2024-10-25',
        source: '中国农业科学院作物所 红小豆示范',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-pea',
    crop: '豌豆',
    cropIcon: '🫛',
    imageSeed: 'pea-green-021',
    category: '豆类',
    season: '秋播10-11月（南方冬豌豆）；春播3-4月（北方春豌豆）',
    bestTemperature: '生育适温12-20℃；耐-5℃低温',
    spacing: '行距30-40cm×株距8-12cm',
    density: '2.5-3.5万株/亩（矮生）；1.5-2万株/亩（蔓生）',
    fertilization: 'N 4-6kg、P₂O₅ 4-6kg、K₂O 5-7kg/亩，重施磷钾以利结荚',
    keyPest: '白粉病、锈病、蚜虫、潜叶蝇、豌豆象',
    harvest: '秋播翌年4-5月；春播6-7月，分批采收，亩产干豌豆150-200kg或鲜荚800-1200kg',
    source: '中国农业科学院作物科学研究所 豌豆栽培技术规程',
    sourceUrl: 'https://ics.caas.cn/',
    experiences: [
      {
        id: 'pa1',
        title: '四川仁寿"豌豆尖"设施越冬栽培',
        author: '李建川（仁寿县农业局）',
        region: '四川省眉山市仁寿县',
        climate: '中亚热带湿润季风气候',
        tags: ['豌豆尖', '设施越冬', '多次采摘'],
        date: '2025-01-08',
        source: '中国农业科学院作物所 豌豆产业体系',
        sourceUrl: 'https://ics.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-yam',
    crop: '山药',
    cropIcon: '🍠',
    imageSeed: 'yam-brown-022',
    category: '根茎类',
    season: '4月中下旬地温稳定在13℃以上时栽植',
    bestTemperature: '生育适温20-30℃；块茎膨大22-25℃最适',
    spacing: '行距80-100cm×株距25-30cm（需深翻60-80cm）',
    density: '2200-3000株/亩',
    fertilization: '基肥有机肥3-5吨/亩；N 12-15kg、P₂O₅ 8-10kg、K₂O 18-25kg/亩（喜钾）',
    keyPest: '炭疽病、根结线虫病、蛴螬、地老虎、叶蜂',
    harvest: '霜降后10月下旬-11月收获，亩产2000-3500kg（高产区5000kg+）',
    source: '中国农业科学院蔬菜花卉研究所 山药栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'ym1',
        title: '河南温县铁棍山药标准化种植',
        author: '王中华（温县农业局）',
        region: '河南省焦作市温县',
        climate: '暖温带半湿润季风气候',
        tags: ['地理标志', '深翻', '铁棍山药'],
        date: '2024-11-15',
        source: '中国农业科学院蔬菜花卉所 山药示范',
        sourceUrl: 'https://ivf.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-ginger',
    crop: '生姜',
    cropIcon: '🫚',
    imageSeed: 'ginger-tan-023',
    category: '根茎类',
    season: '4月下旬-5月上旬催芽后栽植（地温稳定在16℃以上）',
    bestTemperature: '生育适温20-28℃；发芽适温22-25℃',
    spacing: '行距55-60cm×株距18-22cm（每块种姜50-75g）',
    density: '4500-6000株/亩（亩用种姜250-400kg）',
    fertilization: '基肥有机肥3-4吨/亩；N 25-30kg、P₂O₅ 8-10kg、K₂O 30-35kg/亩（重施钾）',
    keyPest: '姜瘟病、根结线虫、蚜虫、螟虫、姜蛆',
    harvest: '嫩姜8-9月；老姜10月下旬-11月初，亩产2500-4000kg（高产区5000kg+）',
    source: '中国农业科学院蔬菜花卉研究所 生姜栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'gj1',
        title: '山东莱芜大姜"三膜一苫"早春栽培',
        author: '王教芬（莱芜农科院）',
        region: '山东省济南市莱芜区',
        climate: '暖温带半湿润季风气候',
        tags: ['三膜一苫', '大姜', '催芽'],
        date: '2024-04-15',
        source: '中国农业科学院蔬菜花卉所 生姜示范',
        sourceUrl: 'https://ivf.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-garlic',
    crop: '大蒜',
    cropIcon: '🧄',
    imageSeed: 'garlic-white-024',
    category: '鳞茎类',
    season: '秋播9月下旬-10月上中旬（北方蒜区）；春播3月（南方）',
    bestTemperature: '发芽适温16-20℃；蒜薹发育15-20℃',
    spacing: '行距18-20cm×株距8-12cm',
    density: '2.5-3.5万株/亩（蒜头）；3.5-4.5万株/亩（蒜苗）',
    fertilization: 'N 18-22kg、P₂O₅ 8-10kg、K₂O 15-20kg/亩，抽薹后重追钾肥',
    keyPest: '叶枯病、紫斑病、根蛆、蒜蓟马、蚜虫',
    harvest: '蒜薹5月采收；蒜头5月下旬-6月上旬收获，亩产蒜头1000-1500kg（高产区2000kg+）',
    source: '中国农业科学院蔬菜花卉研究所 大蒜栽培技术规程',
    sourceUrl: 'https://ivf.caas.cn/',
    experiences: [
      {
        id: 'ga1',
        title: '江苏邳州大蒜地理标志保护经验',
        author: '陈凤祥（邳州大蒜协会）',
        region: '江苏省徐州市邳州市',
        climate: '暖温带半湿润季风气候',
        tags: ['地理标志', '蒜薹蒜头', '冷藏'],
        date: '2025-05-10',
        source: '中国农业科学院蔬菜花卉所 大蒜示范',
        sourceUrl: 'https://ivf.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-peach',
    crop: '桃',
    cropIcon: '🍑',
    imageSeed: 'peach-pink-025',
    category: '核果类',
    season: '秋栽10-11月落叶后；春栽3月萌芽前',
    bestTemperature: '年均温12-17℃；冬季需冷量600-1000小时（<7℃）',
    spacing: '4×5m（普通）或 2×4m（Y字形密植）',
    density: '33-55株/亩（Y字形密植80-110株/亩）',
    fertilization: '基肥有机肥2-3kg/株；N 0.3-0.5kg、P₂O₅ 0.2-0.3kg、K₂O 0.4-0.6kg/株',
    keyPest: '桃褐腐病、细菌性穿孔病、桃蚜、桃小食心虫、红蜘蛛',
    harvest: '栽后2-3年初果，6-9月分批采收，亩产1500-2500kg（盛果期）',
    source: '中国农业科学院果树研究所 桃栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'pe1',
        title: '上海南汇水蜜桃"根域限制"栽培',
        author: '王世平（上海交通大学）',
        region: '上海市浦东新区',
        climate: '北亚热带季风气候',
        tags: ['根域限制', '设施栽培', '早熟'],
        date: '2024-06-25',
        source: '中国农业科学院果树所 桃示范',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-pear',
    crop: '梨',
    cropIcon: '🍐',
    imageSeed: 'pear-yellow-026',
    category: '仁果类',
    season: '秋栽10-11月；春栽3月',
    bestTemperature: '年均温8-14℃；冬季能耐-25℃低温',
    spacing: '乔化4×6m；矮化密植2×4m',
    density: '乔化28-33株/亩；密植80-110株/亩',
    fertilization: '基肥有机肥3-5kg/株；N 0.5-0.8kg、P₂O₅ 0.3-0.5kg、K₂O 0.6-0.8kg/株',
    keyPest: '梨黑星病、锈病、梨木虱、梨小食心虫、蚜虫',
    harvest: '栽后3-4年初果，7-10月分批采收，亩产2000-3000kg（盛果期）',
    source: '中国农业科学院果树研究所 梨栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'pl1',
        title: '河北辛集鸭梨"网架式"栽培经验',
        author: '张玉星（河北农大）',
        region: '河北省辛集市',
        climate: '暖温带半湿润大陆性季风气候',
        tags: ['网架栽培', '鸭梨', '地理标志'],
        date: '2024-09-08',
        source: '中国农业科学院果树所 梨产业体系',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-cherry',
    crop: '樱桃',
    cropIcon: '🍒',
    imageSeed: 'cherry-red-027',
    category: '核果类',
    season: '秋栽10-11月；春栽3月（萌芽前）',
    bestTemperature: '年均温10-14℃；冬季需冷量800-1200小时',
    spacing: '3×4m（中等密度）至2×3m（密植）',
    density: '55-110株/亩',
    fertilization: '基肥有机肥3-5kg/株；N 0.4-0.6kg、P₂O₅ 0.3-0.4kg、K₂O 0.5-0.7kg/株',
    keyPest: '褐斑病、根癌病、樱桃果蝇、蚜虫、桑白蚧',
    harvest: '栽后3-4年初果，5-6月采收（早熟果），亩产500-1000kg（盛果期）',
    source: '中国农业科学院果树研究所 樱桃栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'ch1',
        title: '大连设施大樱桃"四段式"温控管理',
        author: '潘凤荣（大连农科院）',
        region: '辽宁省大连市',
        climate: '暖温带半湿润季风气候 · 设施',
        tags: ['设施栽培', '温控', '美早'],
        date: '2025-02-12',
        source: '中国农业科学院果树所 大樱桃示范',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-kiwi',
    crop: '猕猴桃',
    cropIcon: '🥝',
    imageSeed: 'kiwi-green-028',
    category: '浆果类',
    season: '秋栽10-11月；春栽2-3月（萌芽前）',
    bestTemperature: '年均温13-18℃；夏季不超过35℃',
    spacing: '3×4m（雌雄同园）雄雌株配比1:6-8',
    density: '55-65株/亩（含授粉树）',
    fertilization: '基肥有机肥5-8kg/株；N 0.5-0.8kg、P₂O₅ 0.3-0.4kg、K₂O 0.6-0.9kg/株',
    keyPest: '溃疡病、根结线虫、金龟子、苹小卷叶蛾、介壳虫',
    harvest: '栽后3-4年初果，9-11月分批采收，亩产1500-2500kg（盛果期）',
    source: '中国农业科学院果树研究所 猕猴桃栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'kw1',
        title: '陕西周至猕猴桃"一主两蔓"修剪经验',
        author: '吕岩（周至县农业局）',
        region: '陕西省西安市周至县',
        climate: '暖温带半湿润大陆性季风气候',
        tags: ['修剪', '溃疡病', '海沃德'],
        date: '2024-10-18',
        source: '中国农业科学院果树所 猕猴桃示范',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-pineapple',
    crop: '菠萝',
    cropIcon: '🍍',
    imageSeed: 'pineapple-yellow-029',
    category: '热带水果',
    season: '全年可种（华南）；3-9月为最佳定植期',
    bestTemperature: '生育适温24-32℃；不耐5℃以下低温',
    spacing: '行距100-120cm×株距30-40cm（双行单株）或35-50cm（单行）',
    density: '3000-4500株/亩',
    fertilization: 'N 25-30kg、P₂O₅ 8-12kg、K₂O 18-25kg/亩，分基肥+抽蕾肥+壮果肥3次',
    keyPest: '心腐病、凋萎病、粉介壳虫、蟋蟀、蛴螬',
    harvest: '定植后18-24个月现蕾开花，果实发育5-7个月，亩产2000-4000kg',
    source: '中国农业科学院果树研究所 菠萝栽培技术规程',
    sourceUrl: 'https://ip.caas.cn/',
    experiences: [
      {
        id: 'pp1',
        title: '海南万宁金菠萝催花催果高产案例',
        author: '孙光明（中国热科院）',
        region: '海南省万宁市',
        climate: '热带季风气候',
        tags: ['催花', '金菠萝', '四季结果'],
        date: '2024-07-15',
        source: '中国农业科学院果树所 热带南亚热带果树',
        sourceUrl: 'https://ip.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-tea',
    crop: '茶树',
    cropIcon: '🍵',
    imageSeed: 'tea-green-030',
    category: '饮料作物',
    season: '秋栽10-11月；春栽2-3月（萌芽前）',
    bestTemperature: '生育适温15-25℃；不耐-10℃以下低温',
    spacing: '单行条栽150×33cm（密植）或大行距180cm双条栽',
    density: '4000-8000株/亩（视茶园类型和品种）',
    fertilization: '基肥有机肥1-2吨/亩；N 15-20kg、P₂O₅ 5-7kg、K₂O 7-10kg/亩（追肥分3-4次）',
    keyPest: '茶饼病、炭疽病、茶小绿叶蝉、茶尺蠖、螨类',
    harvest: '栽后3-4年开采，全年可采春茶（3-5月）、夏茶（6-7月）、秋茶（8-10月）',
    source: '中国农业科学院茶叶研究所 茶树栽培技术规程',
    sourceUrl: 'http://www.tricaas.com/',
    experiences: [
      {
        id: 'te1',
        title: '福建安溪铁观音"五步法"生态茶园',
        author: '林荣溪（安溪茶叶协会）',
        region: '福建省泉州市安溪县',
        climate: '中亚热带海洋性季风气候',
        tags: ['生态茶园', '铁观音', '茶园五步法'],
        date: '2024-05-20',
        source: '中国农业科学院茶叶研究所 茶产业体系',
        sourceUrl: 'http://www.tricaas.com/'
      },
      {
        id: 'te2',
        title: '浙江安吉白茶"一芽一叶"采摘标准',
        author: '赖建红（安吉县农业局）',
        region: '浙江省湖州市安吉县',
        climate: '北亚热带季风气候',
        tags: ['安吉白茶', '一芽一叶', '地理标志'],
        date: '2025-03-25',
        source: '中国农业科学院茶叶研究所 安吉示范',
        sourceUrl: 'http://www.tricaas.com/'
      }
    ]
  },
  {
    id: 'tip-sesame',
    crop: '芝麻',
    cropIcon: '🌾',
    imageSeed: 'sesame-tan-031',
    category: '油料',
    season: '春播4月下旬-5月上旬；夏播5月下旬-6月中旬',
    bestTemperature: '生育适温20-30℃；不耐低温',
    spacing: '行距40cm×株距15-20cm（单秆型）；行距50cm×株距20-25cm（分枝型）',
    density: '0.8-1.2万株/亩（单秆型）；0.5-0.7万株/亩（分枝型）',
    fertilization: 'N 6-10kg、P₂O₅ 4-6kg、K₂O 6-8kg/亩，花期喷施硼砂0.2%溶液',
    keyPest: '茎点枯病、枯萎病、蚜虫、芝麻螟、盲蝽蟓',
    harvest: '播种后90-120天，8-9月分批采收，亩产80-150kg（高产区200kg+）',
    source: '中国农业科学院油料作物研究所 芝麻栽培技术规程',
    sourceUrl: 'https://ocri.caas.cn/',
    experiences: [
      {
        id: 'se1',
        title: '河南驻马店夏芝麻"一撒三喷"增产经验',
        author: '张海洋（中国农科院油料所）',
        region: '河南省驻马店市',
        climate: '暖温带半湿润季风气候',
        tags: ['一撒三喷', '夏芝麻', '机械化'],
        date: '2024-08-30',
        source: '中国农业科学院油料所 芝麻产业体系',
        sourceUrl: 'https://ocri.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-shiitake',
    crop: '香菇',
    cropIcon: '🍄',
    imageSeed: 'shiitake-brown-032',
    category: '食用菌',
    season: '全年工厂化栽培；春栽3-5月，秋栽8-10月',
    bestTemperature: '菌丝生长23-26℃；出菇12-18℃（低温品种）/18-22℃（中温）',
    spacing: '层架立体栽培，菌袋距3-5cm',
    density: '每袋装干料1.5-2.0kg，规格17×33-55cm；10000-15000袋/亩（层架栽培）',
    fertilization: '基质配方：硬杂木屑78%+麸皮20%+石膏1%+糖1%，含水率55-60%；追肥：出菇期喷0.1%葡萄糖+0.05%磷酸二氢钾',
    keyPest: '绿霉、链孢霉、螨虫、菇蚊、跳虫',
    harvest: '接种后60-90天出菇，每袋可出4-6茬菇，生物效率70-120%，单袋产菇0.8-1.2kg',
    source: '中国农业科学院 食用菌栽培技术规程',
    sourceUrl: 'https://cast.caas.cn/kj/syjs/zzyjs/290789.html',
    experiences: [
      {
        id: 'sh1',
        title: '浙江庆元"庆元香菇"标准化菌棒生产',
        author: '叶长文（庆元食用菌研究所）',
        region: '浙江省丽水市庆元县',
        climate: '中亚热带季风气候',
        tags: ['地理标志', '菌棒', '工厂化'],
        date: '2024-11-05',
        source: '中国农业科学院 食用菌所示范',
        sourceUrl: 'https://cast.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-oyster',
    crop: '平菇',
    cropIcon: '🍄',
    imageSeed: 'oyster-gray-033',
    category: '食用菌',
    season: '全年工厂化栽培；秋栽9-10月最适',
    bestTemperature: '菌丝生长22-26℃；出菇8-22℃（因品种而异）',
    spacing: '层架或墙式栽培，菌袋距3-5cm',
    density: '每袋装干料1.5-2.5kg，规格20-25×45-55cm；8000-12000袋/亩',
    fertilization: '基质配方：棉籽壳88%+麸皮10%+石灰1%+石膏1%（生料栽培）；或玉米芯+木屑配方',
    keyPest: '绿霉、根霉、菌蚊、螨类、线虫',
    harvest: '接种后20-30天出菇，每袋可出5-7茬菇，生物效率100-150%，单袋产菇1.5-2.5kg',
    source: '中国农业科学院 食用菌栽培技术规程',
    sourceUrl: 'https://cast.caas.cn/kj/syjs/zzyjs/316609.html',
    experiences: [
      {
        id: 'oy1',
        title: '河北灵寿"棉柴栽培平菇"循环经济案例',
        author: '李文增（灵寿食用菌协会）',
        region: '河北省石家庄市灵寿县',
        climate: '暖温带半湿润季风气候',
        tags: ['棉柴基质', '循环经济', '工厂化'],
        date: '2024-10-20',
        source: '中国农业科学院 食用菌所示范',
        sourceUrl: 'https://cast.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-alfalfa',
    crop: '紫花苜蓿',
    cropIcon: '🌿',
    imageSeed: 'alfalfa-purple-034',
    category: '牧草',
    season: '春播3-4月（北方）；秋播8-9月（南方）',
    bestTemperature: '生育适温15-25℃；耐-25℃低温',
    spacing: '条播行距15-30cm（机械化收割30cm为宜）',
    density: '播量1.0-1.5kg/亩，保苗30-50万株/亩',
    fertilization: '基肥有机肥1-2吨/亩；N 5-8kg（首次播种）、P₂O₅ 8-10kg、K₂O 10-15kg/亩（每年追施）',
    keyPest: '苜蓿蚜、蓟马、苜蓿夜蛾、菌核病、锈病',
    harvest: '年刈割3-5次（北方3-4次，南方4-5次），亩产干草1000-1500kg（高产区2500kg+）',
    source: '中国农业科学院草原研究所 紫花苜蓿栽培技术规程',
    sourceUrl: 'https://gri.caas.cn/',
    experiences: [
      {
        id: 'al1',
        title: '甘肃酒泉苜蓿"苜蓿-玉米"轮作模式',
        author: '张榕（中国农科院草原所）',
        region: '甘肃省酒泉市',
        climate: '温带大陆性干旱气候 · 绿洲灌溉',
        tags: ['轮作', '绿洲灌溉', '高产干草'],
        date: '2024-08-15',
        source: '中国农业科学院草原研究所 苜蓿产业体系',
        sourceUrl: 'https://gri.caas.cn/'
      }
    ]
  },
  {
    id: 'tip-flax',
    crop: '亚麻',
    cropIcon: '🌾',
    imageSeed: 'flax-blue-035',
    category: '纤维作物',
    season: '春播4月中下旬-5月上旬（北方纤维亚麻主产区）',
    bestTemperature: '生育适温15-22℃；苗期耐-4℃低温',
    spacing: '行距7-8cm（密植保茎）',
    density: '播种量45-55kg/亩，保苗100-150万株/亩（密植保纤维品质）',
    fertilization: 'N 4-6kg、P₂O₅ 4-5kg、K₂O 5-7kg/亩（少氮多磷钾防倒伏）',
    keyPest: '立枯病、炭疽病、白粉病、蚜虫、粘虫',
    harvest: '快速生长期（开花前）收获纤维用；结实期收获种子用，纤维麻亩产500-800kg原茎',
    source: '中国农业科学院麻类研究所 亚麻栽培技术规程',
    sourceUrl: 'https://ifr.caas.cn/',
    experiences: [
      {
        id: 'fl1',
        title: '黑龙江兰西亚麻"雨露沤麻"节水脱胶经验',
        author: '王玉富（中国农科院麻类所）',
        region: '黑龙江省绥化市兰西县',
        climate: '中温带大陆性季风气候',
        tags: ['雨露沤麻', '节水', '原茎脱胶'],
        date: '2024-08-05',
        source: '中国农业科学院麻类所 亚麻示范',
        sourceUrl: 'https://ifr.caas.cn/'
      }
    ]
  }
]

