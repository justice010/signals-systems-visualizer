import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dynamic discovery of all markdown files in the knowledge folder
const knowledgeModules = import.meta.glob('/src/content/knowledge/*.md', { query: '?raw', import: 'default' });

interface ChapterInfo {
  id: string;
  title: string;
  desc: string;
}

const KnowledgeHome: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChapters = async () => {
      const chapterData: ChapterInfo[] = [];
      
      for (const path in knowledgeModules) {
        try {
          const rawContent = await knowledgeModules[path]() as string;
          const id = path.split('/').pop()?.replace('.md', '') || '';
          
          // --- Improved Parsing Logic (Supporting Windows \r\n and robust Frontmatter) ---
          let title = id;
          let desc = '阅读该章节的理论详情...';
          
          // Use 's' flag for dot-all and support \r?\n for cross-platform
          const fmMatch = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          
          if (fmMatch) {
            const fm = fmMatch[1];
            // Match multiline even if spaces exist
            const titleVal = fm.match(/^title:\s*(.*)/m);
            const descVal = fm.match(/^description:\s*(.*)/m);
            
            if (titleVal) title = titleVal[1].replace(/^['"](.*)['"]$/, '$1').trim();
            if (descVal) desc = descVal[1].replace(/^['"](.*)['"]$/, '$1').trim();
          } else {
            const titleMatch = rawContent.match(/^#\s+(.*)/m);
            if (titleMatch) title = titleMatch[1];
            
            const lines = rawContent.split(/\r?\n/);
            const firstPara = lines.find(line => line.trim() && !line.startsWith('#') && !line.startsWith('---'));
            if (firstPara) desc = firstPara;
          }
          
          const finalDesc = desc.length > 80 ? desc.substring(0, 77) + '...' : desc;
          chapterData.push({ id, title, desc: finalDesc });
        } catch (err) {
          console.error(`Failed to load knowledge file at ${path}:`, err);
        }
      }
      
      chapterData.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      setChapters(chapterData);
      setLoading(false);
    };

    loadChapters();
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-900 text-gray-100 p-6 md:p-16 scroll-smooth">
      <header className="max-w-6xl mx-auto mb-10 md:mb-16">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-4xl animate-pulse">📖</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            理论知识库
          </h1>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : chapters.length === 0 ? (
        <div className="max-w-6xl mx-auto bg-gray-800/30 border border-dashed border-gray-700 rounded-2xl p-12 text-center text-gray-500">
          <p>暂无理论文档。请在 <code className="text-gray-400">src/content/knowledge/</code> 下创建 .md 文件。</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 pb-12">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              onClick={() => navigate(`/knowledge/${ch.id}`)}
              className="group relative bg-gray-800/40 border border-gray-700 p-6 rounded-2xl cursor-pointer 
                         transition-all duration-300 hover:bg-gray-800 hover:border-blue-500/50 
                         hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {ch.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed h-12 overflow-hidden text-ellipsis">
                {ch.desc}
              </p>
              <div className="mt-6 flex items-center text-blue-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <span>进入深度学习</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeHome;
