import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Plus, Refrigerator, Settings, Globe, Moon, Sun, 
  Search, Utensils, Clock, Flame, Share2, Languages, 
  ChevronLeft, Minus, Plus as PlusIcon, Check, Leaf,
  Sparkles, Link2, Filter, AlertCircle, X, Scale, RefreshCw, 
  Trash2, Smile, Layers, HelpCircle, Cloud, Loader2
} from 'lucide-react';

// Firebase Core & Auth Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, 
  signInWithPopup, GoogleAuthProvider, signOut, linkWithPopup 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

// Initialize Firebase (Supports both Canvas & Vercel)
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyA9Yfvw3CcEP6RM4nYnqJEpbf0SyBUtpyY",
      authDomain: "gourmetvault-d0042.firebaseapp.com",
      projectId: "gourmetvault-d0042",
      storageBucket: "gourmetvault-d0042.firebasestorage.app",
      messagingSenderId: "670550938109",
      appId: "1:670550938109:web:a9858ac0be76d123350994"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'gourmet-vault-default';

const translations = {
  zh: {
    appTitle: '饌錄',
    tagline: '您的私廚智能食譜庫',
    home: '首頁探索',
    add: '智能導入',
    pantry: '食材冰箱',
    settings: '偏好設定',
    searchPlaceholder: '搜尋精緻食譜、標籤或食材...',
    categories: '美膳分類',
    all: '全部料理',
    importTitle: 'AI 智能連結解析',
    importPlaceholder: '貼上 Instagram, YouTube 或網頁連結...',
    importBtn: '智能分析導入',
    manualAdd: '手動錄入食譜',
    translateBtn: '智能翻譯食譜',
    translatedToast: '已為您完成 AI 智能翻譯',
    servings: '人份設定',
    ingredients: '精選配料清單',
    instructions: '烹飪工序步驟',
    nutritionPerServing: '每份膳食營養科學分析',
    calories: '卡路里',
    protein: '蛋白質',
    carbs: '碳水化合物',
    fat: '優質脂肪',
    pantryTitle: '今天冰箱有什麼？',
    pantryDesc: '管理您擁有的食材，AI 將即時計算最匹配的食譜。',
    addCustomIngredient: '手動新增食材',
    ingredientNamePlaceholder: '食材名稱...',
    addBtn: '新增至冰箱',
    pantryInputLabel: '選擇或點選食材：',
    language: '介面語系 (Language)',
    theme: '視覺主題 (Theme)',
    matchRate: '食材匹配度',
    missingIngredients: '缺少的食材',
    ownedIngredients: '已擁有食材',
    suggestedIngredients: '熱門食材儲備',
    importSuccess: '食譜導入成功！已新增至您的首頁收藏。',
    originalLang: '顯示原文',
    cookingMode: '進入烹飪專注模式',
    unitSystem: '計量單位系統',
    scaleNotice: '已按修改之食材比例自動縮放全食譜',
    resetScale: '重設比例',
    metric: '公制 (g / ml)',
    imperial: '英制 (oz / fl oz)',
    scaleInputLabel: '修改任意數值可按比例縮放整份食譜',
    pantrySearchPlaceholder: '快速過濾冰箱食材...',
    system: '跟隨系統 (System)',
    light: '耀眼晨光 (Light)',
    dark: '極致夜風 (Dark)',
    selectEmoji: '選擇圖示'
  },
  en: {
    appTitle: 'Gourmet Vault',
    tagline: 'Your Private Recipe Safebox',
    home: 'Discover',
    add: 'Quick Import',
    pantry: 'Smart Pantry',
    settings: 'Settings',
    searchPlaceholder: 'Search masterpieces, tags, ingredients...',
    categories: 'Categories',
    all: 'All Cuisine',
    importTitle: 'AI Link Analyzer',
    importPlaceholder: 'Paste Instagram, YouTube, or web link...',
    importBtn: 'Analyze & Import',
    manualAdd: 'Manual Entry',
    translateBtn: 'AI Translate Recipe',
    translatedToast: 'AI Translation complete!',
    servings: 'Servings Adjustment',
    ingredients: 'Premium Ingredients',
    instructions: 'Culinary Masterclass Steps',
    nutritionPerServing: 'Nutrition Science (Per Serving)',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Healthy Fats',
    pantryTitle: 'What\'s in Your Pantry?',
    pantryDesc: 'Manage ingredients you have to discover optimized menus.',
    addCustomIngredient: 'Add Custom Ingredient',
    ingredientNamePlaceholder: 'Ingredient name...',
    addBtn: 'Add to Pantry',
    pantryInputLabel: 'Choose or click ingredients:',
    language: 'Language',
    theme: 'Theme Settings',
    matchRate: 'Match Accuracy',
    missingIngredients: 'Missing',
    ownedIngredients: 'Owned',
    suggestedIngredients: 'Popular Ingredients',
    importSuccess: 'Recipe imported successfully!',
    originalLang: 'Show Original',
    cookingMode: 'Enter Cooking Mode',
    unitSystem: 'Measurement System',
    scaleNotice: 'Recipe scaled proportionally based on ingredient',
    resetScale: 'Reset Scale',
    metric: 'Metric (g / ml)',
    imperial: 'Imperial (oz / fl oz)',
    scaleInputLabel: 'Change any value to scale entire recipe',
    pantrySearchPlaceholder: 'Filter pantry ingredients...',
    system: 'System Default',
    light: 'Light Mode',
    dark: 'Dark Mode',
    selectEmoji: 'Select Icon'
  },
  ja: {
    appTitle: 'Gourmet Vault',
    tagline: '美食家のレシピ金庫',
    home: 'ホーム探訪',
    add: 'スマート導入',
    pantry: 'スマート冷蔵庫',
    settings: '環境設定',
    searchPlaceholder: 'レシピ、タグ、食材を検索...',
    categories: 'カテゴリー',
    all: 'すべての料理',
    importTitle: 'AI リンク解析',
    importPlaceholder: 'Instagram、YouTube、またはウェブリンクを貼り付け...',
    importBtn: '解析してインポート',
    manualAdd: '手動で入力',
    translateBtn: '日本語にAI翻訳',
    translatedToast: 'AIによる翻訳が完了しました',
    servings: '分量調整',
    ingredients: '厳選された食材',
    instructions: '調理プロセス',
    nutritionPerServing: '1人分の栄養価分析',
    calories: 'カロリー',
    protein: 'タンパク質',
    carbs: '炭水化物',
    fat: '脂質',
    pantryTitle: '冷蔵庫の中身は？',
    pantryDesc: '食材を管理すると、最適なメニューを即座に提案します。',
    addCustomIngredient: '食材を手動で追加',
    ingredientNamePlaceholder: '食材の名前...',
    addBtn: '冷蔵庫に追加',
    pantryInputLabel: '食材を選択またはタップ：',
    language: '言語設定 (Language)',
    theme: 'ビジュアルテーマ',
    matchRate: 'マッチング率',
    missingIngredients: '不足している食材',
    ownedIngredients: '持っている食材',
    suggestedIngredients: '人気の食材ストック',
    importSuccess: 'インポートに成功しました！',
    originalLang: '原文を表示',
    cookingMode: 'クッキングモード',
    unitSystem: '計量単位システム',
    scaleNotice: '材料比率に基づいて自動スケーリングされました',
    resetScale: 'リセット',
    metric: 'メートル法 (g / ml)',
    imperial: 'ヤード・ポンド法 (oz / fl oz)',
    scaleInputLabel: 'どの値を変更しても、レシピ全体がスケーリングされます',
    pantrySearchPlaceholder: '冷蔵庫の材料を絞り込む...',
    system: 'システム設定',
    light: 'ライトモード',
    dark: 'ダークモード',
    selectEmoji: 'アイコン選択'
  },
  ko: {
    appTitle: 'Gourmet Vault',
    tagline: '당신만을 위한 레시피 금고',
    home: '홈 탐색',
    add: '빠른 가져오기',
    pantry: '스마트 냉장고',
    settings: '설정',
    searchPlaceholder: '레시피, 태그, 재료 검색...',
    categories: '카테고리',
    all: '전체 요리',
    importTitle: 'AI 링크 분석기',
    importPlaceholder: 'Instagram, YouTube 또는 웹 링크 붙여넣기...',
    importBtn: '스마트 분석 및 가져오기',
    manualAdd: '수동 레시피 입력',
    translateBtn: '한국어로 AI 번역',
    translatedToast: 'AI 번역이 완료되었습니다',
    servings: '인분 조절',
    ingredients: '엄선된 재료',
    instructions: '조리 단계',
    nutritionPerServing: '1인분당 영양 성분',
    calories: '칼로리',
    protein: '단백질',
    carbs: '탄수화물',
    fat: '지방',
    pantryTitle: '오늘 냉장고에 무엇이 있나요?',
    pantryDesc: '보유 중인 재료를 관리하면 가장 완벽한 메뉴를 추천합니다.',
    addCustomIngredient: '수동 재료 추가',
    ingredientNamePlaceholder: '재료 이름...',
    addBtn: '냉장고에 추가',
    pantryInputLabel: '재료 선택 또는 탭하기:',
    language: '언어 설정 (Language)',
    theme: '테마 설정',
    matchRate: '재료 일치율',
    missingIngredients: '부족한 재료',
    ownedIngredients: '보유 중인 재료',
    suggestedIngredients: '인기 재료 추천',
    importSuccess: '레시피를 성공적으로 가져왔습니다!',
    originalLang: '원문 보기',
    cookingMode: '요리 집중 모드',
    unitSystem: '계량 단위 시스템',
    scaleNotice: '재료 비율에 따라 레시피가 자동 조절되었습니다',
    resetScale: '초기화',
    metric: '미터법 (g / ml)',
    imperial: '야드파운드법 (oz / fl oz)',
    scaleInputLabel: '어떤 값을 변경해도 레시피 전체가 조절됩니다',
    pantrySearchPlaceholder: '재료 필터링...',
    system: '시스템 기본값',
    light: '라이트 모드',
    dark: '다크 모드',
    selectEmoji: '아이콘 선택'
  },
  th: {
    appTitle: 'Gourmet Vault',
    tagline: 'ตู้นิรภัยสูตรอาหารส่วนตัวของคุณ',
    home: 'สำรวจเมนู',
    add: 'นำเข้าอัจฉริยะ',
    pantry: 'ตู้เย็นอัจฉริยะ',
    settings: 'ตั้งค่า',
    searchPlaceholder: 'ค้นหาสูตรอาหาร แท็ก หรือวัตถุดิบ...',
    categories: 'หมวดหมู่',
    all: 'อาหารทั้งหมด',
    importTitle: 'AI วิเคราะห์ลิงก์',
    importPlaceholder: 'วางลิงก์ Instagram, YouTube หรือเว็บไซต์...',
    importBtn: 'วิเคราะห์และนำเข้า',
    manualAdd: 'เพิ่มสูตรด้วยตนเอง',
    translateBtn: 'แปลภาษาด้วย AI',
    translatedToast: 'แปลด้วย AI เสร็จสิ้นแล้ว',
    servings: 'ปรับจำนวนที่',
    ingredients: 'วัตถุดิบคัดสรร',
    instructions: 'ขั้นตอนการทำ',
    nutritionPerServing: 'ข้อมูลโภชนาการต่อที่',
    calories: 'แคลอรี',
    protein: 'โปรตีน',
    carbs: 'คาร์บ',
    fat: 'ไขมัน',
    pantryTitle: 'วันนี้มีอะไรในตู้เย็น?',
    pantryDesc: 'จัดการวัตถุดิบที่คุณมี แล้วเราจะคำนวณสูตรอาหารให้ทันที',
    addCustomIngredient: 'เพิ่มวัตถุดิบด้วยตัวเอง',
    ingredientNamePlaceholder: 'ชื่อวัตถุดิบ...',
    addBtn: 'เพิ่มเข้าตู้เย็น',
    pantryInputLabel: 'เลือกหรือแตะวัตถุดิบ:',
    language: 'ภาษา (Language)',
    theme: 'ธีมการแสดงผล',
    matchRate: 'อัตราความเข้ากันได้',
    missingIngredients: 'วัตถุดิบที่ขาด',
    ownedIngredients: 'วัตถุดิบที่มี',
    suggestedIngredients: 'วัตถุดิบยอดนิยม',
    importSuccess: 'นำเข้าสูตรอาหารสำเร็จ!',
    originalLang: 'แสดงต้นฉบับ',
    cookingMode: 'โหมดทำอาหาร',
    unitSystem: 'ระบบหน่วยวัด',
    scaleNotice: 'ปรับสัดส่วนสูตรอาหารโดยอัตโนมัติตามวัตถุดิบหลัก',
    resetScale: 'รีเซ็ตอัตราส่วน',
    metric: 'เมตริก (g / ml)',
    imperial: 'อิมพีเรียล (oz / fl oz)',
    scaleInputLabel: 'เปลี่ยนค่าใดๆ เพื่อปรับสัดส่วนสูตรทั้งหมด',
    pantrySearchPlaceholder: 'ค้นหาวัตถุดิบในตู้เย็น...',
    system: 'ตามระบบ',
    light: 'โหมดสว่าง',
    dark: 'โหมดมืด',
    selectEmoji: 'เลือกไอคอน'
  }
};

