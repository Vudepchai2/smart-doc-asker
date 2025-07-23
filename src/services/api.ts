// API service for communicating with the backend AI agent

export interface ChatMessage {
  message: string;
  files?: File[];
}

export interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

export class DocumentationAI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async sendMessage(message: string, files: File[]): Promise<ChatResponse> {
    try {
      // Create FormData to handle both text and files
      const formData = new FormData();
      formData.append('message', message);
      
      // Attach files to the request
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      // Make API call to backend
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it for FormData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

      /* 
      BACKEND AI AGENT INTEGRATION POINT:
      
      The backend endpoint '/api/chat' would handle this request like this:

      1. RECEIVE REQUEST:
         - Extract message and files from FormData
         - Validate file types and sizes
         - Parse/extract text from uploaded documents (PDF, DOC, etc.)

      2. AI AGENT PROCESSING:
         - Send document content + user question to AI service (OpenAI, Anthropic, etc.)
         - Use embeddings to find relevant document sections
         - Generate contextual response based on documents

      3. BACKEND CODE EXAMPLE:
         
         app.post('/api/chat', upload.array('files'), async (req, res) => {
           const { message } = req.body;
           const files = req.files;
           
           // Extract text from uploaded documents
           const documentTexts = await Promise.all(
             files.map(file => extractTextFromFile(file))
           );
           
           // Send to AI agent (OpenAI example)
           const aiResponse = await openai.chat.completions.create({
             model: "gpt-4",
             messages: [
               {
                 role: "system",
                 content: `You are a documentation AI. Use the following documents to answer questions: ${documentTexts.join('\n\n')}`
               },
               {
                 role: "user", 
                 content: message
               }
             ]
           });
           
           res.json({
             response: aiResponse.choices[0].message.content,
             success: true
           });
         });

      4. REQUIRED BACKEND DEPENDENCIES:
         - multer (file upload handling)
         - pdf-parse (PDF text extraction)
         - mammoth (Word document parsing)
         - openai or @anthropic-ai/sdk (AI integration)
      */

    } catch (error) {
      console.error('API Error:', error);
      return {
        response: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export singleton instance
export const documentationAI = new DocumentationAI();