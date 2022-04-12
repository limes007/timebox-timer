let tb_config = {
	'timebox': 15,
};

browser.storage.local.get()
.then((config) => {
	tb_config = {...tb_config, ...config};
	document.getElementById("timebox-input").value = tb_config.timebox;
});

document.addEventListener("click", (e) => {

	function startTimerAndClosePopup(tabs) {
		browser.tabs.executeScript({file: "/content_scripts/timebox-timer.js"})
			.then(() => {
				tb_config.timebox = document.getElementById("timebox-input").value;
				browser.storage.local.set(tb_config);

				browser.tabs.sendMessage(tabs[0].id, {
					command: "start-timer",
					timebox: tb_config.timebox
				})
				.then(() => {
					window.close();
				});
			});
	}

	function reportError(error) {
		console.error("Could not start timer: " + error);
	}

	if (e.target.id === "start-button") {
		browser.tabs.query({active: true, currentWindow: true})
			.then(startTimerAndClosePopup)
			.catch(reportError);
	}
});
