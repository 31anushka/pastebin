// 'use client';

// import { useState } from 'react';

// export default function HomePage() {
//   const [content, setContent] = useState('');
//   const [ttlSeconds, setTtlSeconds] = useState('');
//   const [maxViews, setMaxViews] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [pasteUrl, setPasteUrl] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setPasteUrl('');
//     setIsLoading(true);

//     try {
//       const body: any = { content };
      
//       if (ttlSeconds) {
//         body.ttl_seconds = parseInt(ttlSeconds, 10);
//       }
      
//       if (maxViews) {
//         body.max_views = parseInt(maxViews, 10);
//       }

//       const response = await fetch('/api/pastes', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.error || 'Failed to create paste');
//         return;
//       }

//       setPasteUrl(data.url);
//       setContent('');
//       setTtlSeconds('');
//       setMaxViews('');
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>Pastebin Lite</title>
//         <style dangerouslySetInnerHTML={{ __html: `
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
//           body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//             line-height: 1.6;
//             color: #333;
//             background: #f5f5f5;
//             padding: 20px;
//           }
//           .container {
//             max-width: 800px;
//             margin: 0 auto;
//             background: white;
//             border-radius: 8px;
//             box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//             overflow: hidden;
//           }
//           .header {
//             background: #2563eb;
//             color: white;
//             padding: 30px;
//             text-align: center;
//           }
//           .header h1 {
//             font-size: 32px;
//             margin-bottom: 10px;
//           }
//           .header p {
//             opacity: 0.9;
//             font-size: 16px;
//           }
//           .form-container {
//             padding: 30px;
//           }
//           .form-group {
//             margin-bottom: 20px;
//           }
//           label {
//             display: block;
//             margin-bottom: 8px;
//             font-weight: 500;
//             color: #374151;
//           }
//           textarea {
//             width: 100%;
//             min-height: 200px;
//             padding: 12px;
//             border: 1px solid #d1d5db;
//             border-radius: 6px;
//             font-family: 'Courier New', Courier, monospace;
//             font-size: 14px;
//             resize: vertical;
//           }
//           textarea:focus {
//             outline: none;
//             border-color: #2563eb;
//             box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
//           }
//           .options-row {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 20px;
//           }
//           input[type="number"] {
//             width: 100%;
//             padding: 10px 12px;
//             border: 1px solid #d1d5db;
//             border-radius: 6px;
//             font-size: 14px;
//           }
//           input[type="number"]:focus {
//             outline: none;
//             border-color: #2563eb;
//             box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
//           }
//           .hint {
//             font-size: 13px;
//             color: #6b7280;
//             margin-top: 4px;
//           }
//           button {
//             width: 100%;
//             padding: 14px;
//             background: #2563eb;
//             color: white;
//             border: none;
//             border-radius: 6px;
//             font-size: 16px;
//             font-weight: 500;
//             cursor: pointer;
//             transition: background 0.2s;
//           }
//           button:hover:not(:disabled) {
//             background: #1d4ed8;
//           }
//           button:disabled {
//             background: #9ca3af;
//             cursor: not-allowed;
//           }
//           .error {
//             background: #fef2f2;
//             border: 1px solid #fecaca;
//             color: #dc2626;
//             padding: 12px;
//             border-radius: 6px;
//             margin-bottom: 20px;
//           }
//           .success {
//             background: #f0fdf4;
//             border: 1px solid #bbf7d0;
//             padding: 20px;
//             border-radius: 6px;
//             margin-bottom: 20px;
//           }
//           .success h3 {
//             color: #166534;
//             margin-bottom: 10px;
//           }
//           .url-box {
//             display: flex;
//             gap: 10px;
//             align-items: center;
//           }
//           .url-input {
//             flex: 1;
//             padding: 10px 12px;
//             border: 1px solid #d1d5db;
//             border-radius: 6px;
//             font-size: 14px;
//             background: white;
//           }
//           .copy-btn {
//             padding: 10px 20px;
//             background: #10b981;
//             color: white;
//             border: none;
//             border-radius: 6px;
//             cursor: pointer;
//             font-weight: 500;
//             white-space: nowrap;
//           }
//           .copy-btn:hover {
//             background: #059669;
//           }
//           .visit-link {
//             display: inline-block;
//             margin-top: 10px;
//             color: #2563eb;
//             text-decoration: none;
//             font-size: 14px;
//           }
//           .visit-link:hover {
//             text-decoration: underline;
//           }
//           @media (max-width: 640px) {
//             .options-row {
//               grid-template-columns: 1fr;
//             }
//           }
//         ` }} />
//       </head>
//       <body>
//         <div className="container">
//           <div className="header">
//             <h1>📋 Pastebin Lite</h1>
//             <p>Share text snippets with optional expiry and view limits</p>
//           </div>
//           <div className="form-container">
//             {error && <div className="error">{error}</div>}
            
