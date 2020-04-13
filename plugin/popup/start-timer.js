document.addEventListener("click", (e) => {

	function startTimer(tabs) {
		browser.tabs.executeScript({file: "/content_scripts/timebox-timer.js"})
			.then(() => {
				let tb = document.getElementById("timebox-input").value;
				browser.tabs.sendMessage(tabs[0].id, {
					command: "start-timer",
					timebox: tb
			});
		});
	}

	function reportError(error) {
		console.error("Could not start timer: " + error);
	}
	
	if (e.target.id === "start-button") {
		browser.tabs.query({active: true, currentWindow: true})
			.then(startTimer)
			.catch(reportError);
	}
});
