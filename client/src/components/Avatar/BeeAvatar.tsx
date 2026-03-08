import { Avatar } from '../../services/api';

interface BeeAvatarProps {
  avatar: Avatar;
  size?: 'small' | 'medium' | 'large';
  showStats?: boolean;
}

export default function BeeAvatar({ avatar, size = 'medium', showStats = false }: BeeAvatarProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  const getBeeEmoji = () => {
    switch (avatar.appearance) {
      case 'baby':
        return '🐝'; // Baby bee
      case 'worker':
        return '🐝'; // Worker bee (we'll style differently)
      case 'queen':
        return '👑🐝'; // Queen bee with crown
      default:
        return '🐝';
    }
  };

  const getBeeStyle = () => {
    const baseClass = `${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-300 animate-float`;
    
    switch (avatar.appearance) {
      case 'baby':
        return `${baseClass} bg-gradient-to-br from-yellow-200 to-yellow-300 text-4xl`;
      case 'worker':
        return `${baseClass} bg-gradient-to-br from-bee-yellow to-bee-gold text-5xl`;
      case 'queen':
        return `${baseClass} bg-gradient-to-br from-bee-gold to-bee-orange text-6xl animate-shine`;
      default:
        return baseClass;
    }
  };

  const getTitle = () => {
    switch (avatar.appearance) {
      case 'baby':
        return '🐣 Baby Bee';
      case 'worker':
        return '⚡ Worker Bee';
      case 'queen':
        return '👑 Queen Bee';
      default:
        return 'Bee';
    }
  };

  const xpProgress = (avatar.total_xp % 1000) / 1000 * 100;

  return (
    <div className="flex flex-col items-center">
      <div className={getBeeStyle()}>
        <span>{getBeeEmoji()}</span>
      </div>
      
      {showStats && (
        <div className="mt-4 text-center">
          <h3 className="text-2xl font-bold text-bee-orange mb-2">
            {getTitle()}
          </h3>
          <p className="text-lg text-gray-700">
            Level {avatar.current_level}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {avatar.total_xp} XP Total
          </p>
          
          {/* XP Progress bar */}
          <div className="w-48 mx-auto">
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-bee-yellow to-bee-gold transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {avatar.total_xp % 1000} / 1000 XP to Level {avatar.current_level + 1}
            </p>
          </div>

          {/* Milestones */}
          <div className="mt-4 flex justify-center gap-2">
            <span className={`text-2xl ${avatar.current_level >= 1 ? '' : 'opacity-30'}`} title="Level 1">🐝</span>
            <span className={`text-2xl ${avatar.current_level >= 4 ? '' : 'opacity-30'}`} title="Level 4">⚡</span>
            <span className={`text-2xl ${avatar.current_level >= 7 ? '' : 'opacity-30'}`} title="Level 7">👑</span>
            <span className={`text-2xl ${avatar.current_level >= 10 ? '' : 'opacity-30'}`} title="Level 10">🏆</span>
          </div>
        </div>
      )}
    </div>
  );
}
