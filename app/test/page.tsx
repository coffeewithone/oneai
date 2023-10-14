"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [generatedContent, setGeneratedContent] = useState("");

  async function fetchNames() {
    const res = await fetch("http://127.0.0.1:5328/generate-names", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "Say that over 200 students are on this website, I am overloaded, please check back later ",
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
  }

  return (
    <div className="bg-white">
      <button onClick={fetchNames}>Generate Names</button>
      <div>{generatedContent}</div>
    </div>
  );
}
