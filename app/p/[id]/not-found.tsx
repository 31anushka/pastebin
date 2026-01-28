export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Paste Not Found</title>
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
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            max-width: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 40px;
            text-align: center;
          }
          h1 {
            font-size: 48px;
            color: #ef4444;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 30px;
          }
          a {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            background: #1d4ed8;
          }
        ` }} />
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <p>This paste could not be found. It may have expired or reached its view limit.</p>
          <a href="/">Create a new paste</a>
        </div>
      </body>
    </html>
  );
}
