import * as mammoth from 'mammoth';

// Interface matching the types.ts definitions
import { FormField } from './types';

// Load PDFJS helper
async function loadPdfJS(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = (err) => {
      console.error('Failed to load PDF.js from CDN:', err);
      reject(err);
    };
    document.head.appendChild(script);
  });
}

// Convert DOCX ArrayBuffer to raw text
export async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  } catch (error) {
    console.error('Error parsing DOCX with mammoth:', error);
    throw new Error('Failed to parse Word document. Please ensure it is a valid .docx file.');
  }
}

// Convert PDF ArrayBuffer to raw text
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdfjsLib = await loadPdfJS();
    if (!pdfjsLib) throw new Error('PDF.js could not be loaded in this environment');

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error parsing PDF with pdfjs:', error);
    throw new Error('Failed to parse PDF document. Please ensure it is a valid PDF file.');
  }
}

// Parse text into form fields using heuristics
export function parseTextToFields(text: string): FormField[] {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const fields: FormField[] = [];
  let currentField: FormField | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Heuristic: Check if this line looks like a question/field label
    // Criteria for a field label:
    // 1. Ends with '?' or ':'
    // 2. Starts with a numbering (e.g. "1. Name", "2) Email")
    // 3. Is a short line (e.g. < 80 chars) that doesn't look like general text
    // 4. Common keywords: "Name", "Email", "Phone", "Mobile", "Contact", "Address", "Subject", "Message", "Category"
    const isQuestion = line.endsWith('?');
    const isColonLabel = line.endsWith(':');
    const hasNumberPrefix = /^\d+[\.\)\-]\s+/.test(line);
    const hasCommonKeyword = /^(name|email|phone|mobile|contact|address|subject|message|comments|gender|category|inquiry|query)/i.test(line);
    const isShort = line.length < 80;

    // Check if we should treat this line as a new question/field
    const shouldBeField = isQuestion || isColonLabel || (isShort && (hasNumberPrefix || hasCommonKeyword));

    if (shouldBeField) {
      // If we had a previous field, push it before creating a new one
      if (currentField) {
        fields.push(currentField);
        currentField = null;
      }

      // Clean label: remove leading numbering (e.g. "1. Name" -> "Name")
      let cleanLabel = line.replace(/^\d+[\.\)\-]\s+/, '').trim();
      // Remove trailing colon or question mark if any
      if (cleanLabel.endsWith(':') || cleanLabel.endsWith('?')) {
        cleanLabel = cleanLabel.slice(0, -1).trim();
      }

      // Check if it represents a required field (e.g. contains "*" or is generally name/email)
      let required = false;
      if (cleanLabel.includes('*')) {
        required = true;
        cleanLabel = cleanLabel.replace(/\*/g, '').trim();
      } else if (/^(name|email)/i.test(cleanLabel)) {
        // By default name and email are typically required
        required = true;
      }

      // Generate a simple unique ID
      const baseId = cleanLabel
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
      const id = baseId || `field_${Date.now()}_${fields.length}`;

      // Determine field type by looking at keywords
      let type: FormField['type'] = 'text';
      if (/email/i.test(cleanLabel)) {
        type = 'email';
      } else if (/phone|mobile|contact/i.test(cleanLabel)) {
        type = 'text'; // keep as text to preserve formatting/spacing/plus signs
      } else if (/number|count|quantity|age/i.test(cleanLabel)) {
        type = 'number';
      } else if (/message|comments|description|address/i.test(cleanLabel)) {
        type = 'textarea';
      }

      currentField = {
        id,
        label: cleanLabel,
        type,
        required,
        placeholder: `Enter your ${cleanLabel.toLowerCase()}`
      };
    } else if (currentField) {
      // Check if this line is an option for the current field (e.g. checkbox/radio marker)
      // Standard checkbox markers: "[ ] Option", "( ) Option", "- Option", "Option A / Option B"
      const isOptionMarker = /^([\[\(\-\s*]*[x\s]*[\]\)]|[-•*])\s+/i.test(line);
      
      if (isOptionMarker) {
        // Clean option label
        const cleanOption = line
          .replace(/^([\[\(\-\s*]*[x\s]*[\]\)]|[-•*])\s+/i, '')
          .trim();

        if (cleanOption) {
          if (!currentField.options) {
            currentField.options = [];
            currentField.type = 'select'; // Upgrade to select if options are present
          }
          currentField.options.push(cleanOption);
        }
      } else if (line.includes('/') && line.length < 50) {
        // Split by / (e.g. "Yes / No" or "Male / Female")
        const parts = line.split('/').map(p => p.trim()).filter(Boolean);
        if (parts.length > 1 && parts.length <= 4) {
          currentField.type = 'select';
          currentField.options = parts;
        }
      } else {
        // If it's a short text line and we already have options, it might be another option without checkbox
        if (currentField.options && line.length < 40) {
          currentField.options.push(line);
        } else {
          // Append description/placeholder hint to current field if it's long and doesn't match a new question
          if (!currentField.placeholder || currentField.placeholder.startsWith('Enter your')) {
            currentField.placeholder = line;
          }
        }
      }
    }
  }

  // Push final field if any
  if (currentField) {
    fields.push(currentField);
  }

  // If no fields found, return default fallback fields
  if (fields.length === 0) {
    return [
      { id: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your Name' },
      { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Your Email' },
      { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your Message' }
    ];
  }

  return fields;
}
