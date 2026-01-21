import { motion } from "framer-motion";
import { FiMenu, FiUser, FiMoreVertical } from "react-icons/fi";
import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";
import { useSocket } from "../../context/SocketContext";

const ChatHeader = ({ activeChat, onToggleSidebar }) => {
  const { onlineUsers, typingUsers } = useSocket();

  const cardStyle = {
    padding: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "white",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    margin: 0,
  };

  const avatarContainerStyle = {
    position: "relative",
  };

  const avatarStyle = {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  };

  const userNameStyle = {
    color: "white",
    fontWeight: "600",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    margin: 0,
  };

  const statusTextStyle = {
    fontSize: "14px",
    margin: 0,
  };

  const menuButtonStyle = {
    padding: "8px",
    display: window.innerWidth < 768 ? "block" : "none",
  };

  const moreButtonStyle = {
    padding: "8px",
  };

  if (!activeChat) {
    return (
      <GlassCard style={cardStyle}>
        <div style={containerStyle}>
          <div style={leftSectionStyle}>
            <GlassButton
              onClick={onToggleSidebar}
              variant="secondary"
              size="small"
              style={menuButtonStyle}
            >
              <FiMenu size={20} />
            </GlassButton>
            <h1 style={titleStyle}>GlassChat</h1>
          </div>
        </div>
      </GlassCard>
    );
  }

  const isOnline = onlineUsers.has(activeChat.id);
  const isTyping = typingUsers.has(activeChat.id);

  const onlineIndicatorStyle = {
    position: "absolute",
    bottom: "-4px",
    right: "-4px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: isOnline ? "#10b981" : "#6b7280",
    boxShadow: isOnline ? "0 0 8px rgba(16, 185, 129, 0.5)" : "none",
  };

  return (
    <GlassCard style={cardStyle}>
      <div style={containerStyle}>
        <div style={leftSectionStyle}>
          <GlassButton
            onClick={onToggleSidebar}
            variant="secondary"
            size="small"
            style={menuButtonStyle}
          >
            <FiMenu size={20} />
          </GlassButton>

          <div style={avatarContainerStyle}>
            <div style={avatarStyle}>
              {activeChat.avatar ? (
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <FiUser color="white" size={20} />
              )}
            </div>

            {/* Online indicator */}
            <div style={onlineIndicatorStyle} />
          </div>

          <div>
            <h2 style={userNameStyle}>{activeChat.name}</h2>
            <motion.p
              key={isTyping ? "typing" : "status"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                ...statusTextStyle,
                color: isTyping
                  ? "#60a5fa"
                  : isOnline
                  ? "#34d399"
                  : "rgba(255, 255, 255, 0.6)",
              }}
            >
              {isTyping ? (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span>typing</span>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                </span>
              ) : isOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </motion.p>
          </div>
        </div>

        <GlassButton variant="secondary" size="small" style={moreButtonStyle}>
          <FiMoreVertical size={20} />
        </GlassButton>
      </div>
    </GlassCard>
  );
};

export default ChatHeader;
