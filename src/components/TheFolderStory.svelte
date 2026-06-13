<script>
  // ── LINE G · THE FOLDER — story-kern, ported from experiments/folder-spike ──
  // Verified WebGL + GSAP + WebAudio scroll experience, ported byte-for-byte into
  // a Svelte island. The ONE architectural change vs the spike: it lives as an
  // embedded section (sticky-pinned stage + tall scroller scoped to the root),
  // NOT a whole page. Logic, shaders, particles, postprocessing, audio, the
  // collapse, the folder-on-you, the fingerprint, LABELS, TOTAL, bloom tuning —
  // all unchanged from the spike. Data is real & sourced (see VERIFY-G1.md).
  import { onMount } from 'svelte'
  import * as THREE from 'three'
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
  import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

  let { ghostFragment = [] } = $props()
  let root

  /* ── Category labels — REAL, sourced ad-targeting segments ───────────────────
     Verified 2026-06-13 (see VERIFY-G1.md). Sensitive segments (s:true) are VERBATIM
     from the Xandr/Microsoft marketplace file exposed in 2023, reported by The Markup
     (US) + netzpolitik.org (EU). Ordinary segments: Xandr-verbatim + IAB Audience
     Taxonomy 1.1 standard categories. s:true → rendered red. */
  const LABELS = [
    // ordinary — Xandr-verbatim (The Markup) + IAB Audience Taxonomy 1.1
    "Affluent Millennials", "Dunkin' Donuts Visitors", "Past Purchases › Subaru", "Not a Sightseer",
    "Age 35–44", "Homeowner", "Frequent Flyer", "Pet Owner", "Home Improvement",
    "Investing", "Job Seeking", "Heavy Streaming", "EV In-Market", "Coupon User",
    "Luxury Goods", "Gamer", "Cryptocurrency", "Travel: Booking Soon",
    // sensitive — VERBATIM from the Xandr file (The Markup + netzpolitik.org, 2023)
    { t:"Heavy Purchasers of Pregnancy Test Kits", s:true },
    { t:"Depression Medications", s:true },
    { t:"Propensity for Depression", s:true },
    { t:"Propensity for Stroke", s:true },
    { t:"Infertility / IVF", s:true },
    { t:"HealthRankings › Diabetes Type II", s:true },
    { t:"Rheumatism", s:true },
    { t:"Opiate Addiction", s:true },
    { t:"'Fragile Seniors'", s:true },
    { t:"Casino & Gambling Activities", s:true },
    { t:"Gambling Addiction", s:true },
    { t:"'Hardcore' Republicans", s:true },
    { t:"'Persuadable' Democrats", s:true },
    { t:"'Easily Deflated'", s:true },
    { t:"'I get a raw deal out of life'", s:true }
  ];
  // 650,000 segments existed in ONE marketplace (Xandr). The Markup + netzpolitik, 2023.
  const TOTAL = 650000;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = matchMedia("(max-width:760px)").matches;

  /* ── Behavioral mirror — which WebGL label lingered nearest screen centre ──── */
  const pageStart = performance.now();
  const dwell = new Map();
  function addDwell(text, sensitive, ms){ const c=dwell.get(text)||{ms:0,sensitive}; c.ms+=ms; dwell.set(text,c); }
  function topDwell(){ let best=null,max=0; dwell.forEach((v,text)=>{ if(v.ms>max){max=v.ms;best={text,...v};} });
    return (best&&best.ms>400)?best:null; }
  const timeOnPage = () => Math.round((performance.now()-pageStart)/1000);

  /* ── WebAudio engine (synthesized, gesture-gated, mutable) ─────────────────── */
  let actx, master, droneG, subG, riserG, riserBP, audioOn=false, muted=false;
  function initAudio(){
    if(audioOn) return; audioOn=true;
    try{
      actx = new (window.AudioContext||window.webkitAudioContext)();
      master = actx.createGain(); master.gain.value = muted?0:0.5; master.connect(actx.destination);
      droneG = actx.createGain(); droneG.gain.value=0;
      const lp = actx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=320;
      droneG.connect(lp); lp.connect(master);
      [55,82.5].forEach((f,i)=>{ const o=actx.createOscillator(); o.type="sawtooth";
        o.frequency.value=f; o.detune.value=i?8:-8; o.connect(droneG); o.start(); });
      subG = actx.createGain(); subG.gain.value=0; subG.connect(master);
      const so=actx.createOscillator(); so.type="sine"; so.frequency.value=38; so.connect(subG); so.start();
      const noise=actx.createBufferSource();
      const buf=actx.createBuffer(1,actx.sampleRate*2,actx.sampleRate);
      const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      noise.buffer=buf; noise.loop=true;
      riserBP=actx.createBiquadFilter(); riserBP.type="bandpass"; riserBP.frequency.value=300; riserBP.Q.value=1.3;
      riserG=actx.createGain(); riserG.gain.value=0;
      noise.connect(riserBP); riserBP.connect(riserG); riserG.connect(master); noise.start();
    }catch(e){ console.warn("[folder-spike] audio off:",e.message); actx=null; }
  }
  function updateAudio(p){
    if(!actx) return; const t=actx.currentTime;
    droneG.gain.setTargetAtTime(0.05 + p*0.10, t, 0.12);
    subG.gain.setTargetAtTime(smooth(0.38,0.66,p)*0.22, t, 0.12);
    const esc=smooth(0.42,0.70,p);
    riserBP.frequency.setTargetAtTime(300 + esc*5200, t, 0.05);
    const rg = p<0.7 ? esc*0.12 : Math.max(0, 0.12*(1-(p-0.7)*9));
    riserG.gain.setTargetAtTime(rg, t, 0.05);
  }
  function boom(){
    if(!actx) return; const t=actx.currentTime;
    const ko=actx.createOscillator(), kg=actx.createGain();
    ko.type="sine"; ko.frequency.setValueAtTime(150,t); ko.frequency.exponentialRampToValueAtTime(36,t+0.32);
    kg.gain.setValueAtTime(0.9,t); kg.gain.exponentialRampToValueAtTime(0.0008,t+0.75);
    ko.connect(kg); kg.connect(master); ko.start(t); ko.stop(t+0.85);
    const nb=actx.createBufferSource(), b=actx.createBuffer(1,Math.floor(actx.sampleRate*0.6),actx.sampleRate);
    const dd=b.getChannelData(0); for(let i=0;i<dd.length;i++) dd[i]=(Math.random()*2-1)*(1-i/dd.length);
    nb.buffer=b; const nf=actx.createBiquadFilter(); nf.type="lowpass";
    nf.frequency.setValueAtTime(4500,t); nf.frequency.exponentialRampToValueAtTime(180,t+0.5);
    const ng=actx.createGain(); ng.gain.setValueAtTime(0.5,t); ng.gain.exponentialRampToValueAtTime(0.0008,t+0.6);
    nb.connect(nf); nf.connect(ng); ng.connect(master); nb.start(t);
  }

  /* ── three.js stage + postprocessing ──────────────────────────────────────── */
  let progress=0, renderer, scene, camera, points, mat, group, sprites=[];
  let composer=null, bloom=null, finalPass=null;
  let camShake=0, burstSpike=0, aberrSpike=0, boomed=false;
  let canvas, flashEl;
  let countEl, counterEl, soundBtn;

  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp01=(x)=>Math.max(0,Math.min(1,x));
  const smooth=(e0,e1,x)=>{ const t=clamp01((x-e0)/(e1-e0)); return t*t*(3-2*t); };

  const FinalShader = {
    uniforms:{ tDiffuse:{value:null}, uTime:{value:0}, uAberr:{value:0.4} },
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader:`
      uniform sampler2D tDiffuse; uniform float uTime,uAberr; varying vec2 vUv;
      float rand(vec2 c){ return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        vec2 d = vUv-0.5;
        float a = uAberr*(0.0015 + dot(d,d)*0.02);
        vec3 col;
        col.r = texture2D(tDiffuse, vUv + d*a*2.0).r;
        col.g = texture2D(tDiffuse, vUv).g;
        col.b = texture2D(tDiffuse, vUv - d*a*2.0).b;
        float vig = smoothstep(1.25, 0.45, length(d)*1.4);
        col *= vig;
        col += (rand(vUv+fract(uTime))-0.5)*0.03;   // film grain
        gl_FragColor = vec4(col,1.0);
      }`
  };

  function makeLabelSprite(text, danger){
    const s=2, w=512, h=80;
    const c=document.createElement("canvas"); c.width=w*s; c.height=h*s;
    const ctx=c.getContext("2d"); ctx.scale(s,s);
    ctx.font="600 26px ui-monospace, Menlo, monospace"; ctx.textBaseline="middle";
    ctx.fillStyle=danger?"#ff9a8f":"#ffe39a";
    ctx.shadowColor=danger?"rgba(255,90,77,.95)":"rgba(255,196,0,.75)"; ctx.shadowBlur=14;
    ctx.fillText(text,10,h/2);
    const tex=new THREE.CanvasTexture(c); tex.minFilter=THREE.LinearFilter;
    const m=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});
    const sp=new THREE.Sprite(m); sp.scale.set(11,1.7,1); return sp;
  }

  function initWebGL(){
    if(!window.WebGLRenderingContext) throw new Error("no webgl");
    renderer=new THREE.WebGLRenderer({canvas,antialias:!isMobile,alpha:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile?1.5:2));
    renderer.setSize(innerWidth,innerHeight); renderer.setClearColor(0x04040a,1);

    scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x04040a,0.011);
    camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,0.1,400); camera.position.set(0,0,72);
    group=new THREE.Group(); scene.add(group);

    const N = isMobile?4200:11000;
    const pos=new Float32Array(N*3), seed=new Float32Array(N), tier=new Float32Array(N);
    for(let i=0;i<N;i++){
      const r=32*Math.cbrt(Math.random());
      const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
      pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pos[i*3+2]=r*Math.cos(ph)*1.3;
      seed[i]=Math.random();
      const rt=Math.random(); tier[i]=rt<0.06?0:(rt<0.80?1:2);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
    geo.setAttribute("aSeed",new THREE.BufferAttribute(seed,1));
    geo.setAttribute("aTier",new THREE.BufferAttribute(tier,1));

    mat=new THREE.ShaderMaterial({
      transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
      uniforms:{
        uTime:{value:0}, uProgress:{value:0}, uConverge:{value:0}, uBurst:{value:0},
        uSize:{value:isMobile?34:50}, uPixelRatio:{value:renderer.getPixelRatio()},
        uColor:{value:new THREE.Color(0xffc400)}, uDanger:{value:new THREE.Color(0xff5a4d)}
      },
      vertexShader:`
        uniform float uTime,uProgress,uConverge,uBurst,uSize,uPixelRatio;
        attribute float aSeed,aTier; varying float vTier,vAlpha;
        void main(){
          vTier=aTier; vec3 p=position;
          float t=uTime*0.06 + aSeed*6.2831;
          p += vec3(sin(t),cos(t*1.27),sin(t*0.7)) * (0.25 + aSeed*0.5);
          float expand = 1.0 + uProgress*1.9;
          p.xy *= expand; p.z *= mix(1.0,1.55,uProgress);
          p += normalize(p + 0.0001) * uBurst * 9.0;           // violent outward flare
          float c = clamp(uConverge*1.55 - aSeed*0.45, 0.0, 1.0);
          c = c*c*(3.0-2.0*c);
          p = mix(p, vec3(0.0,0.0,p.z*0.02), c);               // implode to a point
          float reveal = smoothstep(0.08,0.55,uProgress);
          vAlpha = (aTier<0.5?1.0:reveal) * (1.0 - c*0.12);
          vec4 mv = modelViewMatrix * vec4(p,1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize*uPixelRatio*(0.5+aSeed)/max(-mv.z,1.0)*(1.0+c*2.5);
        }`,
      fragmentShader:`
        precision mediump float; uniform vec3 uColor,uDanger; varying float vTier,vAlpha;
        void main(){
          vec2 uv=gl_PointCoord-0.5; float d=length(uv); if(d>0.5) discard;
          float glow=smoothstep(0.5,0.0,d); glow*=glow;   // sharper core, less haze
          vec3 col=mix(uColor,uDanger,step(1.5,vTier));
          gl_FragColor=vec4(col,glow*vAlpha*0.7);
        }`
    });
    points=new THREE.Points(geo,mat); group.add(points);

    LABELS.forEach((L)=>{
      const danger=typeof L==="object"&&L.s; const text=typeof L==="object"?L.t:L;
      const sp=makeLabelSprite(text,danger);
      const r=14+Math.random()*18, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1);
      const home=new THREE.Vector3(r*Math.sin(ph)*Math.cos(th), r*Math.sin(ph)*Math.sin(th)*0.7, r*Math.cos(ph)*1.2);
      sp.position.copy(home); sp.userData={home,text,danger,base:danger?1.0:0.85};
      group.add(sp); sprites.push(sp);
    });

    addEventListener("resize",onResize);
  }

  function setupPost(){
    try{
      composer=new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene,camera));
      bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight), 0.55, 0.45, 0.30);
      composer.addPass(bloom);
      finalPass=new ShaderPass(FinalShader); composer.addPass(finalPass);
      composer.addPass(new OutputPass());
      composer.setSize(innerWidth,innerHeight);
    }catch(e){ console.warn("[folder-spike] bloom off, base render:",e.message); composer=null; }
  }

  function onResize(){
    camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
    if(composer) composer.setSize(innerWidth,innerHeight);
  }

  function fireCollapse(){
    boom(); camShake=1.5; burstSpike=1.0; aberrSpike=4.5;
    gsap.killTweensOf(flashEl); gsap.set(flashEl,{opacity:0.92});
    gsap.to(flashEl,{opacity:0,duration:0.65,ease:"power2.out"});
    gsap.killTweensOf(camera);
    gsap.fromTo(camera,{fov:62},{fov:100,duration:0.16,ease:"power2.out",yoyo:true,repeat:1,
      onUpdate:()=>camera.updateProjectionMatrix(), onComplete:()=>{camera.fov=62;camera.updateProjectionMatrix();}});
  }

  const tmp=new THREE.Vector3();
  let lastT=performance.now();
  function frame(now){
    const dt=now-lastT; lastT=now;
    mat.uniforms.uTime.value=now*0.001;
    mat.uniforms.uProgress.value=smooth(0.10,0.58,progress);
    mat.uniforms.uConverge.value=smooth(0.63,0.74,progress);
    mat.uniforms.uBurst.value=burstSpike; burstSpike*=0.85;

    if(progress>0.70 && !boomed){ boomed=true; fireCollapse(); }
    if(progress<0.55) boomed=false;

    const zIn=lerp(72,11,smooth(0.12,0.62,progress));
    const zBack=lerp(0,16,smooth(0.70,0.92,progress));
    camera.position.z=zIn+zBack;
    camShake*=0.9;
    camera.position.x=(Math.random()-0.5)*camShake*5;
    camera.position.y=(Math.random()-0.5)*camShake*5;
    group.rotation.y=Math.sin(now*0.00008)*0.3 + progress*0.6;
    group.rotation.x=Math.cos(now*0.00006)*0.12;

    const reveal=smooth(0.16,0.55,progress), conv=smooth(0.63,0.74,progress);
    const sampling=progress>0.18 && progress<0.66;
    let nearest=null, nearestDist=0.26;
    for(const s of sprites){
      s.material.opacity=reveal*(1-conv)*s.userData.base;
      s.position.copy(s.userData.home).multiplyScalar(1-conv*0.96);
      if(sampling && s.material.opacity>0.25){
        tmp.copy(s.position); group.localToWorld(tmp); tmp.project(camera);
        if(tmp.z<1){ const dist=Math.hypot(tmp.x,tmp.y); if(dist<nearestDist){nearestDist=dist; nearest=s;} }
      }
    }
    if(nearest) addDwell(nearest.userData.text, nearest.userData.danger, dt);

    const cprog=smooth(0.34,0.64,progress);
    countEl.textContent=Math.round(lerp(4,TOTAL,cprog)).toLocaleString("en-US");
    counterEl.classList.toggle("hot", cprog>0.5);

    updateAudio(progress);

    if(composer){
      finalPass.uniforms.uTime.value=now*0.001;
      finalPass.uniforms.uAberr.value=0.4+aberrSpike; aberrSpike*=0.9;
      composer.render();
    } else {
      renderer.render(scene,camera);
    }
    requestAnimationFrame(frame);
  }

  /* ── BEAT 3 folder-on-you (DOM, ephemeral, never sent/stored) ─────────────── */
  function buildYourFolder(){
    const box=document.getElementById("your-folder"); if(box.childElementCount) return;
    const step=reduce?0:200; let seq=0;
    const fade=(el)=>{ if(!reduce){el.style.opacity=0;el.style.transition="opacity .45s ease";}
      box.appendChild(el); if(!reduce) setTimeout(()=>el.style.opacity=1,seq++*step); else seq++; };
    const tab=(cls,path,val)=>{ const el=document.createElement("div"); el.className="tab"+(cls?" "+cls:"");
      el.innerHTML=`<span class="path">${path}</span><span class="val">${val}</span>`; fade(el); };
    const divider=(text)=>{ const el=document.createElement("div"); el.className="divider"; el.textContent=text; fade(el); };

    const now=new Date(), hh=now.getHours();
    const time=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    const tod=hh<6?"the small hours":hh<12?"morning":hh<18?"afternoon":hh<23?"evening":"the small hours";
    tab("","LOCAL TIME", time+" — "+tod);
    try{ tab("","TIME ZONE", Intl.DateTimeFormat().resolvedOptions().timeZone); }catch(e){}
    tab("","LANGUAGE", (navigator.languages||[navigator.language]).slice(0,3).join(", "));
    const dpr=window.devicePixelRatio||1;
    tab("","SCREEN", screen.width+"×"+screen.height+(dpr>1.5?" · retina":""));
    tab("","INPUT", (navigator.maxTouchPoints||0)>0?"touch — a phone or tablet":"mouse / trackpad");
    const plat=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform;
    if(plat) tab("","PLATFORM", plat);
    if(navigator.hardwareConcurrency) tab("","CPU", navigator.hardwareConcurrency+" cores");
    if(navigator.deviceMemory) tab("","MEMORY", "~"+navigator.deviceMemory+" GB");
    if(navigator.connection&&navigator.connection.effectiveType) tab("","CONNECTION", navigator.connection.effectiveType.toUpperCase());
    if(matchMedia("(prefers-color-scheme: dark)").matches) tab("","DISPLAY", "dark mode — noted");
    const dnt=navigator.doNotTrack==="1"||window.doNotTrack==="1"||navigator.msDoNotTrack==="1";
    tab("req","YOUR REQUEST", dnt?`"Do Not Track" — you sent it. The industry agreed, then ignored it.`
      :`none sent — almost nobody knows the switch exists`);

    divider("— and what you did here —");
    tab("","TIME HERE", timeOnPage()+"s, and counting");
    const td=topDwell();
    tab("","LONGEST LOOK", td
      ? `"${td.text}" — ${(td.ms/1000).toFixed(0)}s` + (td.sensitive?" · the machine would note that":"")
      : `you blew past them — so does the machine. It doesn't need to look twice.`);

    divider("— the one that survives everything —");
    buildFingerprint(box, seq++*step);
  }

  function cyrb53(str,seed=0){ let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;
    for(let i=0,ch;i<str.length;i++){ ch=str.charCodeAt(i);
      h1=Math.imul(h1^ch,2654435761); h2=Math.imul(h2^ch,1597334677); }
    h1=Math.imul(h1^(h1>>>16),2246822507); h1^=Math.imul(h2^(h2>>>13),3266489909);
    h2=Math.imul(h2^(h2>>>16),2246822507); h2^=Math.imul(h1^(h1>>>13),3266489909);
    return 4294967296*(2097151&h2)+(h1>>>0); }
  function computeFingerprint(){
    const p=[]; p.push(navigator.userAgent||"", (navigator.languages||[]).join(","));
    try{ p.push(Intl.DateTimeFormat().resolvedOptions().timeZone); }catch(e){}
    p.push(new Date().getTimezoneOffset(), screen.width+"x"+screen.height+"x"+(screen.colorDepth||""),
      window.devicePixelRatio||"", navigator.hardwareConcurrency||"", navigator.deviceMemory||"",
      (navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||"", navigator.maxTouchPoints||0);
    try{ const c=document.createElement("canvas"); c.width=240; c.height=60;
      const ctx=c.getContext("2d"); ctx.textBaseline="top"; ctx.font="16px 'Arial'";
      ctx.fillStyle="#f60"; ctx.fillRect(2,2,120,30);
      ctx.fillStyle="#069"; ctx.fillText("datavism · the folder ✦",4,8);
      ctx.fillStyle="rgba(255,0,128,0.7)"; ctx.fillText("GHOST",50,20);
      p.push(c.toDataURL()); }catch(e){}
    const hx=cyrb53(p.join("|")).toString(16).toUpperCase().padStart(13,"0");
    return "DV-"+hx.slice(0,4)+"-"+hx.slice(4,8)+"-"+hx.slice(8,12);
  }
  function buildFingerprint(box,delay){
    const id=computeFingerprint(); const el=document.createElement("div"); el.className="fingerprint";
    el.innerHTML=`<div class="fp-label">browser fingerprint · computed live</div>
      <div class="fp-id" id="fp-id">${reduce?id:"DV-····-····-····"}</div>
      <div class="fp-note">No cookie. No login. Refresh — same code. Open a private window —
      likely the same code. <b>This is how they keep you after you delete everything.</b></div>`;
    if(!reduce){ el.style.opacity=0; el.style.transition="opacity .5s ease"; }
    box.appendChild(el); if(reduce) return;
    setTimeout(()=>{ el.style.opacity=1; const out=document.getElementById("fp-id"); const HEX="0123456789ABCDEF"; let f=0;
      const iv=setInterval(()=>{ f++;
        out.textContent=id.split("").map((c,i)=> i<f?c:(/[-DV]/.test(c)?c:HEX[Math.floor(Math.random()*16)])).join("");
        if(f>=id.length){ clearInterval(iv); out.textContent=id; }
      },55);
    }, delay+250);
  }

  /* ── HUD refs + sound toggle ───────────────────────────────────────────────── */
  function refreshSoundBtn(){ soundBtn.classList.toggle("on", actx && !muted);
    soundBtn.textContent = (actx && !muted) ? "♪ on" : "♪ off"; }

  /* ── Boot ─────────────────────────────────────────────────────────────────── */
  function boot(){
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({ trigger:root, start:'top top', end:'bottom bottom', scrub:0.6,
      onUpdate:(s)=>{ progress=s.progress; } });
    gsap.utils.toArray(".reveal").forEach((el)=>{
      gsap.fromTo(el,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.7,ease:"power2.out",
        scrollTrigger:{trigger:el,start:"top 82%"}});
    });
    ScrollTrigger.create({ trigger:"#turn", start:"top 70%", once:true, onEnter:buildYourFolder });

    // audio unlocks on first user gesture (browser requirement)
    const unlock=()=>{ initAudio(); if(actx && actx.state==="suspended") actx.resume(); refreshSoundBtn(); };
    ["pointerdown","touchstart","keydown","wheel"].forEach((ev)=> addEventListener(ev, unlock, {once:true, passive:true}));

    const t1=document.getElementById("t1");
    if(!reduce){ const full=t1.innerHTML; const tmpD=document.createElement("div"); tmpD.innerHTML=full;
      const plain=tmpD.textContent; t1.textContent=""; let i=0;
      (function tick(){ i++; t1.textContent=plain.slice(0,i);
        if(i<plain.length) setTimeout(tick,52); else t1.innerHTML=full; })(); }
  }

  onMount(() => {
    countEl=document.getElementById("count");
    counterEl=document.getElementById("counter");
    soundBtn=document.getElementById("sound");
    soundBtn.addEventListener("click", ()=>{
      initAudio(); if(actx && actx.state==="suspended") actx.resume();
      muted=!muted; if(master) master.gain.value=muted?0:0.5; refreshSoundBtn();
    });

    try {
      if(reduce) throw new Error("reduced-motion → static");
      initWebGL();
      setupPost();
      boot();
      requestAnimationFrame(frame);
    } catch(err) {
      console.warn("[folder-spike] WebGL/animation off:", err.message);
      root.classList.add("no-webgl");
      try {
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray(".reveal").forEach((el)=> el.style.opacity=1);
        ScrollTrigger.create({ trigger:"#turn", start:"top 75%", once:true, onEnter:buildYourFolder });
      } catch(e) {
        document.querySelectorAll(".reveal").forEach((el)=> el.style.opacity=1);
        buildYourFolder();
      }
      document.getElementById("count").textContent=TOTAL.toLocaleString("en-US");
    }
  })
