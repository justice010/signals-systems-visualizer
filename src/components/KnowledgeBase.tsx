import React, { type MouseEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { useAppStore } from '../store/useAppStore';
import type { ModuleId } from '../types';

interface KnowledgeBaseProps {
  content: string;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ content }) => {
  const syncParams = useAppStore((state) => state.syncParams);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.classList.contains('interactive-btn')) {
      const moduleIdRaw = target.getAttribute('data-module') || '1';
      const moduleId = (isNaN(parseInt(moduleIdRaw)) ? moduleIdRaw : parseInt(moduleIdRaw, 10)) as ModuleId;
      const paramsRaw = target.getAttribute('data-params');
      if (paramsRaw) {
        try {
          const params = JSON.parse(paramsRaw);
          syncParams(moduleId, params);
        } catch (err) {
          console.error('Failed to parse params:', err);
        }
      }
    }
  };

  return (
    <div 
      className="h-full w-full overflow-y-auto p-8 text-gray-100 prose prose-invert prose-lg max-w-none"
      onClick={handleClick}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default KnowledgeBase;