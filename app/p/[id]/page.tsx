// import { notFound } from 'next/navigation';
// import { getPaste } from '@/lib/kv';
// import { getCurrentTime, isPasteAvailable, getExpiryTimestamp, getRemainingViews } from '@/lib/utils';

// async function getPasteData(id: string) {
//   const paste = await getPaste(id);
  
//   if (!paste) {
//     return null;
//   }
  
//   const currentTime = getCurrentTime();
  
//   if (!isPasteAvailable(paste, currentTime)) {
//     return null;
//   }
  
//   // Increment view count for HTML view
//   paste.view_count += 1;
  
//   // Import updatePaste dynamically to avoid circular dependencies
//   const { updatePaste } = await import('@/lib/kv');
//   await updatePaste(paste);
  
//   return {
//     content: paste.content,
//     remaining_views: getRemainingViews(paste),
//     expires_at: getExpiryTimestamp(paste),
//   };
// }

// export default async function PastePage({ params }: { params: { id: string } }) {
//   const data = await getPasteData(params.id);
  
//   if (!data) {
//     notFound();
//   }
  
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>Paste - {params.id}</title>
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
//             max-width: 900px;
//             margin: 0 auto;
//             background: white;
//             border-radius: 8px;
//             box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//             overflow: hidden;
//           }
//           .header {
//             background: #2563eb;
//             color: white;
//             padding: 20px 30px;
//           }
//           .header h1 {
//             font-size: 24px;
//             margin-bottom: 5px;
//           }
//           .header p {
//             opacity: 0.9;
//             font-size: 14px;
//           }
//           .info {
//             padding: 15px 30px;
//             background: #f8fafc;
//             border-bottom: 1px solid #e2e8f0;
//             font-size: 14px;
//             color: #64748b;
//           }
//           .content {
//             padding: 30px;
//           }
//           .paste-content {
//             background: #f8fafc;
//             border: 1px solid #e2e8f0;
//             border-radius: 6px;
//             padding: 20px;
//             white-space: pre-wrap;
//             word-wrap: break-word;
//             font-family: 'Courier New', Courier, monospace;
//             font-size: 14px;
//             line-height: 1.5;
//             max-height: 600px;
//             overflow-y: auto;
//           }
//           .footer {
//             padding: 20px 30px;
//             text-align: center;
//             font-size: 14px;
//             color: #64748b;
//             border-top: 1px solid #e2e8f0;
//           }
//           .footer a {
//             color: #2563eb;
//             text-decoration: none;
//           }
//           .footer a:hover {
//             text-decoration: underline;
//           }
//         ` }} />
//       </head>
//       <body>
//         <div className="container">
//           <div className="header">
//             <h1>📋 Pastebin Lite</h1>
//             <p>Paste ID: {params.id}</p>
//           </div>
//           {(data.remaining_views !== null || data.expires_at !== null) && (
//             <div className="info">
//               {data.remaining_views !== null && (
//                 <span>Remaining views: {data.remaining_views} </span>
//               )}
//               {data.expires_at !== null && (
//                 <span>Expires at: {new Date(data.expires_at).toLocaleString()}</span>
//               )}
//             </div>
//           )}
//           <div className="content">
//             <div className="paste-content">{data.content}</div>
//           </div>
//           <div className="footer">
//             <a href="/">Create a new paste</a>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }

import { notFound } from 'next/navigation';
import { getPaste, updatePaste } from '@/lib/kv';
import { getCurrentTime, isPasteAvailable, getExpiryTimestamp, getRemainingViews } from '@/lib/utils';

async function getPasteData(id: string) {
  try {
    const paste = await getPaste(id);
    
    if (!paste) {
      return null;
    }
    
    const currentTime = getCurrentTime();
    
    if (!isPasteAvailable(paste, currentTime)) {
      return null;
    }
    
    // Increment view count for HTML view
    paste.view_count += 1;
    
    // Update paste with new view count
    await updatePaste(paste);
    
    return {
      content: paste.content,
      remaining_views: getRemainingViews(paste),
      expires_at: getExpiryTimestamp(paste),
    };
  } catch (error) {
    console.error('Error fetching paste:', error);
    return null;
  }
}

export default async function PastePage({ params }: { params: { id: string } }) {
  const data = await getPasteData(params.id);
  
  if (!data) {
    notFound();
  }
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Paste - {params.id}</title>
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
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #2563eb;
            color: white;
            padding: 20px 30px;
          }
          .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          .header p {
            opacity: 0.9;
            font-size: 14px;
          }
          .info {
            padding: 15px 30px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            color: #64748b;
          }
          .content {
            padding: 30px;
          }
          .paste-content {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 20px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            line-height: 1.5;
            max-height: 600px;
            overflow-y: auto;
          }
          .footer {
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
          .footer a {
            color: #2563eb;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        ` }} />
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>📋 Pastebin Lite</h1>
            <p>Paste ID: {params.id}</p>
          </div>
          {(data.remaining_views !== null || data.expires_at !== null) && (
            <div className="info">
              {data.remaining_views !== null && (
                <span>Remaining views: {data.remaining_views} </span>
              )}
              {data.expires_at !== null && (
                <span>Expires at: {new Date(data.expires_at).toLocaleString()}</span>
              )}
            </div>
          )}
          <div className="content">
            <div className="paste-content">{data.content}</div>
          </div>
          <div className="footer">
            <a href="/">Create a new paste</a>
          </div>
        </div>
      </body>
    </html>
  );
}