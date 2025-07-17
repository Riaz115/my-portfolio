import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  value: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  label?: string;
  previewUrl?: string | string[] | null;
  multiple?: boolean;
  onRemove?: (idx: number) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, previewUrl, multiple, onRemove, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const files = Array.from(e.target.files || []);
      onChange(files.length ? files : null);
    } else {
      const file = e.target.files?.[0] || null;
      onChange(file);
    }
  };

  const handleCameraClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`flex flex-col ${multiple ? 'items-center' : 'items-center'} space-y-0 relative pb-8 w-full`}>
      {label && <span className="mb-2 font-medium text-sm">{label}</span>}
      {!multiple ? (
        <div className={`rounded-full overflow-hidden border-4 border-primary/20 flex items-center justify-center bg-muted mb-2 relative ${className || 'w-40 h-40'}`}>
          {previewUrl ? (
            <img src={previewUrl as string} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-20 h-20 text-muted-foreground" />
          )}
          <button
            type="button"
            onClick={handleCameraClick}
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 bg-white dark:bg-background rounded-full p-1 shadow hover:bg-primary/10 z-10 border border-primary"
            tabIndex={-1}
          >
            <Camera className="w-4 h-4 text-primary" />
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={handleCameraClick}
            className="mb-4 mt-2 bg-white dark:bg-background rounded-full p-2 shadow hover:bg-primary/10 z-10 border border-primary flex items-center justify-center"
            tabIndex={-1}
          >
            <Camera className="w-6 h-6 text-primary" />
          </button>
          {Array.isArray(previewUrl) && previewUrl.length > 0 && (
            <div className="flex flex-row gap-2 mt-6 mb-6 w-full justify-start items-center">
              {previewUrl.map((url, idx) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded border border-primary/20"
                  />
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(idx)}
                      className="absolute top-1 right-1 bg-white dark:bg-zinc-900 rounded-full p-1 shadow border border-primary/30 text-red-500 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        multiple={!!multiple}
      />
    </div>
  );
}; 