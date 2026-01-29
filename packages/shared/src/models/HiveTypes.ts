
export type HiveCategory = 'Vertical' | 'Horizontal';
export type CombSupportType = '4-Sided Frames' | 'Top Bars Only' | 'Extra-Deep Frames';

export interface HiveTypeId {
    id: string; // Internal ID for database storage e.g. 'langstroth_10'
    model: string; // Display name
    category: HiveCategory;
    dimensions: string;
    combSupport: CombSupportType;
    capacity: string;
    defaultBarCount?: number; // For initializing forms
}

export const HIVE_TYPES: HiveTypeId[] = [
    // Vertical
    {
        id: 'langstroth_10',
        model: 'Langstroth (10-Frame)',
        category: 'Vertical',
        dimensions: '19 ⅞" x 16 ¼" x 9 ⅝"',
        combSupport: '4-Sided Frames',
        capacity: '10 Frames'
    },
    {
        id: 'langstroth_8',
        model: 'Langstroth (8-Frame)',
        category: 'Vertical',
        dimensions: '19 ⅞" x 13 ¾" x 9 ⅝"',
        combSupport: '4-Sided Frames',
        capacity: '8 Frames'
    },
    {
        id: 'uk_national',
        model: 'UK National',
        category: 'Vertical',
        dimensions: '18 ⅛" x 18 ⅛" x 8 ⅞"',
        combSupport: '4-Sided Frames',
        capacity: '11 Frames'
    },
    {
        id: 'dadant',
        model: 'Dadant (Blatt)',
        category: 'Vertical',
        dimensions: '19 ⅞" x 18 ½" x 11 ¾"',
        combSupport: '4-Sided Frames',
        capacity: '10–12 Frames'
    },
    {
        id: 'warre',
        model: 'Warré',
        category: 'Vertical',
        dimensions: '13 ⅜" x 13 ⅜" x 8 ¼" (Internal)',
        combSupport: 'Top Bars Only',
        capacity: '8 Bars per box'
    },
    // Horizontal
    {
        id: 'top_bar',
        model: 'Top Bar (Kenyan)',
        category: 'Horizontal',
        dimensions: '~36" to 48" Long (V-shaped)',
        combSupport: 'Top Bars Only',
        capacity: '28–35 Bars',
        defaultBarCount: 30
    },
    {
        id: 'layens',
        model: 'Layens',
        category: 'Horizontal',
        dimensions: '~36" L x 15" W x 16" H',
        combSupport: 'Extra-Deep Frames',
        capacity: '14–20 Frames'
    },
    {
        id: 'long_langstroth',
        model: 'Long Langstroth',
        category: 'Horizontal',
        dimensions: '~48" L x 19 ⅞" W x 9 ⅝" H',
        combSupport: '4-Sided Frames',
        capacity: '30–32 Frames'
    },
    {
        id: 'dartington',
        model: 'Dartington',
        category: 'Horizontal',
        dimensions: '~40" Long',
        combSupport: '4-Sided Frames',
        capacity: '14–21 Frames'
    }
];

// Langstroth Box Types
export type BoxType = 'deep' | 'medium' | 'shallow' | 'excluder' | 'inner_cover' | 'feeder' | 'slatted_rack';

export interface HiveBox {
    id: string;
    type: BoxType;
    frames?: number; // 8 or 10
}

export type HiveType = typeof HIVE_TYPES[number]['id'];
