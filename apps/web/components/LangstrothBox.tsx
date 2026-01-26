'use client';

import { HiveBox, BoxType } from './LangstrothBuilder';

interface LangstrothBoxProps {
    box: HiveBox;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isTop: boolean;
    isBottom: boolean;
}

export function LangstrothBox({ box, onDelete, onMoveUp, onMoveDown, isTop, isBottom }: LangstrothBoxProps) {

    // Visual styles based on type
    const getBoxStyle = (type: BoxType) => {
        switch (type) {
            case 'deep': return 'h-24 bg-[#E67E22] border-[#D35400]';
            case 'medium': return 'h-16 bg-[#F5A623] border-[#E09612]';
            case 'shallow': return 'h-12 bg-[#FCD34D] border-[#F59E0B]';
            case 'excluder': return 'h-2 bg-gray-400 border-gray-500'; // Removed margin here, handled by wrapper
            case 'inner_cover': return 'h-4 bg-[#E6DCC3] border-[#C0B293]';
            case 'feeder': return 'h-12 bg-blue-50 border-blue-200';
        }
    };

    const getLabel = (type: BoxType) => {
        switch (type) {
            case 'deep': return 'Deep';
            case 'medium': return 'Medium';
            case 'shallow': return 'Shallow';
            case 'excluder': return 'Queen Excluder';
            case 'inner_cover': return 'Inner Cover';
            case 'feeder': return 'Top Feeder';
        }
    };

    const isBox = box.type === 'deep' || box.type === 'medium' || box.type === 'shallow' || box.type === 'feeder';
    const isThin = box.type === 'excluder' || box.type === 'inner_cover';

    return (
        // Wrapper div increases the hit area for thin items without affecting visual height too much (using padding)
        <div className={`relative group w-full flex items-center justify-center ${isThin ? 'py-2 -my-2 z-10' : 'my-0.5'}`}>

            <div className={`w-full relative flex items-center justify-center ${isBox ? 'border-2 rounded transition-transform hover:scale-[1.01]' : 'shadow-sm'} ${getBoxStyle(box.type)}`}>

                {/* Box Content (Handles, Label) */}
                {isBox ? (
                    <>
                        {/* Handles (skip for feeder) */}
                        {box.type !== 'feeder' && <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-2 bg-black/10 rounded-full" />}

                        <span className={`${box.type === 'feeder' ? 'text-blue-900' : 'text-white text-shadow'} font-bold  text-sm z-10 select-none drop-shadow-md`}>
                            {getLabel(box.type)}
                        </span>

                        {box.type !== 'feeder' && (
                            <span className="absolute bottom-1 right-2 text-[10px] text-white/70 font-mono">
                                {box.frames} Fr
                            </span>
                        )}
                    </>
                ) : (
                    // Texture for thin items or non-boxes
                    <div className="w-full h-full opacity-50 relative">
                        {/* Excluder Grid Texture */}
                        {box.type === 'excluder' && <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwquE0kJAEXCYwADkAKgAAW/YKA1bXW9AAAAAASUVORK5CYII=')] opacity-50" />}
                        {/* Inner Cover Hole */}
                        {box.type === 'inner_cover' && <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-[#4A3C28]/20 rounded-full" />}
                    </div>
                )}
            </div>

            {/* Hover Controls - Moved further right to avoid covering thin items */}
            <div className="absolute -right-14 top-1/2 -translate-y-1/2 w-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center gap-1 bg-white/50 p-1 rounded backdrop-blur-sm shadow-sm border border-white/50">
                {!isTop && (
                    <button onClick={onMoveUp} className="w-8 h-6 bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 flex items-center justify-center text-xs border border-gray-200 active:scale-95" title="Move Up">
                        ▲
                    </button>
                )}
                <button onClick={onDelete} className="w-8 h-6 bg-white rounded shadow-sm text-gray-600 hover:text-red-600 flex items-center justify-center text-xs border border-gray-200 active:scale-95" title="Remove">
                    ×
                </button>
                {!isBottom && (
                    <button onClick={onMoveDown} className="w-8 h-6 bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 flex items-center justify-center text-xs border border-gray-200 active:scale-95" title="Move Down">
                        ▼
                    </button>
                )}
            </div>
        </div>
    );
}
