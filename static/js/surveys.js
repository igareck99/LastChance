async function sendData(data,url) {
    const response = await fetch(url, { //Сюда вставишь URL
        method: 'POST',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })

    return await response.json()
}

async function getSurveys(){
    const response = await fetch("survey_list/")//Сюда url для получения обследований
    return response.json()
}

async function drawSurveys(){
    let table = document.querySelector('table')
    table.innerHTML = '<tr id="beforeDelete">\n' +
        '\t\t\t\t\t<th class="first-column-th">№</th>\n' +
        '\t\t\t\t\t<th class="second-column-th">Название обследования</th>\n' +
        '\t\t\t\t\t<th class="third-column-th">Операции</th>\n' +
        '\t\t\t\t</tr>'
    await getSurveys()
        .then((data) => {
            for (let i = 0; i < data.length; i++){
                let raw = document.createElement('tr');
                let num = document.createElement('td'),
                    name = document.createElement('td'),
                    options = document.createElement('td')

                num.innerHTML = data[i].num;
                name.innerHTML = data[i].name;
                options = createDeleteButton(num.innerHTML);
                console.log(options.innerHTML)
                num.classList.add('first-column-th');
                name.classList.add('second-column-th');
                options.classList.add('third-column-th')
                raw.insertAdjacentElement('afterbegin', num);
                raw.insertAdjacentElement('beforeend', name);
                raw.insertAdjacentElement('beforeend', options);
                table.insertAdjacentElement('beforeend', raw)
            }
        })
}

function createDeleteButton(num){
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
        let deleteObject = {
                id: num
            }
            deleteObject = JSON.stringify(deleteObject)
        sendData(deleteObject,'delete_survey/').then(() => {  //url для удаления
            drawSurveys()
        })
    })
    return btn
}

document.addEventListener('DOMContentLoaded', () => {
    drawSurveys()
    let addSurvey = document.querySelector('#create');
    addSurvey.addEventListener('click', () => {
        let input = document.querySelector('#Name')
        input = input.value;
        let data = {
            name: input
        }
        sendData(JSON.stringify(data),'create_survey/')
            .then(()=>{
                drawSurveys()

            })

    })
})

let updateTimer = setInterval(drawSurveys, 600000)