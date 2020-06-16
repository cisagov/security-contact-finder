function search(term, showAll = false) {
	let lower = term.toLowerCase()
	let contactMatches = []
	let noContactMatches = []
	let max = 100
	for (program of allPrograms) {
		if (!showAll && contactMatches.length >= max) {
			break
		}
		if (program.name_l.includes(lower) || (program.website_l && program.website_l.includes(lower))) {
			if (program.has_security_txt || program["Security Contact Email"] != "(blank)")
				contactMatches.push(program)
			else
				noContactMatches.push(program)
		}
	}

	let matches = contactMatches.concat(noContactMatches)

	let rep = escapeHtml(term);
	let html = `<p>No results found for "${rep}". Consider contacting US-CERT at <a href="https://www.us-cert.gov/report">this link</a> in order to report the vulnerability.</p>`

	if (matches.length > 0) {
		html = matches.map(program => {
			let programType = program.has_security_txt ? "Vulnerability Disclosure Policy" :
				"Security Contact Email"
			let submissionLink = program.policy_link
			let contact = program["contact"] ? program["contact"] : program["Security Contact Email"]
			let contactLink = program["contact"] ? contact : "mailto:" + contact
			if (programType == "Security Contact Email") {
				submissionLink = "mailto:" + program["Security Contact Email"]
			}

			if (program["Security Contact Email"] == "(blank)") {
				return `<div><h3>${program["Organization"]}</h3><p>${program["Domain"]}</p><p>No known security contact.</p></div>`
			}

			return `<div>
				<h3>${program["Organization"]}</h3><p>${program["Domain"]}</p><p>Type: ${programType}</p>`
				+ (program.policy_link ? `<p>Policy url: <a href="${program.policy_link}">${program.policy_link}</a></p>`
				: `<p>Contact: <a href="${contactLink}">${contact}</a></p>`)
				+ `<a href="${submissionLink}"><button onclick="window.location = '${submissionLink}'">Submit a Vulnerability</button></a><br><br>`
			+ `</div>`
		}).join("<hr>")
	}

	if (matches.length == 100) {
		html += `<button onclick='search("${rep}", true)'>Show all results</button>`
	}

	document.getElementById("resultList").innerHTML = html
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

window.onload = () => {
	search('', true)
}
