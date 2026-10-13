export const categories: any[] = [
  {
    id: '1',
    name: 'Single Malt Scotch',
    slug: 'single-malt',
    iconName: 'Flame',
    description: 'Aged malt whiskies from Scotland’s most legendary distilleries in Islay, Speyside, and Highlands.',
    itemCount: 45,
    subcategories: [
      { id: '1-1', name: 'Islay Peated Malts', slug: 'islay-peated', itemCount: 14 },
      { id: '1-2', name: 'Speyside Sherry Cask', slug: 'speyside-sherry', itemCount: 18 },
      { id: '1-3', name: 'Highland Single Malts', slug: 'highland-malts', itemCount: 10 },
      { id: '1-4', name: 'Japanese & World Malts', slug: 'world-malts', itemCount: 8 }
    ]
  },
  {
    id: '2',
    name: 'Blended Scotch & Whisky',
    slug: 'blended-whisky',
    iconName: 'Award',
    description: 'World-renowned blended scotch, Kentucky bourbons, smooth Irish whiskeys and premium Indian blends.',
    itemCount: 60,
    subcategories: [
      { id: '2-1', name: 'Premium Blended Scotch', slug: 'blended-scotch', itemCount: 22 },
      { id: '2-2', name: 'Bourbon & Tennessee Whiskey', slug: 'bourbon-whiskey', itemCount: 15 },
      { id: '2-3', name: 'Irish Whiskey', slug: 'irish-whiskey', itemCount: 12 },
      { id: '2-4', name: 'Indian Single Malts & Blends', slug: 'indian-whisky', itemCount: 11 }
    ]
  },
  {
    id: '3',
    name: 'Vodka',
    slug: 'vodka',
    iconName: 'Sun',
    description: 'Ultra-pure quadruple distilled wheat, rye, and potato vodkas from France, Poland, and Russia.',
    itemCount: 35,
    subcategories: [
      { id: '3-1', name: 'Super Premium Grain Vodka', slug: 'grain-vodka', itemCount: 16 },
      { id: '3-2', name: 'Flavored & Infused Vodka', slug: 'flavored-vodka', itemCount: 12 },
      { id: '3-3', name: 'Craft Potato & Rye Vodka', slug: 'craft-vodka', itemCount: 7 }
    ]
  },
  {
    id: '4',
    name: 'Gin & Botanicals',
    slug: 'gin',
    iconName: 'Leaf',
    description: 'Artisanal dry gins with exotic juniper, citrus peel, cucumber, floral botanicals, and pink gins.',
    itemCount: 30,
    subcategories: [
      { id: '4-1', name: 'London Dry Gin', slug: 'london-dry-gin', itemCount: 14 },
      { id: '4-2', name: 'Contemporary & Floral Gin', slug: 'floral-gin', itemCount: 10 },
      { id: '4-3', name: 'Pink & Fruit Flavored Gin', slug: 'pink-gin', itemCount: 6 }
    ]
  },
  {
    id: '5',
    name: 'Rum',
    slug: 'rum',
    iconName: 'Activity',
    description: 'Rich Caribbean dark rums, golden oak-aged rums, spiced rums, and crisp white cocktail rums.',
    itemCount: 28,
    subcategories: [
      { id: '5-1', name: 'Aged Dark & Solera Rum', slug: 'dark-rum', itemCount: 12 },
      { id: '5-2', name: 'Spiced & Flavored Rum', slug: 'spiced-rum', itemCount: 9 },
      { id: '5-3', name: 'White & Cocktail Rum', slug: 'white-rum', itemCount: 7 }
    ]
  },
  {
    id: '6',
    name: 'Tequila & Mezcal',
    slug: 'tequila',
    iconName: 'ShieldPlus',
    description: '100% Blue Weber Agave tequilas (Blanco, Reposado, Añejo) and artisanal smoky Oaxaca Mezcals.',
    itemCount: 22,
    subcategories: [
      { id: '6-1', name: 'Blanco & Silver Tequila', slug: 'blanco-tequila', itemCount: 8 },
      { id: '6-2', name: 'Reposado & Añejo Tequila', slug: 'reposado-anejo', itemCount: 9 },
      { id: '6-3', name: 'Artisanal Smoky Mezcal', slug: 'mezcal', itemCount: 5 }
    ]
  },
  {
    id: '7',
    name: 'Red Wine',
    slug: 'red-wine',
    iconName: 'HeartHandshake',
    description: 'Full-bodied Cabernet Sauvignon, silky Pinot Noir, rich Shiraz, Chianti, and Bordeaux Grands Crus.',
    itemCount: 40,
    subcategories: [
      { id: '7-1', name: 'Cabernet Sauvignon', slug: 'cabernet-sauvignon', itemCount: 14 },
      { id: '7-2', name: 'Merlot & Pinot Noir', slug: 'pinot-noir-merlot', itemCount: 12 },
      { id: '7-3', name: 'Shiraz & Syrah', slug: 'shiraz-syrah', itemCount: 8 },
      { id: '7-4', name: 'Italian & French Vintages', slug: 'european-vintages', itemCount: 6 }
    ]
  },
  {
    id: '8',
    name: 'White & Rosé Wine',
    slug: 'white-rose-wine',
    iconName: 'Smile',
    description: 'Crisp New Zealand Sauvignon Blanc, oaked Chardonnay, Italian Pinot Grigio, and Provence Rosé.',
    itemCount: 32,
    subcategories: [
      { id: '8-1', name: 'Sauvignon Blanc & Chenin', slug: 'sauvignon-blanc', itemCount: 12 },
      { id: '8-2', name: 'Chardonnay & Pinot Grigio', slug: 'chardonnay-grigio', itemCount: 11 },
      { id: '8-3', name: 'Crisp Provence Rosé', slug: 'provence-rose', itemCount: 9 }
    ]
  },
  {
    id: '9',
    name: 'Champagne & Sparkling',
    slug: 'champagne',
    iconName: 'Wine',
    description: 'Iconic French champagnes from Épernay and Reims, crisp Italian Prosecco, and Spanish Cava.',
    itemCount: 20,
    subcategories: [
      { id: '9-1', name: 'Vintage French Champagne', slug: 'french-champagne', itemCount: 10 },
      { id: '9-2', name: 'Brut & Rosé Champagne', slug: 'brut-rose-champagne', itemCount: 6 },
      { id: '9-3', name: 'Prosecco, Cava & Sparkling', slug: 'prosecco-cava', itemCount: 4 }
    ]
  },
  {
    id: '10',
    name: 'Craft Beer & Ciders',
    slug: 'beer',
    iconName: 'Activity',
    description: 'Chilled Belgian wheat beers, hoppy IPAs, crisp lagers, stout ales, and premium apple ciders.',
    itemCount: 50,
    subcategories: [
      { id: '10-1', name: 'Indian Craft Beers (IPAs & Wheat)', slug: 'indian-craft-beer', itemCount: 18 },
      { id: '10-2', name: 'Belgian & German Ales', slug: 'belgian-german-beer', itemCount: 15 },
      { id: '10-3', name: 'Crisp Lagers & Draughts', slug: 'lagers-pilsners', itemCount: 12 },
      { id: '10-4', name: 'Hard Ciders & Seltzers', slug: 'ciders-seltzers', itemCount: 5 }
    ]
  },
  {
    id: '11',
    name: 'Liqueurs & Aperitifs',
    slug: 'liqueurs',
    iconName: 'User',
    description: 'Velvety Irish creams, Italian herbal aperitivos, coffee liqueurs, Sambuca, and triple secs.',
    itemCount: 25,
    subcategories: [
      { id: '11-1', name: 'Irish Cream & Coffee Liqueurs', slug: 'irish-cream-coffee', itemCount: 8 },
      { id: '11-2', name: 'Aperitifs, Bitters & Vermouth', slug: 'aperitifs-bitters', itemCount: 10 },
      { id: '11-3', name: 'Triple Sec & Fruit Liqueurs', slug: 'triple-sec-fruit', itemCount: 7 }
    ]
  },
  {
    id: '12',
    name: 'Mixers & Bar Accessories',
    slug: 'mixers-accessories',
    iconName: 'Cross',
    description: 'Artisanal tonic waters, ginger ales, crystal cocktail glasses, stainless steel shakers, and syrups.',
    itemCount: 30,
    subcategories: [
      { id: '12-1', name: 'Craft Tonics & Ginger Ale', slug: 'craft-tonics', itemCount: 12 },
      { id: '12-2', name: 'Cocktail Syrups & Bitters', slug: 'syrups-bitters', itemCount: 9 },
      { id: '12-3', name: 'Crystal Glassware & Shaker Sets', slug: 'barware-glassware', itemCount: 9 }
    ]
  }
];

