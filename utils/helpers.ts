

export const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";

  // If it's already a string, return it
  if (typeof error === 'string') return error;

  // If it's a standard JS Error
  if (error instanceof Error) return error.message;

  // If it's an object (like Supabase error)
  if (typeof error === 'object') {
    // Check for nested message object (recursive check)
    if (error.message && typeof error.message === 'object') {
        return getErrorMessage(error.message);
    }
    
    // Check for standard message properties and ensure they are strings
    if (error.message && typeof error.message === 'string') return error.message;
    if (error.error_description && typeof error.error_description === 'string') return error.error_description;
    if (error.msg && typeof error.msg === 'string') return error.msg;
    
    // Supabase specific: sometimes error is inside 'data' or 'error' prop
    if (error.error) {
        if (typeof error.error === 'string') return error.error;
        if (typeof error.error === 'object') return getErrorMessage(error.error);
    }
    
    // Check if error is inside 'data' (rare but possible in some API wrappers)
    if (error.data && error.data.message) return getErrorMessage(error.data);

    // Fallback: try to stringify the object to see its content
    try {
      const json = JSON.stringify(error);
      if (json !== '{}') return `Error: ${json}`;
    } catch {
       // ignore serialization errors
    }
  }

  return "An unexpected error occurred";
};
