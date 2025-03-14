import React from 'react';
import { GameSettings } from './CreateGame';
import InfoTooltip from './InfoTooltip';
import RangeSlider from './RangeSlider';
import './GameSettingsForm.scss';

interface GameSettingsFormProps {
  settings: GameSettings;
  onSettingsChange: (updatedSettings: Partial<GameSettings>) => void;
}

const GameSettingsForm: React.FC<GameSettingsFormProps> = ({ settings, onSettingsChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      onSettingsChange({ [name]: checked });
    } else if (type === 'number') {
      const numValue = parseInt(value, 10);
      onSettingsChange({ [name]: numValue });
    } else {
      onSettingsChange({ [name]: value });
    }
  };

  const handleCustomPromptsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompts = e.target.value.split('\n').filter(prompt => prompt.trim() !== '');
    onSettingsChange({ customPrompts: prompts });
  };

  return (
    <div className="game-settings-form">
      <div className="game-settings-form__section">
        <h2>Basic Settings</h2>
        
        <div className="form-group">
          <label htmlFor="lobbyName">Lobby Name</label>
          <input
            id="lobbyName"
            name="lobbyName"
            type="text"
            value={settings.lobbyName}
            onChange={handleInputChange}
            maxLength={30}
            placeholder="Enter a name for your game lobby"
          />
        </div>
        
        <div className="form-group form-group--checkbox">
          <input
            id="isPrivate"
            name="isPrivate"
            type="checkbox"
            checked={settings.isPrivate}
            onChange={handleInputChange}
          />
          <label htmlFor="isPrivate">
            Private Lobby
            <InfoTooltip content="Private lobbies require an invitation code to join." />
          </label>
        </div>
      </div>
      
      <div className="game-settings-form__section">
        <h2>Game Rules</h2>
        
        <div className="form-group">
          <label htmlFor="rounds">
            Number of Rounds
            <InfoTooltip content="Each player will have a chance to provide a prompt. More rounds mean longer gameplay." />
          </label>
          <RangeSlider
            id="rounds"
            name="rounds"
            min={1}
            max={10}
            value={settings.rounds}
            onChange={(value) => onSettingsChange({ rounds: value })}
          />
          <div className="form-group__value">{settings.rounds}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="timeLimit">
            Time Limit (seconds)
            <InfoTooltip content="How long players have to guess the prompt after the image is shown." />
          </label>
          <RangeSlider
            id="timeLimit"
            name="timeLimit"
            min={20}
            max={120}
            step={5}
            value={settings.timeLimit}
            onChange={(value) => onSettingsChange({ timeLimit: value })}
          />
          <div className="form-group__value">{settings.timeLimit}s</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="maxPlayers">
            Maximum Players
            <InfoTooltip content="The maximum number of players who can join your game lobby." />
          </label>
          <RangeSlider
            id="maxPlayers"
            name="maxPlayers"
            min={3}
            max={12}
            value={settings.maxPlayers}
            onChange={(value) => onSettingsChange({ maxPlayers: value })}
          />
          <div className="form-group__value">{settings.maxPlayers}</div>
        </div>
      </div>
      
      <div className="game-settings-form__section">
        <h2>Custom Content (Optional)</h2>
        
        <div className="form-group">
          <label htmlFor="customPrompts">
            Custom Prompts
            <InfoTooltip content="Add your own custom prompts for the game. Each line will be treated as a separate prompt." />
          </label>
          <textarea
            id="customPrompts"
            name="customPrompts"
            placeholder="Enter custom prompts, one per line (optional)"
            value={settings.customPrompts.join('\n')}
            onChange={handleCustomPromptsChange}
            rows={4}
          />
          <small className="form-group__help">
            Enter one prompt per line. Leave empty to use random prompts.
          </small>
        </div>
      </div>
    </div>
  );
};

export default GameSettingsForm;