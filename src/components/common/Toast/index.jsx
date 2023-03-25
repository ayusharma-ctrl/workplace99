import { Store } from "react-notifications-component";

//this is just a function not a component
const toast = (message, type, duration=3000) => {
  Store.addNotification({
    title:type,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: duration,
      onScreen: true,
    },
  });
};

export default toast;