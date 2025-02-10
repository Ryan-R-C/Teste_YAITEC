export function validateTopics(topics: string): { isValid: boolean; error?: string } {
  if (!topics.trim()) {
    return { isValid: false, error: 'Please enter at least one topic' };
  }

  const topicList = topics.split(',').map(t => t.trim());
  
  if (topicList.some(topic => topic.length < 2)) {
    return { isValid: false, error: 'Each topic must be at least 2 characters long' };
  }

  if (topicList.length > 5) {
    return { isValid: false, error: 'Maximum 5 topics allowed' };
  }

  return { isValid: true };
}