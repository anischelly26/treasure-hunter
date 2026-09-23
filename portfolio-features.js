// Portfolio features are independent of the optional WebGL scene.
import './rag-bootstrap.js';
import './treasure-project.js?v=20260923-thumbnails';
import './project-demos.js?v=20260923-padel-app';
import './treasure-browser.js';
const count=document.querySelector('.core-metrics b');
if(count) count.textContent=String(document.querySelectorAll('.mission-grid .mission').length).padStart(2,'0');
