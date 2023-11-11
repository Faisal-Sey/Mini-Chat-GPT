import {resetUserData} from "../Redux/slices/userSlice";
import store from "../redux/store";

export const getUserData = () => {
    return store.getState().user;
};

export const resetUserInfo = () => {
    store.dispatch(resetUserData());
};


export const isRequiredFieldValuesPassed = (obj, fields, type) => {
    if (type === "eq") {
        Object.values(obj).every((elt) => elt !== "");
        return (
            fields.every((elt) => Object.keys(obj).includes(elt)) &&
            Object.values(obj).every((elt) => elt !== "")
        );
    }

    return false;
};

// Format Date
export const formatDate = (date) => {
    if (date) {
        const newDate = new Date(date);
        const monthStr = `${newDate}`.split(" ")[1];
        return monthStr + " " + newDate.getDate() + ", " + newDate.getFullYear();
    }

    return "Not specified";
};


// Title words
String.prototype.titleWords = function () {
    return this.split(" ").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}
