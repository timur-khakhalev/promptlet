import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Send, Clipboard, Check, RefreshCw, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import MockupSelector from './dev/MockupSelector';
import { type MockupScenario } from '../utils/mockupData';

interface ChatViewProps {
  onCreateApp?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onCreateApp }) => {
  const { state } = useAppContext();
  const [input, setInput] = useState('');
  const [userMessage, setUserMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isUserMessageExpanded, setIsUserMessageExpanded] = useState(false);
  const [showMockupSelector, setShowMockupSelector] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<MockupScenario | null>(null);
  const [hasReceivedResponse, setHasReceivedResponse] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const activeMiniApp = state.miniApps.find(app => app.id === state.activeMiniAppId);

  useEffect(() => {
    setInput('');
    setUserMessage('');
    setResponse('');
    setError(null);
    setCopiedInput(false);
    setCopiedResponse(false);
    setIsUserMessageExpanded(false);
    setHasReceivedResponse(false);
    setSelectedMockup(null);
  }, [state.activeMiniAppId]);

  // Auto-scroll to bottom when response changes
  useEffect(() => {
    if (chatContainerRef.current && (response || isLoading)) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [response, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Handle mockup mode
    if (selectedMockup) {
      setUserMessage(selectedMockup.userMessage);
      setResponse('');
      setError(null);
      setInput('');
      setHasReceivedResponse(true);
      
      if (selectedMockup.hasError) {
        setError(selectedMockup.errorMessage || 'Mock error occurred');
        return;
      }
      
      if (selectedMockup.isLoading) {
        setIsLoading(true);
        // Simulate loading for demo purposes
        setTimeout(() => {
          setIsLoading(false);
          setResponse('This is a simulated response after loading...');
        }, 2000);
        return;
      }
      
      // Simulate typing effect for mockup
      setIsLoading(true);
      const fullResponse = selectedMockup.aiResponse;
      let currentText = '';
      const words = fullResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        setResponse(currentText);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      setIsLoading(false);
      return;
    }
    
    // Original API logic
    if (!activeMiniApp || !state.apiKey) {
      setError('API key or active mini-app not set.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUserMessage(input);
    setResponse('');
    setHasReceivedResponse(true);
    const currentInput = input;
    setInput('');

    try {
      const genAI = new GoogleGenAI({ apiKey: state.apiKey });
      
      const prompt = activeMiniApp.systemPrompt 
        ? `${activeMiniApp.systemPrompt}\n\n${currentInput}`
        : currentInput;
      
      const result = await genAI.models.generateContentStream({
        model: activeMiniApp.model,
        contents: prompt
      });
      
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setResponse(fullText);
      }
    } catch (e: any) {
      setError(e?.message || 'An error occurred while fetching the response.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string, type: 'input' | 'response') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'input') {
        setCopiedInput(true);
        setTimeout(() => setCopiedInput(false), 2000);
      } else {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleNewChat = () => {
    setInput('');
    setUserMessage('');
    setResponse('');
    setError(null);
    setIsUserMessageExpanded(false);
    setHasReceivedResponse(false);
  };

  const handleRegenerate = async () => {
    if (!userMessage) return;
    
    // Handle mockup mode
    if (selectedMockup) {
      setError(null);
      setResponse('');
      
      if (selectedMockup.hasError) {
        setError(selectedMockup.errorMessage || 'Mock error occurred');
        return;
      }
      
      // Simulate typing effect for mockup regeneration
      setIsLoading(true);
      const fullResponse = selectedMockup.aiResponse;
      let currentText = '';
      const words = fullResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        setResponse(currentText);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      setIsLoading(false);
      return;
    }
    
    // Original API logic
    if (!activeMiniApp || !state.apiKey) return;
    
    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const genAI = new GoogleGenAI({ apiKey: state.apiKey });
      
      const prompt = activeMiniApp.systemPrompt 
        ? `${activeMiniApp.systemPrompt}\n\n${userMessage}`
        : userMessage;
      
      const result = await genAI.models.generateContentStream({
        model: activeMiniApp.model,
        contents: prompt
      });
      
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setResponse(fullText);
      }
    } catch (e: any) {
      setError(e?.message || 'An error occurred while fetching the response.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };



  if (!activeMiniApp) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-slate-300">
            Welcome to Promptlet
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            {state.miniApps.length === 0 
              ? "Create your first mini-app to get started with AI conversations."
              : "Select a mini-app from the sidebar to start a conversation, or create a new one to get started."
            }
          </p>
          {state.miniApps.length === 0 && onCreateApp && (
            <button
              onClick={onCreateApp}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus size={20} />
              Create Your First Mini-App
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="h-full flex flex-col p-2 sm:p-6 max-w-4xl mx-auto w-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-50 truncate">
            {activeMiniApp.name}
          </h2>
          {activeMiniApp.systemPrompt && (
            <p className="hidden md:block text-sm text-gray-600 dark:text-slate-400 mt-1 truncate">
              {activeMiniApp.systemPrompt.slice(0, 100)}
              {activeMiniApp.systemPrompt.length > 100 ? '...' : ''}
            </p>
          )}
        </div>
        {hasReceivedResponse && (
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors self-end sm:self-center"
          >
            <Plus size={16} />
            New Request
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 space-y-4 overflow-y-auto p-2"
      >
        {/* User Message */}
        {userMessage && (
          <div className="flex justify-end items-start gap-2">
            <div className="max-w-full sm:max-w-3xl bg-indigo-600 text-white rounded-2xl px-4 py-3">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {userMessage}
                </ReactMarkdown>
              </div>
            </div>
             <button
              onClick={() => copyToClipboard(userMessage, 'input')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors mt-1 flex-shrink-0"
              title="Copy message"
            >
              {copiedInput ? <Check size={16} className="text-green-600" /> : <Clipboard size={16} />}
            </button>
          </div>
        )}

        {/* AI Response */}
        {(response || isLoading) && (
          <div className="flex justify-start items-start gap-2">
            <div className="flex-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl px-4 py-3 min-w-0">
              {isLoading && !response && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 dark:border-slate-500 border-t-transparent"></div>
                  Generating response...
                </div>
              )}
              {response && (
                <div className="overflow-x-auto">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {response}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
            {response && (
              <div className="flex flex-col gap-1 mt-1 flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(response, 'response')}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  title="Copy response"
                >
                  {copiedResponse ? <Check size={16} className="text-green-600" /> : <Clipboard size={16} />}
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                  title="Regenerate response"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              {userMessage && (
                                 <button
                   onClick={handleRegenerate}
                   disabled={isLoading}
                   className="ml-4 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                 >
                   <RefreshCw size={14} />
                   Retry
                 </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Only show when no response received */}
      {!hasReceivedResponse && (
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-slate-600 pt-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${activeMiniApp.name} anything...`}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send
          </p>
          {selectedMockup && (
            <div className="mt-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-xs text-purple-800 dark:text-purple-200">
                🎭 Mockup Mode: {selectedMockup.name}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Development Mockup Selector */}
      <MockupSelector
        selectedMockup={selectedMockup}
        onMockupSelect={setSelectedMockup}
        isVisible={showMockupSelector}
        onToggleVisibility={() => setShowMockupSelector(!showMockupSelector)}
      />
    </main>
  );
};

export default ChatView;