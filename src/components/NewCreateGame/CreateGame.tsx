import React, { useState } from 'react';
import './CreateGame.scss';
import GameSettingsForm from './GameSettingsForm';
import InfoTooltip from './InfoTooltip';
import LobbyPreview from './LobbyPreview';

interface CreateGameProps {
  username: string;
  onCreateGame: (settings: GameSettings) => void;
  onCancel: () => void;
}

export interface GameSettings {
  lobbyName: string;
  rounds: number;
  timeLimit: number;
  maxPlayers: number;
  isPrivate: boolean;
  customPrompts: string[];
}

const CreateGame: React.FC<CreateGameProps> = ({ username, onCreateGame, onCancel }) => {
  const [settings, setSettings] = useState<GameSettings>({
    lobbyName: `${username}'s Game`,
    rounds: 3,
    timeLimit: 60,
    maxPlayers: 8,
    isPrivate: false,
    customPrompts: []
  });

  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');

  const handleSettingsChange = (updatedSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGame(settings);
  };

  return (
    <div className="create-game">
      <div className="create-game__header">
        <h1>Create New Game</h1>
        <InfoTooltip 
          content="Create a custom game with your preferred settings. You'll be the host of this game and can invite friends to join."
        />
      </div>
      
      <div className="create-game__tabs">
        <button 
          className={`create-game__tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Game Settings
        </button>
        <button 
          className={`create-game__tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>
      
      <div className="create-game__content">
        {activeTab === 'settings' ? (
          <GameSettingsForm 
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        ) : (
          <LobbyPreview 
            settings={settings}
            host={username}
          />
        )}
      </div>
      
      <div className="create-game__actions">
        <button 
          className="create-game__button create-game__button--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="create-game__button create-game__button--primary"
          onClick={handleSubmit}
        >
          Create Game
        </button>
      </div>
    </div>
  );
};

export default CreateGame;