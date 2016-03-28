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
/******/ 	var hotCurrentHash = "ad00a583dc579b28fd5c"; // eslint-disable-line no-unused-vars
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
	
	var hostname = process.env.HOSTNAME || "localhost";
	var port = process.env.PORT || 8000;
	var webpack_port = process.env.WEBPACK_PORT || 8080;
	
	var errorHandler = __webpack_require__(10);
	var React = __webpack_require__(11);
	var ReactDOM = __webpack_require__(12);
	var Transmit = __webpack_require__(13);
	
	var githubApi = __webpack_require__(14);
	var routes = __webpack_require__(19);
	var favicon = __webpack_require__(35);
	
	var passportConfig = __webpack_require__(38);
	
	var passport = __webpack_require__(40);
	
	/* Load environment variables from .env file, where API keys and passwords are configured. */
	dotenv.load();
	
	/* API keys and Passport configuration. */
	
	/* Create Express server. */
	var app = express();
	
	/* Connect to MongoDB. */
	mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
	mongoose.connection.on('error', function () {
		console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
		process.exit(1);
	});
	
	var middlewareConfig = __webpack_require__(49);
	var proxy = __webpack_require__(63);
	
	middlewareConfig(app, __dirname, function () {
		app.use('/api/github', proxy(githubApi.url, {
			forwardPath: function forwardPath(req, res) {
				return __webpack_require__(64).parse(req.url).path;
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
	
				module.hot.accept(19, function () {
					routes = __webpack_require__(19);
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
			"watch-client": "webpack-dev-server --config configs/webpack.client-watch.js",
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

	'use strict';
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(20);
	
	var _reactRouter = __webpack_require__(5);
	
	var _header = __webpack_require__(21);
	
	var _header2 = _interopRequireDefault(_header);
	
	var _footer = __webpack_require__(25);
	
	var _footer2 = _interopRequireDefault(_footer);
	
	var _home = __webpack_require__(26);
	
	var _home2 = _interopRequireDefault(_home);
	
	var _github = __webpack_require__(27);
	
	var _github2 = _interopRequireDefault(_github);
	
	var _linkedin = __webpack_require__(28);
	
	var _linkedin2 = _interopRequireDefault(_linkedin);
	
	var _contact = __webpack_require__(29);
	
	var _contact2 = _interopRequireDefault(_contact);
	
	var _apis = __webpack_require__(30);
	
	var _apis2 = _interopRequireDefault(_apis);
	
	var _login = __webpack_require__(31);
	
	var _login2 = _interopRequireDefault(_login);
	
	var _signup = __webpack_require__(32);
	
	var _signup2 = _interopRequireDefault(_signup);
	
	var _reactBootstrap = __webpack_require__(33);
	
	var _app = __webpack_require__(34);
	
	var _app2 = _interopRequireDefault(_app);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// require("bootstrap-webpack!./style/css/themes/default/_variables.less");
	
	if (false) {
	  require("font-awesome-webpack");
	  // require("bootstrap-webpack");
	  require('./style/css/main.scss');
	  // require('./style/css/docs.scss');
	}
	
	module.exports = _react2.default.createElement(
	  _reactRouter.Router,
	  { history: _reactRouter.browserHistory },
	  _react2.default.createElement(
	    _reactRouter.Route,
	    { path: '/', component: _app2.default },
	    _react2.default.createElement(_reactRouter.IndexRoute, { component: _home2.default }),
	    _react2.default.createElement(
	      _reactRouter.Route,
	      { path: 'api', component: _apis2.default },
	      _react2.default.createElement(_reactRouter.Route, { path: 'github', component: _github2.default }),
	      _react2.default.createElement(_reactRouter.Route, { path: 'linkedin', component: _linkedin2.default })
	    ),
	    _react2.default.createElement(_reactRouter.Route, { path: 'contact', component: _contact2.default }),
	    _react2.default.createElement(_reactRouter.Route, { path: 'login', component: _login2.default }),
	    _react2.default.createElement(_reactRouter.Route, { path: 'signup', component: _signup2.default })
	  )
	);

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(5);
	
	var _userStore = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Header = _react2.default.createClass({
	  displayName: 'Header',
	  getInitialState: function getInitialState() {
	    return _userStore.userStore.getState();
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;
	
	    _userStore.userStore.subscribe(function (data) {
	      _this.setState(_extends({}, _userStore.userStore.getState()));
	    });
	  },
	  render: function render() {
	    var navRight = !this.state.logged_in ? _react2.default.createElement(
	      'ul',
	      { className: 'nav navbar-nav navbar-right' },
	      _react2.default.createElement(
	        'li',
	        null,
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/login', activeClassName: 'active' },
	          'Login'
	        )
	      ),
	      _react2.default.createElement(
	        'li',
	        null,
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/signup', activeClassName: 'active' },
	          'Create Account'
	        )
	      )
	    ) : _react2.default.createElement(
	      'ul',
	      { className: 'nav navbar-nav navbar-right' },
	      _react2.default.createElement(
	        'li',
	        null,
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/logout' },
	          'Logout'
	        )
	      )
	    );
	
	    return _react2.default.createElement(
	      'div',
	      { className: 'navbar navbar-inverse' },
	      _react2.default.createElement(
	        'div',
	        { className: 'container' },
	        _react2.default.createElement(
	          'div',
	          { className: 'navbar-header' },
	          _react2.default.createElement(
	            'button',
	            { type: 'button', 'data-toggle': 'collapse', 'data-target': '.navbar-collapse', className: 'navbar-toggle' },
	            _react2.default.createElement(
	              'span',
	              { className: 'sr-only' },
	              'Toggle navigation'
	            ),
	            _react2.default.createElement('span', { className: 'icon-bar' }),
	            _react2.default.createElement('span', { className: 'icon-bar' }),
	            _react2.default.createElement('span', { className: 'icon-bar' })
	          ),
	          _react2.default.createElement(
	            _reactRouter.IndexLink,
	            { to: '/', activeClassName: 'active', className: 'navbar-brand' },
	            _react2.default.createElement('i', { className: 'fa fa-rocket' }),
	            'DevMusic'
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'collapse navbar-collapse' },
	          _react2.default.createElement(
	            'ul',
	            { className: 'nav navbar-nav' },
	            _react2.default.createElement(
	              'li',
	              null,
	              _react2.default.createElement(
	                _reactRouter.IndexLink,
	                { to: '/', activeClassName: 'active' },
	                'Home'
	              )
	            ),
	            _react2.default.createElement(
	              'li',
	              null,
	              _react2.default.createElement(
	                _reactRouter.Link,
	                { to: '/contact', activeClassName: 'active' },
	                'Contact'
	              )
	            )
	          ),
	          navRight
	        )
	      )
	    );
	  }
	});
	
	exports.default = Header;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.userStore = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.submitLogin = submitLogin;
	exports.submitSignup = submitSignup;
	
	var _redux = __webpack_require__(23);
	
	var $ = __webpack_require__(24);
	
	var LOG_IN = 'LOG_IN';
	var LOG_OUT = 'LOG_OUT';
	var SIGN_UP = 'SIGN_UP';
	var GET_PROFILE = 'GET_PROFILE';
	
	/**
	 * This is a reducer, a pure function with (state, action) => state signature.
	 * It describes how an action transforms the state into the next state.
	 *
	 * The shape of the state is up to you: it can be a primitive, an array, an object,
	 * or even an Immutable.js data structure. The only important part is that you should
	 * not mutate the state object, but return a new object if the state changes.
	 *
	 * In this example, we use a `switch` statement and strings, but you can use a helper that
	 * follows a different convention (such as function maps) if it makes sense for your
	 * project.
	 */
	
	function auth() {
		var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var action = arguments[1];
	
		switch (action.type) {
			case LOG_IN:
				return _extends({}, state, { logged_in: true });
			case LOG_OUT:
				return _extends({}, state, { logged_in: false });
			case SIGN_UP:
				return state;
			case GET_PROFILE:
				return state;
			default:
				return state;
		}
	}
	
	// Create a Redux store holding the state of your app.
	// Its API is { subscribe, dispatch, getState }.
	
	var userStore = exports.userStore = (0, _redux.createStore)(auth);
	
	/**
	 * Action Creators
	 */
	function log_in() {
		return {
			type: LOG_IN
		};
	}
	function signup() {
		return {
			type: SIGN_UP
		};
	}
	
	function submitLogin(form) {
		return $.ajax({
			url: '/login',
			data: {
				email: form.email.value,
				password: form.password.value,
				_csrf: form._csrf.value
			},
			method: 'POST'
		}).then(function (xData, status, xhr) {
			console.log(xhr.getAllResponseHeaders());
			userStore.dispatch(log_in());
			return Promise.resolve(xData, status, xhr);
		});
	}
	function submitSignup(form) {
		return $.ajax({
			url: '/signup',
			data: {
				email: form.email.value,
				password: form.password.value,
				confirmPassword: form.confirmPassword.value,
				_csrf: form._csrf.value
			},
			method: 'POST'
		}).then(function (xData, status, xhr) {
			console.log(xhr.getAllResponseHeaders());
			userStore.dispatch(log_in());
			return Promise.resolve(xData, status, xhr);
		});
	}
	
	// You can subscribe to the updates manually, or use bindings to your view layer.
	// store.subscribe(() =>
	//   console.log(store.getState())
	// )

	// // The only way to mutate the internal state is to dispatch an action.
	// // The actions can be serialized, logged or stored and later replayed.
	// store.dispatch({ type: 'INCREMENT' })
	// // 1
	// store.dispatch({ type: 'INCREMENT' })
	// // 2
	// store.dispatch({ type: 'DECREMENT' })

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("redux");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("jquery");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Footer = _react2.default.createClass({
	  displayName: "Footer",
	
	  render: function render() {
	    return _react2.default.createElement(
	      "footer",
	      null,
	      _react2.default.createElement(
	        "div",
	        { className: "container text-center" },
	        _react2.default.createElement(
	          "p",
	          { className: "pull-left" },
	          "© 2016 Company, Inc. All Rights Reserved"
	        ),
	        _react2.default.createElement(
	          "ul",
	          { className: "pull-right list-inline" },
	          _react2.default.createElement(
	            "li",
	            null,
	            _react2.default.createElement(
	              "a",
	              { href: "https://github.com/sahat/hackathon-starter" },
	              "GitHub Project"
	            )
	          ),
	          _react2.default.createElement(
	            "li",
	            null,
	            _react2.default.createElement(
	              "a",
	              { href: "https://github.com/sahat/hackathon-starter/issues" },
	              "Issues"
	            )
	          )
	        )
	      )
	    );
	  }
	});
	
	exports.default = Footer;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Home = _react2.default.createClass({
	  displayName: 'Home',
	
	  generateLorem: function generateLorem() {
	    var Apis = {
	      // 'GitHub':{
	      //   style:{backgroundColor: '#000'},
	      //   src:"http://i.imgur.com/2AaBlpf.png"
	      // },
	
	      // 'Facebook':{
	      //   style:{backgroundColor: '#3b5998'},
	      //   src:"http://i.imgur.com/jiztYCH.png"
	      // },
	      // 'Foursquare':{
	      //   style:{backgroundColor: '#1cafec'},
	      //   src:"http://i.imgur.com/PixH9li.png"
	      // },
	
	      // 'Last.fm':{
	      //   style:{backgroundColor: '#d21309'},
	      //   src:"http://i.imgur.com/KfZY876.png"
	      // },
	      // 'Web Scraping':{
	      //   style:{backgroundColor: '#fEF'},
	      //   src:"http://i.imgur.com/RGCVvyR.png"
	      // }
	    };
	
	    return Object.keys(Apis).map(function (e, i) {
	      var api = Apis[e];
	      return _react2.default.createElement(
	        'div',
	        { key: e, className: 'col-sm-4' },
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/api/' + e.toLowerCase().replace(/\./g, ' ').replace(' ', '') },
	          _react2.default.createElement(
	            'div',
	            { style: api.style, className: 'panel panel-default' },
	            _react2.default.createElement(
	              'div',
	              { className: 'panel-body' },
	              _react2.default.createElement('img', { src: api.src, height: 40 }),
	              ' ',
	              e
	            )
	          )
	        )
	      );
	    });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'h1',
	        null,
	        'DevMusic'
	      ),
	      _react2.default.createElement(
	        'p',
	        { className: 'lead' },
	        'Your music aggregator'
	      ),
	      _react2.default.createElement('hr', null),
	      _react2.default.createElement(
	        'div',
	        { className: 'row' },
	        this.generateLorem()
	      )
	    );
	  }
	});
	
	exports.default = Home;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var GithubAPI = _react2.default.createClass({
	  displayName: "GithubAPI",
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      null,
	      _react2.default.createElement(
	        "h2",
	        null,
	        _react2.default.createElement("i", { className: "fa fa-github" }),
	        "GitHub API"
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "btn-group btn-group-justified" },
	        _react2.default.createElement(
	          "a",
	          { href: "http://developer.github.com/guides/getting-started/", target: "_blank", className: "btn btn-primary" },
	          _react2.default.createElement("i", { className: "fa fa-check-square-o" }),
	          "Getting Started"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "https://apigee.com/console/github", target: "_blank", className: "btn btn-primary" },
	          _react2.default.createElement("i", { className: "fa fa-laptop" }),
	          "API Console"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "http://developer.github.com/v3/", target: "_blank", className: "btn btn-primary" },
	          _react2.default.createElement("i", { className: "fa fa-file-text-o" }),
	          "Documentation"
	        )
	      ),
	      _react2.default.createElement("br", null),
	      _react2.default.createElement(
	        "div",
	        { className: "panel panel-primary" },
	        _react2.default.createElement(
	          "div",
	          { className: "panel-heading" },
	          _react2.default.createElement(
	            "h3",
	            { className: "panel-title" },
	            "Repository Information"
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "panel-body" },
	          _react2.default.createElement(
	            "div",
	            { className: "row" },
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-4" },
	              _react2.default.createElement("img", { src: "https://github.global.ssl.fastly.net/images/modules/logos_page/Octocat.png", className: "img-rounded img-responsive" })
	            ),
	            _react2.default.createElement(
	              "div",
	              { className: "col-xs-8" },
	              _react2.default.createElement("h4", null),
	              _react2.default.createElement(
	                "ul",
	                { className: "list-inline" },
	                _react2.default.createElement(
	                  "li",
	                  null,
	                  _react2.default.createElement("i", { className: "fa fa-eye-slash" })
	                ),
	                _react2.default.createElement(
	                  "li",
	                  null,
	                  _react2.default.createElement("i", { className: "fa fa-star" })
	                ),
	                _react2.default.createElement(
	                  "li",
	                  null,
	                  _react2.default.createElement("i", { className: "fa fa-code-fork" })
	                ),
	                _react2.default.createElement(
	                  "li",
	                  null,
	                  _react2.default.createElement("i", { className: "fa fa-code" })
	                )
	              ),
	              _react2.default.createElement(
	                "strong",
	                null,
	                "DESCRIPTION"
	              )
	            )
	          )
	        )
	      )
	    );
	  }
	});
	
	exports.default = GithubAPI;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var LinkedIn = _react2.default.createClass({
	  displayName: "LinkedIn",
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      null,
	      _react2.default.createElement(
	        "div",
	        { className: "page-header" },
	        _react2.default.createElement(
	          "h2",
	          null,
	          _react2.default.createElement("i", { className: "fa fa-linkedin-square" }),
	          "LinkedIn API"
	        )
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "btn-group btn-group-justified" },
	        _react2.default.createElement(
	          "a",
	          { href: "https://github.com/Kuew/node-linkedin", target: "_blank", className: "btn btn-primary" },
	          _react2.default.createElement("i", { className: "fa fa-book" }),
	          "Node LinkedIn Docs"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "http://developer.linkedin.com/documents/authentication", target: "_blank", className: "btn btn-primary" },
	          _react2.default.createElement("i", { className: "fa fa-check-square-o" }),
	          "Getting Started"
	        ),
	        _react2.default.createElement(
	          "a",
	          { href: "http://developer.linkedin.com/apis", target: "_blank", className: "btn btn-primary" },
	          _react2.default.createElement("i", { className: "fa fa-code-fork" }),
	          "API Endpoints"
	        )
	      ),
	      _react2.default.createElement(
	        "h3",
	        { className: "text-primary" },
	        "My LinkedIn Profile"
	      ),
	      _react2.default.createElement(
	        "div",
	        { className: "well well-sm" },
	        _react2.default.createElement(
	          "div",
	          { className: "row" },
	          _react2.default.createElement(
	            "div",
	            { className: "col-sm-12" },
	            _react2.default.createElement(
	              "div",
	              { className: "col-sm-2" },
	              _react2.default.createElement("br", null)
	            ),
	            _react2.default.createElement("div", { className: "col-sm-10" })
	          )
	        ),
	        _react2.default.createElement("br", null),
	        _react2.default.createElement(
	          "div",
	          { className: "row" },
	          _react2.default.createElement(
	            "div",
	            { className: "col-sm-12" },
	            _react2.default.createElement(
	              "dl",
	              { className: "dl-horizontal" },
	              _react2.default.createElement(
	                "dt",
	                { className: "text-muted" },
	                "Current"
	              ),
	              _react2.default.createElement(
	                "dt",
	                { className: "text-muted" },
	                "Connections"
	              ),
	              _react2.default.createElement(
	                "dd",
	                null,
	                " connections"
	              )
	            ),
	            _react2.default.createElement("div", { className: "text-center" })
	          )
	        )
	      )
	    );
	  }
	});
	
	exports.default = LinkedIn;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Contact = _react2.default.createClass({
	  displayName: "Contact",
	
	  render: function render() {
	    return _react2.default.createElement(
	      "div",
	      null,
	      _react2.default.createElement(
	        "div",
	        { className: "page-header" },
	        _react2.default.createElement(
	          "h3",
	          null,
	          "Contact Form"
	        )
	      ),
	      _react2.default.createElement(
	        "form",
	        { role: "form", method: "POST", className: "form-horizontal" },
	        _react2.default.createElement("input", { type: "hidden", name: "_csrf" }),
	        _react2.default.createElement(
	          "div",
	          { className: "form-group" },
	          _react2.default.createElement(
	            "label",
	            { htmlFor: "name", className: "col-sm-2 control-label" },
	            "Name"
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "col-sm-8" },
	            _react2.default.createElement("input", { type: "text", name: "name", id: "name", autofocus: "autofocus", className: "form-control" })
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "form-group" },
	          _react2.default.createElement(
	            "label",
	            { htmlFor: "email", className: "col-sm-2 control-label" },
	            "Email"
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "col-sm-8" },
	            _react2.default.createElement("input", { type: "text", name: "email", id: "email", className: "form-control" })
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "form-group" },
	          _react2.default.createElement(
	            "label",
	            { htmlFor: "message", className: "col-sm-2 control-label" },
	            "Body"
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "col-sm-8" },
	            _react2.default.createElement("textarea", { type: "text", name: "message", id: "message", rows: 7, className: "form-control", defaultValue: "" })
	          )
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "form-group" },
	          _react2.default.createElement(
	            "div",
	            { className: "col-sm-offset-2 col-sm-8" },
	            _react2.default.createElement(
	              "button",
	              { type: "submit", className: "btn btn-primary" },
	              _react2.default.createElement("i", { className: "fa fa-envelope" }),
	              "Send"
	            )
	          )
	        )
	      )
	    );
	  }
	});
	
	exports.default = Contact;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var APIs = _react2.default.createClass({
	  displayName: 'APIs',
	  getInitialState: function getInitialState() {
	    return {};
	  },
	  _getAPIs: function _getAPIs() {
	    var Apis = {
	      'GitHub': {
	        style: { backgroundColor: '#000' },
	        src: "http://i.imgur.com/2AaBlpf.png"
	      },
	      'Twitter': {
	        style: { backgroundColor: '#00abf0' },
	        src: "http://i.imgur.com/EYA2FO1.png"
	      },
	      'Facebook': {
	        style: { backgroundColor: '#3b5998' },
	        src: "http://i.imgur.com/jiztYCH.png"
	      },
	      'Foursquare': {
	        style: { backgroundColor: '#1cafec' },
	        src: "http://i.imgur.com/PixH9li.png"
	      },
	      'Instagram': {
	        style: { backgroundColor: '#947563' },
	        src: "http://i.imgur.com/aRc6LUJ.png"
	      },
	      'Last.fm': {
	        style: { backgroundColor: '#d21309' },
	        src: "http://i.imgur.com/KfZY876.png"
	      },
	      'LinkedIn': {
	        style: { backgroundColor: '#007bb6' },
	        src: "http://i.imgur.com/sYmVWAw.png"
	      },
	      'Steam': {
	        style: { backgroundColor: '#000' },
	        src: "http://i.imgur.com/1xGmKBX.jpg"
	      },
	      'Stripe': {
	        style: { backgroundColor: '#3da8e5' },
	        src: "http://i.imgur.com/w3s2RvW.png"
	      },
	      'PayPal': {
	        style: { backgroundColor: '#000' },
	        src: "http://i.imgur.com/JNc0iaX.png"
	      },
	      'Twilio': {
	        style: { backgroundColor: '#fd0404' },
	        src: "http://i.imgur.com/mEUd6zM.png"
	      },
	      'Tumblr': {
	        style: { backgroundColor: '#304e6c' },
	        src: "http://i.imgur.com/rZGQShS.png"
	      },
	      'Web Scraping': {
	        style: { backgroundColor: '#fff' },
	        src: "http://i.imgur.com/RGCVvyR.png"
	      },
	      'Venmo': {
	        style: { backgroundColor: '#1f93cf' },
	        src: "http://i.imgur.com/90tl9C8.gif"
	      },
	      'Yahoo': {
	        style: { backgroundColor: '#3d048b' },
	        src: "http://i.imgur.com/Cl6WJAu.png"
	      },
	      'Clockwork SMS': {
	        style: { backgroundColor: '#000' },
	        src: "http://i.imgur.com/YcdxZ5F.png"
	      },
	      'Aviary': {
	        style: { backgroundColor: 'linear-gradient(to bottom, #1f3d95 0%,#04aade 100%)' },
	        src: "http://i.imgur.com/npBRwMI.png"
	      },
	      'Lob': {
	        style: { backgroundColor: '#176992' },
	        src: "http://i.imgur.com/bmgfsSg.png"
	      },
	      'BitGo': {
	        style: { backgroundColor: '#142834' },
	        src: "http://i.imgur.com/v753soI.png"
	      },
	      'File Upload': {
	        style: { backgroundColor: '#fff' },
	        src: "http://i.imgur.com/UPTzIdC.png"
	      },
	      'Pinterest': {
	        style: { backgroundColor: '#bd081c' },
	        src: "http://i.imgur.com/JNNRQSm.png"
	      }
	    };
	
	    return Object.keys(Apis).map(function (e, i) {
	      var api = Apis[e];
	      return _react2.default.createElement(
	        'div',
	        { key: e, className: 'col-sm-4' },
	        _react2.default.createElement(
	          _reactRouter.Link,
	          { to: '/api/' + e.toLowerCase().replace(/\./g, ' ').replace(' ', '') },
	          _react2.default.createElement(
	            'div',
	            { style: api.style, className: 'panel panel-default' },
	            _react2.default.createElement(
	              'div',
	              { className: 'panel-body' },
	              _react2.default.createElement('img', { src: api.src, height: 40 }),
	              ' ',
	              e
	            )
	          )
	        )
	      );
	    });
	  },
	  render: function render() {
	    if (!this.props.children) {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'h2',
	          null,
	          'API Examples'
	        ),
	        _react2.default.createElement('hr', null),
	        _react2.default.createElement(
	          'div',
	          { className: 'row' },
	          this._getAPIs(),
	          ';'
	        )
	      );
	    } else {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.props.children
	      );
	    }
	  }
	});
	
	exports.default = APIs;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _userStore = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var $ = __webpack_require__(24);
	
	
	var Login = _react2.default.createClass({
	  displayName: 'Login',
	
	  contextTypes: {
	    router: _react2.default.PropTypes.object.isRequired
	  },
	  getInitialState: function getInitialState() {
	    return _userStore.userStore.getState();
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;
	
	    _userStore.userStore.subscribe(function (data) {
	      var state = _extends({}, _userStore.userStore.getState());
	      _this.setState(state, function () {
	        if (state.logged_in) _this.context.router.replace('/');
	      });
	    });
	  },
	  onSubmit: function onSubmit(evt) {
	    evt.preventDefault();
	    (0, _userStore.submitLogin)(this.refs.form);
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        { className: 'page-header' },
	        _react2.default.createElement(
	          'h3',
	          null,
	          'Sign in'
	        )
	      ),
	      _react2.default.createElement(
	        'form',
	        { ref: 'form', onSubmit: this.onSubmit, className: 'form-horizontal' },
	        _react2.default.createElement('input', { type: 'hidden', name: '_csrf', value: $('#csrf').attr('value') }),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'email', className: 'col-sm-3 control-label' },
	            'Email'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-7' },
	            _react2.default.createElement('input', { type: 'email', name: 'email', id: 'email', placeholder: 'Email', autofocus: 'autofocus', className: 'form-control' })
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'password', className: 'col-sm-3 control-label' },
	            'Password'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-7' },
	            _react2.default.createElement('input', { type: 'password', name: 'password', id: 'password', placeholder: 'Password', className: 'form-control' })
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-offset-3 col-sm-7' },
	            _react2.default.createElement(
	              'button',
	              { type: 'submit', className: 'col-sm-3 btn btn-primary' },
	              _react2.default.createElement('i', { className: 'fa fa-user' }),
	              'Login'
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: '/forgot', className: 'btn btn-link' },
	              'Forgot your password?'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-offset-3 col-sm-7' },
	            _react2.default.createElement('hr', null)
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-offset-3 col-sm-7' },
	            _react2.default.createElement(
	              'a',
	              { href: '/auth/lastfm', className: 'btn btn-block btn-lastfm btn-social' },
	              _react2.default.createElement('i', { className: 'fa fa-lastfm' }),
	              'Sign in with Last.fm'
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: '/auth/facebook', className: 'btn btn-block btn-facebook btn-social' },
	              _react2.default.createElement('i', { className: 'fa fa-facebook' }),
	              'Sign in with Facebook'
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: '/auth/google', className: 'btn btn-block btn-google btn-social' },
	              _react2.default.createElement('i', { className: 'fa fa-google-plus' }),
	              'Sign in with Google'
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: '/auth/github', className: 'btn btn-block btn-github btn-social' },
	              _react2.default.createElement('i', { className: 'fa fa-github' }),
	              'Sign in with GitHub'
	            ),
	            _react2.default.createElement(
	              'a',
	              { href: '/auth/instagram', className: 'btn btn-block btn-instagram btn-social' },
	              _react2.default.createElement('i', { className: 'fa fa-instagram' }),
	              'Sign in with Instagram'
	            )
	          )
	        )
	      )
	    );
	  }
	});
	
	exports.default = Login;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _userStore = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SignUp = _react2.default.createClass({
	  displayName: 'SignUp',
	
	  contextTypes: {
	    router: _react2.default.PropTypes.object.isRequired
	  },
	  getInitialState: function getInitialState() {
	    return _userStore.userStore.getState();
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;
	
	    _userStore.userStore.subscribe(function (data) {
	      var state = _extends({}, _userStore.userStore.getState());
	      _this.setState(state, function () {
	        if (state.logged_in) _this.context.router.replace('/');
	      });
	    });
	  },
	  onSubmit: function onSubmit(evt) {
	    evt.preventDefault();
	    (0, _userStore.submitSignup)(this.refs.form);
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(
	        'div',
	        { className: 'page-header' },
	        _react2.default.createElement(
	          'h3',
	          null,
	          'Sign up'
	        )
	      ),
	      _react2.default.createElement(
	        'form',
	        { ref: 'form', id: 'signup-form', onSubmit: this.onSubmit, className: 'form-horizontal' },
	        _react2.default.createElement('input', { type: 'hidden', name: '_csrf', value: $('#csrf').attr('value') }),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'email', className: 'col-sm-3 control-label' },
	            'Email'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-7' },
	            _react2.default.createElement('input', { type: 'email', name: 'email', id: 'email', placeholder: 'Email', autofocus: 'autofocus', className: 'form-control' })
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'password', className: 'col-sm-3 control-label' },
	            'Password'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-7' },
	            _react2.default.createElement('input', { type: 'password', name: 'password', id: 'password', placeholder: 'Password', className: 'form-control' })
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            { htmlFor: 'confirmPassword', className: 'col-sm-3 control-label' },
	            'Confirm Password'
	          ),
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-7' },
	            _react2.default.createElement('input', { type: 'password', name: 'confirmPassword', id: 'confirmPassword', placeholder: 'Confirm Password', className: 'form-control' })
	          )
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'div',
	            { className: 'col-sm-offset-3 col-sm-7' },
	            _react2.default.createElement(
	              'button',
	              { type: 'submit', className: 'btn btn-success' },
	              _react2.default.createElement('i', { className: 'fa fa-user-plus' }),
	              'Signup'
	            )
	          )
	        )
	      )
	    );
	  }
	});
	
	exports.default = SignUp;

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("react-bootstrap");

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(11);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(20);
	
	var _github = __webpack_require__(14);
	
	var _github2 = _interopRequireDefault(_github);
	
	var _favicon = __webpack_require__(35);
	
	var _favicon2 = _interopRequireDefault(_favicon);
	
	var _header = __webpack_require__(21);
	
	var _header2 = _interopRequireDefault(_header);
	
	var _footer = __webpack_require__(25);
	
	var _footer2 = _interopRequireDefault(_footer);
	
	var _reactInlineCss = __webpack_require__(36);
	
	var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);
	
	var _reactTransmit = __webpack_require__(13);
	
	var _reactTransmit2 = _interopRequireDefault(_reactTransmit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// var App = React.createClass({
	//   render(){
	//     return (
	//       <div>
	//         <Header ref={'header'} />
	
	//         <div className={'container'}>
	//          {React.cloneElement(this.props.children, {
	//            key: this.props.location.pathname
	//          })}
	//         </div>
	//         <Footer/>
	//       </div>
	//     );
	//   }
	// });
	
	// export default App;
	
	var stylesheet = __webpack_require__(37);
	
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
	 * App React application entry-point for both the server and client.
	 */
	
	var App = function (_React$Component) {
	  _inherits(App, _React$Component);
	
	  function App() {
	    _classCallCheck(this, App);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
	  }
	
	  _createClass(App, [{
	    key: 'componentWillMount',
	
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
	    key: 'componentDidUpdate',
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
	    key: 'loadMoreStargazersOnClient',
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
	    key: 'render',
	    value: function render() {
	      var repositoryUrl = "https://github.com/RickWong/react-isomorphic-starterkit";
	      var avatarSize = 32;
	      var avatarUrl = function avatarUrl(id) {
	        return 'https://avatars.githubusercontent.com/u/' + id + '?v=3&s=' + avatarSize;
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
	        { stylesheet: stylesheet, namespace: 'App' },
	        _react2.default.createElement(_header2.default, { ref: 'header' }),
	        _react2.default.createElement(
	          'div',
	          { className: 'container' },
	          _react2.default.cloneElement(this.props.children, {
	            key: this.props.location.pathname
	          }),
	          _react2.default.createElement(
	            'div',
	            { className: 'row' },
	            stargazers && stargazers.map(function (user) {
	              return _react2.default.createElement(
	                'a',
	                { key: user.id, href: "https://github.com/" + user.login, title: user.login, target: '_blank' },
	                _react2.default.createElement('img', { className: 'avatar', src: avatarUrl(user.id), alt: user.login })
	              );
	            })
	          )
	        ),
	        _react2.default.createElement(_footer2.default, null)
	      );
	    }
	  }]);
	
	  return App;
	}(_react2.default.Component);
	
	/**
	 * Use Transmit to query and return GitHub stargazers as a Promise.
	 */
	
	
	exports.default = _reactTransmit2.default.createContainer(App, {
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
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/favicon.ico";

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("react-inline-css");

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = "@charset \"UTF-8\";\n@import url(\"http://fonts.googleapis.com/css?family=Montserrat:400,700\");\n/*!\n * Bootstrap v3.3.6 (http://getbootstrap.com)\n * Copyright 2011-2015 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden],\ntemplate {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active,\na:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb,\nstrong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  a[href]:after {\n    content: \" (\" attr(href) \")\"; }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\"; }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\"; }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  img {\n    max-width: 100% !important; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; }\n  .navbar {\n    display: none; }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important; }\n  .label {\n    border: 1px solid #000; }\n  .table {\n    border-collapse: collapse !important; }\n    .table td,\n    .table th {\n      background-color: #fff !important; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important; } }\n\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url(\"../fonts/glyphicons-halflings-regular.eot\");\n  src: url(\"../fonts/glyphicons-halflings-regular.eot?#iefix\") format(\"embedded-opentype\"), url(\"../fonts/glyphicons-halflings-regular.woff2\") format(\"woff2\"), url(\"../fonts/glyphicons-halflings-regular.woff\") format(\"woff\"), url(\"../fonts/glyphicons-halflings-regular.ttf\") format(\"truetype\"), url(\"../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular\") format(\"svg\"); }\n\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.glyphicon-asterisk:before {\n  content: \"\\002a\"; }\n\n.glyphicon-plus:before {\n  content: \"\\002b\"; }\n\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20ac\"; }\n\n.glyphicon-minus:before {\n  content: \"\\2212\"; }\n\n.glyphicon-cloud:before {\n  content: \"\\2601\"; }\n\n.glyphicon-envelope:before {\n  content: \"\\2709\"; }\n\n.glyphicon-pencil:before {\n  content: \"\\270f\"; }\n\n.glyphicon-glass:before {\n  content: \"\\e001\"; }\n\n.glyphicon-music:before {\n  content: \"\\e002\"; }\n\n.glyphicon-search:before {\n  content: \"\\e003\"; }\n\n.glyphicon-heart:before {\n  content: \"\\e005\"; }\n\n.glyphicon-star:before {\n  content: \"\\e006\"; }\n\n.glyphicon-star-empty:before {\n  content: \"\\e007\"; }\n\n.glyphicon-user:before {\n  content: \"\\e008\"; }\n\n.glyphicon-film:before {\n  content: \"\\e009\"; }\n\n.glyphicon-th-large:before {\n  content: \"\\e010\"; }\n\n.glyphicon-th:before {\n  content: \"\\e011\"; }\n\n.glyphicon-th-list:before {\n  content: \"\\e012\"; }\n\n.glyphicon-ok:before {\n  content: \"\\e013\"; }\n\n.glyphicon-remove:before {\n  content: \"\\e014\"; }\n\n.glyphicon-zoom-in:before {\n  content: \"\\e015\"; }\n\n.glyphicon-zoom-out:before {\n  content: \"\\e016\"; }\n\n.glyphicon-off:before {\n  content: \"\\e017\"; }\n\n.glyphicon-signal:before {\n  content: \"\\e018\"; }\n\n.glyphicon-cog:before {\n  content: \"\\e019\"; }\n\n.glyphicon-trash:before {\n  content: \"\\e020\"; }\n\n.glyphicon-home:before {\n  content: \"\\e021\"; }\n\n.glyphicon-file:before {\n  content: \"\\e022\"; }\n\n.glyphicon-time:before {\n  content: \"\\e023\"; }\n\n.glyphicon-road:before {\n  content: \"\\e024\"; }\n\n.glyphicon-download-alt:before {\n  content: \"\\e025\"; }\n\n.glyphicon-download:before {\n  content: \"\\e026\"; }\n\n.glyphicon-upload:before {\n  content: \"\\e027\"; }\n\n.glyphicon-inbox:before {\n  content: \"\\e028\"; }\n\n.glyphicon-play-circle:before {\n  content: \"\\e029\"; }\n\n.glyphicon-repeat:before {\n  content: \"\\e030\"; }\n\n.glyphicon-refresh:before {\n  content: \"\\e031\"; }\n\n.glyphicon-list-alt:before {\n  content: \"\\e032\"; }\n\n.glyphicon-lock:before {\n  content: \"\\e033\"; }\n\n.glyphicon-flag:before {\n  content: \"\\e034\"; }\n\n.glyphicon-headphones:before {\n  content: \"\\e035\"; }\n\n.glyphicon-volume-off:before {\n  content: \"\\e036\"; }\n\n.glyphicon-volume-down:before {\n  content: \"\\e037\"; }\n\n.glyphicon-volume-up:before {\n  content: \"\\e038\"; }\n\n.glyphicon-qrcode:before {\n  content: \"\\e039\"; }\n\n.glyphicon-barcode:before {\n  content: \"\\e040\"; }\n\n.glyphicon-tag:before {\n  content: \"\\e041\"; }\n\n.glyphicon-tags:before {\n  content: \"\\e042\"; }\n\n.glyphicon-book:before {\n  content: \"\\e043\"; }\n\n.glyphicon-bookmark:before {\n  content: \"\\e044\"; }\n\n.glyphicon-print:before {\n  content: \"\\e045\"; }\n\n.glyphicon-camera:before {\n  content: \"\\e046\"; }\n\n.glyphicon-font:before {\n  content: \"\\e047\"; }\n\n.glyphicon-bold:before {\n  content: \"\\e048\"; }\n\n.glyphicon-italic:before {\n  content: \"\\e049\"; }\n\n.glyphicon-text-height:before {\n  content: \"\\e050\"; }\n\n.glyphicon-text-width:before {\n  content: \"\\e051\"; }\n\n.glyphicon-align-left:before {\n  content: \"\\e052\"; }\n\n.glyphicon-align-center:before {\n  content: \"\\e053\"; }\n\n.glyphicon-align-right:before {\n  content: \"\\e054\"; }\n\n.glyphicon-align-justify:before {\n  content: \"\\e055\"; }\n\n.glyphicon-list:before {\n  content: \"\\e056\"; }\n\n.glyphicon-indent-left:before {\n  content: \"\\e057\"; }\n\n.glyphicon-indent-right:before {\n  content: \"\\e058\"; }\n\n.glyphicon-facetime-video:before {\n  content: \"\\e059\"; }\n\n.glyphicon-picture:before {\n  content: \"\\e060\"; }\n\n.glyphicon-map-marker:before {\n  content: \"\\e062\"; }\n\n.glyphicon-adjust:before {\n  content: \"\\e063\"; }\n\n.glyphicon-tint:before {\n  content: \"\\e064\"; }\n\n.glyphicon-edit:before {\n  content: \"\\e065\"; }\n\n.glyphicon-share:before {\n  content: \"\\e066\"; }\n\n.glyphicon-check:before {\n  content: \"\\e067\"; }\n\n.glyphicon-move:before {\n  content: \"\\e068\"; }\n\n.glyphicon-step-backward:before {\n  content: \"\\e069\"; }\n\n.glyphicon-fast-backward:before {\n  content: \"\\e070\"; }\n\n.glyphicon-backward:before {\n  content: \"\\e071\"; }\n\n.glyphicon-play:before {\n  content: \"\\e072\"; }\n\n.glyphicon-pause:before {\n  content: \"\\e073\"; }\n\n.glyphicon-stop:before {\n  content: \"\\e074\"; }\n\n.glyphicon-forward:before {\n  content: \"\\e075\"; }\n\n.glyphicon-fast-forward:before {\n  content: \"\\e076\"; }\n\n.glyphicon-step-forward:before {\n  content: \"\\e077\"; }\n\n.glyphicon-eject:before {\n  content: \"\\e078\"; }\n\n.glyphicon-chevron-left:before {\n  content: \"\\e079\"; }\n\n.glyphicon-chevron-right:before {\n  content: \"\\e080\"; }\n\n.glyphicon-plus-sign:before {\n  content: \"\\e081\"; }\n\n.glyphicon-minus-sign:before {\n  content: \"\\e082\"; }\n\n.glyphicon-remove-sign:before {\n  content: \"\\e083\"; }\n\n.glyphicon-ok-sign:before {\n  content: \"\\e084\"; }\n\n.glyphicon-question-sign:before {\n  content: \"\\e085\"; }\n\n.glyphicon-info-sign:before {\n  content: \"\\e086\"; }\n\n.glyphicon-screenshot:before {\n  content: \"\\e087\"; }\n\n.glyphicon-remove-circle:before {\n  content: \"\\e088\"; }\n\n.glyphicon-ok-circle:before {\n  content: \"\\e089\"; }\n\n.glyphicon-ban-circle:before {\n  content: \"\\e090\"; }\n\n.glyphicon-arrow-left:before {\n  content: \"\\e091\"; }\n\n.glyphicon-arrow-right:before {\n  content: \"\\e092\"; }\n\n.glyphicon-arrow-up:before {\n  content: \"\\e093\"; }\n\n.glyphicon-arrow-down:before {\n  content: \"\\e094\"; }\n\n.glyphicon-share-alt:before {\n  content: \"\\e095\"; }\n\n.glyphicon-resize-full:before {\n  content: \"\\e096\"; }\n\n.glyphicon-resize-small:before {\n  content: \"\\e097\"; }\n\n.glyphicon-exclamation-sign:before {\n  content: \"\\e101\"; }\n\n.glyphicon-gift:before {\n  content: \"\\e102\"; }\n\n.glyphicon-leaf:before {\n  content: \"\\e103\"; }\n\n.glyphicon-fire:before {\n  content: \"\\e104\"; }\n\n.glyphicon-eye-open:before {\n  content: \"\\e105\"; }\n\n.glyphicon-eye-close:before {\n  content: \"\\e106\"; }\n\n.glyphicon-warning-sign:before {\n  content: \"\\e107\"; }\n\n.glyphicon-plane:before {\n  content: \"\\e108\"; }\n\n.glyphicon-calendar:before {\n  content: \"\\e109\"; }\n\n.glyphicon-random:before {\n  content: \"\\e110\"; }\n\n.glyphicon-comment:before {\n  content: \"\\e111\"; }\n\n.glyphicon-magnet:before {\n  content: \"\\e112\"; }\n\n.glyphicon-chevron-up:before {\n  content: \"\\e113\"; }\n\n.glyphicon-chevron-down:before {\n  content: \"\\e114\"; }\n\n.glyphicon-retweet:before {\n  content: \"\\e115\"; }\n\n.glyphicon-shopping-cart:before {\n  content: \"\\e116\"; }\n\n.glyphicon-folder-close:before {\n  content: \"\\e117\"; }\n\n.glyphicon-folder-open:before {\n  content: \"\\e118\"; }\n\n.glyphicon-resize-vertical:before {\n  content: \"\\e119\"; }\n\n.glyphicon-resize-horizontal:before {\n  content: \"\\e120\"; }\n\n.glyphicon-hdd:before {\n  content: \"\\e121\"; }\n\n.glyphicon-bullhorn:before {\n  content: \"\\e122\"; }\n\n.glyphicon-bell:before {\n  content: \"\\e123\"; }\n\n.glyphicon-certificate:before {\n  content: \"\\e124\"; }\n\n.glyphicon-thumbs-up:before {\n  content: \"\\e125\"; }\n\n.glyphicon-thumbs-down:before {\n  content: \"\\e126\"; }\n\n.glyphicon-hand-right:before {\n  content: \"\\e127\"; }\n\n.glyphicon-hand-left:before {\n  content: \"\\e128\"; }\n\n.glyphicon-hand-up:before {\n  content: \"\\e129\"; }\n\n.glyphicon-hand-down:before {\n  content: \"\\e130\"; }\n\n.glyphicon-circle-arrow-right:before {\n  content: \"\\e131\"; }\n\n.glyphicon-circle-arrow-left:before {\n  content: \"\\e132\"; }\n\n.glyphicon-circle-arrow-up:before {\n  content: \"\\e133\"; }\n\n.glyphicon-circle-arrow-down:before {\n  content: \"\\e134\"; }\n\n.glyphicon-globe:before {\n  content: \"\\e135\"; }\n\n.glyphicon-wrench:before {\n  content: \"\\e136\"; }\n\n.glyphicon-tasks:before {\n  content: \"\\e137\"; }\n\n.glyphicon-filter:before {\n  content: \"\\e138\"; }\n\n.glyphicon-briefcase:before {\n  content: \"\\e139\"; }\n\n.glyphicon-fullscreen:before {\n  content: \"\\e140\"; }\n\n.glyphicon-dashboard:before {\n  content: \"\\e141\"; }\n\n.glyphicon-paperclip:before {\n  content: \"\\e142\"; }\n\n.glyphicon-heart-empty:before {\n  content: \"\\e143\"; }\n\n.glyphicon-link:before {\n  content: \"\\e144\"; }\n\n.glyphicon-phone:before {\n  content: \"\\e145\"; }\n\n.glyphicon-pushpin:before {\n  content: \"\\e146\"; }\n\n.glyphicon-usd:before {\n  content: \"\\e148\"; }\n\n.glyphicon-gbp:before {\n  content: \"\\e149\"; }\n\n.glyphicon-sort:before {\n  content: \"\\e150\"; }\n\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\e151\"; }\n\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\e152\"; }\n\n.glyphicon-sort-by-order:before {\n  content: \"\\e153\"; }\n\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\e154\"; }\n\n.glyphicon-sort-by-attributes:before {\n  content: \"\\e155\"; }\n\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\e156\"; }\n\n.glyphicon-unchecked:before {\n  content: \"\\e157\"; }\n\n.glyphicon-expand:before {\n  content: \"\\e158\"; }\n\n.glyphicon-collapse-down:before {\n  content: \"\\e159\"; }\n\n.glyphicon-collapse-up:before {\n  content: \"\\e160\"; }\n\n.glyphicon-log-in:before {\n  content: \"\\e161\"; }\n\n.glyphicon-flash:before {\n  content: \"\\e162\"; }\n\n.glyphicon-log-out:before {\n  content: \"\\e163\"; }\n\n.glyphicon-new-window:before {\n  content: \"\\e164\"; }\n\n.glyphicon-record:before {\n  content: \"\\e165\"; }\n\n.glyphicon-save:before {\n  content: \"\\e166\"; }\n\n.glyphicon-open:before {\n  content: \"\\e167\"; }\n\n.glyphicon-saved:before {\n  content: \"\\e168\"; }\n\n.glyphicon-import:before {\n  content: \"\\e169\"; }\n\n.glyphicon-export:before {\n  content: \"\\e170\"; }\n\n.glyphicon-send:before {\n  content: \"\\e171\"; }\n\n.glyphicon-floppy-disk:before {\n  content: \"\\e172\"; }\n\n.glyphicon-floppy-saved:before {\n  content: \"\\e173\"; }\n\n.glyphicon-floppy-remove:before {\n  content: \"\\e174\"; }\n\n.glyphicon-floppy-save:before {\n  content: \"\\e175\"; }\n\n.glyphicon-floppy-open:before {\n  content: \"\\e176\"; }\n\n.glyphicon-credit-card:before {\n  content: \"\\e177\"; }\n\n.glyphicon-transfer:before {\n  content: \"\\e178\"; }\n\n.glyphicon-cutlery:before {\n  content: \"\\e179\"; }\n\n.glyphicon-header:before {\n  content: \"\\e180\"; }\n\n.glyphicon-compressed:before {\n  content: \"\\e181\"; }\n\n.glyphicon-earphone:before {\n  content: \"\\e182\"; }\n\n.glyphicon-phone-alt:before {\n  content: \"\\e183\"; }\n\n.glyphicon-tower:before {\n  content: \"\\e184\"; }\n\n.glyphicon-stats:before {\n  content: \"\\e185\"; }\n\n.glyphicon-sd-video:before {\n  content: \"\\e186\"; }\n\n.glyphicon-hd-video:before {\n  content: \"\\e187\"; }\n\n.glyphicon-subtitles:before {\n  content: \"\\e188\"; }\n\n.glyphicon-sound-stereo:before {\n  content: \"\\e189\"; }\n\n.glyphicon-sound-dolby:before {\n  content: \"\\e190\"; }\n\n.glyphicon-sound-5-1:before {\n  content: \"\\e191\"; }\n\n.glyphicon-sound-6-1:before {\n  content: \"\\e192\"; }\n\n.glyphicon-sound-7-1:before {\n  content: \"\\e193\"; }\n\n.glyphicon-copyright-mark:before {\n  content: \"\\e194\"; }\n\n.glyphicon-registration-mark:before {\n  content: \"\\e195\"; }\n\n.glyphicon-cloud-download:before {\n  content: \"\\e197\"; }\n\n.glyphicon-cloud-upload:before {\n  content: \"\\e198\"; }\n\n.glyphicon-tree-conifer:before {\n  content: \"\\e199\"; }\n\n.glyphicon-tree-deciduous:before {\n  content: \"\\e200\"; }\n\n.glyphicon-cd:before {\n  content: \"\\e201\"; }\n\n.glyphicon-save-file:before {\n  content: \"\\e202\"; }\n\n.glyphicon-open-file:before {\n  content: \"\\e203\"; }\n\n.glyphicon-level-up:before {\n  content: \"\\e204\"; }\n\n.glyphicon-copy:before {\n  content: \"\\e205\"; }\n\n.glyphicon-paste:before {\n  content: \"\\e206\"; }\n\n.glyphicon-alert:before {\n  content: \"\\e209\"; }\n\n.glyphicon-equalizer:before {\n  content: \"\\e210\"; }\n\n.glyphicon-king:before {\n  content: \"\\e211\"; }\n\n.glyphicon-queen:before {\n  content: \"\\e212\"; }\n\n.glyphicon-pawn:before {\n  content: \"\\e213\"; }\n\n.glyphicon-bishop:before {\n  content: \"\\e214\"; }\n\n.glyphicon-knight:before {\n  content: \"\\e215\"; }\n\n.glyphicon-baby-formula:before {\n  content: \"\\e216\"; }\n\n.glyphicon-tent:before {\n  content: \"\\26fa\"; }\n\n.glyphicon-blackboard:before {\n  content: \"\\e218\"; }\n\n.glyphicon-bed:before {\n  content: \"\\e219\"; }\n\n.glyphicon-apple:before {\n  content: \"\\f8ff\"; }\n\n.glyphicon-erase:before {\n  content: \"\\e221\"; }\n\n.glyphicon-hourglass:before {\n  content: \"\\231b\"; }\n\n.glyphicon-lamp:before {\n  content: \"\\e223\"; }\n\n.glyphicon-duplicate:before {\n  content: \"\\e224\"; }\n\n.glyphicon-piggy-bank:before {\n  content: \"\\e225\"; }\n\n.glyphicon-scissors:before {\n  content: \"\\e226\"; }\n\n.glyphicon-bitcoin:before {\n  content: \"\\e227\"; }\n\n.glyphicon-btc:before {\n  content: \"\\e227\"; }\n\n.glyphicon-xbt:before {\n  content: \"\\e227\"; }\n\n.glyphicon-yen:before {\n  content: \"\\00a5\"; }\n\n.glyphicon-jpy:before {\n  content: \"\\00a5\"; }\n\n.glyphicon-ruble:before {\n  content: \"\\20bd\"; }\n\n.glyphicon-rub:before {\n  content: \"\\20bd\"; }\n\n.glyphicon-scale:before {\n  content: \"\\e230\"; }\n\n.glyphicon-ice-lolly:before {\n  content: \"\\e231\"; }\n\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\e232\"; }\n\n.glyphicon-education:before {\n  content: \"\\e233\"; }\n\n.glyphicon-option-horizontal:before {\n  content: \"\\e234\"; }\n\n.glyphicon-option-vertical:before {\n  content: \"\\e235\"; }\n\n.glyphicon-menu-hamburger:before {\n  content: \"\\e236\"; }\n\n.glyphicon-modal-window:before {\n  content: \"\\e237\"; }\n\n.glyphicon-oil:before {\n  content: \"\\e238\"; }\n\n.glyphicon-grain:before {\n  content: \"\\e239\"; }\n\n.glyphicon-sunglasses:before {\n  content: \"\\e240\"; }\n\n.glyphicon-text-size:before {\n  content: \"\\e241\"; }\n\n.glyphicon-text-color:before {\n  content: \"\\e242\"; }\n\n.glyphicon-text-background:before {\n  content: \"\\e243\"; }\n\n.glyphicon-object-align-top:before {\n  content: \"\\e244\"; }\n\n.glyphicon-object-align-bottom:before {\n  content: \"\\e245\"; }\n\n.glyphicon-object-align-horizontal:before {\n  content: \"\\e246\"; }\n\n.glyphicon-object-align-left:before {\n  content: \"\\e247\"; }\n\n.glyphicon-object-align-vertical:before {\n  content: \"\\e248\"; }\n\n.glyphicon-object-align-right:before {\n  content: \"\\e249\"; }\n\n.glyphicon-triangle-right:before {\n  content: \"\\e250\"; }\n\n.glyphicon-triangle-left:before {\n  content: \"\\e251\"; }\n\n.glyphicon-triangle-bottom:before {\n  content: \"\\e252\"; }\n\n.glyphicon-triangle-top:before {\n  content: \"\\e253\"; }\n\n.glyphicon-console:before {\n  content: \"\\e254\"; }\n\n.glyphicon-superscript:before {\n  content: \"\\e255\"; }\n\n.glyphicon-subscript:before {\n  content: \"\\e256\"; }\n\n.glyphicon-menu-left:before {\n  content: \"\\e257\"; }\n\n.glyphicon-menu-right:before {\n  content: \"\\e258\"; }\n\n.glyphicon-menu-down:before {\n  content: \"\\e259\"; }\n\n.glyphicon-menu-up:before {\n  content: \"\\e260\"; }\n\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: transparent; }\n\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 13px;\n  line-height: 1.42857;\n  color: #121212;\n  background-color: #fff; }\n\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\na {\n  color: #2ac5ee;\n  text-decoration: none; }\n  a:hover, a:focus {\n    color: #121212;\n    text-decoration: underline; }\n  a:focus {\n    outline: thin dotted;\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  vertical-align: middle; }\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto; }\n\n.img-rounded {\n  border-radius: 6px; }\n\n.img-thumbnail {\n  padding: 4px;\n  line-height: 1.42857;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: all 0.2s ease-in-out;\n  -o-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  display: inline-block;\n  max-width: 100%;\n  height: auto; }\n\n.img-circle {\n  border-radius: 50%; }\n\nhr {\n  margin-top: 18px;\n  margin-bottom: 18px;\n  border: 0;\n  border-top: 1px solid #f5f5f5; }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n\n[role=\"button\"] {\n  cursor: pointer; }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  font-family: \"Montserrat\", sans-serif;\n  font-weight: 700;\n  line-height: 1.1;\n  color: inherit; }\n  h1 small,\n  h1 .small, h2 small,\n  h2 .small, h3 small,\n  h3 .small, h4 small,\n  h4 .small, h5 small,\n  h5 .small, h6 small,\n  h6 .small,\n  .h1 small,\n  .h1 .small, .h2 small,\n  .h2 .small, .h3 small,\n  .h3 .small, .h4 small,\n  .h4 .small, .h5 small,\n  .h5 .small, .h6 small,\n  .h6 .small {\n    font-weight: normal;\n    line-height: 1;\n    color: #e0e0e0; }\n\nh1, .h1,\nh2, .h2,\nh3, .h3 {\n  margin-top: 18px;\n  margin-bottom: 9px; }\n  h1 small,\n  h1 .small, .h1 small,\n  .h1 .small,\n  h2 small,\n  h2 .small, .h2 small,\n  .h2 .small,\n  h3 small,\n  h3 .small, .h3 small,\n  .h3 .small {\n    font-size: 65%; }\n\nh4, .h4,\nh5, .h5,\nh6, .h6 {\n  margin-top: 9px;\n  margin-bottom: 9px; }\n  h4 small,\n  h4 .small, .h4 small,\n  .h4 .small,\n  h5 small,\n  h5 .small, .h5 small,\n  .h5 .small,\n  h6 small,\n  h6 .small, .h6 small,\n  .h6 .small {\n    font-size: 75%; }\n\nh1, .h1 {\n  font-size: 33px; }\n\nh2, .h2 {\n  font-size: 27px; }\n\nh3, .h3 {\n  font-size: 23px; }\n\nh4, .h4 {\n  font-size: 17px; }\n\nh5, .h5 {\n  font-size: 13px; }\n\nh6, .h6 {\n  font-size: 12px; }\n\np {\n  margin: 0 0 9px; }\n\n.lead {\n  margin-bottom: 18px;\n  font-size: 14px;\n  font-weight: 300;\n  line-height: 1.4; }\n  @media (min-width: 768px) {\n    .lead {\n      font-size: 19.5px; } }\n\nsmall,\n.small {\n  font-size: 92%; }\n\nmark,\n.mark {\n  background-color: #f4b400;\n  padding: .2em; }\n\n.text-left {\n  text-align: left; }\n\n.text-right {\n  text-align: right; }\n\n.text-center {\n  text-align: center; }\n\n.text-justify {\n  text-align: justify; }\n\n.text-nowrap {\n  white-space: nowrap; }\n\n.text-lowercase {\n  text-transform: lowercase; }\n\n.text-uppercase, .initialism {\n  text-transform: uppercase; }\n\n.text-capitalize {\n  text-transform: capitalize; }\n\n.text-muted {\n  color: #e0e0e0; }\n\n.text-primary {\n  color: #2ac5ee; }\n\na.text-primary:hover,\na.text-primary:focus {\n  color: #11abd4; }\n\n.text-success {\n  color: #3c763d; }\n\na.text-success:hover,\na.text-success:focus {\n  color: #2b542c; }\n\n.text-info {\n  color: #31708f; }\n\na.text-info:hover,\na.text-info:focus {\n  color: #245269; }\n\n.text-warning {\n  color: #8a6d3b; }\n\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c; }\n\n.text-danger {\n  color: #a94442; }\n\na.text-danger:hover,\na.text-danger:focus {\n  color: #843534; }\n\n.bg-primary {\n  color: #fff; }\n\n.bg-primary {\n  background-color: #2ac5ee; }\n\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #11abd4; }\n\n.bg-success {\n  background-color: #0f9d58; }\n\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #0b6e3e; }\n\n.bg-info {\n  background-color: #2ac5ee; }\n\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #11abd4; }\n\n.bg-warning {\n  background-color: #f4b400; }\n\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #c18e00; }\n\n.bg-danger {\n  background-color: #d80017; }\n\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #a50012; }\n\n.page-header {\n  padding-bottom: 8px;\n  margin: 36px 0 18px;\n  border-bottom: 1px solid #f5f5f5; }\n\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 9px; }\n  ul ul,\n  ul ol,\n  ol ul,\n  ol ol {\n    margin-bottom: 0; }\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px; }\n  .list-inline > li {\n    display: inline-block;\n    padding-left: 5px;\n    padding-right: 5px; }\n\ndl {\n  margin-top: 0;\n  margin-bottom: 18px; }\n\ndt,\ndd {\n  line-height: 1.42857; }\n\ndt {\n  font-weight: bold; }\n\ndd {\n  margin-left: 0; }\n\n.dl-horizontal dd:before, .dl-horizontal dd:after {\n  content: \" \";\n  display: table; }\n\n.dl-horizontal dd:after {\n  clear: both; }\n\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    clear: left;\n    text-align: right;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n  .dl-horizontal dd {\n    margin-left: 180px; } }\n\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #e0e0e0; }\n\n.initialism {\n  font-size: 90%; }\n\nblockquote {\n  padding: 9px 18px;\n  margin: 0 0 18px;\n  font-size: 16.25px;\n  border-left: 5px solid #f5f5f5; }\n  blockquote p:last-child,\n  blockquote ul:last-child,\n  blockquote ol:last-child {\n    margin-bottom: 0; }\n  blockquote footer,\n  blockquote small,\n  blockquote .small {\n    display: block;\n    font-size: 80%;\n    line-height: 1.42857;\n    color: #e0e0e0; }\n    blockquote footer:before,\n    blockquote small:before,\n    blockquote .small:before {\n      content: '\\2014 \\00A0'; }\n\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  border-right: 5px solid #f5f5f5;\n  border-left: 0;\n  text-align: right; }\n  .blockquote-reverse footer:before,\n  .blockquote-reverse small:before,\n  .blockquote-reverse .small:before,\n  blockquote.pull-right footer:before,\n  blockquote.pull-right small:before,\n  blockquote.pull-right .small:before {\n    content: ''; }\n  .blockquote-reverse footer:after,\n  .blockquote-reverse small:after,\n  .blockquote-reverse .small:after,\n  blockquote.pull-right footer:after,\n  blockquote.pull-right small:after,\n  blockquote.pull-right .small:after {\n    content: '\\00A0 \\2014'; }\n\naddress {\n  margin-bottom: 18px;\n  font-style: normal;\n  line-height: 1.42857; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #c7254e;\n  background-color: #f9f2f4;\n  border-radius: 4px; }\n\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25); }\n  kbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: bold;\n    box-shadow: none; }\n\npre {\n  display: block;\n  padding: 8.5px;\n  margin: 0 0 9px;\n  font-size: 12px;\n  line-height: 1.42857;\n  word-break: break-all;\n  word-wrap: break-word;\n  color: #404040;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px; }\n  pre code {\n    padding: 0;\n    font-size: inherit;\n    color: inherit;\n    white-space: pre-wrap;\n    background-color: transparent;\n    border-radius: 0; }\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll; }\n\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .container:before, .container:after {\n    content: \" \";\n    display: table; }\n  .container:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .container {\n      width: 750px; } }\n  @media (min-width: 992px) {\n    .container {\n      width: 970px; } }\n  @media (min-width: 1200px) {\n    .container {\n      width: 1170px; } }\n\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .container-fluid:before, .container-fluid:after {\n    content: \" \";\n    display: table; }\n  .container-fluid:after {\n    clear: both; }\n\n.row {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .row:before, .row:after {\n    content: \" \";\n    display: table; }\n  .row:after {\n    clear: both; }\n\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px; }\n\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left; }\n\n.col-xs-1 {\n  width: 8.33333%; }\n\n.col-xs-2 {\n  width: 16.66667%; }\n\n.col-xs-3 {\n  width: 25%; }\n\n.col-xs-4 {\n  width: 33.33333%; }\n\n.col-xs-5 {\n  width: 41.66667%; }\n\n.col-xs-6 {\n  width: 50%; }\n\n.col-xs-7 {\n  width: 58.33333%; }\n\n.col-xs-8 {\n  width: 66.66667%; }\n\n.col-xs-9 {\n  width: 75%; }\n\n.col-xs-10 {\n  width: 83.33333%; }\n\n.col-xs-11 {\n  width: 91.66667%; }\n\n.col-xs-12 {\n  width: 100%; }\n\n.col-xs-pull-0 {\n  right: auto; }\n\n.col-xs-pull-1 {\n  right: 8.33333%; }\n\n.col-xs-pull-2 {\n  right: 16.66667%; }\n\n.col-xs-pull-3 {\n  right: 25%; }\n\n.col-xs-pull-4 {\n  right: 33.33333%; }\n\n.col-xs-pull-5 {\n  right: 41.66667%; }\n\n.col-xs-pull-6 {\n  right: 50%; }\n\n.col-xs-pull-7 {\n  right: 58.33333%; }\n\n.col-xs-pull-8 {\n  right: 66.66667%; }\n\n.col-xs-pull-9 {\n  right: 75%; }\n\n.col-xs-pull-10 {\n  right: 83.33333%; }\n\n.col-xs-pull-11 {\n  right: 91.66667%; }\n\n.col-xs-pull-12 {\n  right: 100%; }\n\n.col-xs-push-0 {\n  left: auto; }\n\n.col-xs-push-1 {\n  left: 8.33333%; }\n\n.col-xs-push-2 {\n  left: 16.66667%; }\n\n.col-xs-push-3 {\n  left: 25%; }\n\n.col-xs-push-4 {\n  left: 33.33333%; }\n\n.col-xs-push-5 {\n  left: 41.66667%; }\n\n.col-xs-push-6 {\n  left: 50%; }\n\n.col-xs-push-7 {\n  left: 58.33333%; }\n\n.col-xs-push-8 {\n  left: 66.66667%; }\n\n.col-xs-push-9 {\n  left: 75%; }\n\n.col-xs-push-10 {\n  left: 83.33333%; }\n\n.col-xs-push-11 {\n  left: 91.66667%; }\n\n.col-xs-push-12 {\n  left: 100%; }\n\n.col-xs-offset-0 {\n  margin-left: 0%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.33333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.66667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.33333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.66667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.33333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.66667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.33333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.66667%; }\n\n.col-xs-offset-12 {\n  margin-left: 100%; }\n\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left; }\n  .col-sm-1 {\n    width: 8.33333%; }\n  .col-sm-2 {\n    width: 16.66667%; }\n  .col-sm-3 {\n    width: 25%; }\n  .col-sm-4 {\n    width: 33.33333%; }\n  .col-sm-5 {\n    width: 41.66667%; }\n  .col-sm-6 {\n    width: 50%; }\n  .col-sm-7 {\n    width: 58.33333%; }\n  .col-sm-8 {\n    width: 66.66667%; }\n  .col-sm-9 {\n    width: 75%; }\n  .col-sm-10 {\n    width: 83.33333%; }\n  .col-sm-11 {\n    width: 91.66667%; }\n  .col-sm-12 {\n    width: 100%; }\n  .col-sm-pull-0 {\n    right: auto; }\n  .col-sm-pull-1 {\n    right: 8.33333%; }\n  .col-sm-pull-2 {\n    right: 16.66667%; }\n  .col-sm-pull-3 {\n    right: 25%; }\n  .col-sm-pull-4 {\n    right: 33.33333%; }\n  .col-sm-pull-5 {\n    right: 41.66667%; }\n  .col-sm-pull-6 {\n    right: 50%; }\n  .col-sm-pull-7 {\n    right: 58.33333%; }\n  .col-sm-pull-8 {\n    right: 66.66667%; }\n  .col-sm-pull-9 {\n    right: 75%; }\n  .col-sm-pull-10 {\n    right: 83.33333%; }\n  .col-sm-pull-11 {\n    right: 91.66667%; }\n  .col-sm-pull-12 {\n    right: 100%; }\n  .col-sm-push-0 {\n    left: auto; }\n  .col-sm-push-1 {\n    left: 8.33333%; }\n  .col-sm-push-2 {\n    left: 16.66667%; }\n  .col-sm-push-3 {\n    left: 25%; }\n  .col-sm-push-4 {\n    left: 33.33333%; }\n  .col-sm-push-5 {\n    left: 41.66667%; }\n  .col-sm-push-6 {\n    left: 50%; }\n  .col-sm-push-7 {\n    left: 58.33333%; }\n  .col-sm-push-8 {\n    left: 66.66667%; }\n  .col-sm-push-9 {\n    left: 75%; }\n  .col-sm-push-10 {\n    left: 83.33333%; }\n  .col-sm-push-11 {\n    left: 91.66667%; }\n  .col-sm-push-12 {\n    left: 100%; }\n  .col-sm-offset-0 {\n    margin-left: 0%; }\n  .col-sm-offset-1 {\n    margin-left: 8.33333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.66667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.33333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.66667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.33333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.66667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.33333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.66667%; }\n  .col-sm-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left; }\n  .col-md-1 {\n    width: 8.33333%; }\n  .col-md-2 {\n    width: 16.66667%; }\n  .col-md-3 {\n    width: 25%; }\n  .col-md-4 {\n    width: 33.33333%; }\n  .col-md-5 {\n    width: 41.66667%; }\n  .col-md-6 {\n    width: 50%; }\n  .col-md-7 {\n    width: 58.33333%; }\n  .col-md-8 {\n    width: 66.66667%; }\n  .col-md-9 {\n    width: 75%; }\n  .col-md-10 {\n    width: 83.33333%; }\n  .col-md-11 {\n    width: 91.66667%; }\n  .col-md-12 {\n    width: 100%; }\n  .col-md-pull-0 {\n    right: auto; }\n  .col-md-pull-1 {\n    right: 8.33333%; }\n  .col-md-pull-2 {\n    right: 16.66667%; }\n  .col-md-pull-3 {\n    right: 25%; }\n  .col-md-pull-4 {\n    right: 33.33333%; }\n  .col-md-pull-5 {\n    right: 41.66667%; }\n  .col-md-pull-6 {\n    right: 50%; }\n  .col-md-pull-7 {\n    right: 58.33333%; }\n  .col-md-pull-8 {\n    right: 66.66667%; }\n  .col-md-pull-9 {\n    right: 75%; }\n  .col-md-pull-10 {\n    right: 83.33333%; }\n  .col-md-pull-11 {\n    right: 91.66667%; }\n  .col-md-pull-12 {\n    right: 100%; }\n  .col-md-push-0 {\n    left: auto; }\n  .col-md-push-1 {\n    left: 8.33333%; }\n  .col-md-push-2 {\n    left: 16.66667%; }\n  .col-md-push-3 {\n    left: 25%; }\n  .col-md-push-4 {\n    left: 33.33333%; }\n  .col-md-push-5 {\n    left: 41.66667%; }\n  .col-md-push-6 {\n    left: 50%; }\n  .col-md-push-7 {\n    left: 58.33333%; }\n  .col-md-push-8 {\n    left: 66.66667%; }\n  .col-md-push-9 {\n    left: 75%; }\n  .col-md-push-10 {\n    left: 83.33333%; }\n  .col-md-push-11 {\n    left: 91.66667%; }\n  .col-md-push-12 {\n    left: 100%; }\n  .col-md-offset-0 {\n    margin-left: 0%; }\n  .col-md-offset-1 {\n    margin-left: 8.33333%; }\n  .col-md-offset-2 {\n    margin-left: 16.66667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.33333%; }\n  .col-md-offset-5 {\n    margin-left: 41.66667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.33333%; }\n  .col-md-offset-8 {\n    margin-left: 66.66667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.33333%; }\n  .col-md-offset-11 {\n    margin-left: 91.66667%; }\n  .col-md-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left; }\n  .col-lg-1 {\n    width: 8.33333%; }\n  .col-lg-2 {\n    width: 16.66667%; }\n  .col-lg-3 {\n    width: 25%; }\n  .col-lg-4 {\n    width: 33.33333%; }\n  .col-lg-5 {\n    width: 41.66667%; }\n  .col-lg-6 {\n    width: 50%; }\n  .col-lg-7 {\n    width: 58.33333%; }\n  .col-lg-8 {\n    width: 66.66667%; }\n  .col-lg-9 {\n    width: 75%; }\n  .col-lg-10 {\n    width: 83.33333%; }\n  .col-lg-11 {\n    width: 91.66667%; }\n  .col-lg-12 {\n    width: 100%; }\n  .col-lg-pull-0 {\n    right: auto; }\n  .col-lg-pull-1 {\n    right: 8.33333%; }\n  .col-lg-pull-2 {\n    right: 16.66667%; }\n  .col-lg-pull-3 {\n    right: 25%; }\n  .col-lg-pull-4 {\n    right: 33.33333%; }\n  .col-lg-pull-5 {\n    right: 41.66667%; }\n  .col-lg-pull-6 {\n    right: 50%; }\n  .col-lg-pull-7 {\n    right: 58.33333%; }\n  .col-lg-pull-8 {\n    right: 66.66667%; }\n  .col-lg-pull-9 {\n    right: 75%; }\n  .col-lg-pull-10 {\n    right: 83.33333%; }\n  .col-lg-pull-11 {\n    right: 91.66667%; }\n  .col-lg-pull-12 {\n    right: 100%; }\n  .col-lg-push-0 {\n    left: auto; }\n  .col-lg-push-1 {\n    left: 8.33333%; }\n  .col-lg-push-2 {\n    left: 16.66667%; }\n  .col-lg-push-3 {\n    left: 25%; }\n  .col-lg-push-4 {\n    left: 33.33333%; }\n  .col-lg-push-5 {\n    left: 41.66667%; }\n  .col-lg-push-6 {\n    left: 50%; }\n  .col-lg-push-7 {\n    left: 58.33333%; }\n  .col-lg-push-8 {\n    left: 66.66667%; }\n  .col-lg-push-9 {\n    left: 75%; }\n  .col-lg-push-10 {\n    left: 83.33333%; }\n  .col-lg-push-11 {\n    left: 91.66667%; }\n  .col-lg-push-12 {\n    left: 100%; }\n  .col-lg-offset-0 {\n    margin-left: 0%; }\n  .col-lg-offset-1 {\n    margin-left: 8.33333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.66667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.33333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.66667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.33333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.66667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.33333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.66667%; }\n  .col-lg-offset-12 {\n    margin-left: 100%; } }\n\ntable {\n  background-color: transparent; }\n\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #e0e0e0;\n  text-align: left; }\n\nth {\n  text-align: left; }\n\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 18px; }\n  .table > thead > tr > th,\n  .table > thead > tr > td,\n  .table > tbody > tr > th,\n  .table > tbody > tr > td,\n  .table > tfoot > tr > th,\n  .table > tfoot > tr > td {\n    padding: 8px;\n    line-height: 1.42857;\n    vertical-align: top;\n    border-top: 1px solid #ddd; }\n  .table > thead > tr > th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #ddd; }\n  .table > caption + thead > tr:first-child > th,\n  .table > caption + thead > tr:first-child > td,\n  .table > colgroup + thead > tr:first-child > th,\n  .table > colgroup + thead > tr:first-child > td,\n  .table > thead:first-child > tr:first-child > th,\n  .table > thead:first-child > tr:first-child > td {\n    border-top: 0; }\n  .table > tbody + tbody {\n    border-top: 2px solid #ddd; }\n  .table .table {\n    background-color: #fff; }\n\n.table-condensed > thead > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > th,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > th,\n.table-condensed > tfoot > tr > td {\n  padding: 5px; }\n\n.table-bordered {\n  border: 1px solid #ddd; }\n  .table-bordered > thead > tr > th,\n  .table-bordered > thead > tr > td,\n  .table-bordered > tbody > tr > th,\n  .table-bordered > tbody > tr > td,\n  .table-bordered > tfoot > tr > th,\n  .table-bordered > tfoot > tr > td {\n    border: 1px solid #ddd; }\n  .table-bordered > thead > tr > th,\n  .table-bordered > thead > tr > td {\n    border-bottom-width: 2px; }\n\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9; }\n\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5; }\n\ntable col[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-column; }\n\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-cell; }\n\n.table > thead > tr > td.active,\n.table > thead > tr > th.active,\n.table > thead > tr.active > td,\n.table > thead > tr.active > th,\n.table > tbody > tr > td.active,\n.table > tbody > tr > th.active,\n.table > tbody > tr.active > td,\n.table > tbody > tr.active > th,\n.table > tfoot > tr > td.active,\n.table > tfoot > tr > th.active,\n.table > tfoot > tr.active > td,\n.table > tfoot > tr.active > th {\n  background-color: #f5f5f5; }\n\n.table-hover > tbody > tr > td.active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr.active:hover > th {\n  background-color: #e8e8e8; }\n\n.table > thead > tr > td.success,\n.table > thead > tr > th.success,\n.table > thead > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr > td.success,\n.table > tbody > tr > th.success,\n.table > tbody > tr.success > td,\n.table > tbody > tr.success > th,\n.table > tfoot > tr > td.success,\n.table > tfoot > tr > th.success,\n.table > tfoot > tr.success > td,\n.table > tfoot > tr.success > th {\n  background-color: #0f9d58; }\n\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #0d864b; }\n\n.table > thead > tr > td.info,\n.table > thead > tr > th.info,\n.table > thead > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr > td.info,\n.table > tbody > tr > th.info,\n.table > tbody > tr.info > td,\n.table > tbody > tr.info > th,\n.table > tfoot > tr > td.info,\n.table > tfoot > tr > th.info,\n.table > tfoot > tr.info > td,\n.table > tfoot > tr.info > th {\n  background-color: #2ac5ee; }\n\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #13beec; }\n\n.table > thead > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr > td.warning,\n.table > tbody > tr > th.warning,\n.table > tbody > tr.warning > td,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr > td.warning,\n.table > tfoot > tr > th.warning,\n.table > tfoot > tr.warning > td,\n.table > tfoot > tr.warning > th {\n  background-color: #f4b400; }\n\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #dba100; }\n\n.table > thead > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr > td.danger,\n.table > tbody > tr > th.danger,\n.table > tbody > tr.danger > td,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr > td.danger,\n.table > tfoot > tr > th.danger,\n.table > tfoot > tr.danger > td,\n.table > tfoot > tr.danger > th {\n  background-color: #d80017; }\n\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #bf0014; }\n\n.table-responsive {\n  overflow-x: auto;\n  min-height: 0.01%; }\n  @media screen and (max-width: 767px) {\n    .table-responsive {\n      width: 100%;\n      margin-bottom: 13.5px;\n      overflow-y: hidden;\n      -ms-overflow-style: -ms-autohiding-scrollbar;\n      border: 1px solid #ddd; }\n      .table-responsive > .table {\n        margin-bottom: 0; }\n        .table-responsive > .table > thead > tr > th,\n        .table-responsive > .table > thead > tr > td,\n        .table-responsive > .table > tbody > tr > th,\n        .table-responsive > .table > tbody > tr > td,\n        .table-responsive > .table > tfoot > tr > th,\n        .table-responsive > .table > tfoot > tr > td {\n          white-space: nowrap; }\n      .table-responsive > .table-bordered {\n        border: 0; }\n        .table-responsive > .table-bordered > thead > tr > th:first-child,\n        .table-responsive > .table-bordered > thead > tr > td:first-child,\n        .table-responsive > .table-bordered > tbody > tr > th:first-child,\n        .table-responsive > .table-bordered > tbody > tr > td:first-child,\n        .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n        .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n          border-left: 0; }\n        .table-responsive > .table-bordered > thead > tr > th:last-child,\n        .table-responsive > .table-bordered > thead > tr > td:last-child,\n        .table-responsive > .table-bordered > tbody > tr > th:last-child,\n        .table-responsive > .table-bordered > tbody > tr > td:last-child,\n        .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n        .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n          border-right: 0; }\n        .table-responsive > .table-bordered > tbody > tr:last-child > th,\n        .table-responsive > .table-bordered > tbody > tr:last-child > td,\n        .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n        .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n          border-bottom: 0; } }\n\nfieldset {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  min-width: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 18px;\n  font-size: 19.5px;\n  line-height: inherit;\n  color: #404040;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5; }\n\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold; }\n\ninput[type=\"search\"] {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal; }\n\ninput[type=\"file\"] {\n  display: block; }\n\ninput[type=\"range\"] {\n  display: block;\n  width: 100%; }\n\nselect[multiple],\nselect[size] {\n  height: auto; }\n\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: thin dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px; }\n\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 13px;\n  line-height: 1.42857;\n  color: #444; }\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: 44px;\n  padding: 6px 12px;\n  font-size: 13px;\n  line-height: 1.42857;\n  color: #444;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #f0f0f0;\n  border-radius: 2px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }\n  .form-control:focus {\n    border-color: #999;\n    outline: 0;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(153, 153, 153, 0.6);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(153, 153, 153, 0.6); }\n  .form-control::-moz-placeholder {\n    color: #999;\n    opacity: 1; }\n  .form-control:-ms-input-placeholder {\n    color: #999; }\n  .form-control::-webkit-input-placeholder {\n    color: #999; }\n  .form-control::-ms-expand {\n    border: 0;\n    background-color: transparent; }\n  .form-control[disabled], .form-control[readonly],\n  fieldset[disabled] .form-control {\n    background-color: #f5f5f5;\n    opacity: 1; }\n  .form-control[disabled],\n  fieldset[disabled] .form-control {\n    cursor: not-allowed; }\n\ntextarea.form-control {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: none; }\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 44px; }\n  input[type=\"date\"].input-sm, .input-group-sm > input[type=\"date\"].form-control,\n  .input-group-sm > input[type=\"date\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-sm input[type=\"date\"],\n  input[type=\"time\"].input-sm,\n  .input-group-sm > input[type=\"time\"].form-control,\n  .input-group-sm > input[type=\"time\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-sm\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-sm,\n  .input-group-sm > input[type=\"datetime-local\"].form-control,\n  .input-group-sm > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-sm\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-sm,\n  .input-group-sm > input[type=\"month\"].form-control,\n  .input-group-sm > input[type=\"month\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-sm\n  input[type=\"month\"] {\n    line-height: 30px; }\n  input[type=\"date\"].input-lg, .input-group-lg > input[type=\"date\"].form-control,\n  .input-group-lg > input[type=\"date\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-lg input[type=\"date\"],\n  input[type=\"time\"].input-lg,\n  .input-group-lg > input[type=\"time\"].form-control,\n  .input-group-lg > input[type=\"time\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-lg\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-lg,\n  .input-group-lg > input[type=\"datetime-local\"].form-control,\n  .input-group-lg > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-lg\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-lg,\n  .input-group-lg > input[type=\"month\"].form-control,\n  .input-group-lg > input[type=\"month\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-lg\n  input[type=\"month\"] {\n    line-height: 45px; } }\n\n.form-group {\n  margin-bottom: 15px; }\n\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  .radio label,\n  .checkbox label {\n    min-height: 18px;\n    padding-left: 20px;\n    margin-bottom: 0;\n    font-weight: normal;\n    cursor: pointer; }\n\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px \\9; }\n\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px; }\n\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer; }\n\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px; }\n\ninput[type=\"radio\"][disabled], input[type=\"radio\"].disabled,\nfieldset[disabled] input[type=\"radio\"],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"checkbox\"].disabled,\nfieldset[disabled]\ninput[type=\"checkbox\"] {\n  cursor: not-allowed; }\n\n.radio-inline.disabled,\nfieldset[disabled] .radio-inline,\n.checkbox-inline.disabled,\nfieldset[disabled]\n.checkbox-inline {\n  cursor: not-allowed; }\n\n.radio.disabled label,\nfieldset[disabled] .radio label,\n.checkbox.disabled label,\nfieldset[disabled]\n.checkbox label {\n  cursor: not-allowed; }\n\n.form-control-static {\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n  min-height: 31px; }\n  .form-control-static.input-lg, .input-group-lg > .form-control-static.form-control,\n  .input-group-lg > .form-control-static.input-group-addon,\n  .input-group-lg > .input-group-btn > .form-control-static.btn, .form-control-static.input-sm, .input-group-sm > .form-control-static.form-control,\n  .input-group-sm > .form-control-static.input-group-addon,\n  .input-group-sm > .input-group-btn > .form-control-static.btn {\n    padding-left: 0;\n    padding-right: 0; }\n\n.input-sm, .input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\nselect.input-sm, .input-group-sm > select.form-control,\n.input-group-sm > select.input-group-addon,\n.input-group-sm > .input-group-btn > select.btn {\n  height: 30px;\n  line-height: 30px; }\n\ntextarea.input-sm, .input-group-sm > textarea.form-control,\n.input-group-sm > textarea.input-group-addon,\n.input-group-sm > .input-group-btn > textarea.btn,\nselect[multiple].input-sm,\n.input-group-sm > select[multiple].form-control,\n.input-group-sm > select[multiple].input-group-addon,\n.input-group-sm > .input-group-btn > select[multiple].btn {\n  height: auto; }\n\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px; }\n\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto; }\n\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 30px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5; }\n\n.input-lg, .input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 45px;\n  padding: 10px 16px;\n  font-size: 17px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\nselect.input-lg, .input-group-lg > select.form-control,\n.input-group-lg > select.input-group-addon,\n.input-group-lg > .input-group-btn > select.btn {\n  height: 45px;\n  line-height: 45px; }\n\ntextarea.input-lg, .input-group-lg > textarea.form-control,\n.input-group-lg > textarea.input-group-addon,\n.input-group-lg > .input-group-btn > textarea.btn,\nselect[multiple].input-lg,\n.input-group-lg > select[multiple].form-control,\n.input-group-lg > select[multiple].input-group-addon,\n.input-group-lg > .input-group-btn > select[multiple].btn {\n  height: auto; }\n\n.form-group-lg .form-control {\n  height: 45px;\n  padding: 10px 16px;\n  font-size: 17px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\n.form-group-lg select.form-control {\n  height: 45px;\n  line-height: 45px; }\n\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto; }\n\n.form-group-lg .form-control-static {\n  height: 45px;\n  min-height: 35px;\n  padding: 11px 16px;\n  font-size: 17px;\n  line-height: 1.33333; }\n\n.has-feedback {\n  position: relative; }\n  .has-feedback .form-control {\n    padding-right: 55px; }\n\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 44px;\n  height: 44px;\n  line-height: 44px;\n  text-align: center;\n  pointer-events: none; }\n\n.input-lg + .form-control-feedback, .input-group-lg > .form-control + .form-control-feedback,\n.input-group-lg > .input-group-addon + .form-control-feedback,\n.input-group-lg > .input-group-btn > .btn + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 45px;\n  height: 45px;\n  line-height: 45px; }\n\n.input-sm + .form-control-feedback, .input-group-sm > .form-control + .form-control-feedback,\n.input-group-sm > .input-group-addon + .form-control-feedback,\n.input-group-sm > .input-group-btn > .btn + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px; }\n\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #3c763d; }\n\n.has-success .form-control {\n  border-color: #3c763d;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-success .form-control:focus {\n    border-color: #2b542c;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168; }\n\n.has-success .input-group-addon {\n  color: #3c763d;\n  border-color: #3c763d;\n  background-color: #0f9d58; }\n\n.has-success .form-control-feedback {\n  color: #3c763d; }\n\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b; }\n\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-warning .form-control:focus {\n    border-color: #66512c;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b; }\n\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  border-color: #8a6d3b;\n  background-color: #f4b400; }\n\n.has-warning .form-control-feedback {\n  color: #8a6d3b; }\n\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #a94442; }\n\n.has-error .form-control {\n  border-color: #a94442;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-error .form-control:focus {\n    border-color: #843534;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483; }\n\n.has-error .input-group-addon {\n  color: #a94442;\n  border-color: #a94442;\n  background-color: #d80017; }\n\n.has-error .form-control-feedback {\n  color: #a94442; }\n\n.has-feedback label ~ .form-control-feedback {\n  top: 23px; }\n\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0; }\n\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #525252; }\n\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle; }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle; }\n  .form-inline .form-control-static {\n    display: inline-block; }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle; }\n    .form-inline .input-group .input-group-addon,\n    .form-inline .input-group .input-group-btn,\n    .form-inline .input-group .form-control {\n      width: auto; }\n  .form-inline .input-group > .form-control {\n    width: 100%; }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle; }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle; }\n    .form-inline .radio label,\n    .form-inline .checkbox label {\n      padding-left: 0; }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0; }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0; } }\n\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 7px; }\n\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 25px; }\n\n.form-horizontal .form-group {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .form-horizontal .form-group:before, .form-horizontal .form-group:after {\n    content: \" \";\n    display: table; }\n  .form-horizontal .form-group:after {\n    clear: both; }\n\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    text-align: right;\n    margin-bottom: 0;\n    padding-top: 7px; } }\n\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px; }\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 17px; } }\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px; } }\n\n.btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 13px;\n  line-height: 1.42857;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n  .btn:focus, .btn.focus, .btn:active:focus, .btn:active.focus, .btn.active:focus, .btn.active.focus {\n    outline: thin dotted;\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n  .btn:hover, .btn:focus, .btn.focus {\n    color: #121212;\n    text-decoration: none; }\n  .btn:active, .btn.active {\n    outline: 0;\n    background-image: none;\n    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n  .btn.disabled, .btn[disabled],\n  fieldset[disabled] .btn {\n    cursor: not-allowed;\n    opacity: 0.65;\n    filter: alpha(opacity=65);\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none; }\n\n.btn-default {\n  color: #121212;\n  background-color: #f5f5f5;\n  border-color: #ccc; }\n  .btn-default:focus, .btn-default.focus {\n    color: #121212;\n    background-color: gainsboro;\n    border-color: #8c8c8c; }\n  .btn-default:hover {\n    color: #121212;\n    background-color: gainsboro;\n    border-color: #adadad; }\n  .btn-default:active, .btn-default.active,\n  .open > .btn-default.dropdown-toggle {\n    color: #121212;\n    background-color: gainsboro;\n    border-color: #adadad; }\n    .btn-default:active:hover, .btn-default:active:focus, .btn-default:active.focus, .btn-default.active:hover, .btn-default.active:focus, .btn-default.active.focus,\n    .open > .btn-default.dropdown-toggle:hover,\n    .open > .btn-default.dropdown-toggle:focus,\n    .open > .btn-default.dropdown-toggle.focus {\n      color: #121212;\n      background-color: #cacaca;\n      border-color: #8c8c8c; }\n  .btn-default:active, .btn-default.active,\n  .open > .btn-default.dropdown-toggle {\n    background-image: none; }\n  .btn-default.disabled:hover, .btn-default.disabled:focus, .btn-default.disabled.focus, .btn-default[disabled]:hover, .btn-default[disabled]:focus, .btn-default[disabled].focus,\n  fieldset[disabled] .btn-default:hover,\n  fieldset[disabled] .btn-default:focus,\n  fieldset[disabled] .btn-default.focus {\n    background-color: #f5f5f5;\n    border-color: #ccc; }\n  .btn-default .badge {\n    color: #f5f5f5;\n    background-color: #121212; }\n\n.btn-primary {\n  color: #fff;\n  background-color: #2ac5ee;\n  border-color: #13beec; }\n  .btn-primary:focus, .btn-primary.focus {\n    color: #fff;\n    background-color: #11abd4;\n    border-color: #095f76; }\n  .btn-primary:hover {\n    color: #fff;\n    background-color: #11abd4;\n    border-color: #0e91b3; }\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #11abd4;\n    border-color: #0e91b3; }\n    .btn-primary:active:hover, .btn-primary:active:focus, .btn-primary:active.focus, .btn-primary.active:hover, .btn-primary.active:focus, .btn-primary.active.focus,\n    .open > .btn-primary.dropdown-toggle:hover,\n    .open > .btn-primary.dropdown-toggle:focus,\n    .open > .btn-primary.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #0e91b3;\n      border-color: #095f76; }\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    background-image: none; }\n  .btn-primary.disabled:hover, .btn-primary.disabled:focus, .btn-primary.disabled.focus, .btn-primary[disabled]:hover, .btn-primary[disabled]:focus, .btn-primary[disabled].focus,\n  fieldset[disabled] .btn-primary:hover,\n  fieldset[disabled] .btn-primary:focus,\n  fieldset[disabled] .btn-primary.focus {\n    background-color: #2ac5ee;\n    border-color: #13beec; }\n  .btn-primary .badge {\n    color: #2ac5ee;\n    background-color: #fff; }\n\n.btn-success {\n  color: #fff;\n  background-color: #0f9d58;\n  border-color: #0d864b; }\n  .btn-success:focus, .btn-success.focus {\n    color: #fff;\n    background-color: #0b6e3e;\n    border-color: #02110a; }\n  .btn-success:hover {\n    color: #fff;\n    background-color: #0b6e3e;\n    border-color: #074e2c; }\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #0b6e3e;\n    border-color: #074e2c; }\n    .btn-success:active:hover, .btn-success:active:focus, .btn-success:active.focus, .btn-success.active:hover, .btn-success.active:focus, .btn-success.active.focus,\n    .open > .btn-success.dropdown-toggle:hover,\n    .open > .btn-success.dropdown-toggle:focus,\n    .open > .btn-success.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #074e2c;\n      border-color: #02110a; }\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    background-image: none; }\n  .btn-success.disabled:hover, .btn-success.disabled:focus, .btn-success.disabled.focus, .btn-success[disabled]:hover, .btn-success[disabled]:focus, .btn-success[disabled].focus,\n  fieldset[disabled] .btn-success:hover,\n  fieldset[disabled] .btn-success:focus,\n  fieldset[disabled] .btn-success.focus {\n    background-color: #0f9d58;\n    border-color: #0d864b; }\n  .btn-success .badge {\n    color: #0f9d58;\n    background-color: #fff; }\n\n.btn-info {\n  color: #fff;\n  background-color: #5bc0dd;\n  border-color: #46b8d9; }\n  .btn-info:focus, .btn-info.focus {\n    color: #fff;\n    background-color: #31b0d4;\n    border-color: #1b6c84; }\n  .btn-info:hover {\n    color: #fff;\n    background-color: #31b0d4;\n    border-color: #279abb; }\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #31b0d4;\n    border-color: #279abb; }\n    .btn-info:active:hover, .btn-info:active:focus, .btn-info:active.focus, .btn-info.active:hover, .btn-info.active:focus, .btn-info.active.focus,\n    .open > .btn-info.dropdown-toggle:hover,\n    .open > .btn-info.dropdown-toggle:focus,\n    .open > .btn-info.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #279abb;\n      border-color: #1b6c84; }\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    background-image: none; }\n  .btn-info.disabled:hover, .btn-info.disabled:focus, .btn-info.disabled.focus, .btn-info[disabled]:hover, .btn-info[disabled]:focus, .btn-info[disabled].focus,\n  fieldset[disabled] .btn-info:hover,\n  fieldset[disabled] .btn-info:focus,\n  fieldset[disabled] .btn-info.focus {\n    background-color: #5bc0dd;\n    border-color: #46b8d9; }\n  .btn-info .badge {\n    color: #5bc0dd;\n    background-color: #fff; }\n\n.btn-warning {\n  color: #fff;\n  background-color: #f4b400;\n  border-color: #dba100; }\n  .btn-warning:focus, .btn-warning.focus {\n    color: #fff;\n    background-color: #c18e00;\n    border-color: #5b4300; }\n  .btn-warning:hover {\n    color: #fff;\n    background-color: #c18e00;\n    border-color: #9d7400; }\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    color: #fff;\n    background-color: #c18e00;\n    border-color: #9d7400; }\n    .btn-warning:active:hover, .btn-warning:active:focus, .btn-warning:active.focus, .btn-warning.active:hover, .btn-warning.active:focus, .btn-warning.active.focus,\n    .open > .btn-warning.dropdown-toggle:hover,\n    .open > .btn-warning.dropdown-toggle:focus,\n    .open > .btn-warning.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #9d7400;\n      border-color: #5b4300; }\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    background-image: none; }\n  .btn-warning.disabled:hover, .btn-warning.disabled:focus, .btn-warning.disabled.focus, .btn-warning[disabled]:hover, .btn-warning[disabled]:focus, .btn-warning[disabled].focus,\n  fieldset[disabled] .btn-warning:hover,\n  fieldset[disabled] .btn-warning:focus,\n  fieldset[disabled] .btn-warning.focus {\n    background-color: #f4b400;\n    border-color: #dba100; }\n  .btn-warning .badge {\n    color: #f4b400;\n    background-color: #fff; }\n\n.btn-danger {\n  color: #fff;\n  background-color: #d80017;\n  border-color: #bf0014; }\n  .btn-danger:focus, .btn-danger.focus {\n    color: #fff;\n    background-color: #a50012;\n    border-color: #3f0007; }\n  .btn-danger:hover {\n    color: #fff;\n    background-color: #a50012;\n    border-color: #81000e; }\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #a50012;\n    border-color: #81000e; }\n    .btn-danger:active:hover, .btn-danger:active:focus, .btn-danger:active.focus, .btn-danger.active:hover, .btn-danger.active:focus, .btn-danger.active.focus,\n    .open > .btn-danger.dropdown-toggle:hover,\n    .open > .btn-danger.dropdown-toggle:focus,\n    .open > .btn-danger.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #81000e;\n      border-color: #3f0007; }\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    background-image: none; }\n  .btn-danger.disabled:hover, .btn-danger.disabled:focus, .btn-danger.disabled.focus, .btn-danger[disabled]:hover, .btn-danger[disabled]:focus, .btn-danger[disabled].focus,\n  fieldset[disabled] .btn-danger:hover,\n  fieldset[disabled] .btn-danger:focus,\n  fieldset[disabled] .btn-danger.focus {\n    background-color: #d80017;\n    border-color: #bf0014; }\n  .btn-danger .badge {\n    color: #d80017;\n    background-color: #fff; }\n\n.btn-link {\n  color: #2ac5ee;\n  font-weight: normal;\n  border-radius: 0; }\n  .btn-link, .btn-link:active, .btn-link.active, .btn-link[disabled],\n  fieldset[disabled] .btn-link {\n    background-color: transparent;\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n  .btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {\n    border-color: transparent; }\n  .btn-link:hover, .btn-link:focus {\n    color: #121212;\n    text-decoration: underline;\n    background-color: transparent; }\n  .btn-link[disabled]:hover, .btn-link[disabled]:focus,\n  fieldset[disabled] .btn-link:hover,\n  fieldset[disabled] .btn-link:focus {\n    color: #e0e0e0;\n    text-decoration: none; }\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 17px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.btn-xs, .btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.btn-block {\n  display: block;\n  width: 100%; }\n\n.btn-block + .btn-block {\n  margin-top: 5px; }\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%; }\n\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity 0.15s linear;\n  -o-transition: opacity 0.15s linear;\n  transition: opacity 0.15s linear; }\n  .fade.in {\n    opacity: 1; }\n\n.collapse {\n  display: none; }\n  .collapse.in {\n    display: block; }\n\ntr.collapse.in {\n  display: table-row; }\n\ntbody.collapse.in {\n  display: table-row-group; }\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-property: height, visibility;\n  transition-property: height, visibility;\n  -webkit-transition-duration: 0.35s;\n  transition-duration: 0.35s;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease; }\n\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent; }\n\n.dropup,\n.dropdown {\n  position: relative; }\n\n.dropdown-toggle:focus {\n  outline: 0; }\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 13px;\n  text-align: left;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  background-clip: padding-box; }\n  .dropdown-menu.pull-right {\n    right: 0;\n    left: auto; }\n  .dropdown-menu .divider {\n    height: 1px;\n    margin: 8px 0;\n    overflow: hidden;\n    background-color: #e5e5e5; }\n  .dropdown-menu > li > a {\n    display: block;\n    padding: 3px 20px;\n    clear: both;\n    font-weight: normal;\n    line-height: 1.42857;\n    color: #121212;\n    white-space: nowrap; }\n\n.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {\n  text-decoration: none;\n  color: #333333;\n  background-color: #f5f5f5; }\n\n.dropdown-menu > .active > a, .dropdown-menu > .active > a:hover, .dropdown-menu > .active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  background-color: #2ac5ee; }\n\n.dropdown-menu > .disabled > a, .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {\n  color: #e0e0e0; }\n\n.dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {\n  text-decoration: none;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n  cursor: not-allowed; }\n\n.open > .dropdown-menu {\n  display: block; }\n\n.open > a {\n  outline: 0; }\n\n.dropdown-menu-right {\n  left: auto;\n  right: 0; }\n\n.dropdown-menu-left {\n  left: 0;\n  right: auto; }\n\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.42857;\n  color: #e0e0e0;\n  white-space: nowrap; }\n\n.dropdown-backdrop {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 990; }\n\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto; }\n\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n  content: \"\"; }\n\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px; }\n\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    right: 0;\n    left: auto; }\n  .navbar-right .dropdown-menu-left {\n    left: 0;\n    right: auto; } }\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle; }\n  .btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    float: left; }\n    .btn-group > .btn:hover, .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:hover,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 2; }\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px; }\n\n.btn-toolbar {\n  margin-left: -5px; }\n  .btn-toolbar:before, .btn-toolbar:after {\n    content: \" \";\n    display: table; }\n  .btn-toolbar:after {\n    clear: both; }\n  .btn-toolbar .btn,\n  .btn-toolbar .btn-group,\n  .btn-toolbar .input-group {\n    float: left; }\n  .btn-toolbar > .btn,\n  .btn-toolbar > .btn-group,\n  .btn-toolbar > .input-group {\n    margin-left: 5px; }\n\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0; }\n\n.btn-group > .btn:first-child {\n  margin-left: 0; }\n  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group > .btn-group {\n  float: left; }\n\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0; }\n\n.btn-group > .btn + .dropdown-toggle {\n  padding-left: 8px;\n  padding-right: 8px; }\n\n.btn-group > .btn-lg + .dropdown-toggle, .btn-group-lg.btn-group > .btn + .dropdown-toggle {\n  padding-left: 12px;\n  padding-right: 12px; }\n\n.btn-group.open .dropdown-toggle {\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n  .btn-group.open .dropdown-toggle.btn-link {\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n\n.btn .caret {\n  margin-left: 0; }\n\n.btn-lg .caret, .btn-group-lg > .btn .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0; }\n\n.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret {\n  border-width: 0 5px 5px; }\n\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%; }\n\n.btn-group-vertical > .btn-group:before, .btn-group-vertical > .btn-group:after {\n  content: \" \";\n  display: table; }\n\n.btn-group-vertical > .btn-group:after {\n  clear: both; }\n\n.btn-group-vertical > .btn-group > .btn {\n  float: none; }\n\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0; }\n\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0; }\n\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px; }\n\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate; }\n  .btn-group-justified > .btn,\n  .btn-group-justified > .btn-group {\n    float: none;\n    display: table-cell;\n    width: 1%; }\n  .btn-group-justified > .btn-group .btn {\n    width: 100%; }\n  .btn-group-justified > .btn-group .dropdown-menu {\n    left: auto; }\n\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none; }\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate; }\n  .input-group[class*=\"col-\"] {\n    float: none;\n    padding-left: 0;\n    padding-right: 0; }\n  .input-group .form-control {\n    position: relative;\n    z-index: 2;\n    float: left;\n    width: 100%;\n    margin-bottom: 0; }\n    .input-group .form-control:focus {\n      z-index: 3; }\n\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell; }\n  .input-group-addon:not(:first-child):not(:last-child),\n  .input-group-btn:not(:first-child):not(:last-child),\n  .input-group .form-control:not(:first-child):not(:last-child) {\n    border-radius: 0; }\n\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle; }\n\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 13px;\n  font-weight: normal;\n  line-height: 1;\n  color: #444;\n  text-align: center;\n  background-color: #f5f5f5;\n  border: 1px solid #f0f0f0;\n  border-radius: 2px; }\n  .input-group-addon.input-sm,\n  .input-group-sm > .input-group-addon,\n  .input-group-sm > .input-group-btn > .input-group-addon.btn {\n    padding: 5px 10px;\n    font-size: 12px;\n    border-radius: 3px; }\n  .input-group-addon.input-lg,\n  .input-group-lg > .input-group-addon,\n  .input-group-lg > .input-group-btn > .input-group-addon.btn {\n    padding: 10px 16px;\n    font-size: 17px;\n    border-radius: 6px; }\n  .input-group-addon input[type=\"radio\"],\n  .input-group-addon input[type=\"checkbox\"] {\n    margin-top: 0; }\n\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n.input-group-addon:first-child {\n  border-right: 0; }\n\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.input-group-addon:last-child {\n  border-left: 0; }\n\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap; }\n  .input-group-btn > .btn {\n    position: relative; }\n    .input-group-btn > .btn + .btn {\n      margin-left: -1px; }\n    .input-group-btn > .btn:hover, .input-group-btn > .btn:focus, .input-group-btn > .btn:active {\n      z-index: 2; }\n  .input-group-btn:first-child > .btn,\n  .input-group-btn:first-child > .btn-group {\n    margin-right: -1px; }\n  .input-group-btn:last-child > .btn,\n  .input-group-btn:last-child > .btn-group {\n    z-index: 2;\n    margin-left: -1px; }\n\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none; }\n  .nav:before, .nav:after {\n    content: \" \";\n    display: table; }\n  .nav:after {\n    clear: both; }\n  .nav > li {\n    position: relative;\n    display: block; }\n    .nav > li > a {\n      position: relative;\n      display: block;\n      padding: 10px 15px; }\n      .nav > li > a:hover, .nav > li > a:focus {\n        text-decoration: none;\n        background-color: #f5f5f5; }\n    .nav > li.disabled > a {\n      color: #e0e0e0; }\n      .nav > li.disabled > a:hover, .nav > li.disabled > a:focus {\n        color: #e0e0e0;\n        text-decoration: none;\n        background-color: transparent;\n        cursor: not-allowed; }\n  .nav .open > a, .nav .open > a:hover, .nav .open > a:focus {\n    background-color: #f5f5f5;\n    border-color: #2ac5ee; }\n  .nav .nav-divider {\n    height: 1px;\n    margin: 8px 0;\n    overflow: hidden;\n    background-color: #e5e5e5; }\n  .nav > li > a > img {\n    max-width: none; }\n\n.nav-tabs {\n  border-bottom: 1px solid #ddd; }\n  .nav-tabs > li {\n    float: left;\n    margin-bottom: -1px; }\n    .nav-tabs > li > a {\n      margin-right: 2px;\n      line-height: 1.42857;\n      border: 1px solid transparent;\n      border-radius: 4px 4px 0 0; }\n      .nav-tabs > li > a:hover {\n        border-color: #f5f5f5 #f5f5f5 #ddd; }\n    .nav-tabs > li.active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus {\n      color: #737373;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      border-bottom-color: transparent;\n      cursor: default; }\n\n.nav-pills > li {\n  float: left; }\n  .nav-pills > li > a {\n    border-radius: 4px; }\n  .nav-pills > li + li {\n    margin-left: 2px; }\n  .nav-pills > li.active > a, .nav-pills > li.active > a:hover, .nav-pills > li.active > a:focus {\n    color: #fff;\n    background-color: #2ac5ee; }\n\n.nav-stacked > li {\n  float: none; }\n  .nav-stacked > li + li {\n    margin-top: 2px;\n    margin-left: 0; }\n\n.nav-justified, .nav-tabs.nav-justified {\n  width: 100%; }\n  .nav-justified > li, .nav-tabs.nav-justified > li {\n    float: none; }\n    .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n      text-align: center;\n      margin-bottom: 5px; }\n  .nav-justified > .dropdown .dropdown-menu {\n    top: auto;\n    left: auto; }\n  @media (min-width: 768px) {\n    .nav-justified > li, .nav-tabs.nav-justified > li {\n      display: table-cell;\n      width: 1%; }\n      .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n        margin-bottom: 0; } }\n\n.nav-tabs-justified, .nav-tabs.nav-justified {\n  border-bottom: 0; }\n  .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n    margin-right: 0;\n    border-radius: 4px; }\n  .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {\n    border: 1px solid #ddd; }\n  @media (min-width: 768px) {\n    .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n      border-bottom: 1px solid #ddd;\n      border-radius: 4px 4px 0 0; }\n    .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a,\n    .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n    .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {\n      border-bottom-color: #fff; } }\n\n.tab-content > .tab-pane {\n  display: none; }\n\n.tab-content > .active {\n  display: block; }\n\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 18px;\n  border: 1px solid transparent; }\n  .navbar:before, .navbar:after {\n    content: \" \";\n    display: table; }\n  .navbar:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .navbar {\n      border-radius: 4px; } }\n\n.navbar-header:before, .navbar-header:after {\n  content: \" \";\n  display: table; }\n\n.navbar-header:after {\n  clear: both; }\n\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left; } }\n\n.navbar-collapse {\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n  border-top: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-overflow-scrolling: touch; }\n  .navbar-collapse:before, .navbar-collapse:after {\n    content: \" \";\n    display: table; }\n  .navbar-collapse:after {\n    clear: both; }\n  .navbar-collapse.in {\n    overflow-y: auto; }\n  @media (min-width: 768px) {\n    .navbar-collapse {\n      width: auto;\n      border-top: 0;\n      box-shadow: none; }\n      .navbar-collapse.collapse {\n        display: block !important;\n        height: auto !important;\n        padding-bottom: 0;\n        overflow: visible !important; }\n      .navbar-collapse.in {\n        overflow-y: visible; }\n      .navbar-fixed-top .navbar-collapse,\n      .navbar-static-top .navbar-collapse,\n      .navbar-fixed-bottom .navbar-collapse {\n        padding-left: 0;\n        padding-right: 0; } }\n\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px; }\n  @media (max-device-width: 480px) and (orientation: landscape) {\n    .navbar-fixed-top .navbar-collapse,\n    .navbar-fixed-bottom .navbar-collapse {\n      max-height: 200px; } }\n\n.container > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-header,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px; }\n  @media (min-width: 768px) {\n    .container > .navbar-header,\n    .container > .navbar-collapse,\n    .container-fluid > .navbar-header,\n    .container-fluid > .navbar-collapse {\n      margin-right: 0;\n      margin-left: 0; } }\n\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px; }\n  @media (min-width: 768px) {\n    .navbar-static-top {\n      border-radius: 0; } }\n\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n  @media (min-width: 768px) {\n    .navbar-fixed-top,\n    .navbar-fixed-bottom {\n      border-radius: 0; } }\n\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px; }\n\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0; }\n\n.navbar-brand {\n  float: left;\n  padding: 16px 15px;\n  font-size: 17px;\n  line-height: 18px;\n  height: 50px; }\n  .navbar-brand:hover, .navbar-brand:focus {\n    text-decoration: none; }\n  .navbar-brand > img {\n    display: block; }\n  @media (min-width: 768px) {\n    .navbar > .container .navbar-brand,\n    .navbar > .container-fluid .navbar-brand {\n      margin-left: -15px; } }\n\n.navbar-toggle {\n  position: relative;\n  float: right;\n  margin-right: 15px;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .navbar-toggle:focus {\n    outline: 0; }\n  .navbar-toggle .icon-bar {\n    display: block;\n    width: 22px;\n    height: 2px;\n    border-radius: 1px; }\n  .navbar-toggle .icon-bar + .icon-bar {\n    margin-top: 4px; }\n  @media (min-width: 768px) {\n    .navbar-toggle {\n      display: none; } }\n\n.navbar-nav {\n  margin: 8px -15px; }\n  .navbar-nav > li > a {\n    padding-top: 10px;\n    padding-bottom: 10px;\n    line-height: 18px; }\n  @media (max-width: 767px) {\n    .navbar-nav .open .dropdown-menu {\n      position: static;\n      float: none;\n      width: auto;\n      margin-top: 0;\n      background-color: transparent;\n      border: 0;\n      box-shadow: none; }\n      .navbar-nav .open .dropdown-menu > li > a,\n      .navbar-nav .open .dropdown-menu .dropdown-header {\n        padding: 5px 15px 5px 25px; }\n      .navbar-nav .open .dropdown-menu > li > a {\n        line-height: 18px; }\n        .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-nav .open .dropdown-menu > li > a:focus {\n          background-image: none; } }\n  @media (min-width: 768px) {\n    .navbar-nav {\n      float: left;\n      margin: 0; }\n      .navbar-nav > li {\n        float: left; }\n        .navbar-nav > li > a {\n          padding-top: 16px;\n          padding-bottom: 16px; } }\n\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  margin-top: 3px;\n  margin-bottom: 3px; }\n  @media (min-width: 768px) {\n    .navbar-form .form-group {\n      display: inline-block;\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .navbar-form .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle; }\n    .navbar-form .form-control-static {\n      display: inline-block; }\n    .navbar-form .input-group {\n      display: inline-table;\n      vertical-align: middle; }\n      .navbar-form .input-group .input-group-addon,\n      .navbar-form .input-group .input-group-btn,\n      .navbar-form .input-group .form-control {\n        width: auto; }\n    .navbar-form .input-group > .form-control {\n      width: 100%; }\n    .navbar-form .control-label {\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .navbar-form .radio,\n    .navbar-form .checkbox {\n      display: inline-block;\n      margin-top: 0;\n      margin-bottom: 0;\n      vertical-align: middle; }\n      .navbar-form .radio label,\n      .navbar-form .checkbox label {\n        padding-left: 0; }\n    .navbar-form .radio input[type=\"radio\"],\n    .navbar-form .checkbox input[type=\"checkbox\"] {\n      position: relative;\n      margin-left: 0; }\n    .navbar-form .has-feedback .form-control-feedback {\n      top: 0; } }\n  @media (max-width: 767px) {\n    .navbar-form .form-group {\n      margin-bottom: 5px; }\n      .navbar-form .form-group:last-child {\n        margin-bottom: 0; } }\n  @media (min-width: 768px) {\n    .navbar-form {\n      width: auto;\n      border: 0;\n      margin-left: 0;\n      margin-right: 0;\n      padding-top: 0;\n      padding-bottom: 0;\n      -webkit-box-shadow: none;\n      box-shadow: none; } }\n\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.navbar-btn {\n  margin-top: 3px;\n  margin-bottom: 3px; }\n  .navbar-btn.btn-sm, .btn-group-sm > .navbar-btn.btn {\n    margin-top: 10px;\n    margin-bottom: 10px; }\n  .navbar-btn.btn-xs, .btn-group-xs > .navbar-btn.btn {\n    margin-top: 14px;\n    margin-bottom: 14px; }\n\n.navbar-text {\n  margin-top: 16px;\n  margin-bottom: 16px; }\n  @media (min-width: 768px) {\n    .navbar-text {\n      float: left;\n      margin-left: 15px;\n      margin-right: 15px; } }\n\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important; }\n  .navbar-right {\n    float: right !important;\n    margin-right: -15px; }\n    .navbar-right ~ .navbar-right {\n      margin-right: 0; } }\n\n.navbar-default {\n  background-color: rgba(255, 255, 255, 0.95);\n  border-color: rgba(238, 238, 238, 0.95); }\n  .navbar-default .navbar-brand {\n    color: #121212; }\n    .navbar-default .navbar-brand:hover, .navbar-default .navbar-brand:focus {\n      color: #2ac5ee;\n      background-color: transparent; }\n  .navbar-default .navbar-text {\n    color: #777; }\n  .navbar-default .navbar-nav > li > a {\n    color: #121212; }\n    .navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus {\n      color: #2ac5ee;\n      background-color: transparent; }\n  .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {\n    color: #2ac5ee;\n    background-color: transparent; }\n  .navbar-default .navbar-nav > .disabled > a, .navbar-default .navbar-nav > .disabled > a:hover, .navbar-default .navbar-nav > .disabled > a:focus {\n    color: #ccc;\n    background-color: transparent; }\n  .navbar-default .navbar-toggle {\n    border-color: #ddd; }\n    .navbar-default .navbar-toggle:hover, .navbar-default .navbar-toggle:focus {\n      background-color: #ddd; }\n    .navbar-default .navbar-toggle .icon-bar {\n      background-color: #888; }\n  .navbar-default .navbar-collapse,\n  .navbar-default .navbar-form {\n    border-color: rgba(238, 238, 238, 0.95); }\n  .navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:hover, .navbar-default .navbar-nav > .open > a:focus {\n    background-color: transparent;\n    color: #2ac5ee; }\n  @media (max-width: 767px) {\n    .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n      color: #121212; }\n      .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n        color: #2ac5ee;\n        background-color: transparent; }\n    .navbar-default .navbar-nav .open .dropdown-menu > .active > a, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n      color: #2ac5ee;\n      background-color: transparent; }\n    .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n      color: #ccc;\n      background-color: transparent; } }\n  .navbar-default .navbar-link {\n    color: #121212; }\n    .navbar-default .navbar-link:hover {\n      color: #2ac5ee; }\n  .navbar-default .btn-link {\n    color: #121212; }\n    .navbar-default .btn-link:hover, .navbar-default .btn-link:focus {\n      color: #2ac5ee; }\n    .navbar-default .btn-link[disabled]:hover, .navbar-default .btn-link[disabled]:focus,\n    fieldset[disabled] .navbar-default .btn-link:hover,\n    fieldset[disabled] .navbar-default .btn-link:focus {\n      color: #ccc; }\n\n.navbar-inverse {\n  background-color: #222;\n  border-color: #090909; }\n  .navbar-inverse .navbar-brand {\n    color: white; }\n    .navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-brand:focus {\n      color: #fff;\n      background-color: transparent; }\n  .navbar-inverse .navbar-text {\n    color: white; }\n  .navbar-inverse .navbar-nav > li > a {\n    color: white; }\n    .navbar-inverse .navbar-nav > li > a:hover, .navbar-inverse .navbar-nav > li > a:focus {\n      color: #fff;\n      background-color: transparent; }\n  .navbar-inverse .navbar-nav > .active > a, .navbar-inverse .navbar-nav > .active > a:hover, .navbar-inverse .navbar-nav > .active > a:focus {\n    color: #fff;\n    background-color: #090909; }\n  .navbar-inverse .navbar-nav > .disabled > a, .navbar-inverse .navbar-nav > .disabled > a:hover, .navbar-inverse .navbar-nav > .disabled > a:focus {\n    color: #444;\n    background-color: transparent; }\n  .navbar-inverse .navbar-toggle {\n    border-color: #333; }\n    .navbar-inverse .navbar-toggle:hover, .navbar-inverse .navbar-toggle:focus {\n      background-color: #333; }\n    .navbar-inverse .navbar-toggle .icon-bar {\n      background-color: #fff; }\n  .navbar-inverse .navbar-collapse,\n  .navbar-inverse .navbar-form {\n    border-color: #101010; }\n  .navbar-inverse .navbar-nav > .open > a, .navbar-inverse .navbar-nav > .open > a:hover, .navbar-inverse .navbar-nav > .open > a:focus {\n    background-color: #090909;\n    color: #fff; }\n  @media (max-width: 767px) {\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n      border-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n      background-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n      color: white; }\n      .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n        color: #fff;\n        background-color: transparent; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n      color: #fff;\n      background-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n      color: #444;\n      background-color: transparent; } }\n  .navbar-inverse .navbar-link {\n    color: white; }\n    .navbar-inverse .navbar-link:hover {\n      color: #fff; }\n  .navbar-inverse .btn-link {\n    color: white; }\n    .navbar-inverse .btn-link:hover, .navbar-inverse .btn-link:focus {\n      color: #fff; }\n    .navbar-inverse .btn-link[disabled]:hover, .navbar-inverse .btn-link[disabled]:focus,\n    fieldset[disabled] .navbar-inverse .btn-link:hover,\n    fieldset[disabled] .navbar-inverse .btn-link:focus {\n      color: #444; }\n\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 18px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px; }\n  .breadcrumb > li {\n    display: inline-block; }\n    .breadcrumb > li + li:before {\n      content: \"/ \";\n      padding: 0 5px;\n      color: #ccc; }\n  .breadcrumb > .active {\n    color: #e0e0e0; }\n\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 18px 0;\n  border-radius: 4px; }\n  .pagination > li {\n    display: inline; }\n    .pagination > li > a,\n    .pagination > li > span {\n      position: relative;\n      float: left;\n      padding: 6px 12px;\n      line-height: 1.42857;\n      text-decoration: none;\n      color: #2ac5ee;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      margin-left: -1px; }\n    .pagination > li:first-child > a,\n    .pagination > li:first-child > span {\n      margin-left: 0;\n      border-bottom-left-radius: 4px;\n      border-top-left-radius: 4px; }\n    .pagination > li:last-child > a,\n    .pagination > li:last-child > span {\n      border-bottom-right-radius: 4px;\n      border-top-right-radius: 4px; }\n  .pagination > li > a:hover, .pagination > li > a:focus,\n  .pagination > li > span:hover,\n  .pagination > li > span:focus {\n    z-index: 2;\n    color: #121212;\n    background-color: #f5f5f5;\n    border-color: #ddd; }\n  .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus,\n  .pagination > .active > span,\n  .pagination > .active > span:hover,\n  .pagination > .active > span:focus {\n    z-index: 3;\n    color: #fff;\n    background-color: #2ac5ee;\n    border-color: #2ac5ee;\n    cursor: default; }\n  .pagination > .disabled > span,\n  .pagination > .disabled > span:hover,\n  .pagination > .disabled > span:focus,\n  .pagination > .disabled > a,\n  .pagination > .disabled > a:hover,\n  .pagination > .disabled > a:focus {\n    color: #e0e0e0;\n    background-color: #fff;\n    border-color: #ddd;\n    cursor: not-allowed; }\n\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 17px;\n  line-height: 1.33333; }\n\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-bottom-left-radius: 6px;\n  border-top-left-radius: 6px; }\n\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-bottom-right-radius: 6px;\n  border-top-right-radius: 6px; }\n\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5; }\n\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px; }\n\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px; }\n\n.pager {\n  padding-left: 0;\n  margin: 18px 0;\n  list-style: none;\n  text-align: center; }\n  .pager:before, .pager:after {\n    content: \" \";\n    display: table; }\n  .pager:after {\n    clear: both; }\n  .pager li {\n    display: inline; }\n    .pager li > a,\n    .pager li > span {\n      display: inline-block;\n      padding: 5px 14px;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      border-radius: 15px; }\n    .pager li > a:hover,\n    .pager li > a:focus {\n      text-decoration: none;\n      background-color: #f5f5f5; }\n  .pager .next > a,\n  .pager .next > span {\n    float: right; }\n  .pager .previous > a,\n  .pager .previous > span {\n    float: left; }\n  .pager .disabled > a,\n  .pager .disabled > a:hover,\n  .pager .disabled > a:focus,\n  .pager .disabled > span {\n    color: #e0e0e0;\n    background-color: #fff;\n    cursor: not-allowed; }\n\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em; }\n  .label:empty {\n    display: none; }\n  .btn .label {\n    position: relative;\n    top: -1px; }\n\na.label:hover, a.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n.label-default {\n  background-color: #e0e0e0; }\n  .label-default[href]:hover, .label-default[href]:focus {\n    background-color: #c7c7c7; }\n\n.label-primary {\n  background-color: #2ac5ee; }\n  .label-primary[href]:hover, .label-primary[href]:focus {\n    background-color: #11abd4; }\n\n.label-success {\n  background-color: #0f9d58; }\n  .label-success[href]:hover, .label-success[href]:focus {\n    background-color: #0b6e3e; }\n\n.label-info {\n  background-color: #5bc0dd; }\n  .label-info[href]:hover, .label-info[href]:focus {\n    background-color: #31b0d4; }\n\n.label-warning {\n  background-color: #f4b400; }\n  .label-warning[href]:hover, .label-warning[href]:focus {\n    background-color: #c18e00; }\n\n.label-danger {\n  background-color: #d80017; }\n  .label-danger[href]:hover, .label-danger[href]:focus {\n    background-color: #a50012; }\n\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #fff;\n  line-height: 1;\n  vertical-align: middle;\n  white-space: nowrap;\n  text-align: center;\n  background-color: #e0e0e0;\n  border-radius: 10px; }\n  .badge:empty {\n    display: none; }\n  .btn .badge {\n    position: relative;\n    top: -1px; }\n  .btn-xs .badge, .btn-group-xs > .btn .badge,\n  .btn-group-xs > .btn .badge {\n    top: 0;\n    padding: 1px 5px; }\n  .list-group-item.active > .badge,\n  .nav-pills > .active > a > .badge {\n    color: #2ac5ee;\n    background-color: #fff; }\n  .list-group-item > .badge {\n    float: right; }\n  .list-group-item > .badge + .badge {\n    margin-right: 5px; }\n  .nav-pills > li > a > .badge {\n    margin-left: 3px; }\n\na.badge:hover, a.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #f5f5f5; }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    color: inherit; }\n  .jumbotron p {\n    margin-bottom: 15px;\n    font-size: 20px;\n    font-weight: 200; }\n  .jumbotron > hr {\n    border-top-color: gainsboro; }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    border-radius: 6px;\n    padding-left: 15px;\n    padding-right: 15px; }\n  .jumbotron .container {\n    max-width: 100%; }\n  @media screen and (min-width: 768px) {\n    .jumbotron {\n      padding-top: 48px;\n      padding-bottom: 48px; }\n      .container .jumbotron,\n      .container-fluid .jumbotron {\n        padding-left: 60px;\n        padding-right: 60px; }\n      .jumbotron h1,\n      .jumbotron .h1 {\n        font-size: 59px; } }\n\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 18px;\n  line-height: 1.42857;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: border 0.2s ease-in-out;\n  -o-transition: border 0.2s ease-in-out;\n  transition: border 0.2s ease-in-out; }\n  .thumbnail > img,\n  .thumbnail a > img {\n    display: block;\n    max-width: 100%;\n    height: auto;\n    margin-left: auto;\n    margin-right: auto; }\n  .thumbnail .caption {\n    padding: 9px;\n    color: #121212; }\n\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active {\n  border-color: #2ac5ee; }\n\n.alert {\n  padding: 15px;\n  margin-bottom: 18px;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .alert h4 {\n    margin-top: 0;\n    color: inherit; }\n  .alert .alert-link {\n    font-weight: bold; }\n  .alert > p,\n  .alert > ul {\n    margin-bottom: 0; }\n  .alert > p + p {\n    margin-top: 5px; }\n\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px; }\n  .alert-dismissable .close,\n  .alert-dismissible .close {\n    position: relative;\n    top: -2px;\n    right: -21px;\n    color: inherit; }\n\n.alert-success {\n  background-color: #0f9d58;\n  border-color: #0d8637;\n  color: #3c763d; }\n  .alert-success hr {\n    border-top-color: #0b6e2d; }\n  .alert-success .alert-link {\n    color: #2b542c; }\n\n.alert-info {\n  background-color: #2ac5ee;\n  border-color: #12d9e2;\n  color: #31708f; }\n  .alert-info hr {\n    border-top-color: #10c3cb; }\n  .alert-info .alert-link {\n    color: #245269; }\n\n.alert-warning {\n  background-color: #f4b400;\n  border-color: #db7d00;\n  color: #8a6d3b; }\n  .alert-warning hr {\n    border-top-color: #c16e00; }\n  .alert-warning .alert-link {\n    color: #66512c; }\n\n.alert-danger {\n  background-color: #d80017;\n  border-color: #bf0034;\n  color: #a94442; }\n  .alert-danger hr {\n    border-top-color: #a5002d; }\n  .alert-danger .alert-link {\n    color: #843534; }\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n.progress {\n  overflow: hidden;\n  height: 18px;\n  margin-bottom: 18px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); }\n\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 12px;\n  line-height: 18px;\n  color: #fff;\n  text-align: center;\n  background-color: #2ac5ee;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -webkit-transition: width 0.6s ease;\n  -o-transition: width 0.6s ease;\n  transition: width 0.6s ease; }\n\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 40px 40px; }\n\n.progress.active .progress-bar,\n.progress-bar.active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n  -o-animation: progress-bar-stripes 2s linear infinite;\n  animation: progress-bar-stripes 2s linear infinite; }\n\n.progress-bar-success {\n  background-color: #0f9d58; }\n  .progress-striped .progress-bar-success {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-info {\n  background-color: #5bc0dd; }\n  .progress-striped .progress-bar-info {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-warning {\n  background-color: #f4b400; }\n  .progress-striped .progress-bar-warning {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-danger {\n  background-color: #d80017; }\n  .progress-striped .progress-bar-danger {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.media {\n  margin-top: 15px; }\n  .media:first-child {\n    margin-top: 0; }\n\n.media,\n.media-body {\n  zoom: 1;\n  overflow: hidden; }\n\n.media-body {\n  width: 10000px; }\n\n.media-object {\n  display: block; }\n  .media-object.img-thumbnail {\n    max-width: none; }\n\n.media-right,\n.media > .pull-right {\n  padding-left: 10px; }\n\n.media-left,\n.media > .pull-left {\n  padding-right: 10px; }\n\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top; }\n\n.media-middle {\n  vertical-align: middle; }\n\n.media-bottom {\n  vertical-align: bottom; }\n\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n.media-list {\n  padding-left: 0;\n  list-style: none; }\n\n.list-group {\n  margin-bottom: 20px;\n  padding-left: 0; }\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd; }\n  .list-group-item:first-child {\n    border-top-right-radius: 4px;\n    border-top-left-radius: 4px; }\n  .list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 4px;\n    border-bottom-left-radius: 4px; }\n\na.list-group-item,\nbutton.list-group-item {\n  color: #555; }\n  a.list-group-item .list-group-item-heading,\n  button.list-group-item .list-group-item-heading {\n    color: #333; }\n  a.list-group-item:hover, a.list-group-item:focus,\n  button.list-group-item:hover,\n  button.list-group-item:focus {\n    text-decoration: none;\n    color: #555;\n    background-color: #f5f5f5; }\n\nbutton.list-group-item {\n  width: 100%;\n  text-align: left; }\n\n.list-group-item.disabled, .list-group-item.disabled:hover, .list-group-item.disabled:focus {\n  background-color: #f5f5f5;\n  color: #e0e0e0;\n  cursor: not-allowed; }\n  .list-group-item.disabled .list-group-item-heading, .list-group-item.disabled:hover .list-group-item-heading, .list-group-item.disabled:focus .list-group-item-heading {\n    color: inherit; }\n  .list-group-item.disabled .list-group-item-text, .list-group-item.disabled:hover .list-group-item-text, .list-group-item.disabled:focus .list-group-item-text {\n    color: #e0e0e0; }\n\n.list-group-item.active, .list-group-item.active:hover, .list-group-item.active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #2ac5ee;\n  border-color: #2ac5ee; }\n  .list-group-item.active .list-group-item-heading,\n  .list-group-item.active .list-group-item-heading > small,\n  .list-group-item.active .list-group-item-heading > .small, .list-group-item.active:hover .list-group-item-heading,\n  .list-group-item.active:hover .list-group-item-heading > small,\n  .list-group-item.active:hover .list-group-item-heading > .small, .list-group-item.active:focus .list-group-item-heading,\n  .list-group-item.active:focus .list-group-item-heading > small,\n  .list-group-item.active:focus .list-group-item-heading > .small {\n    color: inherit; }\n  .list-group-item.active .list-group-item-text, .list-group-item.active:hover .list-group-item-text, .list-group-item.active:focus .list-group-item-text {\n    color: #e7f8fd; }\n\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #0f9d58; }\n\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d; }\n  a.list-group-item-success .list-group-item-heading,\n  button.list-group-item-success .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-success:hover, a.list-group-item-success:focus,\n  button.list-group-item-success:hover,\n  button.list-group-item-success:focus {\n    color: #3c763d;\n    background-color: #0d864b; }\n  a.list-group-item-success.active, a.list-group-item-success.active:hover, a.list-group-item-success.active:focus,\n  button.list-group-item-success.active,\n  button.list-group-item-success.active:hover,\n  button.list-group-item-success.active:focus {\n    color: #fff;\n    background-color: #3c763d;\n    border-color: #3c763d; }\n\n.list-group-item-info {\n  color: #31708f;\n  background-color: #2ac5ee; }\n\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f; }\n  a.list-group-item-info .list-group-item-heading,\n  button.list-group-item-info .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-info:hover, a.list-group-item-info:focus,\n  button.list-group-item-info:hover,\n  button.list-group-item-info:focus {\n    color: #31708f;\n    background-color: #13beec; }\n  a.list-group-item-info.active, a.list-group-item-info.active:hover, a.list-group-item-info.active:focus,\n  button.list-group-item-info.active,\n  button.list-group-item-info.active:hover,\n  button.list-group-item-info.active:focus {\n    color: #fff;\n    background-color: #31708f;\n    border-color: #31708f; }\n\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #f4b400; }\n\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b; }\n  a.list-group-item-warning .list-group-item-heading,\n  button.list-group-item-warning .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-warning:hover, a.list-group-item-warning:focus,\n  button.list-group-item-warning:hover,\n  button.list-group-item-warning:focus {\n    color: #8a6d3b;\n    background-color: #dba100; }\n  a.list-group-item-warning.active, a.list-group-item-warning.active:hover, a.list-group-item-warning.active:focus,\n  button.list-group-item-warning.active,\n  button.list-group-item-warning.active:hover,\n  button.list-group-item-warning.active:focus {\n    color: #fff;\n    background-color: #8a6d3b;\n    border-color: #8a6d3b; }\n\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #d80017; }\n\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442; }\n  a.list-group-item-danger .list-group-item-heading,\n  button.list-group-item-danger .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-danger:hover, a.list-group-item-danger:focus,\n  button.list-group-item-danger:hover,\n  button.list-group-item-danger:focus {\n    color: #a94442;\n    background-color: #bf0014; }\n  a.list-group-item-danger.active, a.list-group-item-danger.active:hover, a.list-group-item-danger.active:focus,\n  button.list-group-item-danger.active,\n  button.list-group-item-danger.active:hover,\n  button.list-group-item-danger.active:focus {\n    color: #fff;\n    background-color: #a94442;\n    border-color: #a94442; }\n\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3; }\n\n.panel {\n  margin-bottom: 18px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); }\n\n.panel-body {\n  padding: 15px; }\n  .panel-body:before, .panel-body:after {\n    content: \" \";\n    display: table; }\n  .panel-body:after {\n    clear: both; }\n\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px; }\n  .panel-heading > .dropdown .dropdown-toggle {\n    color: inherit; }\n\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 15px;\n  color: inherit; }\n  .panel-title > a,\n  .panel-title > small,\n  .panel-title > .small,\n  .panel-title > small > a,\n  .panel-title > .small > a {\n    color: inherit; }\n\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px; }\n\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0; }\n  .panel > .list-group .list-group-item,\n  .panel > .panel-collapse > .list-group .list-group-item {\n    border-width: 1px 0;\n    border-radius: 0; }\n  .panel > .list-group:first-child .list-group-item:first-child,\n  .panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n    border-top: 0;\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px; }\n  .panel > .list-group:last-child .list-group-item:last-child,\n  .panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n    border-bottom: 0;\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px; }\n\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0; }\n\n.list-group + .panel-footer {\n  border-top-width: 0; }\n\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0; }\n  .panel > .table caption,\n  .panel > .table-responsive > .table caption,\n  .panel > .panel-collapse > .table caption {\n    padding-left: 15px;\n    padding-right: 15px; }\n\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px; }\n  .panel > .table:first-child > thead:first-child > tr:first-child,\n  .panel > .table:first-child > tbody:first-child > tr:first-child,\n  .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n  .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n    border-top-left-radius: 3px;\n    border-top-right-radius: 3px; }\n    .panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n    .panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n      border-top-left-radius: 3px; }\n    .panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n    .panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n      border-top-right-radius: 3px; }\n\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px; }\n  .panel > .table:last-child > tbody:last-child > tr:last-child,\n  .panel > .table:last-child > tfoot:last-child > tr:last-child,\n  .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n  .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n    border-bottom-left-radius: 3px;\n    border-bottom-right-radius: 3px; }\n    .panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n    .panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n      border-bottom-left-radius: 3px; }\n    .panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n    .panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n      border-bottom-right-radius: 3px; }\n\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ddd; }\n\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0; }\n\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0; }\n  .panel > .table-bordered > thead > tr > th:first-child,\n  .panel > .table-bordered > thead > tr > td:first-child,\n  .panel > .table-bordered > tbody > tr > th:first-child,\n  .panel > .table-bordered > tbody > tr > td:first-child,\n  .panel > .table-bordered > tfoot > tr > th:first-child,\n  .panel > .table-bordered > tfoot > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0; }\n  .panel > .table-bordered > thead > tr > th:last-child,\n  .panel > .table-bordered > thead > tr > td:last-child,\n  .panel > .table-bordered > tbody > tr > th:last-child,\n  .panel > .table-bordered > tbody > tr > td:last-child,\n  .panel > .table-bordered > tfoot > tr > th:last-child,\n  .panel > .table-bordered > tfoot > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0; }\n  .panel > .table-bordered > thead > tr:first-child > td,\n  .panel > .table-bordered > thead > tr:first-child > th,\n  .panel > .table-bordered > tbody > tr:first-child > td,\n  .panel > .table-bordered > tbody > tr:first-child > th,\n  .panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n  .panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n  .panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n  .panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n    border-bottom: 0; }\n  .panel > .table-bordered > tbody > tr:last-child > td,\n  .panel > .table-bordered > tbody > tr:last-child > th,\n  .panel > .table-bordered > tfoot > tr:last-child > td,\n  .panel > .table-bordered > tfoot > tr:last-child > th,\n  .panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n  .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n    border-bottom: 0; }\n\n.panel > .table-responsive {\n  border: 0;\n  margin-bottom: 0; }\n\n.panel-group {\n  margin-bottom: 18px; }\n  .panel-group .panel {\n    margin-bottom: 0;\n    border-radius: 4px; }\n    .panel-group .panel + .panel {\n      margin-top: 5px; }\n  .panel-group .panel-heading {\n    border-bottom: 0; }\n    .panel-group .panel-heading + .panel-collapse > .panel-body,\n    .panel-group .panel-heading + .panel-collapse > .list-group {\n      border-top: 1px solid #ddd; }\n  .panel-group .panel-footer {\n    border-top: 0; }\n    .panel-group .panel-footer + .panel-collapse .panel-body {\n      border-bottom: 1px solid #ddd; }\n\n.panel-default {\n  border-color: #ddd; }\n  .panel-default > .panel-heading {\n    color: #404040;\n    background-color: #f5f5f5;\n    border-color: #ddd; }\n    .panel-default > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #ddd; }\n    .panel-default > .panel-heading .badge {\n      color: #f5f5f5;\n      background-color: #404040; }\n  .panel-default > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #ddd; }\n\n.panel-primary {\n  border-color: #2ac5ee; }\n  .panel-primary > .panel-heading {\n    color: #fff;\n    background-color: #2ac5ee;\n    border-color: #2ac5ee; }\n    .panel-primary > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #2ac5ee; }\n    .panel-primary > .panel-heading .badge {\n      color: #2ac5ee;\n      background-color: #fff; }\n  .panel-primary > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #2ac5ee; }\n\n.panel-success {\n  border-color: #0d8637; }\n  .panel-success > .panel-heading {\n    color: #3c763d;\n    background-color: #0f9d58;\n    border-color: #0d8637; }\n    .panel-success > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #0d8637; }\n    .panel-success > .panel-heading .badge {\n      color: #0f9d58;\n      background-color: #3c763d; }\n  .panel-success > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #0d8637; }\n\n.panel-info {\n  border-color: #12d9e2; }\n  .panel-info > .panel-heading {\n    color: #31708f;\n    background-color: #2ac5ee;\n    border-color: #12d9e2; }\n    .panel-info > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #12d9e2; }\n    .panel-info > .panel-heading .badge {\n      color: #2ac5ee;\n      background-color: #31708f; }\n  .panel-info > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #12d9e2; }\n\n.panel-warning {\n  border-color: #db7d00; }\n  .panel-warning > .panel-heading {\n    color: #8a6d3b;\n    background-color: #f4b400;\n    border-color: #db7d00; }\n    .panel-warning > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #db7d00; }\n    .panel-warning > .panel-heading .badge {\n      color: #f4b400;\n      background-color: #8a6d3b; }\n  .panel-warning > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #db7d00; }\n\n.panel-danger {\n  border-color: #bf0034; }\n  .panel-danger > .panel-heading {\n    color: #a94442;\n    background-color: #d80017;\n    border-color: #bf0034; }\n    .panel-danger > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #bf0034; }\n    .panel-danger > .panel-heading .badge {\n      color: #d80017;\n      background-color: #a94442; }\n  .panel-danger > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #bf0034; }\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden; }\n  .embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0; }\n\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%; }\n\n.embed-responsive-4by3 {\n  padding-bottom: 75%; }\n\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05); }\n  .well blockquote {\n    border-color: #ddd;\n    border-color: rgba(0, 0, 0, 0.15); }\n\n.well-lg {\n  padding: 24px;\n  border-radius: 6px; }\n\n.well-sm {\n  padding: 9px;\n  border-radius: 3px; }\n\n.close {\n  float: right;\n  font-size: 19.5px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.2;\n  filter: alpha(opacity=20); }\n  .close:hover, .close:focus {\n    color: #000;\n    text-decoration: none;\n    cursor: pointer;\n    opacity: 0.5;\n    filter: alpha(opacity=50); }\n\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none; }\n\n.modal-open {\n  overflow: hidden; }\n\n.modal {\n  display: none;\n  overflow: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  -webkit-overflow-scrolling: touch;\n  outline: 0; }\n  .modal.fade .modal-dialog {\n    -webkit-transform: translate(0, -25%);\n    -ms-transform: translate(0, -25%);\n    -o-transform: translate(0, -25%);\n    transform: translate(0, -25%);\n    -webkit-transition: -webkit-transform 0.3s ease-out;\n    -moz-transition: -moz-transform 0.3s ease-out;\n    -o-transition: -o-transform 0.3s ease-out;\n    transition: transform 0.3s ease-out; }\n  .modal.in .modal-dialog {\n    -webkit-transform: translate(0, 0);\n    -ms-transform: translate(0, 0);\n    -o-transform: translate(0, 0);\n    transform: translate(0, 0); }\n\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px; }\n\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  border: 1px solid #999;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  background-clip: padding-box;\n  outline: 0; }\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000; }\n  .modal-backdrop.fade {\n    opacity: 0;\n    filter: alpha(opacity=0); }\n  .modal-backdrop.in {\n    opacity: 0.5;\n    filter: alpha(opacity=50); }\n\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5; }\n  .modal-header:before, .modal-header:after {\n    content: \" \";\n    display: table; }\n  .modal-header:after {\n    clear: both; }\n\n.modal-header .close {\n  margin-top: -2px; }\n\n.modal-title {\n  margin: 0;\n  line-height: 1.42857; }\n\n.modal-body {\n  position: relative;\n  padding: 15px; }\n\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5; }\n  .modal-footer:before, .modal-footer:after {\n    content: \" \";\n    display: table; }\n  .modal-footer:after {\n    clear: both; }\n  .modal-footer .btn + .btn {\n    margin-left: 5px;\n    margin-bottom: 0; }\n  .modal-footer .btn-group .btn + .btn {\n    margin-left: -1px; }\n  .modal-footer .btn-block + .btn-block {\n    margin-left: 0; }\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto; }\n  .modal-content {\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); }\n  .modal-sm {\n    width: 300px; } }\n\n@media (min-width: 992px) {\n  .modal-lg {\n    width: 900px; } }\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 12px;\n  opacity: 0;\n  filter: alpha(opacity=0); }\n  .tooltip.in {\n    opacity: 0.9;\n    filter: alpha(opacity=90); }\n  .tooltip.top {\n    margin-top: -3px;\n    padding: 5px 0; }\n  .tooltip.right {\n    margin-left: 3px;\n    padding: 0 5px; }\n  .tooltip.bottom {\n    margin-top: 3px;\n    padding: 5px 0; }\n  .tooltip.left {\n    margin-left: -3px;\n    padding: 0 5px; }\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 4px; }\n\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n.tooltip.top .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.top-left .tooltip-arrow {\n  bottom: 0;\n  right: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.top-right .tooltip-arrow {\n  bottom: 0;\n  left: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.right .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #000; }\n\n.tooltip.left .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #000; }\n\n.tooltip.bottom .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.tooltip.bottom-left .tooltip-arrow {\n  top: 0;\n  right: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.tooltip.bottom-right .tooltip-arrow {\n  top: 0;\n  left: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: none;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 13px;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); }\n  .popover.top {\n    margin-top: -10px; }\n  .popover.right {\n    margin-left: 10px; }\n  .popover.bottom {\n    margin-top: 10px; }\n  .popover.left {\n    margin-left: -10px; }\n\n.popover-title {\n  margin: 0;\n  padding: 8px 14px;\n  font-size: 13px;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 5px 5px 0 0; }\n\n.popover-content {\n  padding: 9px 14px; }\n\n.popover > .arrow, .popover > .arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n.popover > .arrow {\n  border-width: 11px; }\n\n.popover > .arrow:after {\n  border-width: 10px;\n  content: \"\"; }\n\n.popover.top > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-bottom-width: 0;\n  border-top-color: #999999;\n  border-top-color: rgba(0, 0, 0, 0.25);\n  bottom: -11px; }\n  .popover.top > .arrow:after {\n    content: \" \";\n    bottom: 1px;\n    margin-left: -10px;\n    border-bottom-width: 0;\n    border-top-color: #fff; }\n\n.popover.right > .arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-left-width: 0;\n  border-right-color: #999999;\n  border-right-color: rgba(0, 0, 0, 0.25); }\n  .popover.right > .arrow:after {\n    content: \" \";\n    left: 1px;\n    bottom: -10px;\n    border-left-width: 0;\n    border-right-color: #fff; }\n\n.popover.bottom > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: #999999;\n  border-bottom-color: rgba(0, 0, 0, 0.25);\n  top: -11px; }\n  .popover.bottom > .arrow:after {\n    content: \" \";\n    top: 1px;\n    margin-left: -10px;\n    border-top-width: 0;\n    border-bottom-color: #fff; }\n\n.popover.left > .arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: #999999;\n  border-left-color: rgba(0, 0, 0, 0.25); }\n  .popover.left > .arrow:after {\n    content: \" \";\n    right: 1px;\n    border-right-width: 0;\n    border-left-color: #fff;\n    bottom: -10px; }\n\n.carousel {\n  position: relative; }\n\n.carousel-inner {\n  position: relative;\n  overflow: hidden;\n  width: 100%; }\n  .carousel-inner > .item {\n    display: none;\n    position: relative;\n    -webkit-transition: 0.6s ease-in-out left;\n    -o-transition: 0.6s ease-in-out left;\n    transition: 0.6s ease-in-out left; }\n    .carousel-inner > .item > img,\n    .carousel-inner > .item > a > img {\n      display: block;\n      max-width: 100%;\n      height: auto;\n      line-height: 1; }\n    @media all and (transform-3d), (-webkit-transform-3d) {\n      .carousel-inner > .item {\n        -webkit-transition: -webkit-transform 0.6s ease-in-out;\n        -moz-transition: -moz-transform 0.6s ease-in-out;\n        -o-transition: -o-transform 0.6s ease-in-out;\n        transition: transform 0.6s ease-in-out;\n        -webkit-backface-visibility: hidden;\n        -moz-backface-visibility: hidden;\n        backface-visibility: hidden;\n        -webkit-perspective: 1000px;\n        -moz-perspective: 1000px;\n        perspective: 1000px; }\n        .carousel-inner > .item.next, .carousel-inner > .item.active.right {\n          -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n          left: 0; }\n        .carousel-inner > .item.prev, .carousel-inner > .item.active.left {\n          -webkit-transform: translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0);\n          left: 0; }\n        .carousel-inner > .item.next.left, .carousel-inner > .item.prev.right, .carousel-inner > .item.active {\n          -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n          left: 0; } }\n  .carousel-inner > .active,\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    display: block; }\n  .carousel-inner > .active {\n    left: 0; }\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  .carousel-inner > .next {\n    left: 100%; }\n  .carousel-inner > .prev {\n    left: -100%; }\n  .carousel-inner > .next.left,\n  .carousel-inner > .prev.right {\n    left: 0; }\n  .carousel-inner > .active.left {\n    left: -100%; }\n  .carousel-inner > .active.right {\n    left: 100%; }\n\n.carousel-control {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 15%;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n  background-color: transparent; }\n  .carousel-control.left {\n    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1); }\n  .carousel-control.right {\n    left: auto;\n    right: 0;\n    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1); }\n  .carousel-control:hover, .carousel-control:focus {\n    outline: 0;\n    color: #fff;\n    text-decoration: none;\n    opacity: 0.9;\n    filter: alpha(opacity=90); }\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next,\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right {\n    position: absolute;\n    top: 50%;\n    margin-top: -10px;\n    z-index: 5;\n    display: inline-block; }\n  .carousel-control .icon-prev,\n  .carousel-control .glyphicon-chevron-left {\n    left: 50%;\n    margin-left: -10px; }\n  .carousel-control .icon-next,\n  .carousel-control .glyphicon-chevron-right {\n    right: 50%;\n    margin-right: -10px; }\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 20px;\n    height: 20px;\n    line-height: 1;\n    font-family: serif; }\n  .carousel-control .icon-prev:before {\n    content: '\\2039'; }\n  .carousel-control .icon-next:before {\n    content: '\\203a'; }\n\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  margin-left: -30%;\n  padding-left: 0;\n  list-style: none;\n  text-align: center; }\n  .carousel-indicators li {\n    display: inline-block;\n    width: 10px;\n    height: 10px;\n    margin: 1px;\n    text-indent: -999px;\n    border: 1px solid #fff;\n    border-radius: 10px;\n    cursor: pointer;\n    background-color: #000 \\9;\n    background-color: transparent; }\n  .carousel-indicators .active {\n    margin: 0;\n    width: 12px;\n    height: 12px;\n    background-color: #fff; }\n\n.carousel-caption {\n  position: absolute;\n  left: 15%;\n  right: 15%;\n  bottom: 20px;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); }\n  .carousel-caption .btn {\n    text-shadow: none; }\n\n@media screen and (min-width: 768px) {\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -10px;\n    font-size: 30px; }\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .icon-prev {\n    margin-left: -10px; }\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-next {\n    margin-right: -10px; }\n  .carousel-caption {\n    left: 20%;\n    right: 20%;\n    padding-bottom: 30px; }\n  .carousel-indicators {\n    bottom: 20px; } }\n\n.clearfix:before, .clearfix:after {\n  content: \" \";\n  display: table; }\n\n.clearfix:after {\n  clear: both; }\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.pull-right {\n  float: right !important; }\n\n.pull-left {\n  float: left !important; }\n\n.hide {\n  display: none !important; }\n\n.show {\n  display: block !important; }\n\n.invisible {\n  visibility: hidden; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0; }\n\n.hidden {\n  display: none !important; }\n\n.affix {\n  position: fixed; }\n\n@-ms-viewport {\n  width: device-width; }\n\n.visible-xs {\n  display: none !important; }\n\n.visible-sm {\n  display: none !important; }\n\n.visible-md {\n  display: none !important; }\n\n.visible-lg {\n  display: none !important; }\n\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important; }\n\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important; }\n  table.visible-xs {\n    display: table !important; }\n  tr.visible-xs {\n    display: table-row !important; }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important; }\n  table.visible-sm {\n    display: table !important; }\n  tr.visible-sm {\n    display: table-row !important; }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important; }\n  table.visible-md {\n    display: table !important; }\n  tr.visible-md {\n    display: table-row !important; }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important; }\n  table.visible-lg {\n    display: table !important; }\n  tr.visible-lg {\n    display: table-row !important; }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important; } }\n\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important; } }\n\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important; } }\n\n.visible-print {\n  display: none !important; }\n\n@media print {\n  .visible-print {\n    display: block !important; }\n  table.visible-print {\n    display: table !important; }\n  tr.visible-print {\n    display: table-row !important; }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important; } }\n\n.visible-print-block {\n  display: none !important; }\n  @media print {\n    .visible-print-block {\n      display: block !important; } }\n\n.visible-print-inline {\n  display: none !important; }\n  @media print {\n    .visible-print-inline {\n      display: inline !important; } }\n\n.visible-print-inline-block {\n  display: none !important; }\n  @media print {\n    .visible-print-inline-block {\n      display: inline-block !important; } }\n\n@media print {\n  .hidden-print {\n    display: none !important; } }\n\n/*\n * Social Buttons for Bootstrap\n *\n * Copyright 2013-2015 Panayiotis Lipiridis\n * Licensed under the MIT License\n *\n * https://github.com/lipis/bootstrap-social\n */\n.btn-social, .btn-social-icon {\n  position: relative;\n  padding-left: 42px;\n  text-align: left;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n  .btn-social > :first-child, .btn-social-icon > :first-child {\n    position: absolute;\n    left: 0;\n    top: 0;\n    bottom: 0;\n    width: 30px;\n    line-height: 32px;\n    font-size: 1.6em;\n    text-align: center;\n    border-right: 1px solid rgba(0, 0, 0, 0.2); }\n  .btn-social.btn-lg, .btn-group-lg > .btn-social.btn, .btn-group-lg > .btn.btn-social-icon, .btn-lg.btn-social-icon {\n    padding-left: 60px; }\n    .btn-social.btn-lg > :first-child, .btn-group-lg > .btn-social.btn > :first-child, .btn-group-lg > .btn.btn-social-icon > :first-child, .btn-lg.btn-social-icon > :first-child {\n      line-height: 44px;\n      width: 44px;\n      font-size: 1.8em; }\n  .btn-social.btn-sm, .btn-group-sm > .btn-social.btn, .btn-group-sm > .btn.btn-social-icon, .btn-sm.btn-social-icon {\n    padding-left: 38px; }\n    .btn-social.btn-sm > :first-child, .btn-group-sm > .btn-social.btn > :first-child, .btn-group-sm > .btn.btn-social-icon > :first-child, .btn-sm.btn-social-icon > :first-child {\n      line-height: 28px;\n      width: 28px;\n      font-size: 1.4em; }\n  .btn-social.btn-xs, .btn-group-xs > .btn-social.btn, .btn-group-xs > .btn.btn-social-icon, .btn-xs.btn-social-icon {\n    padding-left: 30px; }\n    .btn-social.btn-xs > :first-child, .btn-group-xs > .btn-social.btn > :first-child, .btn-group-xs > .btn.btn-social-icon > :first-child, .btn-xs.btn-social-icon > :first-child {\n      line-height: 20px;\n      width: 20px;\n      font-size: 1.2em; }\n\n.btn-social-icon {\n  height: 32px;\n  width: 32px;\n  padding: 0; }\n  .btn-social-icon > :first-child {\n    border: none;\n    text-align: center;\n    width: 100% !important; }\n  .btn-social-icon.btn-lg, .btn-group-lg > .btn-social-icon.btn {\n    height: 44px;\n    width: 44px;\n    padding-left: 0;\n    padding-right: 0; }\n  .btn-social-icon.btn-sm, .btn-group-sm > .btn-social-icon.btn {\n    height: 30px;\n    width: 30px;\n    padding-left: 0;\n    padding-right: 0; }\n  .btn-social-icon.btn-xs, .btn-group-xs > .btn-social-icon.btn {\n    height: 22px;\n    width: 22px;\n    padding-left: 0;\n    padding-right: 0; }\n\n.btn-adn {\n  background-color: #d87a68;\n  color: #fff;\n  background-color: #d87a68;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-adn:focus, .btn-adn.focus {\n    color: #fff;\n    background-color: #ce563f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-adn:hover {\n    color: #fff;\n    background-color: #ce563f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-adn:active, .btn-adn.active,\n  .open > .btn-adn.dropdown-toggle {\n    color: #fff;\n    background-color: #ce563f;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-adn:active:hover, .btn-adn:active:focus, .btn-adn:active.focus, .btn-adn.active:hover, .btn-adn.active:focus, .btn-adn.active.focus,\n    .open > .btn-adn.dropdown-toggle:hover,\n    .open > .btn-adn.dropdown-toggle:focus,\n    .open > .btn-adn.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #b94630;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-adn:active, .btn-adn.active,\n  .open > .btn-adn.dropdown-toggle {\n    background-image: none; }\n  .btn-adn.disabled:hover, .btn-adn.disabled:focus, .btn-adn.disabled.focus, .btn-adn[disabled]:hover, .btn-adn[disabled]:focus, .btn-adn[disabled].focus,\n  fieldset[disabled] .btn-adn:hover,\n  fieldset[disabled] .btn-adn:focus,\n  fieldset[disabled] .btn-adn.focus {\n    background-color: #d87a68;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-adn .badge {\n    color: #d87a68;\n    background-color: #fff; }\n\n.btn-bitbucket {\n  background-color: #205081;\n  color: #fff;\n  background-color: #205081;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-bitbucket:focus, .btn-bitbucket.focus {\n    color: #fff;\n    background-color: #163758;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-bitbucket:hover {\n    color: #fff;\n    background-color: #163758;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-bitbucket:active, .btn-bitbucket.active,\n  .open > .btn-bitbucket.dropdown-toggle {\n    color: #fff;\n    background-color: #163758;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-bitbucket:active:hover, .btn-bitbucket:active:focus, .btn-bitbucket:active.focus, .btn-bitbucket.active:hover, .btn-bitbucket.active:focus, .btn-bitbucket.active.focus,\n    .open > .btn-bitbucket.dropdown-toggle:hover,\n    .open > .btn-bitbucket.dropdown-toggle:focus,\n    .open > .btn-bitbucket.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #0f253c;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-bitbucket:active, .btn-bitbucket.active,\n  .open > .btn-bitbucket.dropdown-toggle {\n    background-image: none; }\n  .btn-bitbucket.disabled:hover, .btn-bitbucket.disabled:focus, .btn-bitbucket.disabled.focus, .btn-bitbucket[disabled]:hover, .btn-bitbucket[disabled]:focus, .btn-bitbucket[disabled].focus,\n  fieldset[disabled] .btn-bitbucket:hover,\n  fieldset[disabled] .btn-bitbucket:focus,\n  fieldset[disabled] .btn-bitbucket.focus {\n    background-color: #205081;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-bitbucket .badge {\n    color: #205081;\n    background-color: #fff; }\n\n.btn-dropbox {\n  background-color: #1087dd;\n  color: #fff;\n  background-color: #1087dd;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-dropbox:focus, .btn-dropbox.focus {\n    color: #fff;\n    background-color: #0d6aad;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-dropbox:hover {\n    color: #fff;\n    background-color: #0d6aad;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-dropbox:active, .btn-dropbox.active,\n  .open > .btn-dropbox.dropdown-toggle {\n    color: #fff;\n    background-color: #0d6aad;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-dropbox:active:hover, .btn-dropbox:active:focus, .btn-dropbox:active.focus, .btn-dropbox.active:hover, .btn-dropbox.active:focus, .btn-dropbox.active.focus,\n    .open > .btn-dropbox.dropdown-toggle:hover,\n    .open > .btn-dropbox.dropdown-toggle:focus,\n    .open > .btn-dropbox.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #0a568c;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-dropbox:active, .btn-dropbox.active,\n  .open > .btn-dropbox.dropdown-toggle {\n    background-image: none; }\n  .btn-dropbox.disabled:hover, .btn-dropbox.disabled:focus, .btn-dropbox.disabled.focus, .btn-dropbox[disabled]:hover, .btn-dropbox[disabled]:focus, .btn-dropbox[disabled].focus,\n  fieldset[disabled] .btn-dropbox:hover,\n  fieldset[disabled] .btn-dropbox:focus,\n  fieldset[disabled] .btn-dropbox.focus {\n    background-color: #1087dd;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-dropbox .badge {\n    color: #1087dd;\n    background-color: #fff; }\n\n.btn-facebook {\n  background-color: #3b5998;\n  color: #fff;\n  background-color: #3b5998;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-facebook:focus, .btn-facebook.focus {\n    color: #fff;\n    background-color: #2d4373;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-facebook:hover {\n    color: #fff;\n    background-color: #2d4373;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-facebook:active, .btn-facebook.active,\n  .open > .btn-facebook.dropdown-toggle {\n    color: #fff;\n    background-color: #2d4373;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-facebook:active:hover, .btn-facebook:active:focus, .btn-facebook:active.focus, .btn-facebook.active:hover, .btn-facebook.active:focus, .btn-facebook.active.focus,\n    .open > .btn-facebook.dropdown-toggle:hover,\n    .open > .btn-facebook.dropdown-toggle:focus,\n    .open > .btn-facebook.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #23345a;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-facebook:active, .btn-facebook.active,\n  .open > .btn-facebook.dropdown-toggle {\n    background-image: none; }\n  .btn-facebook.disabled:hover, .btn-facebook.disabled:focus, .btn-facebook.disabled.focus, .btn-facebook[disabled]:hover, .btn-facebook[disabled]:focus, .btn-facebook[disabled].focus,\n  fieldset[disabled] .btn-facebook:hover,\n  fieldset[disabled] .btn-facebook:focus,\n  fieldset[disabled] .btn-facebook.focus {\n    background-color: #3b5998;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-facebook .badge {\n    color: #3b5998;\n    background-color: #fff; }\n\n.btn-flickr {\n  background-color: #ff0084;\n  color: #fff;\n  background-color: #ff0084;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-flickr:focus, .btn-flickr.focus {\n    color: #fff;\n    background-color: #cc006a;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-flickr:hover {\n    color: #fff;\n    background-color: #cc006a;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-flickr:active, .btn-flickr.active,\n  .open > .btn-flickr.dropdown-toggle {\n    color: #fff;\n    background-color: #cc006a;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-flickr:active:hover, .btn-flickr:active:focus, .btn-flickr:active.focus, .btn-flickr.active:hover, .btn-flickr.active:focus, .btn-flickr.active.focus,\n    .open > .btn-flickr.dropdown-toggle:hover,\n    .open > .btn-flickr.dropdown-toggle:focus,\n    .open > .btn-flickr.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #a80057;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-flickr:active, .btn-flickr.active,\n  .open > .btn-flickr.dropdown-toggle {\n    background-image: none; }\n  .btn-flickr.disabled:hover, .btn-flickr.disabled:focus, .btn-flickr.disabled.focus, .btn-flickr[disabled]:hover, .btn-flickr[disabled]:focus, .btn-flickr[disabled].focus,\n  fieldset[disabled] .btn-flickr:hover,\n  fieldset[disabled] .btn-flickr:focus,\n  fieldset[disabled] .btn-flickr.focus {\n    background-color: #ff0084;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-flickr .badge {\n    color: #ff0084;\n    background-color: #fff; }\n\n.btn-foursquare {\n  background-color: #f94877;\n  color: #fff;\n  background-color: #f94877;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-foursquare:focus, .btn-foursquare.focus {\n    color: #fff;\n    background-color: #f71752;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-foursquare:hover {\n    color: #fff;\n    background-color: #f71752;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-foursquare:active, .btn-foursquare.active,\n  .open > .btn-foursquare.dropdown-toggle {\n    color: #fff;\n    background-color: #f71752;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-foursquare:active:hover, .btn-foursquare:active:focus, .btn-foursquare:active.focus, .btn-foursquare.active:hover, .btn-foursquare.active:focus, .btn-foursquare.active.focus,\n    .open > .btn-foursquare.dropdown-toggle:hover,\n    .open > .btn-foursquare.dropdown-toggle:focus,\n    .open > .btn-foursquare.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #e30742;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-foursquare:active, .btn-foursquare.active,\n  .open > .btn-foursquare.dropdown-toggle {\n    background-image: none; }\n  .btn-foursquare.disabled:hover, .btn-foursquare.disabled:focus, .btn-foursquare.disabled.focus, .btn-foursquare[disabled]:hover, .btn-foursquare[disabled]:focus, .btn-foursquare[disabled].focus,\n  fieldset[disabled] .btn-foursquare:hover,\n  fieldset[disabled] .btn-foursquare:focus,\n  fieldset[disabled] .btn-foursquare.focus {\n    background-color: #f94877;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-foursquare .badge {\n    color: #f94877;\n    background-color: #fff; }\n\n.btn-github {\n  background-color: #444444;\n  color: #fff;\n  background-color: #444444;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-github:focus, .btn-github.focus {\n    color: #fff;\n    background-color: #2b2b2b;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-github:hover {\n    color: #fff;\n    background-color: #2b2b2b;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-github:active, .btn-github.active,\n  .open > .btn-github.dropdown-toggle {\n    color: #fff;\n    background-color: #2b2b2b;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-github:active:hover, .btn-github:active:focus, .btn-github:active.focus, .btn-github.active:hover, .btn-github.active:focus, .btn-github.active.focus,\n    .open > .btn-github.dropdown-toggle:hover,\n    .open > .btn-github.dropdown-toggle:focus,\n    .open > .btn-github.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #191919;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-github:active, .btn-github.active,\n  .open > .btn-github.dropdown-toggle {\n    background-image: none; }\n  .btn-github.disabled:hover, .btn-github.disabled:focus, .btn-github.disabled.focus, .btn-github[disabled]:hover, .btn-github[disabled]:focus, .btn-github[disabled].focus,\n  fieldset[disabled] .btn-github:hover,\n  fieldset[disabled] .btn-github:focus,\n  fieldset[disabled] .btn-github.focus {\n    background-color: #444444;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-github .badge {\n    color: #444444;\n    background-color: #fff; }\n\n.btn-google {\n  background-color: #dd4b39;\n  color: #fff;\n  background-color: #dd4b39;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-google:focus, .btn-google.focus {\n    color: #fff;\n    background-color: #c23321;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-google:hover {\n    color: #fff;\n    background-color: #c23321;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-google:active, .btn-google.active,\n  .open > .btn-google.dropdown-toggle {\n    color: #fff;\n    background-color: #c23321;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-google:active:hover, .btn-google:active:focus, .btn-google:active.focus, .btn-google.active:hover, .btn-google.active:focus, .btn-google.active.focus,\n    .open > .btn-google.dropdown-toggle:hover,\n    .open > .btn-google.dropdown-toggle:focus,\n    .open > .btn-google.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #a32b1c;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-google:active, .btn-google.active,\n  .open > .btn-google.dropdown-toggle {\n    background-image: none; }\n  .btn-google.disabled:hover, .btn-google.disabled:focus, .btn-google.disabled.focus, .btn-google[disabled]:hover, .btn-google[disabled]:focus, .btn-google[disabled].focus,\n  fieldset[disabled] .btn-google:hover,\n  fieldset[disabled] .btn-google:focus,\n  fieldset[disabled] .btn-google.focus {\n    background-color: #dd4b39;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-google .badge {\n    color: #dd4b39;\n    background-color: #fff; }\n\n.btn-instagram {\n  background-color: #3f729b;\n  color: #fff;\n  background-color: #3f729b;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-instagram:focus, .btn-instagram.focus {\n    color: #fff;\n    background-color: #305777;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-instagram:hover {\n    color: #fff;\n    background-color: #305777;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-instagram:active, .btn-instagram.active,\n  .open > .btn-instagram.dropdown-toggle {\n    color: #fff;\n    background-color: #305777;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-instagram:active:hover, .btn-instagram:active:focus, .btn-instagram:active.focus, .btn-instagram.active:hover, .btn-instagram.active:focus, .btn-instagram.active.focus,\n    .open > .btn-instagram.dropdown-toggle:hover,\n    .open > .btn-instagram.dropdown-toggle:focus,\n    .open > .btn-instagram.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #26455d;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-instagram:active, .btn-instagram.active,\n  .open > .btn-instagram.dropdown-toggle {\n    background-image: none; }\n  .btn-instagram.disabled:hover, .btn-instagram.disabled:focus, .btn-instagram.disabled.focus, .btn-instagram[disabled]:hover, .btn-instagram[disabled]:focus, .btn-instagram[disabled].focus,\n  fieldset[disabled] .btn-instagram:hover,\n  fieldset[disabled] .btn-instagram:focus,\n  fieldset[disabled] .btn-instagram.focus {\n    background-color: #3f729b;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-instagram .badge {\n    color: #3f729b;\n    background-color: #fff; }\n\n.btn-linkedin {\n  background-color: #007bb6;\n  color: #fff;\n  background-color: #007bb6;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-linkedin:focus, .btn-linkedin.focus {\n    color: #fff;\n    background-color: #005983;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-linkedin:hover {\n    color: #fff;\n    background-color: #005983;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-linkedin:active, .btn-linkedin.active,\n  .open > .btn-linkedin.dropdown-toggle {\n    color: #fff;\n    background-color: #005983;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-linkedin:active:hover, .btn-linkedin:active:focus, .btn-linkedin:active.focus, .btn-linkedin.active:hover, .btn-linkedin.active:focus, .btn-linkedin.active.focus,\n    .open > .btn-linkedin.dropdown-toggle:hover,\n    .open > .btn-linkedin.dropdown-toggle:focus,\n    .open > .btn-linkedin.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #00405f;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-linkedin:active, .btn-linkedin.active,\n  .open > .btn-linkedin.dropdown-toggle {\n    background-image: none; }\n  .btn-linkedin.disabled:hover, .btn-linkedin.disabled:focus, .btn-linkedin.disabled.focus, .btn-linkedin[disabled]:hover, .btn-linkedin[disabled]:focus, .btn-linkedin[disabled].focus,\n  fieldset[disabled] .btn-linkedin:hover,\n  fieldset[disabled] .btn-linkedin:focus,\n  fieldset[disabled] .btn-linkedin.focus {\n    background-color: #007bb6;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-linkedin .badge {\n    color: #007bb6;\n    background-color: #fff; }\n\n.btn-microsoft {\n  background-color: #2672ec;\n  color: #fff;\n  background-color: #2672ec;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-microsoft:focus, .btn-microsoft.focus {\n    color: #fff;\n    background-color: #125acd;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-microsoft:hover {\n    color: #fff;\n    background-color: #125acd;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-microsoft:active, .btn-microsoft.active,\n  .open > .btn-microsoft.dropdown-toggle {\n    color: #fff;\n    background-color: #125acd;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-microsoft:active:hover, .btn-microsoft:active:focus, .btn-microsoft:active.focus, .btn-microsoft.active:hover, .btn-microsoft.active:focus, .btn-microsoft.active.focus,\n    .open > .btn-microsoft.dropdown-toggle:hover,\n    .open > .btn-microsoft.dropdown-toggle:focus,\n    .open > .btn-microsoft.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #0f4bac;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-microsoft:active, .btn-microsoft.active,\n  .open > .btn-microsoft.dropdown-toggle {\n    background-image: none; }\n  .btn-microsoft.disabled:hover, .btn-microsoft.disabled:focus, .btn-microsoft.disabled.focus, .btn-microsoft[disabled]:hover, .btn-microsoft[disabled]:focus, .btn-microsoft[disabled].focus,\n  fieldset[disabled] .btn-microsoft:hover,\n  fieldset[disabled] .btn-microsoft:focus,\n  fieldset[disabled] .btn-microsoft.focus {\n    background-color: #2672ec;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-microsoft .badge {\n    color: #2672ec;\n    background-color: #fff; }\n\n.btn-lastfm {\n  background-color: #d21309;\n  color: #fff;\n  background-color: #d21309;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-lastfm:focus, .btn-lastfm.focus {\n    color: #fff;\n    background-color: #a10f07;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-lastfm:hover {\n    color: #fff;\n    background-color: #a10f07;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-lastfm:active, .btn-lastfm.active,\n  .open > .btn-lastfm.dropdown-toggle {\n    color: #fff;\n    background-color: #a10f07;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-lastfm:active:hover, .btn-lastfm:active:focus, .btn-lastfm:active.focus, .btn-lastfm.active:hover, .btn-lastfm.active:focus, .btn-lastfm.active.focus,\n    .open > .btn-lastfm.dropdown-toggle:hover,\n    .open > .btn-lastfm.dropdown-toggle:focus,\n    .open > .btn-lastfm.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #7f0b05;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-lastfm:active, .btn-lastfm.active,\n  .open > .btn-lastfm.dropdown-toggle {\n    background-image: none; }\n  .btn-lastfm.disabled:hover, .btn-lastfm.disabled:focus, .btn-lastfm.disabled.focus, .btn-lastfm[disabled]:hover, .btn-lastfm[disabled]:focus, .btn-lastfm[disabled].focus,\n  fieldset[disabled] .btn-lastfm:hover,\n  fieldset[disabled] .btn-lastfm:focus,\n  fieldset[disabled] .btn-lastfm.focus {\n    background-color: #d21309;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-lastfm .badge {\n    color: #d21309;\n    background-color: #fff; }\n\n.btn-odnoklassniki {\n  background-color: #f4731c;\n  color: #fff;\n  background-color: #f4731c;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-odnoklassniki:focus, .btn-odnoklassniki.focus {\n    color: #fff;\n    background-color: #d35b0a;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-odnoklassniki:hover {\n    color: #fff;\n    background-color: #d35b0a;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-odnoklassniki:active, .btn-odnoklassniki.active,\n  .open > .btn-odnoklassniki.dropdown-toggle {\n    color: #fff;\n    background-color: #d35b0a;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-odnoklassniki:active:hover, .btn-odnoklassniki:active:focus, .btn-odnoklassniki:active.focus, .btn-odnoklassniki.active:hover, .btn-odnoklassniki.active:focus, .btn-odnoklassniki.active.focus,\n    .open > .btn-odnoklassniki.dropdown-toggle:hover,\n    .open > .btn-odnoklassniki.dropdown-toggle:focus,\n    .open > .btn-odnoklassniki.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #b14c09;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-odnoklassniki:active, .btn-odnoklassniki.active,\n  .open > .btn-odnoklassniki.dropdown-toggle {\n    background-image: none; }\n  .btn-odnoklassniki.disabled:hover, .btn-odnoklassniki.disabled:focus, .btn-odnoklassniki.disabled.focus, .btn-odnoklassniki[disabled]:hover, .btn-odnoklassniki[disabled]:focus, .btn-odnoklassniki[disabled].focus,\n  fieldset[disabled] .btn-odnoklassniki:hover,\n  fieldset[disabled] .btn-odnoklassniki:focus,\n  fieldset[disabled] .btn-odnoklassniki.focus {\n    background-color: #f4731c;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-odnoklassniki .badge {\n    color: #f4731c;\n    background-color: #fff; }\n\n.btn-openid {\n  background-color: #f7931e;\n  color: #fff;\n  background-color: #f7931e;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-openid:focus, .btn-openid.focus {\n    color: #fff;\n    background-color: #da7908;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-openid:hover {\n    color: #fff;\n    background-color: #da7908;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-openid:active, .btn-openid.active,\n  .open > .btn-openid.dropdown-toggle {\n    color: #fff;\n    background-color: #da7908;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-openid:active:hover, .btn-openid:active:focus, .btn-openid:active.focus, .btn-openid.active:hover, .btn-openid.active:focus, .btn-openid.active.focus,\n    .open > .btn-openid.dropdown-toggle:hover,\n    .open > .btn-openid.dropdown-toggle:focus,\n    .open > .btn-openid.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #b86607;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-openid:active, .btn-openid.active,\n  .open > .btn-openid.dropdown-toggle {\n    background-image: none; }\n  .btn-openid.disabled:hover, .btn-openid.disabled:focus, .btn-openid.disabled.focus, .btn-openid[disabled]:hover, .btn-openid[disabled]:focus, .btn-openid[disabled].focus,\n  fieldset[disabled] .btn-openid:hover,\n  fieldset[disabled] .btn-openid:focus,\n  fieldset[disabled] .btn-openid.focus {\n    background-color: #f7931e;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-openid .badge {\n    color: #f7931e;\n    background-color: #fff; }\n\n.btn-pinterest {\n  background-color: #cb2027;\n  color: #fff;\n  background-color: #cb2027;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-pinterest:focus, .btn-pinterest.focus {\n    color: #fff;\n    background-color: #9f191f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-pinterest:hover {\n    color: #fff;\n    background-color: #9f191f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-pinterest:active, .btn-pinterest.active,\n  .open > .btn-pinterest.dropdown-toggle {\n    color: #fff;\n    background-color: #9f191f;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-pinterest:active:hover, .btn-pinterest:active:focus, .btn-pinterest:active.focus, .btn-pinterest.active:hover, .btn-pinterest.active:focus, .btn-pinterest.active.focus,\n    .open > .btn-pinterest.dropdown-toggle:hover,\n    .open > .btn-pinterest.dropdown-toggle:focus,\n    .open > .btn-pinterest.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #801419;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-pinterest:active, .btn-pinterest.active,\n  .open > .btn-pinterest.dropdown-toggle {\n    background-image: none; }\n  .btn-pinterest.disabled:hover, .btn-pinterest.disabled:focus, .btn-pinterest.disabled.focus, .btn-pinterest[disabled]:hover, .btn-pinterest[disabled]:focus, .btn-pinterest[disabled].focus,\n  fieldset[disabled] .btn-pinterest:hover,\n  fieldset[disabled] .btn-pinterest:focus,\n  fieldset[disabled] .btn-pinterest.focus {\n    background-color: #cb2027;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-pinterest .badge {\n    color: #cb2027;\n    background-color: #fff; }\n\n.btn-reddit {\n  background-color: #eff7ff;\n  color: #000;\n  background-color: #eff7ff;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-reddit:focus, .btn-reddit.focus {\n    color: #000;\n    background-color: #bcdeff;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-reddit:hover {\n    color: #000;\n    background-color: #bcdeff;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-reddit:active, .btn-reddit.active,\n  .open > .btn-reddit.dropdown-toggle {\n    color: #000;\n    background-color: #bcdeff;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-reddit:active:hover, .btn-reddit:active:focus, .btn-reddit:active.focus, .btn-reddit.active:hover, .btn-reddit.active:focus, .btn-reddit.active.focus,\n    .open > .btn-reddit.dropdown-toggle:hover,\n    .open > .btn-reddit.dropdown-toggle:focus,\n    .open > .btn-reddit.dropdown-toggle.focus {\n      color: #000;\n      background-color: #98ccff;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-reddit:active, .btn-reddit.active,\n  .open > .btn-reddit.dropdown-toggle {\n    background-image: none; }\n  .btn-reddit.disabled:hover, .btn-reddit.disabled:focus, .btn-reddit.disabled.focus, .btn-reddit[disabled]:hover, .btn-reddit[disabled]:focus, .btn-reddit[disabled].focus,\n  fieldset[disabled] .btn-reddit:hover,\n  fieldset[disabled] .btn-reddit:focus,\n  fieldset[disabled] .btn-reddit.focus {\n    background-color: #eff7ff;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-reddit .badge {\n    color: #eff7ff;\n    background-color: #000; }\n\n.btn-soundcloud {\n  background-color: #ff5500;\n  color: #fff;\n  background-color: #ff5500;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-soundcloud:focus, .btn-soundcloud.focus {\n    color: #fff;\n    background-color: #cc4400;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-soundcloud:hover {\n    color: #fff;\n    background-color: #cc4400;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-soundcloud:active, .btn-soundcloud.active,\n  .open > .btn-soundcloud.dropdown-toggle {\n    color: #fff;\n    background-color: #cc4400;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-soundcloud:active:hover, .btn-soundcloud:active:focus, .btn-soundcloud:active.focus, .btn-soundcloud.active:hover, .btn-soundcloud.active:focus, .btn-soundcloud.active.focus,\n    .open > .btn-soundcloud.dropdown-toggle:hover,\n    .open > .btn-soundcloud.dropdown-toggle:focus,\n    .open > .btn-soundcloud.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #a83800;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-soundcloud:active, .btn-soundcloud.active,\n  .open > .btn-soundcloud.dropdown-toggle {\n    background-image: none; }\n  .btn-soundcloud.disabled:hover, .btn-soundcloud.disabled:focus, .btn-soundcloud.disabled.focus, .btn-soundcloud[disabled]:hover, .btn-soundcloud[disabled]:focus, .btn-soundcloud[disabled].focus,\n  fieldset[disabled] .btn-soundcloud:hover,\n  fieldset[disabled] .btn-soundcloud:focus,\n  fieldset[disabled] .btn-soundcloud.focus {\n    background-color: #ff5500;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-soundcloud .badge {\n    color: #ff5500;\n    background-color: #fff; }\n\n.btn-tumblr {\n  background-color: #2c4762;\n  color: #fff;\n  background-color: #2c4762;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-tumblr:focus, .btn-tumblr.focus {\n    color: #fff;\n    background-color: #1c2e3f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-tumblr:hover {\n    color: #fff;\n    background-color: #1c2e3f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-tumblr:active, .btn-tumblr.active,\n  .open > .btn-tumblr.dropdown-toggle {\n    color: #fff;\n    background-color: #1c2e3f;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-tumblr:active:hover, .btn-tumblr:active:focus, .btn-tumblr:active.focus, .btn-tumblr.active:hover, .btn-tumblr.active:focus, .btn-tumblr.active.focus,\n    .open > .btn-tumblr.dropdown-toggle:hover,\n    .open > .btn-tumblr.dropdown-toggle:focus,\n    .open > .btn-tumblr.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #111c26;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-tumblr:active, .btn-tumblr.active,\n  .open > .btn-tumblr.dropdown-toggle {\n    background-image: none; }\n  .btn-tumblr.disabled:hover, .btn-tumblr.disabled:focus, .btn-tumblr.disabled.focus, .btn-tumblr[disabled]:hover, .btn-tumblr[disabled]:focus, .btn-tumblr[disabled].focus,\n  fieldset[disabled] .btn-tumblr:hover,\n  fieldset[disabled] .btn-tumblr:focus,\n  fieldset[disabled] .btn-tumblr.focus {\n    background-color: #2c4762;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-tumblr .badge {\n    color: #2c4762;\n    background-color: #fff; }\n\n.btn-twitter {\n  background-color: #55acee;\n  color: #fff;\n  background-color: #55acee;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-twitter:focus, .btn-twitter.focus {\n    color: #fff;\n    background-color: #2795e9;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-twitter:hover {\n    color: #fff;\n    background-color: #2795e9;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-twitter:active, .btn-twitter.active,\n  .open > .btn-twitter.dropdown-toggle {\n    color: #fff;\n    background-color: #2795e9;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-twitter:active:hover, .btn-twitter:active:focus, .btn-twitter:active.focus, .btn-twitter.active:hover, .btn-twitter.active:focus, .btn-twitter.active.focus,\n    .open > .btn-twitter.dropdown-toggle:hover,\n    .open > .btn-twitter.dropdown-toggle:focus,\n    .open > .btn-twitter.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #1583d7;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-twitter:active, .btn-twitter.active,\n  .open > .btn-twitter.dropdown-toggle {\n    background-image: none; }\n  .btn-twitter.disabled:hover, .btn-twitter.disabled:focus, .btn-twitter.disabled.focus, .btn-twitter[disabled]:hover, .btn-twitter[disabled]:focus, .btn-twitter[disabled].focus,\n  fieldset[disabled] .btn-twitter:hover,\n  fieldset[disabled] .btn-twitter:focus,\n  fieldset[disabled] .btn-twitter.focus {\n    background-color: #55acee;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-twitter .badge {\n    color: #55acee;\n    background-color: #fff; }\n\n.btn-vimeo {\n  background-color: #1ab7ea;\n  color: #fff;\n  background-color: #1ab7ea;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vimeo:focus, .btn-vimeo.focus {\n    color: #fff;\n    background-color: #1295bf;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vimeo:hover {\n    color: #fff;\n    background-color: #1295bf;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vimeo:active, .btn-vimeo.active,\n  .open > .btn-vimeo.dropdown-toggle {\n    color: #fff;\n    background-color: #1295bf;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-vimeo:active:hover, .btn-vimeo:active:focus, .btn-vimeo:active.focus, .btn-vimeo.active:hover, .btn-vimeo.active:focus, .btn-vimeo.active.focus,\n    .open > .btn-vimeo.dropdown-toggle:hover,\n    .open > .btn-vimeo.dropdown-toggle:focus,\n    .open > .btn-vimeo.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #0f7b9f;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vimeo:active, .btn-vimeo.active,\n  .open > .btn-vimeo.dropdown-toggle {\n    background-image: none; }\n  .btn-vimeo.disabled:hover, .btn-vimeo.disabled:focus, .btn-vimeo.disabled.focus, .btn-vimeo[disabled]:hover, .btn-vimeo[disabled]:focus, .btn-vimeo[disabled].focus,\n  fieldset[disabled] .btn-vimeo:hover,\n  fieldset[disabled] .btn-vimeo:focus,\n  fieldset[disabled] .btn-vimeo.focus {\n    background-color: #1ab7ea;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vimeo .badge {\n    color: #1ab7ea;\n    background-color: #fff; }\n\n.btn-vk {\n  background-color: #587ea3;\n  color: #fff;\n  background-color: #587ea3;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vk:focus, .btn-vk.focus {\n    color: #fff;\n    background-color: #466482;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vk:hover {\n    color: #fff;\n    background-color: #466482;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vk:active, .btn-vk.active,\n  .open > .btn-vk.dropdown-toggle {\n    color: #fff;\n    background-color: #466482;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-vk:active:hover, .btn-vk:active:focus, .btn-vk:active.focus, .btn-vk.active:hover, .btn-vk.active:focus, .btn-vk.active.focus,\n    .open > .btn-vk.dropdown-toggle:hover,\n    .open > .btn-vk.dropdown-toggle:focus,\n    .open > .btn-vk.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #3a526b;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vk:active, .btn-vk.active,\n  .open > .btn-vk.dropdown-toggle {\n    background-image: none; }\n  .btn-vk.disabled:hover, .btn-vk.disabled:focus, .btn-vk.disabled.focus, .btn-vk[disabled]:hover, .btn-vk[disabled]:focus, .btn-vk[disabled].focus,\n  fieldset[disabled] .btn-vk:hover,\n  fieldset[disabled] .btn-vk:focus,\n  fieldset[disabled] .btn-vk.focus {\n    background-color: #587ea3;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-vk .badge {\n    color: #587ea3;\n    background-color: #fff; }\n\n.btn-yahoo {\n  background-color: #720e9e;\n  color: #fff;\n  background-color: #720e9e;\n  border-color: rgba(0, 0, 0, 0.2); }\n  .btn-yahoo:focus, .btn-yahoo.focus {\n    color: #fff;\n    background-color: #500a6f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-yahoo:hover {\n    color: #fff;\n    background-color: #500a6f;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-yahoo:active, .btn-yahoo.active,\n  .open > .btn-yahoo.dropdown-toggle {\n    color: #fff;\n    background-color: #500a6f;\n    border-color: rgba(0, 0, 0, 0.2); }\n    .btn-yahoo:active:hover, .btn-yahoo:active:focus, .btn-yahoo:active.focus, .btn-yahoo.active:hover, .btn-yahoo.active:focus, .btn-yahoo.active.focus,\n    .open > .btn-yahoo.dropdown-toggle:hover,\n    .open > .btn-yahoo.dropdown-toggle:focus,\n    .open > .btn-yahoo.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #39074e;\n      border-color: rgba(0, 0, 0, 0.2); }\n  .btn-yahoo:active, .btn-yahoo.active,\n  .open > .btn-yahoo.dropdown-toggle {\n    background-image: none; }\n  .btn-yahoo.disabled:hover, .btn-yahoo.disabled:focus, .btn-yahoo.disabled.focus, .btn-yahoo[disabled]:hover, .btn-yahoo[disabled]:focus, .btn-yahoo[disabled].focus,\n  fieldset[disabled] .btn-yahoo:hover,\n  fieldset[disabled] .btn-yahoo:focus,\n  fieldset[disabled] .btn-yahoo.focus {\n    background-color: #720e9e;\n    border-color: rgba(0, 0, 0, 0.2); }\n  .btn-yahoo .badge {\n    color: #720e9e;\n    background-color: #fff; }\n\n/*!\n *  Font Awesome 4.5.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(\"../fonts/fontawesome-webfont.eot?v=4.5.0\");\n  src: url(\"../fonts/fontawesome-webfont.eot?#iefix&v=4.5.0\") format(\"embedded-opentype\"), url(\"../fonts/fontawesome-webfont.woff2?v=4.5.0\") format(\"woff2\"), url(\"../fonts/fontawesome-webfont.woff?v=4.5.0\") format(\"woff\"), url(\"../fonts/fontawesome-webfont.ttf?v=4.5.0\") format(\"truetype\"), url(\"../fonts/fontawesome-webfont.svg?v=4.5.0#fontawesomeregular\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal; }\n\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px / 1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -15%; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-fw {\n  width: 1.28571em;\n  text-align: center; }\n\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14286em;\n  list-style-type: none; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  position: absolute;\n  left: -2.14286em;\n  width: 2.14286em;\n  top: 0.14286em;\n  text-align: center; }\n  .fa-li.fa-lg {\n    left: -1.85714em; }\n\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eee;\n  border-radius: .1em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right {\n  margin-left: .3em; }\n\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right; }\n\n.pull-left {\n  float: left; }\n\n.fa.pull-left {\n  margin-right: .3em; }\n\n.fa.pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8); }\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg); } }\n\n.fa-rotate-90 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=0);\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  filter: none; }\n\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle; }\n\n.fa-stack-1x, .fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center; }\n\n.fa-stack-1x {\n  line-height: inherit; }\n\n.fa-stack-2x {\n  font-size: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\"; }\n\n.fa-music:before {\n  content: \"\"; }\n\n.fa-search:before {\n  content: \"\"; }\n\n.fa-envelope-o:before {\n  content: \"\"; }\n\n.fa-heart:before {\n  content: \"\"; }\n\n.fa-star:before {\n  content: \"\"; }\n\n.fa-star-o:before {\n  content: \"\"; }\n\n.fa-user:before {\n  content: \"\"; }\n\n.fa-film:before {\n  content: \"\"; }\n\n.fa-th-large:before {\n  content: \"\"; }\n\n.fa-th:before {\n  content: \"\"; }\n\n.fa-th-list:before {\n  content: \"\"; }\n\n.fa-check:before {\n  content: \"\"; }\n\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\"; }\n\n.fa-search-plus:before {\n  content: \"\"; }\n\n.fa-search-minus:before {\n  content: \"\"; }\n\n.fa-power-off:before {\n  content: \"\"; }\n\n.fa-signal:before {\n  content: \"\"; }\n\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\"; }\n\n.fa-trash-o:before {\n  content: \"\"; }\n\n.fa-home:before {\n  content: \"\"; }\n\n.fa-file-o:before {\n  content: \"\"; }\n\n.fa-clock-o:before {\n  content: \"\"; }\n\n.fa-road:before {\n  content: \"\"; }\n\n.fa-download:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-down:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-up:before {\n  content: \"\"; }\n\n.fa-inbox:before {\n  content: \"\"; }\n\n.fa-play-circle-o:before {\n  content: \"\"; }\n\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\"; }\n\n.fa-refresh:before {\n  content: \"\"; }\n\n.fa-list-alt:before {\n  content: \"\"; }\n\n.fa-lock:before {\n  content: \"\"; }\n\n.fa-flag:before {\n  content: \"\"; }\n\n.fa-headphones:before {\n  content: \"\"; }\n\n.fa-volume-off:before {\n  content: \"\"; }\n\n.fa-volume-down:before {\n  content: \"\"; }\n\n.fa-volume-up:before {\n  content: \"\"; }\n\n.fa-qrcode:before {\n  content: \"\"; }\n\n.fa-barcode:before {\n  content: \"\"; }\n\n.fa-tag:before {\n  content: \"\"; }\n\n.fa-tags:before {\n  content: \"\"; }\n\n.fa-book:before {\n  content: \"\"; }\n\n.fa-bookmark:before {\n  content: \"\"; }\n\n.fa-print:before {\n  content: \"\"; }\n\n.fa-camera:before {\n  content: \"\"; }\n\n.fa-font:before {\n  content: \"\"; }\n\n.fa-bold:before {\n  content: \"\"; }\n\n.fa-italic:before {\n  content: \"\"; }\n\n.fa-text-height:before {\n  content: \"\"; }\n\n.fa-text-width:before {\n  content: \"\"; }\n\n.fa-align-left:before {\n  content: \"\"; }\n\n.fa-align-center:before {\n  content: \"\"; }\n\n.fa-align-right:before {\n  content: \"\"; }\n\n.fa-align-justify:before {\n  content: \"\"; }\n\n.fa-list:before {\n  content: \"\"; }\n\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\"; }\n\n.fa-indent:before {\n  content: \"\"; }\n\n.fa-video-camera:before {\n  content: \"\"; }\n\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\"; }\n\n.fa-pencil:before {\n  content: \"\"; }\n\n.fa-map-marker:before {\n  content: \"\"; }\n\n.fa-adjust:before {\n  content: \"\"; }\n\n.fa-tint:before {\n  content: \"\"; }\n\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\"; }\n\n.fa-share-square-o:before {\n  content: \"\"; }\n\n.fa-check-square-o:before {\n  content: \"\"; }\n\n.fa-arrows:before {\n  content: \"\"; }\n\n.fa-step-backward:before {\n  content: \"\"; }\n\n.fa-fast-backward:before {\n  content: \"\"; }\n\n.fa-backward:before {\n  content: \"\"; }\n\n.fa-play:before {\n  content: \"\"; }\n\n.fa-pause:before {\n  content: \"\"; }\n\n.fa-stop:before {\n  content: \"\"; }\n\n.fa-forward:before {\n  content: \"\"; }\n\n.fa-fast-forward:before {\n  content: \"\"; }\n\n.fa-step-forward:before {\n  content: \"\"; }\n\n.fa-eject:before {\n  content: \"\"; }\n\n.fa-chevron-left:before {\n  content: \"\"; }\n\n.fa-chevron-right:before {\n  content: \"\"; }\n\n.fa-plus-circle:before {\n  content: \"\"; }\n\n.fa-minus-circle:before {\n  content: \"\"; }\n\n.fa-times-circle:before {\n  content: \"\"; }\n\n.fa-check-circle:before {\n  content: \"\"; }\n\n.fa-question-circle:before {\n  content: \"\"; }\n\n.fa-info-circle:before {\n  content: \"\"; }\n\n.fa-crosshairs:before {\n  content: \"\"; }\n\n.fa-times-circle-o:before {\n  content: \"\"; }\n\n.fa-check-circle-o:before {\n  content: \"\"; }\n\n.fa-ban:before {\n  content: \"\"; }\n\n.fa-arrow-left:before {\n  content: \"\"; }\n\n.fa-arrow-right:before {\n  content: \"\"; }\n\n.fa-arrow-up:before {\n  content: \"\"; }\n\n.fa-arrow-down:before {\n  content: \"\"; }\n\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\"; }\n\n.fa-expand:before {\n  content: \"\"; }\n\n.fa-compress:before {\n  content: \"\"; }\n\n.fa-plus:before {\n  content: \"\"; }\n\n.fa-minus:before {\n  content: \"\"; }\n\n.fa-asterisk:before {\n  content: \"\"; }\n\n.fa-exclamation-circle:before {\n  content: \"\"; }\n\n.fa-gift:before {\n  content: \"\"; }\n\n.fa-leaf:before {\n  content: \"\"; }\n\n.fa-fire:before {\n  content: \"\"; }\n\n.fa-eye:before {\n  content: \"\"; }\n\n.fa-eye-slash:before {\n  content: \"\"; }\n\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\"; }\n\n.fa-plane:before {\n  content: \"\"; }\n\n.fa-calendar:before {\n  content: \"\"; }\n\n.fa-random:before {\n  content: \"\"; }\n\n.fa-comment:before {\n  content: \"\"; }\n\n.fa-magnet:before {\n  content: \"\"; }\n\n.fa-chevron-up:before {\n  content: \"\"; }\n\n.fa-chevron-down:before {\n  content: \"\"; }\n\n.fa-retweet:before {\n  content: \"\"; }\n\n.fa-shopping-cart:before {\n  content: \"\"; }\n\n.fa-folder:before {\n  content: \"\"; }\n\n.fa-folder-open:before {\n  content: \"\"; }\n\n.fa-arrows-v:before {\n  content: \"\"; }\n\n.fa-arrows-h:before {\n  content: \"\"; }\n\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\"; }\n\n.fa-twitter-square:before {\n  content: \"\"; }\n\n.fa-facebook-square:before {\n  content: \"\"; }\n\n.fa-camera-retro:before {\n  content: \"\"; }\n\n.fa-key:before {\n  content: \"\"; }\n\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\"; }\n\n.fa-comments:before {\n  content: \"\"; }\n\n.fa-thumbs-o-up:before {\n  content: \"\"; }\n\n.fa-thumbs-o-down:before {\n  content: \"\"; }\n\n.fa-star-half:before {\n  content: \"\"; }\n\n.fa-heart-o:before {\n  content: \"\"; }\n\n.fa-sign-out:before {\n  content: \"\"; }\n\n.fa-linkedin-square:before {\n  content: \"\"; }\n\n.fa-thumb-tack:before {\n  content: \"\"; }\n\n.fa-external-link:before {\n  content: \"\"; }\n\n.fa-sign-in:before {\n  content: \"\"; }\n\n.fa-trophy:before {\n  content: \"\"; }\n\n.fa-github-square:before {\n  content: \"\"; }\n\n.fa-upload:before {\n  content: \"\"; }\n\n.fa-lemon-o:before {\n  content: \"\"; }\n\n.fa-phone:before {\n  content: \"\"; }\n\n.fa-square-o:before {\n  content: \"\"; }\n\n.fa-bookmark-o:before {\n  content: \"\"; }\n\n.fa-phone-square:before {\n  content: \"\"; }\n\n.fa-twitter:before {\n  content: \"\"; }\n\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\"; }\n\n.fa-github:before {\n  content: \"\"; }\n\n.fa-unlock:before {\n  content: \"\"; }\n\n.fa-credit-card:before {\n  content: \"\"; }\n\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\"; }\n\n.fa-hdd-o:before {\n  content: \"\"; }\n\n.fa-bullhorn:before {\n  content: \"\"; }\n\n.fa-bell:before {\n  content: \"\"; }\n\n.fa-certificate:before {\n  content: \"\"; }\n\n.fa-hand-o-right:before {\n  content: \"\"; }\n\n.fa-hand-o-left:before {\n  content: \"\"; }\n\n.fa-hand-o-up:before {\n  content: \"\"; }\n\n.fa-hand-o-down:before {\n  content: \"\"; }\n\n.fa-arrow-circle-left:before {\n  content: \"\"; }\n\n.fa-arrow-circle-right:before {\n  content: \"\"; }\n\n.fa-arrow-circle-up:before {\n  content: \"\"; }\n\n.fa-arrow-circle-down:before {\n  content: \"\"; }\n\n.fa-globe:before {\n  content: \"\"; }\n\n.fa-wrench:before {\n  content: \"\"; }\n\n.fa-tasks:before {\n  content: \"\"; }\n\n.fa-filter:before {\n  content: \"\"; }\n\n.fa-briefcase:before {\n  content: \"\"; }\n\n.fa-arrows-alt:before {\n  content: \"\"; }\n\n.fa-group:before,\n.fa-users:before {\n  content: \"\"; }\n\n.fa-chain:before,\n.fa-link:before {\n  content: \"\"; }\n\n.fa-cloud:before {\n  content: \"\"; }\n\n.fa-flask:before {\n  content: \"\"; }\n\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\"; }\n\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\"; }\n\n.fa-paperclip:before {\n  content: \"\"; }\n\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\"; }\n\n.fa-square:before {\n  content: \"\"; }\n\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\"; }\n\n.fa-list-ul:before {\n  content: \"\"; }\n\n.fa-list-ol:before {\n  content: \"\"; }\n\n.fa-strikethrough:before {\n  content: \"\"; }\n\n.fa-underline:before {\n  content: \"\"; }\n\n.fa-table:before {\n  content: \"\"; }\n\n.fa-magic:before {\n  content: \"\"; }\n\n.fa-truck:before {\n  content: \"\"; }\n\n.fa-pinterest:before {\n  content: \"\"; }\n\n.fa-pinterest-square:before {\n  content: \"\"; }\n\n.fa-google-plus-square:before {\n  content: \"\"; }\n\n.fa-google-plus:before {\n  content: \"\"; }\n\n.fa-money:before {\n  content: \"\"; }\n\n.fa-caret-down:before {\n  content: \"\"; }\n\n.fa-caret-up:before {\n  content: \"\"; }\n\n.fa-caret-left:before {\n  content: \"\"; }\n\n.fa-caret-right:before {\n  content: \"\"; }\n\n.fa-columns:before {\n  content: \"\"; }\n\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\"; }\n\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\"; }\n\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\"; }\n\n.fa-envelope:before {\n  content: \"\"; }\n\n.fa-linkedin:before {\n  content: \"\"; }\n\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\"; }\n\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\"; }\n\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\"; }\n\n.fa-comment-o:before {\n  content: \"\"; }\n\n.fa-comments-o:before {\n  content: \"\"; }\n\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\"; }\n\n.fa-sitemap:before {\n  content: \"\"; }\n\n.fa-umbrella:before {\n  content: \"\"; }\n\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\"; }\n\n.fa-lightbulb-o:before {\n  content: \"\"; }\n\n.fa-exchange:before {\n  content: \"\"; }\n\n.fa-cloud-download:before {\n  content: \"\"; }\n\n.fa-cloud-upload:before {\n  content: \"\"; }\n\n.fa-user-md:before {\n  content: \"\"; }\n\n.fa-stethoscope:before {\n  content: \"\"; }\n\n.fa-suitcase:before {\n  content: \"\"; }\n\n.fa-bell-o:before {\n  content: \"\"; }\n\n.fa-coffee:before {\n  content: \"\"; }\n\n.fa-cutlery:before {\n  content: \"\"; }\n\n.fa-file-text-o:before {\n  content: \"\"; }\n\n.fa-building-o:before {\n  content: \"\"; }\n\n.fa-hospital-o:before {\n  content: \"\"; }\n\n.fa-ambulance:before {\n  content: \"\"; }\n\n.fa-medkit:before {\n  content: \"\"; }\n\n.fa-fighter-jet:before {\n  content: \"\"; }\n\n.fa-beer:before {\n  content: \"\"; }\n\n.fa-h-square:before {\n  content: \"\"; }\n\n.fa-plus-square:before {\n  content: \"\"; }\n\n.fa-angle-double-left:before {\n  content: \"\"; }\n\n.fa-angle-double-right:before {\n  content: \"\"; }\n\n.fa-angle-double-up:before {\n  content: \"\"; }\n\n.fa-angle-double-down:before {\n  content: \"\"; }\n\n.fa-angle-left:before {\n  content: \"\"; }\n\n.fa-angle-right:before {\n  content: \"\"; }\n\n.fa-angle-up:before {\n  content: \"\"; }\n\n.fa-angle-down:before {\n  content: \"\"; }\n\n.fa-desktop:before {\n  content: \"\"; }\n\n.fa-laptop:before {\n  content: \"\"; }\n\n.fa-tablet:before {\n  content: \"\"; }\n\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\"; }\n\n.fa-circle-o:before {\n  content: \"\"; }\n\n.fa-quote-left:before {\n  content: \"\"; }\n\n.fa-quote-right:before {\n  content: \"\"; }\n\n.fa-spinner:before {\n  content: \"\"; }\n\n.fa-circle:before {\n  content: \"\"; }\n\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\"; }\n\n.fa-github-alt:before {\n  content: \"\"; }\n\n.fa-folder-o:before {\n  content: \"\"; }\n\n.fa-folder-open-o:before {\n  content: \"\"; }\n\n.fa-smile-o:before {\n  content: \"\"; }\n\n.fa-frown-o:before {\n  content: \"\"; }\n\n.fa-meh-o:before {\n  content: \"\"; }\n\n.fa-gamepad:before {\n  content: \"\"; }\n\n.fa-keyboard-o:before {\n  content: \"\"; }\n\n.fa-flag-o:before {\n  content: \"\"; }\n\n.fa-flag-checkered:before {\n  content: \"\"; }\n\n.fa-terminal:before {\n  content: \"\"; }\n\n.fa-code:before {\n  content: \"\"; }\n\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\"; }\n\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\"; }\n\n.fa-location-arrow:before {\n  content: \"\"; }\n\n.fa-crop:before {\n  content: \"\"; }\n\n.fa-code-fork:before {\n  content: \"\"; }\n\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\"; }\n\n.fa-question:before {\n  content: \"\"; }\n\n.fa-info:before {\n  content: \"\"; }\n\n.fa-exclamation:before {\n  content: \"\"; }\n\n.fa-superscript:before {\n  content: \"\"; }\n\n.fa-subscript:before {\n  content: \"\"; }\n\n.fa-eraser:before {\n  content: \"\"; }\n\n.fa-puzzle-piece:before {\n  content: \"\"; }\n\n.fa-microphone:before {\n  content: \"\"; }\n\n.fa-microphone-slash:before {\n  content: \"\"; }\n\n.fa-shield:before {\n  content: \"\"; }\n\n.fa-calendar-o:before {\n  content: \"\"; }\n\n.fa-fire-extinguisher:before {\n  content: \"\"; }\n\n.fa-rocket:before {\n  content: \"\"; }\n\n.fa-maxcdn:before {\n  content: \"\"; }\n\n.fa-chevron-circle-left:before {\n  content: \"\"; }\n\n.fa-chevron-circle-right:before {\n  content: \"\"; }\n\n.fa-chevron-circle-up:before {\n  content: \"\"; }\n\n.fa-chevron-circle-down:before {\n  content: \"\"; }\n\n.fa-html5:before {\n  content: \"\"; }\n\n.fa-css3:before {\n  content: \"\"; }\n\n.fa-anchor:before {\n  content: \"\"; }\n\n.fa-unlock-alt:before {\n  content: \"\"; }\n\n.fa-bullseye:before {\n  content: \"\"; }\n\n.fa-ellipsis-h:before {\n  content: \"\"; }\n\n.fa-ellipsis-v:before {\n  content: \"\"; }\n\n.fa-rss-square:before {\n  content: \"\"; }\n\n.fa-play-circle:before {\n  content: \"\"; }\n\n.fa-ticket:before {\n  content: \"\"; }\n\n.fa-minus-square:before {\n  content: \"\"; }\n\n.fa-minus-square-o:before {\n  content: \"\"; }\n\n.fa-level-up:before {\n  content: \"\"; }\n\n.fa-level-down:before {\n  content: \"\"; }\n\n.fa-check-square:before {\n  content: \"\"; }\n\n.fa-pencil-square:before {\n  content: \"\"; }\n\n.fa-external-link-square:before {\n  content: \"\"; }\n\n.fa-share-square:before {\n  content: \"\"; }\n\n.fa-compass:before {\n  content: \"\"; }\n\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\"; }\n\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\"; }\n\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\"; }\n\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\"; }\n\n.fa-gbp:before {\n  content: \"\"; }\n\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\"; }\n\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\"; }\n\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\"; }\n\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\"; }\n\n.fa-won:before,\n.fa-krw:before {\n  content: \"\"; }\n\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\"; }\n\n.fa-file:before {\n  content: \"\"; }\n\n.fa-file-text:before {\n  content: \"\"; }\n\n.fa-sort-alpha-asc:before {\n  content: \"\"; }\n\n.fa-sort-alpha-desc:before {\n  content: \"\"; }\n\n.fa-sort-amount-asc:before {\n  content: \"\"; }\n\n.fa-sort-amount-desc:before {\n  content: \"\"; }\n\n.fa-sort-numeric-asc:before {\n  content: \"\"; }\n\n.fa-sort-numeric-desc:before {\n  content: \"\"; }\n\n.fa-thumbs-up:before {\n  content: \"\"; }\n\n.fa-thumbs-down:before {\n  content: \"\"; }\n\n.fa-youtube-square:before {\n  content: \"\"; }\n\n.fa-youtube:before {\n  content: \"\"; }\n\n.fa-xing:before {\n  content: \"\"; }\n\n.fa-xing-square:before {\n  content: \"\"; }\n\n.fa-youtube-play:before {\n  content: \"\"; }\n\n.fa-dropbox:before {\n  content: \"\"; }\n\n.fa-stack-overflow:before {\n  content: \"\"; }\n\n.fa-instagram:before {\n  content: \"\"; }\n\n.fa-flickr:before {\n  content: \"\"; }\n\n.fa-adn:before {\n  content: \"\"; }\n\n.fa-bitbucket:before {\n  content: \"\"; }\n\n.fa-bitbucket-square:before {\n  content: \"\"; }\n\n.fa-tumblr:before {\n  content: \"\"; }\n\n.fa-tumblr-square:before {\n  content: \"\"; }\n\n.fa-long-arrow-down:before {\n  content: \"\"; }\n\n.fa-long-arrow-up:before {\n  content: \"\"; }\n\n.fa-long-arrow-left:before {\n  content: \"\"; }\n\n.fa-long-arrow-right:before {\n  content: \"\"; }\n\n.fa-apple:before {\n  content: \"\"; }\n\n.fa-windows:before {\n  content: \"\"; }\n\n.fa-android:before {\n  content: \"\"; }\n\n.fa-linux:before {\n  content: \"\"; }\n\n.fa-dribbble:before {\n  content: \"\"; }\n\n.fa-skype:before {\n  content: \"\"; }\n\n.fa-foursquare:before {\n  content: \"\"; }\n\n.fa-trello:before {\n  content: \"\"; }\n\n.fa-female:before {\n  content: \"\"; }\n\n.fa-male:before {\n  content: \"\"; }\n\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\"; }\n\n.fa-sun-o:before {\n  content: \"\"; }\n\n.fa-moon-o:before {\n  content: \"\"; }\n\n.fa-archive:before {\n  content: \"\"; }\n\n.fa-bug:before {\n  content: \"\"; }\n\n.fa-vk:before {\n  content: \"\"; }\n\n.fa-weibo:before {\n  content: \"\"; }\n\n.fa-renren:before {\n  content: \"\"; }\n\n.fa-pagelines:before {\n  content: \"\"; }\n\n.fa-stack-exchange:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-right:before {\n  content: \"\"; }\n\n.fa-arrow-circle-o-left:before {\n  content: \"\"; }\n\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\"; }\n\n.fa-dot-circle-o:before {\n  content: \"\"; }\n\n.fa-wheelchair:before {\n  content: \"\"; }\n\n.fa-vimeo-square:before {\n  content: \"\"; }\n\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\"; }\n\n.fa-plus-square-o:before {\n  content: \"\"; }\n\n.fa-space-shuttle:before {\n  content: \"\"; }\n\n.fa-slack:before {\n  content: \"\"; }\n\n.fa-envelope-square:before {\n  content: \"\"; }\n\n.fa-wordpress:before {\n  content: \"\"; }\n\n.fa-openid:before {\n  content: \"\"; }\n\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\"; }\n\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\"; }\n\n.fa-yahoo:before {\n  content: \"\"; }\n\n.fa-google:before {\n  content: \"\"; }\n\n.fa-reddit:before {\n  content: \"\"; }\n\n.fa-reddit-square:before {\n  content: \"\"; }\n\n.fa-stumbleupon-circle:before {\n  content: \"\"; }\n\n.fa-stumbleupon:before {\n  content: \"\"; }\n\n.fa-delicious:before {\n  content: \"\"; }\n\n.fa-digg:before {\n  content: \"\"; }\n\n.fa-pied-piper:before {\n  content: \"\"; }\n\n.fa-pied-piper-alt:before {\n  content: \"\"; }\n\n.fa-drupal:before {\n  content: \"\"; }\n\n.fa-joomla:before {\n  content: \"\"; }\n\n.fa-language:before {\n  content: \"\"; }\n\n.fa-fax:before {\n  content: \"\"; }\n\n.fa-building:before {\n  content: \"\"; }\n\n.fa-child:before {\n  content: \"\"; }\n\n.fa-paw:before {\n  content: \"\"; }\n\n.fa-spoon:before {\n  content: \"\"; }\n\n.fa-cube:before {\n  content: \"\"; }\n\n.fa-cubes:before {\n  content: \"\"; }\n\n.fa-behance:before {\n  content: \"\"; }\n\n.fa-behance-square:before {\n  content: \"\"; }\n\n.fa-steam:before {\n  content: \"\"; }\n\n.fa-steam-square:before {\n  content: \"\"; }\n\n.fa-recycle:before {\n  content: \"\"; }\n\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\"; }\n\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\"; }\n\n.fa-tree:before {\n  content: \"\"; }\n\n.fa-spotify:before {\n  content: \"\"; }\n\n.fa-deviantart:before {\n  content: \"\"; }\n\n.fa-soundcloud:before {\n  content: \"\"; }\n\n.fa-database:before {\n  content: \"\"; }\n\n.fa-file-pdf-o:before {\n  content: \"\"; }\n\n.fa-file-word-o:before {\n  content: \"\"; }\n\n.fa-file-excel-o:before {\n  content: \"\"; }\n\n.fa-file-powerpoint-o:before {\n  content: \"\"; }\n\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\"; }\n\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\"; }\n\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\"; }\n\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\"; }\n\n.fa-file-code-o:before {\n  content: \"\"; }\n\n.fa-vine:before {\n  content: \"\"; }\n\n.fa-codepen:before {\n  content: \"\"; }\n\n.fa-jsfiddle:before {\n  content: \"\"; }\n\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\"; }\n\n.fa-circle-o-notch:before {\n  content: \"\"; }\n\n.fa-ra:before,\n.fa-rebel:before {\n  content: \"\"; }\n\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\"; }\n\n.fa-git-square:before {\n  content: \"\"; }\n\n.fa-git:before {\n  content: \"\"; }\n\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\"; }\n\n.fa-tencent-weibo:before {\n  content: \"\"; }\n\n.fa-qq:before {\n  content: \"\"; }\n\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\"; }\n\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\"; }\n\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\"; }\n\n.fa-history:before {\n  content: \"\"; }\n\n.fa-circle-thin:before {\n  content: \"\"; }\n\n.fa-header:before {\n  content: \"\"; }\n\n.fa-paragraph:before {\n  content: \"\"; }\n\n.fa-sliders:before {\n  content: \"\"; }\n\n.fa-share-alt:before {\n  content: \"\"; }\n\n.fa-share-alt-square:before {\n  content: \"\"; }\n\n.fa-bomb:before {\n  content: \"\"; }\n\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\"; }\n\n.fa-tty:before {\n  content: \"\"; }\n\n.fa-binoculars:before {\n  content: \"\"; }\n\n.fa-plug:before {\n  content: \"\"; }\n\n.fa-slideshare:before {\n  content: \"\"; }\n\n.fa-twitch:before {\n  content: \"\"; }\n\n.fa-yelp:before {\n  content: \"\"; }\n\n.fa-newspaper-o:before {\n  content: \"\"; }\n\n.fa-wifi:before {\n  content: \"\"; }\n\n.fa-calculator:before {\n  content: \"\"; }\n\n.fa-paypal:before {\n  content: \"\"; }\n\n.fa-google-wallet:before {\n  content: \"\"; }\n\n.fa-cc-visa:before {\n  content: \"\"; }\n\n.fa-cc-mastercard:before {\n  content: \"\"; }\n\n.fa-cc-discover:before {\n  content: \"\"; }\n\n.fa-cc-amex:before {\n  content: \"\"; }\n\n.fa-cc-paypal:before {\n  content: \"\"; }\n\n.fa-cc-stripe:before {\n  content: \"\"; }\n\n.fa-bell-slash:before {\n  content: \"\"; }\n\n.fa-bell-slash-o:before {\n  content: \"\"; }\n\n.fa-trash:before {\n  content: \"\"; }\n\n.fa-copyright:before {\n  content: \"\"; }\n\n.fa-at:before {\n  content: \"\"; }\n\n.fa-eyedropper:before {\n  content: \"\"; }\n\n.fa-paint-brush:before {\n  content: \"\"; }\n\n.fa-birthday-cake:before {\n  content: \"\"; }\n\n.fa-area-chart:before {\n  content: \"\"; }\n\n.fa-pie-chart:before {\n  content: \"\"; }\n\n.fa-line-chart:before {\n  content: \"\"; }\n\n.fa-lastfm:before {\n  content: \"\"; }\n\n.fa-lastfm-square:before {\n  content: \"\"; }\n\n.fa-toggle-off:before {\n  content: \"\"; }\n\n.fa-toggle-on:before {\n  content: \"\"; }\n\n.fa-bicycle:before {\n  content: \"\"; }\n\n.fa-bus:before {\n  content: \"\"; }\n\n.fa-ioxhost:before {\n  content: \"\"; }\n\n.fa-angellist:before {\n  content: \"\"; }\n\n.fa-cc:before {\n  content: \"\"; }\n\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\"; }\n\n.fa-meanpath:before {\n  content: \"\"; }\n\n.fa-buysellads:before {\n  content: \"\"; }\n\n.fa-connectdevelop:before {\n  content: \"\"; }\n\n.fa-dashcube:before {\n  content: \"\"; }\n\n.fa-forumbee:before {\n  content: \"\"; }\n\n.fa-leanpub:before {\n  content: \"\"; }\n\n.fa-sellsy:before {\n  content: \"\"; }\n\n.fa-shirtsinbulk:before {\n  content: \"\"; }\n\n.fa-simplybuilt:before {\n  content: \"\"; }\n\n.fa-skyatlas:before {\n  content: \"\"; }\n\n.fa-cart-plus:before {\n  content: \"\"; }\n\n.fa-cart-arrow-down:before {\n  content: \"\"; }\n\n.fa-diamond:before {\n  content: \"\"; }\n\n.fa-ship:before {\n  content: \"\"; }\n\n.fa-user-secret:before {\n  content: \"\"; }\n\n.fa-motorcycle:before {\n  content: \"\"; }\n\n.fa-street-view:before {\n  content: \"\"; }\n\n.fa-heartbeat:before {\n  content: \"\"; }\n\n.fa-venus:before {\n  content: \"\"; }\n\n.fa-mars:before {\n  content: \"\"; }\n\n.fa-mercury:before {\n  content: \"\"; }\n\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\"; }\n\n.fa-transgender-alt:before {\n  content: \"\"; }\n\n.fa-venus-double:before {\n  content: \"\"; }\n\n.fa-mars-double:before {\n  content: \"\"; }\n\n.fa-venus-mars:before {\n  content: \"\"; }\n\n.fa-mars-stroke:before {\n  content: \"\"; }\n\n.fa-mars-stroke-v:before {\n  content: \"\"; }\n\n.fa-mars-stroke-h:before {\n  content: \"\"; }\n\n.fa-neuter:before {\n  content: \"\"; }\n\n.fa-genderless:before {\n  content: \"\"; }\n\n.fa-facebook-official:before {\n  content: \"\"; }\n\n.fa-pinterest-p:before {\n  content: \"\"; }\n\n.fa-whatsapp:before {\n  content: \"\"; }\n\n.fa-server:before {\n  content: \"\"; }\n\n.fa-user-plus:before {\n  content: \"\"; }\n\n.fa-user-times:before {\n  content: \"\"; }\n\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\"; }\n\n.fa-viacoin:before {\n  content: \"\"; }\n\n.fa-train:before {\n  content: \"\"; }\n\n.fa-subway:before {\n  content: \"\"; }\n\n.fa-medium:before {\n  content: \"\"; }\n\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\"; }\n\n.fa-optin-monster:before {\n  content: \"\"; }\n\n.fa-opencart:before {\n  content: \"\"; }\n\n.fa-expeditedssl:before {\n  content: \"\"; }\n\n.fa-battery-4:before,\n.fa-battery-full:before {\n  content: \"\"; }\n\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\"; }\n\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\"; }\n\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\"; }\n\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\"; }\n\n.fa-mouse-pointer:before {\n  content: \"\"; }\n\n.fa-i-cursor:before {\n  content: \"\"; }\n\n.fa-object-group:before {\n  content: \"\"; }\n\n.fa-object-ungroup:before {\n  content: \"\"; }\n\n.fa-sticky-note:before {\n  content: \"\"; }\n\n.fa-sticky-note-o:before {\n  content: \"\"; }\n\n.fa-cc-jcb:before {\n  content: \"\"; }\n\n.fa-cc-diners-club:before {\n  content: \"\"; }\n\n.fa-clone:before {\n  content: \"\"; }\n\n.fa-balance-scale:before {\n  content: \"\"; }\n\n.fa-hourglass-o:before {\n  content: \"\"; }\n\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\"; }\n\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\"; }\n\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\"; }\n\n.fa-hourglass:before {\n  content: \"\"; }\n\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\"; }\n\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\"; }\n\n.fa-hand-scissors-o:before {\n  content: \"\"; }\n\n.fa-hand-lizard-o:before {\n  content: \"\"; }\n\n.fa-hand-spock-o:before {\n  content: \"\"; }\n\n.fa-hand-pointer-o:before {\n  content: \"\"; }\n\n.fa-hand-peace-o:before {\n  content: \"\"; }\n\n.fa-trademark:before {\n  content: \"\"; }\n\n.fa-registered:before {\n  content: \"\"; }\n\n.fa-creative-commons:before {\n  content: \"\"; }\n\n.fa-gg:before {\n  content: \"\"; }\n\n.fa-gg-circle:before {\n  content: \"\"; }\n\n.fa-tripadvisor:before {\n  content: \"\"; }\n\n.fa-odnoklassniki:before {\n  content: \"\"; }\n\n.fa-odnoklassniki-square:before {\n  content: \"\"; }\n\n.fa-get-pocket:before {\n  content: \"\"; }\n\n.fa-wikipedia-w:before {\n  content: \"\"; }\n\n.fa-safari:before {\n  content: \"\"; }\n\n.fa-chrome:before {\n  content: \"\"; }\n\n.fa-firefox:before {\n  content: \"\"; }\n\n.fa-opera:before {\n  content: \"\"; }\n\n.fa-internet-explorer:before {\n  content: \"\"; }\n\n.fa-tv:before,\n.fa-television:before {\n  content: \"\"; }\n\n.fa-contao:before {\n  content: \"\"; }\n\n.fa-500px:before {\n  content: \"\"; }\n\n.fa-amazon:before {\n  content: \"\"; }\n\n.fa-calendar-plus-o:before {\n  content: \"\"; }\n\n.fa-calendar-minus-o:before {\n  content: \"\"; }\n\n.fa-calendar-times-o:before {\n  content: \"\"; }\n\n.fa-calendar-check-o:before {\n  content: \"\"; }\n\n.fa-industry:before {\n  content: \"\"; }\n\n.fa-map-pin:before {\n  content: \"\"; }\n\n.fa-map-signs:before {\n  content: \"\"; }\n\n.fa-map-o:before {\n  content: \"\"; }\n\n.fa-map:before {\n  content: \"\"; }\n\n.fa-commenting:before {\n  content: \"\"; }\n\n.fa-commenting-o:before {\n  content: \"\"; }\n\n.fa-houzz:before {\n  content: \"\"; }\n\n.fa-vimeo:before {\n  content: \"\"; }\n\n.fa-black-tie:before {\n  content: \"\"; }\n\n.fa-fonticons:before {\n  content: \"\"; }\n\n.fa-reddit-alien:before {\n  content: \"\"; }\n\n.fa-edge:before {\n  content: \"\"; }\n\n.fa-credit-card-alt:before {\n  content: \"\"; }\n\n.fa-codiepie:before {\n  content: \"\"; }\n\n.fa-modx:before {\n  content: \"\"; }\n\n.fa-fort-awesome:before {\n  content: \"\"; }\n\n.fa-usb:before {\n  content: \"\"; }\n\n.fa-product-hunt:before {\n  content: \"\"; }\n\n.fa-mixcloud:before {\n  content: \"\"; }\n\n.fa-scribd:before {\n  content: \"\"; }\n\n.fa-pause-circle:before {\n  content: \"\"; }\n\n.fa-pause-circle-o:before {\n  content: \"\"; }\n\n.fa-stop-circle:before {\n  content: \"\"; }\n\n.fa-stop-circle-o:before {\n  content: \"\"; }\n\n.fa-shopping-bag:before {\n  content: \"\"; }\n\n.fa-shopping-basket:before {\n  content: \"\"; }\n\n.fa-hashtag:before {\n  content: \"\"; }\n\n.fa-bluetooth:before {\n  content: \"\"; }\n\n.fa-bluetooth-b:before {\n  content: \"\"; }\n\n.fa-percent:before {\n  content: \"\"; }\n\nfooter {\n  color: #fff;\n  background-color: #121212; }\n  footer a:hover {\n    color: #fff; }\n\na {\n  transition: all 0.4s cubic-bezier(0.24, 0.45, 0.46, 0.92); }\n  a:hover {\n    text-decoration: none; }\n\nul,\np {\n  font-size: 14px; }\n\n.text-danger {\n  color: #d80017; }\n\n.dropdown-menu > li > a {\n  font-weight: 300; }\n\n.btn {\n  padding: 10px 16px;\n  border: 0;\n  border-radius: 3px;\n  transition: all 0.4s cubic-bezier(0.24, 0.45, 0.46, 0.92); }\n  .btn:hover {\n    color: #fff;\n    background-color: #121212; }\n\n.btn-social, .btn-social-icon {\n  padding: 10px 50px; }\n  .btn-social :first-child, .btn-social-icon :first-child {\n    width: 38px;\n    line-height: 38px; }\n\n.btn-link:hover {\n  color: #121212;\n  text-decoration: none;\n  background-color: transparent; }\n\n.alert {\n  color: #fff; }\n\n.navbar-default {\n  border: 0;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); }\n  .navbar-default .navbar-nav > li > a {\n    transition: color 0.4s cubic-bezier(0.24, 0.45, 0.46, 0.92); }\n\nhtml {\n  position: relative;\n  min-height: 100%; }\n\nbody {\n  margin-bottom: 75px; }\n\nfooter {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  height: 45px;\n  line-height: 45px; }\n  footer p, footer ul {\n    margin-bottom: 0; }\n\ntextarea {\n  resize: vertical; }\n\n.navbar-nav li > a.active {\n  color: #fff;\n  background-color: transparent; }\n\n.navbar-nav img {\n  width: 30px;\n  height: 30px;\n  margin: -15px 15px -15px; }\n\n.navbar.navbar-inverse {\n  border-radius: 0px; }\n\n.alert {\n  margin-top: 20px; }\n\n.thumbnail {\n  padding: 0;\n  border-radius: 0;\n  box-shadow: 0 0 5px #ccc, inset 0 0 0 #000; }\n\n.fa {\n  margin-right: 6px; }\n\n.avatar {\n  width: 50px;\n  height: 50px; }\n"

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(39);
	var passport = __webpack_require__(40);
	var request = __webpack_require__(41);
	
	var LocalStrategy = __webpack_require__(42).Strategy;
	var FacebookStrategy = __webpack_require__(43).Strategy;
	var GitHubStrategy = __webpack_require__(44).Strategy;
	var GoogleStrategy = __webpack_require__(45).OAuth2Strategy;
	
	var User = __webpack_require__(46);
	
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
/* 39 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = require("passport-local");

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = require("passport-facebook");

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = require("passport-github");

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = require("passport-google-oauth");

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bcrypt = __webpack_require__(47);
	var crypto = __webpack_require__(48);
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
/* 47 */
/***/ function(module, exports) {

	module.exports = require("bcrypt-nodejs");

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pkg = __webpack_require__(6);
	var cookieParser = __webpack_require__(50);
	var compress = __webpack_require__(51);
	var session = __webpack_require__(52);
	var bodyParser = __webpack_require__(53);
	var logger = __webpack_require__(54);
	var errorHandler = __webpack_require__(10);
	var lusca = __webpack_require__(55);
	var methodOverride = __webpack_require__(56);
	var dotenv = __webpack_require__(7);
	var MongoStore = __webpack_require__(57)(session);
	var flash = __webpack_require__(58);
	var path = __webpack_require__(59);
	var mongoose = __webpack_require__(9);
	var passport = __webpack_require__(40);
	var expressValidator = __webpack_require__(60);
	var sass = __webpack_require__(61);
	var multer = __webpack_require__(62);
	var express = __webpack_require__(8);
	
	var passportConfig = __webpack_require__(38);
	
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
/* 50 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = require("lusca");

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = require("method-override");

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = require("connect-mongo/es5");

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = require("express-flash");

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = require("express-validator");

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = require("node-sass-middleware");

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = require("express-http-proxy");

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map