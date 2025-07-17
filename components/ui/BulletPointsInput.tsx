import React from 'react';

interface BulletPointsInputProps {
  value: string[];
  onChange: (points: string[]) => void;
  label?: string;
}

export const BulletPointsInput: React.FC<BulletPointsInputProps> = ({ value, onChange, label }) => {
  const handleChange = (idx: number, newValue: string) => {
    const updated = [...value];
    updated[idx] = newValue;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...value, '']);
  };

  const handleRemove = (idx: number) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {label && <label className="font-medium text-sm">{label}</label>}
      <div className="flex flex-col gap-2">
        {value.map((point, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={point}
              onChange={e => handleChange(idx, e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={`Bullet point ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
              disabled={value.length === 1}
            >
              -
            </button>
            {idx === value.length - 1 && (
              <button
                type="button"
                onClick={handleAdd}
                className="px-2 py-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 