const INGREDIENT_LEXICON = {
  cod: { emoji: '🐟', zh: '鱈魚排', en: 'Black Cod Fillet', ja: 'タラ切れ身', ko: '대구 필레', th: 'เนื้อปลาคอด' },
  miso: { emoji: '🍲', zh: '白味噌', en: 'White Miso Paste', ja: '白味噌', ko: '백된장', th: 'มิโสะขาว' },
  mirin: { emoji: '🍶', zh: '味醂', en: 'Mirin', ja: 'みりん', ko: '미림', th: 'มิริน' },
  sake: { emoji: '🍶', zh: '清酒', en: 'Sake', ja: '日本酒', ko: '청주', th: 'สาเก' },
  sugar: { emoji: '🧂', zh: '砂糖', en: 'Sugar', ja: '砂糖', ko: '설탕', th: 'น้ำตาล' },
  rice: { emoji: '🌾', zh: '義大利米', en: 'Arborio Rice', ja: 'アルボリオ米', ko: '아르보리오 쌀', th: 'ข้าวอาร์โบรีโอ' },
  mushrooms: { emoji: '🍄', zh: '綜合野菇', en: 'Mixed Mushrooms', ja: 'キノコ盛り合わせ', ko: '모둠 버섯', th: 'เห็ดรวม' },
  broth: { emoji: '🥣', zh: '蔬菜高湯', en: 'Vegetable Broth', ja: '野菜スープ', ko: '채소 육수', th: 'น้ำซุปผัก' },
  parmesan: { emoji: '🧀', zh: '帕瑪森起司', en: 'Parmesan Cheese', ja: 'パルメザンチーズ', ko: '파마산 치즈', th: 'พาร์เมซานชีส' },
  truffle: { emoji: '🍯', zh: '松露油', en: 'Truffle Oil', ja: 'トリュフオイル', ko: '트러플 오일', th: 'น้ำมันทรัฟเฟิล' },
  onion: { emoji: '🧅', zh: '洋蔥', en: 'Onion', ja: '玉ねぎ', ko: '양파', th: 'หอมหัวใหญ่' },
  pork: { emoji: '🥩', zh: '細絞碎豬肉', en: 'Minced Pork', ja: '豚ひき肉', ko: '다진 돼지고기', th: 'หมูบด' },
  basil: { emoji: '🌿', zh: '打拋葉', en: 'Holy Basil', ja: 'ホーリーバジル', ko: '홀리 바질', th: 'ใบกะเพรา' },
  garlic: { emoji: '🧄', zh: '大蒜', en: 'Garlic', ja: 'ニンニク', ko: '마늘', th: 'กระเทียม' },
  chili: { emoji: '🌶️', zh: '朝天椒', en: 'Bird\'s Eye Chili', ja: 'トウガラシ', ko: '태국 고추', th: 'พริกขี้หนู' },
  oyster: { emoji: '🍶', zh: '蠔油', en: 'Oyster Sauce', ja: 'オイスターソース', ko: '굴소스', th: 'ซอสหอยนางรม' },
  soy: { emoji: '🍶', zh: '生抽醬油', en: 'Soy Sauce', ja: '薄口醤油', ko: '간장', th: 'ซีอิ๊วขาว' },
  fishsauce: { emoji: '🐟', zh: '鮮魚露', en: 'Fish Sauce', ja: 'ナンプラー', ko: '피시 소스', th: 'น้ำปลา' }
};

