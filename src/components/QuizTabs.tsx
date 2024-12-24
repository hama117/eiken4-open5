import React from 'react';
import { BookOpen, PenTool, Settings } from 'lucide-react';

interface QuizTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function QuizTabs({ activeTab, onTabChange }: QuizTabsProps) {
  const tabs = [
    {
      id: 'questions',
      label: '問題演習',
      icon: PenTool
    },
    {
      id: 'study',
      label: '学習ノート',
      icon: BookOpen
    },
    {
      id: 'settings',
      label: '設定',
      icon: Settings
    }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`
            flex-1 sm:flex-none min-w-[120px]
            flex items-center justify-center
            px-4 py-3 
            border-b-2 
            font-medium text-sm
            transition-colors
            ${
              activeTab === id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          <Icon className="w-4 h-4 mr-2" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}