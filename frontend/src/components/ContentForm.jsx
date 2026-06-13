import React from 'react';

function ContentForm({ content, setContent, onSummarize, onClear, loading }) {
  const charCount = content.length;

  return (
    <div className="form-card">
      <label htmlFor="contentInput" className="form-label">
        Paste your content below
      </label>

      <textarea
        id="contentInput"
        className="content-input"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows="12"
        placeholder="Paste long text here..."
      />

      <div className="form-footer">
        <p className="char-count">Character count: {charCount}</p>
        <div className="button-group">
          <button type="button" className="button button-secondary" onClick={onClear} disabled={loading}>
            Clear
          </button>
          <button type="button" className="button button-primary" onClick={onSummarize} disabled={loading}>
            {loading ? 'Summarizing…' : 'Summarize'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentForm;
