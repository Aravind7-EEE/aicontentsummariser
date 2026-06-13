import React from 'react';

function HistoryList({ history }) {
  return (
    <div className="history-card">
      <div className="history-header">
        <h2>Recent Summaries</h2>
      </div>

      {history.length === 0 ? (
        <p className="secondary-text">No summaries saved yet. Create one to see history.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item._id} className="history-item">
              <div>
                <p className="history-date">{new Date(item.createdAt).toLocaleString()}</p>
                <p className="history-text">{item.summary}</p>
              </div>
              <p className="history-meta">
                {item.originalLength} chars → {item.summaryLength} chars
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoryList;
