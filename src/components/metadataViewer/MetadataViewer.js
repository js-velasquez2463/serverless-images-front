import React from 'react';
import './index.css';

const JsonDisplay = ({ data, indent = 0 }) => {
  if (typeof data === 'object' && data !== null) {
    return (
      <div style={{ marginLeft: `${indent * 20}px` }}>
        {Object.keys(data).map((key) => (
          <div key={key}>
            <strong>{key}:</strong> {typeof data[key] === 'object' ? (
              <JsonDisplay data={data[key]} indent={indent + 1} />
            ) : (
              data[key]
            )}
          </div>
        ))}
      </div>
    );
  }
  return <span>{data}</span>;
};

const MetadataViewer = ({ metadata, title }) => {
  return (
    <div className="metadataViewer">
      <h3>{title}</h3>
      <div className="metadataContent">
        <JsonDisplay data={metadata} />
      </div>
    </div>
  );
};

export default MetadataViewer;
