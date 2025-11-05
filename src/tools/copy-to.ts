import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createSheetsClient } from '../utils/platform-oauth.js';
import { handleError } from '../utils/error-handler.js';
import { validateCopyToInput } from '../utils/validators.js';
import { formatSheetOperationResponse } from '../utils/formatters.js';

export const copyToTool: Tool = {
  name: 'sheets_copy_to',
  description: 'Copy a sheet to another Google Sheets spreadsheet',
  inputSchema: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'OAuth access token from platform (provided by AgenticLedger platform from capability_tokens.token1 field)',
      },
      spreadsheetId: {
        type: 'string',
        description: 'The ID of the source spreadsheet (found in the URL after /d/)',
      },
      sheetId: {
        type: 'number',
        description: 'The ID of the sheet to copy (use sheets_get_metadata to find sheet IDs)',
      },
      destinationSpreadsheetId: {
        type: 'string',
        description: 'The ID of the destination spreadsheet',
      },
    },
    required: ['accessToken', 'spreadsheetId', 'sheetId', 'destinationSpreadsheetId'],
  },
};

export async function handleCopyTo(input: any) {
  try {
    const validatedInput = validateCopyToInput(input);
    const sheets = createSheetsClient(input.accessToken);

    const response = await sheets.spreadsheets.sheets.copyTo({
      spreadsheetId: validatedInput.spreadsheetId,
      sheetId: validatedInput.sheetId,
      requestBody: {
        destinationSpreadsheetId: validatedInput.destinationSpreadsheetId,
      },
    });

    return formatSheetOperationResponse('Sheet copied', {
      destinationSheetId: response.data.sheetId,
      title: response.data.title,
    });
  } catch (error) {
    return handleError(error);
  }
}
