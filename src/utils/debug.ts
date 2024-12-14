import fs from 'fs';
import { prettyDOM } from '@testing-library/dom';

function removeAnsiCodes(str: string) {
	// eslint-disable-next-line no-control-regex
	return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function debugDomToFile(content: Element, filename = 'debug.html') {
	const prettyDomString = prettyDOM(content, 100000000) || '';
	const formattedContent = removeAnsiCodes(prettyDomString);

	fs.writeFile(`./debugs/${filename}`, formattedContent, 'utf8', (err) => {
		if (err) {
			console.error(`Error writing to file: ${err?.message}`);
			return;
		}
	});
}
