const points = [
 {id:1,title:'상가 골목 · VIP 주차',sub:'편의점 / 클럽 후면',file:'01_commercial_alley_west.png',xy:[1030,780],dir:'서',arrow:'←',category:'COMMERCIAL ALLEY',desc:'대로에서 이어지는 상가 골목. 루체 VIP 주차 진입과 편의점, 공원 가장자리를 살펴보세요.',links:[3,2,6]},
 {id:2,title:'로생네컷 앞 골목',sub:'포토 부스 / 공원 서측',file:'02_photo_park_alley_north.png',xy:[341,695],dir:'북',arrow:'↑',category:'PHOTO & PARK',desc:'로생네컷과 작은 점포가 이어지는 공원 서쪽 골목. 낮은 문턱과 배수로, 좁은 생활도로를 참고하세요.',links:[4,1]},
 {id:3,title:'클럽 옆 연결 골목',sub:'루체 측면 / 공원 방향',file:'03_club_park_alley_north.png',xy:[751,865],dir:'북',arrow:'↑',category:'CLUB SIDE ALLEY',desc:'루체 옆에서 공원 쪽으로 이어지는 연결 골목. 불투명한 클럽 외벽과 맞은편 소규모 상가가 마주합니다.',links:[1,4,6]},
 {id:4,title:'공원 북쪽 생활 골목',sub:'빌라촌 / 근린상가',file:'04_residential_commercial_alley_east.png',xy:[400,460],dir:'동',arrow:'→',category:'PARKSIDE LANE',desc:'공원과 빌라촌 사이의 평탄한 생활 골목. 주거지 출입구와 상가, 공원 경계를 함께 확인하세요.',links:[5,2,3]},
 {id:5,title:'빌라촌 안쪽 골목',sub:'다세대 주택 / 주차 공간',file:'05_villa_lane_west.png',xy:[665,318],dir:'서',arrow:'←',category:'RESIDENTIAL LANE',desc:'벽돌과 석재 외장 빌라가 이어지는 주거 골목. 소규모 주차 공간과 전선, 건물 사이 간격을 참고하세요.',links:[4]},
 {id:6,title:'루체 클럽 정문',sub:'대기 천막 / 가드 / VIP',file:'06_luce_boulevard_entrance.png',xy:[966,1036],dir:'북서',arrow:'↖',category:'BOULEVARD',desc:'곡면 발광 패널로 감싼 8층 LUCE 외관입니다. 평평하게 이어지는 대기줄과 출입구, 차양과 확인 데스크를 살펴보세요. 1층 내부는 복도 안쪽에서 계단으로 연결됩니다.',links:[3,1]}
];
const $=id=>document.getElementById(id);
let current=6, mode='street', zoom=1, pan={x:0,y:0}, fit={w:0,h:0}, toastTimer;
const assets='assets/';
function placeButtons(){
 $('places').innerHTML=points.map(p=>`<button class="place" data-point="${p.id}"><span class="place-number">${String(p.id).padStart(2,'0')}</span><span class="place-text"><span class="place-title">${p.title}</span><span class="place-sub">${p.sub}</span></span><span class="place-arrow" aria-hidden="true">↗</span></button>`).join('');
 $('filmstrip').innerHTML=points.map(p=>`<button class="film-card" data-point="${p.id}" aria-label="${p.title} 보기"><span class="thumb"><img src="${assets+p.file}" alt="" loading="lazy"><span>${String(p.id).padStart(2,'0')}</span></span><span class="film-label">${p.title}</span></button>`).join('');
 for(const root of [$('miniMarkers'),$('largeMarkers')]) root.innerHTML=points.map(p=>`<button class="map-marker" data-point="${p.id}" style="left:${p.xy[0]/1800*100}%;top:${p.xy[1]/1760*100}%" aria-label="${p.id}. ${p.title}" title="${p.title}">${p.id}</button>`).join('');
}
function urlState(){const h=new URLSearchParams(location.hash.slice(1));const id=Number(h.get('view'));return {id:points.some(p=>p.id===id)?id:6,mode:['street','plan','satellite'].includes(h.get('mode'))?h.get('mode'):'street'};}
function go(id=current,nextMode='street',push=true){
 current=id;mode=nextMode;
 $('entranceDetail').hidden = current !== 6 || mode !== 'street';
 $('interiorDetail').hidden = current !== 6 || mode !== 'street';
 if(push){const hash=`#view=${current}&mode=${mode}`;if(location.hash!==hash)history.pushState(null,'',hash);}
 const p=points.find(p=>p.id===current);
 document.querySelectorAll('[data-point]').forEach(el=>el.setAttribute('aria-current',String(Number(el.dataset.point)===current)));
 document.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===mode)));
 $('viewer').dataset.mode=mode;
 $('breadcrumb').textContent=p.title;
 $('locationNumber').textContent=mode==='street'?String(current).padStart(2,'0'):mode==='plan'?'M':'S';
 $('sceneTitle').textContent=mode==='street'?p.title:mode==='plan'?'도심 블록 배치도':'옥상으로 보는 도심 블록';
 $('sceneType').textContent=mode==='street'?'STREET REFERENCE':mode==='plan'?'NEIGHBORHOOD PLAN':'SATELLITE REFERENCE';
 $('detailCategory').textContent=mode==='street'?`${p.category} · ${String(current).padStart(2,'0')}`:mode==='plan'?'SITE PLAN · TOP VIEW':'SATELLITE · TOP VIEW';
 $('description').textContent=mode==='street'?p.desc:mode==='plan'?'초록 번호를 누르면 해당 위치의 거리뷰가 열립니다. 확대해서 도로, 인도, 건물 출입구를 확인하세요.':'수직으로 내려다본 옥상과 도로 배치 레퍼런스입니다. 거리 이동은 배치도 또는 장소 목록에서 선택하세요.';
 $('direction').textContent=mode==='street'?p.dir:'북';$('compassArrow').textContent=mode==='street'?p.arrow:'↑';
 $('largeMarkers').hidden=mode!=='plan';
 $('connections').hidden=mode!=='street';
 $('connections').innerHTML=p.links.map(id=>`<button data-point="${id}"><span aria-hidden="true">↗</span>${points[id-1].title}</button>`).join('');
 $('stepCount').textContent=`${current} / ${points.length}`;
 const file=mode==='street'?p.file:mode==='plan'?'08_site_plan.png':'07_satellite_top_down.png';
 $('download').href=assets+file;$('download').download=file;
 $('sceneImage').alt=mode==='street'?p.title+' — '+p.desc:$('sceneTitle').textContent;
 $('loading').hidden=false;$('retry').hidden=true;reset();
 $('sceneImage').src=assets+file;
 if($('sceneImage').complete&&$('sceneImage').naturalWidth)loaded();
 closeSidebar();
}
function loaded(){$('loading').hidden=true;resize();}
function resize(){const img=$('sceneImage'),v=$('viewport');if(!img.naturalWidth)return;const scale=Math.min(v.clientWidth/img.naturalWidth,v.clientHeight/img.naturalHeight);fit={w:img.naturalWidth*scale,h:img.naturalHeight*scale};$('imagePlane').style.width=fit.w+'px';$('imagePlane').style.height=fit.h+'px';transform();}
function transform(){const v=$('viewport');const mx=Math.max(0,(fit.w*zoom-v.clientWidth)/2),my=Math.max(0,(fit.h*zoom-v.clientHeight)/2);pan.x=Math.max(-mx,Math.min(mx,pan.x));pan.y=Math.max(-my,Math.min(my,pan.y));$('imagePlane').style.transform=`translate(${pan.x}px,${pan.y}px) scale(${zoom})`;$('zoomValue').textContent=Math.round(zoom*100)+'%';$('zoomOut').disabled=zoom<=1;$('zoomIn').disabled=zoom>=5;}
function setZoom(value){zoom=Math.max(1,Math.min(5,value));transform();}
function reset(){zoom=1;pan={x:0,y:0};transform();}
function closeSidebar(){$('sidebar').classList.remove('open');$('scrim').hidden=true;}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,2700);}
placeButtons();
document.addEventListener('click',e=>{const point=e.target.closest('[data-point]');if(point){go(Number(point.dataset.point));return;}const tab=e.target.closest('button[data-mode]');if(tab)go(current,tab.dataset.mode);});
$('sceneImage').addEventListener('load',loaded);
$('sceneImage').addEventListener('error',()=>{$('loading').hidden=true;$('retry').hidden=false;});
$('retry').onclick=()=>go(current,mode,false);
$('zoomIn').onclick=()=>setZoom(zoom+.35);$('zoomOut').onclick=()=>setZoom(zoom-.35);$('resetZoom').onclick=reset;
$('viewport').addEventListener('wheel',e=>{e.preventDefault();setZoom(zoom+(e.deltaY<0?.2:-.2));},{passive:false});
const pointers=new Map();let drag=null,pinch=null;
function distance(){const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
$('viewport').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;$('viewport').setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){pinch={distance:distance(),zoom};drag=null;}else drag={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};});
$('viewport').addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&pinch){setZoom(pinch.zoom*distance()/Math.max(1,pinch.distance));}else if(drag){pan={x:drag.px+e.clientX-drag.x,y:drag.py+e.clientY-drag.y};transform();}});
function endPointer(e){pointers.delete(e.pointerId);drag=null;pinch=null;}
$('viewport').addEventListener('pointerup',endPointer);$('viewport').addEventListener('pointercancel',endPointer);
$('viewport').addEventListener('dblclick',e=>{if(!e.target.closest('button'))zoom>1?reset():setZoom(2);});
$('expandMap').onclick=()=>go(current,'plan');
$('openSidebar').onclick=()=>{$('sidebar').classList.add('open');$('scrim').hidden=false;};
$('closeSidebar').onclick=closeSidebar;$('scrim').onclick=closeSidebar;
$('search').oninput=e=>{const query=e.target.value.trim().toLowerCase();let shown=0;for(const p of points){const el=$('places').querySelector(`[data-point="${p.id}"]`);el.hidden=!(p.title+' '+p.sub).toLowerCase().includes(query);if(!el.hidden)shown++;}$('count').textContent=shown+'개 지점';$('empty').hidden=shown>0;};
$('infoButton').onclick=()=>$('info').showModal();$('closeInfo').onclick=()=>$('info').close();
$('info').addEventListener('click',e=>{if(e.target===$('info')){const r=$('info').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('info').close();}});
const step=delta=>go((current-1+delta+points.length)%points.length+1);
$('previous').onclick=()=>step(-1);$('next').onclick=()=>step(1);
$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);toast('현재 위치 링크를 복사했습니다.');}catch{toast('주소창의 링크를 복사해 주세요.');}};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('이 브라우저에서는 전체 화면을 지원하지 않습니다.');}};
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea')||$('info').open)return;if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(zoom+.35);}if(e.key==='-'){e.preventDefault();setZoom(zoom-.35);}if(e.key==='0')reset();if(e.key==='Escape')closeSidebar();if(e.key==='/'){e.preventDefault();$('sidebar').classList.add('open');if(innerWidth<=900)$('scrim').hidden=false;$('search').focus();}});
new ResizeObserver(resize).observe($('viewport'));
window.addEventListener('popstate',()=>{const s=urlState();go(s.id,s.mode,false);});
window.addEventListener('hashchange',()=>{const s=urlState();if(s.id!==current||s.mode!==mode)go(s.id,s.mode,false);});
const initial=urlState();go(initial.id,initial.mode,false);
