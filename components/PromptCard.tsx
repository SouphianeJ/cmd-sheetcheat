import Link from 'next/link';
import CopyButton from './CopyButton';
import { Prompt } from '@/types/prompt'; // Import Prompt type

interface PromptCardProps {
  prompt: Prompt; // Use the imported Prompt type
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  return (
    <div className="card">
      <h3 className="card-title">
        <Link href={`/prompts/${prompt.id}`} className="text-neon-blue hover:underline">
          {prompt.title}
        </Link>
      </h3>
      <p className="mb-3">{prompt.content}</p> {/* Slightly dimmer text, line-clamp for brevity */}
      <div className="card-footer flex justify-between items-center">
        <div className="tag-list"> {/* Use flex-wrap and gap for tags */}
          {prompt.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <CopyButton text={prompt.content} />
      </div>
    </div>
  );
};

export default PromptCard;