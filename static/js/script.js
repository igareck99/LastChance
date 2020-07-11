window.addEventListener('DOMContentLoaded', () =>{
    let form = document.querySelector('form'),
        submit = document.getElementById('submit'),
        login = document.getElementById('login');


    submit.addEventListener('click', (event) =>{
        event.preventDefault();
        let check = checkLogin();
        if (check === true){
            location.href = 'P'
        }else{
            alert('Wrong email')
        }

    })

    let checkLogin = () => {
        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(login.value) === false){
            return false
        }else{
            return true
        }
    }
})
