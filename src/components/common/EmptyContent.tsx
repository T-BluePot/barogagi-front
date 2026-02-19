interface EmptyContentProps {
  message: string;
}

const EmptyContent = ({ message }: EmptyContentProps) => {
  return (
    <div className="flex justify-center py-4 bg-gray-10 rounded-lg">
      <p className="typo-body-02 text-gray-50 text-center">{message}</p>
    </div>
  );
};

export default EmptyContent;
