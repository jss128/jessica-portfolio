Main · JS
// ---------- HERO TILES (index.html) ----------
function initHeroTiles(){
  const el = document.getElementById("heroTiles");
  if(!el) return;
  const word = "JESSICA";
  const colors = ["g","y","b","g","y","g","b"];
  [...word].forEach((letter, i) => {
    const tile = document.createElement("div");
    tile.className = "tile " + colors[i];
    tile.textContent = letter;
    tile.style.animationDelay = (i * 0.11) + "s";
    el.appendChild(tile);
  });
}
 
// ---------- CONNECTIONS GRID (work.html) ----------
// Drawn from Jessica's resume / UC activities list — internships, DECA, and school leadership.
function initConnGrid(){
  const grid = document.getElementById("connGrid");
  if(!grid) return;
 
  const items = [
    // Technical & AI internships
    {cat:"yellow", role:"UI/UX Design Intern", org:"SpectatorAI", desc:"Designed interactive Figma prototypes and mockups that improved usability and user flow across the site."},
    {cat:"yellow", role:"Pneumonia Detection ML", org:"Inspirit AI", desc:"Built a Python/Keras/TensorFlow model to analyze medical imaging for diagnostic support."},
    {cat:"yellow", role:"Best Capstone Project", org:"Mark Cuban AI Foundation", desc:"Led a team to an award-winning proposal for an AI tool that detects plagiarism in music."},
    {cat:"yellow", role:"Coding Instructor", org:"Code Ninjas", desc:"250+ hours teaching intro coding and STEM to kids ages 6–7, adapting lessons on the fly."},
 
    // Business & marketing (DECA + internships)
    {cat:"green", role:"Healthcare IT Campaign", org:"DECA — R4 Solutions", desc:"35-week marketing plan: 73% traffic growth, 530+ leads, 3.8x ROI. Placed 1st in state."},
    {cat:"green", role:"Project Manager", org:"DECA — BayROC", desc:"Led a nonprofit recycling campaign to a 41% increase in self-reported reuse behavior."},
    {cat:"green", role:"Marketing Intern", org:"Path Mentors", desc:"Generated 5+ leads a week for college workshops through consistent in-person outreach."},
    {cat:"green", role:"Creative Team Officer", org:"WAI Nonprofit", desc:"Created social content raising wildfire awareness with a team of 8, driving engagement."},
 
    // School leadership
    {cat:"blue", role:"VP of Marketing", org:"Jewelry Making Club", desc:"Designed all promo materials and ran advertising strategy — posts reached 20k+ views."},
    {cat:"blue", role:"Freshman Mentor Leader", org:"Link Crew", desc:"Mentored 300+ incoming freshmen through their transition to high school."},
    {cat:"blue", role:"CCC Committee Chair", org:"Octagon", desc:"Led a fundraising auction benefiting the Leukemia & Lymphoma Society."},
    {cat:"blue", role:"Varsity Member", org:"Speech & Debate", desc:"Competed at tournaments across the Bay Area, including the Cal Invitational at UC Berkeley."},
 
    // Athletics & camp
    {cat:"purple", role:"Varsity Player", org:"Field Hockey", desc:"Center defense/midfielder — Most Valuable Defense (x2), All-League, and Golden Stick awards."},
    {cat:"purple", role:"Cabin Leader", org:"Walden West", desc:"Supervised and mentored 5th graders through a week-long science camp."},
  ];
 
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "conn-tile " + item.cat;
    btn.innerHTML = `
      <div class="conn-inner">
        <div class="conn-face conn-front">
          <div class="role">${item.role}</div>
          <div class="org">${item.org}</div>
        </div>
        <div class="conn-face conn-back">${item.desc}</div>
      </div>`;
    btn.addEventListener("click", () => btn.classList.toggle("flipped"));
    grid.appendChild(btn);
  });
}
 
