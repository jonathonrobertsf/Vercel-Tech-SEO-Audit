"use client";
import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const runCrawler = async () => {
    setLoading(true);
    const res = await fetch("/api/crawl", {
      method: "POST",
      body: JSON.stringify({ url, limit })
    });
    const data = await res.json();
    setResults(data.pages);
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">SEO Website Crawler</h1>

      <div className="card p-4 shadow-sm mb-5">
        <div className="mb-3">
          <label className="form-label">Start URL</label>
          <input type="text" className="form-control" value={url}
            onChange={(e)=>setUrl(e.target.value)} placeholder="https://example.com"/>
        </div>

        <div className="mb-3">
          <label className="form-label">Crawl Limit</label>
          <input type="number" className="form-control" value={limit}
            onChange={(e)=>setLimit(Number(e.target.value))}/>
        </div>

        <button className="btn btn-primary" disabled={loading} onClick={runCrawler}>
          {loading ? "Crawling…" : "Start Crawl"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="card p-4 shadow-sm">
          <h3>Crawl Results</h3>
          <table className="table table-striped mt-3">
            <thead>
              <tr><th>URL</th><th>Status</th><th>Title</th><th>Issues</th></tr>
            </thead>
            <tbody>
              {results.map((p,i)=>(
                <tr key={i}>
                  <td>{p.url}</td>
                  <td>{p.status}</td>
                  <td>{p.title || "—"}</td>
                  <td>{p.issues.length ? p.issues.join(", ") : "No issues"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}