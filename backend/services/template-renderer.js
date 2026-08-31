/**
 * Template Renderer Service
 *
 * Handles rendering of Handlebars templates with layouts, partials, and CSS injection.
 * Provides functionality to compile templates and generate HTML output for documents.
 */

import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getStatusDisplay } from '../utils/status-display.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define template paths
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const LAYOUTS_DIR = path.join(TEMPLATES_DIR, 'layouts');
const PARTIALS_DIR = path.join(TEMPLATES_DIR, 'partials');
const DOCUMENTS_DIR = path.join(TEMPLATES_DIR, 'documents');
const STYLES_DIR = path.join(TEMPLATES_DIR, 'styles');

// Cache for compiled templates and partials
const templateCache = new Map();
const partialsRegistered = new Set();

/**
 * Read a file and return its contents as a string
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} File contents
 */
async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Load and register all Handlebars partials
 * @returns {Promise<void>}
 */
async function registerPartials() {
  if (partialsRegistered.size > 0) {
    return; // Partials already registered
  }

  try {
    const partialFiles = await fs.readdir(PARTIALS_DIR);

    for (const file of partialFiles) {
      if (file.endsWith('.hbs')) {
        const partialName = path.basename(file, '.hbs');
        const partialPath = path.join(PARTIALS_DIR, file);
        const partialContent = await readFile(partialPath);

        Handlebars.registerPartial(partialName, partialContent);
        partialsRegistered.add(partialName);
      }
    }
  } catch (error) {
    throw new Error(`Failed to register partials: ${error.message}`);
  }
}

/**
 * Load CSS file contents
 * @param {string} filename - CSS filename
 * @returns {Promise<string>} CSS content
 */
async function loadCSS(filename) {
  const cssPath = path.join(STYLES_DIR, filename);
  return await readFile(cssPath);
}

/**
 * Load all CSS styles and return as an object
 * @returns {Promise<Object>} Object containing CSS content
 */
async function loadStyles() {
  try {
    const [commonCSS, tablesCSS, printCSS] = await Promise.all([
      loadCSS('common.css'),
      loadCSS('tables.css'),
      loadCSS('print.css')
    ]);

    return {
      commonCSS,
      tablesCSS,
      printCSS
    };
  } catch (error) {
    throw new Error(`Failed to load styles: ${error.message}`);
  }
}

/**
 * Compile a template with caching
 * @param {string} templatePath - Path to the template file
 * @returns {Promise<Function>} Compiled Handlebars template
 */
async function compileTemplate(templatePath) {
  // Check cache first
  if (templateCache.has(templatePath)) {
    return templateCache.get(templatePath);
  }

  const templateContent = await readFile(templatePath);
  const compiledTemplate = Handlebars.compile(templateContent);

  // Cache the compiled template
  templateCache.set(templatePath, compiledTemplate);

  return compiledTemplate;
}

/**
 * Render a document template with layout
 * @param {string} templateName - Name of the document template (without .hbs extension)
 * @param {Object} data - Data to populate the template
 * @returns {Promise<string>} Rendered HTML
 */
export async function renderTemplate(templateName, data) {
  try {
    const statusDisplay = data?.status != null ? getStatusDisplay(data.status) : null;
    const renderData = statusDisplay
      ? {
          ...data,
          statusLabel: data.statusLabel || statusDisplay.label,
          statusTone: data.statusTone || statusDisplay.tone,
        }
      : data;

    // Register partials if not already done
    await registerPartials();

    // Load CSS styles
    const styles = await loadStyles();

    // Load and compile the document template
    const documentPath = path.join(DOCUMENTS_DIR, `${templateName}.hbs`);
    const documentTemplate = await compileTemplate(documentPath);

    // Render the document body with data
    const bodyContent = documentTemplate(renderData);

    // Load and compile the base layout
    const layoutPath = path.join(LAYOUTS_DIR, 'base.hbs');
    const layoutTemplate = await compileTemplate(layoutPath);

    // Merge data with CSS styles and rendered body
    const layoutData = {
      ...renderData,
      ...styles,
      body: bodyContent
    };

    // Render the complete HTML with layout
    const html = layoutTemplate(layoutData);

    return html;
  } catch (error) {
    throw new Error(`Failed to render template "${templateName}": ${error.message}`);
  }
}

/**
 * Clear the template cache (useful for development/testing)
 * @returns {void}
 */
export function clearCache() {
  templateCache.clear();
  partialsRegistered.clear();

  // Unregister all Handlebars partials
  Object.keys(Handlebars.partials).forEach(partialName => {
    Handlebars.unregisterPartial(partialName);
  });
}

export default {
  renderTemplate,
  clearCache
};
