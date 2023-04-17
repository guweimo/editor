
class Editor extends GuaObject {
    static inputValue(event) {
        let target = event.target
        let content = target.innerText
        let lines = content.split('\n')
        let line = lines[0].split(' ')
        let t = []
        for (const string of line) {
            if (string === 'const') {
                t.push('<span>${string}</span>')
            } else {
                t.push(string)
            }
        }
        log(event)
        let lineTemplate = `<div>${t.join(' ')}</div>`
        // target.innerHTML = lineTemplate
    }

    draw() {

    }

    update() {

    }
}

class ActionEditor extends Action {
    static eventActions = {
        'keydown': {
            'inputValue': Editor.inputValue,
        },
    }
}


const __main = function() {
    ActionEditor.bindEvent()
}

__main()
