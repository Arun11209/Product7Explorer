/**
 * Safely parse JSON from a fetch response
 * Checks Content-Type header to ensure response is actually JSON
 */
export async function safeJsonParse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  // Check if response is actually JSON
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
  }
  
  return response.json();
}

/**
 * Safe fetch wrapper that handles errors and validates JSON responses
 */
export async function safeFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; response: Response } | { error: string; response: Response | null }> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          if (text && text.length < 200) {
            errorMessage = text;
          }
        }
      } catch {
        // Ignore parsing errors
      }
      
      return { error: errorMessage, response };
    }
    
    const data = await safeJsonParse<T>(response);
    return { data, response };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, response: null };
    }
    return { error: 'Unknown error occurred', response: null };
  }
}

