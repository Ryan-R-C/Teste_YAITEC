import { useState } from 'react';
import { NewspaperIcon } from 'lucide-react';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { NewsletterForm } from './components/NewsletterForm';
import type { ToastEntity } from './components/Toast';
import { generateNewsletter } from './api/newsletter';
import type { Task } from './types';
import { useTaskPolling } from './hooks/useTaskPolling';
import Toast from './components/Toast';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<ToastEntity| null>(null);

  const handleSubmit = async (topics: string) => {
    setIsLoading(true);
    setError(null);

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

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setCurrentTask(null);
  };

  const handleCloseModal = () => {
    if(isLoading) return;
    
    closeModal()
  }

  const handleFinish = () => {
    let alertConfig: ToastEntity = { type: 'success', message: "Você foi inscrito com sucesso!" };
    
    if (error) {
      alertConfig = { type: 'error', message: "Ocorreu um erro, tente novamente mais tarde" };
    }
    
    setAlert(alertConfig);
    closeModal();
  };

  useTaskPolling({
    currentTask,
    isLoading,
    setIsLoading,
    setError,
    onFinish: handleFinish,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Assinatura de Newsletter</h1>

        {alert && (
          <Toast
            message={alert.message}
            type={alert.type}
            duration={3000}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="grid gap-6">
          <Card
            title="Newsletter"
            description="Inscreva-se para receber conteúdo personalizado."
            icon={<NewspaperIcon className="w-6 h-6 text-blue-600" />}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} isLoading={isLoading}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Inscreva-se na Newsletter</h2>
            <NewsletterForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;