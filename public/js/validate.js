const getCookie = (cookie_name) => {
    // Construct a RegExp object as to include the variable name
    const re = new RegExp(`(?<=${cookie_name}=)[^;]*`);
    console.log(cookie_name)
    try {
        if (document.cookie.match(re)[0]) {
            console.log("True")
            return true // Will raise TypeError if cookie is not found
        }
    } catch {
        console.log("False")
        return false
    }
}

(
    function islogged() {
        // console.log(getCookie('User_Session'))
        if (getCookie('Sessioonnnnn')) {
            document.getElementById('signup').style.display = 'none'
        } else {
            document.getElementById('logout').style.display = 'none'
        }
    }
)();