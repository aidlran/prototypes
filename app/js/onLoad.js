/*  onLoad.js || Runs when dashboard is finished loading

	-> Loads an array of scripts and tracks progress
	-> Removes <noscript> elements from DOM
	-> Unhides elements that need JS					*/

/*  =========
	VARIABLES
	========= */
const scriptsArray = [
						"js/usefulStuff.js",
						"js/sidebar.js",
						"js/forms.js",
						"js/workspace.js",
						"js/dashboard.js"
];
var scriptsLoaded = 0;

/*  =========
	FUNCTIONS
	========= */
function areScriptsLoaded() {
	return scriptsLoaded < scriptsArray.length ? false : true;
}

/*  =====================
	ON PAGE LOAD FUNCTION
	===================== */
window.onload = function() {
	// Load scripts
	for (let i=0; i<scriptsArray.length; i++) {
		let script = document.createElement('script');
		script.onload = function() {
			scriptsLoaded++;
		}
		script.src = scriptsArray[i];
		script.setAttribute('type', 'text/javascript');
		document.head.appendChild(script);
	}

	// Remove <noscript> elements from DOM
	let noScriptArray = document.getElementsByTagName('noscript');
	for (let i=0; i<noScriptArray.length; i++)
		noScriptArray[i].parentElement.removeChild(noScriptArray[i]);

	// Display dashboard
	document.getElementById('dashboard').style.display = "flex";
};