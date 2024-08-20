/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {

  template = document.querySelector('#taskTemplate').content
  container = document.querySelector('.tickets__container')

  constructor({name, description, status, created}) {
    this.date = new Date(created)
    this.element = this.template.querySelector('.container').cloneNode(true)
    this.name = this.element.querySelector('.tasks')
    this.descriptionText = this.element.querySelector('.description')
    this.name.textContent = name
    this.descriptionText.textContent = description
    this.element.querySelector('.date').textContent = `
      ${this.setDate(this.date.getDay())}.${this.setDate(this.date.getMonth())}.${this.setDate(this.date.getFullYear())} 
      ${this.setDate(this.date.getHours())}:${this.setDate(this.date.getMinutes())}
    `
    this.btnRemove = this.element.querySelector('.deleteTickets')
    this.description = this.element.querySelector('.deskriptions')
    this.btnEdit = this.element.querySelector('.changeTickets')
    this.statusElement = this.element.querySelector('.checkbox')
    this.statusElement.checked = status
    this.container.append(this.element)
  }

  setTicket({name, description, status}) {
    this.statusElement.checked = status
    this.name.textContent = name
    this.descriptionText = description
  }

  setDate(number){
    if(('' + number).length > 1){
      return number
    } else {
      return '0' + number
    }
  }


}
