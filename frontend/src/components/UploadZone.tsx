"use client";

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    onUpload(droppedFiles);
  }, [onUpload]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group
          ${isDragging
            ? 'border-white bg-white/20 scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.3)]'
            : 'border-white/30 hover:border-white hover:bg-white/10'}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        <div className="bg-white/20 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform shadow-inner border border-white/20">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-agale">
          Upload Resumes
        </h3>
        <p className="text-white/60 text-center max-w-sm font-light leading-relaxed">
          Drag and drop your PDF or DOCX resumes here, or click to browse from your computer.
        </p>
        <input
          type="file"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files) {
              const selectedFiles = Array.from(e.target.files);
              setFiles(prev => [...prev, ...selectedFiles]);
              onUpload(selectedFiles);
            }
          }}
        />
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 space-y-3"
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <h4 className="font-medium text-white/80">Selected Files ({files.length})</h4>
              <button
                onClick={() => setFiles([])}
                className="text-sm text-rose-300 hover:text-rose-200 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-2.5 rounded-lg border border-white/10">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white truncate max-w-[200px] tracking-wide">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
