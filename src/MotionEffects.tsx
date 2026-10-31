import {useEffect, useState} from 'react';
import {motion, useReducedMotion, useScroll, useSpring} from 'framer-motion';
import {ArrowUp, Pause, Play} from 'lucide-react';

/** Decorative layers never capture input; controls remain keyboard accessible. */
export default function MotionEffects(){
  const reduced=useReducedMotion();
  const [paused,setPaused]=useState(()=>{try{return localStorage.getItem('webd-pause-background')==='true'}catch{return false}});
  const [scrolled,setScrolled]=useState(false);
  const {scrollYProgress}=useScroll();
  const smoothProgress=useSpring(scrollYProgress,{stiffness:110,damping:30});
  useEffect(()=>{
    document.documentElement.classList.toggle('motion-paused',paused||!!reduced);
    try{localStorage.setItem('webd-pause-background',String(paused))}catch{/* Storage is optional. */}
    return()=>document.documentElement.classList.remove('motion-paused');
  },[paused,reduced]);
  useEffect(()=>{
    const update=()=>setScrolled(window.scrollY>500);
    update();window.addEventListener('scroll',update,{passive:true});
    const links=Array.from(document.querySelectorAll<HTMLAnchorElement>('header nav a'));
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible)links.forEach(link=>{if(link.hash==='#'+visible.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
    },{rootMargin:'-15% 0px -55% 0px',threshold:[0,.1,.3]});
    document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
    return()=>{window.removeEventListener('scroll',update);observer.disconnect()};
  },[]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <motion.div aria-hidden="true" className="reading-progress" style={{scaleX:reduced?scrollYProgress:smoothProgress}}/>
    <div className="ambient-background" aria-hidden="true"><div className="ambient-orb ambient-blue"/><div className="ambient-orb ambient-purple"/><div className="ambient-orb ambient-cyan"/><div className="ambient-stars">{Array.from({length:16},(_,i)=><i key={i} style={{left:`${(i*37+9)%100}%`,top:`${(i*23+7)%100}%`,animationDelay:`-${i*1.3}s`,animationDuration:`${8+i%5}s`}}/>)}</div></div>
    {!reduced&&<button className="motion-control" onClick={()=>setPaused(!paused)} aria-label={paused?'Play background animation':'Pause background animation'} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>}<span>{paused?'Motion paused':'Pause motion'}</span></button>}
    {scrolled&&<button className="back-to-top" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})}><ArrowUp size={18}/></button>}
  </>;
}
