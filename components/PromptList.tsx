import PromptCard from './PromptCard';

interface PromptListProps {
  prompts: {
    id: string;
    title: string;
    content: string;
    tags: string[];
  }[];
}

const PromptList: React.FC<PromptListProps> = ({ prompts }) => {
  return (
    <div>
      {prompts.length === 0 ? (
        <p>No prompts found.</p>
      ) : (
        prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))
      )}
    </div>
  );
};

export default PromptList;