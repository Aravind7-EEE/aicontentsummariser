import React from 'react';

function SummaryCard({ summary, loading }) {
  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
  };

  return (
    <div className="summary-card">
      <div className="summary-header">
        <h2>Summary</h2>
        <button
          type="button"
          className="button button-tertiary"
          onClick={handleCopy}
          disabled={loading || !summary}
        >
          Copy Summary
        </button>
      </div>

      <div className="summary-content">
        {loading ? (
          <div className="loader-wrap">
            <div className="spinner" />
            <p>Generating summary...</p>
          </div>
        ) : summary ? (
          <pre>{summary}</pre>
        ) : (
          <p className="secondary-text">Your AI summary will appear here after you submit content.</p>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