</script>

<div class="fs-root" bind:this={root}>
  <div class="fs-stage">
    <canvas id="bg" bind:this={canvas}></canvas>
    <div id="vignette"></div>
    <div id="flash" bind:this={flashEl}></div>

    <div class="hud">
      <span class="hud-left">
        <span class="badge"><b>G</b> THE FOLDER</span>
        <button id="sound" class="sound" aria-label="toggle sound">♪ sound</button>
      </span>
      <span class="counter" id="counter"><span class="n" id="count">0</span> ways to label you</span>
    </div>
  </div>

  <div class="fs-scroller">
    <section id="cold">
      <h1><span id="t1">There is a <span class="y">folder</span>.</span></h1>
      <p class="sub reveal" id="sub1">Your name is on it. You have never opened it.</p>
      <p class="sub reveal" id="sub2" style="color:var(--fainter);margin-top:.7rem;">
        <!-- Sourced: ICCL/Johnny Ryan 2022 — Europe 376/day, US 747/day. See VERIFY-G1.md -->
        In Europe, it's opened 376 times a day — to decide what you're worth.
      </p>
      <div class="scrollcue reveal">open the folder<span class="arrow">↓</span></div>
    </section>

    <section id="mundane">
      <p class="lead reveal">Page one. Nothing you didn't expect.</p>
      <p class="big reveal">Age. Device. City. Homeowner.</p>
      <p class="ghost-aside reveal" style="margin-top:1.2rem;">Boring, isn't it. That's the point. Keep going.</p>
    </section>

    <section id="escalate" class="tall">
      <div style="display:flex;flex-direction:column;height:100vh;justify-content:flex-end;padding-bottom:14vh;">
        <p class="lead reveal">Then it gets specific.</p>
        <p class="big reveal">And it does not stop.</p>
        <p class="stamp reveal" style="max-width:46ch;">
          <b>SOURCE</b> · every label here is real — verbatim from Microsoft's Xandr
          marketplace file, exposed 2023 · The&nbsp;Markup + netzpolitik.org ·
          <span style="color:var(--line-g)">// GHOST · FILE 1/5</span>
        </p>
      </div>
    </section>

    <section id="turn">
      <div class="card reveal">
        <p class="big" style="margin:0 0 .5rem;">All of it. Onto one record.</p>
        <p class="lead" style="margin:0 0 1rem;">
          Watch — I'll start a folder on <em>you</em>, right here. No login, no cookie.
          I don't know your name and I'm not even trying.
        </p>
        <div class="your-folder" id="your-folder" aria-live="polite"></div>
        <p class="disclaimer">
          Three things just happened: I read your device, I watched what you lingered on,
          and I reduced you to one near-unique code. All computed <b>inside your browser</b> —
          nothing sent, nothing saved; refresh and it's gone.
          <span class="hot">The machines that do this for real never refresh — and they cross-reference all three, forever.</span>
        </p>
      </div>
      <div class="stamp reveal">
        <b>METHOD</b> · live from your browser (navigator · screen · Intl · canvas) ·
        nothing sent · nothing stored ·
        <span style="color:var(--line-g)">// GHOST · FILE 1/5</span>
      </div>
    </section>

    <section id="ghost">
      <div class="card reveal">
        <div class="ghost">
          <span class="who">GHOST · file fragment 1/5 — DRAFT</span>
          {#each ghostFragment as line}<p>{line}</p>{/each}
        </div>
        <p class="lead" style="margin:0;">Scrolling is panic. Panic is useless here. So stop.</p>
        <p style="margin:.3rem 0 0;">Pick <em>one</em> label that claims to know you. Then ask the only thing that matters:</p>
        <p class="question">Who assigned it — on what data — and who paid to use it?</p>
        <div class="mission-teaser">
          <b>NEXT — the mission (not in this spike):</b> choose your category, write the
          provable question, open <b>Case File #1</b>. That's where you stop being the
          folder and start reading one.
        </div>
      </div>
      <p class="stamp reveal" style="border:none;margin-top:2rem;">
        LINE G · Station G1 · story-kern spike · <span style="color:var(--line-g)">datavism underground</span>
      </p>
    </section>

    <footer>
      <b>SPIKE — feel-test (design §8 step 1).</b> The data is real &amp; sourced
      (verification pass 2026-06-13, see <code>VERIFY-G1.md</code>): segment names are verbatim
      from the Xandr/Microsoft marketplace file exposed in 2023 —
      <a href="https://themarkup.org/privacy/2023/06/08/from-heavy-purchasers-of-pregnancy-tests-to-the-depression-prone-we-found-650000-ways-advertisers-label-you" target="_blank" rel="noopener">The Markup</a>
      &amp; <a href="https://netzpolitik.org/2023/microsofts-datenmarktplatz-xandr-das-sind-650-000-kategorien-in-die-uns-die-online-werbeindustrie-einsortiert/" target="_blank" rel="noopener">netzpolitik.org</a>;
      RTB frequency from the <a href="https://www.iccl.ie/news/iccl-report-on-the-scale-of-real-time-bidding-data-broadcasts-in-the-u-s-and-europe/" target="_blank" rel="noopener">ICCL 2022 report</a>.
      The folder-on-you and audio are your own live signals / synthesized in-browser.
      No tracking, no storage, no network beyond the CDN libs — open DevTools and check.
      The GHOST fragment is still a DRAFT.
    </footer>
  </div>
</div>

<style>
  .fs-root {
    position: relative;
    width: 100vw; margin-left: calc(50% - 50vw); /* full-bleed out of the reading column */
    --bg:#050805; --ink:#f1f1f3; --dim:#9a9aa2; --fainter:#5a5a64;
    --line-g:#ffd23f; --danger:#ff5a4d; --paper:rgba(16,16,24,.74); --edge:#2b2b36;
    --mono: ui-monospace,"SF Mono","JetBrains Mono","Fira Code",Menlo,Consolas,monospace;
    color:var(--ink); font-family:var(--mono); font-size:17px; line-height:1.6;
    -webkit-font-smoothing:antialiased;
  }
  .fs-root * { box-sizing:border-box; }
  .fs-root a { color:var(--line-g); }

  /* Sticky pinned stage. The OVERLAP is done by pulling .fs-scroller up
     (margin-top:-100vh) — NOT by a negative margin here: a negative margin on a
     sticky element collapses its margin-box to 0, so it stays pinned until the
     whole island scrolls off the top, and the canvas would then cover (and steal
     clicks from) the beats below it. No z-index here keeps .hud (z5) above the
     scroller (z3) so the sound button stays clickable. */
  .fs-stage { position:sticky; top:0; height:100vh; width:100%; }

  #bg { position:absolute; inset:0; width:100%; height:100%; display:block; z-index:0; pointer-events:none; }
  #vignette { position:absolute; inset:0; z-index:1; pointer-events:none;
    background:radial-gradient(120% 90% at 50% 45%, transparent 60%, rgba(4,4,10,.7) 100%); }
  #flash { position:absolute; inset:0; z-index:2; pointer-events:none; opacity:0;
    background:radial-gradient(circle at 50% 50%, #fff 0%, #ffd9d4 35%, var(--danger) 70%, transparent 100%); }

  .hud { position:absolute; inset:0 0 auto 0; z-index:5; display:flex;
    justify-content:space-between; align-items:center; padding:14px 18px;
    font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--dim);
    background:linear-gradient(180deg, rgba(4,4,10,.92), rgba(4,4,10,0)); pointer-events:none; }
  .hud-left { display:flex; align-items:center; gap:12px; }
  .badge { display:inline-flex; align-items:center; gap:8px; color:var(--bg);
    background:var(--line-g); padding:3px 9px; border-radius:2px; font-weight:700; }
  .badge b { font-size:14px; }
  .sound { pointer-events:auto; cursor:pointer; font-family:var(--mono); font-size:11px;
    letter-spacing:.08em; text-transform:uppercase; color:var(--dim); background:transparent;
    border:1px solid var(--edge); border-radius:3px; padding:3px 8px; }
  .sound.on { color:var(--line-g); border-color:var(--line-g); }
  .counter { text-align:right; }
  .counter .n { display:block; font-size:20px; color:var(--ink);
    font-variant-numeric:tabular-nums; letter-spacing:0; }
  .counter.hot .n { color:var(--danger); }

  .fs-scroller { position:relative; z-index:3; margin-top:-100vh; }
  section { min-height:100vh; display:flex; flex-direction:column; justify-content:center;
    max-width:760px; margin:0 auto; padding:0 24px; }
  section.tall { min-height:280vh; }

  .reveal { opacity:0; }
  h1 { font-size:clamp(40px,9vw,84px); line-height:1.02; margin:0 0 .25em;
    font-weight:800; letter-spacing:-.03em; }
  h1 .y { color:var(--line-g); }
  .sub { color:var(--dim); font-size:clamp(16px,4vw,21px); max-width:36ch; }
  .scrollcue { margin-top:3rem; color:var(--fainter); font-size:13px;
    letter-spacing:.14em; text-transform:uppercase; }
  .scrollcue .arrow { display:block; font-size:24px; color:var(--line-g); margin-top:.4rem;
    animation:bob 1.8s ease-in-out infinite; }
  @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }

  .lead { color:var(--dim); margin:0 0 1rem; font-size:clamp(17px,4.5vw,22px); }
  .ghost-aside { color:var(--fainter); font-style:italic; }
  .big { font-size:clamp(26px,6.5vw,46px); font-weight:800; letter-spacing:-.02em; line-height:1.08; }

  .card { background:var(--paper); backdrop-filter:blur(12px);
    border:1px solid var(--edge); border-radius:8px; padding:24px; }
  .your-folder { margin:1rem 0 0; }
  .tab { display:flex; align-items:baseline; gap:12px; background:rgba(255,90,77,.06);
    border:1px solid var(--edge); border-left:3px solid var(--danger);
    padding:11px 14px; margin:7px 0; border-radius:0 4px 4px 0; }
  .tab .path { color:var(--fainter); font-size:12px; letter-spacing:.04em;
    text-transform:uppercase; flex:0 0 auto; }
  .tab .val { color:#ffd9d4; font-weight:600; }
  .tab.req { border-left-color:var(--line-g); }
  .tab.req .val { color:var(--ink); }
  .your-folder .divider { color:var(--fainter); font-size:11px; letter-spacing:.12em;
    text-transform:uppercase; margin:18px 0 6px; text-align:center; }
  .fingerprint { margin-top:12px; padding:18px 16px; border:1px solid rgba(255,90,77,.5);
    background:rgba(255,90,77,.08); border-radius:6px; }
  .fingerprint .fp-label { color:var(--danger); font-size:11px; letter-spacing:.1em; text-transform:uppercase; }
  .fingerprint .fp-id { font-size:clamp(24px,7.5vw,38px); font-weight:800; color:#ffd9d4;
    letter-spacing:.04em; margin:6px 0; word-break:break-all; font-variant-numeric:tabular-nums; }
  .fingerprint .fp-note { color:var(--dim); font-size:12.5px; line-height:1.55; }
  .fingerprint .fp-note b { color:var(--danger); }
  .disclaimer { color:var(--dim); font-size:13.5px; line-height:1.6; margin:1.3rem 0 0; }
  .disclaimer .hot { color:var(--danger); display:block; margin-top:.45rem; font-weight:600; }

  .ghost { border-left:3px solid var(--ink); padding:4px 0 4px 18px; margin:0 0 1.5rem; }
  .ghost .who { color:var(--fainter); font-size:12px; letter-spacing:.1em; text-transform:uppercase; }
  .ghost p { margin:.5rem 0; }
  .question { font-size:clamp(22px,5.5vw,32px); font-weight:800; line-height:1.2;
    margin:1rem 0; color:var(--line-g); }
  .mission-teaser { color:var(--dim); border-top:1px dashed var(--edge); padding-top:1.2rem; margin-top:1.4rem; }
  .mission-teaser b { color:var(--ink); }
  .stamp { font-size:11px; color:var(--fainter); letter-spacing:.03em; margin-top:1.2rem;
    border-top:1px solid var(--edge); padding-top:8px; }
  .stamp b { color:var(--dim); }

  footer { position:relative; z-index:3; max-width:760px; margin:0 auto; padding:5rem 24px 7rem;
    color:var(--fainter); font-size:12px; line-height:1.7; border-top:1px solid var(--edge); }
  footer b { color:var(--danger); }

  .fs-root.no-webgl #bg { display:none; }
  .fs-root.no-webgl { background:#08080e; }
  @media (prefers-reduced-motion: reduce) { .scrollcue .arrow { animation:none; } }
</style>
