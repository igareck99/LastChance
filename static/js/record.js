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

async function getData(url){ //Короче здесь ты должен вернуть мне список ФИО, список обследований
    console.log(url)
    const response = await fetch(url)
    return response.json()
}

async function getList(list){
    let surveys = document.querySelector('#Survey');
    if (list === 'fio'){
        let patients = document.querySelector('#Name');
        patients.innerHTML = '';
        getData('get_fio/')//Сюда закинь url для фио
            .then((fioList) => {
                console.log(fioList)
                for (let i = 0; i < fioList.length; i++){
                    let item = document.createElement('option')
                    item.value = fioList[i].name;
                    item.innerHTML = fioList[i].name;
                    patients.insertAdjacentElement('beforeend', item)
                }
            })

    }else if (list ==='survey'){
        let surveys = document.querySelector('#Survey');
        surveys.innerHTML = '';
        getData('get_survey/')//Сюда закинь url для обследований
            .then((surveyList) => {
                console.log(surveyList)
                for (let i = 0; i < surveyList.length; i++){
                    let item = document.createElement('option')
                    item.value = surveyList[i].name;
                    item.innerHTML = surveyList[i].name;
                    surveys.insertAdjacentElement('beforeend', item)
                }
            })

    }
}

function createDeleteButton(num){
        let div = document.createElement('div')

        let btnDelete = document.createElement('button');
        let btnDone = document.createElement('button');
        let btnCancel = document.createElement('button');
        btnDelete.style.height = '20px';
        btnDelete.style.width = '70px';
        btnDelete.style.background = 'none';
        btnDelete.innerHTML = 'Удалить';
        btnDelete.style.border = '1px solid white';
        btnDelete.style.textAlign = 'center';
        btnDelete.style.margin = '0 auto';
        btnDelete.style.color = 'white';
        btnDelete.addEventListener('click', () => {

            sendData(num,'delete_record/').then(()=>{
                drawRecords()
            })
        })

        btnDone.style.height = '20px';
        btnDone.style.width = '70px';
        btnDone.style.background = 'none';
        btnDone.innerHTML = 'Сделано';
        btnDone.style.border = '1px solid white';
        btnDone.style.textAlign = 'center';
        btnDone.style.margin = '0 auto';
        btnDone.style.color = 'white';
        btnDone.addEventListener('click', () => {

            sendData(num,'done_record/').then(()=>{
                drawRecords()
            })
        })

        btnCancel.style.height = '20px';
        btnCancel.style.width = '70px';
        btnCancel.style.background = 'none';
        btnCancel.innerHTML = 'Отмена';
        btnCancel.style.border = '1px solid white';
        btnCancel.style.textAlign = 'center';
        btnCancel.style.margin = '0 auto';
        btnCancel.style.color = 'white';
        btnCancel.addEventListener('click', () => {

            sendData(num,'cancel_record/').then(()=>{
                drawRecords()
            })
        })

        div.insertAdjacentElement('beforeend', btnDone)
        div.insertAdjacentElement('beforeend', btnCancel)
        div.insertAdjacentElement('beforeend', btnDelete)

        return div
}


async function drawRecords(){
    let table = document.querySelector('table')
    table.innerHTML = '<tr id="beforeDelete">\n' +
        '\t\t\t\t\t<th class="first-column-th">№</th>\n' +
        '\t\t\t\t\t<th class="second-column-th">ФИО</th>\n' +
        '\t\t\t\t\t<th class="third-column-th">Мед карта</th>\n' +
        '\t\t\t\t\t<th class="fourth-column-th">Обследование</th>\n' +
        '\t\t\t\t\t<th class="fifth-column-th">Дата обследования</th>\n' +
        '\t\t\t\t\t<th class="sixth-column-th">Статус</th>\n'+
        '\t\t\t\t\t<th class="seven-column-th">Операции</th>\n' +
        '\t\t\t\t</tr>'
    await getData('record_list/').then((data)=>{
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            let raw = document.createElement('tr');
            let num = document.createElement('td'),
                fio = document.createElement('td'),
                card = document.createElement('td'),
                survey = document.createElement('td'),
                surveyDate = document.createElement('td'),
                status = document.createElement('td'),
                options = document.createElement('td')

            num.innerHTML = data[i].num;
            fio.innerHTML = data[i].fio;
            card.innerHTML = data[i].card;
            survey.innerHTML = data[i].survey;
            status.innerHTML = data[i].status;
            surveyDate.innerHTML = data[i].surveyDate;

            options = createDeleteButton(num.innerHTML);
            num.classList.add('first-column-th');
            fio.classList.add('second-column-th');
            card.classList.add('third-column-th');
            survey.classList.add('fourth-column-th');
            surveyDate.classList.add('fifth-column-th');
            options.classList.add('seven-column-th')
            raw.insertAdjacentElement('afterbegin', num);
            raw.insertAdjacentElement('beforeend', fio);
            raw.insertAdjacentElement('beforeend', card);
            raw.insertAdjacentElement('beforeend', survey);
            raw.insertAdjacentElement('beforeend', surveyDate);
            raw.insertAdjacentElement('beforeend', status);
            raw.insertAdjacentElement('beforeend', options);
            table.insertAdjacentElement('beforeend', raw)
        }
        })

}


document.addEventListener('DOMContentLoaded', () => {
    console.log(1)
    drawRecords().then(() =>{
        getList('fio').then(() =>{
            getList('survey')
        })
    })
    let addRecord = document.querySelector('#add-record');
    addRecord.addEventListener('click', () => {
        let fio = document.querySelector('#Name')
        let survey = document.querySelector('#Survey')
        let date = document.querySelector('#date')
        let data = {
            fio: fio.value,
            survey: survey.value,
            date: date.value
        }
        data = JSON.stringify(data)
        sendData(data,'create_record/').then(()=>{
            drawRecords()
        })

    })


})

let updateTimer = setInterval(()=>{
    drawRecords().then(() =>{
        getList('fio').then(() =>{
            getList('survey')
        })
    })
}, 600000)