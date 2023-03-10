/*  =============
	NEW WORKSPACE
	============= */
class NewWorkspaceForm {
	static open() {
		// Create elements
			newWorkspaceFormElement = createOverlayElement("Pick a name for your workspace:", null);
			newWorkspaceFormAlert = document.createElement('div');
			newWorkspaceFormInputContainer = document.createElement("div");
			newWorkspaceFormInput = document.createElement("input");
			newWorkspaceFormCharCountContainer = document.createElement("div");
			newWorkspaceFormCharCount = document.createElement("span");
			newWorkspaceFormcharCountLimit = document.createElement("span");
			newWorkspaceFormBtn = document.createElement("button");

		// Set attributes
		newWorkspaceFormAlert.id = "new-ws-form-alert";
		newWorkspaceFormInputContainer.id = "new-ws-form-input-container";
		newWorkspaceFormInput.id = "new-ws-form-input";
		newWorkspaceFormInput.type = "text";
		newWorkspaceFormInput.size = "30";
		newWorkspaceFormCharCountContainer.id = "new-ws-form-count-container";
		newWorkspaceFormCharCount.id = "new-ws-form-count";
		newWorkspaceFormBtn.classList.add("green-btn");
		newWorkspaceFormBtn.id = "new-ws-form-btn";

		// Append text
		newWorkspaceFormAlert.appendChild(document.createTextNode(" "));
		newWorkspaceFormCharCount.appendChild(document.createTextNode("0"));
		newWorkspaceFormcharCountLimit.appendChild(document.createTextNode("/40"));
		newWorkspaceFormBtn.appendChild(document.createTextNode("Create"));

		// Append elements
		newWorkspaceFormElement.appendChild(newWorkspaceFormAlert);
		newWorkspaceFormElement.appendChild(newWorkspaceFormInputContainer);
		newWorkspaceFormInputContainer.appendChild(newWorkspaceFormInput);
		newWorkspaceFormInputContainer.appendChild(newWorkspaceFormCharCountContainer);
		newWorkspaceFormCharCountContainer.appendChild(newWorkspaceFormCharCount);
		newWorkspaceFormCharCountContainer.appendChild(newWorkspaceFormcharCountLimit);
		newWorkspaceFormInputContainer.appendChild(newWorkspaceFormBtn);

		// Events
		newWorkspaceFormBtn.onclick = NewWorkspaceForm.submit;

		newWorkspaceFormInput.oninput = function() {

			// Validate and return result object
			let validated = Workspace.validateName(newWorkspaceFormInput.value);

			// Update char counter
			newWorkspaceFormCharCount.removeChild(newWorkspaceFormCharCount.firstChild);
			newWorkspaceFormCharCount.appendChild(document.createTextNode(validated.outputString.length));

			// Red if neccessary
			switch(validated.errorCode) {
				case 100:
				case 101: {
					newWorkspaceFormInput.style.borderColor = newWorkspaceFormCharCount.style.color = "indianred";
					break;
				}
				default: {
					newWorkspaceFormInput.style.borderColor = newWorkspaceFormCharCount.style.color = "";
					break;
				}
			}
		}

		newWorkspaceFormInput.onkeydown = function(event) {
			switch (event.keyCode) {
				case 13: {
					NewWorkspaceForm.submit();
					break;
				}
			}
		}

		newWorkspaceFormInput.focus();
	}
	static close() {
		console.log("this");
		// Delete form elements
		document.body.removeChild(document.getElementById("overlay"));
		document.body.removeChild(document.getElementById("overlay"));

		// Restore functionality to 'new workspace' button
		document.getElementById("new-ws-btn").onclick = NewWorkspaceForm.open();
	}
	static submit() {
		// Disable button, indicate loading
		formSubmitDisabled = true;
		newWorkspaceFormBtn.onclick = null;
		newWorkspaceFormBtn.style.display = "none";

		// Indicate loading
		let formLoadAnim = createLoadingSpinner();
		newWorkspaceFormInputContainer.appendChild(formLoadAnim);

		// Clear alert
		newWorkspaceFormAlert.removeChild(newWorkspaceFormAlert.firstChild);
		newWorkspaceFormAlert.appendChild(document.createTextNode(" "));

		// If request fails
		function displayError(displayedError) {
			newWorkspaceFormAlert.removeChild(newWorkspaceFormAlert.firstChild);
			newWorkspaceFormAlert.appendChild(document.createTextNode(displayedError));
			try {newWorkspaceFormInputContainer.removeChild(formLoadAnim);} catch(err) {}
			formSubmitDisabled = false;
			newWorkspaceFormBtn.onclick = NewWorkspaceForm.submit;
			newWorkspaceFormBtn.style.display = "block";
			newWorkspaceFormInput.focus();
		}

		// Validate
		let validated = Workspace.validateName(newWorkspaceFormInput.value);
		switch (validated.errorCode) {
			default:
			case 0: {
				displayError("Something went wrong.");
				break;
			}
			case 100: {
				displayError("Name cannot be blank.");
				break;
			}
			case 101: {
				displayError("Name is too long.");
				break;
			}
			case 102: {
				displayError("Name cannot contain apostrophes/quotation marks.");
				break;
			}
			case 200: {
				displayError("You are not logged in.");
				window.reload();
				break;
			}
			case 1: {
				// AJAX request
				let xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {
							switch (JSON.parse(this.responseText)[0]) {
								case 0: {
									displayError("The server is experiencing issues.");
									break;
								}
								case 101: {
									displayError("You have a workspace with this name already.");
									break;
								}
								case 102: {
									displayError("Invalid name length.");
									break;
								}
								case 999: {
									displayError("Unknown error.");
									break;
								}
								default: { // Success
									NewWorkspaceForm.close();
									NewWorkspaceForm.close();
									Sidebar.workspaceListAdd(validated.outputString, true);
									return;
								}
							}
						} else {displayError("The server is experiencing issues.");}
					}
				};
				xhttp.open("POST", "php/newWorkspace.php", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send("s=" + encodeURIComponent(validated.outputString));
				break;
			}
		}
	}
}