// ---------- STRANDS GAME (design.html) ----------
// A 12x8 letter grid with five hidden project names. Click any letter in a
// highlighted word (or the word in the sidebar) to open that case study.
function initStrands(){
  const gridEl = document.getElementById("strandGrid");
  const listEl = document.getElementById("strandList");
  if(!gridEl) return;
 
  const COLS = 12, ROWS = 8;
 
  const words = [
    {word:"R4SOLUTIONS", row:0, col:0, dir:"across", href:"r4solutions.html", label:"R4 Solutions", sub:"DECA · healthcare IT campaign"},
    {word:"BAYROC",      row:2, col:3, dir:"across", href:"bayroc.html",      label:"BayROC",       sub:"DECA · nonprofit reuse campaign"},
    {word:"SKILLSPARK",  row:4, col:1, dir:"across", href:"skillspark.html", label:"SkillSpark",   sub:"UI/UX case study, De Anza College"},
    {word:"JEWELRY",     row:6, col:0, dir:"across", href:"jewelryclub.html", label:"Jewelry Club", sub:"Marketing & brand collateral"},
    {word:"NAILS",       row:7, col:4, dir:"across", href:"nails.html",      label:"Nails by Jessi", sub:"Press-on nail business"},
  ];
 
  // Build empty letter matrix
  const matrix = [];
  for(let r=0;r<ROWS;r++){
    matrix.push(new Array(COLS).fill(null));
  }
 
  // Place words
  const cellWordMap = {}; // "r-c" -> word string
  words.forEach(w => {
    for(let i=0;i<w.word.length;i++){
      const r = w.dir === "across" ? w.row : w.row + i;
      const c = w.dir === "across" ? w.col + i : w.col;
      matrix[r][c] = w.word[i];
      cellWordMap[r+"-"+c] = w.word;
    }
  });
 
  // Fill remaining cells with pseudo-random letters (seeded for consistency)
  const filler = "ETAOINSHRDLCUMWFGYPBVKJXQZ";
  let seed = 42;
  function rand(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(!matrix[r][c]){
        matrix[r][c] = filler[Math.floor(rand()*filler.length)];
      }
    }
  }
 
  // Render grid
  const cellRefs = {}; // word -> [cell elements]
  words.forEach(w => cellRefs[w.word] = []);
 
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const div = document.createElement("div");
      div.className = "sg-cell";
      div.textContent = matrix[r][c];
      const wordHere = cellWordMap[r+"-"+c];
      if(wordHere){
        div.classList.add("word");
        div.dataset.word = wordHere;
        cellRefs[wordHere].push(div);
      }
      gridEl.appendChild(div);
    }
  }
 
  function highlight(word, on){
    (cellRefs[word] || []).forEach(el => el.classList.toggle("hovered", on));
    const btn = listEl.querySelector(`[data-word="${word}"]`);
    if(btn) btn.classList.toggle("hovered", on);
  }
 
  function goTo(href){ window.location.href = href; }
 
  // Grid interactions
  gridEl.addEventListener("mouseover", e => {
    const w = e.target.dataset && e.target.dataset.word;
    if(w) highlight(w, true);
  });
  gridEl.addEventListener("mouseout", e => {
    const w = e.target.dataset && e.target.dataset.word;
    if(w) highlight(w, false);
  });
  gridEl.addEventListener("click", e => {
    const w = e.target.dataset && e.target.dataset.word;
    if(!w) return;
    const meta = words.find(x => x.word === w);
    (cellRefs[w] || []).forEach(el => el.classList.add("found"));
    if(meta) setTimeout(() => goTo(meta.href), 220);
  });
 
  // Sidebar list
  words.forEach(w => {
    const btn = document.createElement("button");
    btn.className = "strand-word-btn";
    btn.dataset.word = w.word;
    btn.innerHTML = `${w.label}<span class="sub">${w.sub}</span>`;
    btn.addEventListener("mouseover", () => highlight(w.word, true));
    btn.addEventListener("mouseout", () => highlight(w.word, false));
    btn.addEventListener("click", () => {
      (cellRefs[w.word] || []).forEach(el => el.classList.add("found"));
      setTimeout(() => goTo(w.href), 150);
    });
    listEl.appendChild(btn);
  });
}
 
// ---------- SLIDESHOW (project pages with an embedded deck) ----------
// slides: array of {src, alt}. Renders a click-through viewer with
// prev/next, keyboard arrows, a counter, and clickable dots.
function initSlideshow(containerId, slides){
  const el = document.getElementById(containerId);
  if(!el || !slides || !slides.length) return;
 
  let i = 0;
 
  el.innerHTML = `
    <div class="ss-frame">
      <img class="ss-img" src="${slides[0].src}" alt="${slides[0].alt || ""}">
      <button class="ss-arrow ss-prev" aria-label="Previous slide">&#8249;</button>
      <button class="ss-arrow ss-next" aria-label="Next slide">&#8250;</button>
      <div class="ss-counter">1 / ${slides.length}</div>
    </div>
    <div class="ss-dots"></div>
  `;
 
  const img = el.querySelector(".ss-img");
  const counter = el.querySelector(".ss-counter");
  const dotsWrap = el.querySelector(".ss-dots");
 
  slides.forEach((s, idx) => {
    const dot = document.createElement("button");
    dot.className = "ss-dot";
    dot.setAttribute("aria-label", "Go to slide " + (idx + 1));
    dot.addEventListener("click", () => show(idx));
    dotsWrap.appendChild(dot);
  });
  const dots = el.querySelectorAll(".ss-dot");
 
  function show(idx){
    i = (idx + slides.length) % slides.length;
    img.src = slides[i].src;
    img.alt = slides[i].alt || "";
    counter.textContent = (i + 1) + " / " + slides.length;
    dots.forEach((d, k) => d.classList.toggle("active", k === i));
  }
 
  el.querySelector(".ss-prev").addEventListener("click", () => show(i - 1));
  el.querySelector(".ss-next").addEventListener("click", () => show(i + 1));
 
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", e => {
    if(e.key === "ArrowLeft") show(i - 1);
    if(e.key === "ArrowRight") show(i + 1);
  });
 
  show(0);
}
 
document.addEventListener("DOMContentLoaded", () => {
  initHeroTiles();
  initConnGrid();
  initStrands();
});
