import { useState, useEffect } from 'react';
import { NewspaperIcon } from 'lucide-react';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { NewsletterForm } from './components/NewsletterForm';
import { generateNewsletter, checkTaskStatus } from './api/newsletter';
import type { Task } from './types';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newsletterResult, setNewsletterResult] = useState<string | null>(null);
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const pollTaskStatus = async () => {
      if (!currentTask?.task_id) return;

      try {
        const updatedTask = await checkTaskStatus(currentTask.task_id);
        
        if (updatedTask.status.toUpperCase() !== 'PENDING') {
          // Clear interval as we got a final status
          clearInterval(intervalId);
          setIsLoading(false);

          if (updatedTask.status.toUpperCase() === 'SUCCESS') {
            setNewsletterResult(updatedTask.result || 'Newsletter generated successfully!');
            setError(null);
          } else {
            setError('Failed to generate newsletter. Please try again.');
            setNewsletterResult(null);
          }
        }
      } catch (err) {
        clearInterval(intervalId);
        setError('Failed to check task status');
        setIsLoading(false);
      }
    };

    if (currentTask && isLoading) {
      // Poll every 2 seconds
      intervalId = setInterval(pollTaskStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentTask, isLoading]);

  const handleSubmit = async (topics: string) => {
    setIsLoading(true);
    setError(null);
    setNewsletterResult(null);

    try {
      const response = await generateNewsletter({
        topics,
        language: 'pt',
        writing_style: 'Formal, like a newsletter',
        webhook_url: '{}',
      });
      setCurrentTask(response);
    } catch (err) {
      setError('Failed to generate newsletter');
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setNewsletterResult(null);
      setError(null);
      setCurrentTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Newsletter Subscription</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Newsletter"
            description="Subscribe to receive personalized content"
            icon={<NewspaperIcon className="w-6 h-6 text-blue-600" />}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Subscribe to Newsletter</h2>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {newsletterResult && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md whitespace-pre-wrap">
                {JSON.stringify(newsletterResult)}
              </div>
            )}

            <NewsletterForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;