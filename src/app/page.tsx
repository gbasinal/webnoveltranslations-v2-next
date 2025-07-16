'use client';

import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function Page() {
  const [chapters, setChapters] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedContent, setSelectedContent] = useState('');

  useEffect(() => {
    // Fetch chapter list
    fetch('https://webnoveltranslations.com/wp-json/wp/v2/chapter_text_content?per_page=100&_fields=title,slug')
      .then(res => res.json())
      .then(data => setChapters(data));
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;

    // Fetch selected chapter content
    fetch(`https://webnoveltranslations.com/wp-json/wp/v2/chapter_text_content?slug=${selectedSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setSelectedContent(data[0].content.rendered);
        }
      });
  }, [selectedSlug]);

  return (
    <>
      <Header/>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Chapters</h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          {/* Chapter list */}
          <ul className="w-full sm:w-1/3">
            {chapters.map((chap: any) => (
              <li key={chap.slug}>
                <button
                  onClick={() => setSelectedSlug(chap.slug)}
                  className="text-left w-full py-2 px-3 rounded hover:bg-gray-200"
                >
                  {chap.title.rendered}
                </button>
              </li>
            ))}
          </ul>

          {/* Chapter content */}
          <div className="w-full sm:w-2/3 border rounded p-4 min-h-[300px]">
            {selectedContent ? (
              <div
                dangerouslySetInnerHTML={{ __html: selectedContent }}
                className="prose"
              />
            ) : (
              <p>Select a chapter to view the content.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
