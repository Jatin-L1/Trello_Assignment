interface BoardCardProps {
  board: {
    id: string;
    title: string;
    background_color: string;
    background_image?: string;
  };
  onClick: () => void;
}

export default function BoardCard({ board, onClick }: BoardCardProps) {
  return (
    <button
      onClick={onClick}
      className="h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative group"
      style={{
        backgroundColor: board.background_image ? 'transparent' : board.background_color,
        backgroundImage: board.background_image ? `url(${board.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="relative h-full p-4 flex items-start">
        <h3 className="text-white font-semibold text-lg text-left">{board.title}</h3>
      </div>
    </button>
  );
}
