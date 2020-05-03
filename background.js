Number.prototype.pad = function (size) {
	var s = String(this);
	while (s.length < (size || 2)) {
		s = "0" + s;
	}
	return s;
}

function get_time() {
	//return moment().format("MM:DD:YYYY, hh:mm:ss A");
	let today = new Date();
	let date_string = `${(today.getMonth() + 1).pad()}/${today.getDate().pad()}/${today.getFullYear().pad(4)}, ${today.getHours() % 12}:${today.getMinutes().pad()}:${today.getSeconds().pad()} ${today.getHours() > 12 ? "PM" : "AM"}`

	return date_string
}

let newtab_url = "chrome://newtab/"

chrome.browserAction.onClicked.addListener(function (tab) {
	//console.log("clicked")
	let query_info = {
		"currentWindow": true
	}
	let tab_info = {
		"index": 0,
		"url": "index.html"
	}
	chrome.tabs.create(tab_info)
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (selected) {
		let main_url = (selected[0].url || selected[0].pendingUrl);
		chrome.tabs.query(query_info, (tabs) => {
			let session = []
			for (let i = 1; i < tabs.length; i++) {
				if (!tabs[i].pinned) {
					try {
						if (!(tabs[i].url == main_url || tabs[i].url == newtab_url)) {
							session.push(tabs[i])
						}
						chrome.tabs.remove(tabs[i].id)
						console.log(`removed ${tabs[i].url} with id ${tabs[i].id}`)
					} catch {
						console.log("could not remove " + tabs[i].url)
					}
				}
			}

			session = [session, get_time(), '', `${session.length} tab${session.length != 1 ? "s" : ""}`]

			chrome.storage.local.get({
				'key': []
			}, function (result) {
				let sessions = result.key
				if (!Array.isArray(sessions)) {
					sessions = []
				}

				sessions.push(session)
				//console.log(session)
				chrome.storage.local.set({
					'key': sessions
				});
			});

		})
	});
});

//open taba when opening chrome

// chrome.windows.onCreated.addListener(function (window) {
// 	let tab_info = {
// 		"url": "index.html",
// 		"index": 0
		
// 	}
// 	chrome.tabs.create(tab_info)
// 	chrome.tabs.query({currentWindow: true}, function(tabs) {
// 		chrome.tabs.update(tabs[0].id, {
// 			selected: true
// 		})
// 	});
// });