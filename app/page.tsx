"use client";
import { useRef, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleSubmit = async function fetchNames() {
    setGeneratedContent(""); // Reset content here
    setGenerating(true);
    const res = await fetch("http://127.0.0.1:5328/generate-names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: searchQuery,
      }),
    });

    if (res.body) {
      const reader = res.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setGeneratedContent((prevContent) => prevContent + new TextDecoder("utf-8").decode(value));
      }
    }
    setGenerating(false);
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a
              href="#"
              className="-m-1.5 p-1.5"
            >
              <span className="sr-only"> Company</span>
              <p>One AI</p>
            </a>
          </div>

          <div className=" lg:flex lg:flex-1 lg:justify-end">
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      <div className="relative isolate pt-14">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M100 200V.5M.5 .5H200"
                fill="none"
              />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-gray-50"
          >
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          />
        </svg>

        <div className="w-full justify-center flex flex-col items-center pt-60 px-20">
          <div className="flex justify-center items-center mb-2 gap-4">
            <button className="text-slate-700 border-b-2 border-slate-700">Duke</button>
            <button className="text-slate-500">STA 199</button>
            <button className="text-slate-500">CS 316</button>
          </div>
          <textarea
            className="p-6 overflow-auto rounded-lg border shadow-sm border-slate-300 w-full focus:outline-none focus:ring-1 focus:ring-slate-300"
            placeholder="I'm looking for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
        <div className="px-20 py-5 overflow-auto   w-full text-left ">{generatedContent}</div>
        <div className="container mx-auto text-center mt-8 gap-2 text-sm">
          <button
            className="btn bg-slate-50 hover:bg-slate-200 rounded-lg px-4 py-1 m-2 border-slate-200 border"
            onClick={(e) => {
              setSearchQuery("office hour for sta 199?");
              handleSubmit();
            }}
          >
            office hour for sta 199?
          </button>
          <button
            className="btn bg-slate-50 hover:bg-slate-200 rounded-lg px-4 py-1 mx-2 border-slate-200 border"
            onClick={(e) => {
              setSearchQuery("How can I change my major?");
              handleSubmit();
            }}
          >
            How can I change my major?
          </button>
          <button
            className="btn bg-slate-50 hover:bg-slate-200 rounded-lg px-4 py-1 m-2 border-slate-200 border"
            onClick={(e) => {
              setSearchQuery("past CS 316 questions?");
              handleSubmit();
            }}
          >
            past CS 316 questions?
          </button>
          <button
            className="btn bg-slate-50 hover:bg-slate-200 rounded-lg px-4 py-1 mx-2 border-slate-200 border"
            onClick={(e) => {
              setSearchQuery("How to apply for independet study");
              handleSubmit();
            }}
          >
            How to apply for independet study
          </button>
        </div>
      </div>
    </div>
  );
}
