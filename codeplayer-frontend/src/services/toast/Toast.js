const { toast } = require("react-toastify");

let flag = false;

const notify = (type, message) => {
    if(flag == false) {
        flag = true;
        
        setTimeout(() => {
            flag = false;
        }, 2000);


        if (type === 'success') {
            toast.success(message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (type === 'danger') {
            toast.error(message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (type === 'warn') {
            toast.warn(message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }

        if (type === 'info') {
            toast.info(message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }
}

export default notify;