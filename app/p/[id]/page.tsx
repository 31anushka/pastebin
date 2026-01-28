import { notFound } from 'next/navigation';
import { getPaste, updatePaste } from '@/lib/kv';
import { getCurrentTime, isPasteAvailable, getExpiryTimestamp, getRemainingViews } from '@/lib/utils';

export default async function PastePage({ params }: { params: { id: string } }) {
  const paste = await getPaste(params.id);

if (!paste || !isPasteAvailable(paste, getCurrentTime())) {
  notFound(); // fallback to 404
}

paste.view_count = (paste.view_count || 0) + 1;
try {
  await updatePaste(paste);
} catch (err) {
  console.error('Failed to update paste:', err);
}


  // if (!paste || !isPasteAvailable(paste, getCurrentTime())) notFound();

  // paste.view_count += 1;
  // await updatePaste(paste);

  const data = {
    content: paste.content,
    remaining_views: getRemainingViews(paste),
    expires_at: getExpiryTimestamp(paste),
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded shadow">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">📋 Pastebin Lite</h1>
          <p className="text-sm opacity-90">Paste ID: {params.id}</p>
        </div>

        {(data.remaining_views !== null || data.expires_at !== null) && (
          <div className="p-4 text-sm text-gray-600 bg-gray-50 border-b">
            {data.remaining_views !== null && <span>Remaining views: {data.remaining_views}</span>}
            {data.expires_at !== null && (
              <span>Expires at: {new Date(data.expires_at).toLocaleString()}</span>
            )}
          </div>
        )}

        <pre className="p-6 whitespace-pre-wrap font-mono text-sm">{data.content}</pre>

        <div className="p-4 text-center text-sm border-t">
          <a href="/" className="text-blue-600 hover:underline">Create a new paste</a>
        </div>
      </div>
    </main>
  );
}