// VARIABLES
var newWorkspaceFormElement,
	newWorkspaceFormAlert,
	newWorkspaceFormInputContainer,
	newWorkspaceFormInput,
	newWorkspaceFormCharCountContainer,
	newWorkspaceFormCharCount,
	newWorkspaceFormcharCountLimit,
	newWorkspaceFormBtn,

	newWorkspaceFormInputTrimmed = "",
	newWorkspaceFormInputTrimmedLength = 0,

	formSubmitDisabled = false;

// ON LOAD
document.getElementById("new-ws-btn").onclick = NewWorkspaceForm.open;



var workspaceRenameFormContainer,
	workspaceRenameFormInputContainer,
	workspaceRenameFormLabel,
	workspaceRenameFormInput,
	workspaceRenameFormBtn,
	workspaceRenameFormAlert;

function createWorkspaceRenameForm(workspaceID) {

	workspaceRenameFormContainer = document.createElement("div");
	workspaceRenameFormInputContainer = document.createElement("div");
	workspaceRenameFormLabel = document.createElement("span");
	workspaceRenameFormInput = document.createElement("input");
	workspaceRenameFormBtn = document.createElement("button");
	workspaceRenameFormAlert = document.createElement("div");

	workspaceRenameFormAlert.classList.add("form-alert");

	workspaceRenameFormLabel.appendChild(document.createTextNode("Rename workspace:"));
	workspaceRenameFormBtn.appendChild(document.createTextNode("Apply"));

	workspaceRenameFormContainer.appendChild(workspaceRenameFormInputContainer);
	workspaceRenameFormInputContainer.appendChild(workspaceRenameFormLabel);
	workspaceRenameFormInputContainer.appendChild(workspaceRenameFormInput);
	workspaceRenameFormInputContainer.appendChild(workspaceRenameFormBtn);
	workspaceRenameFormContainer.appendChild(workspaceRenameFormAlert);

	workspaceRenameFormBtn.onclick = function() {
		sendWorkspaceRenameForm(workspaceID);
	};

	return workspaceRenameFormContainer;
}
function sendWorkspaceRenameForm(workspaceName) {

	// Disable button, indicate loading
	formSubmitDisabled = true;
	workspaceRenameFormBtn.onclick = null;
	workspaceRenameFormBtn.style.display = "none";

	// Indicate loading
	let formLoadAnim = createLoadingSpinner();
	workspaceRenameFormInputContainer.appendChild(formLoadAnim);

	// Clear alert
	try {workspaceRenameFormAlert.removeChild(workspaceRenameFormAlert.firstChild);} catch{}
	workspaceRenameFormAlert.appendChild(document.createTextNode(" "));

	// If request fails
	function displayError(displayedError) {
		workspaceRenameFormAlert.removeChild(workspaceRenameFormAlert.firstChild);
		workspaceRenameFormAlert.appendChild(document.createTextNode(displayedError));
		try {workspaceRenameFormInputContainer.removeChild(formLoadAnim);} catch(err) {}
		formSubmitDisabled = false;
		workspaceRenameFormBtn.style.display = "inline-block";
		workspaceRenameFormBtn.onclick = function() {
			sendWorkspaceRenameForm(workspaceID);
		};
		workspaceRenameFormInput.focus();
	}

	// Validate
	let validated = Workspace.validateName(workspaceRenameFormInput.value);
	switch (validated.errorCode) {
		default:
		case 0: {
			displayError("Something went wrong.");
			break;
		}
		case 100: {
			displayError("Name cannot be blank.");
			break;
		}
		case 101: {
			displayError("Name is too long.");
			break;
		}
		case 102: {
			displayError("Name cannot contain apostrophes/quotation marks.");
			break;
		}
		case 1: {
			// AJAX request
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {
						switch (JSON.parse(this.responseText)[0]) {
							case 0: {
								displayError("The server is experiencing issues.");
								break;
							}
							case 101: {
								displayError("You have a workspace with this name already.");
								break;
							}
							case 102: {
								displayError("Invalid name length.");
								break;
							}
							case 999: {
								displayError("Unknown error.");
								break;
							}
							default: { // Success
								displayError("");
								Sidebar.refreshWorkspaceList();
								return;
							}
						}
					} else {displayError("The server is experiencing issues.");}
				}
			};
			xhttp.open("POST", "php/renameWorkspace.php", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("s=" + encodeURIComponent(validated.outputString) + "&s=" + workspaceID);
			break;
		}
	}
}
function createWorkspaceDeleteForm(workspaceName) {

	let workspaceDeleteFormContainer = document.createElement("div"),
		workspaceDeleteFormLabel = document.createElement("span"),
		workspaceDeleteFormButton = document.createElement("button");

	workspaceDeleteFormButton.classList.add("red-btn");

	workspaceDeleteFormLabel.appendChild(document.createTextNode("Delete workspace:"));
	workspaceDeleteFormButton.appendChild(document.createTextNode("Delete"));

	workspaceDeleteFormContainer.appendChild(workspaceDeleteFormLabel);
	workspaceDeleteFormContainer.appendChild(workspaceDeleteFormButton);

	workspaceDeleteFormButton.onclick = function() {
		let confirmBtn = document.createElement("button");
		confirmBtn.classList.add("red-btn");
		confirmBtn.appendChild(document.createTextNode("Confirm"));
		confirmBtn.onclick = function() {
			// AJAX request
			let xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {
						switch (this.responseText) {
																		// TODO: add error messages
							case "0": { // database error
								break;
							}
							case "1": {
								closeOverlay();
								Sidebar.workspaceListRefresh();
								document.getElementById("content").innerHTML = "";
								break;
							}
							case "999":
							default: { // unknown error
								return;
							}
						}
					} // else {The server is experiencing issues]
				}
			};
			xhttp.open("POST", "php/deleteWorkspace.php", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("s=" + workspaceName);
		}
		createOverlayElement("Do you really want to delete this workspace?", confirmBtn)
	}

	return workspaceDeleteFormContainer;
}