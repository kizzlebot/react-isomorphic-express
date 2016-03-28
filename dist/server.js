/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return callback();
/******/ 		}
/******/ 		callback(null, update);
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "1319dfd583f1542f4a48"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/dist";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals __resourceQuery */
	if(true) {
		var hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);
	
		function checkForUpdate(fromUpdate) {
			if(module.hot.status() === "idle") {
				module.hot.check(true, function(err, updatedModules) {
					if(err) {
						if(module.hot.status() in {
								abort: 1,
								fail: 1
							}) {
							console.warn("[HMR] Cannot apply update.");
							console.warn("[HMR] " + err.stack || err.message);
							console.warn("[HMR] You need to restart the application!");
						} else {
							console.warn("[HMR] Update failed: " + err.stack || err.message);
						}
						return;
					}
					if(!updatedModules) {
						if(fromUpdate) console.log("[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				});
			}
		}
		setInterval(checkForUpdate, hotPollInterval);
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?1000"))

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});
	
		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}
	
		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";
	
	var _babelPolyfill = __webpack_require__(4);
	
	var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);
	
	var _reactRouter = __webpack_require__(5);
	
	var ReactRouter = _interopRequireWildcard(_reactRouter);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var pkg = __webpack_require__(6);
	var dotenv = __webpack_require__(7);
	var express = __webpack_require__(8);
	var mongoose = __webpack_require__(9);
	
	var errorHandler = __webpack_require__(10);
	var React = __webpack_require__(11);
	var ReactDOM = __webpack_require__(12);
	var Transmit = __webpack_require__(13);
	var githubApi = __webpack_require__(14);
	var favicon = __webpack_require__(19);
	var passport = __webpack_require__(20);
	var proxy = __webpack_require__(21);
	
	// Configuration modules
	var passportConfig = __webpack_require__(22);
	var routes = __webpack_require__(32);
	var middlewareConfig = __webpack_require__(45);
	
	// Environment Variables
	var hostname = process.env.HOSTNAME || "localhost";
	var port = process.env.PORT || 8000;
	var webpack_port = process.env.WEBPACK_PORT || 8080;
	
	/* Load environment variables from .env file, where API keys and passwords are configured. */
	dotenv.load();
	
	/* Create Express server. */
	var app = express();
	
	/* Connect to MongoDB. */
	mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
	mongoose.connection.on('error', function () {
		console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
		process.exit(1);
	});
	
	middlewareConfig(app, __dirname, function () {
		app.use('/api/github', proxy(githubApi.url, {
			forwardPath: function forwardPath(req, res) {
				return __webpack_require__(59).parse(req.url).path;
			}
		}));
	
		/**
	  * Controllers (route handlers).
	  */
	
		app.get('/', function (req, res, next) {
			var webserver =  false ? "" : "//" + hostname + ":" + webpack_port;
			var location = req.originalUrl;
	
			ReactRouter.match({ routes: routes, location: location }, function (error, redirectLocation, renderProps) {
				if (redirectLocation) return res.redirect(redirectLocation.pathname + redirectLocation.search, "/");
				if (error || !renderProps) return next(error);
	
				Transmit.renderToString(ReactRouter.RouterContext, renderProps).then(function (_ref) {
					var reactString = _ref.reactString;
					var reactData = _ref.reactData;
	
					var template = "<!doctype html>\n\t\t\t\t\t\t <html lang=\"en-us\">\n\t\t\t\t\t\t\t<head>\n\t\t\t\t\t\t\t\t<meta charset=\"utf-8\" />\n\t\t\t\t\t\t\t\t<title>react-isomorphic-starterkit</title>\n\t\t\t\t\t\t\t\t<link rel=\"shortcut icon\" href=\"" + favicon + "\" />\n\t\t\t\t\t\t\t</head>\n\t\t\t\t\t\t\t<body>\n\t\t\t\t\t\t\t\t<div id=\"react-root\">" + reactString + "</div>\n\t\t\t\t\t\t\t</body>\n\t\t\t\t\t\t </html>";
	
					var body = Transmit.injectIntoMarkup(template, reactData, [webserver + "/dist/client.js"]);
	
					// Set content-type to HTML and send the prerendered HTML back
					res.set('Content-Type', 'text/html');
					res.end(body);
				}).catch(function (e) {
					next(e);
				});
			});
		});
	
		/**
	  * OAuth authentication routes. (Sign in)
	  */
		app.get('/auth/instagram', passport.authenticate('instagram'));
		app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function (req, res) {
			res.redirect(req.session.returnTo || '/');
		});
	
		app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
		app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
			res.redirect(req.session.returnTo || '/');
		});
	
		app.get('/auth/github', passport.authenticate('github'));
		app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
			res.redirect(req.session.returnTo || '/');
		});
	
		app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
		app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
			res.redirect(req.session.returnTo || '/');
		});
	
		app.get('/auth/twitter', passport.authenticate('twitter'));
		app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function (req, res) {
			res.redirect(req.session.returnTo || '/');
		});
	
		app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
		app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function (req, res) {
			res.redirect(req.session.returnTo || '/');
		});
	
		/**
	  * Error Handler.
	  */
		app.use(errorHandler());
	
		/**
	  * Start Express server.
	  */
		app.listen(app.get('port'), function () {
			console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
		});
	
		if (true) {
			if (true) {
				console.log("[HMR] Waiting for server-side updates");
	
				module.hot.accept(32, function () {
					routes = __webpack_require__(32);
				});
	
				module.hot.addStatusHandler(function (status) {
					if (status === "abort") {
						setTimeout(function () {
							return process.exit(0);
						}, 0);
					}
				});
			}
		}
	});
	
	module.exports = app;
	/* WEBPACK VAR INJECTION */}.call(exports, "../src"))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		"name": "react-isomorphic-express",
		"description": "Isomorphic starterkit with server-side React rendering.",
		"version": "5.4.0",
		"license": "BSD-3-Clause",
		"repository": {
			"type": "git",
			"url": "https://github.com/RickWong/react-isomorphic-starterkit.git"
		},
		"homepage": "https://github.com/RickWong/react-isomorphic-starterkit",
		"keywords": [
			"react",
			"isomorphic",
			"expressjs",
			"universal",
			"starter",
			"boilerplate",
			"template",
			"webpack",
			"transmit"
		],
		"main": "dist/server.js",
		"scripts": {
			"start": "forever --minUptime 1000 --spinSleepTime 1000 -c \"node --harmony\" ./dist/server.js",
			"build-server": "webpack --colors --display-error-details --config configs/webpack.server.js",
			"build-client": "webpack --colors --display-error-details --config configs/webpack.client.js",
			"build": "concurrently \"npm run build-server\" \"npm run build-client\"",
			"watch-server": "webpack --watch --verbose --colors --display-error-details --config configs/webpack.server-watch.js",
			"watch-server-start": "node node_modules/just-wait --pattern \"dist/*.js\" && npm run start",
			"watch-client": "webpack-dev-server --config configs/webpack.client-watch.js --port=${WEBPACK_PORT:=\"8080\"}",
			"watch": "concurrently --kill-others \"npm run watch-server-start\" \"npm run watch-server\" \"npm run watch-client\""
		},
		"dependencies": {
			"async": "^1.5.2",
			"babel-polyfill": "6.6.1",
			"bcrypt-nodejs": "^0.0.3",
			"bitgo": "0.11.64",
			"body-parser": "^1.14.2",
			"bootstrap": "^3.3.6",
			"cheerio": "^0.20.0",
			"clockwork": "^0.1.0",
			"compression": "^1.6.1",
			"connect-assets": "^5.1.0",
			"connect-mongo": "^1.1.0",
			"cookie-parser": "^1.4.1",
			"dotenv": "^2.0.0",
			"errorhandler": "^1.4.3",
			"express": "^4.13.4",
			"express-flash": "^0.0.2",
			"express-http-proxy": "^0.6.0",
			"express-react-views": "^0.10.0",
			"express-session": "^1.13.0",
			"express-validator": "^2.19.0",
			"fbgraph": "^1.1.0",
			"fetch-plus": "3.8.1",
			"fetch-plus-bearerauth": "3.5.0",
			"fetch-plus-json": "3.6.0",
			"font-awesome": "^4.5.0",
			"github-api": "^0.11.2",
			"html-webpack-plugin": "^2.14.0",
			"instagram-node": "^0.5.8",
			"isomorphic-fetch": "2.2.1",
			"isomorphic-style-loader": "0.0.10",
			"jquery": "^2.2.2",
			"lastfm": "^0.9.2",
			"lob": "^3.7.0",
			"lodash": "^4.1.0",
			"lusca": "^1.3.0",
			"method-override": "^2.3.5",
			"mongoose": "^4.3.7",
			"morgan": "^1.6.1",
			"multer": "^1.1.0",
			"node-foursquare": "^0.3.0",
			"node-linkedin": "^0.5.3",
			"node-sass": "^3.4.2",
			"node-sass-middleware": "^0.9.7",
			"nodemailer": "^2.1.0",
			"passport": "0.3.2",
			"passport-facebook": "^2.0.0",
			"passport-github": "^1.0.0",
			"passport-google-oauth": "^0.2.0",
			"passport-instagram": "^1.0.0",
			"passport-linkedin-oauth2": "^1.4.0",
			"passport-local": "^1.0.0",
			"passport-oauth": "^1.0.0",
			"passport-openid": "^0.4.0",
			"passport-twitter": "^1.0.4",
			"paypal-rest-sdk": "^1.6.8",
			"react": "0.14.7",
			"react-bootstrap": "^0.28.4",
			"react-dom": "0.14.7",
			"react-inline-css": "2.1.0",
			"react-router": "2.0.0",
			"react-transmit": "3.1.7",
			"redux": "^3.3.1",
			"request": "^2.69.0",
			"serve-favicon": "^2.3.0",
			"tumblr.js": "^0.0.7",
			"twilio": "^3.3.0-edge",
			"twit": "^2.2.1",
			"validator": "^4.5.2",
			"yui": "^3.18.1"
		},
		"devDependencies": {
			"babel": "6.5.2",
			"babel-core": "6.6.5",
			"babel-loader": "6.2.4",
			"babel-preset-es2015": "6.6.0",
			"babel-preset-react": "6.5.0",
			"babel-preset-react-hmre": "1.1.1",
			"babel-preset-stage-0": "6.5.0",
			"bootstrap-webpack": "0.0.5",
			"concurrently": "2.0.0",
			"css-loader": "0.23.1",
			"exports-loader": "^0.6.3",
			"expose-loader": "^0.7.1",
			"extract-text-webpack-plugin": "^1.0.1",
			"file-loader": "^0.8.5",
			"font-awesome-webpack": "0.0.4",
			"forever": "0.15.1",
			"imports-loader": "^0.6.5",
			"jade": "^1.11.0",
			"json-loader": "0.5.4",
			"just-wait": "1.0.5",
			"less": "^2.6.1",
			"less-loader": "^2.2.3",
			"raw-loader": "^0.5.1",
			"react-hot-loader": "^1.3.0",
			"sass-loader": "^3.2.0",
			"style-loader": "^0.13.1",
			"url-loader": "^0.5.7",
			"webpack": "1.12.14",
			"webpack-dev-server": "1.14.1",
			"webpack-node-externals": "1.0.0"
		},
		"engines": {
			"node": ">=0.10.32"
		}
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("dotenv");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("errorhandler");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("react-transmit");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _isomorphicFetch = __webpack_require__(15);
	
	var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);
	
	var _fetchPlus = __webpack_require__(16);
	
	var _fetchPlus2 = _interopRequireDefault(_fetchPlus);
	
	var _fetchPlusJson = __webpack_require__(17);
	
	var _fetchPlusJson2 = _interopRequireDefault(_fetchPlusJson);
	
	var _fetchPlusBearerauth = __webpack_require__(18);
	
	var _fetchPlusBearerauth2 = _interopRequireDefault(_fetchPlusBearerauth);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var githubServerUrl = function githubServerUrl() {
		if (true) {
			return "https://api.github.com";
		}
	
		if (false) {
			var _window$location = window.location;
			var protocol = _window$location.protocol;
			var hostname = _window$location.hostname;
			var port = _window$location.port;
	
	
			return protocol + "//" + hostname + ":" + port + "/api/github";
		}
	};
	
	var endpoint = _fetchPlus2.default.connectEndpoint(githubServerUrl());
	
	endpoint.addMiddleware((0, _fetchPlusJson2.default)());
	
	module.exports = endpoint;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("fetch-plus");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("fetch-plus-json");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("fetch-plus-bearerauth");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/favicon.ico";

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("express-http-proxy");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(23);
	var passport = __webpack_require__(20);
	var request = __webpack_require__(24);
	
	var LocalStrategy = __webpack_require__(25).Strategy;
	var FacebookStrategy = __webpack_require__(26).Strategy;
	var GitHubStrategy = __webpack_require__(27).Strategy;
	var GoogleStrategy = __webpack_require__(28).OAuth2Strategy;
	
	var User = __webpack_require__(29);
	
	passport.serializeUser(function (user, done) {
	  done(null, user.id);
	});
	
	passport.deserializeUser(function (id, done) {
	  User.findById(id, function (err, user) {
	    done(err, user);
	  });
	});
	
	/**
	 * Sign in using Email and Password.
	 */
	passport.use(new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
	  User.findOne({ email: email.toLowerCase() }, function (err, user) {
	    if (!user) {
	      return done(null, false, { message: 'Email ' + email + ' not found.' });
	    }
	    user.comparePassword(password, function (err, isMatch) {
	      if (isMatch) {
	        return done(null, user);
	      } else {
	        return done(null, false, { message: 'Invalid email or password.' });
	      }
	    });
	  });
	}));
	
	/**
	 * OAuth Strategy Overview
	 *
	 * - User is already logged in.
	 *   - Check if there is an existing account with a provider id.
	 *     - If there is, return an error message. (Account merging not supported)
	 *     - Else link new OAuth account with currently logged-in user.
	 * - User is not logged in.
	 *   - Check if it's a returning user.
	 *     - If returning user, sign in and we are done.
	 *     - Else check if there is an existing account with user's email.
	 *       - If there is, return an error message.
	 *       - Else create a new account.
	 */
	
	/**
	 * Sign in with Facebook.
	 */
	passport.use(new FacebookStrategy({
	  clientID: process.env.FACEBOOK_ID,
	  clientSecret: process.env.FACEBOOK_SECRET,
	  callbackURL: '/auth/facebook/callback',
	  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
	  passReqToCallback: true
	}, function (req, accessToken, refreshToken, profile, done) {
	  if (req.user) {
	    User.findOne({ facebook: profile.id }, function (err, existingUser) {
	      if (existingUser) {
	        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
	        done(err);
	      } else {
	        User.findById(req.user.id, function (err, user) {
	          user.facebook = profile.id;
	          user.tokens.push({ kind: 'facebook', accessToken: accessToken });
	          user.profile.name = user.profile.name || profile.displayName;
	          user.profile.gender = user.profile.gender || profile._json.gender;
	          user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
	          user.save(function (err) {
	            req.flash('info', { msg: 'Facebook account has been linked.' });
	            done(err, user);
	          });
	        });
	      }
	    });
	  } else {
	    User.findOne({ facebook: profile.id }, function (err, existingUser) {
	      if (existingUser) {
	        return done(null, existingUser);
	      }
	      User.findOne({ email: profile._json.email }, function (err, existingEmailUser) {
	        if (existingEmailUser) {
	          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
	          done(err);
	        } else {
	          var user = new User();
	          user.email = profile._json.email;
	          user.facebook = profile.id;
	          user.tokens.push({ kind: 'facebook', accessToken: accessToken });
	          user.profile.name = profile.displayName;
	          user.profile.gender = profile._json.gender;
	          user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
	          user.profile.location = profile._json.location ? profile._json.location.name : '';
	          user.save(function (err) {
	            done(err, user);
	          });
	        }
	      });
	    });
	  }
	}));
	
	/**
	 * Sign in with GitHub.
	 */
	passport.use(new GitHubStrategy({
	  clientID: process.env.GITHUB_ID,
	  clientSecret: process.env.GITHUB_SECRET,
	  callbackURL: '/auth/github/callback',
	  passReqToCallback: true
	}, function (req, accessToken, refreshToken, profile, done) {
	  if (req.user) {
	    User.findOne({ github: profile.id }, function (err, existingUser) {
	      if (existingUser) {
	        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
	        done(err);
	      } else {
	        User.findById(req.user.id, function (err, user) {
	          user.github = profile.id;
	          user.tokens.push({ kind: 'github', accessToken: accessToken });
	          user.profile.name = user.profile.name || profile.displayName;
	          user.profile.picture = user.profile.picture || profile._json.avatar_url;
	          user.profile.location = user.profile.location || profile._json.location;
	          user.profile.website = user.profile.website || profile._json.blog;
	          user.save(function (err) {
	            req.flash('info', { msg: 'GitHub account has been linked.' });
	            done(err, user);
	          });
	        });
	      }
	    });
	  } else {
	    User.findOne({ github: profile.id }, function (err, existingUser) {
	      if (existingUser) {
	        return done(null, existingUser);
	      }
	      User.findOne({ email: profile._json.email }, function (err, existingEmailUser) {
	        if (existingEmailUser) {
	          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
	          done(err);
	        } else {
	          var user = new User();
	          user.email = profile._json.email;
	          user.github = profile.id;
	          user.tokens.push({ kind: 'github', accessToken: accessToken });
	          user.profile.name = profile.displayName;
	          user.profile.picture = profile._json.avatar_url;
	          user.profile.location = profile._json.location;
	          user.profile.website = profile._json.blog;
	          user.save(function (err) {
	            done(err, user);
	          });
	        }
	      });
	    });
	  }
	}));
	
	/**
	 * Sign in with Google.
	 */
	passport.use(new GoogleStrategy({
	  clientID: process.env.GOOGLE_ID,
	  clientSecret: process.env.GOOGLE_SECRET,
	  callbackURL: '/auth/google/callback',
	  passReqToCallback: true
	}, function (req, accessToken, refreshToken, profile, done) {
	  if (req.user) {
	    User.findOne({ google: profile.id }, function (err, existingUser) {
	      if (existingUser) {
	        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
	        done(err);
	      } else {
	        User.findById(req.user.id, function (err, user) {
	          user.google = profile.id;
	          user.tokens.push({ kind: 'google', accessToken: accessToken });
	          user.profile.name = user.profile.name || profile.displayName;
	          user.profile.gender = user.profile.gender || profile._json.gender;
	          user.profile.picture = user.profile.picture || profile._json.image.url;
	          user.save(function (err) {
	            req.flash('info', { msg: 'Google account has been linked.' });
	            done(err, user);
	          });
	        });
	      }
	    });
	  } else {
	    User.findOne({ google: profile.id }, function (err, existingUser) {
	      if (existingUser) {
	        return done(null, existingUser);
	      }
	      User.findOne({ email: profile.emails[0].value }, function (err, existingEmailUser) {
	        if (existingEmailUser) {
	          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
	          done(err);
	        } else {
	          var user = new User();
	          user.email = profile.emails[0].value;
	          user.google = profile.id;
	          user.tokens.push({ kind: 'google', accessToken: accessToken });
	          user.profile.name = profile.displayName;
	          user.profile.gender = profile._json.gender;
	          user.profile.picture = profile._json.image.url;
	          user.save(function (err) {
	            done(err, user);
	          });
	        }
	      });
	    });
	  }
	}));
	
	/**
	 * Login Required middleware.
	 */
	exports.isAuthenticated = function (req, res, next) {
	  if (req.isAuthenticated()) {
	    return next();
	  }
	  res.redirect('/login');
	};
	
	/**
	 * Authorization Required middleware.
	 */
	exports.isAuthorized = function (req, res, next) {
	  var provider = req.path.split('/').slice(-1)[0];
	
	  if (_.find(req.user.tokens, { kind: provider })) {
	    next();
	  } else {
	    res.redirect('/auth/' + provider);
	  }
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("passport-local");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("passport-facebook");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("passport-github");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("passport-google-oauth");

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bcrypt = __webpack_require__(30);
	var crypto = __webpack_require__(31);
	var mongoose = __webpack_require__(9);
	
	var userSchema = new mongoose.Schema({
	  email: { type: String, unique: true, lowercase: true },
	  password: String,
	
	  facebook: String,
	  twitter: String,
	  google: String,
	  github: String,
	  instagram: String,
	  linkedin: String,
	  steam: String,
	  tokens: Array,
	
	  profile: {
	    name: { type: String, default: '' },
	    gender: { type: String, default: '' },
	    location: { type: String, default: '' },
	    website: { type: String, default: '' },
	    picture: { type: String, default: '' }
	  },
	
	  resetPasswordToken: String,
	  resetPasswordExpires: Date
	});
	
	/**
	 * Password hash middleware.
	 */
	userSchema.pre('save', function (next) {
	  var user = this;
	  if (!user.isModified('password')) {
	    return next();
	  }
	  bcrypt.genSalt(10, function (err, salt) {
	    if (err) {
	      return next(err);
	    }
	    bcrypt.hash(user.password, salt, null, function (err, hash) {
	      if (err) {
	        return next(err);
	      }
	      user.password = hash;
	      next();
	    });
	  });
	});
	
	/**
	 * Helper method for validating user's password.
	 */
	userSchema.methods.comparePassword = function (candidatePassword, cb) {
	  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
	    if (err) {
	      return cb(err);
	    }
	    cb(null, isMatch);
	  });
	};
	
	/**
	 * Helper method for getting user's gravatar.
	 */
	userSchema.methods.gravatar = function (size) {
	  if (!size) {
	    size = 200;
	  }
	  if (!this.email) {
	    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
	  }
	  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
	  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
	};
	
	module.exports = mongoose.model('User', userSchema);

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("bcrypt-nodejs");

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(5);
	
	var _Main = __webpack_require__(33);
	
	var _Main2 = _interopRequireDefault(_Main);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * The React Router routes for both the server and the client.
	 */
	module.exports = _react2.default.createElement(
		_reactRouter.Router,
		null,
		_react2.default.createElement(_reactRouter.Route, { path: "/", component: _Main2.default })
	);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactInlineCss = __webpack_require__(34);
	
	var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);
	
	var _reactTransmit = __webpack_require__(13);
	
	var _reactTransmit2 = _interopRequireDefault(_reactTransmit);
	
	var _github = __webpack_require__(14);
	
	var _github2 = _interopRequireDefault(_github);
	
	var _favicon = __webpack_require__(19);
	
	var _favicon2 = _interopRequireDefault(_favicon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var fetchStargazers = function fetchStargazers(page) {
		var per_page = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
	
		return _github2.default.browse(["repos", "RickWong/react-isomorphic-starterkit", "stargazers"], { query: { page: page, per_page: per_page } }).then(function (json) {
			return (json || []).map(function (_ref) {
				var id = _ref.id;
				var login = _ref.login;
				return { id: id, login: login };
			});
		}).catch(function (error) {
			throw error;
		});
	};
	
	/**
	 * Main React application entry-point for both the server and client.
	 */
	
	var Main = function (_React$Component) {
		_inherits(Main, _React$Component);
	
		function Main() {
			_classCallCheck(this, Main);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(Main).apply(this, arguments));
		}
	
		_createClass(Main, [{
			key: "componentWillMount",
	
			/**
	   * componentWillMount() runs on server and client.
	   */
			value: function componentWillMount() {
				if (true) {
					console.log("Hello server");
				}
	
				if (false) {
					console.log("Hello client");
				}
			}
	
			/**
	   * componentDidUpdate() only runs on the client.
	   */
	
		}, {
			key: "componentDidUpdate",
			value: function componentDidUpdate(prevProps, prevState) {
				if (!this.props.additionalStargazers) {
					return;
				}
	
				this.loadMoreStargazersOnClient();
			}
	
			/**
	   * Load more stargazers.
	   */
	
		}, {
			key: "loadMoreStargazersOnClient",
			value: function loadMoreStargazersOnClient() {
				var _props = this.props;
				var _props$additionalStar = _props.additionalStargazers;
				var additionalStargazers = _props$additionalStar === undefined ? [] : _props$additionalStar;
				var transmit = _props.transmit;
				var _transmit$variables = transmit.variables;
				var nextPage = _transmit$variables.nextPage;
				var pagesToFetch = _transmit$variables.pagesToFetch;
	
	
				if (--pagesToFetch <= 0) {
					return;
				}
	
				++nextPage;
	
				transmit.forceFetch({
					nextPage: nextPage,
					pagesToFetch: pagesToFetch,
					additionalStargazers: additionalStargazers
				}, "additionalStargazers");
			}
	
			/**
	   * Runs on server and client.
	   */
	
		}, {
			key: "render",
			value: function render() {
				var repositoryUrl = "https://github.com/RickWong/react-isomorphic-starterkit";
				var avatarSize = 32;
				var avatarUrl = function avatarUrl(id) {
					return "https://avatars.githubusercontent.com/u/" + id + "?v=3&s=" + avatarSize;
				};
	
				/**
	    * This is a Transmit fragment.
	    */
				var _props2 = this.props;
				var stargazers = _props2.stargazers;
				var additionalStargazers = _props2.additionalStargazers;
	
	
				if (additionalStargazers) {
					stargazers = stargazers.concat(additionalStargazers);
				}
	
				return _react2.default.createElement(
					_reactInlineCss2.default,
					{ stylesheet: Main.css(avatarSize), namespace: "Main" },
					_react2.default.createElement(
						"a",
						{ className: "github", href: repositoryUrl },
						_react2.default.createElement("img", { src: "https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67", alt: "Fork me on GitHub" })
					),
					_react2.default.createElement(
						"h1",
						null,
						_react2.default.createElement("img", { src: _favicon2.default, alt: "icon" }),
						_react2.default.createElement("br", null),
						"React Isomorphic Starterkit. Let's get you started!"
					),
					_react2.default.createElement(
						"h3",
						null,
						"All-You-Need Features"
					),
					_react2.default.createElement(
						"ul",
						null,
						_react2.default.createElement(
							"li",
							null,
							"Fully automated toolchain with npm run scripts"
						),
						_react2.default.createElement(
							"li",
							null,
							"React 0.14 + React Router 2.0 on the client and server"
						),
						_react2.default.createElement(
							"li",
							null,
							"Babel 6 automatically compiles ES2015 + ES7 stage-0"
						),
						_react2.default.createElement(
							"li",
							null,
							"Webpack HMR for instant server updates"
						),
						_react2.default.createElement(
							"li",
							null,
							"React Transform HMR for instant client updates"
						),
						_react2.default.createElement(
							"li",
							null,
							"React Transmit to preload on server and hydrate client"
						),
						_react2.default.createElement(
							"li",
							null,
							"InlineCss-component for styling components"
						)
					),
					_react2.default.createElement(
						"p",
						null,
						"In short: ",
						_react2.default.createElement(
							"em",
							null,
							"an excellent choice"
						),
						". Ready to start",
						'?'
					),
					_react2.default.createElement(
						"h3",
						null,
						"Open Community",
						_react2.default.createElement("iframe", { src: "https://ghbtns.com/github-btn.html?user=RickWong&repo=react-isomorphic-starterkit&type=star&count=true", frameBorder: "0", scrolling: "0", width: "110", height: "20", style: { float: "right" } })
					),
					_react2.default.createElement(
						"p",
						null,
						_react2.default.createElement(
							"a",
							{ href: repositoryUrl, title: "star = join us!" },
							_react2.default.createElement("img", { className: "avatar", src: avatarUrl(0), alt: "you?" })
						),
						stargazers && stargazers.map(function (user) {
							return _react2.default.createElement(
								"a",
								{ key: user.id, href: "https://github.com/" + user.login, title: user.login, target: "_blank" },
								_react2.default.createElement("img", { className: "avatar", src: avatarUrl(user.id), alt: user.login })
							);
						}),
						_react2.default.createElement(
							"a",
							{ href: repositoryUrl, title: "you here? star us!" },
							_react2.default.createElement("img", { className: "avatar", src: avatarUrl(0), alt: "you?" })
						)
					)
				);
			}
			/**
	   * <InlineCss> component allows you to write a CSS stylesheet for your component. Target
	   * your component with `&` and its children with `& selectors`. Be specific.
	   */
	
		}], [{
			key: "css",
			value: function css(avatarSize) {
				return "\n\t\t\t& .github {\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 0;\n\t\t\t\tright: 0;\n\t\t\t\tborder: 0;\n\t\t\t}\n\t\t\t& {\n\t\t\t\tfont-family: sans-serif;\n\t\t\t\tcolor: #0df;\n\t\t\t\tpadding: 10px 30px 30px;\n\t\t\t\twidth: 443px;\n\t\t\t\tmargin: 10px auto;\n\t\t\t\tbackground: #222;\n\t\t\t}\n\t\t\t& .avatar {\n\t\t\t\tborder-radius: 50%;\n\t\t\t\twidth: " + avatarSize + "px;\n\t\t\t\theight: " + avatarSize + "px;\n\t\t\t\tmargin: 0 2px 2px 0;\n\t\t\t}\n\t\t";
			}
		}]);
	
		return Main;
	}(_react2.default.Component);
	
	/**
	 * Use Transmit to query and return GitHub stargazers as a Promise.
	 */
	
	
	exports.default = _reactTransmit2.default.createContainer(Main, {
		initialVariables: {
			nextPage: 2,
			pagesToFetch: 15,
			additionalStargazers: []
		},
		fragments: {
			/**
	   * Load first stargazers.
	   */
			stargazers: function stargazers() {
				return fetchStargazers(1);
			},
			/**
	   * Load more stargazers deferred.
	   */
			additionalStargazers: function additionalStargazers(_ref2) {
				var nextPage = _ref2.nextPage;
				var _additionalStargazers = _ref2.additionalStargazers;
	
				return function () {
					return fetchStargazers(nextPage).then(function (newStargazers) {
						newStargazers = newStargazers.map(function (_ref3) {
							var id = _ref3.id;
							var login = _ref3.login;
	
							return { id: id, login: login };
						});
	
						return _additionalStargazers.concat(newStargazers);
					});
				};
			}
		}
	});

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("react-inline-css");

