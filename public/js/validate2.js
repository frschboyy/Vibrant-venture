const getCookie = (cookie_name) => {
    // Construct a RegExp object as to include the variable name
    const re = new  RegExp(`(?<=${cookie_name}=)[^;]*`);
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
    function isAdmin() {
        const cookieOB = JSON.parse(getCookie('Sessioonnnnn'))
        const userEmail = cookieOB.user.email
        const adminEmail = 'admin214@usiu.ac.ke';
        if (getCookie('Sessionnnnn')){
            document.getElementById('signup').style.display = 'none'
            if (userEmail === adminEmail) {
                document.getElementById('booking').style.display = 'none'
            } else {
                document.getElementById('report').style.display = 'none'
            }
        }
        else {
            document.getElementById('logout').style.display = "none"
            document.getElementById('report').style.display = "none"
        }
    }
)()

