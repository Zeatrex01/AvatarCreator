import React, { useCallback } from 'react';
import { GripVertical, Crop, X } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ── Single sortable thumbnail ─────────────────────────────────────────────────

function SortableFile({ id, preview, index, onCrop, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform:  CSS.Transform.toString(transform),
        transition,
        opacity:    isDragging ? 0.4 : 1,
        zIndex:     isDragging ? 50 : 'auto',
      }}
      className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/60 aspect-square flex items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1.5 left-1.5 z-10 p-1 rounded-lg bg-white/80 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </div>

      {/* Frame index badge */}
      <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {index + 1}
      </div>

      <img
        src={preview}
        alt={`frame ${index + 1}`}
        className="max-w-full max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
      />

      {/* Action overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
        <div className="flex gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={onCrop}   className="p-2.5 bg-white text-indigo-600 rounded-full hover:scale-110 transition-all shadow-lg" title="Crop">
            <Crop size={15} strokeWidth={2.5} />
          </button>
          <button onClick={onDelete} className="p-2.5 bg-red-500 text-white rounded-full hover:scale-110 transition-all shadow-lg" title="Delete">
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sortable grid container ───────────────────────────────────────────────────

/**
 * SortableFileGrid
 * Single responsibility: render a drag-to-reorder thumbnail grid.
 *
 * Props:
 *   fileIds   string[]
 *   urlOf     (id) => string
 *   onCrop    (id) => void
 *   onDelete  (id) => void
 *   onReorder (activeId, overId) => void
 */
export default function SortableFileGrid({ fileIds, urlOf, onCrop, onDelete, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = useCallback(({ active, over }) => {
    if (over && active.id !== over.id) onReorder(active.id, over.id);
  }, [onReorder]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fileIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-2">
          {fileIds.map((id, i) => (
            <SortableFile
              key={id}
              id={id}
              preview={urlOf(id)}
              index={i}
              onCrop={() => onCrop(id)}
              onDelete={() => onDelete(id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