const initialRecipes = [
  {
    id: '1',
    title: {
      zh: '西京燒烤鱈魚排',
      en: 'Miso Glazed Black Cod (Saikyo Yaki)',
      ja: '銀鱈の西京焼き (Miso Black Cod)',
      ko: '미소 된장 메로구이',
      th: 'ปลาคอดอบมิโสะแบบไซเคียว'
    },
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=1000&auto=format&fit=crop',
    prepTime: '15m',
    cookTime: '20m',
    baseServings: 2,
    tags: ['Japanese', 'Seafood', 'Healthy', 'Premium'],
    ingredients: [
      { key: 'cod', baseAmount: 300, unit: 'g', category: 'Seafood' },
      { key: 'miso', baseAmount: 60, unit: 'g', category: 'Pantry' },
      { key: 'mirin', baseAmount: 45, unit: 'ml', category: 'Pantry' },
      { key: 'sake', baseAmount: 45, unit: 'ml', category: 'Pantry' },
      { key: 'sugar', baseAmount: 15, unit: 'g', category: 'Pantry' }
    ],
    instructions: {
      zh: [
        '調配醬汁：將白味噌、味醂、清酒與白糖攪拌至完全滑順。',
        '醃製魚肉：將鱈魚排擦乾，均勻塗抹上西京燒味噌醬。放入冰箱醃製至少2小時，隔夜風味更佳。',
        '烤箱預熱：烤箱預熱至 200°C (400°F)。輕輕抹掉鱈魚表面多餘的味噌。',
        '完美烘烤：烘烤 15-20 分鐘直至魚肉可用叉子輕易撥開。最後兩分鐘可開啟上火(Broil)使表面呈微焦金黃色。'
      ],
      en: [
        'Make marinade: whisk white miso paste, mirin, sake, and sugar together until completely smooth.',
        'Marinate fish: pat cod dry, slather with the miso mixture, and refrigerate for at least 2 hours (ideally overnight).',
        'Preheat & Wipe: preheat oven to 200°C (400°F). Wipe off any excess miso marinade to prevent burning.',
        'Bake: roast for 15-20 minutes. Broil for the final 2 minutes until caramelized and charred golden brown.'
      ],
      ja: [
        '味噌床を作る：白味噌、みりん、酒、砂糖をダマがなくなるまでよく混ぜ合わせます。',
        '漬け込む：鱈の水分を拭き取り、味噌を全体に塗って冷蔵庫で2時間〜一晩寝かせます。',
        '予熱：オーブンを200°Cに予熱し、焦げ付き防止のために余分な味噌を軽く拭き取ります。',
        '焼き上げる：オーブンで15-20分焼き、最後に2分間グリルして焼き目をつけます。'
      ],
      ko: [
        '양념 만들기: 백된장, 미림, 청주, 설탕을 볼에 넣고 덩어리 없이 부드럽게 섞어줍니다.',
        '생선 재우기: 메로 필레의 물기를 닦고 된장 양념을 골고루 발라 냉장고에서 최소 2시간(권장 하룻밤) 재웁니다.',
        '예열 및 정리: 오븐을 200°C로 예열하고 타지 않도록 생선 표면의 여분 된장을 가볍게 털어냅니다.',
        '굽기: 오븐에서 15-20분 구운 후, 마지막 2분간 브로일러로 노릇하고 먹음직스러운 갈색으로 캐러멜화합니다.'
      ],
      th: [
        'ผสมซอส: ผสมมิโสะขาว, มิริน, สาเก และน้ำตาลทรายในถ้วยจนเนื้อเนียนเป็นเนื้อเดียวกัน',
        'หมักปลา: ซับปลาคอดให้แห้ง ทาซอสมิโสะให้ทั่ว นำไปแช่ตู้เย็นอย่างน้อย 2 ชั่วโมงหรือข้ามคืนเพื่อให้ได้รสชาติที่ดีที่สุด',
        'เตรียมอบ: วอร์มเตาอบที่ 200°C (400°F) เช็ดมิโสะส่วนเกินที่ผิวปลาออกเบาๆ เพื่อไม่ให้ไหม้ง่าย',
        'อบปลา: อบประมาณ 15-20 นาที จากนั้นเปิดไฟบนต่ออีก 2 นาทีเพื่อให้ผิวปลาไหม้เกรียมสีเหลืองทองน่ารับประทาน'
      ]
    },
    nutrition: { calories: 340, protein: 28, carbs: 12, fat: 15 }
  },
  {
    id: '2',
    title: {
      zh: '奢華松露野菇燉飯',
      en: 'Truffle Mushroom Risotto',
      ja: 'トリュフと野茸の本格リゾット',
      ko: '클래식 트러플 버섯 리조또',
      th: 'ริซอตโต้เห็ดทรัฟเฟิลสุดหรู'
    },
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1000&auto=format&fit=crop',
    prepTime: '10m',
    cookTime: '30m',
    baseServings: 4,
    tags: ['Italian', 'Vegetarian', 'Dinner', 'Truffle'],
    ingredients: [
      { key: 'rice', baseAmount: 250, unit: 'g', category: 'Grain' },
      { key: 'mushrooms', baseAmount: 300, unit: 'g', category: 'Produce' },
      { key: 'broth', baseAmount: 900, unit: 'ml', category: 'Pantry' },
      { key: 'parmesan', baseAmount: 80, unit: 'g', category: 'Dairy' },
      { key: 'truffle', baseAmount: 15, unit: 'ml', category: 'Pantry' },
      { key: 'onion', baseAmount: 100, unit: 'g', category: 'Produce' }
    ],
    instructions: {
      zh: [
        '溫熱高湯：在湯鍋中將蔬菜高湯加熱，保持微溫。',
        '煸炒香氣：在深平底鍋中放入橄欖油，加入洋蔥丁炒至半透明。隨後加入切片野菇，炒至金黃香脆。',
        '燉煮稻米：加入 Arborio 義大利米，與香料一起翻炒2分鐘，使其均勻裹上油脂。',
        '慢燉入味：一次加入一勺溫熱高湯，不斷攪拌直至高湯被稻米完全吸收。重複此步驟約 18-20 分鐘。',
        '點睛之筆：離火後，拌入磨碎的帕瑪森起司與奢華松露油。加蓋靜置1分鐘後即刻享用。'
      ],
      en: [
        'Warm broth: heat the vegetable broth in a pot and keep it warm on low heat.',
        'Sauté aromatics: heat olive oil in a wide skillet, cook onions until translucent, then add sliced mushrooms and cook until browned.',
        'Toast grains: stir in the Arborio rice, sauté for 2 minutes to coat each grain with oil.',
        'Simmer: add warm broth one ladle at a time, stirring constantly. Wait until absorbed before adding the next. Repeat for 18-20 minutes.',
        'Finish: remove from heat, stir in grated parmesan and truffle oil. Cover and let rest for 1 minute before serving.'
      ],
      ja: [
        'スープを温める：スープ鍋で野菜スープを温め、微温状態を保ちます。',
        '炒める：深めのフライパンにオリーブオイルを引き、刻んだ玉ねぎを透き通るまで炒めます。キノコを加え、黄金色になるまで炒めます。',
        '米を炒める：アルボリオ米を加え、米全体にオイルがコーティングされるように2分間炒めます。',
        '煮込む：温かいスープを1おたまずつ加え、水分が吸収されるまで絶えずかき混ぜます。これを18-20分間繰り返します。',
        '仕上げ：火を止め、パルメザンチーズとトリュフオイルを加えます。フタをして1分置いてからお召し上がりください。'
      ],
      ko: [
        '육수 데우기: 냄비에 채소 육수를 붓고 따뜻하게 데워 약불로 유지합니다.',
        '재료 볶기: 팬에 올리브유를 두르고 다진 양蔥을 볶다가, 슬라이스한 버섯을 넣어 노릇해질 때까지 함께 볶아 향을 냅니다.',
        '쌀 볶기: 아르보리오 쌀을 넣고 약 2분간 오일이 코팅되도록 저어주며 볶아줍니다.',
        '천천히 끓이기: 따뜻한 육수를 국자로 한 번에 한 국자씩 넣고, 쌀이 육수를 다 흡수할 때까지 계속 저어줍니다. 이 과정을 약 18~20분 반복합니다.',
        '완성: 불을 끄고 갈아둔 파마산 치즈와 트러플 오일을 섞어준 후, 뚜껑을 덮고 1분간 뜸을 들여 완성합니다.'
      ],
      th: [
        'อุ่นน้ำซุป: อุ่นน้ำซุปผักในหม้อให้ร้อนอยู่เสมอด้วยไฟอ่อน',
        'ผัดเครื่องปรุง: ผัดหอมหัวใหญ่สับในกระทะกว้างจนเริ่มใส จากนั้นใส่เห็ดรวมหั่นบางลงไปผัดจนเปลี่ยนเป็นสีเหลืองทองและส่งกลิ่นหอม',
        'คั่วข้าว: ใส่ข้าวอาร์โบรีโอลงไป ผัดประมาณ 2 นาทีเพื่อให้ข้าวเคลือบน้ำมันอย่างทั่วถึง',
        'เคี่ยวข้าว: ค่อยๆ ตักน้ำซุปผักอุ่นใส่กระทะทีละกระบวย คนอย่างต่อเนื่องจนข้าวดูดซับน้ำซุปจนหมด แล้วจึงค่อยเติมน้ำซุปเพิ่ม ทำซ้ำๆ ประมาณ 18-20 นาที',
        'ตบท้าย: ยกลงจากเตา โรยพาร์เมซานชีสขูดและน้ำมันทรัฟเฟิล คนให้เข้ากัน ปิดฝาทิ้งไว้ 1 นาทีพร้อมเสิร์ฟ'
      ]
    },
    nutrition: { calories: 420, protein: 12, carbs: 55, fat: 16 }
  },
  {
    id: '3',
    title: {
      zh: '泰式打拋豬肉飯',
      en: 'Thai Basil Minced Pork (Pad Krapow)',
      ja: 'タイ風豚ひき肉のバジル炒め',
      ko: '태국식 바질 돼지고기 덮밥 (팟카파오무쌉)',
      th: 'ผัดกะเพราหมูสับรสจัดจ้าน'
    },
    image: 'https://images.unsplash.com/photo-1626804475297-4160bbdf4c5c?q=80&w=1000&auto=format&fit=crop',
    prepTime: '10m',
    cookTime: '10m',
    baseServings: 2,
    tags: ['Thai', 'Spicy', 'Quick', 'Classic'],
    ingredients: [
      { key: 'pork', baseAmount: 300, unit: 'g', category: 'Meat' },
      { key: 'basil', baseAmount: 50, unit: 'g', category: 'Produce' },
      { key: 'garlic', baseAmount: 20, unit: 'g', category: 'Produce' },
      { key: 'chili', baseAmount: 15, unit: 'g', category: 'Produce' },
      { key: 'oyster', baseAmount: 25, unit: 'ml', category: 'Pantry' },
      { key: 'soy', baseAmount: 15, unit: 'ml', category: 'Pantry' },
      { key: 'fishsauce', baseAmount: 5, unit: 'ml', category: 'Pantry' }
    ],
    instructions: {
      zh: [
        '搗碎香料：將大蒜與朝天椒放入研缽中，輕輕搗碎以釋放精油香氣。',
        '猛火爆香：熱鍋倒入高溫耐熱油，下入搗好的蒜椒碎，大火快速爆香。',
        '翻炒肉末：加入碎豬肉，用鍋鏟迅速劃散，炒至肉質變色並呈現乾爽感。',
        '調味收尾：淋入蠔油、醬油、魚露，大火翻炒均勻，關火，撒入洗淨的打拋葉，利用餘溫快速翻勻即可。'
      ],
      en: [
        'Pound aromatics: crush garlic and chilies together in a mortar to release the essential oils.',
        'Stir-fry paste: heat oil in a wok over high heat, stir-fry the crushed garlic-chili mixture until fragrant.',
        'Cook pork: add minced pork, breaking it up with a spatula. Sauté until cooked through and dry.',
        'Season & Finish: pour in oyster sauce, soy sauce, fish sauce. Toss well, turn off heat, stir in basil leaves until wilted.'
      ],
      ja: [
        'ハーブを潰す：ニンニクと唐辛子を乳鉢に入れ、香りを引き出すために軽く潰します。',
        '香り出し：フライパンに多めの油を熱し、潰したハーブを強火で素早く炒めます。',
        '肉を炒める：豚ひき肉を加え、塊をほぐしながら水分が飛んでパラパラになるまで炒めます。',
        '調味：オイスターソース、醤油、ナンプラーを加えてよく炒め、火を止めバジルを余熱で和えます。'
      ],
      ko: [
        '향신료 찧기: 마늘과 태국 고추를 절구에 넣고 찧어 향이 올라오게 합니다.',
        '향 내기: 팬에 오일을 두르고 강불에서 찧은 마늘과 고추를 빠르게 볶아 매콤한 향을 냅니다.',
        '고기 볶기: 다진 돼지고기를 넣고 주걱으로 뭉치지 않게 풀어가며 겉면이 바삭하게 건조해질 때까지 볶습니다.',
        '양념 및 마무리: 굴소스, 간장, 피시 소스를 두르고 볶다가, 불을 끄고 바질 잎을 넣어 잔열로 살짝만 숨을 죽입니다.'
      ],
      th: [
        'โขลกเครื่องปรุง: โขลกกระเทียมและพริกขี้หนูเข้าด้วยกันพอหยาบๆ เพื่อให้ได้น้ำมันหอมระเหยและรสเผ็ดร้อน',
        'ผัดเครื่อง: ตั้งกระทะไฟแรง ใส่น้ำมัน ผัดพริกกระเทียมที่โขลกไว้จนส่งกลิ่นฉุนหอมฉุย',
        'ผัดหมู: ใส่หมูสับลงไป ใช้ตะหลิวยีหมูให้กระจายตัวไม่เป็นก้อน ผัดจนหมูสุกแห้งและร่วนกำลังดี',
        'ปรุงรส: ใส่น้ำมันหอย, ซีอิ๊วขาว, น้ำปลา ลงไป คลุกเคล้าให้เข้ากัน ปิดไฟ แล้วจึงใส่ใบกะเพราผัดสะดุ้งไฟพอสลด พร้อมตักราดข้าว'
      ]
    },
    nutrition: { calories: 380, protein: 32, carbs: 6, fat: 25 }
  }
];

