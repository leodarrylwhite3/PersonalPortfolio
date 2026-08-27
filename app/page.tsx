"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Page = "projects" | "home" | "roadmap";
type Edge = "left" | "right" | null;
const pageOrder: Page[] = ["projects", "home", "roadmap"];

const frames = [
  { number: "01", title: "ENGINEER", note: "Systems with purpose", src: "/images/leo-headshot.jpg?v=2", position:"center" },
  { number: "02", title: "BUILDER", note: "Teams into products", src: "/images/leo-capstone.jpg?v=2", position:"center" },
  { number: "03", title: "EXPLORER", note: "Outside the interface", src: "/images/leo-mountain.jpg?v=2", position:"center 72%" },
  { number: "04", title: "LEARNER", note: "Perspective through culture", src: "/images/leo-chado.jpg?v=2", position:"center" },
];

const projects = [
  { number:"01", title:"Signals into Care", category:"AI wellness pipeline", status:"Private system", summary:"A chat-based workflow that turns families’ free-text and voice updates into useful health and behavior records.", detail:"I built containerized Python services and a LangChain-based LLM pipeline that structured diet, sleep, and behavior inputs, generated wellness scores, and stored the results across MongoDB and Firestore.", stack:["Python","Flask","Docker","LangChain","MongoDB"] },
  { number:"02", title:"The Memory Desk", category:"RAG support agent", status:"Internal tool", summary:"An AI support assistant that finds relevant historical tickets and prepares structured response drafts.", detail:"I combined BM25 ranking with vector similarity search to retrieve useful precedents from MongoDB and reduce the manual work required to respond to recurring support issues.", stack:["Python","OpenAI","RAG","BM25","MongoDB"] },
  { number:"03", title:"Paper into Data", category:"Document intelligence", status:"Private system", summary:"A document pipeline that converts PDFs and incoming faxes into structured records based on predefined schemas.", detail:"I built the ingestion workflow around a fine-tuned Vertex AI model and connected the extracted output to MongoDB and Firestore for downstream use.", stack:["Python","Vertex AI","MongoDB","Firestore"] },
  { number:"04", title:"A Room of Our Own", category:"Meeting platform", status:"Internal platform", summary:"A private real-time video meeting experience designed for Ocean Friends’ internal workflows.", detail:"I deployed LiveKit on Google Kubernetes Engine with DNS, TLS, and media-service configuration, then built React controls for participants, microphones, and cameras.", stack:["Java","React","Docker","GKE","LiveKit"] },
  { number:"05", title:"The Care Clock", category:"MCADD caregiver app", status:"Private application", summary:"A cross-platform caregiver application for time-sensitive alarms, food logging, resources, and documents.", detail:"I developed the .NET MAUI application and backend services, using Azure Blob Storage, Firestore, and Firebase Cloud Messaging to support secure data and real-time alerts for caregivers of children with MCADD.", stack:[".NET MAUI","C#","Azure","Firestore","FCM"] },
];

const milestones = [
  { starId: "point-1", year: "2019—2024", label: "High school", title: "Curiosity takes shape", body: "High school is where I began connecting creativity, technology, and the idea that the systems around us can be redesigned to help people." },
  { starId: "point-2", year: "2019", label: "MightyKidz daycare", title: "Responsibility for others", body: "Caring for children ages one through four meant supervising, feeding, supporting early learning, and staying attentive to each child’s safety and needs throughout the day." },
  { starId: "point-3", year: "Jun—Aug 2021", label: "Landscaping", title: "Learning endurance", body: "At Adam Gorski Landscapes in North Bend, I handled materials, prepared sites, met daily productivity goals, and learned how consistency matters when the work is physically demanding." },
  { starId: "point-4", year: "Sep 2023—Jun 2026", label: "Seattle University", title: "Building foundations", body: "I earned my B.S. in Computer Science while making the Dean’s List and receiving the Costco and Achievement Scholarships. My studies included data structures, distributed systems, algorithms, cybersecurity, SQL, networking, and game development." },
  { starId: "point-5", year: "Jun 2023—Dec 2025", label: "Ocean Friends", title: "Giving therapists time back", body: "Ocean Friends was an EMR system focused on automating administrative work so therapists could spend more of their time directly helping a child. I built AI wellness services, containerized cloud pipelines, automated patient-record migrations, and tools that turned unstructured family input into useful records." },
  { starId: "point-6", year: "2023—2025", label: "MCADD application", title: "Software when timing matters", body: "As part of my internship work, I developed a .NET MAUI caregiver app for alarms, food logging, resources, and documents, backed by secure cloud storage and real-time notifications for families caring for children with MCADD." },
  { starId: "point-7", year: "—", label: "Open chapter", title: "To be written", body: "This star is ready for another school, role, project, or turning point when the story grows." },
  { starId: "point-8", year: "—", label: "Open chapter", title: "To be written", body: "This star is ready for another school, role, project, or turning point when the story grows." },
  { starId: "point-9", year: "—", label: "Open chapter", title: "To be written", body: "This star completes the constellation and keeps the path open for what comes next." },
];

