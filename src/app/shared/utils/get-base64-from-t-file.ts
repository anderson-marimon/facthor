import { TFile } from '@fresco-ui/frs-file-input/frs-file-input';

export function getBase64FromTFile(file: TFile): string {
	return file.base64.split(',')[1];
}
