/*  sidebar.js

	-> Controls the sidebar	*/

class Sidebar {
	constructor() {
	}
	static show() {
		// Show sidebar & hide button on header
		sidebarElement.style.display = 'flex';
		sidebarShowBtn.style.display = 'none';
	}
	static hide() {
		// Hide sidebar & show button on header
		sidebarElement.style.display = 'none';
		sidebarShowBtn.style.display = 'block';
	}
	static workspaceListRefresh() {
		// Wait until scripts are done loading, else it could fail
		if (!areScriptsLoaded()) {
			setTimeout(Sidebar.workspaceListRefresh, 50);
			return;
		}

		// Clear list and show loading icon
		sidebarWorkspaceList.innerHTML = "";
		sidebarWorkspaceList.appendChild(createLoadingSpinner());

		// AJAX request
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					sidebarWorkspaceList.innerHTML = "";
					let response = JSON.parse(this.responseText);
					switch (this.responseText) {
						case "0": {
							sidebarWorkspaceList.appendChild(document.createTextNode("Something went wrong."));
							break;
						}
						default: {
							for (let i=0; i<response.length; i++)
								Sidebar.workspaceListAdd(response[i][1], false);
							break;
						}
					}
				}
				else sidebarWorkspaceList.appendChild(document.createTextNode("Something went wrong."));
			}
		};
		xhttp.open('GET', 'php/getWorkspaceList.php', true);
		xhttp.send();
	}
	static workspaceListAdd(workspaceName, autoload) {
		let entryContainer = document.createElement('div'),
			entryIcon = document.createElement('span'),
			entryName = document.createElement('span');

		// Add attributes
		entryContainer.classList.add('sidebar-ws-list-entry');
		entryContainer.title = workspaceName;
		entryIcon.classList.add('sidebar-ws-list-icon');
		entryName.classList.add('sidebar-ws-list-name');

		// Add text
		entryIcon.appendChild(document.createTextNode(workspaceName.substr(0, 1).toUpperCase()));
		entryName.appendChild(document.createTextNode(workspaceName));

		// Append
		entryContainer.appendChild(entryIcon);
		entryContainer.appendChild(entryName);
		sidebarWorkspaceList.appendChild(entryContainer);

		// Event listener
		entryContainer.onclick = function() {
			loadWorkspace(this, workspaceName);
		};

		if (autoload)
			loadWorkspace(entryContainer, workspaceName);
	}
}

/*  =========
	VARIABLES
	========= */
const showSidebarOnLoad = true,

	  sidebarElement = document.getElementById('sidebar'),
	  sidebarShowBtn = document.getElementById('sidebar-btn'),
	  sidebarHideBtn = document.getElementById('sidebar-hide-btn'),
	  sidebarWorkspaceList = document.getElementById('sidebar-ws-list');

/*  =======
	ON LOAD
	======= */
// Show or hide the sidebar by default
showSidebarOnLoad ? Sidebar.show() : Sidebar.hide();

// Event listeners for sidebar show/hide buttons
sidebarShowBtn.onclick = Sidebar.show;
sidebarHideBtn.onclick = Sidebar.hide;

// Populate sidebar
Sidebar.workspaceListRefresh();