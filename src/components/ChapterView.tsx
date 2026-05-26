import React from 'react';
import { useParams } from 'react-router-dom';
import KnowledgeBase from './KnowledgeBase';
import Visualizer from './Visualizer';
import { chaptersContent } from '../content/chapters';

const ChapterView: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  
  const content = chapterId && chaptersContent[chapterId] 
    ? chaptersContent[chapterId] 
    : '# 章节未找到\n\n抱歉，您请求的章节目前不存在。';

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-gray-900">
      {/* Left Panel: Knowledge Base - Less height on mobile */}
      <div className="w-full md:w-1/2 h-[40%] md:h-full border-b md:border-b-0 md:border-r border-gray-700 flex flex-col">
        <KnowledgeBase content={content} />
      </div>

      {/* Right Panel: Visualizer - More height on mobile to prevent squashing */}
      <div className="w-full md:w-1/2 h-[60%] md:h-full flex flex-col overflow-hidden">
        <Visualizer />
      </div>
    </div>
  );
};

export default ChapterView;
