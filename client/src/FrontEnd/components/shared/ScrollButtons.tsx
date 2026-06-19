import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import './ScrollButtons.css';

interface ScrollButtonsProps {
  containerId?: string; // Scroll container ID, uses window if not provided
  threshold?: number; // Scroll threshold for showing buttons (pixels)
}

const ScrollButtons: React.FC<ScrollButtonsProps> = ({
  containerId,
  threshold = 100
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => {
    const scrollContainer = containerId
      ? document.getElementById(containerId)
      : window;

    const checkScrollPosition = () => {
      let scrollTop: number;
      let scrollHeight: number;
      let clientHeight: number;

      if (containerId) {
        const element = document.getElementById(containerId);
        if (!element) return;
        scrollTop = element.scrollTop;
        scrollHeight = element.scrollHeight;
        clientHeight = element.clientHeight;
      } else {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      }

      // Show "back to top" button (show when not at top)
      setShowScrollTop(scrollTop > threshold);

      // Show "scroll to bottom" button (show when not at bottom)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      setShowScrollBottom(!isNearBottom);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [containerId, threshold]);

  const scrollToTop = () => {
    if (containerId) {
      const element = document.getElementById(containerId);
      element?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (containerId) {
      const element = document.getElementById(containerId);
      if (element) {
        element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="scroll-buttons-container">
      {showScrollTop && (
        <Button
          className="scroll-button scroll-button-top"
          shape="circle"
          size="large"
          icon={<UpOutlined />}
          onClick={scrollToTop}
          title="Back to top"
        />
      )}
      {showScrollBottom && (
        <Button
          className="scroll-button scroll-button-bottom"
          shape="circle"
          size="large"
          icon={<DownOutlined />}
          onClick={scrollToBottom}
          title="Scroll to bottom"
        />
      )}
    </div>
  );
};

export default ScrollButtons;
