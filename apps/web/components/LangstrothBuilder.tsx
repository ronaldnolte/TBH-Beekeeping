'use client';

import { useState, useEffect } from 'react';
import { LangstrothBox } from './LangstrothBox';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { HiveBox, BoxType } from '@tbh-beekeeper/shared';

export interface LangstrothBuilderProps {
    initialBoxes?: HiveBox[];
    onChange?: (boxes: HiveBox[]) => void;
    readOnly?: boolean;
}

export function LangstrothBuilder({ initialBoxes, onChange, readOnly = false }: LangstrothBuilderProps) {
    // Fully controlled component - rely on initialBoxes prop or empty array
    const stack = initialBoxes || [];

    // Local helper to broadcast changes
    const updateStack = (newStack: HiveBox[]) => {
        onChange?.(newStack);
    };



    const [defaultFrames, setDefaultFrames] = useState<8 | 10>(() => {
        if (initialBoxes && initialBoxes.length > 0) {
            return (initialBoxes[0].frames as 8 | 10) || 10;
        }
        return 10;
    });

    const updateFrameCount = (frames: 8 | 10) => {
        setDefaultFrames(frames);
        updateStack(stack.map(box => ({ ...box, frames })));
    };

    const addBox = (type: BoxType) => {
        const newBox: HiveBox = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            frames: defaultFrames
        };
        // Add to top of stack (beginning of array logically, but visually top)
        updateStack([newBox, ...stack]);
    };

    const removeBox = (id: string) => {
        updateStack(stack.filter(b => b.id !== id));
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // If readOnly, don't allow dragging (pass empty sensors or handle in Context)
    // Actually, DndContext doesn't have a simple "disabled" prop, but we can return early or use conditional sensors.
    // Better yet: Conditionally use SortableContext or just render static items if readOnly.

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            updateStack(arrayMove(stack,
                stack.findIndex((item) => item.id === active.id),
                stack.findIndex((item) => item.id === over?.id)
            ));
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start max-w-5xl mx-auto p-0 md:p-2">
            {/* Visualizer Column */}
            <div className="flex-1 w-full flex flex-col items-center overflow-visible pl-4">
                <div className={`relative bg-[#E6DCC3] p-2 text-center border-b border-[#D1C4A9] shadow-sm transition-all duration-300 ${defaultFrames === 8 ? 'w-48 sm:w-56' : 'w-56 sm:w-64'}`}>
                    {/* 3D Depth (Left) - Downward Slope */}
                    <div className="absolute top-0 bottom-0 right-full w-4 origin-right skew-y-[45deg] brightness-75 border-y border-l border-black/10 bg-[#C0B293]"></div>
                    <span className="font-bold text-[#4A3C28]">Outer Cover</span>
                </div>

                {/* Hive Stack - Cohesive Tower (No Gap) */}
                <div className="w-full flex flex-col gap-0 px-4 items-center">
                    {/* Reverse stack for visual display so bottom is bottom */}
                    {/* Note: Data stack[0] is top, so we map as is */}
                    {readOnly ? (
                        <div className="w-full flex flex-col gap-0 px-4 items-center">
                            {stack.map((box, index) => (
                                <LangstrothBox
                                    key={box.id}
                                    box={box}
                                    frames={defaultFrames}
                                    isTop={index === 0}
                                    isBottom={index === stack.length - 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={stack}
                                strategy={verticalListSortingStrategy}
                            >
                                {stack.map((box, index) => (
                                    <LangstrothBox
                                        key={box.id}
                                        box={box}
                                        frames={defaultFrames}
                                        onDelete={() => removeBox(box.id)}
                                        isTop={index === 0}
                                        isBottom={index === stack.length - 1}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>

                <div className={`relative bg-[#4A3C28] text-white p-3 text-center shadow-md transition-all duration-300 ${defaultFrames === 8 ? 'w-48 sm:w-56' : 'w-56 sm:w-64'}`}>
                    {/* 3D Depth (Left) - Downward Slope */}
                    <div className="absolute top-0 bottom-0 right-full w-4 origin-right skew-y-[45deg] brightness-75 border-y border-l border-black/30 bg-[#3E3221]"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-black/20" /> {/* Entrance */}
                    <span className="font-bold text-sm">Bottom Board</span>
                </div>
            </div>

            {/* Controls Column - Hidden in Read Only */}
            {!readOnly && (
                <div className="w-full md:w-56 bg-white p-3 rounded-xl shadow-lg border border-[#E6DCC3] shrink-0">
                    {/* Palette Header */}
                    <div className="bg-gray-50 border-b border-gray-100 p-2 mb-2 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Parts Palette</h3>
                            {/* Tiny Width Toggle */}
                            <div className="flex bg-gray-200 rounded p-0.5">
                                <button type="button" onClick={() => updateFrameCount(8)} className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${defaultFrames === 8 ? 'bg-white shadow text-[#4A3C28]' : 'text-gray-500'}`}>8</button>
                                <button type="button" onClick={() => updateFrameCount(10)} className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${defaultFrames === 10 ? 'bg-white shadow text-[#4A3C28]' : 'text-gray-500'}`}>10</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="grid grid-cols-1 gap-1.5">
                            <button type="button" onClick={() => addBox('deep')} className="flex items-center w-full bg-[#F5A623] hover:bg-[#E09612] text-white text-xs font-bold py-1.5 px-2 rounded shadow-sm border-b-2 border-[#D35400] active:border-b-0 active:translate-y-[2px] transition-all">
                                <span className="w-2.5 h-2.5 bg-[#E67E22] border border-white/40 mr-2 rounded-[1px]"></span>
                                Deep (9⅝")
                            </button>
                            <button type="button" onClick={() => addBox('medium')} className="flex items-center w-full bg-[#F5A623] hover:bg-[#E09612] text-white text-xs font-bold py-1.5 px-2 rounded shadow-sm border-b-2 border-[#E09612] active:border-b-0 active:translate-y-[2px] transition-all">
                                <span className="w-2.5 h-2 bg-[#F5A623] border border-white/40 mr-2 rounded-[1px]"></span>
                                Medium (6⅝")
                            </button>
                            <button type="button" onClick={() => addBox('shallow')} className="flex items-center w-full bg-[#F5A623] hover:bg-[#E09612] text-white text-xs font-bold py-1.5 px-2 rounded shadow-sm border-b-2 border-[#F59E0B] active:border-b-0 active:translate-y-[2px] transition-all">
                                <span className="w-2.5 h-1.5 bg-[#FCD34D] border border-white/40 mr-2 rounded-[1px]"></span>
                                Shallow (5¾")
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                            <button type="button" onClick={() => addBox('excluder')} className="text-left text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1 px-2 rounded border border-gray-300">Excluder</button>
                            <button type="button" onClick={() => addBox('slatted_rack')} className="text-left text-[10px] bg-[#D7CCC8] hover:bg-[#BCAAA4] text-[#5D4037] font-bold py-1 px-2 rounded border border-[#A1887F]">Slatted Rack</button>
                            <button type="button" onClick={() => addBox('inner_cover')} className="text-left text-[10px] bg-[#E6DCC3] hover:bg-[#D1C4A9] text-[#4A3C28] font-bold py-1 px-2 rounded border border-[#C0B293]">Inner Cover</button>
                            <button type="button" onClick={() => addBox('feeder')} className="text-left text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold py-1 px-2 rounded border border-blue-200">Top Feeder</button>
                        </div>

                        <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-center">
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
            )}
        </div>
    );
}