const leoStars = [
  { id: "point-1", name: "Tip", x: 82, y: 17 },
  { id: "point-2", name: "Hook II", x: 74, y: 10 },
  { id: "point-3", name: "Hook III", x: 61, y: 28 },
  { id: "point-4", name: "Junction", x: 62, y: 42 },
  { id: "point-5", name: "Left branch", x: 31, y: 52 },
  { id: "point-6", name: "Bottom left", x: 12, y: 83 },
  { id: "point-7", name: "Lower middle", x: 34, y: 72 },
  { id: "point-8", name: "Bottom right", x: 76, y: 70 },
  { id: "point-9", name: "Right branch", x: 72, y: 50 },
];

const leoConnections = [
  ["point-1", "point-2"], ["point-2", "point-3"], ["point-3", "point-4"],
  ["point-4", "point-5"], ["point-5", "point-6"], ["point-6", "point-7"],
  ["point-7", "point-8"], ["point-8", "point-9"], ["point-9", "point-4"],
] as const;

const starById = Object.fromEntries(leoStars.map((star) => [star.id, star]));
const milestoneByStar = Object.fromEntries(milestones.map((milestone, index) => [milestone.starId, index]));

export default function Portfolio() {
  const [page, setPage] = useState<Page>("home");
  const [activeFrame, setActiveFrame] = useState(0);
  const [expandedProject, setExpandedProject] = useState<number | null>(0);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [edge, setEdge] = useState<Edge>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [starTraveling, setStarTraveling] = useState(false);
  const [loopTraveling, setLoopTraveling] = useState(false);
  const [cameraStarId, setCameraStarId] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<readonly [string, string] | null>(null);
  const [constellationSize, setConstellationSize] = useState({ width: 0, height: 0, top: 82 });
  const edgeTimer = useRef<number | null>(null);
  const constellationRef = useRef<HTMLDivElement | null>(null);

  const travelTo = useCallback((destination: Page) => {
    if (destination === page) return;
    setTransitioning(true);
    setSelectedStar(null);
    setPage(destination);
    window.setTimeout(() => setTransitioning(false), 1250);
  }, [page]);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveFrame((current) => (current + 1) % frames.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const index = pageOrder.indexOf(page);
      if (event.key === "ArrowRight" && index < pageOrder.length - 1 && selectedStar === null) travelTo(pageOrder[index + 1]);
      if (event.key === "ArrowLeft" && index > 0 && selectedStar === null) travelTo(pageOrder[index - 1]);
      if (event.key === "Escape") setSelectedStar(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [page, selectedStar, travelTo]);

  useEffect(() => {
    const element = constellationRef.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      setConstellationSize({ width: bounds.width, height: bounds.height, top: bounds.top });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || selectedStar !== null || transitioning) return;
    const ratio = event.clientX / window.innerWidth;
    const index = pageOrder.indexOf(page);
    const availableEdge: Edge = ratio < .06 && index > 0 ? "left" : ratio > .94 && index < pageOrder.length - 1 ? "right" : null;
    if (availableEdge === edge) return;
    if (edgeTimer.current) window.clearTimeout(edgeTimer.current);
    setEdge(availableEdge);
    if (availableEdge) {
      edgeTimer.current = window.setTimeout(() => {
        const destinationIndex = pageOrder.indexOf(page) + (availableEdge === "right" ? 1 : -1);
        travelTo(pageOrder[destinationIndex]);
        setEdge(null);
      }, 760);
    }
  };

  const clearEdge = () => {
    if (edgeTimer.current) window.clearTimeout(edgeTimer.current);
    setEdge(null);
  };

  const handleRoadmapWheel = (event: React.WheelEvent) => {
    if (selectedStar !== null && event.deltaY > 18) setSelectedStar(null);
  };

  const lineStyle = (fromId: string, toId: string) => {
    const from = starById[fromId];
    const to = starById[toId];
    const x1 = from.x * constellationSize.width / 100;
    const y1 = from.y * constellationSize.height / 100;
    const x2 = to.x * constellationSize.width / 100;
    const y2 = to.y * constellationSize.height / 100;
    return { left: x1, top: y1, width: Math.hypot(x2 - x1, y2 - y1), transform: `rotate(${Math.atan2(y2-y1,x2-x1)*180/Math.PI}deg)` };
  };

  const cameraStyle = () => {
    if (selectedStar === null || !cameraStarId || !constellationSize.width) return undefined;
    const star = starById[cameraStarId];
    const scale = 2.35;
    const starX = star.x * constellationSize.width / 100;
    const starY = constellationSize.top + star.y * constellationSize.height / 100;
    const viewportHeight = constellationSize.top + constellationSize.height;
    return { transformOrigin: "0 0", transform: `translate3d(${constellationSize.width/2-scale*starX}px,${viewportHeight/2-scale*starY}px,0) scale(${scale})` };
  };

  const moveAlongPath = (nextIndex: number) => {
    if (selectedStar === null || nextIndex < 0 || nextIndex >= milestones.length) return;
    setStarTraveling(true);
    const isForwardLoop = selectedStar === milestones.length - 1 && nextIndex === 0;
    const isBackwardLoop = selectedStar === 0 && nextIndex === milestones.length - 1;
    const isLoop = isForwardLoop || isBackwardLoop;
    setLoopTraveling(isLoop);
    const route = isForwardLoop ? [3, 2, 1, 0] : isBackwardLoop ? [1, 2, 3, 8] : [nextIndex];
    let previousId = milestones[selectedStar].starId;
    route.forEach((routeIndex, step) => {
      window.setTimeout(() => {
        const destinationId = milestones[routeIndex].starId;
        setActivePath([previousId, destinationId]);
        setCameraStarId(destinationId);
        previousId = destinationId;
        if (step === route.length - 1) {
          setSelectedStar(nextIndex);
          window.setTimeout(() => { setStarTraveling(false); setLoopTraveling(false); setActivePath(null); }, isLoop ? 700 : 1100);
        }
      }, step * 700);
    });
  };

  const pageIndex = pageOrder.indexOf(page);
  const edgeDestination = edge ? pageOrder[pageIndex + (edge === "right" ? 1 : -1)] : null;

  return (
    <main className={`portfolio-shell on-${page} ${transitioning ? "is-traveling" : ""}`} onPointerMove={handlePointerMove} onPointerLeave={clearEdge}>
      <header className={`site-header ${page === "roadmap" ? "header-dark" : ""}`}>
        <button className="mark" onClick={() => travelTo("home")} aria-label="Return home">LW</button>
        <nav aria-label="Main navigation">
          <button className={page === "projects" ? "active" : ""} onClick={() => travelTo("projects")}>Projects</button>
          <button className={page === "home" ? "active" : ""} onClick={() => travelTo("home")}>Home</button>
          <button className={page === "roadmap" ? "active" : ""} onClick={() => travelTo("roadmap")}>Roadmap</button>
        </nav>
        <p>Software engineer · AI systems · 2026</p>
      </header>

      <div className="page-world" style={{ transform: `translate3d(-${pageIndex * 100}vw,0,0)` }}>
        <section className="page-scene projects-scene" aria-hidden={page !== "projects"}>
          <div className="project-speed-lines" aria-hidden="true" />
          <div className="projects-layout">
            <div className="projects-intro">
              <p>Selected work · Case files 01—05</p>
              <h2>Things I&apos;ve<br/><em>made real.</em></h2>
              <div className="project-manifesto"><i/><p>Not every project can be public. This page focuses on the problem, the decisions, and what I learned—not just a repository link.</p></div>
              <span>Click a file to open it.</span>
            </div>
            <div className="project-files">
              {projects.map((project,index) => (
                <article className={`project-file ${expandedProject === index ? "open" : ""}`} key={project.number}>
                  <button className="project-file-header" onClick={() => setExpandedProject(expandedProject === index ? null : index)} aria-expanded={expandedProject === index}>
                    <span className="file-number">File {project.number}</span><strong>{project.title}</strong><span className="file-category">{project.category}</span><b>{expandedProject === index ? "−" : "+"}</b>
                  </button>
                  <div className="project-file-body"><div>
                    <p className="project-summary">{project.summary}</p><p className="project-detail">{project.detail}</p>
                    <div className="project-meta"><div>{project.stack.map(item => <span key={item}>{item}</span>)}</div><p className="project-access">▣ {project.status}</p></div>
                  </div></div>
                </article>
              ))}
            </div>
          </div>
          <aside className="edge-label edge-right"><span>Home</span><b>→</b></aside>
          <footer className="page-footer"><span>Case files · 2026</span><span>Hold the right edge to travel</span></footer>
        </section>

        <section className="page-scene home-scene" aria-hidden={page !== "home"}>
          <div className="hero">
            <div className="copy-column">
              <p className="kicker">Hello, I&apos;m Leo White · Software engineer</p>
              <h1>I create systems<em>that help people</em>move with ease.</h1>
              <p className="intro">I build reliable applications, AI-assisted workflows, and automations that turn complex processes into clearer, more useful experiences. My work spans backend services, cloud systems, and React and .NET interfaces—with a focus on software that makes life and work easier for people.</p>
              <div className="contact-row" aria-label="Contact links"><a href="mailto:leodarrylwhite3@gmail.com">Email ↗</a><a href="https://github.com/leodarrylwhite3?tab=repositories" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/leo-white-iii" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
            </div>
            <div className="gallery-column">
              <div className="gallery-caption"><span>Portraits / moments</span><span>{String(activeFrame + 1).padStart(2, "0")} — 04</span></div>
              <div className="photo-stack">
                {frames.map((frame, index) => (
                  <button className={`photo-frame frame-${index} ${activeFrame === index ? "current" : ""}`} key={frame.number} onClick={() => setActiveFrame(index)} aria-label={`Show ${frame.title.toLowerCase()} portrait`} style={{ zIndex: activeFrame === index ? 4 : 3 - index }}>
                    {frame.src ? <img src={frame.src} alt="Leo White" style={{objectPosition:frame.position}} /> : <span className="photo-placeholder" aria-hidden="true"><i className="portrait-head" /><i className="portrait-body" /></span>}
                    <span className="frame-number">{frame.number}</span><span className="frame-copy"><strong>{frame.title}</strong><small>{frame.note}</small></span>
                  </button>
                ))}
              </div>
              <div className="gallery-controls"><button className="gallery-arrow" onClick={() => setActiveFrame((activeFrame-1+frames.length)%frames.length)} aria-label="Previous photo">←</button><div className="gallery-dots">{frames.map((frame, index) => <button key={frame.number} className={activeFrame === index ? "active" : ""} onClick={() => setActiveFrame(index)} aria-label={`Open image ${index + 1}`} />)}</div><button className="gallery-arrow" onClick={() => setActiveFrame((activeFrame+1)%frames.length)} aria-label="Next photo">→</button></div>
            </div>
          </div>
          <aside className="edge-label edge-left"><span>Projects</span><b>←</b></aside><aside className="edge-label edge-right"><span>Roadmap</span><b>→</b></aside>
          <footer className="page-footer"><span>Hold either edge to travel</span><span>Chapter 02 / 03</span></footer>
        </section>

        <section className={`page-scene roadmap-scene ${selectedStar !== null ? "star-focused" : ""} ${starTraveling ? "camera-traveling" : ""} ${loopTraveling ? "loop-camera" : ""}`} aria-hidden={page !== "roadmap"} onWheel={handleRoadmapWheel}>
          <div className="roadmap-camera" style={cameraStyle()}>
            <div className="deep-stars stars-a"/><div className="deep-stars stars-b"/>
            <div className="roadmap-title"><p>A personal constellation</p><h2>The Leo<br/>Roadmap</h2><span>Nine stars. One continuous story.</span></div>
            <div className="constellation" ref={constellationRef} aria-label="Leo constellation career timeline">
              {leoConnections.map(([from,to]) => {
                const isActive = activePath && ((activePath[0] === from && activePath[1] === to) || (activePath[0] === to && activePath[1] === from));
                const lineFrom = isActive ? activePath[0] : from;
                const lineTo = isActive ? activePath[1] : to;
                return <i className={`path-line ${isActive ? "active-path" : ""}`} key={`${from}-${to}`} style={lineStyle(lineFrom,lineTo)}/>;
              })}
              {leoStars.map((star) => {
                const milestoneIndex = milestoneByStar[star.id];
                if (milestoneIndex === undefined) return <span className="constellation-star" style={{left:`${star.x}%`,top:`${star.y}%`}} key={star.id}><i/><small>{star.name}</small></span>;
                const milestone = milestones[milestoneIndex];
                return <button className={`milestone-star ${selectedStar === milestoneIndex ? "selected" : ""}`} style={{left:`${star.x}%`,top:`${star.y}%`}} key={star.id} onClick={() => { setCameraStarId(star.id); setSelectedStar(milestoneIndex); }} aria-label={`${milestone.year}: ${milestone.title}`}><i className="star-core"/><i className="star-ring"/><span>{String(milestoneIndex+1).padStart(2,"0")} · {milestone.year}</span><small>{milestone.label}</small></button>;
              })}
              <span className="start-note">Start here <b>↙</b></span><span className="leo-caption">Leo · nine-point cycle</span>
            </div>
          </div>

          <div className={`focus-shade ${selectedStar !== null ? "visible" : ""}`} onClick={() => setSelectedStar(null)} />
          {selectedStar !== null && (
            <article className="milestone-card">
              <button className="close-card" onClick={() => setSelectedStar(null)} aria-label="Zoom out">×</button>
              <div className="card-art" aria-hidden="true"><i/><span>{String(selectedStar+1).padStart(2,"0")}</span></div>
              <div className="card-story"><p>{milestones[selectedStar].year} · {milestones[selectedStar].label}</p><h3>{milestones[selectedStar].title}</h3><i className="story-rule"/><p>{milestones[selectedStar].body}</p></div>
              <footer className="card-controls"><button disabled={starTraveling} onClick={() => moveAlongPath((selectedStar-1+milestones.length)%milestones.length)}>← Prev</button><button className="zoom-out" onClick={() => setSelectedStar(null)}>− <span>Zoom out</span></button><button disabled={starTraveling} onClick={() => moveAlongPath((selectedStar+1)%milestones.length)}>Next →</button></footer>
            </article>
          )}
          {selectedStar === null && <div className="roadmap-help"><span>✦</span><p>Choose a star to enter the story</p></div>}
          <aside className="edge-label edge-left roadmap-edge"><span>Home</span><b>←</b></aside>
          <footer className="page-footer roadmap-footer"><span>Hold the left edge to return</span><span>Scroll down or press Esc to zoom out</span></footer>
        </section>
      </div>

      <div className={`edge-portal portal-right ${edge === "right" ? "engaged" : ""}`} aria-hidden="true"><i/><span>Entering {edgeDestination}</span><b>→</b></div>
      <div className={`edge-portal portal-left ${edge === "left" ? "engaged" : ""}`} aria-hidden="true"><i/><span>Entering {edgeDestination}</span><b>←</b></div>
      <div className="travel-wipe" aria-hidden="true"><i/><i/><i/></div>
    </main>
  );
}
