export interface Task {
  task_id: string;
  status: string;
  result?: string;
}

export interface NewsletterTheme {
  topics: string;
  language: string;
  writing_style: string;
  webhook_url?: string;
}