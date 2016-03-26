import fetch from "isomorphic-fetch";
import fetchPlus from "fetch-plus";
import plusJson from "fetch-plus-json";
import plusBearerauth from "fetch-plus-bearerauth";

const githubServerUrl = () => {
	if (__SERVER__) {
		console.log("https://api.github.com");
		return "https://api.github.com";
	}

	if (__CLIENT__) {
		const {protocol, hostname, port} = window.location;
		var rtn = `${protocol}//${hostname}:${port}/api/github`;
		console.log(rtn);
		return rtn ;
	}
};

const endpoint = fetchPlus.connectEndpoint(githubServerUrl());

endpoint.addMiddleware(plusJson());

module.exports = endpoint;