export const image1Categories: any[] = [
  {
    id: 'c1',
    name: 'Single Malt Scotch',
    slug: 'single-malt',
    badge: 'LUXURY',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c2',
    name: 'Blended Whisky',
    slug: 'blended-whisky',
    badge: 'TOP SELLER',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c3',
    name: 'Premium Vodka',
    slug: 'vodka',
    badge: 'CHILLED',
    image: 'https://images.unsplash.com/photo-1608885823108-057aeb92b42c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c4',
    name: 'Artisanal Gin',
    slug: 'gin',
    badge: 'BOTANICAL',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c5',
    name: 'Caribbean Rum',
    slug: 'rum',
    badge: 'AGED',
    image: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c6',
    name: 'Tequila & Mezcal',
    slug: 'tequila',
    badge: '100% AGAVE',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c7',
    name: 'Vintage Red Wine',
    slug: 'red-wine',
    badge: 'RESERVE',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c8',
    name: 'White & Rosé Wine',
    slug: 'white-rose-wine',
    badge: 'CRISP',
    image: 'https://images.unsplash.com/photo-1566754488733-b01f13f48924?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c9',
    name: 'Champagne & Prosecco',
    slug: 'champagne',
    badge: 'CELEBRATION',
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c10',
    name: 'Craft Beer & Ales',
    slug: 'beer',
    badge: '30-MIN CHILLED',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c11',
    name: 'Liqueurs & Creams',
    slug: 'liqueurs',
    badge: 'DECRO',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'c12',
    name: 'Bar Mixers & Glassware',
    slug: 'mixers-accessories',
    badge: 'ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80'
  }
];