const DEFAULT_PANTRY_STOCK = [
  { key: 'cod', emoji: '🐟' },
  { key: 'pork', emoji: '🥩' },
  { key: 'mushrooms', emoji: '🍄' },
  { key: 'onion', emoji: '🧅' },
  { key: 'garlic', emoji: '🧄' },
  { key: 'basil', emoji: '🌿' },
  { key: 'miso', emoji: '🍲' },
  { key: 'parmesan', emoji: '🧀' }
];

const ALL_FOOD_EMOJIS = [
  '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅',
  '🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🧄','🧅','🥔','🍠','🍄','🥜','🌰',
  '🍞','🥐','🥖','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🧈','🧂','🥫',
  '🍱','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥡','🦀','🦞','🦐','🦑','🦪',
  '🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯',
  '🍼','🥛','☕','🍵','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🥤','🧋','🧃','🧊'
];

const MULTILINGUAL_DICT = {
  '蘋果': { zh: '蘋果', en: 'Apple', ja: 'りんご', ko: '사과', th: 'แอปเปิ้ล' },
  'apple': { zh: '蘋果', en: 'Apple', ja: 'りんご', ko: '사과', th: 'แอปเปิ้ล' },
  '牛肉': { zh: '牛肉', en: 'Beef', ja: '牛肉', ko: '소고기', th: 'เนื้อวัว' },
  'beef': { zh: '牛肉', en: 'Beef', ja: '牛肉', ko: '소고기', th: 'เนื้อวัว' },
  '雞肉': { zh: '雞肉', en: 'Chicken', ja: '鶏肉', ko: '닭고기', th: 'เนื้อไก่' },
  'chicken': { zh: '雞肉', en: 'Chicken', ja: '鶏肉', ko: '닭고기', th: 'เนื้อไก่' },
  '豬肉': { zh: '豬肉', en: 'Pork', ja: '豚肉', ko: '돼지고기', th: 'เนื้อหมู' },
  'pork': { zh: '豬肉', en: 'Pork', ja: '豚肉', ko: '돼지고기', th: 'เนื้อหมู' },
  '蛋': { zh: '雞蛋', en: 'Egg', ja: '卵', ko: '계란', th: 'ไข่' },
  'egg': { zh: '雞蛋', en: 'Egg', ja: '卵', ko: '계란', th: 'ไข่' },
  '牛奶': { zh: '牛奶', en: 'Milk', ja: '牛乳', ko: '우유', th: 'นม' },
  'milk': { zh: '牛奶', en: 'Milk', ja: '牛乳', ko: '우유', th: 'นม' },
  '番茄': { zh: '番茄', en: 'Tomato', ja: 'トマト', ko: '토마토', th: 'มะเขือเทศ' },
  'tomato': { zh: '番茄', en: 'Tomato', ja: 'トマト', ko: '토마토', th: 'มะเขือเทศ' },
  '馬鈴薯': { zh: '馬鈴薯', en: 'Potato', ja: 'じゃがいも', ko: '감자', th: 'มันฝรั่ง' },
  'potato': { zh: '馬鈴薯', en: 'Potato', ja: 'じゃがいも', ko: '감자', th: 'มันฝรั่ง' },
  '洋蔥': { zh: '洋蔥', en: 'Onion', ja: '玉ねぎ', ko: '양파', th: 'หัวหอม' },
  'onion': { zh: '洋蔥', en: 'Onion', ja: '玉ねぎ', ko: '양파', th: 'หัวหอม' },
  '大蒜': { zh: '大蒜', en: 'Garlic', ja: 'ニンニク', ko: '마늘', th: 'กระเทียม' },
  'garlic': { zh: '大蒜', en: 'Garlic', ja: 'ニンニク', ko: '마늘', th: 'กระเทียม' },
  '高麗菜': { zh: '高麗菜', en: 'Cabbage', ja: 'キャベツ', ko: '양배추', th: 'กะหล่ำปลี' },
  'cabbage': { zh: '高麗菜', en: 'Cabbage', ja: 'キャベツ', ko: '양배추', th: 'กะหล่ำปลี' },
  '蝦': { zh: '鮮蝦', en: 'Shrimp', ja: 'エビ', ko: '새우', th: 'กุ้ง' },
  'shrimp': { zh: '鮮蝦', en: 'Shrimp', ja: 'エビ', ko: '새우', th: 'กุ้ง' },
  '鮭魚': { zh: '鮭魚', en: 'Salmon', ja: 'サーモン', ko: '연어', th: 'ปลาแซลมอน' },
  'salmon': { zh: '鮭魚', en: 'Salmon', ja: 'サーモン', ko: '연어', th: 'ปลาแซลมอน' },
  '米': { zh: '白米', en: 'Rice', ja: 'ご飯', ko: '쌀', th: 'ข้าว' },
  'rice': { zh: '白米', en: 'Rice', ja: 'ご飯', ko: '쌀', th: 'ข้าว' },
  '起司': { zh: '起司', en: 'Cheese', ja: 'チーズ', ko: '치즈', th: 'ชีส' },
  'cheese': { zh: '起司', en: 'Cheese', ja: 'チーズ', ko: '치즈', th: 'ชีส' },
  '水': { zh: '水', en: 'Water', ja: '水', ko: '물', th: 'น้ำ' },
  'water': { zh: '水', en: 'Water', ja: '水', ko: '물', th: 'น้ำ' },
  '麵包': { zh: '麵包', en: 'Bread', ja: 'パン', ko: '빵', th: 'ขนมปัง' },
  'bread': { zh: '麵包', en: 'Bread', ja: 'パン', ko: '빵', th: 'ขนมปัง' }
};

const callExternalTranslationAPI = async (text, targetLang) => {
  const API_KEY = "YOUR_EXTERNAL_API_KEY"; 
  
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerInput = text.trim().toLowerCase();
        if (MULTILINGUAL_DICT[lowerInput]) {
          resolve(MULTILINGUAL_DICT[lowerInput][targetLang]);
        } else {
          resolve(`[API翻譯] ${text}`); 
        }
      }, 800);
    });
  } catch (error) {
    console.error("External API Error:", error);
    return text;
  }
};

