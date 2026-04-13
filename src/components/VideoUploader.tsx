import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Video, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function VideoUploader({ onFileSelect, selectedFile, onClear, disabled }: VideoUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'image/gif': ['.gif']
    },
    maxFiles: 1,
    multiple: false,
    disabled
  } as any);

  if (selectedFile) {
    return (
      <div className="relative group rounded-xl border border-[#141414] bg-[#E4E3E0] p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
          <Video size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#141414] truncate">{selectedFile.name}</p>
          <p className="text-xs text-[#141414]/60">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed border-[#141414]/20 bg-[#E4E3E0] p-12 transition-all hover:border-[#141414]/40",
        isDragActive && "border-[#141414] bg-[#141414]/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#141414]/5 flex items-center justify-center text-[#141414]">
          <Upload size={32} />
        </div>
        <div>
          <p className="text-lg font-medium text-[#141414]">Drop your video or GIF here</p>
          <p className="text-sm text-[#141414]/60 mt-1">MP4, MOV, AVI, WebM or GIF (Max 20MB recommended)</p>
        </div>
      </div>
    </div>
  );
}
