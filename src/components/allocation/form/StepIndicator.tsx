// components/allocation/form/StepIndicator.tsx
"use client";
import React from "react";
import { CheckIcon } from "lucide-react";

type StepStatus = 'completed' | 'current' | 'upcoming';
type AppStep = 'welcome' | 'input-supply' | 'criteria' | 'success' | 'view-ranking';

interface Step {
  id: AppStep;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: AppStep;
  totalSteps: number;
}

const steps: Step[] = [
  {
    id: 'input-supply',
    title: 'Input Supply',
    description: 'Masukkan kebutuhan supply'
  },
  {
    id: 'criteria',
    title: 'Kriteria',
    description: 'Pilih kriteria penilaian'
  },
  {
    id: 'success',
    title: 'Konfirmasi',
    description: 'Laporan berhasil dibuat'
  },
  {
    id: 'view-ranking',
    title: 'Hasil',
    description: 'Lihat ranking supplier'
  }
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const getStepStatus = (stepId: AppStep): StepStatus => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStepNumber = (index: number) => index + 1;

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-center space-x-4 md:space-x-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const stepNumber = getStepNumber(index);
          
          return (
            <li key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${status === 'completed' 
                      ? 'bg-brand-600 text-white' 
                      : status === 'current'
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p className={`
                    text-sm font-medium
                    ${status === 'current' 
                      ? 'text-brand-600 dark:text-brand-400' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    hidden md:block w-16 h-0.5 ml-4 transition-all duration-200
                    ${status === 'completed' 
                      ? 'bg-brand-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;