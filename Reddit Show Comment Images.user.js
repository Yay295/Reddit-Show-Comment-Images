// ==UserScript==
// @name          Reddit Show Comment Images
// @description   Shows comment images from New New Reddit on Old Reddit.
// @namespace     https://github.com/Yay295/Reddit-Show-Comment-Images
// @author        Yay295
// @match         *://*.reddit.com/*
// @version       1.0.2
// ==/UserScript==

'use strict';

function processCommentImageLinks(img_links) {
	for (let img_link of img_links) {
		if (img_link.innerText === '<image>' && /^https:\/\/preview\.redd\.it\/[^\.]+\.[a-z]+/.test(img_link.href)) {
			let img = document.createElement('img');
			img.loading = 'lazy';
			img.style.minWidth = '20px';
			img.style.maxWidth = '240px';
			img.style.minHeight = '20px';
			img.style.maxHeight = '240px';
			img.style.objectFit = 'cover';
			img.src = img_link.href;
			img_link.replaceWith(img);
		}
	}
}

function processMutations(mutations) {
	let added_image_links = [];
	for (let mutation of mutations) {
		for (let node of mutation.addedNodes) {
			if (node.tagName === 'A' && node.href) {
				added_image_links.add(node);
			}
		}
	}
	processCommentImageLinks(added_image_links);
}

let comment_area = document.querySelector('.commentarea');
if (comment_area !== null) {
	// Process comment image links that are already on the page.
	processCommentImageLinks(comment_area.querySelectorAll('.comment a[href]'));

	// The MutationObserver will be triggered when more comments are loaded.
	new MutationObserver(processMutations).observe(comment_area,{subtree:true,childList:true});
}
