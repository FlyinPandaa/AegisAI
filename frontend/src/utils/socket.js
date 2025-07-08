// const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws";

// export function openSocket(onMessage, onOpen, onClose, onError) {
//   const socket = new WebSocket(WS_URL);
//   if (onOpen)    socket.addEventListener("open",    onOpen);
//   if (onMessage) socket.addEventListener("message", onMessage);
//   if (onClose)   socket.addEventListener("close",   onClose);
//   if (onError)   socket.addEventListener("error",   onError);
//   return socket;
// }

// const WS_URL =
//   process.env.REACT_APP_WS_URL ||
//   `ws://${window.location.hostname}:8000/ws`;

export function openSocket(onMessage, onOpen, onClose, onError, delay = 500) {
  let socket;
  const connect = () => {
    socket = new WebSocket(process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws");
    if (onOpen) socket.addEventListener("open", onOpen);
    if (onMessage) socket.addEventListener("message", onMessage);
    if (onClose)   socket.addEventListener("close",   onClose);
    if (onError)   socket.addEventListener("error",   onError);
  };

  setTimeout(connect, delay);
  return {
    close: () => socket && socket.close(),
  };
}

