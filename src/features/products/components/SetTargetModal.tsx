import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface SetTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget?: number;
  productName: string;
}

type Period = 'month' | 'year';

export function SetTargetModal({ isOpen, onClose, currentTarget = 0, productName }: SetTargetModalProps) {
  const [period, setPeriod] = useState<Period>('month');
  const [targetAmount, setTargetAmount] = useState(currentTarget);
  const [setEveryMonth, setSetEveryMonth] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Setting target:', {
      period,
      amount: targetAmount,
      recurring: setEveryMonth,
    });
    alert(`Target of NGN ${targetAmount.toLocaleString()} set for ${productName}!`);
    onClose();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAmount(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Set a Target</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Period Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeriod('month')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                period === 'month'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Month
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                period === 'year'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Year
            </button>
          </div>

          {/* Amount Section */}
          <div className="space-y-4">
            <label className="text-base font-semibold text-gray-900">Amount</label>
            
            {/* Display Amount */}
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-primary">
                NGN {targetAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag to add an amount
              </p>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100000000"
                step="100000"
                value={targetAmount}
                onChange={handleSliderChange}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6B1B3D 0%, #6B1B3D ${(targetAmount / 100000000) * 100}%, #E5E7EB ${(targetAmount / 100000000) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>

          {/* Set Every Month Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={setEveryMonth}
              onChange={(e) => setSetEveryMonth(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm text-gray-700">Set Every Month</span>
          </label>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold"
          >
            Set Target
          </Button>
        </div>
      </div>
    </div>
  );
}