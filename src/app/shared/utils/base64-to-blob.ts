export function base64ToBlob(base64: string, contentType = 'application/pdf'): string {
	const byteCharacters = atob(base64);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += 512) {
		const slice = byteCharacters.slice(offset, offset + 512);
		const byteNumbers = Array.from(slice).map((ch) => ch.charCodeAt(0));
		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	return `${new Blob(byteArrays, { type: contentType })}`;
}
