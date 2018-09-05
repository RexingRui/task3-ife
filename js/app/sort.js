/**
 * sort.js-->排序
 */

define(function(require, exports, module) {
	function sortDate(a, b) {
		return parseInt(a.firstChild.textContent.replace(/\-/g, '')) -
			parseInt(b.firstChild.textContent.replace(/\-/g, ''));
	}

	return {
		sortDate: sortDate,
	}
});