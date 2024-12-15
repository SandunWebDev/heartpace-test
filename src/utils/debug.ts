import fs from 'fs';
import { prettyDOM } from '@testing-library/dom';

// Remove ANSI code from given string.
export function removeAnsiCodes(str: string) {
	// eslint-disable-next-line no-control-regex
	return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// Just quick and dirty way to inspect dom contents in jest.
export function debugDomToFile(
	content: Element | Element[],
	filename = './debug.html',
) {
	let formattedContent = '';

	if (Array.isArray(content)) {
		content.map((item: Element) => {
			const prettyDomString = prettyDOM(item, 100000000) || '';
			formattedContent += removeAnsiCodes(prettyDomString);
		});
	} else {
		const prettyDomString = prettyDOM(content, 100000000) || '';
		formattedContent = removeAnsiCodes(prettyDomString);
	}

	fs.writeFile(filename, formattedContent, 'utf8', (err) => {
		if (err) {
			console.error(`Error writing to file: ${err?.message}`);
			return;
		}
	});
}
