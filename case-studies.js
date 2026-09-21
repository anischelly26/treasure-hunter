(() => {
'use strict';
  const data = {
    vermeg: {
      title: 'From screenshot to editable interface.',
      meta: 'VERMEG / AI INTERNSHIP / JULY–AUGUST 2024',
      problem: 'A screenshot contains pixels, not reusable interface structure. Low-contrast text and mixed visual elements make direct extraction unreliable.',
      contribution: 'Built a Python prototype combining screenshot preprocessing, text extraction and HTML/CSS generation during the Vermeg internship.',
      decisions: 'Used OpenCV preprocessing—including contrast enhancement, CLAHE and binarization—to improve the input to Tesseract. LLaVA ran locally through Ollama to interpret the interface and support code generation.',
      result: 'Produced an end-to-end prototype and checked generated-code syntax and layout relevance. It is presented as a prototype, not a production-grade pixel-perfect converter.',
      caveat: 'No independently verified accuracy percentage or performance benchmark is claimed.',
      links: [['PROJECT SOURCE', 'https://github.com/anischelly26/ui-to-html-css-translator'], ['PROJECT PLAYGROUND', 'playground.html#missions']]
    },
    orange: {
      title: 'Shortlisting with a reason.',
      meta: 'ORANGE DIGITAL CENTER × MEDTECH / TEAM PROJECT / 2025–2026',
      problem: 'Internship recruitment becomes fragmented when CVs, applications, supervisor assignments and evaluations live in separate workflows. A ranking also needs an explanation a coordinator can inspect.',
      contribution: 'Contributed to data preparation, backend and system logic, and Agile delivery within the team. This is shared project work—not a claim of sole authorship.',
      decisions: 'The documented architecture uses React, Node.js, Express and MongoDB. The matching module is positioned as decision support: skill extraction and ranking assist a human coordinator rather than making the final hiring decision.',
      result: 'The team developed an internship/PFE portal project covering application management and explainable matching. The case study documents the wider scope; no production adoption or hiring-impact metrics are claimed.',
      caveat: 'Team: Asma Gannar, Eya Bedoui, Fares Anas, Adem Bouaccida, Skander Bouricha and Anis Chelli.',
      links: [['DOCUMENTED CASE STUDY', 'https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/orange-xai-portal.md'], ['PROJECT PLAYGROUND', 'playground.html#missions']]
    },
    monoprix: {
      title: 'A consistent foundation for sales data.',
      meta: 'MONOPRIX HEADQUARTERS, TUNIS / DATA INTERNSHIP / JULY 2024',
      problem: 'Sales information from multiple stores needed a structured, centralized database and a repeatable path from external files into that database.',
      contribution: 'Designed a centralized MySQL database and implemented Python scripts for sales-data imports during the internship.',
      decisions: 'Organized store, product, time and transaction information in a relational structure. Focused on connecting Python imports to the database while considering redundancy, integrity and consistency.',
      result: 'Implemented a practical import and centralization workflow to reduce repetitive manual handling and make sales information more accessible.',
      caveat: 'Commercial data is not exposed. No invented time savings or throughput figures are included.',
      links: [['DOCUMENTED CASE STUDY', 'https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/monoprix-data-centralization.md'], ['PROJECT PLAYGROUND', 'playground.html#missions']]
    },
    barcelona: {
      title: 'Two markets. A comparable view.',
      meta: 'BARCELONA × DUBAI / PROPERTY ANALYTICS / MVP IN PROGRESS',
      problem: 'Comparing property markets requires consistent currencies, area units and contextual signals instead of comparing raw listing prices.',
      contribution: 'Developing an interactive Next.js portfolio MVP focused on cross-market comparisons, normalized pricing and geospatial signals.',
      decisions: 'Separating the comparison interface and typed data model from the longer-term ingestion and backend roadmap. Real-data coverage and production readiness must be checked independently of a polished interface.',
      result: 'An in-progress MVP and source repository are available. This case study does not claim a completed scraping pipeline, production PostGIS backend or verified investment returns.',
      caveat: 'The hosted MVP may require sign-in. The public repository is available without a ChatGPT account. Demonstration values are not investment guidance.',
      links: [['PUBLIC SOURCE', 'https://github.com/anischelly26/barcelona-dubai-market-explorer'], ['HOSTED MVP · MAY REQUIRE SIGN-IN', 'https://barcelona-dubai-market-explorer.rhythmx.chatgpt.site']]
    }
  };
const dialog=document.querySelector('#case-study');
const out=document.querySelector('#case-content');
const add=(tag,text,parent=out,cls='')=>{const el=document.createElement(tag);el.textContent=text;el.className=cls;parent.append(el);return el;};
document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>{
const item=data[button.dataset.case];out.replaceChildren();
add('p',item.meta,out,'case-meta');add('h2',item.title).id='case-title';
const body=add('div','',out,'case-body');
[['The problem',item.problem],['My contribution',item.contribution],['Technical decisions',item.decisions],['Result & status',item.result]].forEach(([title,text])=>{const section=add('section','',body);add('h3',title,section);add('p',text,section);});
add('p',item.caveat,out,'case-caveat');const links=add('div','',out,'case-links');
item.links.filter(([label])=>label!=='PROJECT PLAYGROUND').forEach(([label,href])=>{const a=add('a',label+' ↗',links);a.href=href;a.target='_blank';a.rel='noopener noreferrer';});
dialog.showModal();dialog.scrollTop=0;
}));
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
})();

