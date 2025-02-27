import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WelcomeHeader from './SubComponents/WelcomeHeader';
import GameStats from './SubComponents/GameStats';
import RecentGames from './SubComponents/RecentGames';
import ActionButtons from './SubComponents/ActionButtons';
import FriendsList from './SubComponents/FriendsList';
import './HomePageAuth.scss';

const HomePageAuth: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Add animation trigger after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock data for recent games (in a real app, this would come from an API)
  const recentGames = [
    { id: 1, date: '2024-02-25', players: ['John', 'Emma', 'Alex'], winner: 'Emma', score: 320 },
    { id: 2, date: '2024-02-23', players: ['You', 'Mike', 'Sarah', 'Tom'], winner: 'You', score: 450 },
    { id: 3, date: '2024-02-20', players: ['You', 'David', 'Lisa'], winner: 'David', score: 280 },
  ];

  // Mock data for user stats
  const userStats = {
    gamesPlayed: 27,
    gamesWon: 12,
    totalScore: 5280,
    highestScore: 580,
    winRate: '44%'
  };

  // Mock data for friends list
  const friendsList = [
    { id: 1, username: 'Emma', status: 'online', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, username: 'John', status: 'online', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, username: 'Sarah', status: 'offline', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, username: 'Mike', status: 'away', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, username: 'Alex', status: 'online', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  ];

  if (isLoading) {
    return (
      <div className="home-page-auth__loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`home-page-auth ${isPageLoaded ? 'home-page-auth--loaded' : ''}`}>
      <div className="home-page-auth__container">
        <WelcomeHeader 
          username={user?.username || user?.firstName || 'User'} 
          profilePicture={user?.profilePicture} 
        />
        
        <div className="home-page-auth__content">
          <div className="home-page-auth__main">
            <ActionButtons />
            <RecentGames games={recentGames} />
          </div>
          
          <div className="home-page-auth__sidebar">
            <GameStats stats={userStats} />
            <FriendsList friends={friendsList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageAuth;