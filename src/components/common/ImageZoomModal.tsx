import React from 'react';
import { X, ZoomIn, Calendar, FileText } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrl: string;
  category?: string;
  date?: string;
  notes?: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  title,
  imageUrl,
  category,
  date,
  notes,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="image-zoom-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="image-zoom-modal-content"
        className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl flex flex-col border border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <ZoomIn className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-lg">{title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                {category && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    {category}
                  </span>
                )}
                {date && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {date}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            id="close-zoom-modal-btn"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 min-h-[300px] overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
          />
        </div>

        {/* Footer with Notes */}
        {notes && (
          <div className="border-t border-slate-800 p-4 bg-slate-900 flex items-start gap-3">
            <FileText className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
