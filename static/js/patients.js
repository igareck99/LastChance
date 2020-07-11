const create = document.querySelector('#create')

async function getData(url){ //Короче здесь ты должен вернуть список пациентов
    const response = await fetch(url)
    return response.json()
}

getData('patients_update/')
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            let newObject = {
                number: data[i].number,
                FIO: data[i].FIO,
                date: data[i].date,
                card: data[i].card,
                operation: '',
            }
            console.log(newObject)
            pateintsTable.push(newObject)
        }

    })//URL


let pateintsTable = [

]


async function sendData(data,url) {
    const response = await fetch(url, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    return await response.json()
}

function drawTable(check = false, table) {
    console.log(pateintsTable)
    if (check === false) {
        table.innerHTML = '<tr id="beforeDelete">\n' +
            '\t\t\t\t\t\t<th class="first-column-th">№</th>\n' +
            '\t\t\t\t\t\t<th class="second-column-th">ФИО</th>\n' +
            '\t\t\t\t\t\t<th class="third-column-th">Мед карта</th>\n' +
            '\t\t\t\t\t\t<th class="fourth-column-th">Дата записи</th>\n' +
            '<th class="fifth-column-th">Операции</th>' +
            '\t\t\t\t\t</tr>';
    }
    for (let i = 0; i < pateintsTable.length; i++) {
        let row = document.createElement('tr');
        let number = document.createElement('td'),
            FIO = document.createElement('td'),
            nowTime = document.createElement('td'),
            card = document.createElement('td'),
            btn = document.createElement('td');
        number.innerHTML = pateintsTable[i].number;
        FIO.innerHTML = pateintsTable[i].FIO;
        nowTime.innerHTML = pateintsTable[i].date;
        card.innerHTML = pateintsTable[i].card;
        pateintsTable[i].operation = createButton(pateintsTable[i].number, table);
        btn = pateintsTable[i].operation;
        number.classList.add('first-column');
        FIO.classList.add('second-column');
        nowTime.classList.add('third-column');
        card.classList.add('fourth-column');
        btn.classList.add('fifth-column');
        row.insertAdjacentElement("afterbegin", number);
        row.insertAdjacentElement('beforeend', FIO);
        row.insertAdjacentElement('beforeend', card)
        row.insertAdjacentElement('beforeend', nowTime);
        row.insertAdjacentElement('beforeend', btn);
        table.insertAdjacentElement('beforeend', row)
    }
}

function refreshTable() {
    for (let i = 0; i < pateintsTable.length; i++) {
        pateintsTable[i].number = i + 1;
    }
}


function createButton(number, table) {
    let btn = document.createElement('button');
    btn.style.height = '20px';
    btn.style.width = '70px';
    btn.style.background = 'none';
    btn.innerHTML = 'Удалить';
    btn.style.border = '1px solid white';
    btn.style.textAlign = 'center';
    btn.style.marginLeft = '40px';
    btn.style.color = 'white';
    btn.addEventListener('click', () => {
        pateintsTable.splice(number - 1, 1);
        refreshTable()
        sendData(number,'delete_man/').then(()=>{
            drawTable(false, table)
        })

    })
    return btn
}

document.addEventListener('DOMContentLoaded', () => {

    let table = document.querySelector('table'),
        createPatient = document.querySelector('#create');


    setTimeout(()=>{drawTable(true, table)}, 1000)

    createPatient.addEventListener('click', () => {
        let newPatient = {};
        let fio = document.querySelector('#FIO');
        let card = document.querySelector('#card')
        let date = new Date();
        let tableDate = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

        newPatient.number = pateintsTable.length + 1;
        newPatient.FIO = fio.value;
        newPatient.card = card.value;
        newPatient.date = tableDate;
        newPatient.operation = createButton(newPatient.number)
        pateintsTable.push(newPatient)
        refreshTable()
        drawTable(false, table)
    })

    create.addEventListener('click', () => {
        let fio = document.querySelector('#FIO')
        let cardNumber = document.querySelector('#card')
        let data = {
            fio: fio.value,
            cardNumber: cardNumber.value
        }
        data = JSON.stringify(data);
        sendData(data)
    })

})

let updateTimer = setInterval(drawTable, 600000)
