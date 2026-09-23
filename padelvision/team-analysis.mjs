// Screen-space pair analysis. This is a documented heuristic, not a trained tactical classifier.
const visible = (p) => p && (p.visibility ?? 1) >= .45;
const clamp = (x) => Math.max(0, Math.min(1, x));

export function selectTeam(poses, previous, side, netY) {
  const candidates = poses.map(points => {
    if (!points || !visible(points[27]) || !visible(points[28]) ||
        !visible(points[23]) || !visible(points[24])) return null;
    const foot = {x:(points[27].x + points[28].x)/2, y:(points[27].y + points[28].y)/2};
    if (side === 'near' ? foot.y <= netY + .025 : foot.y >= netY - .025) return null;
    const depth = side === 'near' ? clamp((1-foot.y)/(1-netY)) : clamp(foot.y/netY);
    return {points, foot, depth};
  }).filter(Boolean);
  // A fixed rear-court camera is required. If opponents are visible, the feet on the
  // selected side closest to the camera are preferred. This is not player re-ID.
  candidates.sort((a,b) => side === 'near' ? b.foot.y-a.foot.y : a.foot.y-b.foot.y);
  const chosen = candidates.slice(0,2);
  if (chosen.length === 2) {
    if (!previous?.[0]?.foot || !previous?.[1]?.foot) chosen.sort((a,b)=>a.foot.x-b.foot.x);
    else {
      const d=(a,b)=>Math.hypot(a.foot.x-b.foot.x,a.foot.y-b.foot.y);
      const same=d(chosen[0],previous[0])+d(chosen[1],previous[1]);
      const swapped=d(chosen[1],previous[0])+d(chosen[0],previous[1]);
      if(swapped<same) chosen.reverse();
    }
    return chosen;
  }
  if(chosen.length === 1) {
    const only=chosen[0];
    if(!previous?.[0]?.foot || !previous?.[1]?.foot) return [only,null];
    const d=previous.map(p=>Math.hypot(only.foot.x-p.foot.x,only.foot.y-p.foot.y));
    return d[0]<=d[1] ? [only,null] : [null,only];
  }
  return [null,null];
}

function median(values) {
  if(!values.length) return null;
  const sorted=[...values].sort((a,b)=>a-b),m=Math.floor(sorted.length/2);
  return sorted.length%2 ? sorted[m] : (sorted[m-1]+sorted[m])/2;
}
const share=(values,fn)=>values.length ? values.filter(fn).length/values.length : 0;

export function summarizeTeam(samples) {
  const paired=samples.filter(s=>s.players[0] && s.players[1]);
  const gap=s=>Math.abs(s.players[0].foot.x-s.players[1].foot.x);
  const mismatch=s=>Math.abs(s.players[0].depth-s.players[1].depth);
  const metrics={framesSampled:samples.length,pairedFrames:paired.length,
    coverage:paired.length/samples.length || 0,
    netShare:share(paired,s=>s.players.every(p=>p.depth>=.64)),
    backShare:share(paired,s=>s.players.every(p=>p.depth<=.38)),
    staggerShare:share(paired,s=>mismatch(s)>.23),
    narrowShare:share(paired,s=>gap(s)<.12),
    medianGap:median(paired.map(gap))};
  const enough=paired.length>=Math.max(6,Math.ceil(samples.length*.55));
  const pct=x=>`${Math.round(x*100)}%`;
  if(!enough) return {...metrics,style:'Insufficient team tracking',
    headline:'No play-style suggestion yet.',
    observations:[`Both teammates tracked in ${paired.length}/${samples.length} frames.`],
    drills:['Use a fixed camera behind one baseline and keep both teammates in frame.','Set the net line and court side, then record a longer rally.']};
  let style,headline,drills;
  if(metrics.netShare>=.55){
    style='Net-forward positioning';
    headline=`Both players were near the selected net line in ${pct(metrics.netShare)} of paired frames. Trial a net-focused drill; the video alone cannot tell whether attacking wins more points.`;
    drills=['Practice paired volleys and shared recovery after a lob.'];
  } else if(metrics.backShare>=.55){
    style='Defense-first positioning';
    headline=`Both players stayed deeper in ${pct(metrics.backShare)} of paired frames. Review when the pair could move forward after a deep return.`;
    drills=['Practice a coordinated defense-to-net transition.'];
  } else {
    style='Mixed / transition positioning';
    headline='The pair moved between deeper and net-side screen positions. Review transitions before choosing an attacking or defensive emphasis.';
    drills=['Practice calling who advances and who covers the return.'];
  }
  const observations=[`Both teammates tracked in ${paired.length}/${samples.length} frames (${pct(metrics.coverage)}).`,
    `Both near net: ${pct(metrics.netShare)}; both deeper: ${pct(metrics.backShare)}; different depths: ${pct(metrics.staggerShare)}.`,
    `Median horizontal separation: ${pct(metrics.medianGap)} of the image width (not court metres).`];
  if(metrics.staggerShare>=.35){
    observations.push(`Review ${pct(metrics.staggerShare)} of paired frames with teammates at different estimated depths. This is a review cue, not a confirmed mistake.`);
    drills.push('Rehearse advancing and recovering together, with a coach checking each situation.');
  }
  if(metrics.narrowShare>=.35){
    observations.push(`Players appear close together in ${pct(metrics.narrowShare)} of paired frames. Check the camera perspective before judging court coverage.`);
    drills.push('Check lateral coverage with a fixed court view and a coach.');
  }
  drills.push('Mark actual shot outcomes and errors with a coach before claiming a better play style.');
  return {...metrics,style,headline,observations,drills};
}
