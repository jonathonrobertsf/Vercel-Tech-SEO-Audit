import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

async function fetchPage(url:string){
  try{
    const res=await fetch(url,{redirect:"follow"});
    const html=await res.text();
    return {status:res.status, html};
  }catch{
    return {status:0, html:""};
  }
}

function extractIssues($:any){
  const title=$("title").text()?.trim();
  const description=$('meta[name="description"]').attr("content");
  const canonical=$('link[rel="canonical"]').attr("href");
  const h1s=$("h1").map((_,el)=>$(el).text().trim()).get();
  const imgMissingAlt=$("img:not([alt]), img[alt='']").length;

  const issues=[];
  if(!title) issues.push("Missing title");
  if(!description) issues.push("Missing meta description");
  if(!canonical) issues.push("Missing canonical");
  if(h1s.length===0) issues.push("Missing H1");
  if(h1s.length>1) issues.push("Multiple H1s");
  if(imgMissingAlt>0) issues.push("Images missing alt");

  return {title, issues};
}

export async function POST(req:Request){
  const {url, limit}=await req.json();
  const queue=[url];
  const visited=new Set();
  const pages=[];

  while(queue.length && pages.length<limit){
    const current=queue.shift();
    if(!current || visited.has(current)) continue;
    visited.add(current);

    const {status, html}=await fetchPage(current);
    const $=cheerio.load(html);

    const {title, issues}=extractIssues($);

    pages.push({url:current, status, title, issues});

    const base=new URL(current).origin;
    $("a[href]").each((_,el)=>{
      const href=$(el).attr("href");
      if(!href) return;
      try{
        const nextUrl=new URL(href, base).href;
        if(nextUrl.startsWith(base) && !visited.has(nextUrl)) queue.push(nextUrl);
      }catch{}
    });
  }

  return NextResponse.json({pages});
}