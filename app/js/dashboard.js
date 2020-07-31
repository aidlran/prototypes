function loadWorkspace(listElement, workspaceID) {
	// AJAX request
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				
			}
		}
	};
	xhttp.open("POST", "php/loadWorkspace.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("id=" + workspaceID);

	// Grab content div ref as it's used more than once
	let contentContainer = document.getElementById("content");

	// Remove active workspace classes from list in sidebar
	let workspaceList = document.getElementsByClassName("sidebar-ws-list-entry");
	for (let i=0; i<workspaceList.length; i++)
		workspaceList[i].classList.remove("active-workspace");

	// Completely clear content section
	contentContainer.innerHTML = "";
	// Add a "tab switcher"
	let contentTabContainer = document.createElement("div");
	contentTabContainer.id = "content-tab-container";
	contentContainer.appendChild(contentTabContainer);

	// Add main content area div
	let contentMainContainer = document.createElement("div");
	contentMainContainer.id = "content-main-container";
	contentContainer.appendChild(contentMainContainer);

	/* TAB SWITCHER
	   ============ */
	function appendContentTab(label, idAttribute, funct) {
		let newTab = document.createElement("span");
		newTab.id = idAttribute;
		newTab.classList.add("content-tab");
		newTab.appendChild(document.createTextNode(label));
		newTab.onclick = funct;
		contentTabContainer.appendChild(newTab);
		return newTab;
	}
	function clearActiveTab() {
		let activeTabArray = document.getElementsByClassName("content-tab");
		for (let i=0; i<activeTabArray.length; i++)
			activeTabArray[i].classList.remove("active-tab");
	}
	// DATA TAB
	function loadDataTab() {
		clearActiveTab();
		document.getElementById("data-tab-select").classList.add("active-tab");
		document.getElementById("content-main-container").innerHTML = "[DATA]";
	}
	let contentTabData = appendContentTab("Data", "data-tab-select", loadDataTab);
	// OPTIONS TAB
	function loadOptionsTab() {
		clearActiveTab();
		this.classList.add("active-tab");
		let contentContainer = document.getElementById("content-main-container"),
			optionsContainer = document.createElement("div");
		optionsContainer.id = "options-container";
		contentContainer.innerHTML = "";
		contentContainer.appendChild(optionsContainer);
		optionsContainer.appendChild(createWorkspaceRenameForm(workspaceID));
		optionsContainer.appendChild(createWorkspaceDeleteForm(workspaceID));
	}
	let contentTabOptions = appendContentTab("Options", "options-tab-select", loadOptionsTab);

	// Make data tab active by default
	contentTabData.classList.add("active-tab");
	loadDataTab();

	// Add active workspace class to element that was clicked
	listElement.classList.add("active-workspace");
}