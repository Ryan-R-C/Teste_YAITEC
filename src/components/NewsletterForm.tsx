import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface NewsletterFormProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export function NewsletterForm({ onSubmit, isLoading }: NewsletterFormProps) {
  const [topics, setTopics] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topics);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="topics"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Me descreva quais temas do newsletter você deseja receber:
        </label>
        <textarea
          id="topics"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Artificial Intelligence, Climate Change"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          'Processando...'
        ) : (
          <>
            <Send size={20} />
            Enviar
          </>
        )}
      </button>
    </form>
  );
}