export const brandsList: any[] = [
  {
    id: 'b1',
    name: 'The Macallan',
    country: 'Scotland',
    logo: 'M',
    itemCount: 8,
    description: 'The world’s most admired single malt scotch whisky, renowned for exceptional oak sherry seasoned casks.'
  },
  {
    id: 'b2',
    name: 'Glenfiddich',
    country: 'Scotland',
    logo: 'G',
    itemCount: 12,
    description: 'The world’s most awarded single malt Scotch whisky, crafted with passion since 1887 in Dufftown.'
  },
  {
    id: 'b3',
    name: 'Johnnie Walker',
    country: 'Scotland',
    logo: 'JW',
    itemCount: 15,
    description: 'The iconic Scotch whisky brand featuring Red, Black, Gold, Green, 18 Year Old, and Blue Label.'
  },
  {
    id: 'b4',
    name: 'Grey Goose',
    country: 'France',
    logo: 'GG',
    itemCount: 6,
    description: 'Extraordinary French vodka crafted with finest French winter wheat and natural Gensac spring water.'
  },
  {
    id: 'b5',
    name: "Hendrick's",
    country: 'Scotland',
    logo: 'H',
    itemCount: 5,
    description: 'A curiously crafted gin infused with classic botanicals, Bulgarian rose petal, and crisp cucumber.'
  },
  {
    id: 'b6',
    name: 'Don Julio',
    country: 'Mexico',
    logo: 'DJ',
    itemCount: 6,
    description: 'World luxury 100% Blue Agave tequila, founded by Don Julio González in the Highlands of Jalisco.'
  },
  {
    id: 'b7',
    name: 'Moët & Chandon',
    country: 'France',
    logo: 'MC',
    itemCount: 6,
    description: 'Founded in 1743, the world’s most beloved luxury champagne house from Épernay, France.'
  },
  {
    id: 'b8',
    name: 'Monkey 47',
    country: 'Germany',
    logo: 'M47',
    itemCount: 4,
    description: 'Schwarzwald Dry Gin from the Black Forest featuring 47 hand-picked, unfiltered botanical ingredients.'
  },
  {
    id: 'b9',
    name: "Jack Daniel's",
    country: 'USA',
    logo: 'JD',
    itemCount: 8,
    description: 'Charcoal mellowed Tennessee whiskey from the oldest registered distillery in the United States.'
  },
  {
    id: 'b10',
    name: 'Jameson',
    country: 'Ireland',
    logo: 'J',
    itemCount: 7,
    description: 'Triple-distilled Irish whiskey renowned for exceptional smoothness, aged in oak barrels.'
  },
  {
    id: 'b11',
    name: 'Corona Extra',
    country: 'Mexico',
    logo: 'C',
    itemCount: 5,
    description: 'World-famous refreshing Mexican lager, best served ice-cold with a wedge of fresh lime.'
  },
  {
    id: 'b12',
    name: 'Baileys',
    country: 'Ireland',
    logo: 'B',
    itemCount: 4,
    description: 'The original Irish cream liqueur combining fresh dairy cream with aged Irish whiskey.'
  },
  {
    id: 'b13',
    name: 'Tanqueray',
    country: 'United Kingdom',
    logo: 'T',
    itemCount: 5,
    description: 'Four times distilled London dry gin with perfectly balanced juniper, coriander, and angelica.'
  },
  {
    id: 'b14',
    name: 'Bira 91',
    country: 'India',
    logo: 'B91',
    itemCount: 8,
    description: 'Handcrafted playful craft beer brewed with premium ingredients, Belgian wheat, and rich malts.'
  }
];
