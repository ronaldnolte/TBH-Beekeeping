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
            case 'deep': return 'h-24 bg-[#E67E22] border-[#D35400]'; // Tallest, darker orange
            case 'medium': return 'h-16 bg-[#F5A623] border-[#E09612]'; // Medium, standard orange
            case 'shallow': return 'h-12 bg-[#FCD34D] border-[#F59E0B]'; // Shortest, light orange/yellow
            case 'excluder': return 'h-2 bg-gray-400 border-gray-500 my-0.5'; // Wire grid
        }
    };

    const getLabel = (type: BoxType) => {
        switch (type) {
            case 'deep': return 'Deep';
            case 'medium': return 'Medium';
            case 'shallow': return 'Shallow';
            case 'excluder': return 'Queen Excluder';
        }
    };

    const isBox = box.type !== 'excluder';

    return (
        <div className={`relative group w-full ${isBox ? 'border-2 rounded transition-transform hover:scale-[1.01]' : ''} ${getBoxStyle(box.type)} shadow-sm flex items-center justify-center`}>

            {/* Box Content (Handles, Label) */}
            {isBox ? (
                <>
                    {/* Handles */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-2 bg-black/10 rounded-full" />
                    <span className="text-white font-bold text-shadow text-sm z-10 select-none drop-shadow-md">
                        {getLabel(box.type)}
                    </span>
                    <span className="absolute bottom-1 right-2 text-[10px] text-white/70 font-mono">
                        {box.frames} Fr
                    </span>
                </>
            ) : (
                <div className="w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwquE0kJAEXCYwADkAKgAAW/YKA1bXW9AAAAAASUVORK5CYII=')] opacity-50" />
            )}

            {/* Hover Controls */}
            <div className="absolute -right-12 top-0 bottom-0 w-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center gap-1">
                {!isTop && (
                    <button onClick={onMoveUp} className="w-6 h-6 bg-white rounded-full shadow text-gray-600 hover:text-blue-600 flex items-center justify-center text-xs border border-gray-200" title="Move Up">
                        ▲
                    </button>
                )}
                <button onClick={onDelete} className="w-6 h-6 bg-white rounded-full shadow text-gray-600 hover:text-red-600 flex items-center justify-center text-xs border border-gray-200" title="Remove">
                    ×
                </button>
                {!isBottom && (
                    <button onClick={onMoveDown} className="w-6 h-6 bg-white rounded-full shadow text-gray-600 hover:text-blue-600 flex items-center justify-center text-xs border border-gray-200" title="Move Down">
                        ▼
                    </button>
                )}
            </div>
        </div>
    );
}
