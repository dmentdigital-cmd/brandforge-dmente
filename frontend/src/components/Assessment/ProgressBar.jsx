// ===================================
// PROGRESS BAR COMPONENT
// ===================================

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Texto de progreso */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-300">
          Pregunta {current} de {total}
        </span>
        <span className="text-sm font-semibold text-blue-400">
          {percentage}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
