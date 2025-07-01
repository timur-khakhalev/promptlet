# Promptlet

A request-response interface for AI conversations with development mockups support.

## Development Mockups

The application includes a powerful mockup system for development and testing purposes.

### How Mockups Work

1. **Development Mode Only**: Mockups are only available when running in development mode (`npm run dev`)

2. **Mockup Selector**: A purple settings button appears in the top-right corner during development
   - Click to open/close the mockup selector panel
   - Select from predefined scenarios or return to "Live Mode" for real API calls

3. **Predefined Scenarios**: The mockup system includes various test scenarios:
   - **Short Messages**: Both user and AI messages are short
   - **Long User, Short AI**: Long user message with short AI response  
   - **Short User, Long AI**: Short user message with long AI response
   - **Long Messages**: Both user and AI messages are long
   - **Code Example**: Response with code syntax highlighting
   - **Loading State**: Shows the loading spinner indefinitely
   - **Error State**: Simulates an error response
   - **Very Long User Message**: Tests message truncation functionality
   - **Rich Markdown**: Response with tables, headers, lists, etc.

4. **Realistic Simulation**: 
   - Mockups simulate typing effects with realistic delays
   - Loading states work as expected
   - Error scenarios display proper error messages
   - Copy and regenerate functionality works with mock data

### Using Mockups

1. Start the development server: `npm run dev`
2. Click the purple settings button (⚙️) in the top-right corner
3. Select a mockup scenario from the dropdown
4. Type any message and send - you'll see the predefined response
5. Test different scenarios to ensure UI works with various content lengths
6. Switch back to "Live Mode" to use real API calls

### Adding New Mockups

To add new mockup scenarios, edit `/src/utils/mockupData.ts`:

```typescript
{
  id: 'your-scenario-id',
  name: 'Display Name',
  description: 'Brief description of the scenario',
  userMessage: 'Sample user input',
  aiResponse: 'Sample AI response',
  isLoading: false, // Optional: show loading state
  hasError: false,  // Optional: show error state
  errorMessage: 'Custom error message' // Optional: error text
}
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
