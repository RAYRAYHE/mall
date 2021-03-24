
/**
 * 节流函数
 * func: 要执行的回调函数 
 * wait: 延时的时间
 * immediate: 是否立即执行   
 */

let timeout;
export function debounce(func, wait=300, immediate = false) {
   // 清除定时器
	if (timeout !== null) clearTimeout(timeout);
	// 立即执行
	if (immediate) {
		var callNow = !timeout;
		timeout = setTimeout(function() {
			timeout = null;
		}, wait);
		if (callNow) typeof func === 'function' && func();
	} else {
		// 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
		timeout = setTimeout(function() {
			typeof func === 'function' && func();
		}, wait);
	}
}