//             {pasteUrl && (
//               <div className="success">
//                 <h3>✓ Paste created successfully!</h3>
//                 <div className="url-box">
//                   <input
//                     type="text"
//                     className="url-input"
//                     value={pasteUrl}
//                     readOnly
//                   />
//                   <button
//                     className="copy-btn"
//                     onClick={() => {
//                       navigator.clipboard.writeText(pasteUrl);
//                       alert('URL copied to clipboard!');
//                     }}
//                   >
//                     Copy
//                   </button>
//                 </div>
//                 <a href={pasteUrl} className="visit-link" target="_blank" rel="noopener noreferrer">
//                   Visit paste →
//                 </a>
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label htmlFor="content">Paste Content *</label>
//                 <textarea
//                   id="content"
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   placeholder="Enter your text here..."
//                   required
//                 />
//               </div>

//               <div className="options-row">
//                 <div className="form-group">
//                   <label htmlFor="ttl">Time to Live (seconds)</label>
//                   <input
//                     type="number"
//                     id="ttl"
//                     min="1"
//                     value={ttlSeconds}
//                     onChange={(e) => setTtlSeconds(e.target.value)}
//                     placeholder="Optional"
//                   />
//                   <div className="hint">How long before the paste expires</div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="maxViews">Maximum Views</label>
//                   <input
//                     type="number"
//                     id="maxViews"
//                     min="1"
//                     value={maxViews}
//                     onChange={(e) => setMaxViews(e.target.value)}
//                     placeholder="Optional"
//                   />
//                   <div className="hint">How many times it can be viewed</div>
//                 </div>
//               </div>

//               <button type="submit" disabled={isLoading}>
//                 {isLoading ? 'Creating...' : 'Create Paste'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }


'use client';

import { useState } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasteUrl('');
    setIsLoading(true);

    try {
      const body: any = { content };
      
      if (ttlSeconds) {
        body.ttl_seconds = parseInt(ttlSeconds, 10);
      }
      
      if (maxViews) {
        body.max_views = parseInt(maxViews, 10);
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
        return;
      }

      setPasteUrl(data.url);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pastebin Lite</title>
        <style dangerouslySetInnerHTML={{ __html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #2563eb;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
          }
          .header p {
            opacity: 0.9;
            font-size: 16px;
          }
          .form-container {
            padding: 30px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #374151;
          }
          textarea {
            width: 100%;
            min-height: 200px;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            resize: vertical;
          }
          textarea:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .options-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          input[type="number"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          }
          input[type="number"]:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .hint {
            font-size: 13px;
            color: #6b7280;
            margin-top: 4px;
          }
          button {
            width: 100%;
            padding: 14px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
          }
          button:hover:not(:disabled) {
            background: #1d4ed8;
          }
          button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
          .error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .success {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .success h3 {
            color: #166534;
            margin-bottom: 10px;
          }
          .url-box {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .url-input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            background: white;
          }
          .copy-btn {
            padding: 10px 20px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            white-space: nowrap;
          }
          .copy-btn:hover {
            background: #059669;
          }
          .visit-link {
            display: inline-block;
            margin-top: 10px;
            color: #2563eb;
            text-decoration: none;
            font-size: 14px;
          }
          .visit-link:hover {
            text-decoration: underline;
          }
          @media (max-width: 640px) {
            .options-row {
              grid-template-columns: 1fr;
            }
          }
        ` }} />
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>📋 Pastebin Lite</h1>
            <p>Share text snippets with optional expiry and view limits</p>
          </div>
          <div className="form-container">
            {error && <div className="error">{error}</div>}
            
            {pasteUrl && (
              <div className="success">
                <h3>✓ Paste created successfully!</h3>
                <div className="url-box">
                  <input
                    type="text"
                    className="url-input"
                    value={pasteUrl}
                    readOnly
                  />
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(pasteUrl);
                      alert('URL copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
                <a href={pasteUrl} className="visit-link" target="_blank" rel="noopener noreferrer">
                  Visit paste →
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="content">Paste Content *</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your text here..."
                  required
                />
              </div>

              <div className="options-row">
                <div className="form-group">
                  <label htmlFor="ttl">Time to Live (seconds)</label>
                  <input
                    type="number"
                    id="ttl"
                    min="1"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    placeholder="Optional"
                  />
                  <div className="hint">How long before the paste expires</div>
                </div>

                <div className="form-group">
                  <label htmlFor="maxViews">Maximum Views</label>
                  <input
                    type="number"
                    id="maxViews"
                    min="1"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    placeholder="Optional"
                  />
                  <div className="hint">How many times it can be viewed</div>
                </div>
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Paste'}
              </button>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
}