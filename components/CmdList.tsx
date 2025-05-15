import CmdCard from './CmdCard';

interface CmdListProps {
  cmds: {
    id: string;
    title: string;
    content: string;
    tags: string[];
  }[];
}

const CmdList: React.FC<CmdListProps> = ({ cmds }) => {
  return (
    <div>
      {cmds.length === 0 ? (
        <p>No cmds found.</p>
      ) : (
        cmds.map((cmd) => (
          <CmdCard key={cmd.id} cmd={cmd} />
        ))
      )}
    </div>
  );
};

export default CmdList;