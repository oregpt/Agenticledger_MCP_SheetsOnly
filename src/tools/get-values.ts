import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { createSheetsClient } from '../utils/platform-oauth.js';
import { handleError } from '../utils/error-handler.js';
import { validateGetValuesInput } from '../utils/validators.js';
import { formatValuesResponse } from '../utils/formatters.js';

export const getValuesTool: Tool = {
  name: 'sheets_get_values',
  description: 'Get values from a specified range in a Google Sheets spreadsheet',
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
        description: 'The A1 notation range to retrieve (e.g., "Sheet1!A1:B10")',
      },
      majorDimension: {
        type: 'string',
        enum: ['ROWS', 'COLUMNS'],
        description: 'The major dimension of the values (default: ROWS)',
      },
      valueRenderOption: {
        type: 'string',
        enum: ['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'],
        description: 'How values should be represented (default: FORMATTED_VALUE)',
      },
    },
    required: ['accessToken', 'spreadsheetId', 'range'],
  },
};

export async function handleGetValues(input: any) {
  try {
    const validatedInput = validateGetValuesInput(input);
    const sheets = createSheetsClient(input.accessToken);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: validatedInput.spreadsheetId,
      range: validatedInput.range,
      majorDimension: validatedInput.majorDimension,
      valueRenderOption: validatedInput.valueRenderOption,
    });

    return formatValuesResponse(response.data.values || [], response.data.range);
  } catch (error) {
    return handleError(error);
  }
}
