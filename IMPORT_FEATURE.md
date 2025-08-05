# Import JSON Feature Documentation

## Overview
The visualization app now supports importing custom JSON files that match the required schema. This allows users to visualize their own session data.

## How to Use

1. **Click the "Import JSON" button** in the top-right corner of the main page
2. **Upload a JSON file** by either:
   - Clicking the upload area and selecting a file
   - Dragging and dropping a JSON file onto the upload area
3. **Review validation results**:
   - If successful, you'll see a success message with the number of sessions and problems loaded
   - If there are errors, you'll see detailed validation messages explaining what's wrong
4. **Reset to default data** by clicking the "Reset" button that appears next to the filename

## Schema Requirements

Your JSON file must:
- Be an array of session objects at the root level
- Each session must include:
  - `id` (string)
  - `isComplete` (boolean or 0/1)
  - `problemSet` (object with id, problems array, and expireMinutes)
  - `progresses` (array of progress objects)

### Key Data Types

- **Datetime fields**: Must be in ISO 8601 format (e.g., "2024-01-01T12:00:00Z")
- **Boolean fields**: Can be `true`/`false` or `1`/`0`
- **Nullable fields**: Can be `null` where allowed by the schema

## Error Messages

The validation provides detailed error messages such as:
- "Missing required field: progresses[0].axiiaChat"
- "Invalid type: expected string at problemSet.id, got number"
- "Invalid datetime format at progresses[2].createdAt"

## Example Files

- `example-custom-data.json` - A complete valid example you can use as a template
- `test-valid.json` - A minimal valid example
- `test-invalid.json` - An example that will trigger validation errors

## Technical Details

The import feature:
- Uses Zod schema validation for comprehensive type checking
- Stores custom data in a client-side state management system
- Processes data on the client side for better performance
- Supports files of any reasonable size (validation happens client-side)