// Portfolio features are independent of the optional WebGL scene.
import './rag-bootstrap.js';
import './treasure-project.js?v=20260923-rank';
import './project-demos.js?v=20260921';
import './treasure-browser.js';
const count=document.querySelector('.core-metrics b');
if(count) count.textContent=String(document.querySelectorAll('.mission-grid .mission').length).padStart(2,'0');
