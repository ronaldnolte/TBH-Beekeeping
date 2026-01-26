'use client';

import { useState } from 'react';
import { LangstrothBox } from './LangstrothBox';

export type BoxType = 'deep' | 'medium' | 'shallow' | 'excluder' | 'inner_cover' | 'feeder' | 'slatted_rack';

export interface HiveBox {
    id: string;
    type: BoxType;
    frames?: number; // 8 or 10
}

export function LangstrothBuilder() {
    const [stack, setStack] = useState<HiveBox[]>([
        { id: '1', type: 'deep', frames: 10 },
        { id: '2', type: 'deep', frames: 10 },
    ]);

    const addBox = (type: BoxType) => {
        const newBox: HiveBox = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            frames: 10
        };
        // Add to top of stack (beginning of array logically, but visually top)
        setStack([newBox, ...stack]);
    };

    const removeBox = (id: string) => {
        setStack(stack.filter(b => b.id !== id));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newStack = [...stack];
        [newStack[index - 1], newStack[index]] = [newStack[index], newStack[index - 1]];
        setStack(newStack);
    };

    const moveDown = (index: number) => {
        if (index === stack.length - 1) return;
        const newStack = [...stack];
        [newStack[index + 1], newStack[index]] = [newStack[index], newStack[index + 1]];
        setStack(newStack);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start max-w-4xl mx-auto p-4">
            {/* Visualizer Column */}
            <div className="flex-1 w-full flex flex-col items-center">
                <div className="bg-[#E6DCC3] rounded-t-lg p-2 w-full max-w-xs text-center border-b border-[#D1C4A9] shadow-sm mb-1">
                    <span className="font-bold text-[#4A3C28]">Outer Cover</span>
                </div>

                {/* Scrollable Hive Area */}
                <div className="w-full max-w-xs flex flex-col gap-1 max-h-[60vh] overflow-y-auto overflow-x-visible px-2 py-4 scrollbar-hide">
                    {/* Reverse stack for visual display so bottom is bottom */}
                    {/* Note: Data stack[0] is top, so we map as is */}
                    {stack.map((box, index) => (
                        <LangstrothBox
                            key={box.id}
                            box={box}
                            onDelete={() => removeBox(box.id)}
                            onMoveUp={() => moveUp(index)}
                            onMoveDown={() => moveDown(index)}
                            isTop={index === 0}
                            isBottom={index === stack.length - 1}
                        />
                    ))}
                </div>

                <div className="bg-[#4A3C28] text-white rounded-lg p-3 w-full max-w-xs text-center shadow-md mt-1 relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-black/20" /> {/* Entrance */}
                    <span className="font-bold text-sm">Bottom Board</span>
                </div>
            </div>

            {/* Controls Column */}
            <div className="w-full md:w-64 bg-white p-6 rounded-xl shadow-lg border border-[#E6DCC3]">
                <h3 className="font-serif font-bold text-xl text-[#4A3C28] mb-4">Build Hive</h3>

                <div className="space-y-3">
                    <button
                        onClick={() => addBox('deep')}
                        className="w-full py-3 px-4 bg-[#F5A623] hover:bg-[#E09612] text-white font-bold rounded shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-8 bg-[#E67E22] border border-white/30 rounded-sm"></div>
                        Deep Box (9⅝")
                    </button>

                    <button
                        onClick={() => addBox('medium')}
                        className="w-full py-3 px-4 bg-[#F5A623] hover:bg-[#E09612] text-white font-bold rounded shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-6 bg-[#F5A623] border border-white/30 rounded-sm"></div>
                        Medium Box (6⅝")
                    </button>

                    <button
                        onClick={() => addBox('shallow')}
                        className="w-full py-3 px-4 bg-[#F5A623] hover:bg-[#E09612] text-white font-bold rounded shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-4 bg-[#FCD34D] border border-white/30 rounded-sm"></div>
                        Shallow Box (5¾")
                    </button>

                    <div className="h-px bg-gray-200 my-2"></div>

                    <button
                        onClick={() => addBox('excluder')}
                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded border border-gray-300 shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-1 bg-gray-400 rounded-sm"></div>
                        Queen Excluder
                    </button>

                    <button
                        onClick={() => addBox('slatted_rack')}
                        className="w-full py-2 px-4 bg-[#D7CCC8] hover:bg-[#BCAAA4] text-[#5D4037] font-bold rounded border border-[#A1887F] shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-2 bg-[#8D6E63] border border-white/30 rounded-sm"></div>
                        Slatted Rack
                    </button>

                    <button
                        onClick={() => addBox('inner_cover')}
                        className="w-full py-2 px-4 bg-[#E6DCC3] hover:bg-[#D1C4A9] text-[#4A3C28] font-bold rounded border border-[#C0B293] shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-2 bg-[#E6DCC3] border border-black/10 rounded-sm"></div>
                        Inner Cover
                    </button>

                    <button
                        onClick={() => addBox('feeder')}
                        className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded border border-blue-200 shadow-sm text-left flex items-center gap-3 transition-colors"
                    >
                        <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-sm"></div>
                        Top Feeder
                    </button>

                    <div className="mt-6 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                        <strong>Stats:</strong><br />
                        Total Height: {stack.reduce((acc, b) => {
                            if (b.type === 'deep') return acc + 9.625;
                            if (b.type === 'medium') return acc + 6.625;
                            if (b.type === 'shallow') return acc + 5.75;
                            if (b.type === 'feeder') return acc + 4.0; // Approx
                            if (b.type === 'inner_cover') return acc + 0.75;
                            if (b.type === 'slatted_rack') return acc + 2.0;
                            return acc + 0.5; // Excluder
                        }, 0).toFixed(2)}"
                    </div>
                </div>
            </div>
        </div>
    );
}
