class Workspace {
	static validateName(inputString) {

		var outputObject = new Object();
		outputObject.success = false;
		outputObject.errorCode = 0;
		outputObject.outputString = inputString.replace(/\s+/g, ' ').trim();

		function validateNameChars() {
			let notAllowed = ["'", '"', "`"];
			for (let i=0; i<notAllowed.length; i++) {
				if (outputObject.outputString.includes(notAllowed[i]))
					return true;
			}
			return false;
		}

		if (outputObject.outputString.length <= 0)
			outputObject.errorCode = 100; // empty string
		else if (outputObject.outputString.length > 40)
			outputObject.errorCode = 101; // string too long
		else if (validateNameChars())
			outputObject.errorCode = 102; // contains quotation
		else {
			outputObject.success = true;
			outputObject.errorCode = 1;
		}

		return outputObject;
	}
}