import PromptForm from '@/components/PromptForm';

interface Props {
  params: { id: string };
}

export default function EditPromptPage({ params }: Props) {
  const { id } = params;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Prompt</h2>
      <PromptForm promptId={id} />
    </div>
  );
}