import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
`;

const Popup = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  transform-origin: top right;
  animation: ${props => props.show ? fadeIn : fadeOut} 0.3s forwards;
  border: 1px solid rgba(255, 255, 255, 0.8);
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    right: 20px;
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 0.95);
    transform: rotate(45deg);
    border-top: 1px solid rgba(255, 255, 255, 0.8);
    border-left: 1px solid rgba(255, 255, 255, 0.8);
  }
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const PopupTitle = styled.h3`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.3rem;
  color: #3A2618;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #777;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #333;
  }
`;

const NotificationList = styled.div`
  max-height: 350px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(180, 180, 180, 0.5);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 10px;
  }
`;

const NoNotifications = styled.div`
  padding: 2rem;
  text-align: center;
  color: #777;
  font-style: italic;
`;

const Notification = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: default;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const NotificationDate = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.3rem;
`;

const NotificationContent = styled.div`
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
`;

const UnreadDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #FF5252;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  top: -1px;
`;

// AlertPopup Component
const AlertPopup = ({ show, onClose, isHovering, notifications, markAsRead }) => {
  const popupRef = useRef(null);
  
  useEffect(() => {
    if (show) {
      // Mark all notifications as read when popup is opened
      markAsRead();
    }
  }, [show, markAsRead]);
  
  // Handler for clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && !isHovering && show) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isHovering, show]);
  
  return (
    <Popup ref={popupRef} show={show}>
      <PopupHeader>
        <PopupTitle>Notifications</PopupTitle>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </PopupHeader>
      
      <NotificationList>
        {notifications.length === 0 ? (
          <NoNotifications>No notifications yet</NoNotifications>
        ) : (
          notifications.map((notification, index) => (
            <Notification key={index}>
              <NotificationDate>
                {notification.unread && <UnreadDot />}
                {notification.date}
              </NotificationDate>
              <NotificationContent>
                {notification.content}
              </NotificationContent>
            </Notification>
          ))
        )}
      </NotificationList>
    </Popup>
  );
};

export default AlertPopup;