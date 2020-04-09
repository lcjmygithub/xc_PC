export default function log(l) {
    console.log(l);
}
/*-----------------cookie---------------------*/
/*设置cookie*/
export function setCookie(name, value, day) {
    let setting = arguments[0];
    if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (let i in setting) {
            let oDate = new Date();
            oDate.setDate(oDate.getDate() + day);
            document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
        }
    } else {
        let oDate = new Date();
        oDate.setDate(oDate.getDate() + day);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    }
}
/*获取cookie*/
export function getCookie(name) {
    let arr = document.cookie.split('; ');
    for (let i = 0; i < arr.length; i++) {
        let arr2 = arr[i].split('=');
        if (arr2[0] == name) {
            return arr2[1];
        }
    }
    return '';
}
/*删除cookie*/
export function removeCookie(name) {
    setCookie(name, 1, -1);
}
/*-----------------localStorage---------------------*/
/*设置localStorage*/
export function setLocal(key, val) {
    let ls = window.localStorage;
    // let setting = arguments[0];
    // if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
    //     for (let i in setting) {
    //         ls.setItem(i, JSON.stringify(setting[i]))
    //     }
    // } else {
    let allLoacl = getLocal("allLoacl");
    if (allLoacl == null) {
        let nullObj = {};
        nullObj[key] = val;
        ls.setItem("allLoacl", JSON.stringify(nullObj))
    }
    else {
        allLoacl[key] = val;
        ls.setItem("allLoacl", JSON.stringify(allLoacl));
    }
    // }
}
/*获取localStorage*/
export function getLocal(key) {
    let ls = window.localStorage;
    try {
        if (key === "allLoacl") {
            let data = JSON.parse(ls.getItem(key));
            return data;
        } else {
            let data = JSON.parse(ls.getItem("allLoacl"));
            return data[key];
        }
    } catch (error) {
        return null;
    }


}
/*移除localStorage*/
export function removeLocal(key) {
    let ls = window.localStorage;
    ls.removeItem(key)
}
/*移除所有localStorage*/
export function clearLocal() {
    // let ls = window.localStorage;
    // ls.clear()
}
/*-----------------sessionStorage---------------------*/
/*设置sessionStorage*/
export function setSession(key, val) {
    let ss = window.sessionStorage;
    let setting = arguments[0];
    if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (let i in setting) {
            ss.setItem(i, JSON.stringify(setting[i]))
        }

    } else {
        ss.setItem(key, JSON.stringify(val))
    }
}
/*获取sessionStorage*/
export function getSession(key) {
    let ss = window.sessionStorage;
    if (key) return JSON.parse(ss.getItem(key))
    return null;
}
/*移除sessionStorage*/
export function removeSession(key) {
    let ss = window.sessionStorage;
    ss.removeItem(key)
}
/*移除所有sessionStorage*/
export function clearSession() {
    let ss = window.sessionStorage;
    ss.clear()
}
