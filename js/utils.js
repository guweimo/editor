const log = console.log.bind(console)

const e = (sel) => document.querySelector(sel)

const es = (sel) => document.querySelectorAll(sel)

const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)

const bindEvent = (element, eventName, callback) => {
    element = e(element)
    element.addEventListener(eventName, callback)
}

const formatTime = (t) => {
    // format unix timestamp to string
    let d = new Date(t * 1000)
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    return `${year}-${month}-${day}`
}

const ajax = (method, path, data, responseCallback) => {
    let a = new XMLHttpRequest()
    a.open(method, path, true)
    a.setRequestHeader('Content-Type', 'application/json')
    a.send(JSON.stringify(data))
    a.onreadystatechange = () => {
        if (a.readyState === 4) {
            let response = JSON.parse(a.response)
            let data = response.data
            log('reponse', response)
            // 判断返回是否出错，出错就弹出信息提示
            if (response.message !== 'success') {
                MessageContainer.addMessage(false, response.message)
            } else if (!data.success) {
                MessageContainer.addMessage(data.success, data.message)
            }
            responseCallback(response.data)
        }
    }
}

class GuaObject {
    static new(...args) {
        return new this(...args)
    }

    update() {

    }

    draw() {

    }
}
