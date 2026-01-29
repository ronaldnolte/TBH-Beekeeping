'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HiveBox, BoxType } from '@tbh-beekeeper/shared';

interface LangstrothBoxProps {
    box: HiveBox;
    frames: number; // Global frame count (8 or 10)
    onDelete: () => void;
    isTop: boolean;
    isBottom: boolean;
}

export function LangstrothBox({ box, frames, onDelete, isTop, isBottom }: LangstrothBoxProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: box.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none', // Important for touch devices
        zIndex: isDragging ? 50 : 'auto',
    };

    // Visual styles based on type
    const getBoxStyle = (type: BoxType) => {
        switch (type) {
            case 'deep': return 'h-24 bg-[#E67E22] border-[#D35400]';
            case 'medium': return 'h-16 bg-[#F5A623] border-[#E09612]';
            case 'shallow': return 'h-12 bg-[#FCD34D] border-[#F59E0B]';
            case 'excluder': return 'h-2 bg-gray-400 border-gray-500';
            case 'inner_cover': return 'h-4 bg-[#E6DCC3] border-[#C0B293]';
            case 'feeder': return 'h-12 bg-blue-50 border-blue-200';
            case 'slatted_rack': return 'h-8 bg-[#8D6E63] border-[#795548]'; // Dark wood
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
            case 'slatted_rack': return 'Slatted Rack';
        }
    };

    const isBox = box.type === 'deep' || box.type === 'medium' || box.type === 'shallow' || box.type === 'feeder' || box.type === 'slatted_rack';
    const isThin = box.type === 'excluder' || box.type === 'inner_cover';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group flex items-center justify-center transition-all duration-300 ${frames === 8 ? 'w-48 sm:w-56' : 'w-56 sm:w-64'} ${isThin ? 'py-2 -my-2 z-10' : ''}`}
        >
            {/* 3D Depth Side Panel (Left) */}
            {isBox && (
                <div
                    className={`absolute top-0 bottom-0 right-full w-4 origin-right skew-y-[45deg] brightness-75 border-y border-l ${box.type === 'slatted_rack' ? 'border-[#5D4037]' : 'border-black/20'}`}
                    style={{
                        backgroundColor:
                            box.type === 'deep' ? '#D35400' :
                                box.type === 'medium' ? '#E67E22' :
                                    box.type === 'shallow' ? '#F59E0B' :
                                        box.type === 'feeder' ? '#BFDBFE' :
                                            box.type === 'slatted_rack' ? '#5D4037' : 'gray'
                    }}
                />
            )}
            <div
                {...attributes}
                {...listeners}
                className={`w-full relative flex items-center justify-center cursor-grab active:cursor-grabbing ${isBox ? 'border-2' : 'shadow-sm'} ${getBoxStyle(box.type)}`}
            >

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

            {/* Side Controls (Delete) */}
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-100 flex flex-col justify-center gap-1">
                {/* Drag Handle Indicator (Optional visual cue) */}
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mb-1 flex justify-center w-8">
                    <svg width="12" height="20" viewBox="0 0 6 10" fill="currentColor"><circle cx="1" cy="1" r="1" /><circle cx="1" cy="5" r="1" /><circle cx="1" cy="9" r="1" /><circle cx="5" cy="1" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="5" cy="9" r="1" /></svg>
                </div>

                <button
                    type="button"
                    onClick={onDelete}
                    className="w-8 h-8 bg-white/80 rounded-full shadow-sm text-gray-500 hover:text-red-600 hover:bg-white flex items-center justify-center text-sm border border-gray-200 transition-all active:scale-95"
                    title="Remove"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
