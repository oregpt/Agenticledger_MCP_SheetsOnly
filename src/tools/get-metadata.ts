import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createSheetsClient } from '../utils/platform-oauth.js';
import { handleError } from '../utils/error-handler.js';
import { validateSpreadsheetId } from '../utils/validators.js';
import { formatSpreadsheetMetadata } from '../utils/formatters.js';

export const getMetadataTool: Tool = {
  name: 'sheets_get_metadata',
  description:
    'Get metadata about a Google Sheets spreadsheet including sheet names, IDs, and properties',
  inputSchema: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'OAuth access token from platform (provided by AgenticLedger platform from capability_tokens.token1 field)',
      },
      spreadsheetId: {
        type: 'string',
        description: 'The ID of the spreadsheet (found in the URL after /d/)',
      },
    },
    required: ['accessToken', 'spreadsheetId'],
  },
};

export async function handleGetMetadata(input: any) {
  try {
    if (!input.spreadsheetId || typeof input.spreadsheetId !== 'string') {
      throw new Error('spreadsheetId is required and must be a string');
    }

    if (!validateSpreadsheetId(input.spreadsheetId)) {
      throw new Error('Invalid spreadsheet ID format');
    }

    const sheets = createSheetsClient(input.accessToken);

    const response = await sheets.spreadsheets.get({
      spreadsheetId: input.spreadsheetId,
      includeGridData: false,
    });

    return formatSpreadsheetMetadata(response.data);
  } catch (error) {
    return handleError(error);
  }
}