/***/ },
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pkg = __webpack_require__(6);
	var cookieParser = __webpack_require__(46);
	var compress = __webpack_require__(47);
	var session = __webpack_require__(48);
	var bodyParser = __webpack_require__(49);
	var logger = __webpack_require__(50);
	var errorHandler = __webpack_require__(10);
	var lusca = __webpack_require__(51);
	var methodOverride = __webpack_require__(52);
	var dotenv = __webpack_require__(7);
	var MongoStore = __webpack_require__(53)(session);
	var flash = __webpack_require__(54);
	var path = __webpack_require__(55);
	var mongoose = __webpack_require__(9);
	var passport = __webpack_require__(20);
	var expressValidator = __webpack_require__(56);
	var sass = __webpack_require__(57);
	var multer = __webpack_require__(58);
	var express = __webpack_require__(8);
	
	var passportConfig = __webpack_require__(22);
	
	module.exports = function (app, dir, cb) {
	  app.set('port', process.env.PORT || 8000);
	  app.set('views', path.join("./", 'containers'));
	  app.set('view engine', 'jade');
	  app.use(compress());
	  app.use(sass({
	    src: path.join(dir, 'public'),
	    dest: path.join(dir, 'public'),
	    sourceMap: true
	  }));
	  app.use(logger('dev'));
	  app.use(bodyParser.json());
	  app.use(bodyParser.urlencoded({ extended: true }));
	  app.use(expressValidator());
	  app.use(methodOverride());
	  app.use(cookieParser());
	  app.use(session({
	    resave: true,
	    saveUninitialized: true,
	    secret: process.env.SESSION_SECRET,
	    store: new MongoStore({
	      url: process.env.MONGODB || process.env.MONGOLAB_URI,
	      autoReconnect: true
	    })
	  }));
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(flash());
	  app.use(function (req, res, next) {
	    return req.path === '/api/upload' ? next() : lusca.csrf()(req, res, next);
	  });
	  app.use(lusca.xframe('SAMEORIGIN'));
	  app.use(lusca.xssProtection(true));
	  app.use(function (req, res, next) {
	    res.locals.user = req.user;
	    res.locals.appName = pkg.name;
	    next();
	  });
	  app.use(function (req, res, next) {
	    if (/api/i.test(req.path)) req.session.returnTo = req.path;
	    next();
	  });
	
	  app.use(express.static(path.join(dir, 'static'), { maxAge: 31557600000 }));
	  if (cb) cb(app);
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = require("lusca");

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = require("method-override");

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = require("connect-mongo/es5");

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = require("express-flash");

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = require("express-validator");

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = require("node-sass-middleware");

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map