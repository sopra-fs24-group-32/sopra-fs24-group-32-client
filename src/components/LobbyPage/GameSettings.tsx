import React, { useState } from 'react';
import { FaCog, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useLobby } from "../../store/hooks/useLobby";
import './GameSettings.scss';

interface GameSettingsProps {
  settings: {
    numberOfRounds: number;
    timeLimit: number;
    maxPlayers: number;
    isPrivate: boolean;
    difficulty?: string;
    gameSettings?: string[];
  };
  isEditable: boolean;
}

const GameSettings: React.FC<GameSettingsProps> = ({ settings, isEditable }) => {
  const { updateLobbySettings } = useLobby();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState(settings);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedSettings(settings);
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    
    // Convert checkbox values to boolean
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    // Convert number inputs to numbers
    else if (type === 'number') {
      parsedValue = Number(value);
    }
    
    setEditedSettings({
      ...editedSettings,
      [name]: parsedValue
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate number of rounds (must be at least 1)
    if (editedSettings.numberOfRounds < 1) {
      newErrors.numberOfRounds = 'At least 1 round is required';
    }
    
    // Validate time limit (e.g., between 10 and 120 seconds)
    if (editedSettings.timeLimit < 10) {
      newErrors.timeLimit = 'Time limit must be at least 10 seconds';
    } else if (editedSettings.timeLimit > 120) {
      newErrors.timeLimit = 'Time limit cannot exceed 120 seconds';
    }
    
    // Validate max players (must be between 3 and 10)
    if (editedSettings.maxPlayers < 3) {
      newErrors.maxPlayers = 'At least 3 players are required';
    } else if (editedSettings.maxPlayers > 10) {
      newErrors.maxPlayers = 'Maximum 10 players allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      return;
    }
    
    try {
      await updateLobbySettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="game-settings">
      <div className="settings-header">
        <h2 className="settings-title">
            <span className="settings-icon">
                <FaCog />
            </span> Game Settings
        </h2>
        
        {isEditable && (
          <button 
            className={`edit-toggle ${isEditing ? 'is-editing' : ''}`}
            onClick={handleEditToggle}
            aria-label={isEditing ? "Cancel editing" : "Edit settings"}
          >
            {isEditing ? <FaTimes /> : <FaEdit />}
          </button>
        )}
      </div>
      
      <div className={`settings-form ${isEditing ? 'is-editing' : ''}`}>
        <div className="form-group">
          <label htmlFor="numberOfRounds">Number of Rounds:</label>
          {isEditing ? (
            <>
              <input
                type="number"
                id="numberOfRounds"
                name="numberOfRounds"
                value={editedSettings.numberOfRounds}
                onChange={handleChange}
                min="1"
                max="20"
              />
              {errors.numberOfRounds && (
                <div className="error-message">{errors.numberOfRounds}</div>
              )}
            </>
          ) : (
            <div className="setting-value">{settings.numberOfRounds}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="timeLimit">Time Limit (seconds):</label>
          {isEditing ? (
            <>
              <input
                type="number"
                id="timeLimit"
                name="timeLimit"
                value={editedSettings.timeLimit}
                onChange={handleChange}
                min="10"
                max="120"
              />
              {errors.timeLimit && (
                <div className="error-message">{errors.timeLimit}</div>
              )}
            </>
          ) : (
            <div className="setting-value">{settings.timeLimit} seconds</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="maxPlayers">Max Players:</label>
          {isEditing ? (
            <>
              <input
                type="number"
                id="maxPlayers"
                name="maxPlayers"
                value={editedSettings.maxPlayers}
                onChange={handleChange}
                min="3"
                max="10"
              />
              {errors.maxPlayers && (
                <div className="error-message">{errors.maxPlayers}</div>
              )}
            </>
          ) : (
            <div className="setting-value">{settings.maxPlayers} players</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="isPrivate">Private Lobby:</label>
          {isEditing ? (
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={editedSettings.isPrivate}
              onChange={handleChange}
            />
          ) : (
            <div className="setting-value">{settings.isPrivate ? 'Yes' : 'No'}</div>
          )}
        </div>
        
        {editedSettings.difficulty && (
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty:</label>
            {isEditing ? (
              <select
                id="difficulty"
                name="difficulty"
                value={editedSettings.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            ) : (
              <div className="setting-value">
                {settings.difficulty?.charAt(0).toUpperCase() + settings.difficulty?.slice(1)}
              </div>
            )}
          </div>
        )}
        
        {isEditing && (
          <div className="form-actions">
            <button className="save-button" onClick={handleSave}>
              <FaSave /> Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSettings;