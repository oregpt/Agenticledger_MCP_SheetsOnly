import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createSheetsClient } from '../utils/platform-oauth.js';
import { handleError } from '../utils/error-handler.js';
import { validateClearValuesInput } from '../utils/validators.js';
import { formatClearResponse } from '../utils/formatters.js';

export const clearValuesTool: Tool = {
  name: 'sheets_clear_values',
  description: 'Clear values in a specified range of a Google Sheets spreadsheet',
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
      range: {
        type: 'string',
        description: 'The A1 notation range to clear (e.g., "Sheet1!A1:B10")',
      },
    },
    required: ['accessToken', 'spreadsheetId', 'range'],
  },
};

export async function handleClearValues(input: any) {
  try {
    const validatedInput = validateClearValuesInput(input);
    const sheets = createSheetsClient(input.accessToken);

    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId: validatedInput.spreadsheetId,
      range: validatedInput.range,
    });

    return formatClearResponse(response.data.clearedRange || validatedInput.range);
  } catch (error) {
    return handleError(error);
  }
}
