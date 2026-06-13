import { useEffect, useState } from 'react';
import ContentForm from './components/ContentForm';
import SummaryCard from './components/SummaryCard';
import HistoryList from './components/HistoryList';
import api from './services/api';

function App() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history');
      setHistory(response.data || []);
    } catch (err) {
      setError('Unable to load history. Please try again later.');
    }
  };

  const handleSummarize = async () => {
    setError('');
    setNotification('');

    if (!content.trim()) {
      setError('Please paste content before requesting a summary.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/summarize', { content });
      setSummary(response.data.summary);
      setNotification('Summary generated successfully.');
      fetchHistory();
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to generate summary. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setSummary('');
    setError('');
    setNotification('');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI Content Summarizer</p>
          <h1>Turn long text into short, meaningful summaries.</h1>
          <p className="subtitle">
            Paste your article, report, or message and let Gemini create a clean summary instantly.
          </p>
        </div>
      </header>

      <main className="content-layout">
        <section className="summarizer-panel">
          {error && <div className="message message-error">{error}</div>}
          {notification && <div className="message message-success">{notification}</div>}

          <ContentForm
            content={content}
            setContent={setContent}
            onSummarize={handleSummarize}
            onClear={handleClear}
            loading={loading}
          />

          <SummaryCard summary={summary} loading={loading} />
        </section>

        <aside className="history-panel">
          <HistoryList history={history} />
        </aside>
      </main>
    </div>
  );
}

export default App;
