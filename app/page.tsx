"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleSubmit = async (
    e?:
      | React.KeyboardEvent<HTMLElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.TouchEvent<HTMLButtonElement>,
    newSearchQuery?: string
  ) => {
    e?.preventDefault();
    setGeneratedContent("");
    setGenerating(true);

    const query = newSearchQuery || searchQuery;

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: query,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedContent((prev) => prev + chunkValue);
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
            <button className="text-slate-700 border-b-2 border-slate-700">STA 199</button>
            <button className="text-slate-500">STA 360</button>
            <button className="text-slate-500">CS 316</button>
            <button className="text-slate-500">CS 250</button>
          </div>
          <div className="relative w-full">
            <textarea
              className="resize-none p-6 overflow-auto rounded-lg border shadow-sm border-slate-300 w-full focus:outline-none focus:ring-1 focus:ring-slate-300"
              placeholder="I'm looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            <button
              className="absolute bottom-2 right-1 bg-slate-800 hover:bg-slate-700 text-white  py-1 px-4 mx-1 my-1 rounded"
              onClick={(e) => handleSubmit(e)}
            >
              Find
            </button>
          </div>
        </div>
        <div className="px-20 py-5 overflow-auto  w-full text-left ">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => {
                const href = props.href ? (props.href.startsWith("http") ? props.href : `https://${props.href}`) : "";
                return (
                  <span className="inline-flex items-center text-blue-400">
                    <a
                      className="text-blue-400 font-medium hover:underline"
                      {...props}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    ></a>{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                      stroke="currentColor"
                      className="w-4 h-4 ml-1"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </span>
                );
              },
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const { ref, ...restWithoutRef } = rest;
                const textAreaRef = useRef(null);
                const [copyText, setCopyText] = useState("Copy");

                const copyToClipboard = (e: any) => {
                  const textToCopy = typeof children === "string" ? children : children?.toString() || "";
                  navigator.clipboard.writeText(textToCopy);
                  e.target.focus();
                  setCopyText("Copied!"); // Change button text to "Copied!"

                  setTimeout(() => {
                    setCopyText("Copy"); // Change back to "Copy" after 3 seconds
                  }, 3000);
                };

                return match ? (
                  <div className="bg-[#282a36] rounded-md">
                    <button
                      type="button"
                      className="m-1 rounded-md text-white bg-[#282a36] hover:bg-slate-700  focus:outline-none  font-medium  text-xs px-5 py-2.5 text-center inline-flex items-center mr-2"
                      onClick={copyToClipboard}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                        />
                      </svg>
                      {copyText}
                    </button>
                    <SyntaxHighlighter
                      {...restWithoutRef}
                      showLineNumbers={true}
                      children={String(children).replace(/\n$/, "")}
                      style={dracula}
                      language={match[1]}
                      PreTag="div"
                    />{" "}
                  </div>
                ) : (
                  <code
                    {...rest}
                    className={className}
                  >
                    {children}
                  </code>
                );
              },
            }}
            className="whitespace-normal leading-7 text-slate-700"
          >
            {generatedContent}
          </ReactMarkdown>
        </div>
        <div className="container mx-auto text-center mt-8 gap-2 text-sm">
          <button
            className="btn bg-slate-50 hover:bg-slate-200 rounded-lg px-4 py-1 m-2 border-slate-200 border"
            onClick={(e) => {
              const newQuery = " office hour for sta 199?";
              setSearchQuery(newQuery);
              handleSubmit(e, newQuery);
            }}
            onTouchEnd={(e) => {
              const newQuery = " office hour for sta 199?";
              setSearchQuery(newQuery);
              handleSubmit(e, newQuery);
            }}
          >
            office hour for sta 199?
          </button>
          <button
            className="btn bg-slate-50 hover:bg-slate-200 rounded-lg px-4 py-1 mx-2 border-slate-200 border"
            onClick={(e) => {
              const newQuery = "How can I change my major?  ";
              setSearchQuery(newQuery);
              handleSubmit(e, newQuery);
            }}
            onTouchEnd={(e) => {
              const newQuery = "How can I change my major?";
              setSearchQuery(newQuery);
              handleSubmit(e, newQuery);
            }}
          >
            How can I change my major?
          </button>
        </div>
      </div>
    </div>
  );
}
