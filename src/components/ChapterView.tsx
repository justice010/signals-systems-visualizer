import React from 'react';
import { useParams } from 'react-router-dom';
import KnowledgeBase from './KnowledgeBase';
import Visualizer from './Visualizer';
import { chaptersContent } from '../content/chapters';

const ChapterView: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  
  // Directly get content from the static object
  const content = chapterId && chaptersContent[chapterId] 
    ? chaptersContent[chapterId] 
    : '# 章节未找到\n\n抱歉，您请求的章节目前不存在。';

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
      {/* Left Panel: Knowledge Base */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-gray-700">
        <KnowledgeBase content={content} />
      </div>

      {/* Right Panel: Visualizer */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <Visualizer />
      </div>
    </div>
  );
};

export default ChapterView;