export default function App() {
  const [lang, setLang] = useState('zh');
  const [theme, setTheme] = useState('system'); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [pantryStock, setPantryStock] = useState([]);
  
  const [customItemName, setCustomItemName] = useState('');
  const [customItemEmoji, setCustomItemEmoji] = useState('🥦');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [pantryFilter, setPantryFilter] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const [quickImportUrl, setQuickImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [toast, setToast] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const recipesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'recipes');
    const unsubRecipes = onSnapshot(recipesRef, (snapshot) => {
      if (snapshot.empty) {
        initialRecipes.forEach(async (recipe) => {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'recipes', recipe.id), recipe);
        });
      } else {
        const fetchedRecipes = [];
        snapshot.forEach(doc => fetchedRecipes.push({ id: doc.id, ...doc.data() }));
        setRecipes(fetchedRecipes);
      }
    }, (error) => console.error("Recipes fetch error:", error));

    const pantryRef = collection(db, 'artifacts', appId, 'users', user.uid, 'pantry');
    const unsubPantry = onSnapshot(pantryRef, (snapshot) => {
      if (snapshot.empty) {
        DEFAULT_PANTRY_STOCK.forEach(async (item) => {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'pantry', item.key), item);
        });
      } else {
        const fetchedPantry = [];
        snapshot.forEach(doc => fetchedPantry.push(doc.data()));
        setPantryStock(fetchedPantry);
      }
    }, (error) => console.error("Pantry fetch error:", error));

    return () => {
      unsubRecipes();
      unsubPantry();
    };
  }, [user]);

  // 優化後的 Google 登入機制，能保護並綁定訪客資料
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (user && user.isAnonymous) {
        // 如果當前是訪客，則將帳號「升級」綁定，保留所有本機資料
        await linkWithPopup(user, provider);
        showToast("成功綁定 Google 帳號，您的資料已永久保存！");
      } else {
        await signInWithPopup(auth, provider);
        showToast("成功使用 Google 帳號登入並同步！");
      }
    } catch (error) {
      console.error("Login failed", error);
      if (error.code === 'auth/credential-already-in-use') {
        // 若此 Google 帳號已註冊過，退回一般登入
        await signInWithPopup(auth, provider);
        showToast("已切換至您現有的 Google 帳號。");
      } else {
        showToast("登入取消或失敗：" + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    showToast("已登出，切換回訪客模式");
    await signInAnonymously(auth);
  };

  const t = translations[lang];

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = () => {
      if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
        root.classList.add('dark');
        setIsDarkMode(true);
      } else {
        root.classList.remove('dark');
        setIsDarkMode(false);
      }
    };

    handleThemeChange();
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleQuickImport = (e) => {
    e.preventDefault();
    if (!quickImportUrl) return;
    setIsImporting(true);
    
    setTimeout(() => {
      let mockTitle = {
        zh: "AI 智能解析：香烤法式鮭魚排",
        en: "AI Imported: French Herb Roasted Salmon",
        ja: "AI自動インポート：ハーブ薫るオーブン鮭",
        ko: "AI 가져오기: 프랑스식 허브 연어 구이",
        th: "AI นำเข้า: แซลมอนอบสมุนไพรสไตล์ฝรั่งเศส"
      };
      let mockImage = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop";

      if (quickImportUrl.includes('instagram')) {
        mockTitle = {
          zh: "IG 脆皮和牛漢堡排",
          en: "Instagram Crispy Wagyu Burger",
          ja: "IG映えカリカリ和牛バーガー",
          ko: "인스타 감성 와규 치즈버거",
          th: "เบอร์เกอร์เนื้อวากิวกรอบสไตล์ IG"
        };
        mockImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop";
      }

      const newImportedRecipe = {
        id: String(Date.now()),
        title: mockTitle,
        image: mockImage,
        prepTime: '15m',
        cookTime: '15m',
        baseServings: 2,
        tags: ["Gourmet", "AI Imported"],
        ingredients: [
          { key: 'onion', baseAmount: 100, unit: 'g', category: 'Produce' },
          { key: 'garlic', baseAmount: 15, unit: 'g', category: 'Produce' }
        ],
        instructions: {
          zh: [
            '熱鍋倒少許初榨橄欖油，加入大蒜爆香。',
            '下入調配好之主食材翻炒均勻。',
            '擺盤並撒上現磨黑胡椒與起司粉即可享用！'
          ],
          en: [
            'Heat olive oil in a pan, toss in garlic and saute until aromatic.',
            'Incorporate primary ingredients into the pan and mix thoroughly.',
            'Garnish with freshly ground pepper and cheese dust to complete.'
          ],
          ja: [
            'オリーブオイルを熱し、ニンニクが香るまで炒めます。',
            'メインとなる材料を加えて全体を均一に混ぜ合わせます。',
            'お皿に盛り付け、挽きたての黒胡椒とお好みでチーズを振って完成です。'
          ],
          ko: [
            '팬에 올리브유를 살짝 두르고 다진 마늘을 볶아 향을 냅니다.',
            '손질한 주재료를 팬에 넣고 가볍게 골고루 볶아줍니다.',
            '그릇에 예쁘게 담아 통후추와 치즈가루를 솔솔 뿌려 마무리합니다.'
          ],
          th: [
            'ตั้งกระทะใส่น้ำมันมะกอกเล็กน้อย ใส่กระเทียมลงไปผัดจนส่งกลิ่นหอม',
            'ใส่วัตถุดิบหลักลงในกระทะ ผัดส่วนผสมทั้งหมดให้เข้ากันดี',
            'จัดใส่จาน โรยพริกไทยดำป่นและชีสผงพร้อมรับประทาน'
          ]
        },
        nutrition: { calories: 450, protein: 32, carbs: 8, fat: 28 }
      };

      if (user) {
        setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'recipes', newImportedRecipe.id), newImportedRecipe);
      }
      
      setIsImporting(false);
      setQuickImportUrl('');
      showToast(t.importSuccess);
    }, 1800);
  };

  const togglePantryItem = async (key) => {
    if (!user) return;
    const exists = pantryStock.some(item => item.key === key);
    if (exists) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'pantry', key));
    } else {
      const lexiconMatch = INGREDIENT_LEXICON[key];
      const emoji = lexiconMatch ? lexiconMatch.emoji : '📦';
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'pantry', key), { key, emoji });
    }
  };

  const handleAddCustomIngredient = async (e) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    setIsTranslating(true);
    const customKey = 'custom_' + Date.now();
    const sourceText = customItemName.trim();
    
    try {
      const [zh, en, ja, ko, th] = await Promise.all([
        callExternalTranslationAPI(sourceText, 'zh'),
        callExternalTranslationAPI(sourceText, 'en'),
        callExternalTranslationAPI(sourceText, 'ja'),
        callExternalTranslationAPI(sourceText, 'ko'),
        callExternalTranslationAPI(sourceText, 'th')
      ]);

      const translatedData = { zh, en, ja, ko, th };
      
      const lowerInput = sourceText.toLowerCase();
      if (!MULTILINGUAL_DICT[lowerInput]) {
        showToast(`已透過外部 API 翻譯並新增 "${sourceText}"`);
      } else {
        showToast(`"${translatedData[lang]}" 已加入冰箱！`);
      }

      INGREDIENT_LEXICON[customKey] = {
        emoji: customItemEmoji,
        ...translatedData
      };

      if (user) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'pantry', customKey), { key: customKey, emoji: customItemEmoji });
      }
      
      setCustomItemName('');
      setIsEmojiPickerOpen(false);
      
    } catch (error) {
      showToast("翻譯 API 連線失敗，請稍後再試。");
    } finally {
      setIsTranslating(false);
    }
  };

  const removePantryItem = async (key) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'pantry', key));
  };

  const getRecipeMatchDetails = (recipe) => {
    const totalCount = recipe.ingredients.length;
    if (totalCount === 0) return { matchRate: 100, missing: [], owned: [] };

    const owned = [];
    const missing = [];

    recipe.ingredients.forEach(ing => {
      const isOwned = pantryStock.some(stockItem => stockItem.key === ing.key);
      if (isOwned) {
        owned.push(ing);
      } else {
        missing.push(ing);
      }
    });

    const matchRate = Math.round((owned.length / totalCount) * 100);
    return { matchRate, missing, owned };
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      const titleText = r.title[lang] || r.title['en'];
      
      const ingredientMatch = r.ingredients.some(ing => {
        const trans = INGREDIENT_LEXICON[ing.key];
        if (!trans) return false;
        const localizedName = trans[lang] || trans['en'] || '';
        return localizedName.toLowerCase().includes(searchQuery.toLowerCase());
      });

      const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            ingredientMatch;
      
      const matchesTag = selectedTag === 'All' || r.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [recipes, searchQuery, selectedTag, lang]);

  const allTags = useMemo(() => {
    const tags = new Set();
    recipes.forEach(r => r.tags.forEach(tag => tags.add(tag)));
    return ['All', ...Array.from(tags)];
  }, [recipes]);

  return (
    <div className="min-h-screen font-sans antialiased text-zinc-900 dark:text-zinc-100 transition-colors duration-500 bg-stone-100/50 dark:bg-zinc-950/80 selection:bg-zinc-900/10 selection:dark:bg-white/10 relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-amber-200/20 to-rose-200/20 dark:from-amber-900/10 dark:to-rose-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-emerald-200/20 to-sky-200/20 dark:from-emerald-950/10 dark:to-sky-950/10 blur-[130px]" />
      </div>

      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-white/70 dark:bg-zinc-900/85 backdrop-blur-2xl text-zinc-800 dark:text-zinc-100 px-6 py-4 rounded-[22px] shadow-2xl flex items-center gap-3 border border-white/40 dark:border-zinc-800/60 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-zinc-900/5 dark:bg-white/10 flex items-center justify-center">
            <Sparkles className="text-amber-500 shrink-0 animate-pulse" size={16} />
          </div>
          <p className="text-xs font-semibold tracking-wide flex-1">{toast}</p>
          <button onClick={() => setToast(null)} className="opacity-40 hover:opacity-100 transition-opacity p-1">
            <X size={15} />
          </button>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-white/30 dark:border-zinc-900/40 bg-white/40 dark:bg-zinc-950/45 backdrop-blur-2xl p-7 justify-between sticky top-0 h-screen z-30">
          <div className="space-y-9">
            <div className="flex items-center gap-3 py-1">
              <div className="w-10 h-10 bg-gradient-to-tr from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 rounded-2xl flex items-center justify-center text-white dark:text-zinc-950 shadow-lg relative overflow-hidden shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>
              </div>
              <div className="overflow-hidden">
                <h1 className="text-base font-black tracking-widest text-zinc-950 dark:text-white leading-tight uppercase font-sans truncate">Gourmet Vault</h1>
                <p className="text-[9px] tracking-widest uppercase text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 truncate">Cloud Sync Enabled</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: 'home', icon: Home, label: t.home },
                { id: 'pantry', icon: Refrigerator, label: t.pantry },
                { id: 'add', icon: Plus, label: t.add },
                { id: 'settings', icon: Settings, label: t.settings },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSelectedRecipe(null);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-300 ${
                      isActive 
                        ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md scale-[1.02]' 
                        : 'text-zinc-400 hover:bg-zinc-950/5 dark:hover:bg-white/5 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-200/40 dark:border-zinc-800/40">
            <button 
              onClick={user && !user.isAnonymous ? handleLogout : handleGoogleLogin}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-colors text-left group"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-950/5 dark:bg-white/10 shrink-0 overflow-hidden">
                {user && user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Cloud size={14} className="text-zinc-600 dark:text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                )}
                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-zinc-950 rounded-full ${user && !user.isAnonymous ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                  {user && !user.isAnonymous ? user.displayName || 'Google 用戶' : 'Cloud Sync Center'}
                </p>
                <p className={`text-[9px] uppercase tracking-wider font-black truncate ${user && !user.isAnonymous ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {user && !user.isAnonymous ? '已連線並同步' : '點擊綁定 Google'}
                </p>
              </div>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 pb-32 md:pb-8 transition-all max-w-6xl mx-auto w-full z-10">
          
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-9">
            <div>
              <p className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">{t.tagline}</p>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white mt-1">
                {activeTab === 'home' && t.home}
                {activeTab === 'pantry' && t.pantry}
                {activeTab === 'add' && t.add}
                {activeTab === 'settings' && t.settings}
              </h1>
            </div>

            <div className="flex items-center gap-2 md:hidden self-end sm:self-auto">
              <button 
                onClick={toggleTheme} 
                className="p-3 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/30 dark:border-zinc-800/30 backdrop-blur-md shadow-sm text-zinc-600 dark:text-zinc-300"
              >
                {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </header>

          {activeTab === 'home' && (
            <div className="space-y-8 animate-fade-in">
              
              <div className="bg-white/40 dark:bg-zinc-900/40 border border-white/50 dark:border-zinc-800/40 rounded-[28px] p-6 shadow-xl backdrop-blur-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-950/5 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 shrink-0">
                    <Sparkles size={18} className="text-amber-500 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-sm font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                      {t.importTitle}
                      <span className="text-[8px] uppercase tracking-widest font-black bg-zinc-950/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-400">
                        IG / YT Link
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{t.importPlaceholder}</p>
                  </div>
                </div>

                <form onSubmit={handleQuickImport} className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <input 
                      type="url"
                      placeholder="https://instagram.com/p/...  or  https://youtube.com/... "
                      value={quickImportUrl}
                      onChange={(e) => setQuickImportUrl(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-white/20 dark:border-zinc-800/30 outline-none text-xs placeholder:text-zinc-400 text-zinc-900 dark:text-white focus:border-zinc-950 dark:focus:border-white transition-all shadow-inner"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isImporting || !quickImportUrl}
                    className="px-6 py-3.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-30 shrink-0 hover:scale-[1.01] active:scale-[0.99] shadow-md"
                  >
                    {isImporting ? "Analyzing..." : t.importBtn}
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Filter size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{t.categories}</span>
                  </div>
                  <div className="relative w-full max-w-xs hidden sm:block">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
                    <input 
                      type="text" 
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl text-[11px] bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/30 focus:border-zinc-950 dark:focus:border-white outline-none transition-all placeholder:text-zinc-400 text-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                </div>
                
                <div className="relative w-full sm:hidden">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={13} />
                  <input 
                    type="text" 
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/30 focus:border-zinc-950 dark:focus:border-white outline-none transition-all text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {allTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        selectedTag === tag 
                          ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md' 
                          : 'bg-white/40 dark:bg-zinc-900/40 border border-white/30 dark:border-zinc-800/30 text-zinc-500 hover:text-zinc-950 dark:hover:text-white backdrop-blur-md'
                      }`}
                    >
                      {tag === 'All' ? t.all : tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRecipes.map(recipe => {
                  const { matchRate, missing } = getRecipeMatchDetails(recipe);
                  const titleText = recipe.title[lang] || recipe.title['en'];
                  return (
                    <div 
                      key={recipe.id} 
                      onClick={() => setSelectedRecipe(recipe)}
                      className="group cursor-pointer bg-white/40 dark:bg-zinc-900/45 rounded-[28px] overflow-hidden border border-white/30 dark:border-zinc-800/30 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:scale-[1.01] backdrop-blur-md"
                    >
                      <div className="relative h-44 overflow-hidden shrink-0">
                        <img 
                          src={recipe.image} 
                          alt={titleText} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                        
                        <div className="absolute top-4 right-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-2xl text-[10px] font-bold text-zinc-800 dark:text-zinc-100 shadow-sm flex items-center gap-1">
                          <Flame size={12} className="text-orange-500" />
                          {recipe.nutrition.calories} kcal
                        </div>

                        {pantryStock.length > 0 && (
                          <div className="absolute bottom-4 left-4 bg-zinc-950/85 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                            Match: {matchRate}%
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 leading-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            {titleText}
                          </h3>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-4">
                            <span className="flex items-center gap-1"><Clock size={12} /> {recipe.cookTime}</span>
                            <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.baseServings} {t.servings}</span>
                          </div>

                          {pantryStock.length > 0 && missing.length > 0 && (
                            <div className="mb-4 text-[10px] text-zinc-400 leading-relaxed">
                              <span className="font-black text-zinc-600 dark:text-zinc-300">{t.missingIngredients}: </span>
                              {missing.slice(0, 3).map(m => {
                                const lex = INGREDIENT_LEXICON[m.key];
                                return lex ? lex[lang] || lex['en'] : m.key;
                              }).join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-200/30 dark:border-zinc-800/30">
                          <div className="flex gap-1.5 flex-wrap">
                            {recipe.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-zinc-950/5 dark:bg-white/5 text-zinc-400 rounded-full border border-zinc-200/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="w-7 h-7 rounded-full bg-zinc-950/5 dark:bg-white/5 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                            <X size={12} className="rotate-180 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pantry' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              
              <div className="bg-white/40 dark:bg-zinc-900/40 border border-white/50 dark:border-zinc-800/40 rounded-[28px] p-6 shadow-xl backdrop-blur-2xl space-y-6">
                
                <div className="flex gap-4 items-start">
                  <div className="p-3.5 bg-zinc-950/5 dark:bg-white/10 rounded-2xl">
                    <Refrigerator size={22} className="text-zinc-700 dark:text-zinc-200" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">{t.pantryTitle}</h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t.pantryDesc}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">{t.addCustomIngredient}</span>
                  
                  <form onSubmit={handleAddCustomIngredient} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-950/40 border border-white/20 dark:border-zinc-800/30 rounded-2xl px-3 py-1.5 flex-1 shadow-inner relative">
                      
                      <button 
                        type="button"
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-lg shadow-sm border border-zinc-200/40 dark:border-zinc-800/40 hover:scale-105 transition-transform"
                        title={t.selectEmoji}
                      >
                        {customItemEmoji}
                      </button>

                      <input 
                        type="text" 
                        placeholder={t.ingredientNamePlaceholder}
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="flex-1 bg-transparent text-xs outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400"
                      />

                      {isEmojiPickerOpen && (
                        <div className="absolute left-0 sm:left-3 top-14 z-20 w-[280px] max-h-64 overflow-y-auto no-scrollbar bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-2xl grid grid-cols-6 gap-2 animate-slide-up">
                          {ALL_FOOD_EMOJIS.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setCustomItemEmoji(emoji);
                                setIsEmojiPickerOpen(false);
                              }}
                              className="w-8 h-8 rounded-xl hover:bg-zinc-950/10 dark:hover:bg-white/10 flex items-center justify-center text-lg transition-transform hover:scale-110"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={isTranslating}
                      className="px-5 py-4 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow hover:opacity-90 shrink-0 flex items-center justify-center min-w-[100px]"
                    >
                      {isTranslating ? <Loader2 size={14} className="animate-spin text-white dark:text-zinc-950" /> : t.addBtn}
                    </button>
                  </form>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">{t.pantryInputLabel}</span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {Object.keys(INGREDIENT_LEXICON).map((key) => {
                      const ingredientDetails = INGREDIENT_LEXICON[key];
                      const isSelected = pantryStock.some(stockItem => stockItem.key === key);
                      const localizedName = ingredientDetails[lang] || ingredientDetails['en'] || key;
                      
                      return (
                        <button
                          key={key}
                          onClick={() => togglePantryItem(key)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${
                            isSelected 
                              ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black shadow-lg scale-[1.02]' 
                              : 'bg-white/40 dark:bg-zinc-950/30 text-zinc-600 dark:text-zinc-400 border border-white/20 dark:border-zinc-800/20 hover:border-zinc-400'
                          }`}
                        >
                          <span className="text-sm">{ingredientDetails.emoji}</span>
                          <span>{localizedName}</span>
                          {isSelected && <Check size={11} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    我的冰箱食材 ({pantryStock.length})
                  </h3>
                  {pantryStock.length > 0 && (
                    <button 
                      onClick={() => setPantryStock([])}
                      className="text-[10px] text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-black underline transition-colors"
                    >
                      清空冰箱
                    </button>
                  )}
                </div>

                {pantryStock.length === 0 ? (
                  <div className="bg-white/20 dark:bg-zinc-900/10 border border-white/10 dark:border-zinc-800/10 rounded-3xl p-8 text-center text-zinc-400">
                    <p className="text-xs font-semibold">冰箱空空的，點選上方食材或新增自訂食材吧！</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {pantryStock.map((item) => {
                      const lexiconEntry = INGREDIENT_LEXICON[item.key];
                      const localizedName = lexiconEntry ? lexiconEntry[lang] || lexiconEntry['en'] : item.key;
                      
                      return (
                        <div 
                          key={item.key}
                          className="bg-white/40 dark:bg-zinc-900/40 border border-white/40 dark:border-zinc-800/30 p-3.5 rounded-2xl flex items-center justify-between shadow-sm backdrop-blur-md"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="text-lg shrink-0">{item.emoji}</span>
                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{localizedName}</span>
                          </div>
                          <button 
                            onClick={() => removePantryItem(item.key)}
                            className="text-zinc-400 hover:text-rose-500 p-1 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-200/30 dark:border-zinc-800/30">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  智能配菜推薦 ({recipes.length})
                </h3>

                <div className="grid gap-3">
                  {recipes.map(recipe => {
                    const { matchRate, missing, owned } = getRecipeMatchDetails(recipe);
                    const titleText = recipe.title[lang] || recipe.title['en'];
                    return (
                      <div 
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="flex flex-col sm:flex-row gap-4 p-4 bg-white/40 dark:bg-zinc-900/40 border border-white/40 dark:border-zinc-800/30 rounded-3xl hover:border-zinc-400 cursor-pointer shadow-sm transition-all duration-300 backdrop-blur-md"
                      >
                        <img 
                          src={recipe.image} 
                          className="w-full sm:w-20 h-20 rounded-2xl object-cover shrink-0" 
                          alt="" 
                        />
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-bold text-sm leading-tight text-zinc-900 dark:text-white truncate">{titleText}</h4>
                              <div className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                                匹配 {matchRate}%
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-1">
                              時間: {recipe.cookTime} • {recipe.nutrition.calories} kcal
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 border-t border-zinc-200/20 dark:border-zinc-800/20 text-[10px] overflow-hidden">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                              <span className="text-zinc-400 shrink-0">{t.ownedIngredients}:</span>
                              <span className="font-bold text-zinc-700 dark:text-zinc-300 truncate">
                                {owned.length > 0 ? owned.map(i => {
                                  const lex = INGREDIENT_LEXICON[i.key];
                                  return lex ? lex[lang] || lex['en'] : i.key;
                                }).join(', ') : '無'}
                              </span>
                            </div>
                            {missing.length > 0 && (
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                <span className="text-zinc-400 font-bold shrink-0">{t.missingIngredients}:</span>
                                <span className="text-zinc-600 dark:text-zinc-300 truncate">
                                  {missing.map(i => {
                                    const lex = INGREDIENT_LEXICON[i.key];
                                    return lex ? lex[lang] || lex['en'] : i.key;
                                  }).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white/40 dark:bg-zinc-900/40 border border-white/50 dark:border-zinc-800/40 rounded-[28px] p-6 space-y-6 backdrop-blur-md shadow-xl">
                <div className="text-center space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-950/5 dark:bg-white/10 flex items-center justify-center mx-auto">
                    <PlusIcon size={18} className="text-zinc-700 dark:text-zinc-200" />
                  </div>
                  <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">{t.manualAdd}</h2>
                  <p className="text-xs text-zinc-400">手動編制您的專屬極簡美膳</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">食譜名稱</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 炙烤黑椒鴨胸佐松露汁" 
                      className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-white/20 dark:border-zinc-800/30 outline-none text-xs text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">時間</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 25m" 
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-white/20 dark:border-zinc-800/30 outline-none text-xs text-zinc-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">基準份量</label>
                      <input 
                        type="number" 
                        placeholder="2" 
                        className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-white/20 dark:border-zinc-800/30 outline-none text-xs text-zinc-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400">配料 (每行：配料, 數量, 單位)</label>
                    <textarea 
                      rows="3" 
                      placeholder="大蒜, 20, g&#10;洋蔥, 100, g"
                      className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-white/20 dark:border-zinc-800/30 outline-none text-xs resize-none text-zinc-900 dark:text-white"
                    ></textarea>
                  </div>
                  <button 
                    onClick={() => {
                      showToast("手動導入已模擬成功！食材庫已刷新。");
                      setActiveTab('home');
                    }}
                    className="w-full py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl hover:opacity-90 shadow"
                  >
                    創建保存食譜
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto animate-fade-in">
              <div className="bg-white/40 dark:bg-zinc-900/40 border border-white/50 dark:border-zinc-800/40 rounded-[28px] p-6 space-y-6 backdrop-blur-md shadow-xl">
                
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-950/5 dark:bg-white/10 rounded-xl">
                      <Globe size={15} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{t.language}</h4>
                      <p className="text-[10px] text-zinc-400">App interface language</p>
                    </div>
                  </div>
                  <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-white/80 dark:bg-zinc-950 text-xs font-bold text-zinc-800 dark:text-zinc-200 px-3 py-2 rounded-xl outline-none cursor-pointer border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    <option value="zh">繁體中文 (ZH)</option>
                    <option value="en">English (EN)</option>
                    <option value="ja">日本語 (JA)</option>
                    <option value="ko">한국어 (KO)</option>
                    <option value="th">ภาษาไทย (TH)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-950/5 dark:bg-white/10 rounded-xl">
                      <Layers size={15} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{t.theme}</h4>
                      <p className="text-[10px] text-zinc-400">Dark/Light styling options</p>
                    </div>
                  </div>
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-white/80 dark:bg-zinc-950 text-xs font-bold text-zinc-800 dark:text-zinc-200 px-3 py-2 rounded-xl outline-none cursor-pointer border border-zinc-200/40 dark:border-zinc-800/40"
                  >
                    <option value="system">{t.system}</option>
                    <option value="light">{t.light}</option>
                    <option value="dark">{t.dark}</option>
                  </select>
                </div>

                <div className="bg-white/20 dark:bg-zinc-950/30 p-4 rounded-2xl flex items-start gap-3 border border-white/20 dark:border-zinc-800/20">
                  <AlertCircle className="text-zinc-400 shrink-0 mt-0.5" size={14} />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold">AI Parser Status</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      智能導入支持主流平台 (Instagram, YouTube, Food52 等)。
                    </p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Gourmet Vault v5.2.0 • iOS Blur Edition</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {selectedRecipe && (
        <ImmersiveRecipeReader 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          t={t}
          lang={lang}
        />
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 pt-2 bg-gradient-to-t from-stone-100/90 via-stone-100/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 pointer-events-none">
        <div className="max-w-md mx-auto bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-full px-6 py-3.5 flex justify-between items-center shadow-2xl pointer-events-auto border border-white/40 dark:border-zinc-800/60">
          {[
            { id: 'home', icon: Home },
            { id: 'pantry', icon: Refrigerator },
            { id: 'add', icon: Plus },
            { id: 'settings', icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedRecipe(null);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 relative ${
                  isActive ? 'text-zinc-950 dark:text-white scale-110' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="absolute bottom-0 w-1 h-1 bg-zinc-950 dark:bg-white rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}

function ImmersiveRecipeReader({ recipe, onClose, t, lang }) {
  const [unitSystem, setUnitSystem] = useState('metric');
  
  const [scale, setScale] = useState(1.0);
  const [scalingSource, setScalingSource] = useState(null); 

  const [activeInputKey, setActiveInputKey] = useState(null);
  const [activeInputValue, setActiveInputValue] = useState('');

  const [isTranslated, setIsTranslated] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const currentServings = Math.round(recipe.baseServings * scale * 10) / 10;
  const titleText = recipe.title[lang] || recipe.title['en'];

  const handleTranslate = () => {
    setIsTranslated(!isTranslated);
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleServingsChange = (newServings) => {
    const nextScale = newServings / recipe.baseServings;
    setScale(nextScale);
    setScalingSource(null); 
  };

  const resetAllScales = () => {
    setScale(1.0);
    setScalingSource(null);
    setActiveInputKey(null);
  };

  const formatQuantity = (amount, unit) => {
    const scaledAmount = amount * scale;
    if (unitSystem === 'imperial') {
      if (unit === 'g') {
        const ozValue = scaledAmount * 0.035274;
        return { amount: parseFloat(ozValue.toFixed(1)), unit: 'oz' };
      }
      if (unit === 'ml') {
        const flOzValue = scaledAmount * 0.033814;
        return { amount: parseFloat(flOzValue.toFixed(1)), unit: 'fl oz' };
      }
    }
    return { amount: parseFloat(scaledAmount.toFixed(1)), unit };
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-100/80 dark:bg-zinc-950/90 backdrop-blur-3xl overflow-y-auto animate-fade-in font-sans">
      
      <div className="max-w-3xl mx-auto min-h-screen flex flex-col bg-white/50 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl border-x border-white/20 dark:border-zinc-800/30 pb-24">
        
        <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
          <img src={recipe.image} alt={titleText} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/10"></div>
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <button 
              onClick={onClose}
              className="p-3.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all flex items-center justify-center border border-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              <button className="p-3.5 rounded-2xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all flex items-center justify-center border border-white/10">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {recipe.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-[9px] rounded-full font-bold uppercase tracking-widest border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {titleText}
            </h2>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-8 max-w-2xl mx-auto w-full">
          
          {scalingSource && (
            <div className="bg-white/40 dark:bg-zinc-950/30 border border-white/40 dark:border-zinc-800/20 p-4 rounded-[22px] flex items-center justify-between text-xs animate-fade-in backdrop-blur-lg">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <RefreshCw size={14} className="animate-spin text-zinc-500" />
                <span>
                  {t.scaleNotice} (<strong className="text-zinc-900 dark:text-white">
                    {(() => {
                      const lex = INGREDIENT_LEXICON[scalingSource];
                      return lex ? lex[lang] || lex['en'] : scalingSource;
                    })()}
                  </strong>)
                </span>
              </div>
              <button 
                onClick={resetAllScales}
                className="font-black text-[10px] uppercase tracking-wider text-zinc-900 dark:text-white underline hover:opacity-80"
              >
                {t.resetScale}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-200/30 dark:border-zinc-800/30">
            <button 
              onClick={handleTranslate} 
              className="flex items-center justify-between p-4 rounded-2xl border border-white/40 dark:border-zinc-800/30 bg-white/30 dark:bg-zinc-900/30 hover:bg-white/50 dark:hover:bg-zinc-900/50 transition-all text-xs font-bold uppercase tracking-wider"
            >
              <span className="flex items-center gap-2">
                <Languages size={15} />
                {isTranslated ? 'AI Translated View' : 'Original Language'}
              </span>
              <span className="text-[10px] text-zinc-400 underline">
                {isTranslated ? t.originalLang : t.translateBtn}
              </span>
            </button>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/40 dark:border-zinc-800/30 bg-white/30 dark:bg-zinc-900/30 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Scale size={15} />
                {t.unitSystem}
              </span>
              <div className="flex gap-1.5 bg-zinc-950/5 dark:bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setUnitSystem('metric')}
                  className={`px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider transition-all duration-300 ${unitSystem === 'metric' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black shadow-sm' : 'text-zinc-400 hover:text-zinc-900'}`}
                >
                  {t.metric.split(' ')[0]}
                </button>
                <button 
                  onClick={() => setUnitSystem('imperial')}
                  className={`px-3 py-1 rounded-lg text-[9px] uppercase tracking-wider transition-all duration-300 ${unitSystem === 'imperial' ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black shadow-sm' : 'text-zinc-400 hover:text-zinc-900'}`}
                >
                  {t.imperial.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 p-5 bg-white/30 dark:bg-zinc-950/20 rounded-[24px] border border-white/20 dark:border-zinc-800/20">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{t.servings} (動態比例縮放)</span>
              <p className="text-xs font-black text-zinc-900 dark:text-white">目前比例配置：~{currentServings} 人份</p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/60 dark:bg-zinc-950/40 p-1.5 rounded-2xl border border-white/30 dark:border-zinc-800/30">
              <button 
                onClick={() => handleServingsChange(Math.max(1, currentServings - 1))}
                className="w-9 h-9 rounded-xl bg-zinc-950/5 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center disabled:opacity-30 transition-transform active:scale-95"
                disabled={currentServings <= 1}
              >
                <Minus size={12} />
              </button>
              <span className="w-12 text-center text-xs font-black">{currentServings}</span>
              <button 
                onClick={() => handleServingsChange(currentServings + 1)}
                className="w-9 h-9 rounded-xl bg-zinc-950/5 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center transition-transform active:scale-95"
              >
                <PlusIcon size={12} />
              </button>
            </div>
          </div>

          <div className="bg-white/30 dark:bg-zinc-950/10 rounded-[24px] p-5 space-y-4 border border-white/20 dark:border-zinc-800/20">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Leaf size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">{t.nutritionPerServing}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: t.calories, value: Math.round(recipe.nutrition.calories * scale), unit: 'kcal' },
                { label: t.protein, value: Math.round(recipe.nutrition.protein * scale), unit: 'g' },
                { label: t.carbs, value: Math.round(recipe.nutrition.carbs * scale), unit: 'g' },
                { label: t.fat, value: Math.round(recipe.nutrition.fat * scale), unit: 'g' }
              ].map((nut, idx) => (
                <div key={idx} className="text-center bg-white/50 dark:bg-zinc-900/40 py-3 rounded-2xl border border-white/20 dark:border-zinc-800/25">
                  <span className="text-[9px] text-zinc-400 block truncate">{nut.label}</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{nut.value}</span>
                  <span className="text-[8px] text-zinc-400 block">{nut.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">{t.ingredients} ({recipe.ingredients.length})</h3>
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider">{t.scaleInputLabel}</span>
            </div>
            
            <div className="space-y-2">
              {recipe.ingredients.map((ing, idx) => {
                const ingredientDetails = INGREDIENT_LEXICON[ing.key] || { emoji: '📦', zh: ing.key, en: ing.key, ja: ing.key, ko: ing.key, th: ing.key };
                const localizedIngredientName = ingredientDetails[lang] || ingredientDetails['en'] || ing.key;
                
                const formatted = formatQuantity(ing.baseAmount, ing.unit);
                const baseAmountInCurrentUnit = unitSystem === 'imperial' && ing.unit === 'g' 
                  ? ing.baseAmount * 0.035274 
                  : unitSystem === 'imperial' && ing.unit === 'ml' 
                  ? ing.baseAmount * 0.033814 
                  : ing.baseAmount;

                return (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between py-3 px-4 rounded-2xl text-xs border bg-white/40 dark:bg-zinc-900/25 border-white/35 dark:border-zinc-800/30 shadow-sm backdrop-blur-md"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {ingredientDetails.emoji} {localizedIngredientName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white dark:bg-zinc-950 px-3 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <input 
                          type="number"
                          step="any"
                          value={activeInputKey === ing.key ? activeInputValue : (formatted.amount === 0 ? '' : formatted.amount)}
                          onFocus={() => {
                            setActiveInputKey(ing.key);
                            setActiveInputValue(formatted.amount === 0 ? '' : formatted.amount);
                          }}
                          onBlur={() => {
                            setActiveInputKey(null);
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setActiveInputValue(val);
                            
                            const typedValue = parseFloat(val);
                            if (!isNaN(typedValue) && typedValue >= 0) {
                              const calculatedScale = typedValue / baseAmountInCurrentUnit;
                              setScale(calculatedScale);
                              setScalingSource(ing.key);
                            } else if (val === '') {
                              setScale(0); 
                              setScalingSource(ing.key);
                            }
                          }}
                          className="w-16 bg-transparent outline-none font-bold text-right text-zinc-900 dark:text-white text-xs pr-1"
                        />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase">{formatted.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/30 dark:border-zinc-800/30">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">{t.instructions}</h3>
              <span className="text-[9px] text-zinc-400 uppercase tracking-wider">點擊步驟記錄您的進度</span>
            </div>

            <div className="space-y-4">
              {(recipe.instructions[lang] || recipe.instructions['en']).map((step, idx) => {
                const isCompleted = completedSteps.includes(idx);
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleStep(idx)}
                    className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                      isCompleted 
                        ? 'bg-zinc-950/5 dark:bg-zinc-950/20 opacity-40 border-zinc-100 dark:border-zinc-900 line-through text-zinc-400' 
                        : 'bg-white/40 dark:bg-zinc-900/30 border-white/40 dark:border-zinc-800/40 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] ${
                      isCompleted 
                        ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-900' 
                        : 'border border-zinc-300 dark:border-zinc-700 text-zinc-400'
                    }`}>
                      {isCompleted ? <Check size={10} /> : idx + 1}
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}