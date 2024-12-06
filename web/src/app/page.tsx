"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('http://localhost:3000/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: input }),
    });
    try{
      const result = await response.json();
    setOutput(result.result);
    } catch(err){
      console.log(err)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter JSON here"
        />
        <button type="submit">Submit</button>
      </form>
      <textarea id="output"
        value={output}
        readOnly
        placeholder="Output will appear here"
      />
    </div>
  );
}