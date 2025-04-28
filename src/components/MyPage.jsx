import React, { useState, useRef } from 'react';
import AlertPopup from './AlertPopup';
import styled, { keyframes, css } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleUp = keyframes`
  from { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: transparent;
  font-family: 'Nunito', sans-serif;
  position: relative;
  z-index: 1;
  padding: 2rem;
  animation: ${pageEnter} 0.8s ease-out forwards;
`;

const MainCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  height: 85vh;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 0.3s forwards;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  transform: translateY(-20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 0.6s forwards;
`;

const Logo = styled.div`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2.2rem;
  color: #3A2618;
  cursor: pointer;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    color: #FF5252;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.1rem;
  color: #3A2618;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FF5252;
    transform: translateY(-2px);
  }
  
  ${props => props.active && `
    color: #FF5252;
    &:after {
      content: '';
      position: absolute;
      width: 60%;
      height: 3px;
      background: #FF5252;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 3px;
    }
  `}
  
  ${props => props.hasNotification && `
    color: #FF5252;
    position: relative;
    
    &:before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: #FF5252;
      border-radius: 50%;
      top: 4px;
      right: 8px;
    }
  `}
`;

const ProfileContainer = styled.div`
  padding: 2.5rem;
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 1.2s forwards;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(180, 180, 180, 0.6);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2rem;
  color: #3A2618;
  margin: 0 0 1.5rem 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    width: 30%;
    height: 3px;
    background: linear-gradient(to right, #FF5252, transparent);
    bottom: -5px;
    left: 0;
    border-radius: 3px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-right: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    
    &:after {
      opacity: 1;
    }
  }
  
  &:after {
    content: '📷';
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 2rem;
  }
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${props => props.hasImage ? 'transparent' : '#B344E2'};
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 4px solid white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    &:after {
      opacity: 1;
    }
  }

  &:after {
    content: '사진 변경';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  color: #3A2618;
`;

const UserInfoItem = styled.div`
  margin: 0.8rem 0;
  font-size: 1.1rem;
  color: #555;
  display: flex;
  align-items: center;
  
  &:before {
    content: ${props => props.icon || "'•'"};
    margin-right: 0.8rem;
    font-size: 1.2rem;
  }
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 135, 255, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(79, 135, 255, 0.4);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #444;
  font-weight: 500;
  
  svg {
    margin-right: 1rem;
    color: #4F87FF;
  }
`;

const SettingAction = styled.div`
  display: flex;
  align-items: center;
`;

const SettingButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.danger ? '#FF5252' : '#4F87FF'};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const AppInfoSection = styled(SettingsSection)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VersionInfo = styled.div`
  font-size: 1.1rem;
  color: #666;
  
  span {
    font-weight: bold;
    color: #4F87FF;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  ${props => props.show && `
    opacity: 1;
    visibility: visible;
  `}
`;

const EditProfileForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  ${props => props.show && css`
    opacity: 1;
    visibility: visible;
    animation: ${scaleUp} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 30px;
    z-index: -1;
    background: linear-gradient(45deg, 
      #FF5252, #4F87FF, #FFD600, #4AD66D, 
      #B344E2
    );
    opacity: 0.3;
    filter: blur(15px);
  }
`;

const FormTitle = styled.h3`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.8rem;
  color: #3A2618;
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const InputLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #4F87FF;
    box-shadow: 0 0 0 2px rgba(79, 135, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const FormButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(FormButton)`
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const SubmitButton = styled(FormButton)`
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  box-shadow: 0 4px 15px rgba(79, 135, 255, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(79, 135, 255, 0.4);
  }
`;

const FriendsSection = styled.div`
  margin-top: 2rem;
`;

const FriendList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const FriendCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FriendAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.color || '#4F87FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const FriendInfo = styled.div`
  flex: 1;
`;

const FriendName = styled.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #333;
`;

const FriendStatus = styled.div`
  font-size: 0.85rem;
  color: #777;
`;

const FriendActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const FriendActionButton = styled.button`
  background: none;
  border: none;
  font-size: 0.85rem;
  color: ${props => props.danger ? '#FF5252' : '#666'};
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${props => props.danger ? '#FF0000' : '#4F87FF'};
  }
`;

// Component
const MyPage = ({ onNavigate }) => {
  const fileInputRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHoveringNotifications, setIsHoveringNotifications] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    { date: 'Apr 28', content: 'You completed your "Evening yoga" task.', unread: true },
    { date: 'Apr 27', content: 'You became friends with Lisa.', unread: true },
    { date: 'Apr 25', content: 'You completed 3 tasks today!', unread: false },
    { date: 'Apr 23', content: 'Tom shared a todo with you.', unread: false },
    { date: 'Apr 21', content: 'You completed your "Send project proposal" task.', unread: false }
  ]);
  
  const [userData, setUserData] = useState({
    name: 'Sarah Kim',
    email: 'sarah.kim@example.com',

    joinDate: 'April 12, 2024',
    profileImage: null
  });
  
  // Sample friends data
  const friends = [
    { id: 1, name: 'Tom', status: 'Active 2h ago', color: '#FF5252' },
    { id: 2, name: 'Lisa', status: 'Active now', color: '#4F87FF' },
    { id: 3, name: 'Jack', status: 'Active 1d ago', color: '#FFD600' },
    { id: 4, name: 'Emma', status: 'Active 5h ago', color: '#4AD66D' },
    { id: 5, name: 'Mike', status: 'Active now', color: '#B344E2' }
  ];
  
  const handleEditProfile = () => {
    setShowEditModal(true);
  };
  
  const handleCloseModal = () => {
    setShowEditModal(false);
  };
  
  const handleSaveChanges = () => {
    // Save changes logic would go here
    setShowEditModal(false);
  };
  
  const handleLogout = () => {
    // Logout logic would go here
    alert('Logging out...');
  };
  
  const handleRemoveFriend = (id) => {
    // Remove friend logic would go here
    alert(`Removing friend with ID: ${id}`);
  };
  
  const handleBlockFriend = (id) => {
    // Block friend logic would go here
    alert(`Blocking friend with ID: ${id}`);
  };

  // Check if there are unread notifications
  const hasUnreadNotifications = notifications.some(notification => notification.unread);
  
  // Handle notifications button hover
  const handleNotificationsHover = () => {
    setIsHoveringNotifications(true);
    setShowNotifications(true);
  };
  
  // Handle notifications button leave
  const handleNotificationsLeave = () => {
    setIsHoveringNotifications(false);
  };
  
  // Handle notifications button click
  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };
  
  // Handle close notifications
  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <>
      <BackgroundAnimation />
      <PageContainer>
        <MainCard>
          <Header>
            <Logo>Todooungi</Logo>
            <NavMenu>
              <NavButton onClick={() => onNavigate && onNavigate('todo')}>Todos</NavButton>
              <NavButton 
                ref={notificationButtonRef}
                hasNotification={hasUnreadNotifications}
                onClick={handleNotificationsClick}
                onMouseEnter={handleNotificationsHover}
                onMouseLeave={handleNotificationsLeave}
              >
                Alram
                {showNotifications && (
                  <AlertPopup
                    show={showNotifications}
                    onClose={handleCloseNotifications}
                    isHovering={isHoveringNotifications}
                    notifications={notifications}
                    markAsRead={markAllNotificationsAsRead}
                  />
                )}
              </NavButton>
              <NavButton active>MyPage</NavButton>
            </NavMenu>
          </Header>
        
          <ProfileContainer>
            <SectionTitle>My Profile</SectionTitle>
            
            <ProfileSection>
              <ProfileImageContainer>
                <ProfileImage 
                  hasImage={!!userData.profileImage}
                  imageUrl={userData.profileImage}
                  onClick={handleImageClick}
                >
                  {!userData.profileImage && userData.name[0]}
                </ProfileImage>
                <HiddenFileInput
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </ProfileImageContainer>
              
              <ProfileInfo>
                <UserName>{userData.name}</UserName>
                <UserInfoItem icon="'📧'">
                  {userData.email}
                </UserInfoItem>
    
                <UserInfoItem icon="'🗓️'">
                  Joined: {userData.joinDate}
                </UserInfoItem>
                
                <EditButton onClick={handleEditProfile}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h6a.5.5 0 0 0 0-1h-6A1.5 1.5 0 0 0 1 2.5v11z"/>
                  </svg>
                  Edit My Info
                </EditButton>
              </ProfileInfo>
            </ProfileSection>
            
            <SectionTitle>Settings</SectionTitle>
            
            <SettingsSection>
              <SettingItem>
                <SettingLabel>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  Friend Management
                </SettingLabel>
                <SettingAction>
                  <SettingButton>Manage</SettingButton>
                </SettingAction>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                  Notification Settings
                </SettingLabel>
                <SettingAction>
                  <SettingButton>Configure</SettingButton>
                </SettingAction>
              </SettingItem>
              
              <SettingItem>
                <SettingLabel>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.5 1v7h1V1h-1z"/>
                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
                  </svg>
                  Logout
                </SettingLabel>
                <SettingAction>
                  <SettingButton danger onClick={handleLogout}>Logout</SettingButton>
                </SettingAction>
              </SettingItem>
            </SettingsSection>
            
            <SectionTitle>App Information</SectionTitle>
            
            <AppInfoSection>
              <VersionInfo>
                App Version: <span>1.0.3</span>
              </VersionInfo>
            </AppInfoSection>
            
            <FriendsSection>
              <SectionTitle>Friends</SectionTitle>
              <FriendList>
                {friends.map(friend => (
                  <FriendCard key={friend.id}>
                    <FriendAvatar color={friend.color}>
                      {friend.name[0]}
                    </FriendAvatar>
                    <FriendInfo>
                      <FriendName>{friend.name}</FriendName>
                      <FriendStatus>{friend.status}</FriendStatus>
                      <FriendActions>
                        <FriendActionButton danger onClick={() => handleRemoveFriend(friend.id)}>
                          Delete
                        </FriendActionButton>
                        <FriendActionButton onClick={() => handleBlockFriend(friend.id)}>
                          Block
                        </FriendActionButton>
                      </FriendActions>
                    </FriendInfo>
                  </FriendCard>
                ))}
              </FriendList>
            </FriendsSection>
          </ProfileContainer>
        </MainCard>
      </PageContainer>
      
      {/* Edit Profile Modal */}
      <ModalOverlay show={showEditModal} onClick={handleCloseModal}>
        <EditProfileForm 
          show={showEditModal} 
          onClick={(e) => e.stopPropagation()}
        >
          <FormTitle>
            Edit My Profile
          </FormTitle>
          
          <FormGroup>
            <InputLabel>Username</InputLabel>
            <TextInput 
              type="text" 
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
            />
          </FormGroup>
          
          <FormGroup>
            <InputLabel>Email</InputLabel>
            <TextInput 
              type="email" 
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
          </FormGroup>
          
          <FormGroup>
            <InputLabel>User ID</InputLabel>
            <TextInput 
              type="text" 
              value={userData.userId}
              onChange={(e) => setUserData({...userData, userId: e.target.value})}
              disabled
            />
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton onClick={handleCloseModal}>
              Cancel
            </CancelButton>
            <SubmitButton onClick={handleSaveChanges}>
              Save Changes
            </SubmitButton>
          </ButtonGroup>
        </EditProfileForm>
      </ModalOverlay>
    </>
  );
};

export default MyPage;