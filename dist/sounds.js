// Short, locally synthesized foley. No downloads, voices or autoplay.
export function playCue(context,kind,volume=0.65){
 const now=context.currentTime,master=context.createGain();master.gain.value=Math.max(0,Math.min(1,volume))*.24;master.connect(context.destination);
 function tone(frequency,start,duration,type='sine',strength=.4,end=frequency){const oscillator=context.createOscillator(),gain=context.createGain();oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,now+start);oscillator.frequency.exponentialRampToValueAtTime(Math.max(20,end),now+start+duration);gain.gain.setValueAtTime(.001,now+start);gain.gain.exponentialRampToValueAtTime(strength,now+start+.008);gain.gain.exponentialRampToValueAtTime(.001,now+start+duration);oscillator.connect(gain);gain.connect(master);oscillator.start(now+start);oscillator.stop(now+start+duration+.02);}
 function noise(start,duration,frequency,strength){const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.value=frequency;gain.gain.value=strength;source.connect(filter);filter.connect(gain);gain.connect(master);source.start(now+start);}
 if(kind==='bang'){tone(125,0,.14,'sine',.9,38);noise(0,.09,1800,.55);tone(1600,.015,.25,'triangle',.07,970);}
 else if(kind==='splat'){noise(0,.35,1050,.8);tone(320,0,.16,'sine',.65,75);tone(500,.14,.11,'sine',.15,180);}
 else if(kind==='alarm'){tone(510,0,.12,'square',.2,420);tone(660,.18,.13,'square',.18,490);}
 else if(kind==='notice'){tone(720,0,.08,'sine',.3);tone(480,.1,.1,'sine',.2);}
 else if(kind==='select'){tone(340,0,.055,'triangle',.25,600);}
 else {tone(523,0,.22);tone(659,.12,.22);tone(784,.24,.38,'sine',.4);}
 setTimeout(()=>master.disconnect(),1200);
}
