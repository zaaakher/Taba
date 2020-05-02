//Check if main is duplicated
chrome.tabs.query({
	active: true,
	currentWindow: true
}, function (selected) {
	let main_url = (selected[0].url || selected[0].pendingUrl);
	let main_id = selected[0].id;
	chrome.tabs.query({
		currentWindow: true
	}, function (tabs) {
		let duplicates = 0;
		for (let i = 0; i < tabs.length; i++) {
			console.log(tabs[i].url)
			if (tabs[i].url == main_url) {
				duplicates += 1;
			}
		}
		if (duplicates > 1) {
			chrome.tabs.remove(main_id)
		}
	});
});

let container = document.getElementById("container");
let default_icon = "https://www.google.com/s2/favicons?domain=google.com"
let header = document.getElementById('header')

function refresh() {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.update(tabs[0].id, {
			url: tabs[0].url
		});
	});
}

function create_link(tab, session, alt) {
	let link_main = document.createElement("div");
	link_main.classList.add("link-main");

	session.appendChild(link_main);

	//   session.insertBefore(link_main, session.firstChild);
	//session.children[1].insertAdjacentElement("afterBegin", link_main);

	session = link_main;

	let link_base = document.createElement("div");

	let link = document.createElement("p");
	let remove_button = document.createElement("p");
	let icon = document.createElement("img");
	icon.className = "icon";

	//console.log(`source url: ${(tab.favIconUrl || default_icon)}`)
	icon.setAttribute("src", (tab.favIconUrl || default_icon));
	session.appendChild(remove_button);
	session.appendChild(icon);
	link_base.appendChild(link);
	link_base.classList.add("link-base");

	link.className = "link";
	link.setAttribute("alt", tab.id);
	link.textContent = tab.title || tab.url || tab.pendingUrl;
	//link.textContent = tab;
	//console.log(`look for title: ${tab.pendingTitle}`)

	//X Button
	remove_button.textContent = "X";
	remove_button.style.opacity = "0%";
	remove_button.classList.add("remove-button");
	remove_button.addEventListener("click", function () {
		console.log(`clearing ${tab.url}`);
		chrome.storage.local.get({
			key: []
		}, function (result) {
			let sessions = result.key;
			if (!Array.isArray(sessions)) {
				sessions = [];
			}
			let indices = alt.split(" ");
			let session_index = parseInt(indices[0]);
			let url_index = parseInt(indices[1]);
			sessions[session_index][0].splice(url_index, 1);
			link_base.parentNode.removeChild(link_base);
			remove_button.parentNode.removeChild(remove_button);
			chrome.storage.local.set({
				key: sessions
			});
		});
		refresh();
		let session_divs = document.getElementsByClassName("session");
		for (let z = 0; z < session_divs.length; z++) {
			if (session_divs[z].children.length < 1) {
				session_divs[z].parentNode.removeChild(session_divs[z]);
				//session_divs[z].remove()
			}
		}
		refresh();
	});

	link_base.addEventListener("click", function () {
		console.log("clicked on session link");
		//acquire id
		chrome.tabs.getSelected(null, function (selected) {
			//console.log(`selected tab url: ${selected.url}`);
			//create tab
			chrome.tabs.create({
				url: tab.url,
				index: 1
			});
			//remain focused
			chrome.tabs.update(selected.id, {
				selected: true
			});
		});

		//remove url from storage
		let storage_data = alt.split(" ");
		let session_index = parseInt(storage_data[0]);
		let url_index = parseInt(storage_data[1]);
		chrome.storage.local.get({
			key: []
		}, function (result) {
			let sessions = result.key;
			if (!Array.isArray(sessions)) {
				sessions = [];
			}

			sessions[session_index][0].splice(url_index, 1);
			chrome.storage.local.set({
				key: sessions
			});
		});
		refresh();
	});
	link_main.addEventListener("mouseover", function () {
		//console.log("started hovering over main");
		//remove_button.setAttribute('disabled', false);
		// remove_button.style.display = "block";
		remove_button.style.opacity = "100%";
	});
	link_main.addEventListener("mouseout", function () {
		//console.log("stopped hovering over base");
		//remove_button.setAttribute('disabled', false);
		// remove_button.style.display = "none";
		remove_button.style.opacity = "0%";
	});
	session.appendChild(link_base);
}
//Getting the data from local storage
chrome.storage.local.get({
	key: []
}, function (result) {
	let sessions = result.key;
	for (let x = 0; x < sessions.length; x++) {
		console.log(`sessions: ${sessions[x]}`)
		let session = sessions[x][0].filter(function (element) {
			return element != null;
		});
		let time = sessions[x][1];
		let session_sname = sessions[x][2];
		let session_length = sessions[x][3];

		//if session ?
		if (session.length > 0) {
			//Create session elements
			let session_div = document.createElement("div");
			let session_header = document.createElement("div");
			let session_links = document.createElement("p");
			let session_date = document.createElement("p");
			let session_restore = document.createElement("p");
			let session_delete = document.createElement("p");
			let session_name = document.createElement("input");
			//let session_rename = document.createElement("p");

			//Give classname to elements
			session_div.className = "session";
			session_header.className = "session-header";
			session_links.className = "session-links";
			session_date.className = "session-date";
			session_restore.className = "session-restore";
			session_delete.className = "session-delete";
			session_name.className = "session-name";


			session_date.textContent = `Created ${time}`;
			session_restore.textContent = "Restore All";
			session_delete.textContent = "Delete All"
			session_links.textContent = session_length;
			//session_name.textContent = "Rename";

			session_name.value = session_sname;
			session_name.type = 'text';
			session_name.style.width = session_name.value.length + "ch";
			//session_links.disabled = true;
			//session_links.setAttribute('onkeypress', "this.style.width = ((this.value.length + 1) * 8) + 'px';");

			session_header.appendChild(session_name);
			session_header.appendChild(session_links);
			session_header.appendChild(session_date);
			session_header.appendChild(session_restore);
			session_header.appendChild(session_delete);
			// session_div.addEventListener('click', function (event) {
			// 	console.log("clicked on current session");
			// 	let clicked = event.target
			// 	if (clicked.className == "link") {
			// 		console.log("clicked on session link");
			// 		//acquire id
			// 		chrome.tabs.getSelected(null, function (selected) {
			// 			sessions[x][0].map(function (element) {
			// 				if (element.id == parseInt(clicked.getAttribute('alt'))) {
			// 					//create tab
			// 					chrome.tabs.create({
			// 						url: element.url,
			// 					});
			// 					//remain focused
			// 					chrome.tabs.update(selected.id, {
			// 						selected: true
			// 					});
			// 				}
			// 			});

			// 		});


			// 		//remove url from storage
			// 		sessions[x][0].map(function (element, index) {
			// 			if (element.id == parseInt(clicked.getAttribute('alt'))) {
			// 				sessions[x][0].splice(index, 1);
			// 			}
			// 		});
			// 		//sessions[x][0].splice(storage_link, 1);
			// 		chrome.storage.local.set({
			// 			key: sessions
			// 		})
			// 		//remove base
			// 		refresh();
			// 		//instead of refreshing, try getting the link elements link-main and destroying that [sessions dont delete when this is on]
			// 	}
			// 	console.log(event.target.className);
			// });

			// session_rename.addEventListener('click', function() {
			// 	session_links.disabled = "false"
			// 	session_links.focus();
			// });

			session_links.addEventListener('click', function() {
				session_name.focus();
				if(session_name.value.length < 1)
				{
					session_name.style.width = "1ch";
				}					
			})

			session_restore.addEventListener('click', function () {
				chrome.tabs.getSelected(null, function (selected) {
					//restore tabs		
					for (let i = 0; i < session.length; i++) {
						let url = session[i].url;
						chrome.tabs.create({
							"url": url
						});
					}

					//remain focused
					chrome.tabs.update(selected.id, {
						selected: true
					});
				});

				//remove from storage
				sessions.splice(x, 1);
				chrome.storage.local.set({
					key: sessions
				});
				refresh()
			});

			session_delete.addEventListener('click', function () {
				//remove from storage
				sessions.splice(x, 1);
				chrome.storage.local.set({
					key: sessions
				});
				refresh()
			});

			session_name.addEventListener('input', function() {
				session_name.style.width = session_name.value.length + "ch";
			})

			session_name.addEventListener('focusout', function () {
				console.log("stopped focusing")
				if(session_name.value.length < 1)
				{
					session_name.style.width = '0ch';
				}
				sessions[x][2] = session_name.value
				chrome.storage.local.set({
					key: sessions
				});
			})

			session_name.addEventListener('keyup', function (key) {
				if (key.code == "Enter") {					
					session_name.blur();
				}
			});


			session_div.setAttribute("alt", x);
			session_div.appendChild(session_header);

			container.insertBefore(session_div, container.firstChild);

			for (let y = 0; y < session.length; y++) {
				if (!(session[y] === "")) {
					let alt = `${x} ${y}`;
					create_link(session[y], session_div, alt);
				}
			}
		} else {
			sessions.splice(x, 1);
			chrome.storage.local.set({
				key: sessions
			});
		}
	}
});
