import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

// Dynamic discovery for chapter content
const knowledgeModules = import.meta.glob('/src/content/knowledge/*.md', { query: '?raw', import: 'default' });

const KnowledgeChapter: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      // Try to find the exact match or fuzzy match (case/path style)
      const availableKeys = Object.keys(knowledgeModules);
      const matchingKey = availableKeys.find(key => key.endsWith(`${chapterId}.md`));

      if (matchingKey) {
        try {
          const raw = await knowledgeModules[matchingKey]();
          setContent(raw as string);
        } catch (err) {
          console.error('Error loading knowledge content:', err);
          setContent('# 加载失败\n\n读取文档内容时出错。');
        }
      } else {
        setContent('# 404 文档未找到\n\n抱歉，该章节的理论文档尚未创建。');
      }
      setLoading(false);
    };

    loadContent();
  }, [chapterId]);

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-900 text-gray-100 p-6 md:p-16 scroll-smooth">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Back Link */}
        <nav className="mb-12 flex items-center justify-between">
          <Link 
            to="/knowledge" 
            className="flex items-center text-blue-500 hover:text-blue-400 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">返回知识库目录</span>
          </Link>
          
          <Link 
            to={`/chapter/${chapterId}`} 
            className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
          >
            跳转到交互实验 ▶
          </Link>
        </nav>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <article className="prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-a:text-blue-400 prose-img:rounded-xl">
            <ReactMarkdown 
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </article>
        )}

        <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-600 text-sm pb-12">
          Signals & Systems Visualizer - 理论精讲系列
        </footer>
      </div>
    </div>
  );
};

export default KnowledgeChapter;
