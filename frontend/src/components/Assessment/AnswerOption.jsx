// ===================================
// ANSWER OPTION COMPONENT
// ===================================

export default function AnswerOption({
  id,
  text,
  isSelected,
  isDisabled,
  onSelect
}) {
  return (
    <button
      onClick={() => !isDisabled && onSelect(id)}
      disabled={isDisabled}
      className={`
        w-full p-4 mb-3 rounded-lg border-2 transition-all duration-200
        flex items-start text-left
        ${isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20'
          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Círculo de selección */}
      <div className={`
        w-5 h-5 rounded-full border-2 mt-1 mr-3 flex items-center justify-center flex-shrink-0
        transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-500'
          : 'border-slate-500'
        }
      `}>
        {isSelected && (
          <div className="w-2 h-2 bg-white rounded-full" />
        )}
      </div>

      {/* Texto de opción */}
      <span className={`
        text-sm font-medium leading-relaxed
        ${isSelected ? 'text-slate-100' : 'text-slate-300'}
      `}>
        {text}
      </span>
    </button>
  );
}
