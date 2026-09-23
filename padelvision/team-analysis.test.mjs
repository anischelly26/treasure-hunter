import test from 'node:test';
import assert from 'node:assert/strict';
import {selectTeam,summarizeTeam} from './team-analysis.mjs';

function person(x,y){
  const landmarks=Array.from({length:33},()=>({x,y,visibility:.98}));
  landmarks[27]={x:x-.01,y,visibility:.98};
  landmarks[28]={x:x+.01,y,visibility:.98};
  return landmarks;
}
const sample=(yA,yB,xA=.27,xB=.73)=>({players:[
  {foot:{x:xA,y:yA},depth:(1-yA)/.5},
  {foot:{x:xB,y:yB},depth:(1-yB)/.5}
]});

test('chooses the requested court half when four players are detected',()=>{
  const poses=[person(.2,.8),person(.7,.18),person(.75,.82),person(.23,.16)];
  const near=selectTeam(poses,null,'near',.5);
  assert.deepEqual(near.map(p=>p.foot.x),[.2,.75]);
  const far=selectTeam(poses,null,'far',.5);
  assert.deepEqual(far.map(p=>p.foot.x),[.23,.7]);
});
test('keeps the two track slots through detector-order changes',()=>{
  const previous=selectTeam([person(.2,.8),person(.7,.8)],null,'near',.5);
  const current=selectTeam([person(.69,.78),person(.21,.78)],previous,'near',.5);
  assert.ok(current[0].foot.x<current[1].foot.x);
});
test('only supports a positioning cue with enough paired observations',()=>{
  const short=[sample(.8,.8),sample(.8,.8),{players:[null,null]}];
  assert.equal(summarizeTeam(short).style,'Insufficient team tracking');
  const back=Array.from({length:10},()=>sample(.84,.86));
  assert.equal(summarizeTeam(back).style,'Defense-first positioning');
  const net=Array.from({length:10},()=>sample(.58,.59));
  assert.equal(summarizeTeam(net).style,'Net-forward positioning');
  assert.ok(summarizeTeam(back).headline.includes('cannot')===false);
});
