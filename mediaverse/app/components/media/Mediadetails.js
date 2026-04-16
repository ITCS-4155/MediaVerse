"use client";

import React from "react";

export default function MediaDetailsModal({ item, onClose, onAdd }) {
    if (!item) return null;

    const year = item.releaseDate ? item.releaseDate.substring(0, 4) : "Unknown Year";

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center px-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-[#0d1117] border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-black transition-colors z-10"
                >
                    ✕
                </button>

                {/* Left Side: Image */}
                <div className="md:w-2/5 bg-[#06080f] flex-shrink-0">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover min-h-[300px] md:min-h-full" />
                    ) : (
                        <div className="w-full h-full min-h-[300px] flex items-center justify-center text-gray-700 uppercase tracking-widest font-bold">
                            No Image
                        </div>
                    )}
                </div>

                {/* Right Side: Details */}
                <div className="p-6 md:p-8 md:w-3/5 flex flex-col">
                    <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2">{item.type || "Media"}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-50 mb-2 leading-tight">{item.title}</h2>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-semibold">
                        <span>{year}</span>
                        {item.creator && (
                            <>
                                <span>•</span>
                                <span>{item.creator}</span>
                            </>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-200 mb-2">Synopsis</h3>
                        <p className="text-sm text-gray-400 leading-relaxed max-h-[200px] overflow-y-auto pr-2">
                            {item.description || "No description available for this item."}
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <button
                            onClick={() => { onAdd(item); onClose(); }}
                            className="w-full py-3 px-4 bg-emerald-400 text-[#06080f] text-sm font-bold rounded-xl hover:bg-emerald-300 transition-colors shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                        >
                            + Add to Library
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}