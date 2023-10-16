"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Listbox, Transition } from "@headlessui/react";
import { CalendarIcon, PaperClipIcon, TagIcon, UserCircleIcon, BookOpenIcon } from "@heroicons/react/20/solid";
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="w-6 h-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
  />
</svg>;

const assignees = [
  { name: "Unassigned", value: null },
  {
    name: "Wade Cooper",
    value: "wade-cooper",
    avatar:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  // More items...
];
const labels = [
  { name: "STA 199", value: "STA 199" },
  { name: "STA 360", value: "STA 360" },
  { name: "CS 210", value: "CS 210" },
  { name: "CS 250", value: "CS 250" },
  { name: "CS 316", value: "CS 316" },
  { name: "CS 230", value: "CS 230" },

  // More items...
];
const dueDates = [
  { name: "No due date", value: null },
  { name: "Today", value: "today" },
  // More items...
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const [assigned, setAssigned] = useState(assignees[0]);
  const [labelled, setLabelled] = useState(labels[0]);
  const [dated, setDated] = useState(dueDates[0]);

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
        {/* <div className="w-full justify-center flex flex-col items-center pt-40 ">
          <div className="flex justify-center items-center mb-2 gap-4">
            <button className="text-slate-700 border-b-2 border-slate-700">STA 199</button>
            <button className="text-slate-500">STA 360</button>
            <button className="text-slate-500">CS 316</button>
            <button className="text-slate-500">CS 250</button>
          </div>
          <div className="relative ">
            <textarea
              className=" resize-none pt-6 px-12  overflow-auto rounded-lg border shadow-sm border-slate-300  focus:outline-none focus:ring-1 focus:ring-slate-300"
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
              onTouchEnd={(e) => handleSubmit(e)}
            >
              Find
            </button>
          </div>
        </div> */}

        <div className="pt-40 px-4 sm:px-10 bg-white">
          <form
            action="#"
            className="relative"
          >
            <div className="overflow-hidden p-3 rounded-lg border shadow-sm border-slate-300  focus:outline-none focus:ring-1 focus:ring-slate-300">
              <textarea
                className="resize-none pt-2 px-6 overflow-auto rounded-lg  focus:outline-none w-full"
                placeholder="I'm looking for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />

              {/* Spacer element to match the height of the toolbar */}
              <div aria-hidden="true">
                <div className="py-2">
                  <div className="h-9" />
                </div>
                <div className="h-px" />
                <div className="py-2">
                  <div className="py-px">
                    <div className="h-9" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-px bottom-0">
              {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
              <div className="flex flex-nowrap justify-end space-x-2 px-2 py-2 sm:px-3">
                {/* <Listbox
                  as="div"
                  value={assigned}
                  onChange={setAssigned}
                  className="flex-shrink-0"
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">Assign</Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                          {assigned.value === null ? (
                            <UserCircleIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-300 sm:-ml-1"
                              aria-hidden="true"
                            />
                          ) : (
                            <img
                              src={assigned.avatar}
                              alt=""
                              className="h-5 w-5 flex-shrink-0 rounded-full"
                            />
                          )}

                          <span
                            className={classNames(
                              assigned.value === null ? "" : "text-gray-900",
                              "hidden truncate sm:ml-2 sm:block"
                            )}
                          >
                            {assigned.value === null ? "Assign" : assigned.name}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {assignees.map((assignee) => (
                              <Listbox.Option
                                key={assignee.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? "bg-gray-100" : "bg-white",
                                    "relative cursor-default select-none px-3 py-2"
                                  )
                                }
                                value={assignee}
                              >
                                <div className="flex items-center">
                                  {assignee.avatar ? (
                                    <img
                                      src={assignee.avatar}
                                      alt=""
                                      className="h-5 w-5 flex-shrink-0 rounded-full"
                                    />
                                  ) : (
                                    <UserCircleIcon
                                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  )}

                                  <span className="ml-3 block truncate font-medium">{assignee.name}</span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox> */}

                <Listbox
                  as="div"
                  value={labelled}
                  onChange={setLabelled}
                  className="flex-shrink-0"
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">Add a label</Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                          <BookOpenIcon
                            className={classNames(
                              labelled.value === null ? "text-gray-300" : "text-gray-500",
                              "h-5 w-5 flex-shrink-0 sm:-ml-1"
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(
                              labelled.value === null ? "" : "text-gray-900",
                              "hidden truncate sm:ml-2 sm:block"
                            )}
                          >
                            {labelled.value === null ? "Course" : labelled.name}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {labels.map((label) => (
                              <Listbox.Option
                                key={label.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? "bg-gray-100" : "bg-white",
                                    "relative cursor-default select-none px-3 py-2"
                                  )
                                }
                                value={label}
                              >
                                <div className="flex items-center">
                                  <span className="block truncate font-medium">{label.name}</span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>

                {/* <Listbox
                  as="div"
                  value={dated}
                  onChange={setDated}
                  className="flex-shrink-0"
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">Add a due date</Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
                          <CalendarIcon
                            className={classNames(
                              dated.value === null ? "text-gray-300" : "text-gray-500",
                              "h-5 w-5 flex-shrink-0 sm:-ml-1"
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(
                              dated.value === null ? "" : "text-gray-900",
                              "hidden truncate sm:ml-2 sm:block"
                            )}
                          >
                            {dated.value === null ? "Due date" : dated.name}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {dueDates.map((dueDate) => (
                              <Listbox.Option
                                key={dueDate.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? "bg-gray-100" : "bg-white",
                                    "relative cursor-default select-none px-3 py-2"
                                  )
                                }
                                value={dueDate}
                              >
                                <div className="flex items-center">
                                  <span className="block truncate font-medium">{dueDate.name}</span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox> */}
              </div>
              <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
                <div className="flex">
                  <button
                    type="button"
                    className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400"
                  >
                    <PaperClipIcon
                      className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="text-sm italic text-gray-500 group-hover:text-gray-600">Attach a file</span>
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <button
                    className="inline-flex items-center rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 no-focus"
                    onClick={(e) => handleSubmit(e)}
                    onTouchEnd={(e) => handleSubmit(e)}
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-5 sm:px-10 py-5 overflow-auto  w-full text-left ">
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
