
import PopupMenu from './PopupMenu.jsx';

let popupMenuInstance = 0;
let getPopupMenuInstance = (props) => {
  popupMenuInstance = PopupMenu.newInstance(props);
  return popupMenuInstance;
};
export default {
  open (props) {
    getPopupMenuInstance(props);
  },
  close () {
    if (popupMenuInstance) {
      popupMenuInstance.destroy();
      popupMenuInstance = null;
    }
  },
};
