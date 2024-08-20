import HelpDesk from './HelpDesk';
import createRequest from './api/createRequest';
import TicketView from './TicketView'
import Ticket from './Ticket';
const root = document.getElementById('root');
const modalEdit = document.querySelector('.changeTicketsModal')
const deleteTicketsModal = document.querySelector('.deleteTicketsModal')
const addTicketsModal = document.querySelector('.addTicketsModal')
const addTicketsBtn = document.querySelector(".addTickets")
const closeBtns = document.querySelectorAll('.btnModal-no')
const formNewTicket = addTicketsModal.querySelector('form')
const btnDeleteModal = deleteTicketsModal.querySelector('.ok')
const editForm = modalEdit.querySelector('form')
const app = new HelpDesk(root);

// Данные приложения
const appData = {
    ticketData : null,
    tickets : null,
    deleteId : null,
    deleteTicketElement : null,
    editId : null,
}

// Добавление нового тикета со слушателями
function addNewTicket(item){
    const viewTicket = new TicketView(item)
    // слушатель на кнопку удаления тикета
    viewTicket.btnRemove.addEventListener('click', () => {
        // сделать открытие модального окна с удалением
        deleteTicketsModal.classList.add('modal-active')
        appData.deleteId = item.id
        appData.deleteTicketElement = viewTicket.element
    })
    // слушатель на кнопку editBtn у каждого тикета
    viewTicket.btnEdit.addEventListener('click', () => {
        modalEdit.classList.add('modal-active')
        const {name, description} = editForm.elements
        name.value = item.name
        description.value = item.description
        appData.editViewTicket = viewTicket
        appData.editId = item.id
    })
    // смена статуса чекбокса
    viewTicket.statusElement.addEventListener('change', () => {
        editTicket.open('POST',`http://localhost:7070/?method=updateById&id=${item.id}`)
        editTicket.send(JSON.stringify({...item, status: !item.status}))
    })
    // открытие тикета
    viewTicket.description.addEventListener('click', () => {
        viewTicket.element.classList.toggle('container-active')
    })
    return viewTicket
}

// получение тикетов с сервера 
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://localhost:7070/?method=allTickets') // настройки запроса
xhr.send() // отправка запроса
xhr.addEventListener('load', () => { // загрузка ответа
    if (xhr.status >= 200 && xhr.status < 300) {
        try {
            const data = JSON.parse(xhr.responseText);
            appData.ticketData = data.map(item => new Ticket(item))
            appData.tickets = appData.ticketData.map(addNewTicket)
          
        } catch (e) {
            console.error(e);
        }
    }
});

// создание нового тикета на сервере
const createTicket = new XMLHttpRequest()
createTicket.open('POST', 'http://localhost:7070/?method=createTicket')
createTicket.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(createTicket.responseText);
        appData.ticketData.push(new Ticket(data))
        appData.tickets.push(addNewTicket(data))
    }
})
formNewTicket.addEventListener('submit', (e) => {
    e.preventDefault()
    const { name, description } = formNewTicket.elements
    createTicket.send(JSON.stringify({name: name.value, description: description.value}))
    formNewTicket.reset()
    addTicketsModal.classList.remove('modal-active')
})

// изменение существующего тикета на сервере
const editTicket = new XMLHttpRequest()
editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const { name, description } = editForm.elements
    editTicket.open('POST',`http://localhost:7070/?method=updateById&id=${appData.editId}`)
    editTicket.send(JSON.stringify({name: name.value, description: description.value}))
    modalEdit.classList.remove('modal-active')
})
editTicket.addEventListener('load', () => {
    if (editTicket.status >= 200 && editTicket.status < 300) {
        const data = JSON.parse(editTicket.responseText);
        appData.tickets.forEach(item => item.element.remove())
        appData.ticketData = data.map((data) => new Ticket(data))
        appData.tickets = appData.ticketData.map(addNewTicket)
    }
})

// удаление тикета на сервере
const deleteTicket = new XMLHttpRequest()
btnDeleteModal.addEventListener('click', () => {
    deleteTicket.open('POST',`http://localhost:7070/?method=deleteById&id=${appData.deleteId}`)
    deleteTicket.send()
})
deleteTicket.addEventListener('load', () => {
    appData.deleteTicketElement.remove()
    deleteTicketsModal.classList.remove('modal-active')
})

// открытие формы нового тикета
addTicketsBtn.addEventListener("click", ()=>{
    addTicketsModal.classList.add('modal-active')
})

// закрытие всех модальных окон на кнопку отмена
closeBtns.forEach(btn => btn.addEventListener('click', () => {
    btn.closest('.modal').classList.remove('modal-active')
}))

export default app
