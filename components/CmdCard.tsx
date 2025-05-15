import Link from 'next/link';
import CopyButton from './CopyButton';
import { Cmd } from '@/types/cmd'; // Import Cmd type

interface CmdCardProps {
  cmd: Cmd; // Use the imported Cmd type
}

const CmdCard: React.FC<CmdCardProps> = ({ cmd }) => {
  return (
    <div className="card">
      <h3 className="card-title">
        <Link href={`/cmds/${cmd.id}`} className="text-neon-blue hover:underline">
          {cmd.title}
        </Link>
      </h3>
      <p className="mb-3">{cmd.content}</p> {/* Slightly dimmer text, line-clamp for brevity */}
      <div className="card-footer flex justify-between items-center">
        <div className="tag-list"> {/* Use flex-wrap and gap for tags */}
          {cmd.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <CopyButton text={cmd.content} />
      </div>
    </div>
  );
};

export default CmdCard;