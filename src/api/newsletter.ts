const API_BASE_URL = 'http://74.179.83.201:8000';
const AUTH_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
};

let authToken: string | null = null;

async function getAuthToken() {
  if (authToken) return authToken;

  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: AUTH_CREDENTIALS.username,
        password: AUTH_CREDENTIALS.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    authToken = data.access_token;
    return authToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function generateNewsletter(themes: NewsletterTheme) {
  try {
    const token = await getAuthToken();
    
    const formData = new FormData();
    formData.append('topics', themes.topics);
    formData.append('language', themes.language);
    formData.append('writing_style', themes.writing_style);
    formData.append('webhook_url', themes.webhook_url || '{}');

    const response = await fetch(`${API_BASE_URL}/generate-newsletter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to generate newsletter');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Newsletter generation error:', error);
    throw error;
  }
}

export async function checkTaskStatus(taskId: string): Promise<Task> {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to check task status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Task status check error:', error);
    throw error;
  }
}