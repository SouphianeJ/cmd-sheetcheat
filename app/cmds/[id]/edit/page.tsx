import CmdForm from '@/components/CmdForm';

interface Props {
  params: { id: string };
}

export default function EditCmdPage({ params }: Props) {
  const { id } = params;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Cmd</h2>
      <CmdForm cmdId={id} />
    </div>
  );
}