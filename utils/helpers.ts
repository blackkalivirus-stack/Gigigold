export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // 1. If it's already a string
  if (typeof error === 'string') return error;

  // 2. Standard Error object (properties like message are often not enumerable in JSON.stringify)
  if (error instanceof Error) {
    return error.message;
  }

  // 3. Common API/Supabase error shapes
  if (typeof error === 'object') {
    // Prioritize human readable messages
    if (error.message) return String(error.message);
    if (error.error_description) return String(error.error_description);
    if (error.details) return String(error.details);
    if (error.hint) return String(error.hint);
    if (error.msg) return String(error.msg);
    
    // Postgres/Supabase code only fallback
    if (error.code) return `Database Error: ${error.code}`;
  }

  // 4. Fallback to JSON if possible to show structure
  try {
    const json = JSON.stringify(error);
    if (json && json !== '{}' && !json.includes('[object Object]')) {
      // Limit length to avoid massive error dumps
      return json.slice(0, 200) + (json.length > 200 ? '...' : '');
    }
  } catch (e) {
    // ignore stringify errors
  }

  // 5. Last resort
  return String(error); 
};