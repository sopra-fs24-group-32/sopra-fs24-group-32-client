import React, { useState } from 'react';
import './FriendsList.scss';

interface Friend {
  id: number;
  username: string;
  status: 'online' | 'offline' | 'away';
  avatarUrl: string;
}

interface FriendsListProps {
  friends: Friend[];
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  const [filter, setFilter] = useState<'all' | 'online'>('all');
  
  const filteredFriends = filter === 'all' 
    ? friends 
    : friends.filter(friend => friend.status === 'online');
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return '#10b981'; // green
      case 'away': return '#f59e0b'; // amber
      case 'offline': return '#94a3b8'; // slate-400
      default: return '#94a3b8';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return status;
    }
  };

  return (
    <div className="friends-list">
      <div className="friends-list__header">
        <h2 className="friends-list__title">Friends</h2>
        <div className="friends-list__filter">
          <button 
            className={`friends-list__filter-btn ${filter === 'all' ? 'friends-list__filter-btn--active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`friends-list__filter-btn ${filter === 'online' ? 'friends-list__filter-btn--active' : ''}`} 
            onClick={() => setFilter('online')}
          >
            Online
          </button>
        </div>
      </div>
      
      {filteredFriends.length === 0 ? (
        <div className="friends-list__empty">
          {filter === 'online' 
            ? 'None of your friends are online right now.' 
            : 'You don\'t have any friends yet.'}
        </div>
      ) : (
        <div className="friends-list__items">
          {filteredFriends.map((friend, index) => (
            <div 
              className="friends-list__item" 
              key={friend.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="friends-list__avatar">
                <img 
                  src={friend.avatarUrl} 
                  alt={friend.username} 
                  className="friends-list__avatar-img" 
                />
                <span 
                  className="friends-list__status" 
                  style={{ backgroundColor: getStatusColor(friend.status) }}
                  title={getStatusText(friend.status)}
                ></span>
              </div>
              
              <div className="friends-list__info">
                <h3 className="friends-list__name">{friend.username}</h3>
                <p className="friends-list__status-text" style={{ color: getStatusColor(friend.status) }}>
                  {getStatusText(friend.status)}
                </p>
              </div>
              
              <div className="friends-list__actions">
                <button className="friends-list__action-btn friends-list__action-btn--invite" title="Invite to game">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 11a9 9 0 0 1 9 9"></path>
                    <path d="M4 4a16 16 0 0 1 16 16"></path>
                    <circle cx="5" cy="19" r="1"></circle>
                  </svg>
                </button>
                <button className="friends-list__action-btn friends-list__action-btn--message" title="Send message">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="friends-list__add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
        Add Friend
      </button>
    </div>
  );
};

export default FriendsList;